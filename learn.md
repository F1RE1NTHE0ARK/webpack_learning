# webpack4

是一个模块打包工具，接收CommonJS，ES module ,CMD,AMD等打包规范，能打包一切格式的文件1

# 安装

> npm install webpack-cli -D
>
> npm install webpack -D

## 安装指定版本

> npm install webpack@4.16.5 -D

## npm -S,-D区别

- -S

1. 安装模块到项目node_modules目录下。
2. 会将模块依赖写入dependencies 节点。
3. 运行 npm install 初始化项目时，会将模块下载到项目目录下。
4. 运行npm install --production或者注明NODE_ENV变量值为production时，会自动下载模块到node_modules目录中。

- -D

1. 安装模块到项目node_modules目录下。
2. 会将模块依赖写入devDependencies 节点。
3. 运行 npm install 初始化项目时，会将模块下载到项目目录下。
4. 运行npm install --production或者注明NODE_ENV变量值为production时，不会自动下载模块到node_modules目录中。

# 开始示例

``` javascript
index.js
header.js
sidebar.js
index.html
```

``` javascript
//sidebar模块类似
//export也是webpack能识别的
export default function Header() {
    var dom = document.getElementById('root')
    dom.append('<div>head</div>')
}

//index.js
import Header from './header' // import 的语法只能是webpack才是能识别
import Sidebar from './sidebar'

var dom = document.getElementById('root')
dom.append('<div>content</div>')


new Header()
new Sidebar()
```



> 运行 npx webpack ./index.js 或npx webpack index.js

此时会在当前目录下新生成dist文件夹，里面有个main.js，里面就是index.js,header.js,sidebar.js模块化后的压缩包，在index.html 引入就能使用

``` html
<!DOCTYPE html>
<html>
<head>
    <title>啦啦啦我就是个网页</title>
</head>
<body>
    <p>芜湖我是网页内容</p>
    <div id="root"></div>
    <script src="./dist/main.js"></script>
</body>
</html>
```

# webpack配置

默认配置文件为根目录下***webpack.config.js***

之后运行npx webpack即可打包

## 配置文件重命名

如果需要用其他配置文件进行打包，可以写这样：

```
npx webpack 你命名的文件
例：
npx webpack webpackconfig.js
```

## webpack.config.js配置

``` javascript
//最简单的配置
const path = require('path') //node的路径模块

module.exports = {
    //代表入口，相当于
    //entry:{main:'./index.js'}
    //main称为一个webpack的chunk name
    entry: './index.js',
    //代表出口
    output: {
        //打包的文件名
        filename: 'bundle.js',
        //指打包到和webpack配置文件同目录下的bundle文件夹
        path:path.resolve(__dirname,'bundle')
        //publicPath用于向导入的打包的js文件添加前缀
        //例如publicPath:'http://cdn.com/'
    }
}
```

## 占位符

在webpack配置中，开发者大多使用占位符的形式，因为其构建灵活，常用的占位符如下：

- [name]：模块的名称，即entry的key值（main，index，home，app之类的）。
- [id]：模块的标识符，即webpack打包过程中生成的内部的chunk id，一个自增的id号。
- [hash]：模块标识符的hash。
- [chunkhash]：chunk内容的hash。

[hash] 和 [chunkhash] 的长度可以使用[hash:16] (默认为 20) 来指定，或者通过output.hashDigestLength在全局配置长度。

[hash]：是整个项目的hash值，其根据每次编译的内容计算得到，只要修改文件就会导致整个项目构建的hash值发生改变。[hash]可以用在开发环境，不适用于生产环境。

[chunkhash]：是根据不同的入口文件（entry）进行依赖文件解析，构建对应的chunk，生成相应的chunkhash。如果在某一入口文件创建的关系依赖图上存在文件内容发生了变化，那么相应的入口文件的chunkhash才会发生变化，否则chunkhash就不会变化，所以[chunkhash]受它自身chunk的文件内容的影响，只要该chunk中的内容有变化，[chunkhash]就会变。因此一般在项目中会把公共库和其他文件拆开，并把公共库代码拆分到一起进行打包，因为公共库的代码变动较少，这样可以实现公共库的长效缓存。

