Component({
    externalClasses: ['i-class'],
    properties:{
        desc:{
            type:Array
        },
        hd:{
            type:Object
        }

    },
    data: {
        resetDesc:[]
    },
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    created(){ //组件实例化，但节点树还未导入，因此这时不能用setData

    },

    attached(){ // 节点树完成，可以用setData渲染节点，但无法操作节点

    },

    ready(){// 不是onReady 组件布局完成，这时可以获取节点信息，也可以操作节点

        // let resetDesc=[];

        // this.properties.desc.forEach(function (item) {
        //     console.log(item)
        //     if(item.value.constructor==Array){
        //         item.type='array'
        //     }
        //     resetDesc.push(item)
        // })

        // console.log(resetDesc)
        // this.setData({
        //     resetDesc
        // })

        // console.log(this.data.resetDesc)
    },

    moved(){ // 组件实例被移动到树的另一个位置

    },

    detached(){ // 组件实例从节点树中移除

    },

    methods:{


    }
});