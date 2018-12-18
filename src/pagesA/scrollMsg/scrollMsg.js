
const app = getApp()
const { $Toast } = require('../../components/iview/base/index');
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'

Page({
    data:{
        msgData : [],
        currentIndex : -1,
        currentId : ''
    },
    _detail({currentTarget}){
        let  currentIndex = currentTarget.dataset.type ? currentTarget.dataset.index : -1

        this.setData({
            currentIndex  
        })
        
    },
    async _getMsgData(){
        let msgResData = await commonMethods.Request({
            apiUrl:API.columnList,
            getParams : 'NOTICE'
        })

        if(msgResData.status != 0 || msgResData.length > 0){
            $Toast({
                type : 'error',
                content : '数据错误,请稍后重试'
            })
            return
        }

        let msgData = [],currentId = this.data.currentId,currentIndex = this.data.currentIndex
        msgResData.data.map( (val,nums) => {
            val.createdTime = format.dateFormat(val.createdTime,'all')
            if(val.id == currentId){
                currentIndex = nums
            }
        })

        msgData = msgResData.data

        this.setData({
            msgData,
            currentIndex
        })
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){
       this._getMsgData()
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
        let currentId = getCurrentPages()[getCurrentPages().length - 1].options.msgId
        if(currentId){
            this.setData({
                currentId
            })
        }
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