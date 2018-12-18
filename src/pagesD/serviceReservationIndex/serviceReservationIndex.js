const app = getApp();
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
const { $Toast } = require('../../components/iview/base/index');

Page({
    data:{
        duration : 1000,
        cardList : [],
        imgUrls : API.IMG_BASE_SERVER_URL,
        currentIndex : 0 ,
        formatDate : [],
        btns:[
            {text:'电话预约',icon:'tel',url:'serviceReservationTel',params:{},isUse:true},
            {text:'即时消费',icon:'plane',url:'serviceReservationInstantConsumption',params:{},isUse:true},
            {text:'在线预约',icon:'plane',url:'serviceReservationOnline',params:{},isUse:true},
        ]
    },
    goLink({currentTarget}){

        let index = currentTarget.dataset.index,
        checkBtn = this.data.btns[index]

        if(!checkBtn.url || !checkBtn.isUse){
            $Toast({
                content : '敬请期待'
            })

            return
        }

        checkBtn.params.pk = this.data.cardList[this.data.currentIndex].cardno

        let canOrder = true,
        filterResult = this.data.cardList.filter( (item) => {
            return item.cardno == checkBtn.params.pk
        })

        if(filterResult.length > 0){
            if(filterResult[0].isExperCard == 1 && filterResult[0].hasOrder > 0){
                canOrder = false;
            }
        }
        
        if(!canOrder){
            $Toast({
                type : 'warning',
                content : '体验卡同一时间内仅能进行一次预约'
            })
            return
        }

        commonMethods.Router({
            type : 'navigateTo',
            path : checkBtn.url,
            params : checkBtn.params
        })

    },
    _homeServerSwiperChange(e){

        let currentIndex = e.detail.current

        this.setData({
            currentIndex 
        })

    },
    async _getMemberList(){

        commonMethods.Load()

        this.setData({
            cardList : []
        })

        let getMemberList = await commonMethods.Request({
            apiUrl : API.memberList ,
            data : {
                memberId : app.globalData.sysUserInfo.memberID
            }
        })

        if(getMemberList.status == 404 || getMemberList.status != 0 || getMemberList.errMsg){
            commonMethods.Load('hide')
            $Toast({
                type : 'warning',
                content : getMemberList.message
            })
            setTimeout( () => {
                commonMethods.Router({
                    type : 'reLaunch',
                    path : 'home',
                })
            },2000)
        }

        let cardList = getMemberList.data, formatDate = []

        cardList.map( (val,index) => {

            cardList[index].formatCardNum = format.cardnoFormat(val.cardno)

            if(val.deadlineDate){
                formatDate.push(`${format.dateFormat(val.startSellDate)} 至 ${format.dateFormat(val.deadlineDate)}`)
            }else{
                formatDate.push('无')
            }
            
        })

        let _this = this , currentIndex = this.data.currentIndex , params = getCurrentPages()[getCurrentPages().length -1].options.pk
        if(params){
            cardList.map( (val,index) => {
                if(val.cardno == params){
                    currentIndex = index
                }
            })
        }

        this.setData({
            cardList,
            formatDate,
            currentIndex
        })

        commonMethods.Load('hide')

    },
    onReady(){
       
    },
    onLoad(){
        this._getMemberList()
    },
    onShow(){

    }

});