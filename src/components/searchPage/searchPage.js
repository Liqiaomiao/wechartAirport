Component({
    properties:{
        searchtext:String,
        placeholdertext:String
    },
    data: {

    },
    created(){ //组件实例化，但节点树还未导入，因此这时不能用setData

    },

    attached(){ // 节点树完成，可以用setData渲染节点，但无法操作节点

    },

    ready(){// 不是onReady 组件布局完成，这时可以获取节点信息，也可以操作节点

    },

    moved(){ // 组件实例被移动到树的另一个位置

    },

    detached(){ // 组件实例从节点树中移除

    },

    methods:{
        handleChange({detail}){
            this.triggerEvent('inputChange',  detail.value);
        },
        handleConfirm({detail}){
            this.triggerEvent('inputComfirm',  detail.value);
        },
        delall(){
            this.triggerEvent('inputChange',  '');
        },
        cancelSearch(){
            this.triggerEvent('cancelSearch');
        }
    }
});