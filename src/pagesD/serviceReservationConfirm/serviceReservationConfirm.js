const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
const { $Toast } = require('../../components/iview/base/index');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        formatTotalFee : '0',
        serverOnlineData : [],
        params : {},
        desc:[ ],
        hd:{},
        serivce:{name:'易接机服务',max:6,tips:'免费1人可进入等候区休息，超出人次扣除接机次数',countvalue:1},
        current: 'travellers',
        travellers:[ ],//出行人
        contacters:[//联系人
            //{contactName:'andy',contactPhone:'13512451245'}
        ],
        cars:[//车辆
            //{carNum:'津H1246',isMain:1,isHeavySvc:1,isOvernight:1,memo:'xxxxxx'}
        ],
        currentTab:[],
        popoverVisible:false,//预约弹窗
        // cardData:{
        //     isGroupCard:0,
        //     orderFlow:1,
        // },

        showServer : false,
        show: false, //弹窗
        showGiveup: false,

        passagerText: '使用人次',
        isMainText: '主宾车',

        services: [],
        cardData: {},
        formData: {},


        totalFee: 0,
        consumeArray: [],

        hasPackage: 0,
        formatCardNo : ''

    },
    popoverHide(){
        this.setData({
            popoverVisible:false
        })
    },
    handleChange ({ detail }) {
        this.setData({
            current: detail.key
        });
    },
    _handleConfirm(){
        this.setData({
            popoverVisible : true
        })
    },
    async _handleReservation(){//马上预约
        let _this = this,
        consumeArray = this.data.consumeArray,
        services = this.data.services,
        cardData = this.data.cardData,
        totalFee = this.data.totalFee,
        formData = this.data.formData

        consumeArray.splice(0, consumeArray.length);
  
        services.forEach(element => {
          if(element.consumeCount > 0){
            if(element.servicePackage){
              switch (element.servicePackage.servicePackageType) {
                case '1':
                case '2':
                case '3':
                  if(element.servicePackage.serviceAddCnt == 0 && element.serviceCntRelation.serviceCnt == 0){
                    consumeArray.push({
                      serviceId: element.id,
                      svcPackageId: element.serviceCntRelation.servicePackageID,
                      servicePrice: element.actualSellPrice,
                      serviceAmount: element.consumeCount,
                      serviceTotal: element.actualSellPrice * element.consumeCount,
                      consumeCount: 0,
                      surplusCount: 0
                    });
                  }else{
                    consumeArray.push({
                      serviceId: element.id,
                      svcPackageId: element.serviceCntRelation.servicePackageID,
                      servicePrice: 0.00,
                      serviceAmount: 0,
                      serviceTotal: 0.00,
                      consumeCount: element.consumeCount,
                      surplusCount: element.serviceCntRelation.serviceCnt - element.consumeCount
                    });
                  }
                  break;
                default:
                  consumeArray.push({
                    serviceId: element.id,
                    svcPackageId: element.serviceCntRelation.servicePackageID,
                    servicePrice: element.actualSellPrice,
                    serviceAmount: element.consumeCount,
                    serviceTotal: element.actualSellPrice * element.consumeCount,
                    consumeCount: 0,
                    surplusCount: 0
                  });
                  break;
              }
            }else{
              consumeArray.push({
                serviceId: element.id,
                svcPackageId: '',
                servicePrice: element.actualSellPrice,
                serviceAmount: element.consumeCount,
                serviceTotal: element.actualSellPrice * element.consumeCount,
                consumeCount: 0,
                surplusCount: 0
              });
            }
          }
        });
  
  
        if(cardData.cardCat == '1'){
          if(totalFee > cardData.walletMoney){
            $Toast({
                type : 'warning',
                content : "卡内余额不足，请充值后进行使用！"
            });
            return;
          }
        }
 
        formData.contacterJson = JSON.stringify(this.data.contacters)
        formData.travellerJson = JSON.stringify(this.data.travellers)
        formData.carJson = JSON.stringify(this.data.cars)
        if(consumeArray.length > 0) formData.consumeJson = JSON.stringify(consumeArray)
  
        // 请求加载中
        commonMethods.Load('show','保存中')

        let resultData = await commonMethods.Request({
            apiUrl : API.saveOrder,
            data : formData
        })

        if(resultData.status != 0){
            commonMethods.Load('hide')
            $Toast({
                type : 'error',
                content : resultData.message
            })
            return
        }

        commonMethods.Load('hide')

        $Toast({
            type : 'success',
            content : resultData.message
        })

        this.setData({
            popoverVisible : false
        })

        setTimeout( () => {
            commonMethods.Router({
                type : 'reLaunch',
                path : 'serviceReservationSuccess'
            })
        },2000)

        app.globalData.serverConfirmData = resultData.data

    },
    countChange(e){
        let serivce=this.data.serivce;
        serivce.countvalue=e.detail;
        this.setData({
            serivce
        })
    },
    async _getCardInfo(){
        commonMethods.Load()
        let resultData = await commonMethods.Request({
            apiUrl : API.cardDetail ,
            data : {
                cardNo: this.data.formData.memberCardNum
            }
        })


        if(resultData.status != 0 || resultData.data.length == 0){
            commonMethods.Load('hide')
            $Toast({
                type : 'error' ,
                content : '请求错误，请稍后重试'
            })
        }

        let cardData = this.data.cardData ,
        formData = this.data.formData ,
        services = this.data.services,
        totalFee = this.data.totalFee,
        hasPackage = this.data.hasPackage,
        passagerText = this.data.passagerText ,
        isMainText = this.data.isMainText

        cardData = resultData.data.cardInfo;

        switch (cardData.orderFlow) {
          case 1:
            break;
          case 2:
            passagerText = '使用休息室人数';
            isMainText = '备案车辆';
            break;
          default:
            break;
        }

        resultData.data.services.forEach(element => {
          if(element.serviceType != '2' && element.serviceType != '5'){
            if(formData.svcCategory == 1){
              if(element.isCourtSvc == '0' && element.isParkSvc == '0') {
                if(formData.vipCategory == element.vipCategory || !element.vipCategory){
                  services.push(element);
                }
              }
            }else{
              if(element.isCourtSvc == '1' && element.isParkSvc == '0') {
                services.push(element);
              }
            }
          }
        });
        services.forEach(element => {
          if (element.vipCategory != null) {
            if (element.vipCategory == formData.vipCategory && (element.serviceType == '1' || element.serviceType == '3' || element.serviceType == '4')) {
              element.consumeCount = formData.passagerNum;
              element.disabled = true;
              if(!element.servicePackage){
                  totalFee += formData.passagerNum * element.actualSellPrice;
              }else{
                if(element.servicePackage.serviceAddCnt == 0 && element.serviceCntRelation.serviceCnt == 0){
                  totalFee += formData.passagerNum * element.actualSellPrice;
                }
              }
            }
          } else {
            if(cardData.orderFlow == 2){
              if(formData.passagerNum > 1){
                element.consumeCount = formData.passagerNum - 1;
              }
              element.disabled = true;
            }else{
              element.consumeCount = 0;
              element.disabled = false;
            }
          }

          if (element.serviceCntRelation && element.serviceCntRelation.serviceCnt > 0) {
            hasPackage++;
          }
        });

        services.map( (item,index) => {
            if(item.servicePackage && item.servicePackage.servicePackageType !='0' && item.serviceCntRelation && item.serviceCntRelation.serviceCnt > 0){
              services[index].inputMax = item.serviceCntRelation.serviceCnt
              services[index].inputMin = 0
            }else if(item.servicePackage && item.servicePackage.servicePackageType !='0' && item.servicePackage.serviceAddCnt == 0 && item.serviceCntRelation && item.serviceCntRelation.serviceCnt == 0){
              services[index].inputMax = ''
              services[index].inputMin = 0
            }else if(item.servicePackage && item.servicePackage.servicePackageType !='0' && item.servicePackage.serviceAddCnt > 0 && item.serviceCntRelation && item.serviceCntRelation.serviceCnt == 0){
              services[index].inputMax = item.serviceCntRelation.serviceCnt
              services[index].inputMin = 0
            }else if(item.servicePackage && item.servicePackage.servicePackageType =='0'){
              services[index].inputMax = 1
              services[index].inputMin = 0
            }else{
              services[index].inputMax = 1
              services[index].inputMin = 0
            }
          })

        this.setData({
            cardData, formData, services, totalFee, hasPackage, passagerText, isMainText,
            showServer : true,formatTotalFee : format.priceFormat(totalFee)
        })
        commonMethods.Load('hide')

    },
    _changeServer({detail}) {  
        let fee = 0,services = this.data.services,totalFee = this.data.totalFee
        services[detail.index].consumeCount = detail.value
        services.forEach(element => {
          if(!element.servicePackage){
              fee += element.consumeCount * element.actualSellPrice;
          }else{
            if(element.servicePackage.serviceAddCnt == 0 && element.serviceCntRelation.serviceCnt == 0){
              fee += element.consumeCount * element.actualSellPrice;
            }
          }
        });
        totalFee = fee;
        this.setData({
            services,
            totalFee,
            formatTotalFee : format.priceFormat(totalFee)
        })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let formData = app.globalData.serverOnlineData
        this.setData({
            formData
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

        this._getCardInfo()

        let formData = this.data.formData,desc = [],serverName = []

        if(formData.vipCategoryStr){serverName.push(formData.vipCategoryStr)}
        if(formData.svcCategoryStr){serverName.push(formData.svcCategoryStr)}
        if(formData.flightCategoryStr){serverName.push(formData.flightCategoryStr)}
        if(formData.inOutPortStr){serverName.push(formData.inOutPortStr)}

        desc.push( 
            {title: '会员卡号', value: format.cardnoFormat(formData.cardno)},
            {title: '预达时间', value: formData.arriveTime},
            {title: '航班号', value: formData.flightNo},
            {title: '航程', value: `${formData.departureAirport} - ${formData.destinationAirport}`},
            {title: this.data.passagerText, value: `${formData.passagerNum}人`},
            {title: '预约服务', value: serverName,type : 'bck'}
        )
        if(formData.relayCardInfo){
            desc.splice(4,0,{title: '接机牌信息', value: cardData.cardSeriesStr})
            
        }
        if(formData.memo01){
            desc.splice(desc.length - 1,0,{title: '备注', value: formData.memo01})
        }

        this.setData({
            hd : {
                left:'预约信息',
                rightValue : formData.appointmenter
            },
            desc,
            contacters : formData.contacterJson,
            travellers : formData.travellerJson,
            cars : formData.carJson,
            formatCardNo : format.cardnoFormat(formData.cardno)
        })
        
        
        // let formData = app.globalData.serverOnlineData,
        // desc = [
        //     {title:'会员卡号',value:format.cardnoFormat(this.data.params.pk)},
        //     {title:'预达时间',value :formData.arriveTime},
        //     {title:'航班号',value:formData.flightNo},
        //     {title:'航程',value:`${formData.destinationAirport} - ${formData.departureAirport}`'长沙-天津'},
        //     {title:'使用人次',value:`${passagerNum}人`},
        //     {title:'预约服务',value:['嘉宾','国内','进港']}
        // ]

        // if(){
        //     desc.splice(1,0,{title:'绑定车牌',value:'津H1264'},)
        // }
        let current=this.data.current;
        this.setData({
            currentTab:this.data[current]
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