[contenthash]：使用chunkhash还存在一个问题，当一个JS文件引入了CSS文件（import 'xxx.css'），打包构建后它们的chunkhash值是相同的，因此如果更改了JS文件的内容，即使CSS文件内容没有更改，那么与这个JS关联的CSS文件的chunkhash也会跟着改变，这样就会导致未改变的CSS文件的缓存失效了。针对这种情况，我们可以使用mini-css-extract-plugin插件将CSS从JS文件中抽离出来并使用contenthash，来解决上述问题。

## loader

``` javascript
output:{...},
module: {
    //规则是个数组
        rules: [
            {	//正则匹配，匹配所有要处理的文件名
                test: /\.jpg$/,
                //使用的loader
                loader: 'file-loader',
                //配置，可以参考官网的loader查看配置项
                options: {
                    //为true时，会返回一个module对象，不用
                    //则返回文件路径
                    esModule: false,
                    name: '[path][name].[ext]',
                    //打包到出口下的images的文件夹下
                    outputPath:'images/'
                }
            }
        ]
    }
```

## 样式loader

!记得安装对应loader

> npm install autoprefixer -D 用于为css添加兼容的浏览器前缀，例如-webkit-,-os-...

``` json
//webpack.config.js
rules:[
    ...
    {
        test: /\.s[ac]ss$/i,
        //要按顺序添加，从后到前执行
        use: [
            "style-loader",
            "css-loader",
            "sass-loader",
            "postcss-loader"
        ],
    },
]
```

``` json	
//postcss.config.js
module.exports ={
    plugins:[
        require('autoprefixer')
    ]
}
```

因为新版本的浏览器已经不用去兼容厂商，所以需要在package.json中配置broswerlist来兼容老版本浏览器

``` json
"browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
```

## 字体图标

在src的font里加入字体文件

``` 
/font
iconfont.eot
iconfont.svg
iconfont.ttf
iconfont.woff
```

写入样式

``` scss
//可以在iconfont网中，加入图标到购物车，然后添加到项目后，下载源文件，将iconfont.css里样式复制粘贴即可
@font-face {font-family: "iconfont";
    src: url('./font/iconfont.eot?t=1617069016974'); /* IE9 */
    ...
  }
  
  .iconfont {
   ...
  }
  
  .iconchayan:before {
    content: "\e98c";
  }
  
  .iconerweima:before {
    content: "\e98d";
  }
```

用file-loader在webpack.config.js中配置loader

## plugins

插件用于在webpack运行的某个特定阶段做一些操作

## 自动生成根html

> npm install html-webpack-plugin -D

- 配置webpack.config.js

``` json
...
plugins: [new HtmlWebpackPlugin(
    {
        //这是地址是模板文件
        template:'src/index.html'
    }
)],
output:{...}
```

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>老子是模板</title>
<script defer src="bundle.js"></script></head>
<body>
    <!--生成的文件里就会自动插入这个div-->
    <div id="root"></div>
