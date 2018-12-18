
const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
const { $Toast } = require('../../components/iview/base/index');

Page({
    data:{
        buyCardNum:'',
        buyCardFormatNum:'',
        buyCardImg:'',
        buyCardPrice:'',
        cardPrice:0,
        buyCardType:'',
        activeName:'',
        payableMoney:0,
        realMoney:0,
        annualFee:0
    },
    async _buyCardNow(){

        commonMethods.Load('show','支付中')

        let _this = this, 
        sellCard = await commonMethods.Request({
            apiUrl :  API.sellCard,
            data : {
                cardno : this.data.buyCardNum,
                actualPayFee : this.data.realMoney,
                payFee : this.data.payableMoney,
                tradeWay : '2',
                tradeChannel : 3,
                buyerName : app.globalData.buyCardForm.name,
                buyerIDCardNo : app.globalData.buyCardForm.userInfoID,
                buyerCellPhone : app.globalData.buyCardForm.phone,
                cardNoPrice : this.data.cardPrice,
                isForOther : app.globalData.buyCardForm.isForOther,
                buyerMemberID : app.globalData.sysUserInfo.memberID,
                bindCarNum : app.globalData.buyCardForm.userInfoCardNum,
                buyReferrer : app.globalData.buyCardForm.userInfoBuyReferrer,
                memberID : app.globalData.sysUserInfo.memberID,
                activityID : app.globalData.buyCardID.activityID,
                discountID : app.globalData.buyCardID.discountID
            }
        })

        if(sellCard.data.return_code == 'FAIL' || sellCard.status != 0){
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
                            cardno:format.cardnoFormat(_this.data.buyCardNum),
                            cardType:_this.data.buyCardType,
                            cardTypeStr:app.globalData.buyCardID.cardType,
                            orderId:sellCard.data.orderId,
                            payableMoney:_this.data.payableMoney,
                            realMoney:_this.data.realMoney,
                            activeName:_this.data.activeName,
                            carNum:app.globalData.buyCardForm.userInfoCardNum,
                            carName:app.globalData.buyCardForm.name,
                            isOther:app.globalData.buyCardForm.isForOther,
                            annualFee:_this.data.annualFee,
                            balance:_this.data.payableMoney - _this.data.cardPrice -_this.data.annualFee
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
            buyCardNum : buyCardParams.cardno,
            buyCardFormatNum : format.cardnoFormat(buyCardParams.cardno),
            cardPrice : buyCardParams.cardPrice,
            buyCardImg : `${API.IMG_BASE_SERVER_URL}${app.globalData.buyCardID.cardBigPicWithoutNoUrl}`,
            buyCardType : app.globalData.buyCardID.cardTypeName
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
        
        this._toSellCard()
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