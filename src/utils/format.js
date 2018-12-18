
/* 卡号格式化 */
let cardnoFormat = (num) => {

    let newNum = ''
    for( let i of num){
        if(newNum.length == 4 || newNum.length == 9 || newNum.length == 14 || newNum.length == 19){
            newNum += ' '
        }
        newNum += i
    }

    return newNum 
}

/* 价格格式化 */
let priceFormat = (price,type) => {
    let s = Math.abs(price);
    if (/[^0-9\.]/.test(s))
        return "0.00";
    if (s == null || s == "null" || s == "")
        return "0.00";
    s = s.toString().replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    let re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    if (type == 0) {
        var a = s.split(".");
        if (a[1] == "00") {
            s = a[0];
        }
    }
    if(price<0){
        return `-${s}`
    }
    else{
        return s;
    }
}
/* 日期格式化 */

let dateFormat = (data,type) => {
    let nowDate = new Date(data),
    years = nowDate.getFullYear(),
    months = nowDate.getMonth() + 1 < 10 ? `0${nowDate.getMonth() + 1}` : nowDate.getMonth() + 1,
    days = nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : nowDate.getDate(),
    hours = nowDate.getHours() < 10 ? `0${nowDate.getHours()}` : nowDate.getHours(),
    minutes = nowDate.getMinutes() < 10 ? `0${nowDate.getMinutes()}` : nowDate.getMinutes()

    if(type == 'zh-CN'){
        return `${years}年${months}月${days}日`
    }

    if(type == 'all zh-CN'){
        return `${years}年${months}月${days}日 ${hours}:${minutes}`
    }

    if(type == 'all'){
        return `${years}-${months}-${days} ${hours}:${minutes}`
    }

    return `${years}-${months}-${days}`
    
}


module.exports= {
    cardnoFormat : cardnoFormat,
    priceFormat : priceFormat,
    dateFormat : dateFormat,
}