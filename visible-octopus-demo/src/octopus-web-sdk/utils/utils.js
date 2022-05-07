import uaParser from 'ua-parser-js';
import getXPath from 'get-xpath';

const getBoundingClientRect = (el) => {
  const rect = el.getBoundingClientRect();
  const { top, right, bottom, left, width, height } = rect;
  const scrollLeft = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || 0;
  const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  return { top, right, bottom, left, width, height, scrollTop, scrollLeft };
}

const getPlatform = (ua) => {
  console.log(uaParser(ua))
}

// const getMXPath = (el) => {
//   console.log(getXPath(el))
//   return getXPath(el);
// }

const getMXPath = (el) => {
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

// const getMXPath = (el) => {
//   try {
//     let _el = el;
//     const allNodes = document.getElementsByTagName('*');
//     const segs = [];

//     while (_el && _el.nodeType === 1 && _el !== document.body) {
//       console.log(1)
//       if (_el.hasAttribute('id')) {
//         let idCount = 0;
//         for (let node of allNodes) {
//           if (node.hasAttribute('id') && node.id === _el.id) idCount++;
//           if (idCount > 1) break;
//         }
//         if (idCount === 1) {
//           segs.unshift(`//*[@id="${_el.getAttribute('id')}"]`);
//           return segs.join('/');
//         }
//       } else {

//         let i = 1;
//         for (let sib = el.previousSibling; sib; sib = sib.previousSibling) {
//           if (sib.localName === el.localName) i++;
//         }
  
//         if (i === 1) {
//           if (el.nextElementsSibling) {
//             if (el.nextElementsSibling.localName !== el.localName) {
//               segs.unshift(el.localName.toLowerCase());
//             } else {
//               segs.unshift(el.localName.toLowerCase() + '[' + i + ']');
//             }
//           } else {
//             segs.unshift(el.localName.toLowerCase());
//           }
//         } else {
//           segs.unshift(el.localName.toLowerCase() + '[' + i + ']');
//         }
//       }


//       _el = _el.parentNode;
//     }

    
//     return segs.length ? '/' + segs.join('/') : null;
//   } catch (e) {
//     console.log(e)
//     return null;
//   }
// }

// const getMXPath = (element) => {
//   if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
//     return '//*[@id=\"' + element.id + '\"]';
//   }
//   //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
//   if (element == document.body) {//递归到body处，结束递归
//     return '/html/' + element.tagName.toLowerCase();
//   }
//   var ix = 1,//在nodelist中的位置，且每次点击初始化
//     siblings = element.parentNode.childNodes;//同级的子元素

//   for (var i = 0, l = siblings.length; i < l; i++) {
//     var sibling = siblings[i];
//     //如果这个元素是siblings数组中的元素，则执行递归操作
//     if (sibling == element) {
//       return getMXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
//       //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
//     } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
//       ix++;
//     }
//   }
// }

// const getMXPath = (el) => {
//   try {
//     let allNodes = document.getElementsByTagName('*');
//     const segs = [];

//     let _el = el;
//     while (_el && _el.nodeType === 1 && _el !== document.body) {

//       if (el.hasAttribute('id')) {
//         let uniqueIdCount = 0;
        
//         for (let n = 0; n < allNodes.length; n++) {
//           if (allNodes[n].hasAttribute('id') && allNodes[n].id === el.id) uniqueIdCount++;
//           if (uniqueIdCount > 1) break;
//         }

//         if (uniqueIdCount === 1) {
//           segs.unshift('//*[@id="' + el.getAttribute('id') + '"]');
//           return segs.join('/');
//         } else {
//           return false;
//         }
//       } else {
//         let i = 1;

//         for (let sib = el.previousSibling; sib; sib = sib.previousSibling) {
//           if (sib.localName === el.localName) i++;
//         }

//         if (i === 1) {
//           if (el.nextElementsSibling) {
//             if (el.nextElementsSibling.localName !== el.localName) {
//               segs.unshift(el.localName.toLowerCase());
//             } else {
//               segs.unshift(el.localName.toLowerCase() + '[' + i + ']');
//             }
//           } else {
//             segs.unshift(el.localName.toLowerCase());
//           }
//         } else {
//           segs.unshift(el.localName.toLowerCase() + '[' + i + ']');
//         }
//       }

      
//     }
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// }

const getElByXPath = (xpath) => {
  if (!xpath) return null;
  try {
    const result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
    return result.iterateNext();
  } catch (e) {
    console.log(e)
  }
}

function reportData (url, data) {
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(data)], {
      // type: 'application/json; charset=UTF-8',
      type: 'application/x-www-form-urlencoded',
    });
    return navigator.sendBeacon(url, blob);
  } else {
    const img = document.createElement('img');
    img.src = `${url}?data=${JSON.stringify(data)}`;
  }

  try {
    var req = new window.XMLHttpRequest();
    req.open('GET', url, false);
    req.send();
  } catch (e) {
    // Fix IE9 cross-site error
    var img = new window.Image();
    img.src = url;
  }
}

export {
  getBoundingClientRect,
  getMXPath,
  getPlatform,
  getElByXPath,
  reportData,
}
