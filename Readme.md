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
    //代表入口
    entry: './index.js',
    //代表出口
    output: {
        //打包的文件名
        filename: 'bundle.js',
        //指打包到和webpack配置文件同目录下的bundle文件夹
        path:path.resolve(__dirname,'bundle')
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

