import { STYLE_EL_ID } from "./const";

const addStyle = (cssText) => {
  const styleEl = document.createElement('style');
  const head = document.head || document.getElementsByTagName('head')[0];
  styleEl.type = 'text/css';
  styleEl.id = STYLE_EL_ID;

  console.log('style', styleEl.styleSheet)

  if (styleEl.styleSheet) {
    const setCssText = () => {
      try {
        styleEl.styleSheet.cssText = cssText;
      } catch (e) {
        console.log(e)
      }
    }
    if (styleEl.styleSheet.disabled) {
      setTimeout(setCssText, 10);
    } else {
      setCssText();
    }
  } else {
    // 创建一个文本节点
    const textNode = document.createTextNode(cssText);
    styleEl.appendChild(textNode);
  }
  head.appendChild(styleEl);
}

export default addStyle;
