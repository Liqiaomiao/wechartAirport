import wxApi from "../../utils/wxApi";

let {Request,Router,Load}=require('../../utils/wxRequest.js');
import API from '../../utils/API';
const app=getApp();
const { $Toast } = require('../../components/iview/base/index');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        cardCount:0,
        cards:[],
        vouchers:[],
        cardCount:0
    },
    getVouchers(){ /*券列表*/
        Router({
            type : 'navigateTo' ,
            path : 'voucherList'
        })
    },
    getCardList(){/*卡列表*/
        Router({
            type : 'navigateTo' ,
            path : 'cardList'
        })
    },
    goCardDetail(e){/*卡详细*/
        Router({
            type : 'navigateTo' ,
            path : 'cardDetail',
            params : {
                cardNo : e.detail
            }
        })
    },
    goSearch({currentTarget}){/*到搜索界面*/
        Router({
            type : 'navigateTo' ,
            path : 'voucherSearch',
            params : {
                voucherID : currentTarget.dataset.voucherid
            }
        })
    },
    goReservationEmp({currentTarget}){/*体验预约*/
        Router({
            type : 'navigateTo' ,
            path : 'serviceReservationEmp',
            params : {
                pk : currentTarget.dataset.pk
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    _getCardIndexList(){
        Load()
        /*获取卡列表*/
        Request({
            apiUrl:API.cardIndexList,
            method:'GET'
        }).then(({data,status})=>{
           if(status!=0){
               Load('hide')
               return
           }
           let cards=data.cards;//卡集合

           this.setData({
               cards,
               cardCount:data.count
           })
           Load('hide')
        }).catch((err)=>{
            Load('hide')
            $Toast({
                content:'获取会员卡信息失败，请稍后重试',
                type:'error'
            })
        });
    },
    _getVoucherIndexList(){
        Load()
         /*获取券列表*/
         Request({
            apiUrl:API.voucherIndexList,
            method:'GET'
        }).then(({data,status})=>{
            if(status != 0 ){
                Load('hide')
                return
            }
            let vouchers = data.map((item)=>{
                item.picUrl=`${API.IMG_BASE_SERVER_URL}${item.picUrl}`;
                item.voucherNo=`${item.voucherNo.substr(-8)}`;
                return item;
            })
            this.setData({
                vouchers
            })
            Load('hide')
        }).catch((err)=>{
            Load('hide')
            $Toast({
                content:'获取优惠券信息失败，请稍后重试',
                type:'error'
            })

        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this._getCardIndexList()
        this._getVoucherIndexList()
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