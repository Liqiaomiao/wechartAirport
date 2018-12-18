
const { $Toast } = require('../../components/iview/base/index');
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API';
const app = getApp()

Component({
    properties: {

    },
    data:{
        currentSwiper : 0,
        duration: 750,
        lists:[
            {text:'一',child:[
                {text:'注册优惠',title:'注册',icon:'icon-register',url:'register',params:{},isUse:true},
                {text:'产品购买',title:'购买',icon:'icon-chanpingoumai',url:'purchase',params:{},isUse:true},
                {text:'快速充值',title:'充值',icon:'icon-kuaisuchongzhi',url:'fastRecharge',params:{},isUse:true},
                {text:'服务预约',title:'预约',icon:'icon-quanbuyuyue',url:'serviceReservationIndex',params:{},isUse:true},
                {text:'交易明细',title:'明细',icon:'icon-jiaoyimingxi1',url:'transactionDetail',params:{},isUse:true},
                {text:'订单查询',title:'订单',icon:'icon-dingdanchaxun1',url:'order',params:{},isUse:true},
                {text:'一键导航',title:'导航',icon:'icon-yijiandaohang',url:'oneNavigation',params:{},isUse:true},
                {text:'航班查询',title:'航班',icon:'icon-hangbanchaxun',url:'flightInquiry',params:{},isUse:true}
            ]},
        ]
    },
    ready(){
        this._getMember()
    },
    methods:{
        async _getMember(){
            let resData = await commonMethods.Request({
                apiUrl : API.checkmembercard
            }),lists = this.data.lists
            
            if(resData.status != 0){
                app.globalData.canGetCard = {
                    state : false ,
                    message : resData.message
                }
                return
            }

            lists[0].child[0].text = '注册领卡' 
            lists[0].child[0].title = '领卡'
            app.globalData.canGetCard = {
                state : true ,
                message : 'success'
            }
            this.setData({
                lists
            })
        },
        _homeOperateChange(e){
            this.setData({
                currentSwiper: e.detail.current
            })
        },
        _operateUrl(e){
            let itemUrl = e.currentTarget.dataset.urls ,
            itemType = e.currentTarget.dataset.operateType ,
            indexs = e.currentTarget.dataset.itemIndex,
            params = this.data.lists[0].child[indexs].params
            if( !itemType || !itemUrl){
                $Toast({
                    content: '敬请期待' 
                });

                return ;
            }

            if(itemUrl == 'register'){
                params = {
                    name : app.globalData.sysUserInfo.realName,
                    phone : app.globalData.sysUserInfo.cellphone
                }
            }
            
            commonMethods.Router({
                type : 'navigateTo',
                path: itemUrl,
                params : params
            })
        }
    }
})