const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common')

const prodConfig = {
    mode: 'production',
    optimization:{
        minimize: true,
        usedExports: true,
        concatenateModules: true,
        removeEmptyChunks: false,
        splitChunks:{
            chunks: 'all',
        }
    },
    
}

module.exports = webpackMerge.merge(prodConfig,commonConfig)