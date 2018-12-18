
const app = getApp()
// 如需使用 async/await 引用
// const regeneratorRuntime = require('../../libs/regenerator.js')
// await 的使用 必须在 异步函数中 否则报错
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
const { $Toast } = require('../../components/iview/base/index');


Page({
    data:{
        pageQuery : {} ,
        year : '',
        month : '',
        day : '',
        chooseYear : '',
        chooseMonth : '',
        chooseDay : '',
        currentTabs: 'flightCode',
        startPos : '天津',
        endPos : '请选择',
        searchDate : '',
        searchDateParam : '',
        showCalendar : false,
        flightCode : '',
        calendarData:[],
        paramDate : ''
    },
    _startChangeEnd(){
        let startPos = this.data.startPos,endPos = this.data.endPos
        this.setData({
            startPos : endPos,
            endPos : startPos
        })
        app.globalData.flightData.start = endPos
        app.globalData.flightData.end = startPos
    },
    _flightCodeInput(e){
        let value = e.detail.value
        this.setData({
            flightCode : value.toUpperCase()
        })
    },
    _showCalendar(e){
        let state = e.currentTarget.dataset.state
        this.setData({
            showCalendar : state ? true : false
        })
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
        this.setData({
            chooseYear : chooseDate.year,
            chooseMonth : chooseDate.month,
            chooseDay : chooseDate.day.toString(),
            calendarData : addChoose,
            searchDate : `${chooseDate.year}年${chooseDate.month < 10 ? '0' + chooseDate.month : chooseDate.month }月${chooseDate.day < 10 ? '0' + chooseDate.day : chooseDate.day}日`,
            searchDateParam : `${chooseDate.year}-${chooseDate.month}-${chooseDate.day}`,
            showCalendar : false
        })
    },
    /* 查询 */
    _searchNow(){
        if(this.data.currentTabs == 'flightCode'){
            if(this.data.flightCode == ''){
                $Toast({
                    content: '请输入航班号',
                    type: 'warning',
                })
                return
            }
        }
        if(this.data.currentTabs == 'destination'){
            if(this.data.startPos == '请选择' || this.data.endPos == '请选择'){
                $Toast({
                    content: '请输入起降地',
                    type: 'warning',
                })
                return
            }
            if(this.data.startPos == this.data.endPos){
                $Toast({
                    content: '起降地不能相同',
                    type: 'warning',
                })
                return
            }
        }
        commonMethods.Router({
            type : 'navigateTo',
            path : 'flightResult',
            params : {
                type:this.data.currentTabs,
                code:this.data.flightCode,
                startPos:this.data.startPos,
                endPos:this.data.endPos,
                date:this.data.searchDateParam,
                // paramDate : this.data.paramDate,
                isFlight : this.data.pageQuery.isFlight
            }
        })

    },
    /**
     * 选择地点
     */
    _choosePos(e){
        let type = e.currentTarget.dataset.type
        commonMethods.Router({
            type : 'navigateTo',
            path : 'flightPos',
            params : {
                type : type
            }
        })
    },
     /**
     * 选择查询类型
     */
    handleChange ({ detail }) {
        this.setData({
            currentTabs: detail.key
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){
        let urlParam = getCurrentPages() ,
        pageQuery = urlParam[urlParam.length - 1].options

        this.setData({
            pageQuery
        })
        // if(pageQuery.pageType){
        //     this.setData({
        //         currentTabs : 'destination'
        //     })
        //     if(pageQuery.pageType == 'end'){
        //         this.setData({
        //             endPos : pageQuery.city
        //         })
        //     }else{
        //         this.setData({
        //             startPos : pageQuery.city
        //         })
        //     }
        // }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let nowDate = new Date(),
        nowDateSecond = nowDate.getTime(),
        years = nowDate.getFullYear(),
        month = nowDate.getMonth() + 1,
        days = nowDate.getDate()

        this.setData({
            year : nowDate.getFullYear(),
            month : nowDate.getMonth() + 1,
            day : nowDate.getDate(),
            searchDate : format.dateFormat(nowDateSecond,'zh-CN'),
            searchDateParam : `${years}-${month}-${days}`,
            // paramDate : format.dateFormat(nowDateSecond),
            calendarData : [{month:'current',day:nowDate.getDate(),color:'#FFFFFF',background:'#5CACEE'}]
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            startPos : app.globalData.flightData.start,
            endPos : app.globalData.flightData.end
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