const { $Toast } = require('../../components/iview/base/index');
const app = getApp();
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'


Page({
    data:{
        chooseCarNum : '',
        chooseFormatCarNum : '',
        choosePlanNum : '',
        chooseFormatPlanNum : '',
        imgUrl : API.IMG_BASE_SERVER_URL ,
        cipData : [] ,
        cardimg:'',
        cardnumber:'2018 0000 0000 5001',
        current:'self',
        items:[
            {value:'self',name:'本人'},
            {value:'other',name:'其他人'},
        ],
        form:{
            name:'',
            phone:'',
            userInfoID:'',
            userInfoCardNum:'',
            userInfoBuyReferrer:''
        },
        cardList:{},
        checkedNum:{cardno:''},
        hasRead:true,
        visible: false,
        randomvalue:'',
        randomht:0,
        randomPlan:0,
        searchval:'',
        userIdValid:false, //身份证是否正确
        nextDisable:true,
        
    },
    onLoad(){
        this.setData({
            cipData : app.globalData.cipActiveData
        })
    },
    checkboxChange({detail}){

        this.setData({
            hasRead:detail.value[0]||false
        })
        this.ifNext();

    },
    radioChange({detail}){
        let current=detail.value;
        this._setFormData(current)

    },
    _setFormData(current){
        let form=this.data.form;
        if(current=='self'){
            form.name = app.globalData.sysUserInfo.realName;
            form.phone= app.globalData.sysUserInfo.cellphone;
            form.userInfoID= app.globalData.sysUserInfo.idcardno;
            form.userInfoCardNum='';
        }else{
            form.name='';
            form.phone='';
            form.userInfoID='';
            form.userInfoCardNum='';
        }
        this.setData({
            current,
            form
        })
        this.ifNext()
    },
    choose({currentTarget}){//选号高亮；

        this.setData({
            randomht : currentTarget.dataset.index,
            chooseCarNum : currentTarget.dataset.num,
            chooseFormatCarNum : format.cardnoFormat(currentTarget.dataset.num)
        });
        this.ifNext()
    },
    choosePlan({currentTarget}){//选号高亮；

        this.setData({
            randomPlan : currentTarget.dataset.index,
            choosePlanNum : currentTarget.dataset.num,
            chooseFormatPlanNum : format.cardnoFormat(currentTarget.dataset.num)
        });
        this.ifNext()
    },
    setSearchVal({detail}){
        this.setData({
            searchval:detail.value
        })
    },
    getCarNum(){

        let resData = commonMethods.Request({
            apiUrl : API.memberCarNumLst
        })

        if(resData.status == 0){
            if(resData.data.length > 0){
                that.setData({
                    userInfoCardNum:resData.data[0].carNum
                })
            }
        }


    },
    getcard({currentTarget}){
       let that = this,isNiceNo = currentTarget.dataset.isniceno,
       value = app.globalData.cipActiveData,
       changearr = '',checkNum = '', formatMum = '',checkNumIndex = '';
        if(isNiceNo == 0){
            changearr = 'randomNum'
            checkNum = 'chooseCarNum'
            formatMum = 'chooseFormatCarNum'
            checkNumIndex = 'randomht'
        }else if(isNiceNo == 1){
            changearr = 'randomPlanNum'
            checkNum = 'choosePlanNum'
            formatMum = 'chooseFormatPlanNum'
            checkNumIndex = 'randomPlan'
        }

        commonMethods.Load()


       commonMethods.Request({
            apiUrl : API.cardNoList,
            getParams : value.cardInfos[isNiceNo].CardTypeID,
            data:{
                cardNo : '',isNiceNo : '',size:4
            }
        }).then( results => {
            commonMethods.Load('hide')
            let arr = results.data;

            arr.map( (val,index) => {
                arr[index].cardnoFormat = format.cardnoFormat(val.cardno)
            })

            that.setData({
                [changearr]:arr,
                [checkNum] : arr[0].cardno,
                [formatMum] : arr[0].cardnoFormat,
                [checkNumIndex] : 0
            })

            this.ifNext()
        })


    },
    ifNext(){//下一步disable情况；
        let form = this.data.form,
        name = form.name,   //用户名
        phone = form.phone, //手机号
        userInfoID = form.userInfoID,//身份证
        userInfoCardNum = form.userInfoCardNum,//车牌照号
        cardNum = this.data.chooseCarNum,//是否选择卡号
        planNum = this.data.choosePlanxNum,//是否选择卡号
        hasRead = this.data.hasRead,//是否已读购卡协议
        nextDisable = true;//结果
        if(name == '' || phone == '' || cardNum == '' || planNum == '' || !hasRead || userInfoID == ''){
            nextDisable=true;
        }else{
            nextDisable=false;
        }
        this.setData({
            nextDisable
        })
    },
    inputChange(e){
       let keyname=e.currentTarget.dataset.name;
       let val = e.detail.value;
       let form=this.data.form;

        form[keyname]=val;
        this.ifNext();
        this.setData({
            form
        });
    },
    clear(e){
        let keyname=e.currentTarget.dataset.for;
        let form=JSON.parse(JSON.stringify(this.data.form))
        form[keyname]='';
        this.setData({
            form
        })
        this.ifNext()
    },
    onShow(){
        let that = this,value = app.globalData.buyCardID,
        cardimg = `${API.IMG_BASE_SERVER_URL}${value.cardBigPicWithoutNoUrl}`,
        userInfoID = this.data.form.userInfoID,
        ifself = this.data.current,userIdValid = false;
        if(userInfoID!=''){
            userIdValid=true;
        }
        //随机生成
        this.getcard({currentTarget:{dataset:{isniceno:0}}});
        //靓号生成
        this.getcard({currentTarget:{dataset:{isniceno:1}}});
        this.setData({
            cardimg,
            userIdValid
        });
        //

        this.ifNext()
        this._setFormData(this.data.current)
    },
    onReady(){
      
    },
    getProtocol(){//协议是否同意
        this.setData({
            visible: true,
        });
    },
    handleCancel () {
        this.setData({
            visible: false,
        });
    },
    bindNext(){
        let form=this.data.form;
        let userInfoName=form.name;
        let cellphone=form.phone;
        // let idCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(form.userInfoID);
        let ifPhone = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})|(16[0-9]{9})$/.test(form.phone);
        if(!ifPhone){
            $Toast({
                content: '请输入正确的手机号',
                type: 'warning'
            });
            return false
        }
        if(form.userInfoID.length == 0){
            $Toast({
                content: '请输入正确的身份证号',
                type: 'warning'
            });
            return false
        }

        if(form.userInfoCardNum == ''){
            $Toast({
                content: '请输入绑定的车牌号',
                type: 'warning'
            });
            return false
        }

        

        form['isForOther'] = this.data.current == 'self' ? 0 : 1
        app.globalData.sysUserInfo.idcardno = form.userInfoID
        app.globalData.buyCardForm = form
        //校验手机号是否存在；
        // wx.request({
        //     url:baseURL+'/wechat/card/checkMember',
        //     method:'POST',
        //     data:{userInfoName,cellphone},
        //     header:{
        //         'content-type':'application/x-www-form-urlencoded'
        //     },
        //     success(results){

        //     }
        // })
        commonMethods.Router({
            type : 'navigateTo',
            path : 'cipPurchaseCard',
            params : {
                carno : this.data.chooseCarNum,
                planno : this.data.choosePlanNum
            }
        })

    }
});