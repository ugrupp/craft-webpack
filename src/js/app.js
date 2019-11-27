//
// Main entry file
// --------------------------------------------------

// Webpack entries
// Styles
import '../css/app.scss';
// Images
import './webpack/require-img';
// SVGs
import './webpack/require-svg';

// SVG <use> polyfill
import 'svgxuse';

// Manually load some polyfills based on `useBuiltIns: usage`
Array.from;
Object.assign;

// JS module imports
import './modules/fontfaceobserver';
import './modules/object-fit-images';
import './modules/scrollbar';
import Overlays from './modules/overlays';
import Menues from './modules/menu';
import Panels from './modules/panels';
import Selects from './modules/selects';
import Inputs from './modules/inputs';

new Selects();
new Overlays();
new Menues();
new Panels();
new Inputs();


// Example app main
const main = async () => {
    // Async load the vue module
    const Vue = await import(/* webpackChunkName: "vue" */ 'vue');
    // Create our vue instance
    const vm = new Vue.default({
        el: "#app",
        components: {
            'confetti': () => import(/* webpackChunkName: "confetti" */ '../vue/Confetti.vue'),
        },
        data: {
        },
        methods: {
        },
        mounted() {
        },
    });
};

// Execute async function
main().then((value) => {
    console.log('main executed');
});
