
const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
const { $Toast } = require('../../components/iview/base/index');
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
Component({
    data: {
        homeCarouselData : [],
        currentSwiper: 0,
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        imgUrl : API.IMG_BASE_SERVER_URL,
        userName : '',
        getCardVis:false,
        getCardData:[]
    },
    properties:{
        locations:String,
        weathers:String
    },
    created(){}, //组件实例化，但节点树还未导入，因此这时不能用setData

    attached(){},// 节点树完成，可以用setData渲染节点，但无法操作节点

    ready(){// 不是onReady 组件布局完成，这时可以获取节点信息，也可以操作节点
        let realName = app.globalData.sysUserInfo.realName
        this.setData({
            userName : realName ? realName : '用户'
        })
        this._homeCarousel()
    }, 

    moved(){},// 组件实例被移动到树的另一个位置

    detached(){},// 组件实例从节点树中移除
    
    methods:{
        _hiddenGetCard(){
            this.setData({
                getCardVis : false
            })
        },
        _swiperDetail({currentTarget}){

            let currentIndex = currentTarget.dataset.index,
            currentData = this.data.homeCarouselData[currentIndex]

            if(currentData.linkaddr){

                if(currentData.linkaddr == 'apiGetMemberCard'){
                    this._getMember()
                    // $Toast({
                    //     content : '敬请期待'
                    // })
                    return
                }
                if(currentData.linkaddr == 'cipActivity'){
                    commonMethods.Router({
                        type : 'navigateTo',
                        path : 'purchase',
                        params : {
                            current : 'easyCartoon'
                        }
                    })
                    return
                }

                commonMethods.Router({
                    type : 'navigateTo',
                    path : currentData.linkaddr
                })
            }
            if(currentData.hasContent == 1){
                commonMethods.Router({
                    type : 'navigateTo',
                    path : 'common-htmlParse',
                    params : {
                        homeCarouseId : currentData.id
                    }
                })
            }

        },
        async _getMember(){
            
            if(!app.globalData.canGetCard.state){
                $Toast({
                    type : 'error',
                    content : app.globalData.canGetCard.message
                })
                return
            }

            $Toast({
                content: '领卡资格查询中',
                type: 'loading',
                duration: 0
            });

            let datas = await commonMethods.Request({
                apiUrl : API.checkMemberQualification
            })

            $Toast.hide()

            if(datas.status != 0){
                $Toast({ 
                    type : 'error',
                    content : datas.message
                })
                return
            }

            commonMethods.Router({
                type : 'navigateTo',
                path : 'getMemberCard'
            })
        },
        _homeSwiperChange(e){
            this.setData({
                currentSwiper: e.detail.current
              })
        },
        async _homeCarousel(){
            let homeCarousel = await commonMethods.Request({
                apiUrl : API.homeCarousel
            })
    
            if(homeCarousel.status != 0){
                // $Toast({
                //     type : 'error',
                //     content : homeCarousel.message
                // })
                this.setData({
                    homeCarouselData : [
                        {
                            urls : API.IMG_BASE_URL,
                            carouselPicture : '/ployee.jpg'
                        }
                    ]
                })
                return
            }
    
            this.setData({
                homeCarouselData : homeCarousel.data
            })
    
        },
    }
});