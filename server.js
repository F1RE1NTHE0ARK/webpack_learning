const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleWare = require('webpack-dev-middleware')
const config = require('./webpack.config.js')
const complier = webpack(config);

const app = express()
app.use(webpackDevMiddleWare(complier,{
    publicPath:config.output.publicPath
}))

app.listen(3000,()=>{
    console.log('老子开始咯！~~')
})