</body>
</html>
```

## 自动清除打包后未使用的文件

> npm install clean-webpack-plugin -D

配置webpack.config.js

``` javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        //这个必须写，不然CleanWebpackPlugin不知道去哪里清除未使用的文件
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [new HtmlWebpackPlugin(
        {
            template:'src/index.html'
        }
    ),new CleanWebpackPlugin()],
    module: {
      ...
    }
}
```

## sourceMap

代表源代码和打包后代码的映射关系

通过在webpack.config.js里配置devtool选项来让报错信息更明确

``` javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
module.exports = {
    mode: 'development',
    devtool:'source-map', 
    //https://webpack.docschina.org/configuration/devtool/
    //这个值可以查文档，打包速度越慢，报错信息越明确
    entry: {main:'./src/index.js'},
    output: { ...},
    plugins: [...],
    module: {...}
}
```

## webpack-dev-server实现热更新

[其他配置参考](https://webpack.docschina.org/configuration/dev-server/#devserverhistoryapifallback)

我们需要实现更新代码的同时实时更新更新页面

webpack5直接配置webpack.config.js即可

``` javascript
const webpack = require('webpack') //引入以使用webpack自带的热更新插件
...
//其实配不配置这个插件，webpack5只要配置了hot为true都会热更新
plugins: [...,new webpack.HotModuleReplacementPlugin()],
devServer: {
    contentBase: "./dist",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转,所有的 404 请求都会响应 index.html 的内容,用于单页面应用跳转
    host:'127.0.0.1', //相当于localhost
    port:8080,
    inline: true,//实时刷新
    hotOnly:true, //热更新失败也不要刷新页面
    hot:true,//热更新
    compress:true,//Enable gzip compression for everything served
    overlay: true, //Shows a full-screen overlay in the browser
    stats: "errors-only" ,//To show only errors in your bundle
    open:true, //第一次编译时在浏览器打开
    proxy:{ // 通过proxy属性添加代理服务配置,其中 每一个属性就是一个代理规则的配置
            '/api' :{// 属性的名称就是要被代理的请求路径前缀,它的值就是为这个前缀匹配到的代理规则配置
                target:"https://api.github.com",
                // http://localhost:8080/api/users ==> https://api.github.com/api/users
                // 因为我们实际要请求的地址是https://api.github.com/api/users,所以我们需要通过重写的方式去掉/api
                pathRewrite:{ // pathRewrite会以正则的方式去替换我们请求的路径
                    "^/api":""
                },
                // 因为代理服务器默认会以我们实际在浏览器中请求的主机名(例如我们的localhost:8080)作为代理请求的主机名
                // 也就是说，我们在浏览器端对代理过后的地址发起请求，这个请求背后还需要去请求到github服务器，请求的过程中会带一个主机名
                // 这个主机名默认会用我们在浏览器端发起请求的主机名，也就是localhost:8080
                // 而一般情况下，服务器内需要根据主机名判断这个主机名属于哪个网站，从而把这个请求指派到对应网站
                changeOrigin:true 
            }
        }
 }
```

记住要把package.json里的browserslist去掉，否则无法进行热更新

``` json
//这个要去掉
"browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
```

此时打包的文件会存在内存当中以加快打包速度，不会在dist文件夹中生成文件

## webpack-dev-middle和express自己搭建服务器

没什么意义...

根目录下的server.js

``` javascript
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
    //服务器开始后提示信息
    console.log('老子开始咯！~~')
})
```

## 适配babel来编译es6

> npm install --save-dev babel-loader @babel/core
>
> npm install @babel/preset-env --save-dev

配置webpack.config.js

``` json
rules:[
    ...
     {
        test: /\.m?js$/,
        //不编译node_modules里的东西
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
]
```

在根目录创建babel.config.json文件添加如下代码

``` json
{
  "presets": ["@babel/preset-env"]
}
```

!!! 注意，此时只是语法转换了，但旧浏览器还是识别不了promise等新语法

## @babel/polyfill为低版本浏览器添加es6语法并减小体积

**主要用于写业务代码**

> npm install --save @babel/polyfill 
>
> 注意是运行时依赖，而不是开发依赖

配置webpack.config.js

``` json
rules:[
    ...
     {
         test: /\.m?js$/,
         exclude: /node_modules/,
         use: {
             loader: "babel-loader",
             options: {
                 presets:[['@babel/preset-env',{
                     //只注入用过的语法来减小打包体积
                     useBuiltIns:'usage',
                     //目标浏览器
                      target: {
                          //大于某个版本跟
                          chrome: "58",
                          ie: "11"
                      },
                     //指定codejs版本，不写也没关系
                     corejs: { version: "3.9", proposals: true }	
                 }]]
             }
         }
     },
]
```

## @babel/plugin-transform-runtime来减小打包体积

**主要用于写第三方库**

> npm install --save-dev @babel/plugin-transform-runtime
>
> npm install --save @babel/runtime

webpack.config.js

``` json
rules:[
     {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        //添加plugins配置
                        "plugins": [["@babel/plugin-transform-runtime", {
                            //以下为默认配置，其他参考网站
                            //https://www.babeljs.cn/docs/babel-plugin-transform-runtime
                            "absoluteRuntime": false,
                            "corejs": false,
                            "helpers": true,
                            "regenerator": true,
                            "version": "7.0.0-beta.0"
                        }]]
                        // presets: [['@babel/preset-env', {
                    }
                }
            },
]
```

## babel配置写在babel.config.json里

``` json
//babel.config.json （在根目录）
{
    "plugins": [["@babel/plugin-transform-runtime", {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "version": "7.0.0-beta.0"
    }]]
    // "presets": [
    //     [
    //         "@babel/preset-env",
    //         {
    //             "useBuiltIns": "usage",
    //             "targets": {
    //                 "chrome": "58",
    //                 "ie": "11"
    //             },
    //             "corejs": {
    //                 "version": "3.9",
    //                 "proposals": true
    //             }
    //         }
    //     ]
    // ]
}
```

``` javascript
//webpack.config.js
rules:[
    {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {loader: "babel-loader"}
    }
]
```

## 使用Tree Shaking不打包未使用的代码

> !只有es module规范的引入支持，即不支持require等引入方法

例子：

``` javascript
//math.js
export const add =(a,b)=>{
    console.log(a+b)
}
export const minus = (a,b)=>{
    console.log(a-b)
}

