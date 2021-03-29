# webpack4

是一个模块打包工具，接收CommonJS，ES module ,CMD,AMD等打包规范，能打包一切格式的文件1

# 安装

> npm install webpack-cli -D
>
> npm install webpack -D

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



