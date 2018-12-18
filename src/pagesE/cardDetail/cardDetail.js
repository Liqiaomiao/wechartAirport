
import { Request,Router } from '../../utils/wxRequest.js'
import { cardnoFormat } from '../../utils/format.js'
const { $Toast } = require('../../components/iview/base/index');
const regeneratorRuntime = require('../../libs/regenerator.js')
const app = getApp();
import API from '../../utils/API.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        current:'introduction',
        imgUrl : API.IMG_BASE_SERVER_URL,
        paramcardno:'',
        cardInfo:{
        },
        tradeDetail:[],
        delVisibel:false

    },
    goLink({currentTarget}){
        let url = currentTarget.dataset.url,
        params = {
            pk : this.data.paramcardno
        }

        if(url == 'purchase-detail'){
            params = {
                pk : this.data.cardInfo.cardTypeID ,
                face : this.data.cardInfo.cardSellPrice
            }
        }

        if(url == 'cardOwner'){
            params = {
                cardNo : this.data.cardInfo.cardNo
            }
        }

        Router({
            type : 'navigateTo',
            path : url ,
            params 
        })

    },
    handleChange({detail}){
        if(detail.key == 'detail'){
            if(this.data.tradeDetail.length == 0){
                $Toast({
                    type : 'warning',
                    content : '暂无交易详情'
                })
                return
            }
        }
        this.setData({
            current:detail.key
        })
    },
    handleDel(){/*解除绑定弹窗*/
        this.setData({
            delVisibel:true
        })
    },
    delComfirm(){/*确定解除*/
        this.setData({
            delVisibel:false
        });
        Request({
            apiUrl:API.unbindCard,
            data:{cardNo:this.data.cardInfo.cardNo}
        }).then(({data,status})=>{
            if(status==0){
                $Toast({
                    content:'解绑成功',
                    type:'success'
                })
                setTimeout(()=>{
                    wx.navigateBack({ delta: 1})
                },1000)
            }else{
                $Toast({
                    content:message
                })
            }
        }).catch(err=>{
            $Toast({
                content:'请求失败，请稍后重试',
                type:'error'
            })
        })
    },
    delcancel(){/*取消解除*/
        this.setData({
            delVisibel:false
        })
    },
    async _getData(cardNo){
        let resData = await Request({
            apiUrl : API.showCardDetail,
            data : { cardNo}
        })

        if(resData.status != 0 || resData.data.length == 0){
            $Toast({
                type : 'error',
                content : resData.message
            })
        }

        this.setData({
            paramcardno : resData.data.cardInfo.cardNo.replace(' ','')
        })
        let obj = {
            cardInfo : resData.data.cardInfo,
            superpower : resData.data.services,
            tradeDetail : resData.data.trades,
            total : resData.data.total,
            hasmore : resData.data.total > 1 ? true : false
        }
        obj.cardInfo.cardNo = cardnoFormat(obj.cardInfo.cardNo);

        this.setData(obj);

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        let cardNo = getCurrentPages().slice(-1)[0].options.cardNo;
        this._getData(cardNo)
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