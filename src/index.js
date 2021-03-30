import a from './header.js'
import './index.scss'
var avatar = require('./timg.jpg')

console.log('wwww')
a()
console.log(avatar)
let ele = document.createElement('img')
ele.src = avatar
ele.classList.add('avatar')
document.body.append(ele)