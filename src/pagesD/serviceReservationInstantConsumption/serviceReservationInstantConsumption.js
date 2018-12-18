

const app = getApp();
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
        giveUpVisable : false ,
        giveUpAction : [
          {
            name: '取消',
            color: '#80848f'
          },
          {
            name: '确定',
            color: '#b99156'
          }
        ],
        fotmatTotalFee : '0',
        useArriveTime : '',
        showServer : false,
        serverData : [],
        desc : [],
        hd : {
            rightValue : app.globalData.sysUserInfo.realName
        },
        visible:false,
        actions1: [
            {
                name: '确定',
                color: '#6a9ee5'
            }
        ],
        area1:[],
        area2:[],
        current:[0,0],
        area2currenttext:'请选择消费区域',
        serivce:{name:'易接机服务',max:6,tips:'免费1人可进入等候区休息，超出人次扣除接机次数',countvalue:1},
        last:6,
        value1:0,//计数器
        hasread:'true',//已阅读
        btndisabled:false,
        useVisible:false,//立即使用弹窗
        popoverVisible:false,


        xuzhi: false, //须知

      vipCategory: 0,

      show: false, //弹窗
      showGiveup: false,

      showAllotArea: false,

      cardData: {},
      
      contacters: [],
      travellers: [],
      cars: [],

      services: [],
      totalFee: 0,
      consumeArray: [],

      columns: [],
      allotAreaMap: {},

      allotAreaArray: {},
      allotAreaSel: "请选择消费区域",

      passagerNum: 1,
      allotArea: "",
      memo01: "",

      formData: {
        memberId: '',
        memberCardNum: ''
      },

      checked: true, //已阅读
      notices: `${API.IMG_BASE_URL}/notices.png`,
      ifshowNotices: false,
      fightCode: "",

      hasPackage: 0
    },
    _giveUpServer(){
      this.setData({
        giveUpVisable : true
      })
    },
    _giveUpClick({detail}){

      this.setData({
        giveUpVisable : false
      })

      const index = detail.index;

      if(index === 1){
        commonMethods.Router({
          type : 'reLaunch' ,
          path : 'home' 
        })
      }

    },
    _textareaChange({detail}){
        this.setData({
            memo01:detail.value
        })
    },
    getArea(){
        this.setData({
            visible:true,
            popoverVisible:true
        })
    },
    /*
    * handleCancel 关闭消费区域弹窗
    * */
    handleCancel(){
        this.setData({
            visible:false,
            popoverVisible:false
        })
    },
    /*
    * handleClickItem 选中消费区域
    * */
    handleClickItem(){
        let data=this.data;
        let area2=data.area2;
        let current=data.current;
        let current1=current[0];
        let current2=current[1];
        let area2current=this.data.area2[current1];
        let area2currenttext=area2current[current2]||"请选择消费区域";
        this.setData({
            area2currenttext,
            visible:false,
            popoverVisible:false
        })

    },
    /*计数器*/
    // handlestepchange(e){
    //     let serivce=this.data.serivce;
    //     serivce.countvalue=e.detail;
    //     this.setData({
    //         serivce
    //     })
    // },
    checkboxChange({detail}){
        let hasread=detail.value[0]||false;

        this.setData({
            hasread,
            btndisabled:!hasread
        })
    },
    /*
    * picker-view change事件
    * */
    bindChange({detail}){
        let current=detail.value;
        this.setData({
            current
        })
    },
    /*立即使用*/
    goUse(){
        this.setData({
            useVisible:true,
            useArriveTime : format.dateFormat(new Date().getTime(),'all zh-CN'),
            popoverVisible:true
        })
    },
    handleCancel2(){
        // console.log('取消预约');
        this.setData({
            useVisible:false,
            popoverVisible:false
        })
    },
    /*handlecomfirm2 确定预约*/
    handlecomfirm2(){
        // console.log('确定预约');
        this.setData({
            useVisible:false,
            popoverVisible:false
        })
    },
    _changeServer(e) {  
        let index = e.currentTarget.dataset.index,
        nowServices = this.data.services

        if(e.type == 'stepchange'){
          index = e.detail.index
          nowServices[index].consumeCount = e.detail.value
        }

        this.setData({
          services : nowServices
        })
        
        if(nowServices[index].servicePackage){
            let fee = 0;
            nowServices.forEach(element => {
              if(element.servicePackage.serviceAddCnt == 0 && element.serviceCntRelation.serviceCnt == 0){
                fee += element.consumeCount * element.actualSellPrice;
              }
            });
            this.setData({
              totalFee : fee,
              fotmatTotalFee : format.priceFormat(fee.toString())
          })
    
            if(nowServices[index].serviceCntRelation.serviceCnt > 0){
              let category = nowServices[index].servicePackage.servicePackageType;
              let allCount = nowServices[index].serviceCntRelation.serviceCnt;
        
              switch (category) {
              case '1':
                let svcSum = 0;
                nowServices.forEach(element => {
                  svcSum += element.consumeCount;
                });
                var thisCount = allCount -svcSum;
      
                nowServices.forEach(element => {
                    element.surplusCount = thisCount;
                });
                this.setData({
                  services : nowServices
                })
                break;
              case '2':
                var maxSum = 0;
                maxSum = Math.max(maxSum, e);
                var thisCount = allCount - maxSum;
                nowServices.forEach(element => {
                    element.surplusCount = thisCount;
                });
                this.setData({
                  services : nowServices
                })
                break;
              case '3':
                var thisCount = allCount - e;
                nowServices.forEach(element => {
                    element.surplusCount = thisCount;
                });
                this.setData({
                  services : nowServices
                })
                break;
              default:
                break;
              }
            }
          }else{
            let _this = this,fee = 0;
            nowServices.forEach((element,num) => {
              fee += element.consumeCount * element.actualSellPrice;
            });
            this.setData({
                totalFee : fee,
                fotmatTotalFee : format.priceFormat(fee.toString())
            })
          }
      },
    async _getCardDetail(pk){

        commonMethods.Load()

        let serverData = await commonMethods.Request({
            apiUrl : API.cardDetail,
            data : {
                cardNo : pk
            }
        })

        if(serverData.status != 0 || serverData.data.length == 0){
            commonMethods.Load('hide')
            $Toast({
                type : 'warning',
                content :  '请求错误，请稍后重试'
            })
        }

        serverData = serverData.data

        let cardInfo = serverData.cardInfo , dates = '' 
        if(cardInfo.deadlineDate){
            dates = `${format.dateFormat(cardInfo.startSellDate)} 至 ${format.dateFormat(cardInfo.deadlineDate)}`
        }else{
            dates = '无'
        }

        cardInfo.formatCardno = format.cardnoFormat(cardInfo.cardno)

        let desc = [
            {title : '会员卡号' , value : cardInfo.formatCardno},
            {title : '卡种' , value : cardInfo.cardSeriesStr},
            {title : '卡内余额' , value : format.priceFormat(cardInfo.walletMoney)},
            {title : '有效期' , value : dates}
        ]
        if(cardInfo.bindCarNum){
            desc.push({title : '绑定车牌' , value : cardInfo.bindCarNum})
        }

        this.setData({
            serverData ,
            desc
        })

        this._getCardInfo(serverData)

        commonMethods.Load('hide')

    },
    _getCardInfo(serverData){

        this.setData({
            vipCategory : 0 ,
            passagerNum : 1 ,
            contacters : [],
            travellers : [],
            cars : [],
            cardData : serverData.cardInfo
        })
        let contacters = [] , travellers = [] , cars = []
  
              if(this.data.cardData.isGroupCard == 1){
                this.data.formData.appointmenter = app.globalData.sysUserInfo.realName;
              }
  
              switch (this.data.cardData.orderFlow) {
                case 1: // 易出行
                  this.setData({
                    vipCategory : 1 ,
                    passagerNum : 1
                  })
  
                  if (serverData.cardOwnerList.length > 0) {
                    serverData.cardOwnerList.forEach(element => {
                      if (element.isMain == 1) {
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
  
                  if (serverData.cardOwnerList.length > 0) {
                    serverData.cardOwnerList.forEach(element => {
                      if (this.data.cardData.isSelfOnly == "1") {
                        travellers.push({
                          name: element.ownerName,
                          identityNum: element.iDCardNo,
                          post: "",
                          isSpecial: 0,
                          isHonor: 1,
                          canEdit: false,
                          canDel: false
                        });
                      }
                    });
                  }

                  this.setData({
                    contacters,travellers
                  })

                  break;
                case 2: // 易接机
                    this.setData({
                        vipCategory : 1 ,
                        passagerNum : 1
                    })
                  if (this.data.cardData.bindCarNum) {
                    cars.push({
                      carNum: this.data.cardData.bindCarNum,
                      memo: "",
                      isHeavySvc: 0,
                      isOvernight: 0,
                      isMain: 1,
                      canEdit: false,
                      canDel: false
                    });
                  }
                  this.setData({
                    cars
                  })
                  break;
                case 3: // 贵宾卡
                    this.setData({
                        vipCategory : 0  
                    })
                  if (this.data.cardData.isSelfOnly == "1") {
                    if (serverData.cardOwnerList.length > 0) {
                      serverData.cardOwnerList.forEach(element => {
                        if (element.isMain == 1) {
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
                  if (serverData.cardOwnerList.length > 0) {
                    serverData.cardOwnerList.forEach(element => {
                      if (this.data.cardData.isSelfOnly == "1") {
                        travellers.push({
                          name: element.ownerName,
                          identityNum: element.iDCardNo,
                          post: "",
                          isSpecial: 0,
                          isHonor: 1,
                          canEdit: false,
                          canDel: false
                        });
                      }
                    });
                  }
                  this.setData({
                    contacters,travellers
                  })
                  break;
                case 4: // 易卡通
                    this.setData({
                        vipCategory : 1
                    })
                  if (this.data.cardData.isSelfOnly == "1") {
                    if (serverData.cardOwnerList.length > 0) {
                      serverData.cardOwnerList.forEach(element => {
                        if (element.isMain == 1) {
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
  
                  if (serverData.cardOwnerList.length > 0) {
                    serverData.cardOwnerList.forEach(element => {
                      if (this.data.cardData.isSelfOnly == "1") {
                        travellers.push({
                          name: element.ownerName,
                          identityNum: element.iDCardNo,
                          post: "",
                          isSpecial: 0,
                          isHonor: 1,
                          canEdit: false,
                          canDel: false
                        });
                      }
                    });
                  }
                    this.setData({
                        contacters,travellers
                    })
                  break;
                case 5: // 易卡通-嘉宾
                    this.setData({
                        vipCategory : 1
                    })
                  if (this.data.cardData.isSelfOnly == "1") {
                    if (serverData.cardOwnerList.length > 0) {
                      serverData.cardOwnerList.forEach(element => {
                        if (element.isMain == 1) {
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
  
                  if (serverData.cardOwnerList.length > 0) {
                    serverData.cardOwnerList.forEach(element => {
                      if (this.data.cardData.isSelfOnly == "1") {
                        travellers.push({
                          name: element.ownerName,
                          identityNum: element.iDCardNo,
                          post: "",
                          isSpecial: 0,
                          isHonor: 1,
                          canEdit: false,
                          canDel: false
                        });
                      }
                    });
                  }
                    this.setData({
                        contacters,travellers
                    })
                  break;
                case 6: // 易卡通-贵宾
                    this.setData({
                        vipCategory : 2
                    })
                  if (this.data.cardData.isSelfOnly == "1") {
                    if (serverData.cardOwnerList.length > 0) {
                      serverData.cardOwnerList.forEach(element => {
                        if (element.isMain == 1) {
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
  
                  if (serverData.cardOwnerList.length > 0) {
                    serverData.cardOwnerList.forEach(element => {
                      if (this.data.cardData.isSelfOnly == "1") {
                        travellers.push({
                          name: element.ownerName,
                          identityNum: element.iDCardNo,
                          post: "",
                          isSpecial: 0,
                          isHonor: 1,
                          canEdit: false,
                          canDel: false
                        });
                      }
                    });
                  }
                  this.setData({
                    contacters,travellers
                })
                  break;
                default:
                  break;
              }

              let services = []
  
              serverData.services.forEach(element => {
                if(element.serviceType != '2' && element.serviceType != '5'){
                  if(element.isCourtSvc == '0' && element.isParkSvc == '0') {
                    if(this.data.vipCategory == 0 && element.vipCategory){
                      services.push(element);
                    }else{
                      if(this.data.vipCategory == element.vipCategory || !element.vipCategory){
                        services.push(element);
                      }
                    }
                  }
                }
              });      

              services.forEach(element => {
                if(element.serviceCntRelation){
                  element.surplusCount = element.serviceCntRelation.serviceCnt;
                }else{
                  element.surplusCount = 0;
                }
                if(this.data.cardData.cardCat == '1'){
                  if(this.data.cardData.orderFlow == 3){
                    if(element.vipCategory == 2){
                      element.consumeCount = 1;
                    }else{
                      element.consumeCount = 0
                    }
                  }
                  element.disabled = false;

                  let totalFee = this.data.totalFee + element.consumeCount * element.actualSellPrice

                  this.setData({
                    totalFee : totalFee,
                    fotmatTotalFee : format.priceFormat(totalFee.toString())
                  })

                //   this.data.totalFee += element.consumeCount * element.actualSellPrice;
                }else{
                  if(this.data.cardData.orderFlow == 1){
                    element.consumeCount = 1;
                    element.disabled = true;
                  }else if(this.data.cardData.orderFlow == 2){
                    element.consumeCount = 1;
                    element.disabled = false;
                  }else if(this.data.cardData.orderFlow == 3){
                    if(element.vipCategory == 2){
                      element.consumeCount = 1;
                    }else{
                      element.consumeCount = 0
                    }
                    element.disabled = false;
                  }
                }
  
                if (element.serviceCntRelation && element.serviceCntRelation.serviceCnt > 0) {
                    let hasPackage = this.data.hasPackage++
                    this.setData({
                        hasPackage
                    })
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
                services,
                showServer : true
              })
    },
    async _front(){

        this.setData({
            area1 : [],
            area2 : []
        })
        
        let frontData = await commonMethods.Request({
            apiUrl : API.front
        })

        if(frontData.status != 0 || frontData.errMsg){

            $Toast({
                type : 'error',
                content : frontData.message
            })

            return
        }

        let area1 = [],area2 = []
        for(let key in frontData.data){
            area1.push(key)
            if(frontData.data[key]){
                area2.push([])
                frontData.data[key].map( val => {
                    area2[area2.length - 1].push(val.frontName)
                })
            }else{
                area2.push([])
            }
        }

        this.setData({
            area1,area2
        })

    },
    async _handleComfirm() {
      let that = this,countSvc = 0,services = this.data.services,formData = this.data.formData,
      consumeArray = this.data.consumeArray.splice(0, this.data.consumeArray.length);

       services.forEach(element => {
        if (element.consumeCount > 0) {
          if (element.servicePackage) {
            switch (element.servicePackage.servicePackageType) {
              case "0":
                break;
              case "1":
                break;
              case "2":
                break;
              case "3":
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
                  if(this.data.cardData.orderFlow == 2){
                    if(element.consumeCount > 1){
                      element.consumeCount = element.consumeCount - 1
                      element.surplusCount = element.surplusCount + 1
                    }
                  }
  
                  consumeArray.push({
                    serviceId: element.id,
                    svcPackageId: element.serviceCntRelation.servicePackageID,
                    servicePrice: 0.0,
                    serviceAmount: 0,
                    serviceTotal: 0.0,
                    consumeCount: element.consumeCount,
                    surplusCount: element.surplusCount
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
          } else {
            consumeArray.push({
              serviceId: element.id,
              svcPackageId: "",
              servicePrice: element.actualSellPrice,
              serviceAmount: element.consumeCount,
              serviceTotal: element.actualSellPrice * element.consumeCount,
              consumeCount: 0,
              surplusCount: 0
            });
          }
          countSvc += element.consumeCount;
        }
      });

      this.setData({
        consumeArray
      })

      if(this.data.cardData.cardCat == '1'){
        if(this.data.totalFee > this.data.cardData.walletMoney){
          $Toast({
            type : 'warning',
            content : '卡内余额不足，请充值后进行使用！'
          });
          return;
        }
      }

      if (this.data.consumeArray.length > 0) {
        formData.consumeJson = JSON.stringify(this.data.consumeArray);
      }

      if(this.data.contacters.length > 0) {
        formData.contacterJson = JSON.stringify(this.data.contacters);
      }
      if(this.data.travellers.length > 0) {
        formData.travellerJson = JSON.stringify(this.data.travellers);
      }
      if(this.data.cars.length > 0) {
        data.formData.carJson = JSON.stringify(this.data.cars);
      }

      formData.passagerNum = countSvc;

      formData.memo01 = this.data.memo01;
      formData.allotArea = this.data.allotArea;

      formData.settlementAmount = this.data.totalFee;
      formData.discountMoney = this.data.totalFee;

      // 请求加载中
      commonMethods.Load('show','保存中')

      let saveOrder = await commonMethods.Request({
        apiUrl : API.instant,
        data : formData
      })

      commonMethods.Load('hide')

      if(saveOrder.status != 0){
        
        $Toast({
          type : 'error',
          content : saveOrder.message
        })
        return 
      }

      this.setData({
        useVisible : false
      })

      $Toast({
        type : 'success',
        content : saveOrder.message
      })

      setTimeout( () => {
        commonMethods.Router({
          type : 'reLaunch',
          path : 'paySuccess',
          params : {
            appointment : app.globalData.sysUserInfo.realName,
            cellPhone : app.globalData.sysUserInfo.cellphone,
            cardNum : that.data.serverData.cardInfo.formatCardno,
            orderNum : saveOrder.data.orderNum,
            remarks : that.data.memo01,
            isOther : 0,
            pageType : 'server'
          }
        })
      },2000)

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
        
        this._getCardDetail(urlParams.pk)
        this._front()
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