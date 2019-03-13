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

// JS module imports
import './modules/fontfaceobserver';
import './modules/object-fit-images';

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
