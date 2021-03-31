const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common')

const prodConfig = {
    mode: 'production',
    optimization: {
        minimize: true,
        usedExports: true,
        concatenateModules: true,
        removeEmptyChunks: false,
        chunkIds: 'named',
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    filename: "[name].js"
                },
            },
        }
    },

}

module.exports = webpackMerge.merge(prodConfig, commonConfig)