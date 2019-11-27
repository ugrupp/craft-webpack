export default class Loader {
  constructor() {
    this.VISIBLE_FLAG = 'is-loading';
  }

  open() {
    document.documentElement.classList.add(this.VISIBLE_FLAG);
  }

  close() {
    document.documentElement.classList.remove(this.VISIBLE_FLAG);
  }
}
