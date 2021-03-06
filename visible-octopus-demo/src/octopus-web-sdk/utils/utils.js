import uaParser from 'ua-parser-js';

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
//   if (element.id !== "") {//??????id??????????????????????????????id????????? ???//*[@id="xPath"]  ????????????
//     return '//*[@id=\"' + element.id + '\"]';
//   }
//   //?????????????????????????????????????????????????????????js ????????????html??????????????????????????????????????????????????????
//   if (element == document.body) {//?????????body??????????????????
//     return '/html/' + element.tagName.toLowerCase();
//   }
//   var ix = 1,//???nodelist???????????????????????????????????????
//     siblings = element.parentNode.childNodes;//??????????????????

//   for (var i = 0, l = siblings.length; i < l; i++) {
//     var sibling = siblings[i];
//     //?????????????????????siblings??????????????????????????????????????????
//     if (sibling == element) {
//       return getMXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
//       //?????????????????????????????????element????????????????????????????????????????????????????????????????????????
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
