
const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
const { $Toast } = require('../../components/iview/base/index');
var WxParse = require('../../libs/wxParse/wxParse.js');

Page({
    data:{
        pageParam : '',
        homeParam : '',
        investmentParam : '',
        htmlData : '',
        parsedata:{
            view:{},//样式存储
            nodes:{},//展示需要的存储节点
            images:[],//存放图片对象数组
            imageUrls:[],//存放图片url数组
        }
    },
    async _getHtml(){

        this.setData({
            htmlData : ''
        })

        commonMethods.Load()

        let requestData = {}

        if(this.data.pageParam){
            requestData = {
                apiUrl : API.columnList,
                getParams : this.data.pageParam
            }
        }

        if(this.data.homeParam){
            requestData = {
                apiUrl : API.homeCarouselDetail,
                data : {
                    rsid : this.data.homeParam
                }
            }
        }

        if(this.data.investmentParam){
            requestData = {
                apiUrl : API.content,
                data : {
                    type : this.data.investmentParam
                }
            }
        }

        let htmlDetail = await commonMethods.Request(requestData)

        if(htmlDetail.status != 0){
            $Toast({
                type : 'error',
                content : htmlDetail.message
            })

            return
        }

        let htmlData = '',rgxText = new RegExp('/tbiapic/images/','g')
        
        if(this.data.pageParam){ htmlData = htmlDetail.data[0].detail }

        if(this.data.homeParam){ htmlData = '' }

        if(this.data.investmentParam){ htmlData = htmlDetail.data }

        htmlData = htmlData.replace(rgxText,`${API.IMG_BASE_SERVER_URL}`)

        this.setData({
            htmlData
        })

        this._setHtml()

        commonMethods.Load('hide')
    },
    _setHtml(){

        /**
        * WxParse.wxParse(bindName , type, data, target,imagePadding)
        * 1.bindName绑定的数据名(必填)
        * 2.type可以为html或者md(必填)
        * 3.data为传入的具体数据(必填) 
        * 4.target为Page对象,一般为this(必填)
        * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
        */

        let _this = this, 
        article = this.data.htmlData;
        WxParse.wxParse('article', 'html', article, _this, 5);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){

        let router = getCurrentPages()[getCurrentPages().length - 1].options,
        pageParam = router.type ? router.type : '',
        homeParam = router.homeCarouseId ? router.homeCarouseId : '',
        investmentParam = router.investmentType ? router.investmentType : ''
        
        this.setData({
            pageParam,homeParam,investmentParam
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
        this._getHtml()
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