//index.js
//只导入了add，或导入minus，但不使用minus都会触发tree shaking
import {add} from './math'
add(1,2)
// minus(2,1)
```



使用tree shaking，只需要在webpack.config.js里配置即可

``` javascript
{
    ...
    output: {... },
    optimization:{
        //开发环境下此时输出的js里依然会打包你没使用过的输出
        //但会用注释标出来，告诉你哪个输出没使用
        ///* harmony export */ });
		/* unused harmony export minus */
        //如果是生产环境，则会直接不打包没使用的输出
        usedExports: true
    },
}
```

生产环境还可以进一步压缩代码体积

``` javascript
{
    ...
    output: {... },
    optimization:{
        usedExports: true, // 识别无用代码
        minimize: true,    // 将无用代码在打包中删除
        concatenateModules: true, // 尽可能将所有模块合并输出到一个函数中
        removeEmptyChunks: false, //去除空的打包文件(empty chunks)
    },
}
```

有时候我们通过import引入了css文件，因为tree shaking检测到他没有导出东西，也可能把它无效掉，所以我们需要在package.json配置sideEffects选项

- package.json和webpack配置文件中的sideEffects虽然同名，但表示的意义不同。

  package.json的sideEffects：标识当前package.json所影响的项目，当中所有的代码是否有副作用
  默认true，表示当前项目中的代码有副作用
  webpack配置文件中的sideEffects：开启功能，是否移除无副作用的代码
  默认false，表示不移除无副作用的模块
  在production模式下自动开启。
  webpack不会识别代码是否有副作用，只会读取package.json的sideEffects字段。

  二者需要配合使用，才能处理无副作用的模块。

``` json
...
"scripts": {...},
"sideEffects":[
    "./src/extend.js", // 标识有副作用的文件
    "*.css", // 也可以使用路径通配符
    "style/" // 注意目录必须带后面的/
 ],
```

## 开发和生产环境

有时开发环境的webpack配置和生产环境的配置有很多不同，如果我们要切换环境时就可能会重复修改webpack.config.js文件，所以我们可以单独配置两个环境的webpack.config配置

在根目录创建两个配置文件webpack.dev.js和webpack.prod.js

然后再package.json中调用

``` json
 "scripts": {
     //如果是根目录的build文件夹，则是(相对于根目录)
//"dev": "webpack --config ./build/webpack.dev.js",
    "dev": "webpack --config webpack.dev.js", //开发模式打包
    "start": "webpack serve --config webpack.dev.js", //开发模式热更新
    "prod": "webpack --config webpack.prod.js" //生产模式打包
  },
```

最好把配置都放到build文件夹中,记得修改output path

``` js
// build/webpack.common.js
{
   ...
   output: {
        filename: '[name].js',
            //打包到上一层目录的dist，即根目录的dist文件夹中
        path: path.resolve(__dirname, '../dist'),
    },
}
```

甚至可以把公共部分或通用部分抽出来,然后通过webpack-merge来合并配置

``` javascript
// build/webpack.common.js
这个文件能把公共部分抽出来，包括部分公共部分
例如:
webpack.dev.js的plugin是[
    new HtmlWebpackPlugin(), 
    new CleanWebpackPlugin()
]
webpack.prod.js的plugin是[
    new HtmlWebpackPlugin(), 
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
]
则可以把相同的部分抽出来，则webpack.prod.js只剩下
plugin：[new webpack.HotModuleReplacementPlugin()]

