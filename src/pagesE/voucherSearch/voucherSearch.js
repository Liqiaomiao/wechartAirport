let {Request}=require('../../utils/wxRequest.js');
import API from '../../utils/API';
const { $Toast } = require('../../components/iview/base/index');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        searchtext:"",
        personInfoVisible:false,
        actions:[
            {
                name:'取消'
            },
            {
                name: '转增',
                color: '#be9457'
            },
    ]
    },
    confirmSearch({ detail }){
        if (detail.index === 0) {
            this.setData({
                personInfoVisible: false
            });
        }else{
           let voucherID=getCurrentPages()[getCurrentPages().length - 1].options.voucherID;
           Request({
               apiUrl:API.present2Member,
               data:{
                   voucherID,
                   toMember:this.data.searchtext
               }
           }).then(({data,status,message})=>{
               if(status==0){
                   $Toast({
                       content:'赠送成功',
                       type:'success'
                   })
                   setTimeout(()=>{
                       wx.navigateBack({
                           delta:1
                       })
                   },1500)


               }else{
                   $Toast({
                       content:message,
                       type:'error'
                   })

               }
           }).catch(err=>{
               $Toast({
                   content:'请求失败，请稍后重试',
                   type:'error'
               })
           })
        }
    },
    inputComfirm({detail}){
        let ifPhone = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})|(16[0-9]{9})$/.test(this.data.searchtext);
        if(!ifPhone){
            $Toast({
                content:'请检查手机号',
                type:'error'
            })
        }else{
            Request({
                apiUrl:API.presentMembers,
                data:{
                    cellphone:this.data.searchtext
                }
            }).then(({data,status})=>{
                if(data){
                    this.setData({
                        personInfoVisible:true,
                        data
                    })
                }else{
                    $Toast({
                        content:'抱歉，查无此人',
                        type:'warning'
                    })
                }
            }).catch(err=>{
                $Toast({
                    content:'获取会员信息失败，请稍后重试',
                    type:'error'
                })
            })
        }
    },
    cancelSearch(e){
        wx.navigateBack({
            delta:1
        })

    },
    inputChange({detail}){
        this.setData({
            searchtext:detail
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