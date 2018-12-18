import API from '../../utils/API'
import {Request} from  '../../utils/wxRequest'
const { $Toast } = require('../../components/iview/base/index');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        cardOwnerList:[],
        cellphone:'',
        phone_focus:true,
        action:[
            {
                name:'搜索',
                color: '#2d8cf0'
            },
            {
                name: '取消'
            }
        ],
        actionAdd:[
            {
                name:'添加',
                color: '#2d8cf0'
            },
            {
                name: '取消'
            }
        ],
        actionDel:[
            {
                name:'确定',
                color: '#7c1b1e'
            },
            {
                name: '取消'
            }
        ],
        visiblesearch:false,
        visibleadd:false,
        visibleDel:false,
        delIndex:'',
        cardNo:''
    },
    delContact({currentTarget}){/*删除预约人*/
        this.setData({
           visibleDel:true,
           delIndex:currentTarget.dataset.index
       })
    },
    handleDel({detail}){/*确定删除预约人*/
        if(detail.index==0){/*确定*/

            let cardOwnerList=this.data.cardOwnerList;
            let index=this.data.delIndex;
            let cardNo = getCurrentPages().slice(-1)[0].options.cardNo;
            let memberID=cardOwnerList[index].memberID;

            Request({
                apiUrl:API.deleteCardOwner,
                data:{
                    cardNo,
                    memberID
                }
            }).then(({data,status,message})=>{
                if(status==0){
                    $Toast({
                        content:'解绑成功',
                        type:"success"
                    });
                    this.setData({
                        cardOwnerList:cardOwnerList.splice(index,1)
                    })
                }else{
                    $Toast({
                        content:message,
                        type:"warning"
                    })
                }
            }).catch(()=>{
                $Toast({
                    content:"请求失败，请稍后重试",
                    type:"error"
                })
            })
        }
        this.setData({
            visibleDel:false
        }) ;


    },
    getMember(){

        Request({
            apiUrl:API.cardOwner,
            data:{cardNo:this.data.cardNo}
        }).then(({data,status,message})=>{
            if(status==0){
                this.setData({
                    cardOwnerMax:data.cardOwnerMax,
                    cardOwnerList:data.cardOwnerList
                })
            }else{
                $Toast({
                    content:message,
                    type:'error'
                })
            }
        }).catch(()=>{
            $Toast({
                content:"请求失败，请稍后重试",
                type:'error'
            })
        })
    },
    handleAdd({detail}){/*添加有效预约人*/

        if(detail.index==0) { /*添加*/
            this.setData({
                visibleadd: false
            });
            let cardNo=this.data.cardNo;
            let memberID=this.data.addDetail.memberID;
            Request({
                apiUrl:API.addCardOwner,
                data:{cardNo,memberID}
            }).then(({data,status,message})=>{
                if(status==0){
                    $Toast({
                        content:'添加成功',
                        type:'success'
                    });
                    this.setData({
                        visibleadd:false
                    });
                    this.getMember()

                }else{
                    $Toast({
                        content:message,
                        type:'warning'
                    });
                }

            }).catch(()=>{
                $Toast('请求失败，请稍后重试')
            })

        }else{                /*取消添加*/
            this.setData({
                visibleadd:false
            })
        }
    },
    clearInput(e){/*清除手机号*/
        // console.log(e);
        this.setData({
            cellphone:'',
            phone_focus:true
        })
    },
    handleSearch({detail}){/*号码查询*/
        if(detail.index==0){ /*搜索*/
            Request({
                apiUrl:API.presentMembers,
                data:{cellphone:this.data.cellphone}
            }).then(({data,status,message})=>{
                if(data){

                    this.setData({
                        addDetail:data,
                        visibleadd:true,
                        visiblesearch:false
                    })
                }else{
                    this.setData({
                        visiblesearch:false
                    });
                    $Toast({
                        content:message,
                        type:'warning'
                    })
                }
            }).catch(()=>{
                $Toast('获取会员信息失败，请稍后重试')
            })
        }else{/*取消*/
            this.setData({
                visiblesearch:false
            })
        }

    },
    inputblur({detail }){/*输入框取值*/

        this.setData({
            cellphone:detail.value
        })
    },
    showSearch(){
        this.setData({
            visiblesearch:true,
            cellphone:''
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
        let cardNo=getCurrentPages().slice(-1)[0].options.cardNo;
        this.setData({
            cardNo
        })
        this.getMember()

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