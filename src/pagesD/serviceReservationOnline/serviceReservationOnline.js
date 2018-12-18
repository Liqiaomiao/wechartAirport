const app = getApp();
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
import moment from '../../utils/moment'
const { $Toast } = require('../../components/iview/base/index');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        desc: [],
        hd:{rightValue:''},
        radiogroup: [],
        airText: '请选择航班号',
        timeText: '请选择预达时间',
        roomVisible: false,
        radioarr:[
            {name:'是',value:'是',checked:true}, 
            {name:'否',value:'否',checked:false},
        ],
        carRadioarr:[
            {name:'是',value:'1',checked:true}, 
            {name:'否',value:'0',checked:false},
        ],
        carRadioarrs:[
            {name:'是',value:'1',checked:false},
            {name:'否',value:'0',checked:true},
        ],
        roomcurrent : '',
        roomcurrentIndex:'',
        roomtype:'add',
        delRoomUservisible:false,
        delConcatvisible:false,
        contactVisible:false,
        contactIndex:0,
        contacts:[],
        contact : {},
        contacttype:'add',
        nextDisable:false,
        hasRead:['true'],
        hasPopover:false,


        currentDate: new Date(),
      minDate: new Date(),
      xuzhi: false, //须知

      svcDisabledSel: false,
      portDisabledSel: false,
      passagerDisabledSel: false,

      vipCategorySel: '1',
      svcAreaSel: '1',
      svcCategorySel: '1',
      flightCategorySel: '1',
      inOutPortSel: '2',
      vipCategorySelText : '',
      svcCategorySelText : '', 
      flightCategorySelText : '', 
      inOutPortSelText : '',

      isNeedRelay: '1',

      vipCategory: [],
      svcArea: [],
      svcCategory: [],
      flightCategory: [],
      inOutPort: [],

      passagerText: '使用人次',
      arriveTimeText: '预达时间',
      isMainText: '主宾车',
      travellerText: '使用人信息',

      hasFlight: false,

      showArriveTime: false, //时间控件是否显示
      arriveTime: "请选择预达时间",
      showVip: false,
      vipAreaId: "请选择贵宾厅",
      vipData: new Array(),
      vipDataArray: [],
      flightNo: '请选择航班号',
      passagerNum: 0,
      relayCardInfo: "",
      memo01: "",
      appointmenter: "",

      cardData: {},

      showContacter: false,
      showContacterCard: false,
      contacterIndex: 0,
      contacters: [],
      showEditContacter: false,

      showTraveller: false,
      showTravellerCard: false,
      travellerIndex: 0,
      travellers: [],
      canAddTraveller: true,
      showEditTraveller: false,

      hasCar: true,
      showCar: false,
      showCarCard: false,
      carIndex: 0,
      cars: [],
      canAddCar: true,
      showEditCar: false,

      formData: {
        memberId: '',
        memberCardNum: ''
      },

      checked: true, //已阅读
      notices: 'notices.png',
      ifshowNotices: false,
      fightCode:'',

      carVisible : false,
      flightgroup : [{
        text: '是否需要接机牌',
        radios: [
            {value: '是', name: 1, checked: true }, 
            {value: '否', name: 0, checked: false }
        ]
      }],
      cartype : 'add',
      carsCurrentIndex : '',
      carcurrent : {},
      memo : '',
      dialogActions : [
          {
              name : '取消'
          },
          {
            name : '确认',
            color : '#b99156'
        }
      ],
      telServer:[{
                name: '电话预约',
                icon: 'customerservice_fill',
                color:'#b99156'
            },{
                name: '知道了',
                color:'#80848f'
            }
        ],
      telServerVis : false
    },
    _telServerClick({ detail }){
        const index = detail.index;
        
        if (detail.index === 0) {

            wx.makePhoneCall({
                phoneNumber : '4006496888',
                fail(err){
                    $Toast({
                        type : 'error' ,
                        content : '呼叫失败，请稍后拨打：4006496888'
                    })
                }
            })
           
        } else{
            this.setData({
                telServerVis: false
            });
        }

        
    },
    _travelHandleClick({ detail }){
        const index = detail.index;

        if (index === 0) {
            this.handleClose()
        } else if (index === 1) {
            this.comfirmDelRoomUservisible()
        }
    },
    _concatHandleClick({ detail }){
        const index = detail.index;

        if (index === 0) {
            this.handleClose()
        } else if (index === 1) {
            this.comfirmDelCooncatvisible()
        }
    },
    _carsHandleClick({ detail }){
        const index = detail.index;

        if (index === 0) {
            this.handleClose()
        } else if (index === 1) {
            this.comfirmDelCarsvisible()
        }
    },
    _operationCarNum(e){
        let type = e.currentTarget.dataset.type
        this.setData({
            hasPopover : type ? true : false,
            carVisible : type,
            cartype : 'add',
            carcurrent : {},
            memo : ''
        })
    },
    textareaChanges({detail,currentTarget}){
        if(currentTarget.dataset.type == 'cars'){
            this.setData({
                memo:detail.value
            })
        }
        if(currentTarget.dataset.type == 'remark'){
            this.setData({
                memo01:detail.value
            })
        }
        if(currentTarget.dataset.type == 'relayCard'){
            this.setData({
                relayCardInfo:detail.value
            })
        }
    },
    readChange({detail}){
        let value=detail.value;
        let nextDisable=!value[0]
        this.setData({
            nextDisable
        })

    },
    handleClose({currentTarget}){
        this.setData({
            [currentTarget.dataset.type]:false,
            hasPopover:false
        })
    },

    addContact(e){
        this.setData({
            contactVisible:true,
            contact : {
                contactName : '',
                contactPhone : ''
            },
            contacttype:'add',
            hasPopover:true
        })
    },
    cancelContact(e){

        this.setData({
            contactVisible:false,
            hasPopover:false
        })
    },
    submitContact({detail}){

        let value = detail.value,
        contactName = value.name,
        contactPhone = value.phone,
        // ifPhone = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})|(16[0-9]{9})$/.test(phone),
        ifPhone = /^\d{5,}$/.test(contactPhone),
        contactIndex = this.data.contactIndex;


        if((contactName+'').trim() == ''){
            $Toast({
                content: '请输入联系人姓名',
                type: 'warning'
            })
            return
        }
        if((contactPhone+'').trim() == ''){
            $Toast({
                content: '请输入联系人电话',
                type: 'warning'
            })
            return
        }
        if(!ifPhone){
            $Toast({
                content: '请输入正确的电话',
                type: 'warning'
            })
            return
        }
        let contacters = this.data.contacters,
        contacter={ contactName, contactPhone }

        if(this.data.contacttype == 'add'){
            contacters.push(contacter)
        }else{
            contacters[contactIndex] = contacter;
        }

        this.setData({
            contacters,
            contactVisible:false,
            hasPopover:false
        })
    },
    editCars({currentTarget}){
        let index = currentTarget.dataset.index,
        cartype = 'edit',
        carsCurrentIndex = index,
        cars = this.data.cars,
        isMain = cars[index].isMain,
        isOvernight = cars[index].isOvernight,
        carcurrent = this.data.carcurrent,
        carRadioarr = this.data.carRadioarr,
        carRadioarrs = this.data.carRadioarrs,
        memo = cars[index].memo
        carcurrent.carNum = cars[index].carNum

        if(isMain == '1'){
            carRadioarr[0].checked = true
            carRadioarr[1].checked = false
        }else{
            carRadioarr[1].checked = true
            carRadioarr[0].checked = false
        }

        if(isOvernight == '1'){
            carRadioarrs[0].checked = true
            carRadioarrs[1].checked = false
        }else{
            carRadioarrs[1].checked = true
            carRadioarrs[0].checked = false
        }


        this.setData({
            carcurrent,
            carRadioarr,
            carRadioarrs,
            memo,
            carsCurrentIndex,
            cartype,
            carVisible:true,
            hasPopover:true
        })
    },
    deleteCars({currentTarget}){
        let index = currentTarget.dataset.index;

        this.setData({
            delCarsvisible:true,
            carsCurrentIndex:index,
            hasPopover:true
        })
    },
    comfirmDelCarsvisible(){
        let index = this.data.carsCurrentIndex,
        cars = this.data.cars;

        cars.splice(index,1)

        this.setData({
            delCarsvisible:false,
            cars,
            hasPopover:false
        })
    },
    editContact({currentTarget}){
        let index = currentTarget.dataset.index,
        contactIndex = index,
        contacttype = 'edit',
        contacters = this.data.contacters,
        contactName = contacters[index].contactName,
        contactPhone = contacters[index].contactPhone,
        contact = { contactName,contactPhone };
        this.setData({
            contact,
            contacttype,
            contactVisible:true,
            hasPopover:true
        })
    },
    deleteContact({currentTarget}){
        let index = currentTarget.dataset.index;

        this.setData({
            delConcatvisible:true,
            contactIndex:index,
            hasPopover:true

        })
    },
    comfirmDelCooncatvisible(){
        let index = this.data.contactIndex,
        contacters=this.data.contacters;
        contacters.splice(index,1)
        this.setData({
            delConcatvisible:false,
            contacters,
            hasPopover:false
        })
    },
    handleNext(){

        if(this.data.flightNo.indexOf('请选择') != -1){
            $Toast({
                type:'warning',
                content:'请选择航班号'
            })
            return;
          }
    
          if(this.data.cardData.orderFlow == 2){
            if(this.data.formData.destinationAirport != '天津'){
                $Toast({
                    type:'warning',
                    content:'易接机卡预约，目的机场必须为天津'
                })
              return;
            }
          }
    
          if(this.data.arriveTime.indexOf('请选择') != -1){
            $Toast({
                type:'warning',
                content:'请选择预达时间'
            })
            return;
          }

          let formData = this.data.formData,
          inOutPort = formData.inOutPort,
          arriveTime = moment(this.data.arriveTime),
          takeoffTime = moment(formData.takeoffTime),
          landingTime = moment(formData.landingTime),
          arriveDate = moment(this.data.arriveTime).format('YYYY-MM-DD'),
          takeoffDate = moment(formData.takeoffTime).format('YYYY-MM-DD')
    
          if(arriveDate != takeoffDate){
            $Toast({
                type:'warning',
                content:'预达时间须与航班日期相同'
            })
            return;
          }
    
          // if(this.formData.destinationAirport != '天津' && this.formData.departureAirport != '天津'){
              
          //     return;
          // }
    
          let durationIn = landingTime.diff(arriveTime, 'minutes');
          let durationOut = takeoffTime.diff(arriveTime, 'minutes');
    
          if(inOutPort == 1){
            if(formData.destinationAirport != '天津'){
              //this.$toast("进港航班降落地点必须为天津");
              this.setData({
                telServerVis : true
              })
              return;
            }
            if(moment(arriveTime).isAfter(landingTime)){
                $Toast({
                    type:'warning',
                    content:'预达时间超过航班降落时间，不能进行预约'
                })
              return;
            }else if(durationIn < 120){
                $Toast({
                    type:'warning',
                    content:'距降落时间不足2小时，不能进行预约'
                })
              return;
            }
          }else if(inOutPort == 2){
            if(formData.departureAirport != '天津'){
              // this.$toast("出港航班起飞地点必须为天津");
              this.setData({
                telServerVis : true
              })
              return;
            }
            if(moment(arriveTime).isAfter(takeoffTime)){
                $Toast({
                    type:'warning',
                    content:'预达时间超过航班起飞时间，不能进行预约'
                })
              return;
            }else if(durationOut < 120){
                $Toast({
                    type:'warning',
                    content:'距起飞时间不足2小时，不能进行预约'
                })
              return;
            }
          }
    
          if(this.data.contacters.length == 0){
            $Toast({
                type:'warning',
                content:'请至少填写一名联系人信息'
            })
            return;
          }
    
          if(this.data.travellers.length == 0){
            if(this.data.cardData.orderFlow == 2){
                $Toast({
                    type:'warning',
                    content:'请至少填写一名使用人信息'
                })
            }else{
                $Toast({
                    type:'warning',
                    content:'请至少填写一名出行人信息'
                })
            }
            return;
          }
    
          if(this.data.travellers.length != this.data.passagerNum){
            $Toast({
                type:'warning',
                content:'使用人次与出行人数不同'
            })
            return;
          }


    
           formData.vipCategory = parseInt(this.data.vipCategorySel);
            this.data.vipCategory.forEach(element => {
              if(this.data.vipCategorySel == element.code){
                formData.vipCategoryStr = element.text;
              }
            });
            formData.svcArea = parseInt(this.data.svcAreaSel);
            this.data.svcArea.forEach(element => {
              if(this.data.svcAreaSel == element.code){
                formData.svcAreaStr = element.text;
              }
            });
            formData.svcCategory = parseInt(this.data.svcCategorySel);
            this.data.svcCategory.forEach(element => {
              if(this.data.svcCategorySel == element.code){
                formData.svcCategoryStr = element.text;
              }
            });
            formData.flightCategory = parseInt(this.data.flightCategorySel);
            this.data.flightCategory.forEach(element => {
              if(this.data.flightCategorySel == element.code){
                formData.flightCategoryStr = element.text;
              }
            });
            formData.inOutPort = parseInt(this.data.inOutPortSel);
            this.data.inOutPort.forEach(element => {
              if(this.data.inOutPortSel == element.code){
                formData.inOutPortStr = element.text;
              }
            });
    
            formData.memberId = app.globalData.sysUserInfo.memberID;
            formData.appointmenter = app.globalData.sysUserInfo.realName;
            formData.arriveTime = this.data.arriveTime;
            formData.flightNo = this.data.flightNo;
            formData.passagerNum = this.data.passagerNum;
            formData.relayCardInfo = this.data.relayCardInfo;
            formData.memo01 = this.data.memo01;
            formData.cardno = this.data.cardData.cardno

            if(this.data.contacters.length > 0)  formData.contacterJson = this.data.contacters;
            if(this.data.travellers.length > 0)  formData.travellerJson = this.data.travellers;
            if(this.data.cars.length > 0) formData.carJson = this.data.cars;


            app.globalData.serverOnlineData = formData



            this.setData({
                formData
            })

            commonMethods.Router({
                type : 'navigateTo',
                path : 'serviceReservationConfirm'
            })

    },
    confirmTimeChange(e){
        this.setData({
            arriveTime : e.detail.timeText
        })
    },
    formSubmit({detail}){
        let name = detail.value.name,
        identityNum = detail.value.cardId,
        post = detail.value.job,
        isHonor = detail.value.ifmain == '是' ? '1' : '0', 
        idCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(identityNum);

        if((name+'').trim() == ''){
            $Toast({
                content: '请输入姓名',
                type: 'warning'
            })
            return
        }
        // if(identityNum.length == 0){
        //     $Toast({
        //         content: '请输入身份证号',
        //         type: 'warning'
        //     });
        //     return
        // }
        let travel = {
            name, identityNum, post, isHonor
        },travellers = this.data.travellers

        if(this.data.roomtype == 'add'){
            travellers.push(travel)
        }else{
            travellers[this.data.roomcurrentIndex] = travel
        }



        this.setData({
            travellers,
            passagerNum : travellers.length ,
            roomVisible:false,
            hasPopover:false
        })

    },
    carsSubmit({detail}){
        let carNum = detail.value.carNum,
        isMain = detail.value.isMain,
        isOvernight = detail.value.isOvernight,
        memo = this.data.memo

        if((carNum+'').trim() == ''){
            $Toast({
                content: '请输入车牌照号',
                type: 'warning'
            })
            return
        }

        let car = {
            carNum, isMain, isOvernight,memo
        },cars = this.data.cars

        if(this.data.cartype == 'add'){
            cars.push(car)
        }else{
            cars[this.data.carsCurrentIndex] = car
        }



        this.setData({
            cars,
            carVisible:false,
            hasPopover:false
        })

    },
    canceladdRoomUser(){
        this.setData({
            roomVisible:false,
            hasPopover:false
        })
    },
    editRoomUser({currentTarget}){

        let index = currentTarget.dataset.index,
        roomcurrent = this.data.travellers[index],
        isHonor = roomcurrent.isHonor,
        radioarr = this.data.radioarr,
        roomcurrentIndex = index;

        if(isHonor == '1'){
            radioarr[0].checked = 'true';
            radioarr[1].checked = 'false'
        }else{
            radioarr[1].checked = 'true';
            radioarr[0].checked = 'false'
        }
        this.setData({
            roomVisible:true,
            roomcurrent,
            roomcurrentIndex,
            roomtype:'edit',
            hasPopover:true
        })

    },
    deleteRoomUser({currentTarget}){
        let index = currentTarget.dataset.index

        this.setData({
            delRoomUservisible:true,
            roomcurrentIndex:index,
            hasPopover:true
        })
    },
    comfirmDelRoomUservisible(){
        let index = this.data.roomcurrentIndex,
        travellers = this.data.travellers
        travellers.splice(index,1)

        this.setData({
            delRoomUservisible:false,
            hasPopover:false,
            passagerNum : travellers.length,
            travellers
        })
    },
    raidoChangeForRoom({detail}){
         
    },
    handleCancel1() {

    },
    addRoomUser(){
        this.setData({
            roomVisible:true,
            roomcurrent : [],
            roomtype:'add',
            hasPopover:true
        })
    },
    _getInitData(){
        commonMethods.Load()
        let _this = this, 
        typeText = ['vipCategory','svcArea','svcCategory','flightCategory','inOutPort'],
        vipCategory = [],svcArea = [],svcCategory = [],flightCategory = [],inOutPort = [],errorText = 0

        typeText.map(async (el,index) => {
            let resData = await commonMethods.Request({
                apiUrl : API.byCode ,
                data : {
                    codeType : el
                }
            })

            if(resData.status != 0 || resData.errMsg){
                errorText++
                // errorText += `${el},`
                return
            }

            resData.data.map( val => {
                if(el == 'vipCategory'){
                    vipCategory.push({
                        code: val.code, text: val.text
                    })
                }
                
                if(el == 'svcArea'){
                    svcArea.push({
                        code: val.code, text: val.text
                    })
                }
                if(el == 'svcCategory'){
                    svcCategory.push({
                        code: val.code, text: val.text
                    })
                }
                if(el == 'flightCategory'){
                    flightCategory.push({
                        code: val.code, text: val.text
                    })
                }
                if(el == 'inOutPort'){
                    inOutPort.push({
                        code: val.code, text: val.text
                    })
                }
            })

            if(index == typeText.length - 1){
                if(errorText != 0){
                    commonMethods.Load('hide')
                    $Toast({
                        type : 'error',
                        content : `有 ${errorText} 个数据请求失败，请稍后重试`
                    })
                }
        
                _this.setData({
                    vipCategory,svcArea,svcCategory,flightCategory,inOutPort
                })

                _this._getCardInfo()
            }
        })
    },
    async _getCardInfo(){
        commonMethods.Load()
        let resultData = await commonMethods.Request({
            apiUrl : API.cardDetail,
            data : {
                cardNo: this.data.formData.memberCardNum
            }
        })

        if (resultData.status != 0 || resultData.errMsg) {
            commonMethods.Load('hide')
            $Toast({
                type : 'error' ,
                content : resultData.message
            })

            return
        }

        let cardData = resultData.data.cardInfo,
        svcDisabledSel = false ,portDisabledSel = false,passagerDisabledSel = false, canAddTraveller = false,hasCar = true , canAddCar = true,
        inOutPortSel = '2' ,passagerNum = 0,vipCategorySel = '1', svcAreaSel = '1', svcCategorySel = '1', flightCategorySel = '1',
        passagerText = '使用人次', arriveTimeText = '预达时间', isMainText = '主宾车', travellerText = '使用人信息',
        vipCategory = this.data.vipCategory, svcArea = this.data.svcArea, svcCategory = this.data.svcCategory, flightCategory = this.data.flightCategory, inOutPort = this.data.inOutPort, 
        contacters = [],travellers = [],cars = []
            
        let desc = [
            {title: '会员卡号', value: format.cardnoFormat(cardData.cardno)},
            {title: '卡种', value: cardData.cardSeriesStr}
        ]

        if(cardData.cardCat == '1'){
            desc.push({title: '卡内余额：', value: format.priceFormat(cardData.walletMoney)})
        }

        if(cardData.deadlineDate){
            desc.push({title: '有效期', value: `${format.dateFormat(cardData.startSellDate)} 至 ${format.dateFormat(cardData.deadlineDate)}`})
        }else{
            desc.push({title: '有效期', value: '无'})
        }

        if(cardData.bindCarNum){
            desc.push({title: '绑定车牌', value: cardData.bindCarNum})
        }
        
        switch (cardData.orderFlow) {
              case 1:// 易出行
                svcDisabledSel = true;
                portDisabledSel = true;
                passagerDisabledSel = true;
                canAddTraveller = false;
                hasCar = false;

                if(resultData.data.cardOwnerList.length > 0){
                    resultData.data.cardOwnerList.forEach(element => {
                      if(element.isMain == 1){
                        contacters.push({
                          contactName: element.ownerName,
                          contactPhone: element.cellPhone,
                          isSendMsg: 1,
                          canEdit: false,
                          canDel: false
                        });
                      }
                    });
                  }

                  if(resultData.data.cardOwnerList.length > 0){
                    resultData.data.cardOwnerList.forEach(element => {
                      if(cardData.isSelfOnly == '1'){
                        travellers.push({
                          name: element.ownerName,
                          identityNum: element.iDCardNo,
                          post: '',
                          isSpecial: 0,
                          isHonor: 1,
                          canEdit: false,
                          canDel: false
                        });
                      }
                    });
                  }

                break;
              case 2:// 易接机
                hasCar = false;
                svcDisabledSel = true;
                portDisabledSel = true;
                passagerDisabledSel = true;
                inOutPortSel = '1';
                passagerNum = travellers.length;
                passagerText = '使用休息室人数';
                arriveTimeText = "车辆预达时间";
                isMainText = '备案车辆';
                travellerText = '使用休息室人',
                canAddCar = false;
                

                if(cardData.bindCarNum){
                    cars.push({
                        carNum: cardData.bindCarNum,
                        memo: "",
                        isHeavySvc: 0,
                        isOvernight: 0,
                        isMain: 1,
                        canEdit: false,
                        canDel: false
                    });
                  }

                break;
              case 3:// 贵宾卡
                vipCategorySel = '2';
                if(cardData.isSelfOnly == '1'){
                    canAddTraveller = false;
                }
  
                if(cardData.isSelfOnly == '1'){
                    if(resultData.data.cardOwnerList.length > 0){
                      resultData.data.cardOwnerList.forEach(element => {
                        if(element.isMain == 1){
                          contacters.push({
                            contactName: element.ownerName,
                            contactPhone: element.cellPhone,
                            isSendMsg: 1,
                            canEdit: false,
                            canDel: false
                          });
                        }
                      });
                    }
                  }

                  if(resultData.data.cardOwnerList.length > 0){
                    resultData.data.cardOwnerList.forEach(element => {
                      if(cardData.isSelfOnly == '1'){
                        travellers.push({
                          name: element.ownerName,
                          identityNum: element.iDCardNo,
                          post: '',
                          isSpecial: 0,
                          isHonor: 1,
                          canEdit: false,
                          canDel: false
                        });
                      }
                    });
                  }

                break;
              case 4:// 易卡通
                
              if(cardData.isSelfOnly == '1'){
                if(resultData.data.cardOwnerList.length > 0){
                  resultData.data.cardOwnerList.forEach(element => {
                    if(element.isMain == 1){
                      contacters.push({
                        contactName: element.ownerName,
                        contactPhone: element.cellPhone,
                        isSendMsg: 1,
                        canEdit: false,
                        canDel: false
                      });
                    }
                  });
                }
              }

              if(resultData.data.cardOwnerList.length > 0){
                resultData.data.cardOwnerList.forEach(element => {
                  if(cardData.isSelfOnly == '1'){
                    travellers.push({
                      name: element.ownerName,
                      identityNum: element.iDCardNo,
                      post: '',
                      isSpecial: 0,
                      isHonor: 1,
                      canEdit: false,
                      canDel: false
                    });
                  }
                });
              }

                break;
              case 5:// 易卡通-嘉宾
                vipCategorySel = '1';
                svcDisabledSel = true;

                if(cardData.isSelfOnly == '1'){
                    if(resultData.data.cardOwnerList.length > 0){
                      resultData.data.cardOwnerList.forEach(element => {
                        if(element.isMain == 1){
                          contacters.push({
                            contactName: element.ownerName,
                            contactPhone: element.cellPhone,
                            isSendMsg: 1,
                            canEdit: false,
                            canDel: false
                          });
                        }
                      });
                    }
                  }

                  if(resultData.data.cardOwnerList.length > 0){
                    resultData.data.cardOwnerList.forEach(element => {
                      if(cardData.isSelfOnly == '1'){
                        travellers.push({
                          name: element.ownerName,
                          identityNum: element.iDCardNo,
                          post: '',
                          isSpecial: 0,
                          isHonor: 1,
                          canEdit: false,
                          canDel: false
                        });
                      }
                    });
                  }

                break;
              case 6:// 易卡通-贵宾
                vipCategorySel = '2';
                svcDisabledSel = true;

                if(cardData.isSelfOnly == '1'){
                    if(resultData.data.cardOwnerList.length > 0){
                      resultData.data.cardOwnerList.forEach(element => {
                        if(element.isMain == 1){
                          contacters.push({
                            contactName: element.ownerName,
                            contactPhone: element.cellPhone,
                            isSendMsg: 1,
                            canEdit: false,
                            canDel: false
                          });
                        }
                      });
                    }
                  }

                  if(resultData.data.cardOwnerList.length > 0){
                    resultData.data.cardOwnerList.forEach(element => {
                      if(cardData.isSelfOnly == '1'){
                        travellers.push({
                          name: element.ownerName,
                          identityNum: element.iDCardNo,
                          post: '',
                          isSpecial: 0,
                          isHonor: 1,
                          canEdit: false,
                          canDel: false
                        });
                      }
                    });
                  }
                break;
              default:
                
                break;
            }

            let formData = this.data.formData

            formData.vipCategory = parseInt(vipCategorySel);
           
            formData.svcCategory = parseInt(svcCategorySel);
            
            formData.flightCategory = parseInt(flightCategorySel);
            
            formData.inOutPort = parseInt(inOutPortSel);

            if(contacters.length > 0) formData.contacterJson = contacters;
            if(travellers.length > 0) formData.travellerJson = travellers;
            if(cars.length > 0) formData.carJson = cars;

            passagerNum = travellers.length;

            this.setData({
                cardData , svcDisabledSel ,portDisabledSel,passagerDisabledSel , canAddTraveller ,hasCar ,canAddCar ,
                inOutPortSel ,passagerNum ,vipCategorySel , svcAreaSel , svcCategorySel , flightCategorySel ,
                passagerText , arriveTimeText , isMainText , travellerText ,
                vipCategory , svcArea , svcCategory , flightCategory , inOutPort , contacters ,travellers ,cars ,
                desc,
                hd : {
                    rightValue : app.globalData.sysUserInfo.realName
                },
                radiogroup : [
                    {
                        text: '贵宾/嘉宾',
                        radios: [
                            {value: vipCategory[0].text, name: vipCategory[0].code, checked: vipCategorySel == vipCategory[0].code ? true : false,disabled: svcDisabledSel}, 
                            {value: vipCategory[1].text, name: vipCategory[1].code, checked: vipCategorySel == vipCategory[1].code ? true : false, disabled: svcDisabledSel}
                        ],
                        visible : true
                    },
                    {
                        text: '服务类型',
                        radios: [
                            {value: svcCategory[0].text, name: svcCategory[0].code, checked: svcCategorySel == svcCategory[0].code ? true : false,disabled: vipCategorySel == '1' ? true : false}, 
                            {value: svcCategory[1].text, name: svcCategory[1].code, checked: svcCategorySel == svcCategory[1].code ? true : false,disabled: vipCategorySel == '1' ? true : false}
                        ],
                        visible : cardData.isGroupCard == 1 ? true : false
                    },
                    {
                        text: '国内/国际', 
                        radios: [
                            {value: flightCategory[0].text, name: flightCategory[0].code,checked: flightCategorySel == flightCategory[0].code ? true : false}, 
                            {value: flightCategory[1].text, name: flightCategory[1].code, checked: flightCategorySel == flightCategory[1].code ? true : false}
                        ],
                        visible : true
                    },
                    {
                        text: '出港/进港',
                        radios: [
                            {value: inOutPort[0].text, name: inOutPort[0].code, checked: inOutPortSel == inOutPort[0].code ? true : false,disabled: portDisabledSel}, 
                            {value: inOutPort[1].text, name: inOutPort[1].code, checked: inOutPortSel == inOutPort[1].code ? true : false,disabled: portDisabledSel}
                        ],
                        visible : true
                    }
                ]
            })
            commonMethods.Load('hide')
    },
    _getAir(){
        app.globalData.flightData.serverFlight = {}
        commonMethods.Router({
            type : 'navigateTo',
            path : 'flightInquiry', 
            params : {
                isFlight : false
            }
        })
    },
    _radioChange({detail,currentTarget}){
        let radiogroup = this.data.radiogroup
        
        this._radiosValue(radiogroup,currentTarget.dataset.name,detail.value)
        
    },
    _radiosValue(radiogroup,currentName,radioVal){
        let vipCategorySel = this.data.vipCategorySel,
        svcCategorySel = this.data.svcCategorySel,
        flightCategorySel = this.data.flightCategorySel,
        inOutPortSel = this.data.inOutPortSel,
        vipCategorySelText = this.data.vipCategorySelText, 
        svcCategorySelText = this.data.svcCategorySelText, 
        flightCategorySelText = this.data.flightCategorySelText, 
        inOutPortSelText = this.data.inOutPortSelText
        if(radiogroup.length > 0){
            radiogroup.map( (val,index) => {
                if(val.text == currentName){
                    radiogroup[index].radios.map( (vals) => {
                        if(vals.name == radioVal){
                            if(val.text == '贵宾/嘉宾'){
                                vipCategorySel = radioVal
                                vipCategorySelText = vals.value
                            }
                            if(val.text == '服务类型'){
                                svcCategorySel = radioVal
                                svcCategorySelText = vals.value
                            }
                            if(val.text == '国内/国际'){
                                flightCategorySel = radioVal
                                flightCategorySelText = vals.value
                            }
                            if(val.text == '出港/进港'){
                                inOutPortSel = radioVal
                                inOutPortSelText = vals.value
                            }
                        }
                    })
                }
            })
            this.setData({
                vipCategorySel, svcCategorySel, flightCategorySel, inOutPortSel,
                vipCategorySelText, svcCategorySelText, flightCategorySelText, inOutPortSelText
            })
        }
    },
    _isNeedRelay({detail}){
        this.setData({
            isNeedRelay : detail.value
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let urlParams = getCurrentPages()[getCurrentPages().length - 1].options

        this.setData({
            formData: {
                memberId: app.globalData.sysUserInfo.memberID,
                memberCardNum: urlParams.pk
              }
        })
        this._getInitData()
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
        let flightData = app.globalData.flightData.serverFlight,
        formData = this.data.formData
        formData.departureAirport = flightData.departureAirport,
        formData.destinationAirport = flightData.destinationAirport,
        formData.takeoffTime = flightData.takeoffTime,
        formData.landingTime = flightData.landingTime
        
        if(JSON.stringify(flightData) !== '{}'){
            this.setData({
                flightNo : flightData.flightNo,
                formData,
                hasFlight : true
            })
            
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