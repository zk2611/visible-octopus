// 添加 <style> 标签
addHighlightStyle = () => {
  const el = document.getElementById(HIGHLIGHT_STYLE_EL_ID);
  if (!el) {
    const styleEl = document.createElement('style');
    const head = document.head || document.getElementsByTagName('head')[0];
    styleEl.id = HIGHLIGHT_STYLE_EL_ID;
    const textNode = document.createTextNode(SELECTED_EL_STYLE);
    styleEl.appendChild(textNode);
    head.appendChild(styleEl);
  }
}

// 移除 <style> 标签
removeHighlightStyle = () => {
  const el = document.getElementById(HIGHLIGHT_STYLE_EL_ID);
  // Element.remove() 把对象从它所属的 DOM 树中删除 https://developer.mozilla.org/zh-CN/docs/Web/API/Element/remove
  el && el.remove();
}


const getCSSClass = ({width, height, left, top}) => {
  return `
    .${SELECTED_EL_CLASS} {}
    .${SELECTED_EL_CLASS}::after {
      content: '',
      display: 'block',
      width: ${width},
      height: ${height},
      position: 'absolute',
      left: ${left},
      top: ${top},
    }
  `
}

const getStyle = ({width, height, left, top}) => {
  return `
    display: block;
    width: ${width};
    height: ${height};
    position: absolute;
    left: ${left};
    top: ${top};
    border: 1px solid red;
  `;
}

const getXPath = (el) => {
  try {
    const allNodes = document.getElementsByTagName('*');
    const segs = [];

    for (; el && el.nodeType === 1; el = el.parentNode) {
      if (el.hasAttribute('id')) {
        let uniqueIdCount = 0;
        
        for (let n = 0; n < allNodes.length; n++) {
          if (allNodes[n].hasAttribute('id') && allNodes[n].id === el.id) uniqueIdCount++;
          if (uniqueIdCount > 1) break;
        }

        if (uniqueIdCount === 1) {
          segs.unshift('//*[@id="' + el.getAttribute('id') + '"]');
          return segs.join('/');
        } else {
          return false;
        }
      } else {
        let i = 1;

        for (let sib = el.previousSibling; sib; sib = sib.previousSibling) {
          if (sib.localName === el.localName) i++;
        }

        if (i === 1) {
          if (el.nextElementsSibling) {
            if (el.nextElementsSibling.localName !== el.localName) {
              segs.unshift(el.localName.toLowerCase());
            } else {
              segs.unshift(el.localName.toLowerCase() + '[' + i + ']');
            }
          } else {
            segs.unshift(el.localName.toLowerCase());
          }
        } else {
          segs.unshift(el.localName.toLowerCase() + '[' + i + ']');
        }
      }
    }
    return segs.length ? '/' + segs.join('/') : null;
  } catch (e) {
    console.log(e)
    return null;
  }
}