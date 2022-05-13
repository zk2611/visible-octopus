import React, { useCallback, useState, useEffect, useRef } from "react";
import { Radio, Input, RadioChangeEvent, message, Switch, Button } from 'antd';
import CreateEventModal from "./CreateEventModal";
import { useModal } from "./useModal";
import { TARGET_URL } from "../const";
import { addEvent } from "../api";
import moment from 'moment';

const OCT_MODE_OPTIONS = [
  { label: '埋点模式', value: 'octopus' },
  { label: '浏览模式', value: 'browse' },
];

const Octopus = () => {
  // 选择模式
  const [octMode, setOctMode] = useState<string>('octopus');
  const handleOctModeChange = useCallback((e: RadioChangeEvent) => { setOctMode(e.target.value); }, []);

  // 填写目标网址
  const [targetUrl, setTargetUrl] = useState<string>(TARGET_URL);
  const handleUrlSearch = useCallback((val: string) => {
    setIsIframeLoaded(false);
    setTargetUrl(val);
  }, []);

  const [selectedEl, setSelectedEl] = useState(null);
  useEffect(() => {
    function receiveMessage (e: MessageEvent) {
      if (e.origin === document.location.origin) return;
      if (e.data && typeof e.data === 'object' && 'logData' in e.data) {
        // message.info(JSON.stringify(e.data.logData));
        console.log(e.data.logData.xpath)
        if (e.data.type === 'report') {
          setLogList((preLog) => [...preLog, {
            type: 'log',
            text: e.data.logData,
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            event: e.data.eventData,
          }]);
        }
        if (e.data.type === 'log') {
          openModal({ xpath: e.data.logData.xpath });
        }
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
  const [updateFlag, setUpdateFlag] = useState(1);

  useEffect(() => {
    if (!octMode || !iframeEl || !targetUrl || !isIframeLoaded) return;
    const receiver = iframeEl?.current?.contentWindow;
    receiver && receiver.postMessage({ mode: octMode, highlight: isHighlightEl, update: !!updateFlag }, targetUrl);
  }, [octMode, targetUrl, isHighlightEl, isIframeLoaded, updateFlag]);


  const { modalVisible, closeModal, openModal, initialValues } = useModal();
  const handleCreateEventOk = useCallback(async (values) => {
    console.log('values', values);
    const res = await addEvent(values);
    console.log('res', res);
    const { code, msg } = res;
    if (code === 200) {
      message.success('新建事件成功');
      // 成功之后要告诉sdk去拉取最新的埋点
      setUpdateFlag(pre => pre + 1);
      closeModal();
    } else {
      message.error(msg.toString() || '新建事件失败')
    }
  }, []);

  interface Log {
    text: string;
    type: string;
    date: string;
    event: string;
  }
  const logContainer = useRef<HTMLDivElement>(null);
  const [logList, setLogList] = useState<Log[]>([]);
  useEffect(() => { logList.length && logContainer && logContainer.current?.lastElementChild?.scrollIntoView({behavior: "smooth", block: "end"}); }, [logList]);
  const clearLog = useCallback(() => { setLogList([]); }, []);

  return (<>
    <CreateEventModal initialValues={initialValues} visible={modalVisible} onOk={handleCreateEventOk} onCancel={closeModal} />

    <div style={{padding: '1rem', display: 'flex', flexDirection: 'column', height: '100vh'}}>
      <h1>可视化埋点 Demo 0.1</h1>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{flex: 1, display: 'flex'}}>
          <Radio.Group optionType="button" buttonStyle="solid" options={OCT_MODE_OPTIONS} onChange={handleOctModeChange} value={octMode} />
          <Input.Search defaultValue={targetUrl} style={{width: 500, marginLeft: '.5rem'}} placeholder='请输入目标页面网址' onSearch={handleUrlSearch} />
        </div>
        <span style={{marginRight: 10}}>高亮已埋点元素</span><Switch onChange={handleHighlightCheck} />
      </div>
      <div style={{display: 'flex', flex: 1, padding: '.5rem', overflow: 'hidden'}}>
        <div style={{flex: 1, marginRight: 10}}>
          <iframe id="iframeEl" onLoad={handleIframeLoad} ref={iframeEl} width="100%" height="100%" src={targetUrl} style={{border: '1px solid #eee', borderRadius: '4px'}} />
        </div>
        <div style={{width: '30rem', border: '1px solid #eee', padding: '1rem', display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #eee'}}>
            <div>埋点上报日志</div>
            <Button size="small" type="primary" onClick={clearLog}>clear</Button>
          </div>
          <div ref={logContainer} style={{overflowY: 'auto'}}>
            {logList.map(log => <div style={{textAlign: 'left', whiteSpace: 'pre', padding: '.5rem', borderBottom: '1px dashed #bbb', lineHeight: 1.2}}>
              <div>{log.date}</div>
              <div>{JSON.stringify(log.text, null, 10)}</div>
              <div>{JSON.stringify(log.event, null, 10)}</div>
            </div>)}
          </div>
        </div>
      </div>
    </div>
  </>);
}

export default React.memo(Octopus);