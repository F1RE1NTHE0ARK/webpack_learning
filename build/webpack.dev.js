const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common')
const SomePlugin = require('../src/somePlugin')

 const devConfig = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        port: 8082,
        host: '127.0.0.1',
        // hotOnly:true,
        open: true,
        compress: true,
    },
    plugins: [new webpack.HotModuleReplacementPlugin(),new SomePlugin({
        name:'我我我我'
    })],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: [{ loader: "babel-loader" }]
            },
            {
                test: /\.(jpg|png|gif|jpeg)$/,
                loader: 'url-loader',
                options: {
                    limit: 2048,
                    name: '[name].[ext]',
                    esModule: false,
                    outputPath: 'images/'
                }
            },
            {
                test: /\.(eot|ttf|svg|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'font/'
                }
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    },
                    //网络问题，没办法npm rebuild node-sass
                    // "sass-loader",
                    "postcss-loader"
                ],
            },
        ]
    }
}
module.exports = webpackMerge.merge(devConfig,commonConfig)