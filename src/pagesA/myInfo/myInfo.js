
const app = getApp();
const { $Toast } = require('../../components/iview/base/index');
import commonMethods from '../../utils/wxRequest'

Page({
    data:{
        wxUserInfo : [],
        hobbyList:[
            {text:'足球'},
            {text:'乒乓球'},
            {text:'羽毛球'},
            {text:'游泳'},
            {text:'击剑'},
            {text:'跑步'}
        ],
        hobbyCheck:[],
        exitModal:false,
        exitActions:[
            {
                name: '取消',
                color: '#80848f'
              },
              {
                name: '确定',
                color: '#b99156'
              }
        ]
    },
    _showExitModal(type){
        this.setData({
            exitModal : type ? true : false 
        })
    },
    _exitLogin({detail}){

        this._showExitModal()
        
        const index = detail.index;

        if(index === 1){
            app.globalData.wxUserInfo = []
            this._setGlobalUserInfo()
            $Toast({
                type : 'success',
                content: '退出成功'
            });
            
            setTimeout( ()=> {
                commonMethods.Router({
                    type : 'navigateBack',
                    path : 1
                })
            },2000)
        }
    },
    _checkHobby(e){
        let clickHobby = e.currentTarget.dataset.listIndex,
        hobby = this.data.hobbyCheck
        hobby[clickHobby] = !hobby[clickHobby]
        this.setData({
            hobbyCheck : hobby
        })
    },
    _setGlobalUserInfo(){

        let checkInit = []
        this.data.hobbyList.map( val => {
            checkInit.push(false)
        })

        this.setData({
            wxUserInfo : app.globalData.wxUserInfo,
            hobbyCheck : checkInit
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){
        this._setGlobalUserInfo()
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