//最后合并文件
// build/webpack.dev.js

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
```

## CSS代码分割

[查看](https://webpack.docschina.org/plugins/mini-css-extract-plugin/)

> npm install --save-dev mini-css-extract-plugin 
>
> npm install css-minimizer-webpack-plugin --save-dev （可选 压缩css）

webpack.config.js配置,其他配置项参考文档

``` javascript
...
plugins:[new MiniCssExtractPlugin({
    filename: '[name].css', //可选
    chunkFilename: '[name].chunk.css',//可选
})],
module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    ...
                ],
            },
        ]
    },    
```

同样的splitChunks也可以分割css代码

``` javascript
splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          // For webpack@4
          // test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
```

## Shimming

webpack垫片，处理兼容性问题。

webpack基于模块打包的，变量间是隔离的

``` javascript
//ui.js
export default function changeColor(){
    $('body').css('background','red')
}

//index.js
import $ from 'jquery'
import changeColor from './ui'

changeColor() // Uncaught ReferenceError: $ is not defined
```

如果想使用$则需配置webpack.config.js

``` javascript
...
const webpack =require('webpack')
...

module.exports = {
    ...
    plugins: [
        ...
        new webpack.ProvidePlugin({
            $:'jquery' //使用了$ ,webpack帮你自动引入
            _map: ['lodash', 'map'], //表示遇到_map,会执行lodash模块的map方法
        })
             ],
    output: {...}
}
```

又因为webpack是基于模块打包的，所以模块内this指向模块本身，而不是window

(暂无解决方法)

> npm install imports-loader --save-dev

## 环境变量

想要消除 `webpack.config.js` 在 开发环境 和 生产环境之间的差异，你可能需要环境变量(environment variable)。

```bash
npx webpack --env NODE_ENV=local --env production --progress
```

``` javascript
const path = require('path');

module.exports = (env) => {
  // Use env.<YOUR VARIABLE> here:
  console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
  console.log('Production: ', env.production); // true

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};
Ti
```



# 额外

## 禁止将注释剥离到额外的LICENSE文件

配置webpack.config.js

``` javascript
const TerserPlugin = require("terser-webpack-plugin");

...
{
    optimization:{
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({
                extractComments: false, //是否将注释剥离到单独的文件中
            })
        ],
    }
}
```



# lodash

通过降低 array、number、objects、string 等等的使用难度从而让 JavaScript 变得更简单。 Lodash 的模块化方法 非常适用于：

- 遍历 array、object 和 string
- 对值进行操作和检测
- 创建符合功能的函数

[lodash使用](https://www.lodashjs.com/)

# 代码分割

## 手动分割

通过将第三方库，单独打包来减少浏览器请求资源来优化体验

``` javascript
// lodash.js
import _ from 'lodash'
window._ = _;
//index.js
console.log(_.join(['a','b','c'],'***'))

//webpack.config.js
{
    ...
     entry: {
        lodash: './src/lodash.js',
        main: './src/index.js'
    }
}
```

## 自动分割

通过配置webpack配置下的*optimization*内的SplitChunksPlugin来自动分包

``` javascript
{
	...
	optimization:{
        splitChunks:{
        //自动分割
            chunks: 'all',
        }
    },
}
```

## 异步加载模块

``` javascript
//动态加载lodash.js
async function getComponent(){
    const element = document.createElement('div')
    //webpackChunkName用于指定动态载入分包后的名字
    //不写则用默认的vendor.node_modules..什么的
    const { default: _ } = await import(/* webpackChunkName:"lodash" */'lodash');
    element.innerHTML = _.join(['D','S','A'],'-')
    return element;
}
getComponent().then(res=>{
    document.body.append(res)
})

