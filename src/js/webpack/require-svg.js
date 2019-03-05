import WebpackUtil from './util';

WebpackUtil.requireAll(require.context('../../img/svg-sprite/', true, /\.svg$/));
