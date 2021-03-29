import a from './header.js'
var avatar = require('./timg.jpg')

console.log('wwww')
a()
console.log(avatar)
let ele = document.createElement('img')
ele.src = avatar
document.body.append(ele)