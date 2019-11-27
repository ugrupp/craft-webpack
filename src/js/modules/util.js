import 'custom-event-polyfill';

// Collection of utility functions
export default class Util {
  // Calls any function on 'esc' press
  static esc(cb) {
    document.addEventListener('keydown', (evt) => {
      evt = evt || window.event;
      if (('key' in evt) ? (evt.key === 'Escape' || evt.key === 'Esc') : (evt.keyCode === 27)) {
        typeof cb === 'function' && cb();
      }
    });
  }

  // Get the transitionend event name
  // Adapted from Modernizr: https://modernizr.com
  static whichTransitionEndEvent() {
    let el = document.createElement('fakeelement');
    let transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
    };

    for (let t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }

  // Helper function to trigger events
  static triggerEvent(eventName) {
    if (!eventName) return;

    let event;
    event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, true, true);
    document.dispatchEvent(event);
  }

  // Helper function to trigger events
  static triggerEventWithPayload(eventName, payload) {
    if (!eventName || !payload) return;

    let event = new CustomEvent(eventName, {
      detail: payload,
    });
    document.dispatchEvent(event);
  }

  static offset(el) {
    let rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
  }
}
