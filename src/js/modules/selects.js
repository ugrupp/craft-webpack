import SlimSelect from 'slim-select';

export default class Selects {
  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      let selectWrappers = [...document.querySelectorAll('[data-select]')];
      selectWrappers.forEach((selectWrapper) => {
        let selectEl = selectWrapper.querySelector('select');
        if (selectEl) {
          let slimSelect = new SlimSelect({
            select: selectEl,
            closeOnSelect: !selectEl.multiple,
            placeholder: selectEl.dataset.selectPlaceholder || (window.globalCfg && window.globalCfg.selectPlaceholder),
            showSearch: (window.globalCfg && window.globalCfg.selectShowSearch) || false,
            searchText: (window.globalCfg && window.globalCfg.selectSearchText) || 'Keine Ergebnisse',
            searchPlaceholder: (window.globalCfg && window.globalCfg.selectSearchPlaceholder) || 'Suchen',
            deselectLabel: (window.globalCfg && window.globalCfg.selectDeselectLabel) || `
              <svg viewBox="0 0 33 34" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M35.5 27.757l12.02-12.02 4.243 4.242L39.743 32l12.02 12.02-4.242 4.243L35.5 36.243l-12.02 12.02-4.243-4.242L31.257 32l-12.02-12.02 4.242-4.243L35.5 27.757z" id="a"/></defs><use fill="#fff" xlink:href="#a" transform="translate(-19 -15)" fill-rule="evenodd"/></svg>
            `,
          });

          // find possible labels for this select and open select on click
          let selectId = selectEl.id;
          if (selectId) {
            let labels = [...document.querySelectorAll(`label[for=${selectId}]`)];
            labels.forEach((label) => label.addEventListener('click', slimSelect.open.bind(slimSelect)));
          }
        }
      });
    });
  }
}
