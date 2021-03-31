function getComponent(){
    return import('lodash').then(({default:_})=>{
        var element = document.createElement('div')
        element.innerHTML = _.join(['D','S','A'],'-')
        return element;
    })
}
getComponent().then(res=>{
    document.body.append(res)
})