```

## split-chunks-plugin详解

[详解](https://webpack.docschina.org/plugins/split-chunks-plugin/)

``` javascript
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async', // 代码分割时对异步代码生效，all：所有代码有效，inital：同步代码有效
      minSize: 30000, // 代码分割最小的模块大小，引入的模块大于 30000B 也就是30kb 才做代码分割
      maxSize: 0, // 代码分割最大的模块大小，大于这个值要进行代码分割，一般使用默认值
      minChunks: 1, // 引入的次数大于等于1时才进行代码分割
      maxAsyncRequests: 6, // 最大的异步请求数量,也就是同时加载的模块最大模块数量
      maxInitialRequests: 4, // 入口文件做代码分割最多分成 4 个 js 文件
      automaticNameDelimiter: '~', // 文件生成时的连接符
      automaticNameMaxLength: 30, // 自动生成的文件名的最大长度
      //满足了上面的条件后会进到这里检查需要分包到哪个组
        //如果default:false又不满足其他组的test条件时
        //则不分包
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 位于node_modules中的模块做代码分割
          priority: -10, // 越大越优先，根据优先级决定打包到哪个组里，例如一个 node_modules 中的模块进行代码
            filename = "vendor.js" //用于自定义分类名称，支持占位符
        }, // 分割，，既满足 vendors，又满足 default，那么根据优先级会打包到 vendors 组中。
        default: { // 没有 test 表明所有的模块都能进入 default 组，但是注意它的优先级较低。
          priority: -20, //  根据优先级决定打包到哪个组里,打包到优先级高的组里。
          reuseExistingChunk: true // //如果一个模块已经被打包过了,那么再打包时就忽略这个上模块
        }
      }
    }
  }
};
```

# 模块懒加载

配合异步加载模块，在任何操作之后再加载模块的方式

``` javascript
async function getComponent(){
    const element = document.createElement('div')
    const { default: _ } = await import(/* webpackChunkName:"lodash" */'lodash');
    element.innerHTML = _.join(['D','S','A'],'-')
    return element;
}

document.addEventListener('click',()=>{
    getComponent().then(res=>{
        document.body.append(res)
    })
    
})


```

# 打包分析

用来分析打包的大小，各个分包打包的耗时和大小

[打包分析网站](http://webpack.github.io/analyse/)

[其他分析工具](https://webpack.docschina.org/guides/code-splitting/#bundle-analysis)

# 预加载预获取

- preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
- preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
- preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。

异步加载代码的好处是可以提高代码利用率

chrome通过到控制台source里按ctrl+shift+p 搜索show coverage来打开监听器

**提高代码利用率有利于提高加载速度**

``` javascript
//原本
document.addEventListener('click',()=>{
    // getComponent().then(res=>{
    //     document.body.append(res)
    // })
    const element = document.createElement('div')
    element.innerHTML = 'shit'
    document.body.append(res)
})
//优化：
//click.js
function handleClick(){
    const element = document.createElement('div')
    element.innerHTML = 'shit'
    document.body.append(element)
}
export default handleClick

//index.js
document.addEventListener('click',()=>{
  import(/* webpackPrefetch: true */'./click').then(({default:func})=>{
    func()
  })
})

```

# 打包typescript

其实学习[typescript重构axios](https://coding.imooc.com/lesson/330.html#mid=25973)已经学过了

> npm instaill ts-loader typescript -D

根路径配置tsconfig.json

``` json
{
    "compilerOptions": {
      "moduleResolution": "node",
      "target": "es5",
      "module":"es2015",
      "lib": ["es2015", "es2016", "es2017", "dom"],
      "strict": true,
      "sourceMap": true,
      "declaration": true,
      "allowSyntheticDefaultImports": true,
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true,
      "declarationDir": "dist/types",
      "typeRoots": [
        "node_modules/@types"
      ]
    },
    //编译哪里的js文件
    //这里不配置html-webpack-plugin或其他js库会报错
    "include": [
      "src"
    ]
  }
