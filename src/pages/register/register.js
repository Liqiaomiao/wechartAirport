
const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
const { $Toast } = require('../../components/iview/base/index');
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'

Page({
    data:{
        bannerImg : API.IMG_BASE_URL + '/ployee.jpg',
        voucherImg : API.IMG_BASE_URL + '/registerVoucher.png',
        registerChecked : true,
        sheetVisible : false,
        tabName : 'news',
        rgCode : '获取验证码',
        rgCodeTime : 60 ,
        smsToken : '',
        isRegister : true,
        formName : '',
        formPhone : '',
        formCode : '',
        registerName : '',
        registerPhone : '',
        getCardVis:false,
        getCardData:[],
        canGetCard : false
    },
    _hiddenGetCard(){
        this.setData({
            getCardVis : false
        })
    },
    async _getMemberCard(){

        $Toast({
            content: '领卡资格查询中',
            type: 'loading',
            duration: 0
        });

        let datas = await commonMethods.Request({
            apiUrl : API.checkMemberQualification
        })

        $Toast.hide()

        if(datas.status != 0){

            $Toast({
                type : 'error',
                content : datas.message
            })

            return
        }

        commonMethods.Router({
            type : 'navigateTo',
            path : 'getMemberCard'
        })
    },
    _seeRegister({currentTarget}){
        let type = currentTarget.dataset.type

        this.setData({
            sheetVisible : type ? true : false
        })
    },
    _setTabs({currentTarget}){
        let tabName = currentTarget.dataset.type
        this.setData({
            tabName
        })
    },
    _exitLogin({currentTarget}){
        let type = currentTarget.dataset.type

        if(type){
            app.globalData.sysUserInfo = []
        }
       
        commonMethods.Router({
            type : 'navigateBack',
            path : 1
        })
    },
    _handleInput({detail,currentTarget}){
        let type = currentTarget.dataset.type
        
        if(type == 'name'){
            this.setData({
                formName : detail.value
            })
        }
        if(type == 'phone'){
            this.setData({
                formPhone : detail.value
            })
        }
        if(type == 'code'){
            this.setData({
                formCode : detail.value
            })
        }
    },
    _radioCheck(){
        let registerChecked = this.data.registerChecked
        this.setData({
            registerChecked : !registerChecked
        })
    },
    async _getSms(){
        let formPhone = this.data.formPhone,
        rgCodeTime = this.data.rgCodeTime

        if(rgCodeTime != 60){
            return
        }

        if(!formPhone){
            $Toast({
                type : 'warning',
                content : '手机号不能为空'
            })
            return
        }

        let resResult = await commonMethods.Request({
            apiUrl : API.getsms,
            contentJson:true,
            data : {
                cellphone : this.data.formPhone
            }
        })

        if(resResult.status != 0){
            $Toast({
                type : 'error',
                content : resResult.message
            })
            return
        }

        this.setData({
            smsToken : resResult.token
        })

        $Toast({
            type : 'success',
            content : '短信发送成功，请注意查收'
        })

        let minusTime = setInterval( () => {

            let time = this.data.rgCodeTime

            if(time > 0){
                time--
                this.setData({
                    rgCode : `${time} 秒` ,
                    rgCodeTime : time
                })
            }else{
                this.setData({
                    rgCode : '获取验证码',
                    rgCodeTime : 60
                })
                clearInterval(minusTime)
            }
        },1000)
        
    },
    async _register(){
        let formName = this.data.formName,
        formPhone = this.data.formPhone,
        formCode = this.data.formCode,
        tabName = this.data.tabName
        if(tabName == 'news'){
            if(!formName){
                $Toast({
                    type : 'warning',
                    content : '姓名不能为空'
                })
                return
            }
        }
        if(!formPhone){
            $Toast({
                type : 'warning',
                content : '手机号不能为空'
            })
            return
        }
        if(!formCode || formCode.length != 6){
            $Toast({
                type : 'warning',
                content : '请输入正确的验证码'
            })
            return
        }

        let result = await  commonMethods.Request({
                apiUrl : API.signup,
                contentJson:true,
                data : {
                    realname: formName,
                    idcardno: '',
                    cellphone: formPhone,
                    secCode: formCode,
                    unionId: app.globalData.sysUserInfo.unionid,
                    openId: app.globalData.sysUserInfo.openid,
                    secCodeToken: this.data.smsToken,
                    isRegistOld: tabName == 'news' ? 0 : 1
                }
            })

            if(result.status != 0){
                $Toast({
                    type : 'error',
                    content : result.message
                })
                return
            }

            app.globalData.sysUserInfo = result.data

            this.setData({
                registerName : app.globalData.sysUserInfo.realName,
                registerPhone : app.globalData.sysUserInfo.cellphone,
                isRegister : true
            })

            $Toast({
                type : 'success',
                content : result.message
            })
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){
        let params = getCurrentPages()[getCurrentPages().length - 1].options,
        appSysUserInfo = app.globalData.sysUserInfo,
        isRegister = false

        if(params.name || params.phone){
            isRegister = true
        }

        if(appSysUserInfo.authtoken && appSysUserInfo.realName || appSysUserInfo.cellphone){
            isRegister = true
        }

        this.setData({
            isRegister,
            registerName : params.name || appSysUserInfo.realName,
            registerPhone : params.phone || appSysUserInfo.cellphone,
            canGetCard : app.globalData.canGetCard
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