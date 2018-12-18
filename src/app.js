// 如果使用async语法，请在顶部依次引入promise和regenerator
import Promise from 'libs/promise'
import regeneratorRuntime from 'libs/regenerator'
// import Request from 'utils/http'
// import Tools from 'utils/tools'
// import wxApi from 'utils/wxApi'
// import Event from 'libs/event.js'
// import Store from 'store/index.js'

import commonMethods from './utils/wxRequest'

App({
  onLaunch (options) {
    this._getNewVersion()
    let _this = this
    wx.login({
      success(res){
        if(res.errMsg != "login:ok" || !res.code){ return }
        _this._login(res.code)
      }
    })

  },
  _getNewVersion(){
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  async _login(wxcode){
    let _this = this ;
    let getSysUserInfo =  await commonMethods.Request({
      apiUrl: '/auth/miniprog/utils/login',
      contentJson:true,
      data:{
        code:wxcode
      }
    })

    if(getSysUserInfo.status != 0){
      _this.globalData.login = getSysUserInfo.message
      return
    }

    let userInfo = getSysUserInfo.data
    
    _this.globalData.sysUserInfo = userInfo

    if(!getSysUserInfo.data.authtoken){
      this.globalData.login = true
      return
    }

      // wx.setStorage({
      //     key:'sysUserInfo',
      //     data:getSysUserInfo.data
      // })
    await commonMethods.setAuthToken(getSysUserInfo.data.authtoken) 
  },
  // 登陆流程代码参考
  // async getUserInfo (cb) {
  //   let login, key, user, dolog
  //   if (this.globalData.userInfo && typeof cb === 'function') {
  //     cb(this.globalData.userInfo)
  //     return
  //   }
  //   try {
  //     // invoke wechat login
  //     login = await this.Tools.wxPromise(wx.login)()

  //     // get session_key
  //     key = this.Http.get('/login/getSessionKey', { code: login.code })
  //     if (+key.status === 0) {
  //       console.log('获取session_key失败: ' + key.data.msg)
  //     } else {
  //       wx.setStorage({ key: 'dr_session', data: key.data.dr_session })
  //     }

  //     // get user information
  //     user = await wxApi.getUserInfo()
  //     if (!user) { return }
  //     Object.assign(this.globalData, {
  //       login: true,
  //       iv: user.iv,
  //       userInfo: user.userInfo,
  //       encryptedData: user.encryptedData
  //     })
  //     typeof cb === 'function' && cb(this.globalData.userInfo)

  //     // login
  //     dolog = this.Http.get('/login/doLogin', {
  //       dr_session: wx.getStorageSync('dr_session'),
  //       encryptedData: user.encryptedData,
  //       iv: user.iv
  //     })
  //   } catch (e) {
  //     console.log('登陆坏掉了', e)
  //   }
  // },

  // Http: new Request,
  // Tools: new Tools,
  // event: new Event,
  // wxApi,
  // Store,
  commonMethods,
  globalData: {
    login: false,
    buyCardID:[],
    sysUserInfo: [],
    wxUserInfo:[],
    buyCardForm:[],
    posCity:'',
    flightData:{
      start:'天津',
      end:'请选择',
      serverFlight : {}
    },
    serverOnlineData : [],
    serverConfirmData : [],
    canGetCard : false,
    cipActiveData : [],
    cipPopState : false
  }
})
