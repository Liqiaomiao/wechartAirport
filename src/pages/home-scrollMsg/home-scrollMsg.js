
const regeneratorRuntime = require('../../libs/regenerator.js')
const { $Toast } = require('../../components/iview/base/index');
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
Component({
    data: {
        scrollText:[],
        msgInterval:'',
        scrollBeforeIndex:0,
        scrollMiddleIndex:1,
        scrollAfterIndex:2,
        startMove:[0,0] //开始移动的 坐标
    },
    created(){}, //组件实例化，但节点树还未导入，因此这时不能用setData

    attached(){},// 节点树完成，可以用setData渲染节点，但无法操作节点

    ready(){// 不是onReady 组件布局完成，这时可以获取节点信息，也可以操作节点
        this._getMsgData()      
    }, 

    moved(){},// 组件实例被移动到树的另一个位置

    detached(){},// 组件实例从节点树中移除
     
    methods:{
        _details({currentTarget}){
            if(!currentTarget.dataset.msgid){
                $Toast({
                    type : 'error',
                    content : '获取消息详情错误，请稍后重试'
                })
                return
            }
            commonMethods.Router({
                type : 'navigateTo',
                path : 'scrollMsg',
                params : {
                    msgId : currentTarget.dataset.msgid
                }
            })
            
        },
        _seeMore(){
            commonMethods.Router({
                type : 'navigateTo',
                path : 'scrollMsg'
            })
        },
        async _getMsgData(){
            let msgData = await commonMethods.Request({
                apiUrl:API.columnList,
                getParams : 'NOTICE'
            })

            if(msgData.status != 0){
                // $Toast({
                //     type : 'error',
                //     content : msgData.message
                // })
                return
            }

            let _this = this , scrollText = []

            msgData.data.map( (val) => {
                if(val.title.length >= 57 ){
                    val.title = val.title.substr(0,57) + ' ...'
                }
            })

            scrollText = msgData.data

            if(scrollText.length == 1){
                scrollText.push(scrollText[0],scrollText[0])
            }
            if(scrollText.length == 2){
                scrollText.push(scrollText[0],scrollText[1])
            }

            this.setData({
                scrollText
            })
            
            this._msgInterval()
            
        },
        _msgInterval(){
            let _this = this ;
            this.setData({
                msgInterval:setInterval(() => {
                    _this._msgInit('add')
                },5000)
            })
        },
        _msgInit(types){
            let beforeNum = this.data.scrollBeforeIndex ,
            middleNum = this.data.scrollMiddleIndex ,
            afterNum = this.data.scrollAfterIndex ,
            msgLength = this.data.scrollText.length - 1
            
            if(types == 'add'){

                if(msgLength == afterNum){
                    beforeNum = this.data.scrollBeforeIndex 
                    middleNum = this.data.scrollMiddleIndex
                    afterNum = -1
                }
                if(msgLength == middleNum){
                    beforeNum = msgLength - 1
                    middleNum = -1
                    afterNum = 0
                }
                if(msgLength == beforeNum){
                    beforeNum = -1
                    middleNum = 0
                    afterNum = 1
                }

                this.setData({
                    scrollBeforeIndex : ++beforeNum,
                    scrollMiddleIndex : ++middleNum ,
                    scrollAfterIndex : ++afterNum
                })

            }else{
                if(middleNum == msgLength){
                    beforeNum = msgLength - 1
                    middleNum = msgLength
                    afterNum = msgLength + 1
                }
                if(beforeNum == msgLength){
                    beforeNum = msgLength 
                    middleNum = msgLength + 1
                    afterNum = 1
                }
                if(beforeNum == 0){
                    beforeNum = msgLength + 1
                    middleNum = 1
                    afterNum = 2
                }

                this.setData({
                    scrollBeforeIndex : --beforeNum,
                    scrollMiddleIndex : --middleNum ,
                    scrollAfterIndex : --afterNum
                })
            }
            
        },
        // 触摸移动
        _handMsgMove(e){
            clearInterval(this.data.msgInterval)
        },
        // 触摸开始
        _handMsgStart(e){
            let startX = e.changedTouches[0].clientX ,
            startY = e.changedTouches[0].clientY

            this.setData({
                startMove : {x:startX,y:startY}
            })

        },
        // 触摸结束
        _handMsgEnd(e){

            let endX = e.changedTouches[0].clientX - this.data.startMove.x ,
            endY = e.changedTouches[0].clientY - this.data.startMove.y

            if(Math.abs(endX) > Math.abs(endY) && endX > 0){
                this._msgInit('less')
            }
            else if(Math.abs(endX) > Math.abs(endY) && endX < 0){
                this._msgInit('add')
            }
            else if(Math.abs(endX) < Math.abs(endY) && endY > 0){
                this._msgInit('add')
            }
            else if(Math.abs(endX) < Math.abs(endY) && endX < 0){
                this._msgInit('less')
            }

            this._msgInterval()
        }
    }
});