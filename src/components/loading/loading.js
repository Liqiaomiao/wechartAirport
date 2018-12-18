
const default_data = {
    state : false,
    content : '加载中'  
 }

Component({
    data: {
        ...default_data
    },
    created(){}, //组件实例化，但节点树还未导入，因此这时不能用setData

    attached(){},// 节点树完成，可以用setData渲染节点，但无法操作节点

    ready(){}, // 不是onReady 组件布局完成，这时可以获取节点信息，也可以操作节点

    moved(){},// 组件实例被移动到树的另一个位置

    detached(){},// 组件实例从节点树中移除
    
    methods:{
        _loadShow(options){
            const { content = '加载中' } = options;

            this.setData({
                ...options,
                content,
                state : true
            });
        },
        _loadHide(){
            this.setData({
                ...default_data
            });
        }
        //  私有方法命名    _方法名 
    }
});