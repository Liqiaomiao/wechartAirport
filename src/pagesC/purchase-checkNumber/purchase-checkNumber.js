const { $Toast } = require('../../components/iview/base/index');
const app = getApp();
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'


Page({
    data:{
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
        brightvalue:'',
        randomht:'6',
        brightht:'6',
        searchht:'6',
        searchval:'',
        userIdValid:false, //身份证是否正确
        nextDisable:true
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
        let info=currentTarget.id.split("_");
        let randomNum=this.data.randomNum;
        let name=info[0];
        let index=info[1];

        this.setData({
            cardnumber:this.data[(name+'Num')][index].cardno,
            checkedNum:this.data[(name+'Num')][index],
            randomht:'6',
            brightht:'6',
            searchht:'6',
            [name+'ht']:index
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
       let that = this;
       let isNiceNo=currentTarget.dataset.isniceno;
       let cardNo=currentTarget.dataset.cardno||"";
       let name=currentTarget.dataset.name;
       let value=app.globalData.buyCardID;
        this.setData({
            randomht:'6',
            brightht:'6',
            searchht:'6',
            checkedNum:{cardno:''}
        })
        this.ifNext()

        commonMethods.Load()


       commonMethods.Request({
            apiUrl : API.cardNoList,
            getParams : value.typeID,
            data:{
                cardNo,isNiceNo,size:6
            }
        }).then( results => {
            commonMethods.Load('hide')
            let arr = results.data;
            let changearr;
            if(isNiceNo=='0'){
                changearr='randomNum'

            }else if(isNiceNo=='1'){
                changearr='brightNum'
            }else{
                changearr='searchNum'
            }

            arr.map( (val,index) => {
                arr[index].cardno = format.cardnoFormat(val.cardno)
            })

            that.setData({
                [changearr]:arr
            })
        })


    },
    ifNext(){//下一步disable情况；
        let form=this.data.form;
        let name=form.name;   //用户名
        let phone=form.phone; //手机号
        let userInfoID=form.userInfoID;//身份证
        let userInfoCardNum=form.userInfoCardNum;//车牌照号
        let checkedNum=this.data.checkedNum.cardno;//是否选择卡号
        let hasRead=this.data.hasRead;//是否已读购卡协议
        let nextDisable=true;//结果
        if(name==''||phone==''||checkedNum==''||!hasRead||userInfoID==''){
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
        this.getcard({currentTarget:{dataset:{isniceno:"0"}}});
        //靓号生成
        this.getcard({currentTarget:{dataset:{isniceno:"1"}}});
        this.setData({
            cardimg,
            userIdValid
        });
        //

        commonMethods.Request({
            apiUrl : API.cardType,
            getParams : value.typeID
        }).then( results => {
            let cardList=results.data;
            if(cardList.isPickCard == 1){
                that.getCarNum()
            }
            that.setData({
                cardList
            })
        })

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

        if(this.data.cardList.isPickCard == 1){
            if(form.userInfoCardNum == ''){
                $Toast({
                    content: '请输入绑定的车牌号',
                    type: 'warning'
                });
                return false
            }
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
            path : 'purchaseCard',
            params : {
                cardno:this.data.checkedNum.cardno.replace(/ /g,''),
                cardPrice:this.data.checkedNum.cardNoPrice
            }
        })

    }
});