
const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
const { $Toast } = require('../../components/iview/base/index');

Page({
    data:{
        searchCardNum : '',
        cardAllData : [],
        activeityName : '',
        payFeeMoney : 0,
        realMoney : 0 ,
        rechargeMinMoney:null,
        keyInput : false,
        activeList : [],
        rechargeMoney : null,
        activeId:'',
        discountId:''
    },
    _inputCardNum(e){
        if(e.detail.value != this.data.searchCardNum){
            this.setData({
                cardAllData : [],
                activeityName : '',
                payFeeMoney : 0,
                realMoney : 0 ,
                rechargeMinMoney:null,
                keyInput : false,
                activeList : [],
                rechargeMoney : null,
                activeId:'',
                discountId:''
            })
        }
        this.setData({
            searchCardNum : format.cardnoFormat(e.detail.value.replace(/ /g,''))
        })
    },
    async _blurCardNum(){
        if(this.data.searchCardNum.length != 19){
            $Toast({
                type : 'warning',
                content : '请输入正确的卡号'
            })
            return
        }

       let searchCard = await commonMethods.Request({
            apiUrl : API.fetchCardDetail, 
            data : {
                cardNo : this.data.searchCardNum.replace(/ /g,'')
            }
        })

        if(!searchCard.data){
            $Toast({
                type : 'error',
                content : searchCard.message
            })

            return 
        }

        this.setData({
            cardAllData : searchCard.data,
            cardImgs : `${API.IMG_BASE_SERVER_URL}${searchCard.data.cardInfo.cardBigPicWithoutNoUrl}`
        })

        this._rechargeFun()
        this._getCardVoucher()

    },
    _rechargeFun(){
        if(this.data.cardAllData.cardInfo.cardSeriesStr.indexOf('CIP') == -1){
            this.setData({
                keyInput : true ,
                rechargeMinMoney : null ,
                activeityName : '',
                payFeeMoney : 0,
                realMoney : 0 
            })
        }else{
            this.setData({
                keyInput : false ,
                rechargeMinMoney : null,
                activeityName : '',
                payFeeMoney : this.data.cardAllData.cardInfo.rechargeMoneyMin,
                realMoney : this.data.cardAllData.cardInfo.rechargeMoneyMin 
            })
        }
    },
    async _getCardVoucher(){
        $Toast({
            content: '加载优惠中',
            type: 'loading',
            duration: 0
        });
        let cardActivity = await commonMethods.Request({
            apiUrl : API.toRecharge ,
            data : {
                cardno:this.data.cardAllData.cardInfo.cardno,
                memberID:app.globalData.sysUserInfo.memberID
            }
        })
        this.setData({
            activeList : cardActivity.data.activityDiscountList
        })
        $Toast.hide()
    },
    _keyBordMoney(e){
        this.setData({
            rechargeMoney : e.detail.value,
            payFeeMoney : e.detail.value
        })
    },
    _keyRechargeMoney(){
        let cardInfo = this.data.cardAllData.cardInfo
        if(this.data.rechargeMoney < cardInfo.rechargeMoneyMin){
            this.setData({
                activeityName : '',
                payFeeMoney : cardInfo.rechargeMoneyMin,
                realMoney : cardInfo.rechargeMoneyMin,
                rechargeMoney : cardInfo.rechargeMoneyMin,
                activeId : '',
                discountId : ''
            })
            $Toast({
                content: '充值金额不能低于最小充值金额',
                type: 'warning'
            });
            return
        }
        let voucherMinMoney = -1 ,voucherIndex = -1
        this.data.activeList.map( (val,index) => {
            if(val.EarnType == 2){
                if(Number(this.data.rechargeMoney) >=  val.EarnRate1 && val.EarnRate1 > voucherMinMoney){
                    voucherMinMoney = val.EarnRate1
                    voucherIndex = index
                }
            }     
        })
        if(voucherMinMoney == -1 || voucherIndex == -1){
            this.setData({
                realMoney : this.data.payFeeMoney,
                activeityName : '',
                activeId : '',
                discountId : ''
            })
            return
        }
        this.setData({
            activeityName : this.data.activeList[voucherIndex].DiscountName,
            realMoney : Number((Number(this.data.payFeeMoney) * (  this.data.activeList[voucherIndex].EarnRate2 / 100 )).toFixed(2)),
            activeId : this.data.activeList[voucherIndex].ActivityID,
            discountId : this.data.activeList[voucherIndex].DiscountID
        })
    },
    async _reachargeForOther(){
        if(this.data.searchCardNum.length != 19){
            $Toast({
                type : 'warning',
                content : '请输入正确的卡号'
            })
            return
        }

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
        rechargeData = await commonMethods.Request({
            apiUrl : API.rechargeCard,
            data : {
                memberID : app.globalData.sysUserInfo.memberID,
                cardNoPrice : 0,
                cardno :this.data.cardAllData.cardInfo.cardno,
                actualPayFee : this.data.realMoney,
                tradeWay : 2,
                payFee : this.data.payFeeMoney,
                activityID : this.data.activeId,
                discountID : this.data.discountId,
                tradeChannel : 3,
                buyerName : app.globalData.sysUserInfo.realName
            }
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

        let cardData = this.data.cardAllData.cardInfo

        wx.requestPayment({
            timeStamp : rechargeData.data.timeStamp,
            nonceStr : rechargeData.data.nonceStr,
            package : rechargeData.data.package,
            signType : rechargeData.data.signType,
            paySign : rechargeData.data.paySign,
            success :(res) => {
                if(res.errMsg != "requestPayment:ok"){
                    commonMethods.Load('hide')
                    $Toast({
                        content: '支付错误,请重试',
                        type: 'error',
                        mask: false
                    })
                    return 
                }
                $Toast.hide()
                commonMethods.Router({
                    type : 'redirectTo',
                    path : 'paySuccess',
                    params : {
                        cardno:format.cardnoFormat(cardData.cardno),
                        cardType:cardData.cardTypeName,
                        orderId:rechargeData.data.orderId,
                        payableMoney:_this.data.payFeeMoney,
                        realMoney:_this.data.realMoney,
                        activeName:_this.data.activeityName,
                        isOther:1
                    }
                })
            },
            fail :(res) => {
                commonMethods.Load('hide')
                $Toast({
                    content: '支付已取消',
                    type: 'error',
                    mask: false
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){

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