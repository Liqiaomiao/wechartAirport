
const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
const { $Toast } = require('../../components/iview/base/index');

Page({
    data:{
        params : {},
        year : '',
        month : '',
        day : '',
        weeks : '',
        chooseYear : '',
        chooseMonth : '',
        chooseDay : '',
        dateFormat : '',
        calendarData:[],
        showCalendar:false,
        resultData : [],
        oneWeeks : ['日','一','二','三','四','五','六']
    },
    _dateChange(e){
        let getDate = e.detail
        if(getDate.currentMonth != this.data.month || getDate.currentYear != this.data.year){
            this.setData({
                calendarData : []
            })
        }else{
            this.setData({
                calendarData : [
                    {month:'current',day:this.data.day,color:'#FFFFFF',background:'#5CACEE'}
                ]
            })
        }
        if(getDate.currentMonth == this.data.chooseMonth && getDate.currentYear == this.data.chooseYear){
            let oldDate = this.data.calendarData
            oldDate.push({month:'current',day:this.data.chooseDay,color:'#FFFFFF',background:'#FA8072'})
            this.setData({
                calendarData : oldDate
            })
        }
        
    }, 
    _dayClick(e){
        let chooseDate = e.detail,
        addChoose = this.data.calendarData
        if(addChoose.length == 2){
            addChoose[1] = {month:'current',day:chooseDate.day.toString(),color:'#FFFFFF',background:'#FA8072'}
        }else{
            addChoose.push({month:'current',day:chooseDate.day.toString(),color:'#FFFFFF',background:'#FA8072'})
        }

        let chooseDateParam = `${chooseDate.year}-${chooseDate.month}-${chooseDate.day}`,
        getDate = new Date(chooseDateParam.replace(/-/g,'/')),
        getTimes = getDate.getTime(),
        getWeek = getDate.getDay()

        this.setData({
            chooseYear : chooseDate.year,
            chooseMonth : chooseDate.month,
            chooseDay : chooseDate.day.toString(),
            calendarData : addChoose,
            showCalendar : false,
            dateFormat : format.dateFormat(getTimes,'zh-CN'),
            weeks : this.data.oneWeeks[getWeek]
        })

        this._getFlightResult(chooseDateParam)
    },
    /**
     * 查看详情
     */
    _resultDetail(e){
        let codes = e.currentTarget.dataset.flightCode,
        start = e.currentTarget.dataset.start,
        end = e.currentTarget.dataset.end
        commonMethods.Router({
            type : 'navigateTo',
            path : 'flightDetail',
            params : {
                code:codes,
                date:`${this.data.chooseYear}-${this.data.chooseMonth}-${this.data.chooseDay}`,
                start:start,
                end:end,
                isFlight : this.data.params.isFlight
                // paramDate : this.data.params.paramDate
            }
        })
    },
    /**
     * 显示日历面板
     */
    _showCalendar(e){
        let type = e.currentTarget.dataset.state
        this.setData({
            showCalendar : type
        })
    },
    async _getFlightResult(date){

        this.setData({
            resultData : []
         })

        commonMethods.Load()
        
        let results = '',apis = '',datas = {}
        if(this.data.params.type == 'destination'){
            apis = API.getFlightByTrip
            datas = {
                startCity : this.data.params.startPos,
                endCity : this.data.params.endPos,
                sdate : date ? date : this.data.params.date
                // paramDate : this.data.params.paramDate
            }  
        }
        if(this.data.params.type == 'flightCode'){
            apis = API.getFlightByCode
            datas = {
                flightCode : this.data.params.code,
                sdate : date ? date : this.data.params.date
                // paramDate : this.data.params.paramDate
            }
        }

        results = await commonMethods.Request({
            apiUrl : apis ,
            contentJson : true,
            data : datas
        })

        if(results.message || results.status != 0){
            commonMethods.Load('hide')
            $Toast({
                type : 'error',
                content : results.message
            })
            return
        }

        let dataFormat = []

        if(this.data.params.type == 'flightCode'){
            results.data.map( (val,index) => {
                dataFormat.push({
                    planstarttime : val.starttime.split(' ')[1].replace(/:00/g,''),
                    planendtime : val.endtime.split(' ')[1].replace(/:00/g,''),
                    startairport : val.startairport ,
                    endairport : val.endairport,
                    logo : val.logo,
                    aircompanyname : val.aircompanyname,
                    flightcode : val.flightcode,
                    startcity : val.startcity,
                    endcity : val.endcity
                })
            })
        }else{
            dataFormat = results.data
        }

        this.setData({
            resultData : dataFormat
        })
        commonMethods.Load('hide')
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
                sdate : `${this.data.year}-${this.data.month}-${this.data.day}`
            }
        })

        commonMethods.Load('hide')

        if(followData.message || followData.status != 0){
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
            this._getFlightResult()
       },2000)
        
    },
    _chooseFlight(e){

        let chooseData = e.currentTarget.dataset.flight

        commonMethods.Router({
            type : 'navigateBack',
            path : 2
        })

        app.globalData.flightData.serverFlight = {
            flightNo : chooseData.flightcode,
            departureAirport : chooseData.startcity ? chooseData.startcity : this.data.params.startPos,
            destinationAirport : chooseData.endcity ? chooseData.endcity : this.data.params.endPos,
            takeoffTime : `${this.data.params.date} ${chooseData.planstarttime}`,
            landingTime : `${this.data.params.date} ${chooseData.planendtime}` 
        }

    },
    _navigateServer(){
        commonMethods.Router({
            type : 'navigateTo',
            path : 'serviceReservationIndex'
        })
    },
    _setPageOpts(){
        let pageParam = getCurrentPages()[getCurrentPages().length - 1].options,
        nowDate = new Date(pageParam.date.replace(/-/g,'/')),
        nowDateSecond = nowDate.getTime(),
        nowDateYear = nowDate.getFullYear(),
        nowDateMonth = nowDate.getMonth() + 1 ,
        nowDateDate = nowDate.getDate()

        pageParam.isFlight = pageParam.isFlight == 'false' ? false : true

        this.setData({
            params : pageParam,
            chooseYear : nowDateYear,
            chooseMonth : nowDateMonth,
            chooseDay : nowDateDate,
            dateFormat : format.dateFormat(nowDateSecond,'zh-CN'),
            weeks : this.data.oneWeeks[nowDate.getDay()]
        }) 
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){
        this._setPageOpts()
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
        let nowDate = new Date(),
        years = nowDate.getFullYear(),
        months = nowDate.getMonth() + 1,
        days = nowDate.getDate() 

        this.setData({
            year : years,
            month : months ,
            day : days,
            calendarData : [{month:'current',day : days ,color:'#FFFFFF',background:'#5CACEE'}]
        })
        this._getFlightResult()
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