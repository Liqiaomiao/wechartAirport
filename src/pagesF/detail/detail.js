import Promise from '../../libs/promise'
import regeneratorRuntime from '../../libs/regenerator'
import {Request,Load} from '../../utils/wxRequest'
import API from '../../utils/API'
const { $Toast } = require('../../components/iview/base/index');
import {priceFormat,dateFormat} from '../../utils/format'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        IMG_BASE_SERVER_URL:API.IMG_BASE_SERVER_URL,
        detail:{}
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
    async _showData() {
        Load();
        let params = getCurrentPages().slice(-1)[0].options;
        let pk = params.pk;
        let tradeType = params.tradeType;
        let {data, status, message} = await  Request({
            apiUrl: API.showSingleTradeDetail,
            data: {pk, tradeType}
        });
        Load('hide');
        if (status == 0) {
            data.actualPayFeeFmt=priceFormat(data.actualPayFee,1);
            data.createdTimeFmt=dateFormat(data.createdTime,'all zh-CN');
            this.setData({
               detail: data
            });
        }else{
            $Toast({
                content:message,
                type:'warning'
            })
        }



    },
    goEvaluate({currentTarget}) {
        let pk = currentTarget.dataset.pk;
        wx.navigateTo({
            url:`../../pagesA/evaluate/evaluate?pk=${pk}`
        })
    },
    onShow: function () {

        this._showData();


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