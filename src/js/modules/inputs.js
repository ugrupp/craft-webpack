import throttle from 'lodash.throttle';

class Input {
  constructor(el) {
    this.el = el;
    this.DISABLED_FLAG = 'is-disabled';
    this.ERROR_FLAG = 'has-error';
    this.input = this.el.querySelector('input, textarea');
    this.input.inputClass = this;
    this.tagName = this.input.tagName.toLowerCase();

    this.initDisabledStatus();
  }

  initDisabledStatus() {
    this.input.disabled && this.el.classList.add(this.DISABLED_FLAG);
  }

  setErrorState(hasErrors, errors) {
    let errorListEl = this.el.querySelector('[data-field-errors]');

    if (hasErrors) {
      this.el.classList.add(this.ERROR_FLAG);

      if (errorListEl) {
        let errorList = this.renderErrorList(errors);
        errorList && errorListEl.appendChild(errorList);
      }
    } else {
      this.el.classList.remove(this.ERROR_FLAG);

      if (errorListEl) {
        errorListEl.innerHTML = '';
      }
    }
  }

  renderErrorList(errors) {
    if (!errors) {
      return false;
    }

    let errorList = document.createElement('ul');
    errorList.classList.add('c-form__errorlist');
    errors.forEach(error => {
      let errorListItem = document.createElement('li');
      errorListItem.innerHTML = error;
      errorList.appendChild(errorListItem);
    });

    return errorList;
  }
}

// Text inputs
class InputText extends Input {
  constructor(el) {
    super(el);

    this.FILLED_FLAG = 'is-filled';
    this.initFilledStatus();

    if (this.tagName !== 'textarea') {
      this.initCancelButton();
    } else {
      this.textareaAutoResize();
    }
  }

  initFilledStatus() {
    this.input.addEventListener('keyup', this.checkFilledStatus.bind(this));
    this.input.addEventListener('change', this.checkFilledStatus.bind(this));
  }

  // show cancel button if input isn't empty
  checkFilledStatus() {
    this.input.value.length
      ? this.el.classList.add(this.FILLED_FLAG)
      : this.el.classList.remove(this.FILLED_FLAG);
  }

  initCancelButton() {
    if (typeof this.el.dataset.inputCancelable !== 'undefined') {
      let cancelBtnEl = this.el.querySelector('[data-input-cancel]');
      if (cancelBtnEl) {
        // clear input on cancel button click
        cancelBtnEl.addEventListener('click', (e) => {
          this.clear();
          this.input.focus();

          e.preventDefault();
          return false;
        });
      }
    }
  }

  textareaAutoResize() {
    function applyResize() {
      this.input.style.height = 'auto';
      this.input.style.height = this.input.scrollHeight + offset + 'px';
    }

    this.input.style.boxSizing = 'border-box';
    let offset = this.input.offsetHeight - this.input.clientHeight;
    this.input.addEventListener('input', applyResize.bind(this));
    window.addEventListener('resize', throttle(applyResize.bind(this)));
  }

  // clear input
  clear() {
    this.input.value = '';
    this.checkFilledStatus();
  }
}


// Radios & checkboxes
class InputRadioCheckbox extends Input {
  constructor(el) {
    super(el);
  }
}


// Inputs initializer
export default class Inputs {
  constructor() {
    document.addEventListener('DOMContentLoaded', (e) => {
      this.textInputs = [...document.querySelectorAll('[data-input]')].map((el) => new InputText(el));
      this.radiosCheckboxes = [...document.querySelectorAll('[data-checkbox], [data-radio]')].map((el) => new InputRadioCheckbox(el));
    });
  }
}
