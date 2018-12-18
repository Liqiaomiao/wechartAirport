const date = new Date()
const years = []
const months = []
const days = []
const hours = [];
const miniutes = [];
for (let i = date.getFullYear(); i <= date.getFullYear() + 28; i++) {
    years.push(i)
}

for (let i = date.getMonth() + 1; i <= 12; i++) {
    months.push(fmtTime(i))
}

for (let i = date.getDate(); i <= 31; i++) {
    days.push(fmtTime(i))
}
for (let i = 0; i < 24; i++) {
    hours.push(fmtTime(i))
}
for (let i = 0; i < 60; i++) {
    miniutes.push(fmtTime(i))
}
function fmtTime(arg){

    if(arg<10){
      arg='0'+arg
    }
    return arg
}
Component({
    properties:{
        timeText:{
            type: String,
            value: false
        }
    },
    data: {
        range: [years, months, days, hours, miniutes],
        timecurrent:[0,0,0,0,0],

    },
    created(){ //组件实例化，但节点树还未导入，因此这时不能用setData

    },

    attached(){ // 节点树完成，可以用setData渲染节点，但无法操作节点

    },

    ready(){// 不是onReady 组件布局完成，这时可以获取节点信息，也可以操作节点

    },

    moved(){ // 组件实例被移动到树的另一个位置

    },

    detached(){ // 组件实例从节点树中移除

    },

    methods:{
        setYear() {
            let yearsNow = [];
            for (let i = date.getFullYear(); i <= date.getFullYear() + 28; i++) {
                yearsNow.push(i)
            }
            return yearsNow
        },
        setMonth(flag) {
            let monthsNow = [];
            for (let i = flag; i <= 12; i++) {
                monthsNow.push(fmtTime(i))
            }
            return monthsNow
        },
        setDay(flag,year,month) {
            let daysNow=[];
            let days=getDaysInMonth(year,month);
            function getDaysInMonth(year,month){
                month = parseInt(month,10);
                var temp = new Date(year,month,0);
                return temp.getDate();
            }

            for (let i = flag; i <= days; i++) {
                daysNow.push(fmtTime(i))
            }
            return daysNow
        },
        setHour(flag) {
            let hoursNow=[];
            for (let i = flag; i <= 59; i++) {
                hoursNow.push(fmtTime(i))
            }
            return hoursNow
        },
        setMinutes(flag) {
            let miniutesNow = [];
            for (let i = flag; i <= 59; i++) {
                miniutesNow.push(fmtTime(i))
            }
            return miniutesNow
        },
        setTime(timecurrent) {
            let yearsNow = this.setYear();
            let nowDate=new Date();
            let currenttime=timecurrent;
            let monthsNow=[];
            let daysNow=[];
            let hoursNow=[];
            let miniutesNow=[];
            let currntyear=timecurrent[0];
            let currentmonth=timecurrent[1];
            let currentDay=timecurrent[2];
            let range=this.data.range;
            let currntyeartext=range[0][currntyear];
            let currentmonthtext=range[1][currentmonth];
            // 当前年月
            if(currntyear==0){
                monthsNow=this.setMonth(nowDate.getMonth()+1);
                if(currentmonth==0){//当前月
                    daysNow  =this.setDay(nowDate.getDate(),currntyeartext,currentmonthtext);
                    if(currentDay==0){//当天
                        hoursNow =this.setHour(0);
                        miniutesNow = this.setMinutes(0)
                    }else{//非当天
                        hoursNow =this.setHour(0);
                        miniutesNow = this.setMinutes(0)
                    }
                }else{
                    daysNow  =this.setDay(1,currntyeartext,currentmonthtext)
                    hoursNow =this.setHour(0)
                    miniutesNow = this.setMinutes(0)
                }

            }else{
                monthsNow=this.setMonth(1)
                daysNow  =this.setDay(1,currntyeartext,currentmonthtext)
                hoursNow =this.setHour(0)
                miniutesNow = this.setMinutes(0)
            }

            this.setData({
                range: [yearsNow, monthsNow, daysNow, hoursNow, miniutesNow]
            })
        },
        bindMultiPickerChange(e) {// 确定
            let timecurrent=this.data.timecurrent;
            let range=this.data.range;
            let timeText=[];

            for(let i  =0;i<5;i++){
                timeText[i]=range[i][timecurrent[i]]
            }
            let datearr=timeText.slice(0,3);
            let timearr=timeText.slice(-2);

            this.setData({
                timeText:datearr.join('-')+' '+timearr.join(":")
            })
            this.triggerEvent('confirmTime',{timeText:datearr.join('-')+' '+timearr.join(":")})

        },
        bindMultiPickerColumnChange(e) {//车辆预达时间 每列更改

            let column = e.detail.column;
            let value = e.detail.value;
            let timecurrent=this.data.timecurrent;
            timecurrent[column]=value;
            this.setData({
                timecurrent
            })
            this.setTime(timecurrent);
        },
    }
});