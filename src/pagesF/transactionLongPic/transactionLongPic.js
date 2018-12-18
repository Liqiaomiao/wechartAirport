
const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
const { $Toast } = require('../../components/iview/base/index');

Page({
    onReachBottomDistance : 0,
    data:{
        current: 'today',
        startTime : '',
        endTime : '',
        pickerValue : '',
        chooseStartTime : '',
        chooseEndTime : '',
        showDateChoose : false,
        pageSize : 10 ,
        pageNo : 1,
        dataTotal : 0,
        listData : [],
        itemHeight : 80 ,
        canvasWidth : 0,
        canvasHeight : 0,
        ctx : '',
        canvasHidden : true,
        searchState : false,
        detailHeight : 340 ,
        pageType : 'normal',
        topHeight : 20 ,
        leftWidth : 20,
        itemDetailHeight : 160,
        localImgPath : {},
        localImgPathNum : []
    },
    _handleChange ({ detail }) {
        if(detail.key != this.data.current){
            this.setData({
                listData : [],
                dataTotal : 0 ,
                pageSize : 10 ,
                pageNo : 1,
                current: detail.key,
                showDateChoose : false
            });
            if(detail.key == 'self'){
                this.setData({
                    showDateChoose : true,
                    canvasHidden : true ,
                    searchState : false
                })
                return
            }
            this.data.ctx.clearRect(0,0,this.data.canvasWidth,this.data.canvasHeight)
            this._getList() 

        }else{
            if(detail.key == 'self'){
                this.setData({
                    showDateChoose : true,
                    canvasHidden : true ,
                    searchState : false
                })
            }
        }
        
    },
    _bindDateCancel(){
        this.setData({
            showDateChoose : false
        })
    },
    _bindDateChange({detail,currentTarget}){
       let type = currentTarget.dataset.type

       if(type == 'start'){
           this.setData({
            chooseStartTime : detail.value
           })
       }
       if(type == 'end'){
        this.setData({
            chooseEndTime : detail.value
        })
    }
    },
    _chooseDate({currentTarget}){
        this.setData({
            showDateChoose : true
        })
    },
    async _getList(type){

        let _this = this

        this.setData({
            canvasHidden : true,
            searchState : false
        })

        $Toast({
            content: '加载中',
            duration: 0,
            mask: false,
            type : 'loading'
        });
        let resData = await commonMethods.Request({
            apiUrl : API.condition ,
            data : {
                memberId: app.globalData.sysUserInfo.memberID,
                time: this.data.current,
                pageSize: this.data.pageSize,
                pageNo: this.data.pageNo,
                tradeTimeST: this.data.chooseStartTime,
                tradeTimeET: this.data.chooseEndTime,
            }
        })

        if(resData.status != 0){
            $Toast({
                type : 'error' ,
                content : resData.message || '没有找到记录'
            })
            this.setData({
                searchState : true
            })
            return
        }
        

        if(type){

            let listData = this.data.listData

            listData = listData.concat(resData.data.rows)

            this.setData({
                listData
            })

            this._setCanvas(true,resData.data.rows)

            return
        }   

        let listData = [],localImgData = {}
        resData.data.rows.map( (val,index) => {
            val.formatCardno = format.cardnoFormat(val.cardInfoID)
            let str = val.actualPayFee > 0 ? '+' : '-'
            val.formatPrice = str + format.priceFormat(Math.abs(val.actualPayFee))
            val.formatImg = `${API.IMG_BASE_SERVER_URL}${val.cardSeriesImgUrl}`
            // if(){}
            listData.push(val)
            localImgData[`${val.cardType}`] = `${API.IMG_BASE_SERVER_URL}${val.cardSeriesImgUrl}`
        })

        this.setData({
            localImgData
        })

        for(let key in localImgData){
            _this._setNetImg(localImgData[key],key)
        }

        this.setData({
            listData : listData,
            dataTotal : resData.data.total
        })
        
        
    },
    _setCanvas(drawState,data){

        let canvasHeight = this.data.listData.length * this.data.itemHeight

        if(this.data.pageType == 'detail'){
            canvasHeight = this.data.listData.length * this.data.detailHeight + this.data.topHeight * this.data.listData.length + 20
            this._rect(this.data.ctx,'#f0f0f1',[ 0 , 0, this.data.canvasWidth, canvasHeight ])
        }

        this.setData({
            canvasHeight
        })

            if(drawState){
                data.map( (val,index) => {
                    if(this.data.pageType == 'normal'){
                        this._drawCanvas(this.data.ctx,val,index + ((this.data.pageNo - 1 ) * this.data.pageSize))
                    }else{
                        this._detailCanvas(this.data.ctx,val,index + ((this.data.pageNo - 1 ) * this.data.pageSize))
                    }
                    
                })
                this.data.ctx.draw(drawState)
            }else{
                data.map( (val,index) => {
                    if(this.data.pageType == 'normal'){
                        this._drawCanvas(this.data.ctx,val,index)
                    }else{
                        this._detailCanvas(this.data.ctx,val,index)
                    }
                })
                this.data.ctx.draw()
            }

            $Toast.hide()

            $Toast({
                type : 'success',
                content : `更新了 ${data.length} 条记录`
            })

            setTimeout( () => {
                this.setData({
                    canvasHidden : false,
                    searchState : true
                })
                // if(this.data.pageNo > 1){
                //     wx.pageScrollTo({
                //         scrollTop : canvasHeight / 2 
                //     })
                // }
            },2000)
    },
    _operateDate({currentTarget}){
        let type = currentTarget.dataset.type

        this.setData({
            showDateChoose : false
        })

        if(type == 'close'){
            if(this.data.listData.length > 0){
                this.setData({
                    canvasHidden : false
                })
            }
        }
 
        if(type == 'ok'){
            let chooseStartTime = Number(this.data.chooseStartTime.replace(/-/g,'')),
            chooseEndTime =  Number(this.data.chooseEndTime.replace(/-/g,''))
            if(chooseStartTime == '' ||  chooseEndTime == ''){
                $Toast({
                    type : 'error',
                    content : '开始/截止时间不能为空'
                })
                return 
            }
            if(chooseStartTime > chooseEndTime){
                $Toast({
                    type : 'error',
                    content : '开始时间不能大于截止时间'
                })
                return 
            }
            this._getList()
        } 
    },
    _rect(ctx,color,pos){
        if(color){
            ctx.setFillStyle(color);
        }
        ctx.fillRect(pos[0],pos[1],pos[2],pos[3]);    
    },
    _line(ctx,color,move,line,lineWidth){
        ctx.beginPath()
        if(lineWidth){
            ctx.setLineWidth(lineWidth)
        }
        ctx.setStrokeStyle(color);
        ctx.setLineCap('round');
        ctx.moveTo(move[0],move[1])
        ctx.lineTo(line[0],line[1])
        ctx.stroke();
        ctx.closePath();
    },
    _arc(ctx,color,arcs){
        ctx.beginPath();
        ctx.arc(arcs[0],arcs[1],arcs[2],arcs[3],arcs[4],arcs[5]); 
        ctx.setFillStyle(color);
        ctx.fill();
        ctx.setStrokeStyle(color)
        ctx.stroke();
        ctx.closePath();
    },
    _text(ctx,color,size,text,pos,base,align){
        ctx.setFillStyle(color);
        ctx.setFontSize(size);
        if(base){
            ctx.setTextBaseline(base) 
        }
        if(align){
            ctx.setTextAlign(align)
        }
        ctx.fillText(text,pos[0],pos[1]); 
    },
    _imgage(ctx,img,pos){
        ctx.save()
        ctx.beginPath();
        ctx.arc(pos[0] + 50 , pos[1] + 30 , 20 , 0, Math.PI * 2, false);
        ctx.setFillStyle('#FFFFFF')
        ctx.fill()
        ctx.clip();
        ctx.drawImage(img, pos[0], pos[1], pos[2], pos[3]);
        ctx.closePath();
        ctx.restore()
    },
    _drawCanvas(ctx,val,index){
        let itemHeight = this.data.itemHeight , canvasWidth = this.data.canvasWidth,
        nowItemHeight = this.data.itemHeight * index, leftValue = '' , rightValue = ''

        leftValue = val.actualPayFee >= 0 ? '进' : '出'

        if(val.cardCat == '1' || val.cardCat != '1' && val.tradeType != '4'){
            if(val.actualPayFee < 0){
                rightValue = ['#ed3f14',`- ${format.priceFormat(Math.abs(val.actualPayFee))}`]
            }else{
                rightValue = ['#19be6b',`+ ${format.priceFormat(Math.abs(val.actualPayFee))}`]
            }
            
        }else if(item.cardCat != '1' && item.tradeType == '4'){
            rightValue = ['#ed3f14',`- ${val.consumeCount} 次`]
        }else{
            rightValue = ['#19be6b','不限次']
        }

        this._rect(ctx,'#FFFFFF',[ 0 , nowItemHeight, canvasWidth, itemHeight ])
        this._arc(ctx,'#B99156',[ 40 , itemHeight / 2 + nowItemHeight , 25, 0, 2 * Math.PI, true ])
        this._text(ctx,'#FFFFFF',26 ,leftValue ,[ 40 , itemHeight / 2 + nowItemHeight ],'middle','center')
        this._text(ctx,'#495060',14,val.tradeName,[ itemHeight, 25 + nowItemHeight ],'normal','left')
        this._text(ctx,'#80848f',13,`[${val.cardSeriesStr}] [${val.tradeTypeStr}]`,[ itemHeight, 46 + nowItemHeight ],'normal','left')
        this._text(ctx,'#80848f',12,val.tradeTime,[ itemHeight, 65 + nowItemHeight ],'normal','left')
        this._text(ctx,rightValue[0],14,rightValue[1],[ canvasWidth - 45, nowItemHeight + 40 ],'middle','center')
        this._line(ctx,'#B99156',[ 80 , (index + 1) * itemHeight],[canvasWidth, (index + 1) * itemHeight ])
    },
    _detailCanvas(ctx,val,index){

        this.setData({
            itemDetailHeight : 160
        })

        let detailHeight = this.data.detailHeight , canvasWidth = this.data.canvasWidth, rightValue = '',
        topHeight = this.data.topHeight ,leftWidth = this.data.leftWidth
        

       
        if(val.cardCat == '1' || val.cardCat != '1' && val.tradeType != '4'){
            if(val.actualPayFee < 0){
                rightValue = ['#ed3f14',`- ${format.priceFormat(Math.abs(val.actualPayFee))}`]
            }else{
                rightValue = ['#19be6b',`+ ${format.priceFormat(Math.abs(val.actualPayFee))}`]
            }
            
        }else if(item.cardCat != '1' && item.tradeType == '4'){
            rightValue = ['#ed3f14',`- ${val.consumeCount} 次`]
        }else{
            rightValue = ['#19be6b','不限次']
        }

        if(val.actualPayReward){
            detailHeight += 40
        }
        if(val.actualPayPoints){
            detailHeight += 40
        }

        let paddingHeight = topHeight + detailHeight * index + topHeight * index

        this._rect(ctx,'#FFFFFF',[ leftWidth , paddingHeight , canvasWidth - leftWidth * 2 , detailHeight ])
        this._imgage(ctx,this.data.localImgPath[`${val.cardType}`],[80,25 + paddingHeight ,100,60])
        this._text(ctx,'#1c2438',16,val.cardSeriesStr,[canvasWidth / 2 - 30 ,55 + paddingHeight ],'middle','left')
        this._text(ctx,rightValue[0],20,rightValue[1],[canvasWidth/2,90 + + paddingHeight],'middle','center')
        this._text(ctx,'#80848f',14,'交易成功',[canvasWidth/2,125 + + paddingHeight],'normal','center')
        this._line(ctx,'#e9eaec',[ leftWidth , 140 + + paddingHeight],[canvasWidth - leftWidth, 140 + + paddingHeight ])

        this._detailItem(ctx,'卡号',format.cardnoFormat(val.cardInfoID),this.data.itemDetailHeight,paddingHeight)
        this._detailItem(ctx,'交易方式',val.tradeWayStr,this.data.itemDetailHeight,paddingHeight)
        this._detailItem(ctx,'交易类型',val.tradeTypeStr,this.data.itemDetailHeight,paddingHeight)
        this._detailItem(ctx,'交易渠道',val.tradeChannelStr,this.data.itemDetailHeight,paddingHeight)
        if(val.actualPayReward){
            this._detailItem(ctx,'体验金使用','val.actualPayReward',this.data.itemDetailHeight,paddingHeight) 
        }
        if(val.actualPayPoints){
            this._detailItem(ctx,'积分奖励','val.actualPayPoints',this.data.itemDetailHeight,paddingHeight)
        }
        this._detailItem(ctx,'说明',val.tradeName,this.data.itemDetailHeight,paddingHeight)
    },
    _detailItem(ctx,name,val,y,paddingHeight){
        let index = (y - 160) / 20
        this._text(ctx,'#495060',14,name,[this.data.leftWidth * 2, y + index * 20 + paddingHeight],'middle','left')
        this._text(ctx,'#495060',14,val,[this.data.canvasWidth - (this.data.leftWidth * 2) - 20, y + index * 20 + paddingHeight],'middle','right')
        this._text(ctx,'#495060',14,'>',[this.data.canvasWidth - (this.data.leftWidth * 2),y + index * 20 - 2 + paddingHeight],'middle','right')
        this._line(ctx,'#e9eaec',[ this.data.leftWidth + 20, y + 20 + index * 20 + paddingHeight],[this.data.canvasWidth - this.data.leftWidth - 20 ,  y + 20 + index * 20 + paddingHeight])
        this.setData({
            itemDetailHeight : y + 20 
        })
    },
    _canvasTolower(){
        let  pageSize = this.data.pageSize,
        pageNo = this.data.pageNo,
        dataTotal = this.data.dataTotal,
        listNum = dataTotal - pageSize * pageNo

        if(listNum <= 0){
            $Toast({
                type : 'warning',
                content : '没有更多数据了'
            })

            return
        }

        pageNo++

        if(listNum < 10 ){
            pageSize = listNum
        }

        this.setData({
            pageSize,pageNo
        })

        this._getList('add')


    },
    _getImgSetting(){
        let _this = this
        wx.getSetting({
            success: (res) => {
                let wxSetting = res.authSetting
                if(wxSetting['scope.writePhotosAlbum']){ 
                    _this._getCanvasImg()
                    return 
                }
                
                wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                        _this._getCanvasImg()
                    }
                })
            }
        })
    },
    _getCanvasImg(){
        let _this = this,ctx = this.data.ctx
        this._rect(ctx,0,0,this.data.canvasWidth,this.data.canvasHeight)
        ctx.draw(true,() => {
            wx.canvasToTempFilePath({
                canvasId: 'transactionCanvas',
                success(res) {
                    _this.setData({
                        canvasHidden : true
                    })
                    $Toast({
                        type : 'loading',
                        content : '保存交易明细长图中',
                        duration: 0,
                    })
                    setTimeout( () => {
                        wx.saveImageToPhotosAlbum({
                            filePath : res.tempFilePath,
                            success : (res) => {
                                $Toast.hide()
                                $Toast({
                                    type : 'success',
                                    content : '保存交易明细长图成功'
                                })
                                setTimeout( () => {
                                    _this.setData({
                                        canvasHidden : false
                                    })
                                },2000)
                            },
                            fail : (err) => {
                                $Toast.hide()
                                $Toast({
                                    type : 'success',
                                    content : '保存交易明细长图失败'
                                })
                                setTimeout( () => {
                                    _this.setData({
                                        canvasHidden : false
                                    })
                                },2000)
                            }
                        })
                    }, 1000)
                }
            })
        })
    },
    _setNetImg(urls,keyName){
        let _this = this
        wx.getImageInfo({
            src: urls,    //请求的网络图片路径
            success: function (res) {
                let localImgPath = _this.data.localImgPath 
                if(!localImgPath[`${keyName}`]){
                    localImgPath[`${keyName}`] = res.path
                    _this.setData({
                        localImgPath
                    })
                }

                let imgDataNum = Object.keys(_this.data.localImgData).length,
                localData = Object.keys(localImgPath).length
                if(localData == imgDataNum){
                    _this._setCanvas(false,_this.data.listData)
                }
            }
          })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){
        let date = new Date().getTime(),
        pageType = getCurrentPages()[getCurrentPages().length - 1].options.type,
        ctx = wx.createCanvasContext('transactionCanvas')
        this.setData({
            startTime : format.dateFormat(0),
            endTime : format.dateFormat(date),
            pickerValue : format.dateFormat(date),
            canvasWidth : wx.getSystemInfoSync().windowWidth,
            ctx,pageType
        })

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this._getList()
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
    onReachBottom: function (options) {
        this._canvasTolower()
    }, 

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})