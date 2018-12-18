"use strict";
let {Request,Router}=require('../../utils/wxRequest.js');
import API from '../../utils/API'
const { $Toast } = require('../../components/iview/base/index');
var app = getApp();
let date=new Date();
let year=date.getFullYear();
let month=date.getMonth()+1;
let day=date.getDate();
let today=`${year}-${month}-${day}`;
Page({
    data: {
        minDate:today,
        startDate:'',
        endDate:'',
        searchConditionVisible1:false,
        searchConditionVisible2:false,
        ifSearch:false,
        searchtext:'',
        ifcancel:false,
        searchData:{},
        noInfo:false
    },
    goDetail({currentTarget}){/*到详情页面*/
        Router({
            type : 'navigateTo' ,
            path : 'orderDetail' ,
            params : {
                pk : currentTarget.dataset.itemid
            }
        })
    },
    refreshData(){
        Request({
            apiUrl:API.showMemberOrderList,
            data:this.data.searchData
        }).then((data)=>{
            $Toast.hide();
            let progressingdata=[];
            let finished=[];
            let flag=this.data.noInfo;
            if(data.status==0){
                let res=data.data;
                if(res.progressing){progressingdata=res.progressing;}
                if(res.finished){ finished=res.finished;}
               if (!res.progressing&&!res.finished){
                   flag=true
               }

            }else if(data.status==404){
                flag=true;
            }
            this.setData({
                progressing:progressingdata,
                finished,
                noInfo:flag
            })


        }).catch((err)=>{
            $Toast({
                content:'请求失败，请稍后重试',
                type:'error'
            })
        })
    },
    handlecancel(){

        this.setData({
            ifcancel:true
        })
    },
    cancelSearch(){
        this.setData({
            ifSearch:false,
            searchtext:''
        })
    },
    inputComfirm(e){
        // console.log("searchning");
    },
    inputChange(e){
        this.setData({
            searchtext:e.detail
        })
    },
    handleSearch(){
        this.setData({
            ifSearch:true
        })
    },
    selectcell1({target}){
        let arr=target.id.split("_");
        let index=arr[1];
        let orderSource=this.data.orderSource;
        orderSource[index].checked=!orderSource[index].checked;
        this.setData({
            orderSource
        })
    },
    selectcell({target}){
        let arr=target.id.split("_");
        let index=arr[1];
        let objKey=arr[0];
        let result=this.data[objKey].map(item=>{
            delete item.checked;
            return  item
        });
        result[index].checked=true;
        this.setData({
            [objKey]:result
        })
    },
    close({target}){
        this.setData({
            [target.dataset.type]:false
        })
    },
    showPopover1(){
        this.setData({
            searchConditionVisible1:true,
            searchConditionVisible2:false
        })
    },
    showPopover2(){
        this.setData({
            searchConditionVisible2:true,
            searchConditionVisible1:false
        })
    },
    bindDateChange({detail,target}){

        this.setData({
              [target.dataset.type]:detail.value
          })
    },
    formSubmit({detail}){

        let endDate=detail.value.endDate;
        let startDate = detail.value.startDate;
        let searchData =  this.data.searchData;
        searchData.arriveTimeST = startDate;
        searchData.arriveTimeET = endDate;
        let orderSourceStr = [];
        this.data.orderSource.forEach(element => {
            if(element.checked){
                orderSourceStr.push(element.code )
            }
        });

        orderSourceStr=orderSourceStr.join(',');
        searchData.orderSourceStr = orderSourceStr;

        let svcAreaStr = [];
        this.data.svcArea.forEach(element => {
            if(element.checked){
                svcAreaStr.push(element.code)
            }
        });
        svcAreaStr=svcAreaStr.join(',');
        searchData.svcAreaStr = svcAreaStr;

        let svcCategoryStr = [];
        this.data.svcCategory.forEach(element => {
            if(element.checked){
                svcCategoryStr.push(element.code)
            }
        });
        svcCategoryStr=svcCategoryStr.join(',')
        searchData.svcCategoryStr = svcCategoryStr;

        let flightCategoryStr = [];
        this.data.flightCategory.forEach(element => {
            if(element.checked){
                flightCategoryStr.push(element.code)
            }
        });
        flightCategoryStr=flightCategoryStr.join(',');
        searchData.flightCategoryStr = flightCategoryStr;

        let inOutPortStr = [];
        this.data.inOutPort.forEach(element => {
            if(element.checked){
                inOutPortStr.push(element.code)
            }
        });

        inOutPortStr=inOutPortStr.join(',');
        searchData.inOutPortStr = inOutPortStr;
        $Toast({
            content: '搜索中...',
            type: 'loading',
            duration:0
        });
        this.setData({
            searchData
        });
        this.refreshData();


        this.setData({
            searchConditionVisible1:false,
            searchConditionVisible2:false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad() {
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function onReady() {
        //预约来源
        Request({
            apiUrl:'/wechat/common/code',
            data:{  codeType: 'OrderSource'}
        }).then((data)=>{
            let orderSource=[];
            data.data.forEach(ele=>{
                orderSource.push({
                    id:ele.id,
                    code:ele.code,
                    text:ele.text,
                    checked:false
                })
            })
            this.setData({
                orderSource
            })

        })
        //服务区域
        Request({
            apiUrl:'/wechat/common/code',
            data:{  codeType: 'SvcArea'}
        }).then((data)=>{
            let svcArea=[];
            data.data.forEach(ele=>{
                svcArea.push({
                    code:ele.code,
                    text:ele.text,
                    checked:false
                })
            })
            this.setData({
                svcArea
            })

        })
        //服务类型
        Request({
            apiUrl:'/wechat/common/code',
            data:{  codeType: 'SvcCategory'}
        }).then((data)=>{
            let svcCategory=[];
            data.data.forEach(ele=>{
                svcCategory.push({
                    code:ele.code,
                    text:ele.text,
                    checked:false
                })
            })
            this.setData({
                svcCategory
            })

        });
        //国内/国际
        Request({
            apiUrl:'/wechat/common/code',
            data:{  codeType: 'flightCategory'}
        }).then((data)=>{
            let flightCategory=[];
            data.data.forEach(ele=>{
                flightCategory.push({
                    code:ele.code,
                    text:ele.text,
                    checked:false
                })
            })
            this.setData({
                flightCategory
            })

        })
        //进/出港
        Request({
            apiUrl:'/wechat/common/code',
            data:{  codeType: 'InOutPort'}
        }).then((data)=>{
            let inOutPort=[];
            data.data.forEach(ele=>{
                inOutPort.push({
                    code:ele.code,
                    text:ele.text,
                    checked:false
                })
            })
            this.setData({
                inOutPort
            })

        })
    },

    /**
     * 生命周期函数--监听页面显示
     */

    onShow: function onShow() {
        this.setData({
            searchData:{
                memberId:app.globalData.sysUserInfo.memberID,
                arriveTimeST:'',
                arriveTimeET:''
            }
        })
        this.refreshData();

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function onHide() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function onUnload() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function onPullDownRefresh() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function onReachBottom() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function onShareAppMessage() {}
});