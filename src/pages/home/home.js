
const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
const { $Toast } = require('../../components/iview/base/index');
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
// 引用高德地图微信小程序JSAPI模块 
const amapFile = require('../../libs/amap-wx.js'); 

import Watch from '../../libs/watch'
let watch;

Page({
    data:{
        cipActive : false,
        showProm : false,
        weathers : '&emsp;',
        locations:'获取位置中', 
        sms_token : '',//短信验证码token
        bindUserPhone:false, //绑定手机号窗口状态
        userPhone : '',//手机号
        rgCode : '',//手机号验证码 
        rgName : '',
        codeText:'获取验证码',
        imgAPI : API.IMG_BASE_SERVER_URL,
        investmentList:[
            {title:'招商合作',imgUrl:`${API.IMG_BASE_URL}zhaoshang1-1.jpg`,details:'点击查看详情',type:1},
            {title:'广告招商',imgUrl:`${API.IMG_BASE_URL}zhaoshang1-2.png`,details:'点击查看详情',type:2},
            {title:'车位招商',imgUrl:`${API.IMG_BASE_URL}zhaoshang1.jpg`,details:'点击查看详情',type:3},
        ],
        cipImgData : ''
    },
    watch:{
    
    },
    _closeCipPop(){
        app.globalData.cipPopState = true
        this.setData({
            cipActive : false 
        })
    },
    _cipActive(){
        commonMethods.Router({
            type : 'navigateTo',
            path : 'purchase',
            params : {
                current : 'easyCartoon'
            }
        })
    },
    _investmentDetail({currentTarget}){
        if(!currentTarget.dataset.index){
            $Toast({
                type : 'error',
                content : '获取消息详情错误，请稍后重试'
            })
            return
        }
        commonMethods.Router({
            type : 'navigateTo',
            path : 'common-htmlParse',
            params : {
                investmentType : currentTarget.dataset.index
            }
        })

    },
    _bindUserPhone(){
        this.setData({
            bindUserPhone : true
        })
    },
    async _getPopup(){
        if(app.globalData.cipPopState){ return }
        let resData = await commonMethods.Request({
            apiUrl : API.checkpopup
        })

        if(resData.status != 0){
            return
        }

        this.setData({
            cipActive : true,
            cipImgData : this.data.imgAPI + resData.data.popupimg
        })
        
    },
    async _login(){
        commonMethods.Load()
        let _this = this, inervalTime = 0,
        intervalAuthToken = setInterval( () => {

            if(typeof app.globalData.login === 'string'){
                commonMethods.Load('hide')
                _this.setData({
                    showProm : true
                }) 
                clearInterval(intervalAuthToken)
                $Toast({
                    type : 'error',
                    content : app.globalData.login 
                })
                return
            }

            if(app.globalData.login || inervalTime == 120){

                _this._setTimeout()
                _this.setData({
                    showProm : true
                }) 
                clearInterval(intervalAuthToken)
                return
            }

            if(app.globalData.sysUserInfo){
                if(app.globalData.sysUserInfo.authtoken){
                    _this._setTimeout()
                    _this.setData({
                        showProm : true
                    }) 
                    clearInterval(intervalAuthToken)
                    return
                }
            }
            inervalTime++
        },500) 
      },
      _setTimeout(){
        let _this = this
        setTimeout( ()=> {
            if(app.globalData.sysUserInfo){
                if(!app.globalData.sysUserInfo.authtoken){
                    _this._bindUserPhone()
                }else{
                    app.globalData.login = false
                    _this._getWxSetting()
                }
            }else{
                _this._bindUserPhone()
            }
            commonMethods.Load('hide')
        },1000)
      },
    _setPhone(e){
        let type = e.currentTarget.dataset.settype
        this.setData({
            userPhone : type == 'clear' ? '' : e.detail.value
        })
    },
    _setCode(e){
        let type = e.currentTarget.dataset.settype
        this.setData({
            rgCode : type == 'clear' ? '' : e.detail.value
        })
    },
    _setName(e){
        let type = e.currentTarget.dataset.settype
        this.setData({
            rgName : type == 'clear' ? '' : e.detail.value
        })
    },
    async _getSMS(){
        let _this = this;
        if(this.data.userPhone.length == 0){
            $Toast({
                type : 'waring',
                content: '手机号不能为空'
            })
            return
        }
        if(this.data.codeText != '获取验证码'){ return }

        let smsToken = await commonMethods.Request({
            apiUrl : API.getsms,
            contentJson:true,
            data : {
                cellphone : _this.data.userPhone
            }
        })
        if(smsToken.status != 0){
            $Toast({
                type : 'waring',
                content: '短信发送失败，请稍后重试'
            })
            return
        }

        this.setData({
            sms_token : smsToken.token
        })  

        let startTime = 60, 
        codeTime = setInterval( () => {
            if(startTime == 0){
                _this.setData({
                    codeText : '获取验证码'
                })
                clearInterval(codeTime)
                return
            }
            _this.setData({
                codeText : `${startTime} 秒`
            })
            startTime--
        },1000)

        $Toast({
            type : 'sucess',
            content: '短信发送成功，请注意查收'
        })

        // this.setData({
        //     rgCode : '123456'
        // })

    },
    async _bindPhone(){
        let _this = this;
        if(this.data.rgCode.length < 6 ){
            $Toast({
                type : 'waring',
                content: '请输入正确的验证码'
            })
            return
        }
        let sysUserInfo = await commonMethods.Request({
            apiUrl : API.bind,
            contentJson:true,
            data : {
                realname : _this.data.rgName,
                cellphone : _this.data.userPhone,
                idcardno : '',
                secCode : _this.data.rgCode,
                unionId : app.globalData.sysUserInfo.unionid ,
                openId : app.globalData.sysUserInfo.openid,
                secCodeToken : _this.data.sms_token
            }
        })

        if(sysUserInfo.status != 0){
            $Toast({
                type : 'error',
                content: sysUserInfo.message 
            })
            return
        }

        app.globalData.sysUserInfo = sysUserInfo.data

        await commonMethods.setAuthToken(sysUserInfo.data.authtoken)

        this._hideBindPhone()
        
        $Toast({
            type : 'success',
            content: sysUserInfo.message
        })

        setTimeout( () => {
            commonMethods.Router({
                type : 'reLaunch',
                path : 'home'
            })
        },1000)

    },
    _callPhone(e){
        let _this = this ,
        phoneNumber = e.currentTarget.dataset.phone
        wx.makePhoneCall({
            phoneNumber: phoneNumber
          })
    },
    _hideBindPhone(){
        this.setData({
            bindUserPhone : false
        })
    }, 
    _initBaiduMap(){
        let _this = this; 
        // 新建高德地图对象 
        var myAmapFun = new amapFile.AMapWX({key:'255a6459a7291af8823f52a0ebc9841f'});
        myAmapFun.getRegeo({
            success: function(location){
                //成功回调
                _this.setData({
                    locations:location[0].regeocodeData.addressComponent.province+location[0].name
                })
                app.globalData.posCity = location[0].regeocodeData.addressComponent.province                    
            },
            fail: function(info){
                //失败回调
                _this.setData({
                    locations:'&emsp;'
                })
            }
        })

        myAmapFun.getWeather({
            success: function(data){
                if(data.weather.data && data.winddirection.data && data.temperature.data){
                    _this.setData({
                        weathers : `${data.weather.data} ${data.winddirection.data} ${data.temperature.data}℃`
                      })
                }else{
                    _this.setData({
                        weathers : '&emsp;'
                      })
                }
        
            },
            fail: function(info){
              _this.setData({
                weathers : '&emsp;'
              })
            }
          })
    },
    _getWxSetting(){
        let _this = this ;
        wx.getSetting({
            success: (res) => {
                let wxSetting = res.authSetting
                if(wxSetting['scope.userLocation']){ 
                    _this._initBaiduMap()
                    return 
                }
                
                wx.authorize({
                    scope: 'scope.userLocation',
                    success() {
                        _this._initBaiduMap()
                    }
                })
            }
        })
    },
    watch_demo(e) {
        // 扩展原生小程序setData方法: (改变数据 更新视图) + 触发回调（假如有配置）
        // watch.setData({
        //     userPhone: 1111112
        // })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad : function () {
        // 实例化watch
        watch = new Watch(this)
        // commonMethods.Router({
        //     type : 'navigateTo',
        //     path : 'purchase'
        // })
        this._login()
        this._getPopup()
        // wx.navigateTo({
        //     url : '/pagesD/serviceReservationOnline/serviceReservationOnline'
        // })
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
       if(app.globalData.login){
            this._login()
       }
       if(app.globalData.sysUserInfo){
            if(!app.globalData.sysUserInfo.authtoken){
                this._login()
                
            }
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