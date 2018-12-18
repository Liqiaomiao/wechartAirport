
const app = getApp()
const { $Toast } = require('../../components/iview/base/index');
import commonMethods from '../../utils/wxRequest'

Page({
    data:{
        cellData:[
            // {icon:'icon-zhanghu',text:'账户安全',urls:'accountSecurity',isUse:true},
            {icon:'icon-phone',text:'客户热线',urls:'customerHotline',params:{},isUse:true},
            {icon:'icon-car',text:'车牌管理',urls:'carNumberMgt',params:{},isUse:true},
            {icon:'icon-our',text:'关于我们',urls:'common-htmlParse',params:{type:'ABOUT_ME'},isUse:true},
        ],
        userAvatarUrl:'',
        userNickName : ''
    },
    _navMyInfo(){
        commonMethods.Router({
            type : 'navigateTo',
            path : 'myInfo'
        })
    },
    /* 获取用户信息 */
    _getUserInfo(){
        let _this = this;
        wx.getUserInfo({
            success: function(res) {
                if(res.errMsg != "getUserInfo:ok" ){
                    return
                }
                app.globalData.wxUserInfo = res.userInfo
                _this.setData({
                    userAvatarUrl : res.userInfo.avatarUrl,
                    userNickName : res.userInfo.nickName
                })
            }
        })  
    },
    /* 获取微信设置 */
    _getWxSetting(){
        let _this = this ;
        wx.getSetting({
            success: (res) => {
                let wxSetting = res.authSetting
                if(wxSetting['scope.userInfo']){ 
                    _this._getUserInfo()
                    return 
                }
                
                wx.authorize({
                    scope: 'scope.userInfo',
                    success() {
                        _this._getUserInfo()
                    }
                })
            }
        })
    },
    /* 点击登陆 */
    _clickLogin(){
        this._getWxSetting()
    },
    /* 点击操作按钮 */
    _cellOperate(e){
        let cellUrls = e.currentTarget.dataset.urls,
        cellUse = e.currentTarget.dataset.isUse,
        cellParam = e.currentTarget.dataset.params,
        paramKey = Object.getOwnPropertyNames(cellParam)[0]

        if(!cellUrls || !cellUse){
            $Toast({
                content: '敬请期待！'
            });
            return 
        }

        commonMethods.Router({
            type : 'navigateTo',
            path : cellUrls,
            params : cellParam
        }).catch( err => {})
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
        this.setData({
            userAvatarUrl : app.globalData.wxUserInfo.avatarUrl ? app.globalData.wxUserInfo.avatarUrl : '',
            userNickName : app.globalData.wxUserInfo.nickName ? app.globalData.wxUserInfo.nickName : ''
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