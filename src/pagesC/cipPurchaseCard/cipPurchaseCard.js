
const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
const { $Toast } = require('../../components/iview/base/index');

Page({
    data:{
        imgUrl : API.IMG_BASE_SERVER_URL,
        cipData : [],
        buyCardNum:'',
        buyCardFormatNum:'',
        buyCardImg:'',
        buyCardPrice:'',
        cardPrice:0,
        buyCardType:'',
        activeName:'CIP - 嘉宾服务套卡',
        payableMoney:720,
        realMoney:600,
        annualFee:0,
        carno : '', 
        carnoFormat : '',
        planno : '',
        plannoFormat : ''
    },
    async _buyCardNow(){

        commonMethods.Load('show','支付中')

        let _this = this, 
        sellCard = await commonMethods.Request({
            apiUrl :  API.sellMultiCard,
            data : {
                actualPayFee : this.data.realMoney,
                payFee : this.data.payableMoney,
                tradeWay : '2',
                tradeChannel : 3,
                'commodityLst[0][cardNo]' :this.data.carno,
                'commodityLst[0][cardNoPrice]' : 0,
                'commodityLst[1][cardNo]' : this.data.planno,
                'commodityLst[1][cardNoPrice]' : 0 ,
                buyerName : app.globalData.buyCardForm.name,
                buyerIDCardNo : app.globalData.buyCardForm.userInfoID,
                buyerCellPhone : app.globalData.buyCardForm.phone,
                isForOther : app.globalData.buyCardForm.isForOther,
                buyerMemberID : app.globalData.sysUserInfo.memberID,
                bindCarNum : app.globalData.buyCardForm.userInfoCardNum,
                buyReferrer : app.globalData.buyCardForm.userInfoBuyReferrer,
                memberID : app.globalData.sysUserInfo.memberID,
                activityID : app.globalData.cipActiveData.activityID
            }
        })

        if(sellCard.status != 0 || sellCard.data.return_code == 'FAIL'){
            commonMethods.Load('hide')
            $Toast({
                content: '支付错误,请重试',
                type: 'error',
                mask: false
            })
            return
        }

        wx.requestPayment({
            timeStamp : sellCard.data.timeStamp,
            nonceStr : sellCard.data.nonceStr,
            package : sellCard.data.package,
            signType : sellCard.data.signType,
            paySign : sellCard.data.paySign,
            success :(res) => {
                if(res.errMsg != "requestPayment:ok"){
                    commonMethods.Load('hide')
                    return 
                }
                commonMethods.Load('hide')
                $Toast({
                    content: '支付成功',
                    type: 'success'
                })
                setTimeout( () => {
                    commonMethods.Router({
                        type : 'redirectTo',
                        path : 'paySuccess',
                        params : {
                            carno : this.data.carnoFormat,
                            planno : this.data.plannoFormat,
                            orderId : sellCard.data.orderId,
                            payableMoney : _this.data.payableMoney,
                            realMoney : _this.data.realMoney,
                            activeName : _this.data.activeName,
                            carNum : app.globalData.buyCardForm.userInfoCardNum,
                            carName : app.globalData.buyCardForm.name,
                            isOther : app.globalData.buyCardForm.isForOther,
                            pageType : 'cip'
                        }
                    })
                },2000)
            },
            fail :(res) => {
                commonMethods.Load('hide')
                $Toast({
                    content: '支付已取消',
                    type: 'warning'
                })
            }
        })
       
    },
    async _toSellCard(){
        commonMethods.Load()
        let buyCardData = app.globalData.buyCardID,
        voucherData = await commonMethods.Request({
            apiUrl : '/wechat/card/toSellCard',
            data : {
                cardno : this.data.buyCardNum,
                memberID : app.globalData.sysUserInfo.memberID,
                activityID : buyCardData.activityID,
                discountID : buyCardData.discountID
            }
        })

        let cardDetails = voucherData.data.card

        voucherData.data.activityDiscountList.map( val => {
            if(val.ActivityID == buyCardData.activityID && val.DiscountID == buyCardData.discountID){
                this.setData({
                    annualFee : voucherData.data.card.annualFee,
                    buyCardPrice : Number(cardDetails.cardSellPrice),
                    payableMoney : Number(cardDetails.cardFacePrice) +  Number(cardDetails.cardNoPrice),
                    realMoney :   Number(cardDetails.cardSellPrice) +  Number(cardDetails.cardNoPrice)
                })
                if(val.EarnValue != 100){
                    this.setData({
                        activeName : app.globalData.buyCardID.discountName
                    })
                }else{
                    this.setData({
                        activeName : ''
                    })
                }
            }
        })

        if(this.data.payableMoney == 0 && this.data.realMoney == 0){
            this.setData({
                buyCardPrice : Number(app.globalData.buyCardID.cardSellPrice),
                payableMoney : Number(app.globalData.buyCardID.cardFacePrice) + this.data.cardPrice,
                realMoney :  Number(app.globalData.buyCardID.cardSellPrice) +this.data.cardPrice,
                activeName : app.globalData.buyCardID.discountName,
                annualFee : 0,
            })
        }
        commonMethods.Load('hide')
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){
        let buyCardParams = getCurrentPages()[getCurrentPages().length - 1].options
        this.setData({
            carno : buyCardParams.carno,
            carnoFormat : format.cardnoFormat(buyCardParams.carno),
            planno : buyCardParams.planno,
            plannoFormat : format.cardnoFormat(buyCardParams.planno),
            cipData : app.globalData.cipActiveData
        })
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
        
        // this._toSellCard()
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