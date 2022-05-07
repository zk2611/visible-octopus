import React, { useCallback, useState, useEffect, useRef } from "react";
import { Radio, Input, RadioChangeEvent, message, Switch } from 'antd';
import CreateEventModal from "./CreateEventModal";
import { useModal } from "./useModal";
import { BASE_URL } from "../const";
import { addEvent } from "../api";

const OCT_MODE_OPTIONS = [
  { label: '埋点模式', value: 'octopus' },
  { label: '浏览模式', value: 'browse' },
];

const Octopus = () => {
  // 选择模式
  const [octMode, setOctMode] = useState<string>('octopus');
  const handleOctModeChange = useCallback((e: RadioChangeEvent) => { setOctMode(e.target.value); }, []);

  // 填写目标网址
  const [targetUrl, setTargetUrl] = useState<string>('http://localhost:3001/');
  const handleUrlSearch = useCallback((val: string) => {
    setIsIframeLoaded(false);
    setTargetUrl(val);
  }, []);

  const [selectedEl, setSelectedEl] = useState(null);
  useEffect(() => {
    function receiveMessage (e: MessageEvent) {
      if (e.origin === "http://localhost:3000") return;
      if (e.data && typeof e.data === 'object' && 'logData' in e.data) {
        // message.info(JSON.stringify(e.data.logData));
        console.log(e.data.logData.xpath)
        openModal({ xpath: e.data.logData.xpath });
      }
    }
    window.addEventListener('message', receiveMessage);
    return function cleanup() {
      window.removeEventListener('message', receiveMessage);
    };
  }, []);

  const [isHighlightEl, setIsHighlightEl] = useState<boolean>(false);
  const handleHighlightCheck = useCallback((isCheck: boolean) => { setIsHighlightEl(isCheck); }, []);

  // postMessage跨域通信，注意：需要等待iframe加载完毕之后再调用postMessage
  const iframeEl = useRef<HTMLIFrameElement>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const handleIframeLoad = useCallback(() => { setIsIframeLoaded(true); }, []);
  useEffect(() => {
    if (!octMode || !iframeEl || !targetUrl || !isIframeLoaded) return;
    console.log('start')
    const receiver = iframeEl?.current?.contentWindow;
    receiver && receiver.postMessage({ mode: octMode, highlight: isHighlightEl }, targetUrl);
  }, [octMode, targetUrl, isHighlightEl, isIframeLoaded]);

  
  const { modalVisible, closeModal, openModal, initialValues } = useModal();
  const handleCreateEventOk = useCallback(async (values) => {
    console.log('values', values);
    const res = await addEvent(values);
    console.log('res', res);
    const { code, msg } = res;
    if (code === 200) {
      message.success('新建事件成功');
      closeModal();
    } else {
      message.error(msg.toString() || '新建事件失败')
    }
  }, []);


  return (<>
    <CreateEventModal initialValues={initialValues} visible={modalVisible} onOk={handleCreateEventOk} onCancel={closeModal} />

    <div style={{padding: '1rem', display: 'flex', flexDirection: 'column', height: '100vh'}}>
      <h1>可视化埋点</h1>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{flex: 1, display: 'flex'}}>
          <Radio.Group optionType="button" buttonStyle="solid" options={OCT_MODE_OPTIONS} onChange={handleOctModeChange} value={octMode} />
          <Input.Search defaultValue={targetUrl} style={{width: 500, marginLeft: '.5rem'}} placeholder='请输入目标页面网址' onSearch={handleUrlSearch} />
        </div>
        <span style={{marginRight: 10}}>高亮已埋点元素</span><Switch onChange={handleHighlightCheck} />
      </div>
      <div style={{flex: 1, padding: '.5rem'}}>
        <iframe id="iframeEl" onLoad={handleIframeLoad} ref={iframeEl} width="100%" height="100%" src={targetUrl} style={{border: '1px solid #eee', borderRadius: '4px'}} />
      </div>
    </div>
  </>);
}

export default React.memo(Octopus);