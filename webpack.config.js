const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack')

module.exports = {
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
    entry: { main: './src/index.js' },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [new HtmlWebpackPlugin(
        {
            template: 'src/index.html'
        }
    ), new CleanWebpackPlugin(), new webpack.HotModuleReplacementPlugin()],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {loader: "babel-loader"}
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