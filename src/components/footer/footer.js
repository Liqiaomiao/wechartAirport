import commonMethods from '../../utils/wxRequest'
const { $Toast } = require('../../components/iview/base/index');
Component({
    data: {
        current: 'home',
        state : {
            home : true ,
            cardVouchers : true ,
            my : true
        }
    },
    created(){ //组件实例化，但节点树还未导入，因此这时不能用setData
         
    }, 

    attached(){ // 节点树完成，可以用setData渲染节点，但无法操作节点

    },

    ready(){// 不是onReady 组件布局完成，这时可以获取节点信息，也可以操作节点
        this.setData({
            current: getCurrentPages()[getCurrentPages().length - 1].route.split('/')[2]
        });
    }, 

    moved(){ // 组件实例被移动到树的另一个位置

    },

    detached(){ // 组件实例从节点树中移除

    },
    
    methods:{
        _handleChange ({ detail }) {
            let _this = this
            
            for(let keys in this.data.state){
                if(keys == detail.key){
                    if(!this.data.state[keys]){
                        $Toast({
                            content : '敬请期待'
                        })
                        return
                    }
                }
            }
            
            commonMethods.Router({
                type : 'redirectTo',
                path : detail.key
            })
            
        }
    }
});