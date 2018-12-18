import commonMethods from "../../utils/wxRequest";

const app = getApp();
const regeneratorRuntime = require('../../libs/regenerator.js')
import {Request, Router} from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
import moment from '../../utils/moment'

const {$Toast} = require('../../components/iview/base/index');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        desc: [],
        hd: {rightValue: ''},
        radiogroup: [],
        airText: '请选择航班号',
        timeText: '请选择预达时间',
        arriveTimeText: '预达时间',
        roomVisible: false,
        room: [
            {
                name: 'andy',
                cardId: '1014555556',
                job: '444',
                ifmain: '主宾'
            }
        ],
        VipCategory: [],
        FlightCategory: [],
        InOutPort: [],
        roomcurrent: '',
        roomcurrentIndex: '',
        roomtype: 'add',
        delRoomUservisible: false,
        delConcatvisible: false,
        contactVisible: false,
        contactIndex: 0,
        contacts: [],
        contact: '',
        contacttype: 'add',
        nextDisable: false,
        hasRead: ['true'],
        textareaText: '',
        hasPopover: false,
        airInfo: {
            voyage: '长沙-天津',
            start: '2018-09-21 06:40',
            end: '2018-09-21 08:55'
        },

        radioarr: [{value: '1', text: '是', checked: true}, {value: 0, text: '否'}],
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

        isNeedRelay: '1',

        VipCategory: [],
        svcArea: [],
        svcCategory: [],
        FlightCategory: [],
        InOutPort: [],

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
        fightCode: '',

        carVisible: false,
        flightgroup: [{
            text: '是否需要接机牌',
            radios: [
                {value: '是', name: 1, checked: true},
                {value: '否', name: 0, checked: false}
            ]
        }],
        cartype: 'add',
        carsCurrentIndex: '',
        carcurrent: {},
        textareaCarsText: '',
        dialogActions: [
            {
                name: '取消'
            },
            {
                name: '确认',
                color: '#b99156'
            }
        ],
        telServer: [{
            name: '电话预约',
            icon: 'customerservice_fill',
            color: '#b99156'
        }],
        telServerVis: false,
        carRadioarr: [{value: '1', name: '是',checked:true}, {value: '0', name: '否'}],/*是否主宾车*/
        isMain:'1',/*是否主宾车*/
        carRadioarrs: [{value: '1', name: '是'}, {value: '0', name: '否',checked:true}],/*是否过夜停车*/
        isOvernight: '0',/*是否过夜停车*/
    },
    saveSession(data) {
        app.globalData.serverOnlineData = data;
    },
    radiogroupChange({currentTarget, detail}) {
        let target = currentTarget.dataset.type;
        let val = detail.value;
        let thisdata = this.data;
        let formData = thisdata.formData;
        let vipCategory = formData.vipCategory,
            vipCategorySel = thisdata.vipCategorySel,

            svcCategorySel = thisdata.svcCategorySel,
            svcCategory = formData.svcCategory,

            flightCategorySel = thisdata.flightCategorySel,
            flightCategory = formData.flightCategory,

            inOutPortSel = thisdata.inOutPortSel,
            inOutPort = formData.inOutPort,

            hasCar = thisdata.hasCar,
            relayCardInfo = thisdata.relayCardInfo,
            isNeedRelay = thisdata.isNeedRelay;

        if (target == 'vipCategory') {
            vipCategorySel = val;
            vipCategory = parseInt(vipCategorySel);
            if (vipCategorySel == '1') {
                svcCategorySel = '1';
                hasCar = false;
            } else {
                hasCar = true;
            }
            this.setData({
                vipCategorySel,
                vipCategory,
                svcCategorySel,
                hasCar
            })
        }
        else if (target == 'svcCategory') {
            svcCategorySel = val;

            svcCategory = parseInt(svcCategorySel);
            this.setData({
                svcCategorySel,
                svcCategory
            })
        }
        else if (target == 'flightCategory') {
            flightCategorySel = val;

            flightCategory = parseInt(flightCategorySel)
            this.setData({
                flightCategorySel,
                flightCategory
            })
        }
        else if (target == 'inOutPort') {

            inOutPortSel = val;

            inOutPort = parseInt(inOutPortSel)
            if (inOutPortSel == '2') {
                relayCardInfo = ''
            }
            this.setData({
                inOutPortSel,
                inOutPort,
                relayCardInfo
            });
        }
        else if (target == 'isNeedRelay') {
            isNeedRelay = val;
            if (isNeedRelay == '0') {
                relayCardInfo = ''
            }
            this.setData({
                isNeedRelay,
                relayCardInfo
            })
        }
        this.saveSession(thisdata.formData)
    },

    getVoucherDetail() {/*票券信息 部分*/
        let realName = app.globalData.sysUserInfo.realName;
        let pk = getCurrentPages()[getCurrentPages().length - 1].options.pk;
        Request({
            apiUrl: API.getVoucherDetail,
            data: {id: pk}
        }).then(({data, status, message}) => {
            if (status == 0) {
                this.setData({
                    voucher: data,
                    realName
                })
            } else {
                $Toast({
                    type: 'warning',
                    content: message
                })
            }
        }).catch(err => {
            $Toast({
                type: 'error',
                content: "请求失败，请稍后重试"
            })
        })
    },
    getRadioCommon(type, ifchecked) {/*单选框 取值公共方法*/
        Request({
            apiUrl: API.byCode,
            data: {codeType: type}
        }).then(({status, data, message}) => {
            if (status == 0) {
                let typeval = data.map((item, index) => {
                    return {
                        code: item.code,
                        text: item.text,
                        checked: ifchecked == item.code ? true : false
                    }
                })
                this.setData({
                    [type]: typeval
                })
            } else {
                $Toast({
                    content: message,
                    type: 'error'
                })
            }
        }).catch(err => {
            $Toast({
                content: '请求失败，请稍后重试',
                type: 'error'
            })
        })
    },
    _getInitData() {
        this.getVoucherDetail()
        this.getRadioCommon('VipCategory', this.data.vipCategorySel);
        this.getRadioCommon('FlightCategory', this.data.flightCategorySel);
        this.getRadioCommon('InOutPort', this.data.inOutPortSel);
        this._getCardInfo();
    },
    async _getCardInfo() { /*获取卡信息*/
        let {data, status, message} = await Request({
            apiUrl: API.getExpCardDetail,
            data: {
                cardType: 'EXP'
            }
        });


        if (status == 0) {
            let thisdata = this.data;
            let svcDisabledSel = thisdata.svcDisabledSel, /*贵宾/嘉宾*/
                portDisabledSel = thisdata.portDisabledSel, /*出港/进港*/
                canAddTraveller = thisdata.canAddTraveller, /*是否能增加人员*/
                hasCar = thisdata.hasCar, /*是否需要接机*/
                passagerNum = thisdata.passagerNum, /**/

                passagerText = thisdata.passagerText,
                arriveTimeText = thisdata.arriveTimeText,
                isMainText = thisdata.isMainText,
                travellerText = thisdata.travellerText,
                formData = thisdata.formData,

                vipCategory = formData.vipCategory,
                vipCategorySel = thisdata.vipCategorySel,

                svcCategory = formData.svcCategory,
                svcCategorySel = thisdata.svcCategorySel,

                flightCategory = formData.flightCategory,
                flightCategorySel = thisdata.flightCategorySel,


                inOutPort = formData.inOutPort,
                inOutPortSel = thisdata.inOutPortSel,

                contacterJson = formData.contacterJson,
                contacters = thisdata.contacters,


                travellerJson = formData.travellers,
                travellers = thisdata.travellers,

                carJson = formData.carJson,
                cars = thisdata.cars,

                cardData = data.cardInfo;


            switch (data.cardInfo.orderFlow) {
                case 1://易出行
                    svcDisabledSel = true;
                    portDisabledSel = true;
                    canAddTraveller = false;
                    hasCar = false;
                    break;
                case 2:// 易接机
                    svcDisabledSel = true;
                    portDisabledSel = true;
                    inOutPortSel = '0';
                    passagerNum = this.data.travellers.length;

                    canAddTraveller = false;
                    hasCar = false;

                    passagerText = '使用休息室人数';
                    arriveTimeText = '车辆预达时间';
                    isMainText = '备案车辆';
                    travellerText = '使用休息室人';
                    break;
                case 3://  贵宾卡
                    VipCategory[1].checked = true


                    break;
                case 4://  易卡通
                    break;
                case 5://  易卡通-嘉宾
                    VipCategory[0].checked = true;
                    svcDisabledSel = true;

                    break;
                case 6:// 易卡通-贵宾

                    VipCategory[1].checked = true
                    svcDisabledSel = true;
                    break;

                default:
                    svcDisabledSel = true;
                    break;
            }

            if (formData.hasOwnProperty('vipCategory')) {/*贵宾/嘉宾*/
                vipCategorySel = formData.vipCategory.toString()
            } else {
                formData.vipCategory = parseInt(vipCategorySel)
            }

            if (formData.hasOwnProperty('svcCategory')) {/*本地*/
                svcCategorySel = formData.svcCategory.toString()
            } else {
                formData.svcCategory = parseInt(svcCategorySel)
            }
            if (formData.hasOwnProperty('flightCategory')) {/*国内/国际*/
                flightCategorySel = formData.flightCategory.toString()
            } else {
                formData.flightCategory = parseInt(flightCategorySel)
            }

            if (formData.hasOwnProperty('inOutPort')) {/*进港/出港*/
                inOutPortSel = formData.inOutPort.toString()
            } else {
                formData.inOutPort = parseInt(inOutPortSel)
            }


            if (formData.hasOwnProperty('contacterJson')) {/*联系人信息*/
                contacters = JSON.parse(formData.contacterJson);
            }

            if (formData.hasOwnProperty('travellerJson')) {/*使用人信息*/
                travellers = JSON.parse(formData.travellerJson);
            }

            if (formData.hasOwnProperty('carJson')) {/*车辆信息*/
                cars = JSON.parse(formData.carJson);
            }

            if (contacters.length > 0) formData.contacterJson = JSON.stringify(this.contacters);
            if (travellers.length > 0) formData.travellerJson = JSON.stringify(this.travellers);
            if (cars.length > 0) formData.carJson = JSON.stringify(this.cars);

            passagerNum = travellers.length;

            formData.memberCardNum = cardData.cardno;
            this.saveSession(formData);
            this.setData({
                svcDisabledSel, /*贵宾/嘉宾*/
                portDisabledSel, /*出港/进港*/
                canAddTraveller, /*是否能增加人员*/
                hasCar, /*是否需要接机*/
                passagerNum, /**/

                passagerText,
                arriveTimeText,
                isMainText,
                travellerText,
                formData,


                vipCategorySel,


                svcCategorySel,


                flightCategorySel,


                inOutPortSel,


                contacters,


                travellers,


                cars,

                cardData
            })
        }
        else {
            $Toast({
                content: message,
                type: 'warning'
            })
        }

    },
    _telServerClick({detail}) {
        const index = detail.index;
        wx.makePhoneCall({
            phoneNumber: '4006496888',
            fail(err) {
                $Toast({
                    type: 'error',
                    content: '呼叫失败，请稍后拨打：4006496888'
                })
            }
        })
    },
    _travelHandleClick({detail}) {
        const index = detail.index;

        if (index === 0) {
            this.handleClose()
        } else if (index === 1) {
            this.comfirmDelRoomUservisible()
        }
    },
    _concatHandleClick({detail}) {
        const index = detail.index;

        if (index === 0) {
            this.handleClose()
        } else if (index === 1) {
            this.comfirmDelCooncatvisible()
        }
    },
    _carsHandleClick({detail}) {
        const index = detail.index;

        if (index === 0) {
            this.handleClose()
        } else if (index === 1) {
            this.comfirmDelCarsvisible()
        }
    },
    _operationCarNum(e) {
        let type = e.currentTarget.dataset.type
        this.setData({
            carVisible: type,
            cartype: 'add',
            carcurrent: {},
            textareaCarsText: '',
            carRadioarr: [{value: '1', name: '是',checked:true}, {value: '0', name: '否'}],/*是否主宾车*/
            isMain:'1',/*是否主宾车*/
            carRadioarrs: [{value: '1', name: '是'}, {value: '0', name: '否',checked:true}],/*是否过夜停车*/
            isOvernight: '0',/*是否过夜停车*/
        })
    },
    textareaChanges({detail, currentTarget}) {
        if (currentTarget.dataset.type == 'cars') {
            this.setData({
                textareaCarsText: detail.value
            })
        } else {
            this.setData({
                textareaText: detail.value
            })
        }
    },
    readChange({detail}) {
        let value = detail.value;
        let nextDisable = !value[0]
        this.setData({
            nextDisable
        })

    },
    handleClose({currentTarget}) {
        this.setData({
            [currentTarget.dataset.type]: false,
            hasPopover: false
        })
    },

    addContact(e) {
        this.setData({
            contactVisible: true,
            contact: {
                contactName: '',
                contactPhone: ''
            },
            contacttype: 'add',
            hasPopover: true
        })
    },
    cancelContact(e) {

        this.setData({
            contactVisible: false,
            hasPopover: false
        })
    },
    submitContact({detail}) {

        let value = detail.value,
            contactName = value.name,
            contactPhone = value.phone,
            // ifPhone = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})|(16[0-9]{9})$/.test(phone),
            ifPhone = /^\d{5,}$/.test(contactPhone),
            contactIndex = this.data.contactIndex;

        if ((contactName + '').trim() == '') {
            $Toast({
                content: '请输入联系人姓名',
                type: 'warning'
            })
            return
        }
        if ((contactPhone + '').trim() == '') {
            $Toast({
                content: '请输入联系人电话',
                type: 'warning'
            })
            return
        }
        if (!ifPhone) {
            $Toast({
                content: '请输入正确的电话',
                type: 'warning'
            })
            return
        }
        let contacters = this.data.contacters,
            contacter = {contactName, contactPhone}

        if (this.data.contacttype == 'add') {
            contacters.push(contacter)
        } else {
            contacters[contactIndex] = contacter;
        }

        this.setData({
            contacters,
            contactVisible: false,
            hasPopover: false
        })
    },
    editCars({currentTarget}) {
        let index = currentTarget.dataset.index,
            cartype = 'edit',
            carsCurrentIndex = index,
            cars = this.data.cars,
            isMain = cars[index].isMain,
            isOvernight = cars[index].isOvernight,
            carcurrent = this.data.carcurrent,
            carRadioarr = this.data.carRadioarr,
            carRadioarrs = this.data.carRadioarrs,
            textareaCarsText = cars[index].memo
        carcurrent.carNum = cars[index].carNum

        if (isMain == '0') {
            carRadioarr[0].checked = true
            carRadioarr[1].checked = false
        } else {
            carRadioarr[1].checked = true
            carRadioarr[0].checked = false
        }

        if (isOvernight == '0') {
            carRadioarrs[0].checked = true
            carRadioarrs[1].checked = false
        } else {
            carRadioarrs[1].checked = true
            carRadioarrs[0].checked = false
        }


        this.setData({
            carcurrent,
            carRadioarr,
            carRadioarrs,
            textareaCarsText,
            carsCurrentIndex,
            cartype,
            carVisible: true,
            hasPopover: true
        })
    },
    deleteCars({currentTarget}) {
        let index = currentTarget.dataset.index;

        this.setData({
            delCarsvisible: true,
            carsCurrentIndex: index,
            hasPopover: true
        })
    },
    comfirmDelCarsvisible() {
        let index = this.data.carsCurrentIndex,
            cars = this.data.cars;

        cars.splice(index, 1)

        this.setData({
            delCarsvisible: false,
            cars,
            hasPopover: false
        })
    },
    editContact({currentTarget}) {
        let index = currentTarget.dataset.index,
            contactIndex = index,
            contacttype = 'edit',
            contacters = this.data.contacters,
            contactName = contacters[index].contactName,
            contactPhone = contacters[index].contactPhone,
            contact = {contactName, contactPhone};
        this.setData({
            contact,
            contacttype,
            contactVisible: true,
            hasPopover: true
        })
    },
    deleteContact({currentTarget}) {
        let index = currentTarget.dataset.index;

        this.setData({
            delConcatvisible: true,
            contactIndex: index,
            hasPopover: true

        })
    },
    comfirmDelCooncatvisible() {
        let index = this.data.contactIndex,
            contacters = this.data.contacters;
        contacters.splice(index, 1)
        this.setData({
            delConcatvisible: false,
            contacters,
            hasPopover: false
        })
    },
    handleNext() {
        if (this.data.flightNo.indexOf('请选择') != -1) {
            $Toast({
                type: 'warning',
                content: '请选择航班号'
            })
            return;
        }

        if (this.data.cardData.orderFlow == 2) {
            if (this.data.formData.destinationAirport != '天津') {
                $Toast({
                    type: 'warning',
                    content: '易接机卡预约，目的机场必须为天津'
                })
                return;
            }
        }

        if (this.data.arriveTime.indexOf('请选择') != -1) {
            $Toast({
                type: 'warning',
                content: '请选择预达时间'
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

        if (arriveDate != takeoffDate) {
            $Toast({
                type: 'warning',
                content: '预达时间须与航班日期相同'
            })
            return;
        }


        let durationIn = landingTime.diff(arriveTime, 'minutes');
        let durationOut = takeoffTime.diff(arriveTime, 'minutes');
        if (inOutPort == 1) {
            if (formData.destinationAirport != '天津') {
                //this.$toast("进港航班降落地点必须为天津");
                this.setData({
                    telServerVis: true
                })
                return;
            }
            if (moment(arriveTime).isAfter(landingTime)) {
                $Toast({
                    type: 'warning',
                    content: '预达时间超过航班降落时间，不能进行预约'
                })
                return;
            } else if (durationIn < 120) {
                $Toast({
                    type: 'warning',
                    content: '距降落时间不足2小时，不能进行预约'
                })
                return;
            }
        } else if (inOutPort == 2) {
            if (formData.departureAirport != '天津') {
                // this.$toast("出港航班起飞地点必须为天津");
                this.setData({
                    telServerVis: true
                })
                return;
            }
            if (moment(arriveTime).isAfter(takeoffTime)) {
                $Toast({
                    type: 'warning',
                    content: '预达时间超过航班起飞时间，不能进行预约'
                })
                return;
            } else if (durationOut < 120) {
                $Toast({
                    type: 'warning',
                    content: '距起飞时间不足2小时，不能进行预约'
                })
                return;
            }
        }
        if (this.data.travellers.length == 0) {
            if (this.data.cardData.orderFlow == 2) {
                $Toast({
                    type: 'warning',
                    content: '请至少填写一名使用人信息'
                })
            } else {
                $Toast({
                    type: 'warning',
                    content: '请至少填写一名出行人信息'
                })
            }
            return;
        }

        if (this.data.contacters.length == 0) {
            $Toast({
                type: 'warning',
                content: '请至少填写一名联系人信息'
            })
            return;
        }


        if (this.data.travellers.length != this.data.passagerNum) {
            $Toast({
                type: 'warning',
                content: '使用人次与出行人数不同'
            })
            return;
        }


        formData.vipCategory = parseInt(this.data.vipCategorySel);
        this.data.VipCategory.forEach(element => {
            if (this.data.vipCategorySel == element.code) {
                formData.vipCategoryStr = element.text;
            }
        });
        formData.svcArea = parseInt(this.data.svcAreaSel);
        this.data.svcArea.forEach(element => {
            if (this.data.svcAreaSel == element.code) {
                formData.svcAreaStr = element.text;
            }
        });
        formData.svcCategory = parseInt(this.data.svcCategorySel);
        this.data.svcCategory.forEach(element => {
            if (this.data.svcCategorySel == element.code) {
                formData.svcCategoryStr = element.text;
            }
        });
        formData.flightCategory = parseInt(this.data.flightCategorySel);
        this.data.FlightCategory.forEach(element => {
            if (this.data.flightCategorySel == element.code) {
                formData.flightCategoryStr = element.text;
            }
        });
        formData.inOutPort = parseInt(this.data.inOutPortSel);
        this.data.InOutPort.forEach(element => {
            if (this.data.inOutPortSel == element.code) {
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

        if (this.data.contacters.length > 0) formData.contacterJson = JSON.stringify(this.data.contacters);
        if (this.data.travellers.length > 0) formData.travellerJson = JSON.stringify(this.data.travellers);
        if (this.data.cars.length > 0) formData.carJson = JSON.stringify(this.data.cars);

        this.setData({
            formData
        })
        this.saveSession(formData)
        Router({
            type: 'navigateTo',
            path: 'serviceReservationInstantConsumption'
        })

    },
    confirmTimeChange(e) {
        this.setData({
            arriveTime: e.detail.timeText
        })
    },
    formSubmit({detail}) {/*提交使用人信息*/
        let name = detail.value.name,
            identityNum = detail.value.cardId,
            post = detail.value.job,
            isHonor = detail.value.ifmain == '是' ? '0' : '0',
            idCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(identityNum);

        if ((name + '').trim() == '') {
            $Toast({
                content: '请输入姓名',
                type: 'warning'
            })
            return
        }
        if (identityNum.length == 0) {
            $Toast({
                content: '请输入身份证号',
                type: 'warning'
            });
            return
        }
        if (!idCard) {
            $Toast({
                content: '请输入正确的身份证号',
                type: 'warning'
            });
            return
        }
        let travel = {
            name, identityNum, post, isHonor
        }, travellers = this.data.travellers

        if (this.data.roomtype == 'add') {
            travellers.push(travel)
        } else {
            travellers[this.data.roomcurrentIndex] = travel
        }


        this.setData({
            travellers,
            passagerNum: travellers.length,
            roomVisible: false,
            hasPopover: false
        })

    },
    carsSubmit({detail}) {
        let carNum = detail.value.carNum,
            isMain = detail.value.isMain,
            isOvernight = detail.value.isOvernight,
            memo = this.data.textareaCarsText

        if ((carNum + '').trim() == '') {
            $Toast({
                content: '请输入车牌照号',
                type: 'warning'
            })
            return
        }

        let car = {
            carNum, isMain, isOvernight, memo
        }, cars = this.data.cars

        if (this.data.cartype == 'add') {
            cars.push(car)
        } else {
            cars[this.data.carsCurrentIndex] = car
        }


        this.setData({
            cars,
            carVisible: false,
            hasPopover: false
        })

    },
    canceladdRoomUser() {
        this.setData({
            roomVisible: false,
            hasPopover: false
        })
    },
    editRoomUser({currentTarget}) {

        let index = currentTarget.dataset.index,
            roomcurrent = this.data.travellers[index],
            isHonor = roomcurrent.isHonor,
            radioarr = this.data.radioarr,
            roomcurrentIndex = index;

        if (isHonor == '0') {
            radioarr[0].checked = 'true';
            radioarr[1].checked = 'false'
        } else {
            radioarr[1].checked = 'true';
            radioarr[0].checked = 'false'
        }
        this.setData({
            roomVisible: true,
            roomcurrent,
            roomcurrentIndex,
            roomtype: 'edit',
            hasPopover: true
        })

    },
    deleteRoomUser({currentTarget}) {
        let index = currentTarget.dataset.index

        this.setData({
            delRoomUservisible: true,
            roomcurrentIndex: index,
            hasPopover: true
        })
    },
    comfirmDelRoomUservisible() {
        let index = this.data.roomcurrentIndex,
            travellers = this.data.travellers
        travellers.splice(index, 1)

        this.setData({
            delRoomUservisible: false,
            hasPopover: false,
            passagerNum: travellers.length,
            travellers
        })
    },
    raidoChangeForRoom({currentTarget,detail}) {
        let target = currentTarget.dataset.type;
        let val = detail.value;
        this.setData({
            [target]:val
        })

    },
    handleCancel1() {

    },
    addRoomUser() {
        this.setData({
            roomVisible: true,
            roomtype: 'add',
            hasPopover: true
        })
    },

    _getAir() {
        Router({
            type: 'navigateTo',
            path: 'flightInquiry',
            params: {
                isFlight: false
            }
        })
    },
    initData(){
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initData()
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
        this.initData();
        let flightData = app.globalData.flightData.serverFlight;
        let formData=this.data.formData;
        formData.departureAirport=flightData.departureAirport;
        formData.destinationAirport=flightData.destinationAirport;
        formData.takeoffTime = flightData.takeoffTime;
        formData.landingTime=flightData.landingTime;

        if (JSON.stringify(flightData) !== '{}') {
            this.setData({
                flightNo: flightData.flightNo,
                flightData,
                hasFlight: true
            })

        }
        let vipCategorySel=this.data.vipCategorySel;
        if(vipCategorySel=='1'){
            this.setData({
                hasCar:false
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