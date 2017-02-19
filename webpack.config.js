var path = require('path');
var webpack = require('webpack');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');

module.exports = {
    entry: './index.ts',
    output: {
        // path: path.resolve(__dirname, './dist'),
        // publicPath: '/dist/',
        filename: 'app.js',
    },
    module: {
        loaders: [{
                test: /\.tsx$/,
                loader: 'ts-loader'
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.html$/,
                loader: 'wc-loader',
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.d.ts']
    },
    plugins: [
        // Generates path-based module ids instead of fluctuating integer ones
        // new webpack.NamedModulesPlugin(),

        // Without this, the entry chunk hash changes due to the changing manifest
        // new WebpackMd5Hash(),

        // Extracts the manifest from the entry chunk
        // new ChunkManifestPlugin(),

        // Minimizes your scripts (and your css, if you use the css-loader) webpack supports a simple option
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            mangle: false,
            beautify: false
        }),

    ],
    devtool: 'source-map'
}