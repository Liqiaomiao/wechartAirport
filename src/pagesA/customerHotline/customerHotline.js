
const app = getApp()
// 如需使用 async/await 引用
// const regeneratorRuntime = require('../../libs/regenerator.js')
// await 的使用 必须在 异步函数中 否则报错
import API from '../../utils/API'

Page({
    data:{
        bannerImg : `${API.IMG_BASE_URL}/oneCall.png`,
        lineList: [
            {lineName : '贵宾服务预约电话',lineNumber : '4006496888'},
            {lineName : '贵宾服务预约电话',lineNumber : '022-24906888'}
        ]
    },
    _phone(e){
        let phones = e.currentTarget.dataset.phone
        wx.makePhoneCall({
            phoneNumber: phones 
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