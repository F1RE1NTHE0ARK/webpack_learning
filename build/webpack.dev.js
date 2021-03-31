const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common')


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
    plugins: [new webpack.HotModuleReplacementPlugin()],
}
module.exports = webpackMerge.merge(devConfig,commonConfig)