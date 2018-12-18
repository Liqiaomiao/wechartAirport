const { $Toast } = require('../../components/iview/base/index');
const _request =  require('../../utils/wxRequest');
import API from '../../utils/API';
import moment from '../../utils/moment.js'
Component({
    externalClasses: ['i-class'],
    properties:{
        list:{
            type:Object
        }
    },
    data: {
        endtime:'',
        ifcount:true,
        ifEvaluate:true,
        cancalModal:false,
        currentDel:'',
        evaluateTime:''
    },
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    created(){ //组件实例化，但节点树还未导入，因此这时不能用setData

    },

    attached(){ // 节点树完成，可以用setData渲染节点，但无法操作节点
        if( this.properties.list.settlementTime){
            this.setTime(this.properties.list.settlementTime)
        }else{

        }

    },

    ready(){// 不是onReady 组件布局完成，这时可以获取节点信息，也可以操作节点

    },

    moved(){ // 组件实例被移动到树的另一个位置

    },

    detached(){ // 组件实例从节点树中移除

    },

    methods:{
        setTime(time){
            let settlementTime = moment(time, "YYYY-MM-DD HH:mm:ss");
            settlementTime = moment(time).add(3, 'days');
            // console.log(settlementTime)
            this.setData({
                evaluateTime:moment(settlementTime).format("YYYY-MM-DD HH:mm:ss")
            });

            // console.log('评估时间',this.data.evaluateTime);
        },
        timeend(){
            this.setData({
                ifcount:false, //航班倒计时不展示
                ifcancel:true,
                ifEvaluate:false //预约倒计时不展示
            });

        },
        cancelOrder({currentTarget}){/*点击取消订单*/

            this.setData({
                cancalModal:true,
                currentDel:currentTarget.id
            })
        },
        closeCancel(){ /*关闭弹窗*/
            this.setData({
                cancalModal:false
            })
        },
        confirmCancel(){/*确定取消预约*/
            $Toast({
                type : 'loading',
                content: '正在取消...',
                duration:0
            })
            _request.Request({
                apiUrl:API.cancelOrder,
                data:{pk:this.data.currentDel}
            }).then((data)=>{
                if(data.status==0){
                    $Toast({
                        type:'success',
                        content:data.message
                    });
                    this.triggerEvent('refreshData');/*取消成功，通知父级重新加载数据*/
                }else{
                    $Toast({
                        type:'error',
                        content:data.message
                    })
                }
                this.setData({
                    cancalModal:false
                })
            }).catch((err)=>{
                $Toast({
                    type:'error',
                    content:'请求失败，请稍后重试'
                })
            })

        },
        goDetail(){
            this.triggerEvent('goDetail')
        },
        goEvaluate({currentTarget}){/*去评价页面*/
            let pk=currentTarget.id;
            // console.log('setpk', pk);
            wx.navigateTo({
                url:`../../pagesA/evaluate/evaluate?pk=${pk}`

            })
        }

    }
});