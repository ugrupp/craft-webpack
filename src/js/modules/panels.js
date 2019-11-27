import Houdini from 'houdinijs/dist/js/houdini.polyfills.js';
import throttle from 'lodash.throttle';
import 'element-closest/browser'; // Element.closest polyfill (cause it's not in core.js)

export default class Panels {
  constructor() {
    this.COLLAPSED_FLAG = 'is-collapsed';
    this.EXPANDED_FLAG = 'is-expanded';

    document.addEventListener('DOMContentLoaded', (e) => {
      this.panelEls = [...document.querySelectorAll('[data-panel]')];

      this.setupHoudiniListener();

      // calc panel content heights initially and on resize
      this.calculateAllPanelsHeight();
      window.addEventListener('resize', throttle(this.calculateAllPanelsHeight.bind(this)));
      // make publicly available
      window.updatePanelSize = this.calculateAllPanelsHeight.bind(this);

      // setup houdini (not scoped to single panels, so we can use the accordion methods)
      this.houdini = new Houdini('[data-panel-panel]', {
        expandedClass: this.EXPANDED_FLAG,
        btnAttribute: 'data-panel-header',
        btnClass: 'c-panel__header',
      });
      this.initHoudiniPanelStatus();
    });
  }

  // add & remove missing flags
  setupHoudiniListener() {
    document.addEventListener('houdiniCollapse', (event) => {
      this.houdiniListener(false, event);
    }, false);

    document.addEventListener('houdiniExpand', (event) => {
      this.houdiniListener(true, event);
    }, false);
  }

  houdiniListener(expand, event) {
    let panelContent = event.detail.content;
    let panel = panelContent.closest('[data-panel]');

    if (expand) {
      panel.classList.remove(this.COLLAPSED_FLAG);
      panel.classList.add(this.EXPANDED_FLAG);
      panelContent.classList.remove(this.COLLAPSED_FLAG);
    } else {
      panel.classList.add(this.COLLAPSED_FLAG);
      panel.classList.remove(this.EXPANDED_FLAG);
      panelContent.classList.add(this.COLLAPSED_FLAG);
    }

    event.detail.button.blur();
  }

  initHoudiniPanelStatus() {
    if (this.houdini) {
      this.panelEls.forEach((panelEl) => {
        let panelID = `#${panelEl.querySelector('[data-panel-panel]').id}`;
        panelEl.classList.contains(this.EXPANDED_FLAG)
          ? this.houdini.expand(panelID)
          : this.houdini.collapse(panelID);
      });
    }
  }

  // Re-calc panel content heights
  calculateAllPanelsHeight() {
    this.panelEls.forEach((panelEl) => {
      this.calculatePanelHeight(panelEl);
    });
  }

  calculatePanelHeight(panelEl) {
    const panelContent = panelEl.querySelector(['[data-panel-panel]']);
    const panelInner = panelEl.querySelector(['[data-panel-panel-inner]']);
    let activeHeight = panelInner.offsetHeight;
    panelContent.style.maxHeight = `${activeHeight}px`;
  }
}
