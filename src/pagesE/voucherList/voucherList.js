
let {Request,Router}=require('../../utils/wxRequest.js');
import API from '../../utils/API';
const app=getApp();
const { $Toast } = require('../../components/iview/base/index');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tab0:[
            ],
        tab1:[
           
        ],
        tab2:[
           
        ],
        imgBase:API.IMG_BASE_SERVER_URL,
        current:'tab0'
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
    goSearch({currentTarget}){/*到搜索界面*/
        Router({
            type : 'navigateTo' ,
            path : 'voucherSearch',
            params : {
                voucherID : currentTarget.dataset.voucherid
            }
        })
    },
    setImgurl(arr){
        arr.forEach(item=>{
            item.picUrl=`${this.data.imgBase}${item.picUrl}`;
            item.voucherNo=`${item.voucherNo.substr(-8)}`;
        });
        return arr;
    },
    handleChange({detail}){
        this.setData({
            current:detail.key
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
        Request({
            apiUrl:API.voucherList
        }).then(({data,status,message})=>{
            if(status==0){
                    let tab0=this.setImgurl(data.unuse);
                    let tab1=this.setImgurl(data.used);
                    let tab2=this.setImgurl(data.invalid);
                this.setData({
                    tab0,
                    tab1,
                    tab2,
                })
            }
        }).catch(err=>{
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