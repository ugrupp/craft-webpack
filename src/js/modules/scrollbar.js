import throttle from 'lodash.throttle';

function checkScrollbar() {
  let htmlEl = document.documentElement;
  if (window.innerWidth > document.body.clientWidth + 5) {
    htmlEl.classList.add('has-scrollbar');
    htmlEl.style.setProperty('--scroll-bar', window.innerWidth - document.body.clientWidth);
  } else {
    htmlEl.classList.remove('has-scrollbar');
    htmlEl.style.setProperty('--scroll-bar', 0);
  }
}

// instantly check scrollbar
checkScrollbar();
// The resize isn't very necessary, we're still doing it anyway
window.addEventListener('resize', throttle(checkScrollbar));
