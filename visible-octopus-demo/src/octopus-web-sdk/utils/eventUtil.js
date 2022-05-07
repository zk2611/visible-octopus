class EventUtils {
  addEvent (el, type, handler) {
    if (el.addEventListener) {
      el.addEventListener(type, handler, false);
    } else if (el.attachEvent) {
      el.attachEvent(`on${type}`, handler);
    } else {
      el[`on${type}`] = handler;
    }
  }

  removeEvent (el, type, handler) {
    if (el.removeEventListener) {
      el.removeEventListener(type, handler, false);
    } else if (el.detachEvent) {
      el.detachEvent(`on${type}`, handler);
    } else {
      el[`on${type}`] = null;
    }
  }

  getTarget (event) {
    return event.target || event.srcElement;
  }

  getEvent (event) {
    return event || window.event;
  }

  stopPropagation (event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  }

  preventDefault (event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  }
}

export default new EventUtils();

