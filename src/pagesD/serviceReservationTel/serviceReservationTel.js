const basUrl = 'http://wxtsn.nat300.top/tsn.app/';
Page({
    data:{
        cellPhoneNum:[
            {text:'4006496888'},
            {text:'(022)24906888'},
        ],
        serverName: [
            { name: "包场服务", url: "" },
            { name: "异地服务", url: "" },
            { name: "市内接送", url: "" },
            { name: "卧房休息", url: "" },
            { name: "会议保障", url: "" },
            { name: "贵宾餐厅", url: "" },
            { name: "鲜花迎送", url: "" },
            { name: "讲师培训", url: "" },
            { name: "舱门接送", url: "" },
            { name: "按摩淋浴", url: "" }
        ],
        popoverVisible:false
    },
    cellPhone(){
        if (this.data.cellPhoneNum.length > 0) {
            this.setData({
                popoverVisible:true
            })
        } else {
            this.load(3, "获取预约电话失败");
        }
    },
    callPhone({currentTarget}){
        wx.makePhoneCall({
            phoneNumber: currentTarget.id//仅为示例，并非真实的电话号码
        })
    },
    closePop(){
        this.setData({
            popoverVisible:false
        })
    },
    onReady(){
        wx.request({
            url:basUrl+'/wechat/common/code',
            data:{ codeType: 'TelOrder'},
            success(){

            }
        })
    }
})
