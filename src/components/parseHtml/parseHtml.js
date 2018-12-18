
var WxParse = require('../../libs/wxParse/wxParse.js');

Component({
    properties : {
        html : String
    },
    data: {
        
    },
    created(){}, //组件实例化，但节点树还未导入，因此这时不能用setData

    attached(){},// 节点树完成，可以用setData渲染节点，但无法操作节点

    ready(){  // 不是onReady 组件布局完成，这时可以获取节点信息，也可以操作节点
        this._setHtml()
    },

    moved(){},// 组件实例被移动到树的另一个位置

    detached(){},// 组件实例从节点树中移除
    
    methods:{
        _setHtml(){
            /**
            * WxParse.wxParse(bindName , type, data, target,imagePadding)
            * 1.bindName绑定的数据名(必填)
            * 2.type可以为html或者md(必填)
            * 3.data为传入的具体数据(必填) 
            * 4.target为Page对象,一般为this(必填)
            * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
            */
            let _this = this,  article = this.data.html;
            WxParse.wxParse('article', 'html', article, _this, 5);
        }
    }
});