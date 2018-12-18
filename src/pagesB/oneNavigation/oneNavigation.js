

const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator.js')
import commonMethods from '../../utils/wxRequest'
import API from '../../utils/API'
import format from '../../utils/format'
const { $Toast } = require('../../components/iview/base/index');


Page({
    data: {
        imgHd:`${API.IMG_BASE_URL}/oneNavBanner.jpg`,
        imgTt:`${API.IMG_BASE_URL}/oneNav-mapTitlePoint.png`,
        imgTb:`${API.IMG_BASE_URL}/oneNav-mapTitle.png`,
        imgIb:`${API.IMG_BASE_URL}/oneNavMapBak.png`,
        navigations:[
            {name:'天津机场商务贵宾区（贵宾A区停车场）',address:'天津市东丽区机场大道1号天津滨海国际机场内',imgurl:`${API.IMG_BASE_URL}/oneNav-1.jpg`,urlInfo:{latitude:39.131350,longitude:117.357480}},
            {name:'天津机场商务贵宾区（贵宾B区停车场）',address:'天津市东丽区机场大道1号天津滨海国际机场内',imgurl:`${API.IMG_BASE_URL}/oneNav-4.jpg`,urlInfo:{latitude:39.131070,longitude:117.360590}},
            {name:'天津机场国际贵宾区（贵宾C区停车场）',address:'天津市东丽区机场大道1号天津滨海国际机场内',imgurl:`${API.IMG_BASE_URL}/oneNav-2.jpg`,urlInfo:{latitude:39.132660,longitude:117.364580}},
            {name:'贵宾会员接待(办理)中心',address:'天津市东丽区机场大道1号天津滨海国际机场T2航站楼F3层',imgurl:`${API.IMG_BASE_URL}/oneNav-3.jpg`,urlInfo:{latitude:39.131460,longitude:117.362600}}
            ]
    },
    openLocation({currentTarget}){
        let current = currentTarget.dataset.info
        commonMethods.Router({
            type : 'navigateTo' ,
            path : 'oneNavigation-map',
            params : {
                goName:current.name,
                lat:current.urlInfo.latitude,
                lng:current.urlInfo.longitude
            }
        }).catch( err => {})
    },
    onLoad() {
    }

})