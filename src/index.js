async function getComponent(){
    const element = document.createElement('div')
    const { default: _ } = await import(/* webpackChunkName:"lodash" */'lodash');
    element.innerHTML = _.join(['D','S','A'],'-')
    return element;
}
getComponent().then(res=>{
    document.body.append(res)
})
