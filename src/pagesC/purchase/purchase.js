const { $Toast } = require('../../components/iview/base/index');
const app = getApp();
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
Page({
    data:{
        current:'360',
        cardListData:[],
        cipData : [],
        imgUrl : API.IMG_BASE_SERVER_URL

    },
    handleChange({detail}){
        // if(detail.key == 'easyCartoon'){
        //     $Toast({
        //         content: '敬请期待',
        //     });
        //     return
        // }
        if(detail.key == '360'){
            this._getCardList()
        }else{
            this._getCipActive()
        }
        this.setData({
            current:detail.key
        })
        
    },
    goDetail(value){
        let cardDetail = this.data.cardListData;
        let index = value.currentTarget.id;
        app.globalData.buyCardID = cardDetail[index];

        commonMethods.Router({
            type : 'redirectTo',
            path : 'purchase-detail'
        })
    },
    async _getCardList(){
        commonMethods.Load()
        let cardList = await commonMethods.Request({
            apiUrl : API.getCardList
        })
        let filterData = [] 
        filterData = cardList.data.filter(function (item) {
            let obj = item;
            obj.description = obj.description.replace(/<span>/g,"").replace(/<\/span>/g,"");
            return obj
        });
        this.setData({
            cardListData : filterData
        });
        commonMethods.Load('hide')
    },
    async _getCipActive(){
        commonMethods.Load()
        let cardList = await commonMethods.Request({
            apiUrl : API.cipgahome
        })

        if(cardList.status != 0){
            $Toast({
                type : 'error' ,
                content: cardList.message,
            });
            return
        }
        app.globalData.cipActiveData = cardList.data
        this.setData({
            cipData : cardList.data
        })
        commonMethods.Load('hide')
    },
    _buysCip(){
        commonMethods.Router({
            type : 'navigateTo',
            path : 'cipChooseNum'
        })
    },
    onLoad(){
        let current = getCurrentPages()[getCurrentPages().length - 1].options.current
        if(current){
            this.setData({
                current
            })
        }
    },
    onReady(){
        // wx.request({
        //     url:'http://wxtsn.nat300.top/tsn.app/wechat',
        //     method:'POST',
        //     success(result){
        //         let data = result.data.data;
        //         data=data.filter(function (item) {
        //             var obj=item;
        //             obj.description=obj.description.replace(/<[^>]+>/g,"").replace(/&nbsp;/gi,"");
        //             return obj
        //         });
        //         that.setData({
        //             data
        //         });
        //         $Toast.hide();
        //     }
        // })

    },
    onShow(){
        if(this.data.current == '360'){
            this._getCardList()
        }else{
            this._getCipActive()
        }
    }
})