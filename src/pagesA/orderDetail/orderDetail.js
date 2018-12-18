let {Request,Router}=require('../../utils/wxRequest.js');
import API from '../../utils/API'
import {dateFormat} from '../../utils/format'
const { $Toast } = require('../../components/iview/base/index');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        webServer:API.IMG_BASE_SERVER_URL,
        list:{},
        desc: [
            {title: '会员卡号', value: '2017000400010001'},
            {title: '预达时间', value: '2018-09-22 05:06'},
            {title: '贵宾区', value: '--'},
            {title: '航班号', value: 'G52655'},
            {title: '使用人次', value: '1'}

        ],
        descMore:[
            {title:'起飞时间',value:''},
            {title:'落地时间',value:''},
            {title:'接机牌信息',value:''},
            {title:'备注',value:''},
        ],
        detail:{
            state:2,
            vipCategory:true,
            vipCategoryStr:'vip',
            svcCategory:2,
            svcCategoryStr:'svc',
            flightCategoryStr:'国内',
            inOutPortStr:'进港'
        },
        hd: {
            left: "微信预约",
            rightKey: "航程",
            rightValue: "北京-天津",
            order:true
        },
        ifMoreVisible:false,
        btnText:'展示完整信息',
        current: 'travellers',
        travellers:[//出行人

        ],
        contacters:[//联系人

        ],
        cars:[//车辆
            {carNum:'津H1246',isMain:1,isHeavySvc:1,isOvernight:1,memo:'xxxxxx'}
        ],
        currentTab:[],
        current2:'ordertrace',
        endTime:'2018-10-22T05:06:07',
        verticalCurrent : 10000,
        log:[
            {
                operateTypeStr:'新增',
                operateTime:'2018-09-20 14:27',
                operateDesc:'您新增了一条服务预约，订单编号：SVC 1809200002'
            },
            {
                operateTypeStr:'新增',
                operateTime:'2018-09-20 14:27',
                operateDesc:'您新增了一条服务预约，订单编号：SVC 1809200002'
            },
            {
                operateTypeStr:'新增',
                operateTime:'2018-09-20 14:27',
                operateDesc:'您新增了一条服务预约，订单编号：SVC 1809200002'
            }
        ],
        cancalModal:false,
        canCancel:true
    },
    timeend(){
        this.setData({
            canCancel:false
        })
    },
    cancelOrder(){

       this.setData({
           cancalModal:true
       })


    },
    handleClose1(){
        this.setData({
            cancalModal:false
        });
        $Toast({
            content:'正在取消...',
            type:'loading'
        });
        Request({
            apiUrl:API.cancelOrder,
            data:{pk:this.data.list.id}
        }).then(({data,status})=>{
            $Toast({
                content:data.message,
                type:'success'
            })
            if(status===0){

                Router({
                    type : 'navigateTo',
                    path : 'order'
                })
            }

        }).catch((err)=>{
            $Toast({
                content:"请求失败，请稍后重试",
                type:'warning'
            })
        })



    },
    modalCancel(){
        this.setData({
            cancalModal:false
        });
    },
    showMore(){
        let btnText=this.data.btnText=='展示完整信息'?'收起':'展示完整信息';
        this.setData({
            btnText,
            ifMoreVisible:!this.data.ifMoreVisible
        })
    },
    handleChange ({ detail }) {  /*出行人等切签*/

        this.setData({
            current: detail.key
        });
    },
    handleChange2 ({ detail }) {  /*订单跟踪等切签*/
       let keyname=detail.key;
        if(keyname.indexOf('detail')!=-1&&(keyname.indexOf('7')==-1&&keyname.indexOf('9')==-1)){//disable 不存在 9 也不存在7
            return
        }
        if(keyname.indexOf('comment')!=-1&&keyname.indexOf('9')==-1){
            return
        }
        this.setData({
            current2: detail.key
        });
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
        let pk=getCurrentPages().slice(-1)[0].options.pk;
        Request({
            apiUrl:API.showOrderDetail,
            data:{pk:pk}
        })
            .then(({status,data})=>{
                if(status==0){
                    let obj={
                        list:data.order,
                        log:data.logs
                    }
                    if(data.evaluates){
                        obj.evaluates=data.evaluates.map((item)=>{
                            let obj=item;
                            obj.tranTs=dateFormat(item.tranTs,'all')
                            return obj
                        });
                    }
                    if(data.consumes){
                        let consumes=data.consumes;
                        let name=Object.keys(consumes);
                        obj.consumes=consumes;
                        obj.consumesname=name;
                        obj.consumesObj=consumes[name[0]]
                    }
                    console.log(obj);
                    this.setData(obj)

                }else{
                    $Toast({
                        type:'error',
                        content:data.message
                    })
                }

            })
            .catch(()=>{
                $Toast({
                    type:'error',
                    content:"请求失败，请稍后重试"
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