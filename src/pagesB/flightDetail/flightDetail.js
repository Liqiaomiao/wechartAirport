
const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
const { $Toast } = require('../../components/iview/base/index');

Page({
    data:{
        pageParams : {},
        flightDetail : {},
        startTime : '',
        endTime : ''
    },
    async _getFlightDetail(){

        this.setData({
            flightDetail : {}
        })

        commonMethods.Load()

        let detailData = await commonMethods.Request({
            apiUrl : API.getFlightByCode,
            contentJson : true,
            data : {
                flightCode : this.data.pageParams.code,
                sdate : this.data.pageParams.date
            }
        })


        if(detailData.message || detailData.status != 0 || detailData.data.length == 0){

            commonMethods.Load('hide')
            $Toast({
                type : 'error',
                content : detailData.message || '数据加载错误,请返回重试'
            })

            return 
        }

        detailData.data.map( (val,index) => {
            if(this.data.pageParams.start.indexOf(val.startairport) != -1 && this.data.pageParams.end.indexOf(val.endairport) != -1){
                this.setData({
                    flightDetail : val,
                    startTime : val.starttime.split(' ')[1].replace(/(.*):00/,'$1').replace(/:/,' : '),
                    endTime : val.endtime.split(' ')[1].replace(/(.*):00/,'$1').replace(/:/,' : ')
                })
            }
        } )

        commonMethods.Load('hide')

    },
    _navigateServer(){
        commonMethods.Router({
            type : 'navigateTo',
            path : 'serviceReservationIndex'
        })
    },
    async _followFlight(e){

        commonMethods.Load('show','关注航班中')
        
        let types = e.currentTarget.dataset.type,
        codes = e.currentTarget.dataset.flightCode,
        followData = await commonMethods.Request({
            apiUrl : types ? API.unfollowFlight : API.followFlight,
            contentJson : true,
            data : {
                flightCode : codes,
                sdate : this.data.pageParams.date
            }
        })

        commonMethods.Load('hide')

        if(followData.status != 0){
            $Toast({
                type : 'error',
                content : types ? '取消关注航班失败' : '关注航班失败'
            })
            return
        }
        
        $Toast({
            type : 'success',
            content : types ? '取消关注航班成功' : '关注航班成功'
        })

       setTimeout( () => {
            this._getFlightDetail()
       },2000)
        
    },
    _chooseFlight(e){
        let flightDetail = this.data.flightDetail
        commonMethods.Router({
            type : 'navigateBack',
            path : 3
        })

        app.globalData.flightData.serverFlight = {
            flightNo : flightDetail.flightcode,
            departureAirport : flightDetail.startcity,
            destinationAirport : flightDetail.endcity,
            takeoffTime : flightDetail.starttime.replace(/(.*):00/,'$1'),
            landingTime : flightDetail.endtime.replace(/(.*):00/,'$1')
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){

        let pageParams = getCurrentPages()[getCurrentPages().length -1].options

        pageParams.isFlight = pageParams.isFlight == 'false' ? false : true

        this.setData({
            pageParams
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
        this._getFlightDetail()
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