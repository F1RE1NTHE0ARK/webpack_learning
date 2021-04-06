const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path')
const webpack =require('webpack')

module.exports = {
    entry: {
        main: './src/index.js',
    },
    plugins: [new HtmlWebpackPlugin(
        {
            template: 'src/index.html'
        }
    ), new CleanWebpackPlugin()],
    output: {
        filename: '[name].js',
        chunkFilename:'[name].chunk.js',
        path: path.resolve(__dirname, '../dist')
    }
}