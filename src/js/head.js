//
// Head entry file
// Should be inserted inside <head>
// --------------------------------------------------

// Init lazysizes
import 'lazysizes/plugins/object-fit/ls.object-fit.js';
import 'lazysizes';

// Init topbar
// This is done as early as possible in order to avoid a jumpy topbar.
import Topbar from './modules/topbar';

new Topbar();
