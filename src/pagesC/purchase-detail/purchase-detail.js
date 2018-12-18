const { $Toast } = require('../../components/iview/base/index');
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
let  app= getApp();
Page({
    data:{
        cardData:{}
    },
    goCheckNumber(){
        commonMethods.Router({
            type : 'navigateTo',
            path : 'purchase-checkNumber'
        })
    },
    async _getCardDetail(cardDetail){

        commonMethods.Load()

        let cardDetailData = await commonMethods.Request({
            apiUrl : '/wechat/card/cardSeriesPicList',
            data:{
                cardTypeId : cardDetail.typeID
            }
        })

        if(cardDetailData.status != 0){
            $Toast({
                content:cardDetailData.message,
                type: 'warning',
            });
            return ;
        }
       let detailData = cardDetailData.data,
       cardDetails = {
           cardSellPrice : cardDetail.cardSellPrice,
           feeStandard: cardDetail.feeStandard.replace(/<span>/g,"").replace(/<\/span>/g,""),
           dcsImg : `${API.IMG_BASE_SERVER_URL}${detailData.headList[0].picUrl}`,
           cardImg :`${API.IMG_BASE_SERVER_URL}${cardDetail.cardBigPicUrl}`
       };
        let cardTypeName = app.globalData.cardTypeName;


        if(cardTypeName){
            cardDetails.cardTypeName = cardTypeName
        }


       this.setData({
            cardData : cardDetails
       })

       commonMethods.Load('hide')
    },
    async _getCardList(pk,sellPrice,facePrice){

        commonMethods.Load()
        let cardList = await commonMethods.Request({
            apiUrl : API.getCardList
        })

        if(cardList.status != 0 && cardList.data.length == 0){
            $Toast({
                content:'数据错误，请稍后重试',
                type: 'warning',
            });
            return
        }

        cardList.data.map( (val) => {
            if(val.typeID == pk && val.cardSellPrice == sellPrice || val.cardFacePrice == facePrice){
                app.globalData.buyCardID = val
            }
        })

        this._getCardDetail(app.globalData.buyCardID)

    },
    onReady(){

    },
    onLoad(){
        let params = getCurrentPages()[getCurrentPages().length - 1].options,
        pk = params.pk,
        sellPrice = params.sell,
        facePrice = params.face;


        if(pk){
            this._getCardList(pk,sellPrice,facePrice)
        }else{
            this._getCardDetail(app.globalData.buyCardID)
        }
    },
    onShow(){

    }
})