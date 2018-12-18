
const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
const { $Toast } = require('../../components/iview/base/index');

Page({
    data:{
        showPage : false,
        memberCardData : [],
        currentSwiper: 0,
        cardNumFormat : [] ,
        priceFormat : [],
        imgUrls: [],
        duration: 1000,
        activeName:'',
        payFeeMoney:0,
        realMoney:0,
        keyBordMoney:null,
        activeList : [],
        activeId : null,
        discountId : null,
        showKeyInput : [],
        startData: null,
        endData : null
    },
    async _rechargeNoe(){
        if(this.data.realMoney == 0){
            $Toast({
                content: '请输入充值金额',
                type: 'error',
                mask: false
            })
            return
        }

        commonMethods.Load('show','支付中')

        let _this = this , 
        rechargeParams = {
            memberID : app.globalData.sysUserInfo.memberID,
            cardNoPrice : 0,
            cardno :this.data.cardNumFormat[this.data.currentSwiper].replace(/ /g,''),
            actualPayFee : this.data.realMoney,
            tradeWay : 2,
            payFee : this.data.payFeeMoney,
            activityID : this.data.activeId,
            discountID : this.data.discountId,
            tradeChannel : 3,
            buyerName : app.globalData.sysUserInfo.realName
        }
        if(!this.data.activeId){ delete rechargeParams['activityID']}
        if(!this.data.discountId){ delete rechargeParams['discountID']}
        
        let rechargeData = await commonMethods.Request({
            apiUrl : API.rechargeCard,
            data : rechargeParams
        })

        if(rechargeData.data.return_code == 'FAIL' || rechargeData.status != 0){
            commonMethods.Load('hide')
            $Toast({
                content: '支付错误,请重试',
                type: 'error',
                mask: false
            })
            return
        }

        let cardData = _this.data.memberCardData[_this.data.currentSwiper]

        wx.requestPayment({
            timeStamp : rechargeData.data.timeStamp,
            nonceStr : rechargeData.data.nonceStr,
            package : rechargeData.data.package,
            signType : rechargeData.data.signType,
            paySign : rechargeData.data.paySign,
            success :(res) => {
                if(res.errMsg != "requestPayment:ok"){
                    commonMethods.Load('hide')
                    return 
                }
                commonMethods.Load('hide')
                commonMethods.Router({
                    type : 'redirectTo',
                    path : 'paySuccess',
                    params : {
                        cardno:format.cardnoFormat(cardData.cardno),
                        cardType:cardData.cardTypeName,
                        orderId:rechargeData.data.orderId,
                        payableMoney:_this.data.payFeeMoney,
                        realMoney:_this.data.realMoney,
                        activeName:_this.data.activeName,
                        isOther:app.globalData.buyCardForm.isForOther
                    }
                })
            },
            fail :(res) => {
                commonMethods.Load('hide')
                $Toast({
                    content: '支付已取消',
                    type: 'error'
                })
            }
        })
        
    },
    /* 为他人充值 */
    _rechargeForOther(){
        commonMethods.Router({
            type : 'navigateTo',
            path : 'rechargeForOther'
        })
    },
    _keyInput(e){
        this.setData({
            keyBordMoney : e.detail.value,
            payFeeMoney : e.detail.value
        })
    },
    /* 键盘输入充值金额 */
    _keyRechargeMoney(){
        if(this.data.keyBordMoney < this.data.memberCardData[this.data.currentSwiper].rechargeMoneyMin){
            this.setData({
                activeName : '',
                payFeeMoney : this.data.memberCardData[this.data.currentSwiper].rechargeMoneyMin,
                realMoney : this.data.memberCardData[this.data.currentSwiper].rechargeMoneyMin,
                keyBordMoney : this.data.memberCardData[this.data.currentSwiper].rechargeMoneyMin,
                activeId : null,
                discountId : null
            })
            $Toast({
                content: '充值金额不能低于最小充值金额',
                type: 'warning'
            });
            return
        }
        let voucherMinMoney = -1,voucherIndex = -1
        this.data.activeList.map( (val,index) => {
            if(val.EarnType == 2){
                if(Number(this.data.keyBordMoney) >=  val.EarnRate1 && val.EarnRate1 > voucherMinMoney){
                    voucherMinMoney = val.EarnRate1
                    voucherIndex = index
                }
            }     
        })
        if(voucherMinMoney == -1 || voucherIndex == -1){
            this.setData({
                realMoney : this.data.payFeeMoney,
                activeName : '',
                activeId : null,
                discountId : null
            })
            return
        }
        this.setData({
            activeName : this.data.activeList[voucherIndex].DiscountName,
            realMoney : Number((Number(this.data.payFeeMoney) * (  this.data.activeList[voucherIndex].EarnRate2 / 100 )).toFixed(2)),
            activeId : this.data.activeList[voucherIndex].ActivityID,
            discountId : this.data.activeList[voucherIndex].DiscountID
        })
    },
     /* 卡轮播更换 */
    _fastSwiperChange(e){
        this.setData({
            currentSwiper: e.detail.current,
            keyBordMoney : null,
            activeName : '',
            payFeeMoney : 0,
            realMoney : 0,
            activeId : '',
            discountId : '',
        })
        this._setRealMoney()
        this._getCardActive()
    },
    _setRealMoney(){
        if(!this.data.showKeyInput[this.data.currentSwiper]){
            this.setData({
                payFeeMoney : this.data.memberCardData[this.data.currentSwiper].rechargeMoneyMin,
                realMoney : this.data.memberCardData[this.data.currentSwiper].rechargeMoneyMin,
                startData: format.dateFormat(this.data.memberCardData[this.data.currentSwiper].startSellDate),
                endData : format.dateFormat(this.data.memberCardData[this.data.currentSwiper].deadlineDate)
            })
        }
    },
    async _getMemberList(){

        commonMethods.Load()

        let cardData = [] ,showKeyInput = [] ,
        cardList = await commonMethods.Request({
            apiUrl : API.memberCard
        })

        if(cardList.data){
            cardList.data.map( (val,index) => {
                if(val.cardSeriesStr.indexOf('EMP') == -1){
                    cardData.push(val)
                    val.cardSeriesStr.indexOf('CIP') == -1 ? showKeyInput.push(true) : showKeyInput.push(false)
                }
            })
            this.setData({
                showKeyInput
            })
        }
        else{
            $Toast({
                content: cardList.message,
                type: 'warning'
            });
            setTimeout( () => {
                commonMethods.Router({
                    type : 'redirectTo',
                    path : 'home'
                })
            },2000)
            return 
        }

        if(cardData){
            let imgs = [],cardNumFormat = [],priceFormat = [],currentSwiper = this.data.currentSwiper,
            params = getCurrentPages()[getCurrentPages().length -1].options.pk
            cardData.map( (val,index) => {
                imgs.push(`${API.IMG_BASE_SERVER_URL}${val.cardPicWithoutNoUrl}`)
                cardNumFormat.push(format.cardnoFormat(val.cardno))
                priceFormat.push(format.priceFormat(val.walletMoney.toString()))
                if(params){
                    if(val.cardno == params){
                        currentSwiper = index
                    }
                }
            })


            this.setData({
                memberCardData : cardData,
                imgUrls : imgs,
                cardNumFormat : cardNumFormat ,
                priceFormat : priceFormat,
                currentSwiper 
            })
        }else{
            $Toast({
                content: '会员名下没有可充值的卡',
                type: 'warning'
            });
            setTimeout( () => {
                commonMethods.Router({
                    type : 'redirectTo',
                    path : 'purchase'
                })
            },2000)
            return
        }
        this._setRealMoney()
        this.setData({
            showPage : true
        })
        commonMethods.Load('hide')
        this._getCardActive()
    },
    async _getCardActive(){
        $Toast({
            content: '加载优惠中',
            type: 'loading',
            duration: 0
        });
        let cardActivity = await commonMethods.Request({
            apiUrl : API.toRecharge ,
            data : {
                cardno:this.data.memberCardData[this.data.currentSwiper].cardno,
                memberID:app.globalData.sysUserInfo.memberID
            }
        })
        this.setData({
            activeList : cardActivity.data.activityDiscountList
        })
        $Toast.hide()    
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){
        this._getMemberList()
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