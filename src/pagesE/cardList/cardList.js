import API from '../../utils/API'
import {Request,Router} from '../../utils/wxRequest.js'
const { $Toast } = require('../../components/iview/base/index');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        cards:[]
    },
    goCardDetail({currentTarget}){

        Router({
            type : 'navigateTo' ,
            path : 'cardDetail',
            params : {
                cardNo : currentTarget.dataset.cardno
            }
        })

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
        wx.setNavigationBarTitle({
            title:'会员卡'
        });
        Request({
            apiUrl:API.cardList,
            tokenState:false,
            method:'GET',
        }).then(({data,status})=>{
            if(status!=0){
                $Toast({
                   content:data.message
                });
                return
            }
            let cards=data;
            this.setData({
                cards
            })

        }).catch(()=>{
            $Toast({
                content:'获取会员卡信息失败，请稍后重试',
                type:'error'
            })
        })
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