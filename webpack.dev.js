// webpack.dev.js - developmental builds
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// node modules
const merge = require('webpack-merge');
const path = require('path');
const sane = require('sane');
const webpack = require('webpack');

// webpack plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Stylish = require('webpack-stylish');
const StylelintBarePlugin = require('stylelint-bare-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');

// config files
const common = require('./webpack.common.js');
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

// Configure the webpack-dev-server
const configureDevServer = (buildType) => {
    return {
        public: settings.devServerConfig.public(),
        contentBase: path.resolve(__dirname, settings.paths.templates),
        host: settings.devServerConfig.host(),
        port: settings.devServerConfig.port(),
        https: !!parseInt(settings.devServerConfig.https()),
        disableHostCheck: true,
        quiet: false,
        hot: true,
        hotOnly: false,
        overlay: true,
        stats: 'errors-only',
        writeToDisk: (filePath) => {
            return settings.svgConfig.urlPattern.test(filePath) || settings.svgConfig.nonSpriteUrlPattern.test(filePath);
        },
        watchOptions: {
            poll: !!parseInt(settings.devServerConfig.poll()),
            ignored: /node_modules/,
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        // Use sane to monitor all of the templates files and sub-directories
        before: (app, server) => {
            const watcher = sane(path.join(__dirname, settings.paths.templates), {
                glob: ['**/*'],
                poll: !!parseInt(settings.devServerConfig.poll()),
            });
            watcher.on('change', function(filePath, root, stat) {
                console.log('  File modified:', filePath);
                server.sockWrite(server.sockets, "content-changed");
            });
        },
    };
};

// Configure Clean webpack
const configureCleanWebpack = () => {
    return {
        root: path.resolve(__dirname, settings.paths.dist.base),
        watch: true,
    };
};

// Configure Image loader
const configureImageLoader = (buildType) => {
    if (buildType === LEGACY_CONFIG) {
        return {
            test: /\.(png|jpe?g|gif|webp)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[hash].[ext]'
                    }
                }
            ]
        };
    }
    if (buildType === MODERN_CONFIG) {
        return {
            test: /\.(png|jpe?g|gif|webp)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[hash].[ext]'
                    }
                }
            ]
        };
    }
};

// Configure the Postcss loader
const configurePostcssLoader = (buildType) => {
    // Don't generate CSS for the legacy config in development, unless IE dev is enabled
    if (buildType === LEGACY_CONFIG && !settings.enableIEDevelopment) {
        return {
            test: /\.scss$/,
            loader: 'ignore-loader'
        };
    }
    if (buildType === MODERN_CONFIG || settings.enableIEDevelopment) {
        return {
            test: /\.scss$/,
            use: [
                {
                    loader: 'style-loader',
                },
                {
                    loader: 'vue-style-loader',
                },
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2,
                        sourceMap: true
                    }
                },
                {
                    loader: 'resolve-url-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        implementation: require("sass"),
                        sourceMap: true,
                        includePaths: [
                            path.join(__dirname, settings.paths.src.css, 'vendor'),
                        ]
                    }
                },
            ]
        };
    }
};

// Development module exports
module.exports = [
    merge(
        common.legacyConfig,
        {
            output: {
                filename: path.join('./js', '[name]-legacy.[hash].js'),
                publicPath: settings.devServerConfig.public() + '/',
            },
            mode: 'development',
            devtool: 'inline-source-map',
            devServer: configureDevServer(LEGACY_CONFIG),
            module: {
                rules: [
                    configurePostcssLoader(LEGACY_CONFIG),
                    configureImageLoader(LEGACY_CONFIG),
                ],
            },
            plugins: [
                new CleanWebpackPlugin(settings.paths.dist.cleanSVG,
                    configureCleanWebpack()
                ),
                new webpack.HotModuleReplacementPlugin(),
                new ImageminWebpWebpackPlugin(),
            ],
        }
    ),
    merge(
        common.modernConfig,
        {
            output: {
                filename: path.join('./js', '[name].[hash].js'),
                publicPath: settings.devServerConfig.public() + '/',
            },
            mode: 'development',
            devtool: 'inline-source-map',
            devServer: configureDevServer(MODERN_CONFIG),
            module: {
                rules: [
                    configurePostcssLoader(MODERN_CONFIG),
                    configureImageLoader(MODERN_CONFIG),
                ],
            },
            plugins: [
                new StylelintBarePlugin({
                    files: 'src/css/**/*.scss'
                }),
                new webpack.HotModuleReplacementPlugin(),
                new Stylish(),
            ],
        }
    ),
];
