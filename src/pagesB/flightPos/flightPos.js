
const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
const { $Toast } = require('../../components/iview/base/index');

Page({
    data:{
        currentTabs: 'domestic',
        pageType : '',
        cityData:[],
        choosePosID : '',
        setPosId : '',
        commonCity: [],
        nowCity : '',
        scrollPosHeight : 1020,
        commonViewHeight : 80
    },
    _getCommonCity(){

        let commoncitys = wx.getStorageSync('commonCity')

        this.setData({
            commonCity : commoncitys
        })
        if(commoncitys.length != 0){
            if(commoncitys.length <= 4){
                this.setData({
                    scrollPosHeight : this.data.scrollPosHeight - 172
                })
            }else{
                this.setData({
                    scrollPosHeight : this.data.scrollPosHeight - 252,
                    commonViewHeight : 160
                })
            }
        }      
        
    },
    _chooseCitoesItem(e){
        let chooseCity = e.currentTarget.dataset.city ,
        cityItem = wx.getStorageSync('commonCity'),
        selectState = false

        if(this.data.pageType == 'start'){
            app.globalData.flightData.start = chooseCity
        }else{
            app.globalData.flightData.end = chooseCity
        }


        commonMethods.Router({
            type : 'navigateBack',
            path : 1
            // `/pages/flightInquiry/flightInquiry?pageType=${this.data.pageType}&city=${chooseCity}`
        })

        if(!cityItem){
            cityItem = []
            cityItem.push({cityName:chooseCity,number:1})
            
            wx.setStorage({
                key : 'commonCity',
                data : cityItem
              })

            return
        }

        for(let key in cityItem){
            if(cityItem[key].cityName == chooseCity){
                selectState = key
                break
            }
        }

        if(selectState){
            cityItem[selectState].number += 1 
            cityItem.map( (val,index) => {
                for(let key in cityItem){
                    if(val.number >= cityItem[key].number){
                        let oldVal = val,newVal = cityItem[key]
                        cityItem[index] = newVal
                        cityItem[key] = oldVal
                        break
                    }
                }
            })
        }else{
            cityItem.push({cityName:chooseCity,number:1})
        }

        wx.setStorage({
            key : 'commonCity',
            data : cityItem
          })
    },
    _scrollView(e){
        let _this = this
        if(this.data.choosePosID != ''){
            this.setData({
                choosePosID : ''
            })
        }
    },
    _posBtnClick(e){
        let posId = e.currentTarget.dataset.ids
        this.setData({
            choosePosID : posId
        })
    },
    async _getCities(){
        let _this = this,cityData = [] ,
        cities = await commonMethods.Request({
            apiUrl : API.getCitys,
            method : 'GET'
        })
        for(let key in cities.data){
            for(let item of cities.data[key]){
                if(app.globalData.posCity.indexOf(item) != -1){
                    this.setData({
                        nowCity : item
                    })
                    break
                }
            }
            cityData.push({id:key,cityItem:cities.data[key]})
        }

        this.setData({
            cityData,
            scrollPosHeight : this.data.nowCity == '' ? this.data.scrollPosHeight : this.data.scrollPosHeight - 192 
        })
        // wx.createSelectorQuery().select('#scroll-pos').boundingClientRect(function(rect){
        //     console.log(rect.height)
        //     _this.setData({
        //         scrollPosHeight : rect.height
        //     })
        //     console.log(_this.data.scrollPosHeight)
        // }).exec()
    },
    handleChange ({ detail }) {
        this.setData({
            currentTabs: detail.key
        });
    },
    onChange(event){
        // console.log(event.detail,'click right menu callback data')
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){
        let urlParam = getCurrentPages() ,
        pageQuery = getCurrentPages()[urlParam.length - 1].options.type
        this.setData({
            pageType : pageQuery
        })
        this._getCities()
        this._getCommonCity()
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