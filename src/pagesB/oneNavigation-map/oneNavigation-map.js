
const app = getApp()
let plugin = requirePlugin("maptx")
const { $Toast } = require('../../components/iview/base/index');
import commonMethods from '../../utils/wxRequest'

Page({
    data:{
        pagePatams : {},
        routeInfo : {}
    },
    _setGoPos(){

        commonMethods.Load()

        let routeInfo = {
            startLat: '',    //起点纬度 选填
            startLng: '',    //起点经度 选填
            startName: '我的位置',   // 起点名称 选填
            endLat: Number(this.data.pagePatams.lat),    // 终点纬度必传
            endLng : Number(this.data.pagePatams.lng),  //终点经度 必传
            endName: this.data.pagePatams.goName,  //终点名称 必传
            mode:''  //算路方式 选填
        }

        this.setData({
            routeInfo
        })

        commonMethods.Load('hide')
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){
        let pagePatams = getCurrentPages()[getCurrentPages().length - 1].options
        this.setData({
            pagePatams
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
        this._setGoPos()
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