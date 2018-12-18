import {cardnoFormat } from '../../utils/format'
import API from '../../utils/API'
let app=getApp();
Component({
    externalClasses: ['i-class'],
    properties:{
        list:Object
    },
    data: {
        resetDesc:[],
        cardnum:'',
        imgbase:API.IMG_BASE_URL,
        imgServer : API.IMG_BASE_SERVER_URL
    },
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    created(){ //组件实例化，但节点树还未导入，因此这时不能用setData

    },

    attached(){ // 节点树完成，可以用setData渲染节点，但无法操作节点
        this.setData({
            cardnum:cardnoFormat(this.properties.list.cardNo)
        })
    },

    ready(){// 不是onReady 组件布局完成，这时可以获取节点信息，也可以操作节点

    },

    moved(){ // 组件实例被移动到树的另一个位置

    },

    detached(){ // 组件实例从节点树中移除

    },

    methods:{
        goCardDetail({currentTarget}){
            app.globalData.cardno=currentTarget.dataset.cardno;
            app.globalData.cardTypeName=currentTarget.dataset.cardtypename;
            this.triggerEvent('goCardDetail',currentTarget.dataset.cardno)
        }

    }
});