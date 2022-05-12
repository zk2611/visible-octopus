import { MODE, DOM_HOVER_MARK_ID, DOM_HIGHLIGHT_MARK_ID } from './utils/const';
import eventUtil from './utils/eventUtil';
import { getBoundingClientRect, getPlatform, getMXPath, getElByXPath, reportData } from './utils/utils';


class AutoOctopus {
  constructor (initOption = {}) {
    this.option = {};
    this.mode = '';
    this.isHighlight = false;
    this.targetWindow = null;
    this.targetOrigin = null;
    this.eventList = [];

    this.initMessageListener();
    this.initIntersectionObserver();
    this.initClickListener();

    this.init();
  }

  initMessageListener = () => {
    eventUtil.addEvent(window, 'message', (e) => {
      if (e.origin !== "http://localhost:3000") return;
      console.log('B received message', e.data)
      e.source.postMessage('hello, I have received message', e.origin);
      this.targetWindow = e.source;
      this.targetOrigin = e.origin;
      if (e.data) {
        try {
          const { mode, highlight, update } = e.data;
          if (mode === MODE.OCTOPUS) {
            this.mode = mode;
            this.addDivDOM(DOM_HOVER_MARK_ID);
            this.addHoverListener();
          } else {
            this.mode = '';
            this.removeDivDOM(DOM_HOVER_MARK_ID);
            this.removeHoverListener();
          }
          if (highlight) {
            this.isHighlight = true;
            this.addDivDOM(DOM_HIGHLIGHT_MARK_ID);
            this.highlightOctopusEl();
          } else {
            this.isHighlight = false;
            this.removeDivDOM(DOM_HIGHLIGHT_MARK_ID);
          }
          if (update) {
            this.getEventList();
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  }

  init = () => {
    this.getEventList();
    eventUtil.addEvent(document.body, 'click', this.clickHandler);
  }

  // 添加 domInfo div
  addDivDOM = (id) => {
    if (!id) return;
    let el = document.getElementById(id);
    if (!el) {
      let div = document.createElement('div');
      div.id = id;
      document.body.appendChild(div);
      div = null;
    }
    el = null;
  }

  // 移除 domInfo div
  removeDivDOM = (id) => {
    if (!id) return;
    let el = document.getElementById(id);
    // Element.remove() 把对象从它所属的 DOM 树中删除 https://developer.mozilla.org/zh-CN/docs/Web/API/Element/remove
    el && el.remove();
    el = null;
  }




  /* 监听 mouseover 事件 */
  addHoverListener = () => {
    eventUtil.addEvent(document.body, 'mouseover', this.hoverHandler);
  }

  removeHoverListener = () => {
    eventUtil.removeEvent(document.body, 'mouseover', this.hoverHandler);
  }

  hoverHandler = (e) => {
    try {
      eventUtil.stopPropagation(e);
      const targetEl = eventUtil.getTarget(e);
      const event = eventUtil.getEvent(e);
      // const logData = this.getLogData(event);
      // console.log(logData)
      if (this.mode === MODE.OCTOPUS) {
        this.highlightHoverElement(event, targetEl);
      }
    } catch (e) {
      console.log(e);
    }
  }


  // removeClickListener = () => {
  //   eventUtil.removeEvent(document.body, 'click', this.clickHandler);
  // }

  clickHandler = (e) => {
    console.log('触发click')
    try {
      const targetEl = eventUtil.getTarget(e);
      const event = eventUtil.getEvent(e);
      const logData = this.getLogData(event);
      const { xpath } = logData;
      console.log('xpath', xpath);
      // console.log(logData)
      // 埋点模式下高亮元素并告知埋点平台
      if (this.mode === MODE.OCTOPUS) {
        eventUtil.stopPropagation(e);
        eventUtil.preventDefault(e);
        console.log('埋点模式')
        this.highlightHoverElement(event, targetEl);
        this.targetWindow.postMessage({ logData }, this.targetOrigin);
      }
      // 非埋点模式下，直接上报埋点信息
      else {
        console.log('非埋点模式')
        // 获取元素的xpath，并和已有xpath列表比对，存在则上报信息
        if (this.eventList.some(event => {
          console.log(event, xpath, event.xpath === xpath)
          return event.xpath === xpath
        })) {
          console.log('上报埋点信息', logData);
          reportData('http://localhost:9000/reportData/', logData);
        }

      }
    } catch (e) {
      console.log(e);
    }
  }


  /**
   * highlight hover 的元素
   * @param {*} event 
   * @param {*} targetEl 
   */
   highlightHoverElement = (event, targetEl) => {
    // 组织浏览器默认行为，比如 <a> 标签的跳转
    eventUtil.preventDefault(event);
    // 向目标元素添加样式
    let div = document.getElementById(DOM_HOVER_MARK_ID);
    const {width, height, top, left, scrollTop, scrollLeft} = getBoundingClientRect(targetEl);
    div.setAttribute('style', `
      width: ${width}px;
      height: ${height}px;
      top: ${top + scrollTop}px;
      left: ${left + scrollLeft}px;
      position: absolute;
      background-color: rgba(153, 191, 226, 0.5);
      pointer-events: none;
      z-index: 1000;
    `);
    div = null;
  }



  // 高亮已埋点元素
  highlightOctopusEl = () => {
    if (!this.eventList.length) return;
    for (let i = 0; i < this.eventList.length; i++) {
      const { id, xpath } = this.eventList[i];
      let highlightDiv = this.addHighlightDiv(id);
      if (!highlightDiv) continue;
      highlightDiv.innerText = i + 1;
      let el = getElByXPath(xpath);
      if (!el) continue;
      const {width, height, top, left, scrollTop, scrollLeft} = getBoundingClientRect(el);
      el = null;
      highlightDiv.setAttribute('style', `
        width: ${width}px;
        height: ${height}px;
        top: ${top + scrollTop}px;
        left: ${left + scrollLeft}px;
        position: absolute;
        background-color: rgba(249, 204, 157, 0.5);
        pointer-events: none;
      `)
      highlightDiv = null;
    }
  }

  addHighlightDiv = (id) => {
    let container = document.getElementById(DOM_HIGHLIGHT_MARK_ID);
    if (!container) return null;
    let targetEl = document.getElementById(id);
    if (targetEl) return null;
    let div = document.createElement('div');
    div.id = id;
    container.appendChild(div);
    container = null;
    targetEl = null;
    return div;
  }




  getLogData (e, data = {}) {
    const event = eventUtil.getEvent(e);
    const targetEl = eventUtil.getTarget(e);

    const platform = getPlatform(navigator.userAgent);

    const nodeName = targetEl.nodeName && targetEl.nodeName.toLocaleLowerCase() || '';
    const text = targetEl.innerText || targetEl.value;
    const xpath = getMXPath(targetEl) || '';
    const rect = getBoundingClientRect(targetEl);
    const documentEl = document.documentElement || document.body.parentNode;
    const scrollX = (documentEl && typeof documentEl.scrollLeft === 'number' ? documentEl : document.body).scrollLeft;
    const scrollY = (documentEl && typeof documentEl.scrollTop === 'number' ? documentEl : document.body).scrollTop;
    const pageX = event.pageX || event.clientX + scrollX;
    const pageY = event.pageY || event.clientY + scrollY;

    const eventData = {
      ...data,
      // event type
      et: 'click',
      // event desc
      ed: 'auto_click',
      text: text,
      nodeName,
      xpath,
      offsetX: ((pageX - rect.left - scrollX) / rect.width).toFixed(6),
      offsetY: ((pageY - rect.top - scrollY) / rect.height).toFixed(6),
      pageX,
      pageY,
      scrollX,
      scrollY,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    }

    return eventData;
  }


  getEventList = async () => {

    const res = await fetch('http://localhost:9000/getEventList').then((res) => res.json());
    const { code, msg, data } = res;
    console.log('getEventList', data)
    if (code === 200) {
      this.eventList = [...data];
      if (this.isHighlight) this.highlightOctopusEl();
    } else {
      console.log(msg)
    }

    // const eventList = [
    //   // { id: 1, xpath: '/html/body/div/div/div[1]' },
    //   // { id: 2, xpath: '/html/body/div[1]/div/div[4]' },
    //   // { id: 3, xpath: '/html/body/div[1]/div/a/p', isHidden: true },

    //   // { id: 1, xpath: '//*[@id="root"]/div/div/div' },
    //   { id: 1, xpath: '//*[@id="root"]/div[1]/div[1]/div[1]' },
    //   // { id: 2, xpath: '//*[@id="root"]/div/a' },
    //   { id: 2, xpath: '//*[@id="root"]/div[1]/a[1]' },
    //   // { id: 3, xpath: '//*[@id="root"]/div/div[3]', isHidden: true },
    //   { id: 3, xpath: '//*[@id="root"]/div[1]/div[3]', isHidden: true },
    //   { id: 4, xpath: '//*[@id="a"]', isHidden: true },
    //   { id: 5, xpath: '//*[@id="root"]/div/button', isHidden: true },

    // ];
    // let unmatchedEventList = [];
    // setTimeout(() => {
    //   for (let event of eventList) {
    //     if (event?.isHidden) continue;
    //     const { xpath } = event;
    //     console.log(xpath)
    //     let el = getElByXPath(xpath);
    //     console.log(el, !el)
    //     if (!el) unmatchedEventList.push(event);
    //     el = null;
    //   };
    //   console.log('aaaaaaa', unmatchedEventList);
    //   if (unmatchedEventList.length) {
    //     // 上报未匹配到的埋点元素
    //   }
    // })
    // this.eventList = eventList;
  }
}

window.onload = function() {
  new AutoOctopus();
}
