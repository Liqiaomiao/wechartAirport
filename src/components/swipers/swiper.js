const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
const { $Toast } = require('../../components/iview/base/index');
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
Component({
    data: {
        indicatorDots: true,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        currentServerSwiper:0,
        cardProduce:[],
        imgUrl : API.IMG_BASE_SERVER_URL
    },

    created(){ //组件实例化，但节点树还未导入，因此这时不能用setData

    },

    attached(){ // 节点树完成，可以用setData渲染节点，但无法操作节点

    },

    ready(){// 不是onReady 组件布局完成，这时可以获取节点信息，也可以操作节点
        this._getCardProduce()
    },

    moved(){ // 组件实例被移动到树的另一个位置

    },

    detached(){ // 组件实例从节点树中移除

    },

    methods:{
        async _getCardProduce(){
            let cardProduce = await commonMethods.Request({
                apiUrl : API.getCardList
            })
    
            if(cardProduce.status != 0){
                $Toast({
                    type : 'error',
                    content: cardProduce.message
                })
                return
            }
            this.setData({
                cardProduce : cardProduce.data
            })
        },
        _homeServerSwiperChange(e){
            this.setData({
                currentServerSwiper: e.detail.current
            })
        },
        _buyCard({currentTarget}){

            let choose = this.data.cardProduce[currentTarget.dataset.index]

            app.globalData.buyCardID = {
                activityID : choose.activityID,
                activityName : choose.activityName,
                cardBigPicWithoutNoUrl : choose.cardBigPicWithoutNoUrl,
                cardSellPrice : choose.cardSellPrice,
                cardType : choose.cardType,
                cardFacePrice : choose.cardFacePrice,
                cardTypeName : choose.cardTypeName,
                feeStandard : choose.feeStandard,
                discount : choose.discount,
                discountID : choose.discountID,
                discountName : choose.discountName,
                typeID : choose.typeID,
                typeName : choose.typeName,
            };

            commonMethods.Router({
                type : 'navigateTo',
                path : 'purchase-detail',
                params : {
                    pk : choose.typeID,
                    face : choose.cardFacePrice,
                    sell : choose.cardSellPrice
                }
            })

        }
    }
});