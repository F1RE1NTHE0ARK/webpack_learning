const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path')

module.exports = {
    entry: {
        main: './src/index.js'
    },
    plugins: [new HtmlWebpackPlugin(
        {
            template: 'src/index.html'
        }
    ), new CleanWebpackPlugin()],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: { loader: "babel-loader" }
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