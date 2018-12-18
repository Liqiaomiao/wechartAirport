import API from '../../utils/API.js'
import {Request} from "../../utils/wxRequest.js"
const { $Toast } = require('../../components/iview/base/index');
const app=getApp();
import Promise from '../../libs/promise'
import regeneratorRuntime from '../../libs/regenerator'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        list:{},
        startValue:5,
        startValue1:5,
        startValue2:5,
        startValue3:5,
        evaluateContent:'',
        base64:'',
        imageList:[],
        base64Imgs:[],
        formData:{}
    },

    startChange({currentTarget,detail}){/*评价星星*/
        const index = detail.index;
        this.setData({
            [currentTarget.id] : index
        })
    },
    handleblur({detail}){
        this.setData({
            evaluateContent:detail.value
        })
    },
    chooseImage(){/*选图*/
        const ctx = wx.createCanvasContext('myCanvas')
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res)=> {
                const imageList = this.data.imageList;
                if(imageList.indexOf(res.tempFilePaths[0])==-1){
                    imageList.push(res.tempFilePaths[0]);
                }
                this.setData({
                    imageList
                })







            }
        })
    },

    handleDel({currentTarget}){/*移除图片*/
        let index=currentTarget.dataset.index;
        let imageList=this.data.imageList;
        imageList.splice(index,1);
        this.setData({
            imageList
        })
    },
    previewImage({target}){/*放大图片*/
        wx.previewImage({
            current:target.dataset.src,
            urls:this.data.imageList
        })
    },

    toBase64(item){
      return new Promise((resolve,reject)=>{
          wx.getFileSystemManager().readFile({
              filePath:item, //选择图片返回的相对路径
              encoding: 'base64', //编码格式
              success: res => { //成功的回调
                  resolve(`data:image/jpeg;base64,${res.data}`)
              }
          });
      })
    },
    handelSubmit(){/*提交评价*/
        let thisdata=this.data;
        let AUTH_TOKEN=app.globalData.sysUserInfo.authtoken;
        let formData=this.data.formData;
        let imageList=this.data.imageList;
         new Promise((res,rej)=>{
                var arr=[];
                imageList.forEach((item)=>{
                    (async()=>{
                        let list = await this.toBase64(item);
                        arr.push(list)
                        res(arr)
                    })()
                });

            }).then((arr)=>{
             formData.evaluateContent=thisdata.evaluateContent;
             formData.evaluateScore=thisdata.startValue;
             formData.svcMannerRate=thisdata.startValue1; /*服务态度*/
             formData.svcQualityRate=thisdata.startValue2;/*服务质量*/
             formData.facilitiesRate=thisdata.startValue3;/*环境设施*/
             formData['base64Imgs[0]']=arr;/*图片*/

             Request({
                 apiUrl:API.saveEvaluate,
                 data:formData,
                 header:{
                     AUTH_TOKEN,
                     'content-Type': 'application/x-www-form-urlencoded'
                 }
             }).then(({data,status,message})=>{
                 if(status==0){

                     $Toast({
                         content:message,
                         type:'success'
                     });
                     setTimeout(()=>{
                         wx.navigateBack({
                             delta:1
                         })

                     },1000)

                 }else{
                     $Toast({
                         content:message,
                         type:'warning'
                     })
                 }
             }).catch(()=>{
                 $Toast({
                     content:'请求失败，请稍后重试',
                     type:'error'
                 })
             })
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
        let pk= getCurrentPages()[getCurrentPages().length - 1].options.pk;
        Request({
            apiUrl:API.showOrderDetail,
            data:{ pk}
        }).then(({data,status})=>{
            let formData = this.data.formData;
            formData.orderInfoID=data.order.id;
            formData.memberID=app.globalData.sysUserInfo.memberID;
            if(status==0){
                this.setData({
                    list:data.order,
                    formData
                })
            }


        }).catch(()=>{
            $Toast({
                content:'请求失败，请稍后重试',
                type:'error'
            })
        })
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