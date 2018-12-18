const moment = require('../../utils/moment.min.js');

Component({
    externalClasses: ['i-class'],
    properties:{
        endTime:{
            type:String,
            value:'',
            observer:function (a,b) {
                // console.log('old',a,'new', b);
            }
        },
        endDes:{
            type:String,
            value:''
        }
    },
    data: {
        time:''
    },

    created(){ //组件实例化，但节点树还未导入，因此这时不能用setData

    },

    attached(){ // 节点树完成，可以用setData渲染节点，但无法操作节点
        if(this.properties.endTime.length>0){
            let time = setInterval(() => {
                if (this.data.flag == true) {
                    clearInterval(time);
                }
                this.timeDown();
            }, 500);
        }else{ //没有时间不用倒计时
            if(this.data.endDes.length>0){
                this.setData({
                    time:this.data.endDes
                })
            }


            this.triggerEvent('timeend');
        }


    },

    ready(){// 不是onReady 组件布局完成，这时可以获取节点信息，也可以操作节点

    },

    moved(){ // 组件实例被移动到树的另一个位置

    },

    detached(){ // 组件实例从节点树中移除

    },

    methods:{

        timeDown() {

            const day = new Date(this.data.endTime.replace(/-/g,'/'));
            const endTime = moment(day);
            const nowTime = moment();

            let leftTime = parseInt(endTime.unix() - nowTime.unix());
            let d = parseInt(leftTime / (24 * 60 * 60));
            let h = this.formate(parseInt((leftTime / (60 * 60)) % 24));
            let m = this.formate(parseInt((leftTime / 60) % 60));
            let s = this.formate(parseInt(leftTime % 60));
            if (leftTime <= 0) {
                this.setData({
                    flag:true
                });
                d=h=m=s='0';
                this.triggerEvent('timeend');

            } else if (leftTime <= 2 * 60 * 60) {
                  this.triggerEvent("cancel");
            }
            let time = `${d}天${h}小时${m}分${s}秒`;
            this.setData({
                time
            })
        },
        formate(time) {
            if (time >= 10) {
                return time;
            } else {
                return `0${time}`;
            }
        }
    }
});