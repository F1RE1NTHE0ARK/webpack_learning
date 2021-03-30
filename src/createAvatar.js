var avatar = require('./timg.jpg')

export default function createAvatar() {
    let ele = document.createElement('img')
    ele.src = avatar
    ele.classList.add('avatar')
    document.body.append(ele)
}
