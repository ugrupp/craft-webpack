import FontFaceObserver from 'fontfaceobserver';
import Util from './util';

// FontfaceObserver webfont helper script

// Helper function to transform the raw font data below into a flattened array of FontFaceObserver objects
function transformFontData(fontData) {
  return fontData.reduce((totalObservers, fontObj) => {
    let currentOberservers = fontObj.styles.reduce((totalObserversStyle, styleObj) => {
      let currentObserversStyle = styleObj.styles.map((style) => {
        return new FontFaceObserver(fontObj.name, {
          weight: styleObj.weight,
          style: style,
        });
      });
      return [...totalObserversStyle, ...currentObserversStyle];
    }, []);
    return [...totalObservers, ...currentOberservers];
  }, []);
}

// CI font
const fontsCI = transformFontData([
  {
    name: 'Roboto Slab',
    styles: [
      {
        weight: 400,
        styles: [
          'normal',
        ],
      },
    ],
  },
]);

let fontsCILoadedPromises = fontsCI.map((fontFaceObserverObj) => {
  // timeout: 7s
  return fontFaceObserverObj.load(null, 7000);
});

// As soon as the fonts are loaded, set a global flag
Promise.all(fontsCILoadedPromises).then(() => {
  document.documentElement.classList.add('has-loaded-fonts-ci');
  Util.triggerEvent('fonts-ci-loaded');
});


// Sans-serif font
const fontsSans = transformFontData([
  {
    name: 'Roboto',
    styles: [
      {
        weight: 400,
        styles: [
          'normal',
          'italic',
        ],
      },
      {
        weight: 700,
        styles: [
          'normal',
          'italic',
        ],
      },
    ],
  },
]);

let fontsSansLoadedPromises = fontsSans.map((fontFaceObserverObj) => {
  // timeout: 5s
  return fontFaceObserverObj.load(null, 5000);
});

// As soon as the fonts are loaded, set a global flag
Promise.all(fontsSansLoadedPromises).then(() => {
  document.documentElement.classList.add('has-loaded-fonts-sans');
  Util.triggerEvent('fonts-sans-loaded');
});
