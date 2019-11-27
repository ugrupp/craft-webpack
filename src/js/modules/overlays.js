import Util from './util';

class Overlay {
  constructor(el) {
    this.el = el;
    this.id = this.el.id;
    this.initTogglers();
    this.initOutsideClick();

    // close overlay on escape press
    Util.esc(this.close.bind(this));

    return this;
  }

  initTogglers() {
    this.openers = [...document.querySelectorAll(`[data-overlay-opener="${this.id}"]`)];
    this.closers = [...document.querySelectorAll(`[data-overlay-closer*="${this.id}"]`)];
    this.togglers = [...document.querySelectorAll(`[data-overlay-toggler="${this.id}"]`)];

    // Openers
    this.openers.forEach((opener, idx) => {
      opener.addEventListener('click', (e) => {
        this.open();
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.blur();
        return false;
      }, false);
    });

    // Closers
    this.closers.forEach((closer, idx) => {
      closer.addEventListener('click', (e) => {
        this.close();
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.blur();
        return false;
      }, false);
    });

    // Togglers
    this.togglers.forEach((toggler, idx) => {
      toggler.addEventListener('click', (e) => {
        this.toggle();
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.blur();
        return false;
      }, false);
    });
  }

  // close overlay on click "anywhere"
  initOutsideClick() {
    document.addEventListener('click', (e) => {
      if (this.el !== e.target && !this.el.contains(e.target)) {
        this.close();
      }
    });
  }

  // Opens overlay
  open() {
    this.el.classList.add('is-open');
    document.body.classList.add(`is-overlay-${this.id}-open`);
    this.openers.forEach(opener => opener.classList.add('is-open'));
    this.togglers.forEach(toggler => toggler.classList.add('is-open'));
  }

  // Closes overlay
  close() {
    this.el.classList.remove('is-open');
    document.body.classList.remove(`is-overlay-${this.id}-open`);
    this.openers.forEach(opener => opener.classList.remove('is-open'));
    this.togglers.forEach(toggler => toggler.classList.remove('is-open'));
  }

  // Toggles overlay
  toggle() {
    this.el.classList.contains('is-open') ? this.close() : this.open();
  }
}


export default class Overlays {
  constructor() {
    document.addEventListener('DOMContentLoaded', (e) => {
      this.overlays = [...document.querySelectorAll('[data-overlay]')].map((el) => {
        return new Overlay(el);
      });

      // kinda bad i guess...
      window.appOverlays = this.overlays;
    });
  }
}
