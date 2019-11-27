import Util from './util';
import 'element-closest/browser'; // Element.closest polyfill (cause it's not in core.js)

class Menu {
  constructor(el) {
    this.el = el;
    this.BP_COLLAPSE = 1200;
    this.OPEN_FLAG = 'is-open';
    this.togglers = {
      level2: [...this.el.querySelectorAll('[data-menu-toggle="2"]')],
      level3: [...this.el.querySelectorAll('[data-menu-toggle="3"]')],
    };
    this.items = {
      level1: [...this.el.querySelectorAll('[data-menu-item="1"]')],
      level2: [...this.el.querySelectorAll('[data-menu-item="2"]')],
      level3: [...this.el.querySelectorAll('[data-menu-item="3"]')],
    };
    this.navs = {
      // level 1 is not used in JS
      level2: [...this.el.querySelectorAll('[data-menu-level="2"]')],
      level3: [...this.el.querySelectorAll('[data-menu-level="3"]')],
    };
    this.hoverTimeoutDuration = 300;
    this.hoverTimeouts = {
      level1: null,
      level2: null,
      level3: null,
    };

    this.initTogglers();
    this.initEvents();
    this.initDesktopOutsideTouch();

    // close submenus on topbar unpin
    document.addEventListener('topbar-unpinned', () => {
      if (this.isDesktop()) {
        this.closeAll(2);
      }
    });
  }

  // helper method to determine the current breakpoint
  isDesktop() {
    return window.matchMedia(`(min-width: ${this.BP_COLLAPSE}px)`).matches;
  }

  // close submenus on touch "anywhere". useful for large touch devices.
  initDesktopOutsideTouch() {
    document.addEventListener('touchend', (event) => {
      if (this.isDesktop()) {
        if (!event.target.closest('[data-menu]')) {
          this.closeAll(2);
        }
      }
    });
  }

  // init toggle elements
  initTogglers() {
    // mobile level 2 opener (level 3 gets opened automatically via events)
    this.togglers.level2.forEach((toggler) => {
      toggler.addEventListener('click', (e) => {
        if (!this.isDesktop()) {
          this.toggle(document.getElementById(toggler.dataset.menuTarget));
          e.preventDefault();
          e.currentTarget.blur();
        }
      });
    });

    // desktop level 2 & 3 openers
    [...this.items.level1, ...this.items.level2, ...this.items.level3].forEach((item) => {
      // mouseenter
      item.addEventListener('mouseenter', () => {
        if (this.isDesktop()) {
          let level = parseInt(item.dataset.menuItem);
          clearTimeout(this.hoverTimeouts[`level${level}`]);

          let target = item.querySelector(`[data-menu-level="${level + 1}"]`);
          if (target) {
            !this.isOpen(target) && this.open(target);
          } else {
            this.closeAll(level + 1);
          }
        }
      });

      // mouseleave
      item.addEventListener('mouseleave', () => {
        if (this.isDesktop()) {
          let level = parseInt(item.dataset.menuItem);
          let target = item.querySelector(`[data-menu-level="${level + 1}"]`);
          if (target) {
            // timeout to protect user from unintended mouseleave
            this.hoverTimeouts[`level${level}`] = setTimeout(() => {
              this.isOpen(target) && this.close(target);
            }, this.hoverTimeoutDuration);
          }
        }
      });
    });
  }

  initEvents() {
    // on mobile when level 2 nav opened => open all level 3 navs, too
    document.addEventListener('menu-level2-opened', (e) => {
      if (!this.isDesktop()) {
        [...e.detail.nav.querySelectorAll('[data-menu-level="3"]')].forEach((nav) => this.open.call(this, nav, true));
      }
    });
  }

  // Closes all navigations of `level` except `excludeNav`
  closeAll(level, excludeNav) {
    // close the navs
    let targetNavs = this.navs[`level${level}`];
    targetNavs && targetNavs.forEach((nav) => {
      if (nav !== excludeNav) {
        this.close(nav);
      }

      // trigger event
      Util.triggerEvent(`menu-level${level}-closed-all`);
    });
  }

  toggle(nav) {
    this.isOpen(nav) ? this.close(nav) : this.open(nav);
  }

  isOpen(nav) {
    return nav.classList.contains(this.OPEN_FLAG);
  }

  open(nav, keepOtherNavsOpen) {
    // get level
    let level = parseInt(nav.dataset.menuLevel);

    // close all other navs of that level
    if (!keepOtherNavsOpen) {
      this.closeAll(level, nav);
    }

    // open nav = set flag on parent and nav itself
    nav.classList.add(this.OPEN_FLAG);
    let parentItem = nav.closest(`[data-menu-item="${level - 1}"]`);
    parentItem && parentItem.classList.add(this.OPEN_FLAG);

    // trigger event
    Util.triggerEventWithPayload(`menu-level${level}-opened`, {
      nav,
    });
  }

  close(nav) {
    // get level
    let level = parseInt(nav.dataset.menuLevel);

    // close nav = remove flag on parent and nav itself
    nav.classList.remove(this.OPEN_FLAG);
    let parentItem = nav.closest(`[data-menu-item="${level - 1}"]`);
    parentItem && parentItem.classList.remove(this.OPEN_FLAG);

    // trigger event
    Util.triggerEventWithPayload(`menu-level${level}-closed`, {
      nav,
    });
  }
}


export default class Menues {
  constructor() {
    document.addEventListener('DOMContentLoaded', (e) => {
      this.menues = [...document.querySelectorAll('[data-menu]')].map((el) => {
        return new Menu(el);
      });
    });
  }
}