```

若想在typscript中使用lodash，jquery等第三方库

要安装对于@types文件,用下面的参考搜索库名字即可

[参考](https://www.typescriptlang.org/dt/search?search=jquery)

# Eslint配置中webpack(傻逼才用)

> npm install eslint -D
>
> npx eslint --init 初始化配置文件
>
> npx eslint src 对src文件夹下文件进行验证

自动化检验

vs code安装eslint插件 

或者

配置webpack.config.js

``` javascript
//npm install eslint-loader -D
{
    test: /\.m?js$/,
        exclude: /node_modules/,
            use: [{ loader: "babel-loader" },{lodaer:'eslint-loader',options:{fix:true //自动修复简单错误
                                                                             }}]
},
```

# webpack优化

## resolve

**reolve配置过多会影响打包性能**

### resolve.extensions

尝试按顺序解析这些后缀名,如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。

``` javascript
//webpack.config.js
module.exports = {
  //...
  resolve: {
      //例如import component from './src/child'
      //则尝试以child.wasm,child.mjs,child.js,child.json的顺序去查找对应文件
    extensions: ['.wasm', '.mjs', '.js', '.json'],
  },
};
```

### resolve.mainFiles

尝试按顺序来解析目录下的默认文件

```javascript
//webpack.config.js
module.exports = {
  //...
  resolve: {
      //例如import child from './child'
      //则会查找./child/index文件，再查找./child/main文件，直到找到为止
    mainFiles: ['index','main'],
  },
};
```

### resolve.alias

路径别名

``` javascript
const path = require('path');

module.exports = {
  //...
  resolve: {
    alias: {
        //此时 import sth from 'Utiities/sth'
        //相当于import sth from 'src/utilities/sth'
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      Templates: path.resolve(__dirname, 'src/templates/'),
    },
  },
};
```

### 其他resolve

[参考](https://webpack.docschina.org/configuration/resolve/#resolvealias)

## 映射

通过将第三方库都打包到一个文件，然后再webpack中配置映射来提高**开发时**的打包速度

新建webpack.dll.js或者其他名字,配置完记得**先运行生成dll文件夹等**

``` javascript
const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'production',
	entry: {
        //将第三方库都输出单独文件
		vendors: ['lodash'],
		react: ['react', 'react-dom'],
		jquery: ['jquery']
	},
	output: {
		filename: '[name].dll.js',
        //都输出到dll文件夹
		path: path.resolve(__dirname, '../dll'),
        //把引用名改为chunk name，之后便可以在页面中使用这个名字引用
		library: '[name]'
	},
	plugins: [
        //此插件用于在单独的 webpack 配置中创建一个 dll-only-bundle。 此插件会生成一个名为 manifest.json 的文件，这个文件是用于让 DllReferencePlugin 能够映射到相应的依赖上。
        //https://webpack.docschina.org/plugins/dll-plugin/
		new webpack.DllPlugin({
            //暴露出的 DLL 的函数名，即上面的library同名
			name: '[name]',
			path: path.resolve(__dirname, '../dll/[name].manifest.json'),
		})
	]
}
```

然后在webpack.config.js中配置

``` javascript
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
...
plugins:[
    //npm install add-asset-html-webpack-plugin -D
    new AddAssetHtmlWebpackPlugin({
       filepath:path.resolve(__dirname,'文件名') //将文件插入自动生成的html中 
    }),
    new webpack.DllReferencePlugin({
        //包含 content 和 name 的对象，或者是一个字符串 —— 编译时用于加载 JSON manifest 的绝对路径
        manifest:path.resolve(__dirname,'文件名.manifest.json') //插入文件对应的json文件
    }),
    
    //如果有多个manifest的文件（例如上面有vendors,react和jquery）则添加多个插入即可
    new AddAssetHtmlWebpackPlugin(...),
    new webpack.DllReferencePlugin(...),
                                   
]
```

但有时候有太多的manifest文件，这样加很繁琐，所以我们可以这样:

``` javascript
const plugins = [
	new HtmlWebpackPlugin({
		template: 'src/index.html'
	}), 
	new CleanWebpackPlugin(['dist'], {
		root: path.resolve(__dirname, '../')
	})
];

const files = fs.readdirSync(path.resolve(__dirname, '../dll')); 
files.forEach(file => {
    //匹配推入
	if(/.*\.dll.js/.test(file)) {
		plugins.push(new AddAssetHtmlWebpackPlugin({
			filepath: path.resolve(__dirname, '../dll', file)
		}))
	}
	if(/.*\.manifest.json/.test(file)) {
		plugins.push(new webpack.DllReferencePlugin({
			manifest: path.resolve(__dirname, '../dll', file)
		}))
	}
})
```

### 关于Fs

``` javascript
reddirSync是一个同步读取的文件内容的语法
fs.readdirSync(path.resolve(__dirname, '../dll'));//这里会读取该目录下所有文件

