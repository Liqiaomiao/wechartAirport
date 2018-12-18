
const app = getApp()
// 如需使用 async/await 引用
// const regeneratorRuntime = require('../../libs/regenerator.js')
// await 的使用 必须在 异步函数中 否则报错
import commonMethods from '../../utils/wxRequest'
const { $Toast } = require('../../components/iview/base/index');

Page({
    data:{
        cellList:[],
        isOther : 0,
        pageType : ''
    },
    _navigateTo(e){

        let paths = e.currentTarget.dataset.type

        if(!paths){
            $Toast({
                content: '敬请期待'
            })
            return 
        }
        commonMethods.Router({
            type : 'reLaunch',
            path : paths
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

        let urlParams = getCurrentPages()[getCurrentPages().length - 1].options, showTetx = []
        
        if(urlParams.pageType == ''){
            $Toast({
                content: '请到卡券管理中查看'
            })
        }

        if(urlParams.pageType == 'server'){
            this.setData({
                pageType : 'server'
            })
        }

        if(urlParams.pageType == 'cip'){
            this.setData({
                pageType : 'cip'
            })
        }
        
        if(urlParams.carno){
            showTetx.push({text:'易出行卡号',value:urlParams.carno})
        }
        if(urlParams.planno){
            showTetx.push({text:'易接机卡号',value:urlParams.planno})
        }
        if(urlParams.cardno){
            showTetx.push({text:'卡    号',value:urlParams.cardno})
        }
        if(urlParams.cardType){
            showTetx.push({text:'卡 类 型',value:urlParams.cardType})
        }
        if(urlParams.carNum){
            showTetx.push({text:'车牌照号',value:urlParams.carNum})
        }
        if(urlParams.carName){
            showTetx.push({text:'姓    名',value:urlParams.carName})
        }
        if(urlParams.orderId){
            showTetx.push({text:'交易单号',value:urlParams.orderId})
        }
        if(urlParams.payableMoney){
            showTetx.push({text:'应付金额',value:urlParams.payableMoney})
        }
        if(urlParams.realMoney){
            showTetx.push({text:'支付金额',value:urlParams.realMoney})
        }
        if(urlParams.activeName){
            showTetx.push({text:'活动名称',value:urlParams.activeName})
        }
        if(urlParams.annualFee && urlParams.cardTypeStr != 'CIP'){
            showTetx.push({text:'会籍费扣除',value:urlParams.annualFee})
        }
        if(urlParams.balance  && urlParams.cardTypeStr != 'CIP'){
            showTetx.push({text:'卡内余额',value:urlParams.balance})
        }

        /* 预约 - 即时消费 */
        
        if(urlParams.appointment){
            showTetx.push({text:'预 约 人',value:urlParams.appointment})
        }
        if(urlParams.cellPhone){
            showTetx.push({text:'联系方式',value:urlParams.cellPhone})
        }
        if(urlParams.cardNum){
            showTetx.push({text:'卡    号',value:urlParams.cardNum})
        }
        if(urlParams.orderNum){
            showTetx.push({text:'订单编号',value:urlParams.orderNum})
        }
        if(urlParams.remarks){
            showTetx.push({text:'备    注',value:urlParams.remarks})
        }

        this.setData({
            cellList : showTetx,
            isOther : urlParams.isOther
        })
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