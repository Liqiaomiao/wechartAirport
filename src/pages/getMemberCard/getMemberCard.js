
const { $Toast } = require('../../components/iview/base/index');
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API';
import format from '../../utils/format'
const app = getApp()

Page({
    data:{
        cardData : [],
        ifGetCard : false,
        hasRead : true,
        getCardVis : false,
        getCardData : [],
        items:[
            {value:'self',name:'本人',check:true}
            // {value:'other',name:'其他人'},
        ],
        current : 'self',
        toView : 'top'
    },
    _nowRouter({currentTarget}){
        let type = currentTarget.dataset.type
        commonMethods.Router({
            type : 'navigateTo',
            path : type == 'server' ? 'serviceReservationOnline' : 'fastRecharge',
            params : {
                pk : this.data.cardData.RandCardNo
            }
        })
    },
    _lookGetCard(){
        this.setData({
            toView : 'getCard'
        })
    },
    _hiddenGetCard(){
        this.setData({
            getCardVis : false
        })
    },
    async _getCard(){

        if(!this.data.hasRead){
            $Toast({
                content: '请勾选领卡协议',
                type: 'warning'
            });
            return
        }

        $Toast({
            content: '领卡中',
            type: 'loading',
            duration: 0
        });

        let resData = await commonMethods.Request({
            apiUrl : API.getmembercard,
            data : {
                buyerName : this.data.cardData.RealName,
                buyerIDCardNo : this.data.cardData.IdCardno,
                buyerCellPhone : this.data.cardData.CellPhone,
                cardNo : this.data.cardData.RandCardNo,
                buyReferrerName : this.data.cardData.buyReferrer
            }
        })

        $Toast.hide()

        if(resData.status != 0){
            $Toast({
                type : 'error' ,
                content : resData.message
            })
            return
        }

        this.setData({
            ifGetCard : true ,
            getCardVis : true ,
            getCardData : resData.data
        })

        
    },
    checkboxChange(){
        if(this.data.ifGetCard){
            return
        }
        this.setData({
            hasRead : !this.data.hasRead
        })
    },
    _getMcahome(){
        commonMethods.Load()
        let _this = this 
        commonMethods.Request({
            apiUrl : API.mcahome
        }).then( res => {
            if(res.status != 0){
                commonMethods.Load('hide')
                $Toast({
                    type : 'warning',
                    content : res.message
                })

                setTimeout( () => {
                    commonMethods.Router({
                        type : 'redirectTo',
                        path : 'register'
                    })
                },2000)

                return
            }

            res.data.showImg = API.IMG_BASE_SERVER_URL + res.data.CardBigPicWithoutNoUrl
            res.data.buyReferrer = ''
            res.data.cardNoFormat = format.cardnoFormat(res.data.RandCardNo)
            _this.setData({
                cardData : res.data
            })

            commonMethods.Load('hide')
        })
    },
    async _getCardRandNum(){
        
        if(this.data.ifGetCard){
            return
        }

        $Toast({
            content: '正在生成随机卡号',
            type: 'loading',
            duration: 0
        });

        let resData = await commonMethods.Request({
            apiUrl : API.genRndCardNo
        }),cardData = this.data.cardData

        if(resData.status != 0){
            $Toast({
                type : 'errpr',
                content : '随机卡号生成失败，请稍后重试'
            })
            return
        }

        cardData.RandCardNo = resData.data
        cardData.cardNoFormat = format.cardnoFormat(resData.data)

        this.setData({
            cardData
        })

        $Toast.hide() 

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){
        this._getMcahome()
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    }, 

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})