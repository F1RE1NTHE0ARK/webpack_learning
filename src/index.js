import _ from 'lodash'
import $ from 'jquery'
import changeColor from './ui'

changeColor()
const dom = $('<div>')
dom.html(_.join(['fuck','that'],'***'))
$('body').append(dom)

console.log(this===window)
console.log('this',this)
console.log('window',window)