//reduce是es6的一个数组方法，为数组中的每一个元素依次执行回调函数，不包括数组中被删除或从未被赋值的元素，接受四个参数：初始值(或者上一次回调函数的返回值)，当前元素值，当前索引，调用 reduce 的数组。

例子:
arr.reduce((prev,cur)=>{
    console.log('上一次',prev)
    console.log('当前',cur)
    return prev+cur
},0)
//结果
//上一次 0
//当前 1
//上一次 1
//当前 2
//上一次 3
//当前 3

//最终值6

```

## 多页面应用打包

配置webpack.config.js

``` javascript
module.exports = {
    entry: {
        main: './src/index.js',
        list: './src/list.js'
    },
    //其他配置参考htmlWebpackPlugin的github网站
    //https://github.com/jantimon/html-webpack-plugin#options
    plugins: [new HtmlWebpackPlugin(
        {
            filename:'index.html',//名字
            chunks:['main'],//需要包含的模块
            template: 'src/index.html' //使用的模板
        }
    ),new HtmlWebpackPlugin(
        {
            filename:'list.html',
            chunks:['list'],
            template: 'src/index.html'
        }
    ), new CleanWebpackPlugin()],
    ...
}
```

# 自定义loader

自己写一个js

``` javascript
//这个loader的作用是把shit替换为not a shit
module.exports = (source)=>{
    return source.replace('shit','not a shit')
}
```

在webpack.config.js中配置

``` javascript
...
rules:[
    {
        test:/\.js/,
        use:[{
            loader:path.resolve(__dirname,'../src/replaceLoader.js')
        }]
    }
]
...
```

[其他参考](https://webpack.docschina.org/api/loaders/#thisquery)

# 自定义plugin

[参考](https://webpack.docschina.org/api/compilation-hooks/#additionalassets)

创建一个js文件

``` javascript
class SomePlugin {
    //这个是plugin里面写的配置
    constructor(options){
        console.log('芜湖',options)
        // 芜湖,{name:'我我我我'}
    }
    //compiler是一个webpack的实例
    apply(compiler){
        debugger; //debug模式下的断点
        //compiler是一个钩子他有非常多的方法
        //下面一个方法简单来说就是在emit时刻（具体定义查看文档）往生成的dist或者其他输出文件夹中
        //多添加一个叫__11.txt的文件
         compiler.hooks.emit.tapAsync('SomePlugin',(compilation,cb)=>{
             console.log('我要插入了！')
             compilation.assets['__11.txt']={
                 //下面是一些文件信息
                 source:function(){
                     return 'motherfucker'
                 },
                 size:function(){
                     return 12
                 }
             }
             cb()
         })
    }
}
module.exports = SomePlugin
```

``` javascript
//webpack.config.js
...
 plugins: [new webpack.HotModuleReplacementPlugin(),new SomePlugin({
     name:'我我我我'
 })],
...
```

## 借助node对plugin来debug

package.json

``` json
"scripts": {
    "debug":"node --inspect --inspect-brk node_modules/webpack/bin/webpack.js"
  },
```

# bundler源码

理解webpack的一些打包原理

创建三个文件index.js(入口文件)，message.js（模块1），word.js（模块）

``` javascript
//index.js
import message from './message.js'
console.log(message)
//message.js
import {word} from './word.js'

export default `say ${word}`
//word.js
export const word = 'hello'
```

创建bundler.js，这相当于webpack.config.js

``` javascript
const fs = require('fs'); //用来读取文件
const parser =require('@babel/parser') //用来解析文件

const moduleAnalyser =(filename)=>{
    const content = fs.readFileSync(filename,'utf-8') //读取目标文件
    //将文件内容转为抽象语法书（ast）
    //树上的每个节点都表示源代码中的一种结构，例如ImportDeclaration（是一个导入语法），ExpressionStatement（一个表达式）
    const ast = parser.parse(content,{
        sourceType:'module'
    })
    console.log(ast.program.body)
}

moduleAnalyser('./src/index.js')
```



配置模块如何解析