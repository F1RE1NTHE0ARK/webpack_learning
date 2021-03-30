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
        //要按顺序添加
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

我们需要实现更新代码的同时实时更新更新页面

webpack5直接配置webpack.config.js即可

``` javascript
const webpack = require('webpack') //引入以使用webpack自带的热更新插件
...
//其实配不配置这个插件，webpack5只要配置了hot为true都会热更新
plugins: [...,new webpack.HotModuleReplacementPlugin()],
devServer: {
    contentBase: "./dist",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
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

