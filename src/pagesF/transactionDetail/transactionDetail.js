import Promise from '../../libs/promise'
import regeneratorRuntime from '../../libs/regenerator'
import {Request,Load,Router} from '../../utils/wxRequest'
import API from '../../utils/API'
import {priceFormat} from '../../utils/format'
const { $Toast } = require('../../components/iview/base/index');
let app=getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        Index: 0,
        detailList: [],
        searchData:{},
        searchVisible:false,
        searchtext:'',
        optionsVisible:false,
        tradeTimeST:'',
        tradeTimeET:'',
        tradeType:[],
        noinfoVisible:false,
        ifhidetoggle:true
    },

    //页面滚动执行方式
    scroll({detail}) {
        const className = '.title';
        const query = wx.createSelectorQuery().in(this);
        query.selectAll(className).boundingClientRect((res) => {
            res.forEach((item, index) => {
                if (item.top <60) {
                    this.setData({
                        Index:index
                    })
                }
            })

        }).exec();



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
    async _getType(){  /*查询标签*/
        Load()
      let {data,message,status}=await  Request({
            apiUrl:API.byCode,
            data:{codeType:'TradeType'}}
        );
        this._getList()
            if(status==0){
                let tradeType=[];
                data.forEach(element=>{
                    tradeType.push({
                        code:element.code,
                        text:element.text,
                        checked:false
                    })
                });
                this.setData({
                    tradeType
                })
            }else{
                $Toast({
                    content:message,
                    type:'warning'
                })
            }
    },
    async _getList() {
       this.setData({
           detailList:[]
       })
        let memberId = app.globalData.sysUserInfo.memberID;
        let searchData = this.data.searchData;
        let noinfoVisible=this.data.noinfoVisible;
        noinfoVisible=true;
        searchData.memberId = memberId;
        this.setData({
            searchData
        });

        let {data, message, status} = await  Request({
            apiUrl: API.showTradeDetailList,
            data: searchData
        });
        if (status == 0) {
            if(data.length>0){
                noinfoVisible=false;
            }
            data.forEach(item=>{
                item.payFeeSumFmt=priceFormat(item.payFeeSum);
                item.records.forEach(record=>{
                    record.actualPayFeeFmt=priceFormat(record.actualPayFee)
                })
            })
            this.setData({
                detailList: data
            })
        }else{
            $Toast({
                content:message,
                type:'warning'
            })
        }
        this.setData({
            noinfoVisible
        })
        Load('hide');
    },
    /*输入框搜索start*/
    goSearch(){
        this.setData({
            searchVisible:true
        })
    },
    inputChange(e){
        this.setData({
            searchtext:e.detail
        })
    },
    inputComfirm(e){/*确定输入框搜索*/

    },
    cancelSearch(){
        this.setData({
            searchVisible:false
        })
    },
    /*输入框搜索end*/
    /*筛选================start*/
    /*日期选择*/
    bindDateChange({detail,currentTarget}){
        this.setData({
            [currentTarget.dataset.type]:detail.value
        })
    },
    checkTag({currentTarget}){
        let index=currentTarget.dataset.index;
        let tradeType=this.data.tradeType;
        tradeType.forEach((item,itemindex)=>{

            if(index==itemindex){
                item.checked=!item.checked
            }
        });
        this.setData({
            tradeType
        })


    },
    showOptions(){
        this.setData({
            optionsVisible:!this.data.optionsVisible
        })
    },
    optionsCancel(){/*取消选项*/
        this.setData({
            optionsVisible:false
        })
    },
    optionsComfirm(){/*确定选项*/
        let tradeType=this.data.tradeType.filter((item)=>{
            return item.checked==true
        }).map(item=>{
            return item.code
        }).join(',');

        let tradeTimeST=this.data.tradeTimeST;
        let tradeTimeET=this.data.tradeTimeET;
        let searchData = this.data.searchData;
        searchData.tradeType=tradeType;
        searchData.tradeTimeET=tradeTimeET;
        searchData.tradeTimeST=tradeTimeST;
        this.setData({
            searchData
        });

        this._getList();

        this.setData({
            optionsVisible:false
        })

    },
    /*筛选================end*/
    goDetail({currentTarget}){/*到明细详情*/
        let pk = currentTarget.dataset.pk;
        let tradetype=currentTarget.dataset.tradetype;
      Router({
        type : 'navigateTo',
        path : 'detail',
        params : {
            pk : pk ,
            tradeType : tradetype
        }
    })
    },
    handletoggle(){
        this.setData({
            ifhidetoggle:!this.data.ifhidetoggle
        })
    },
    hideToggle(){
        this.setData({
            ifhidetoggle:true
        })
    },
    _longPic({currentTarget}){
        Router({
            type : 'navigateTo',
            path : 'transactionLongPic',
            params : {
                type : currentTarget.dataset.type
            }
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this._getType();
        this._getList()
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