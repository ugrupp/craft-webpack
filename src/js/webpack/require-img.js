import WebpackUtil from './util';

WebpackUtil.requireAll(require.context('../../img/', true, /\.(png|jpe?g|gif|webp)$/i));
