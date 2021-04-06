class SomePlugin {
    constructor(options){
        console.log('芜湖',options)
    }
    apply(compiler){
        compiler.hooks.emit.tapAsync('SomePlugin',(compilation,cb)=>{
            console.log('我要插入了！')
            debugger;
            compilation.assets['__11.txt']={
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