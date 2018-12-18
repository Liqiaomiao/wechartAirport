
const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
const { $Toast,$Message } = require('../../components/iview/base/index');

Page({
    data:{
        operationCarId : '',
        operateType : '',
        delCarData : '',
        delDialogState : false ,
        delDialogData : [
            {
                name: '取消'
            },
            {
                name: '删除',
                color: '#b99156',
                loading: false
            }
        ],
        loadingData : {
            state : false ,
            text : ''
        },
        isOperation : false,
        carList : [],
        operationCarNum : ''
    },
    _delCarNumber(e){
        this.setData({
            delDialogState: true,
            delCarData : e.currentTarget.dataset.car
        });
    },
    _editCarNumber(e){
        this.setData({
            operationCarNum : e.currentTarget.dataset.number,
            isOperation : true,
            operateType : 'edit',
            operationCarId : e.currentTarget.dataset.id
        });
    },
    async _handleClickDelDialog () {

        let dialogLoad = this.data.delDialogData
        dialogLoad[1].loading = true
        this.setData({
            delDialogData: dialogLoad
        });

        let delData = await commonMethods.Request({
            apiUrl : API.memberCarNumDel,
            data : {
                memberID:app.globalData.sysUserInfo.memberID,
                carNum: this.data.delCarData
            }
        })

        if(delData.status != 0){
            $Toast({
                type : 'error',
                content : delData.message
            })
            return
        }

        dialogLoad[1].loading = false
        this.setData({
            delDialogState: false,
            delDialogData: dialogLoad
        });
        $Toast({
            type : 'success',
            content : '删除成功'
        })

        setTimeout( () => {
            this._getCarList()
        },2000)
    },
    _loading(state,text){
        let load = this.data.loadingData

        load.state = state == 'hide' ? false : true
        load.text = text ? text : '加载中'

        this.setData({
            loadingData : load
        })
    },
    _operationInput(e){
        let type = e.currentTarget.dataset.state
        this.setData({
            operationCarNum : type ? e.detail.detail.value : ''
        })
    },
    _operationCar(e){
        let type = e.currentTarget.dataset.state
        this.setData({
            isOperation : type
        })
    },
    async _getCarList(){

        this.setData({
            carList : []
        })

        this._loading()

        let carList = await commonMethods.Request({
            apiUrl : API.memberCarNumLst
        })

        if(carList.status != 0){
            this._loading('hide')
            $Toast({
                type : 'error',
                content : carList.message
            })
            return
        }

        this.setData({
            carList : carList.data
        })

        this._loading('hide')
    },
    async _operateCarNumber(){

        if(this.data.operationCarNum == ''){
            $Toast({
                type : 'warning',
                content : '车牌号不能为空'
            })
            return
        }

        let _this = this , apis = '' , datas={} , operateType = this.data.operateType


        if(operateType == 'edit'){
            apis = API.memberCarNumEdit
            datas = {
                id:this.data.operationCarId,
                memberID:app.globalData.sysUserInfo.memberID,
                carNum:this.data.operationCarNum.toUpperCase()
            }
        }else{
            apis = API.memberCarNumAdd
            datas = {
                memberID:app.globalData.sysUserInfo.memberID,
                carNum:this.data.operationCarNum.toUpperCase()
            }
        }

        this._loading('show',operateType == 'edit' ? '修改中' : '添加中')

        let operateResult = await commonMethods.Request({
            apiUrl : apis,
            data : datas
        })

        if(operateResult.status != 0){
            $Toast({
                type : 'error',
                content : operateResult.message
            })
            return
        }

        this._loading('hide')

        $Toast({
            type : 'success',
            content : operateType == 'edit' ? '修改成功' : '添加成功'
        })

        this.setData({
            operationCarNum : '',
            isOperation : false,
            operateType : '',
            operationCarId : ''
        })

        setTimeout( () => {
            this._getCarList()
        },2000)

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
        this._getCarList()
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