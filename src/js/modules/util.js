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
}
