import Headroom from 'headroom.js';
import throttle from 'lodash.throttle';
import Util from './util';

export default class Topbar {
  constructor() {
    document.addEventListener('animationstart', (e) => {
      if (e.animationName == 'topbarNodeReady') {
        this.init();
      }
    });

    document.addEventListener('DOMContentLoaded', () => {
      this.init();
    });
  }

  init() {
    if (!this.initialized) {
      this.initialized = true;
      this.topbar = document.querySelector('[data-topbar]');
      if (this.topbar) {
        this.initHeadroom();
        this.initDynamicHeight();
      }
    }
  }


  initHeadroom() {
    // Scroll behavior
    let headroom = new Headroom(this.topbar, {
      // vertical offset in px before element is first unpinned
      offset: this.topbar.offsetHeight,
      // scroll tolerance in px before state changes
      tolerance: 5,
      classes: {
        // when element is initialised
        initial: 'c-topbar--headroom-initialized',
        // when scrolling up
        pinned: 'c-topbar--pinned',
        // when scrolling down
        unpinned: 'c-topbar--unpinned',
        // when above offset
        top: 'c-topbar--top',
        // when below offset
        notTop: 'c-topbar--not-top',
        // when at bottom of scoll area
        bottom: 'c-topbar--bottom',
        // when not at bottom of scroll area
        notBottom: 'c-topbar--not-bottom',
      },
      onUnpin() {
        Util.triggerEvent('topbar-unpinned');
      },
    });

    headroom.init();
  }


  initDynamicHeight() {
    this.setDynamicHeight();
    window.addEventListener('resize', throttle(this.setDynamicHeight.bind(this), 100));
    document.addEventListener('fonts-sans-loaded', this.setDynamicHeight.bind(this));
    this.topbar.addEventListener(Util.whichTransitionEndEvent(), this.setDynamicHeight.bind(this));
  }

  setDynamicHeight() {
    document.documentElement.style.setProperty('--topbar-height', this.topbar.offsetHeight);
  }
}
