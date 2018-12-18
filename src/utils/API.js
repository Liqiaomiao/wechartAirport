

// const dev_type = 'produce' 
const dev_type = 'dev'

let getImgUrl = () => {  

    let urls = {}

    if(dev_type == 'dev'){
        urls = { 
            // BASE : 'http://t7i78r.natappfree.cc/tsn.app',
            // BASE : 'http://192.168.110.109:9091/tsn.app',
            BASE : 'http://wxtsn.nat300.top/tsn.app',
            IMG_BASE : 'http://wxtsn.nat300.top/tbiapic/images/mobileassets/' ,
            IMG_BASE_SERVER : 'http://wxtsn.nat300.top/tbiapic/images/'
        }

        
    }else{
        urls = {
            BASE : 'https://net.tbiavvip.com/tsn.app',
            IMG_BASE : 'https://net.tbiavvip.com/tbiapic/images/mobileassets/' ,
            IMG_BASE_SERVER : 'https://net.tbiavvip.com/tbiapic/images/'
        }
    } 

    return urls
}


 const API = {

    /* 数据服务地址 */
    BASE_URL : getImgUrl().BASE,
    /* 通用图片服务地址 */
    IMG_BASE_URL : getImgUrl().IMG_BASE,
    /* 数据接口图片地址 */
    IMG_BASE_SERVER_URL : getImgUrl().IMG_BASE_SERVER,

    // 首页

        /* cip 活动  售卡接口*/
        sellMultiCard : '/wechat/card/sellMultiCard',
        /* 是否显示 cip 活动 */
        checkpopup : '/wechat/marketing/checkpopup',
        /*  cip 活动 数据 */
        cipgahome : '/wechat/marketing/cipgahome',
        /* 领会员卡 - 随机选号 */
        genRndCardNo : '/wechat/marketing/genRndCardNo',
        /* 领会员卡 - 获得卡信息 */
        mcahome :'/wechat/marketing/mcahome',
        /* 是否有资格领会员卡 */
        checkMemberQualification: '/wechat/marketing/checkMemberQualification',
        /* 领会员卡 */
        getmembercard: '/wechat/marketing/getmembercard',
        /* 判断领卡活动是否有效 */
        checkmembercard: '/wechat/marketing/checkmembercard',
        /* 获取验证码 */
        getsms: '/auth/miniprog/utils/getsms',
        /* 绑定手机号 */
        bind : '/auth/miniprog/utils/bind', 
        /* 轮播 */
        homeCarousel : '/wechat/cms/homeCarousel/mini',
        /* 公告通用接口 */
        columnList: '/wechat/mobile/columnList',
        /* 轮播详情 */
        homeCarouselDetail : '/wechat/cms/homeCarouselDetail',
        /* 招商详情 */
        content : '/investment/content',
    // 领会员卡
        signup : '/auth/miniprog/utils/signup',
    //  产品购买
        /* 获取卡产品列表 */
        getCardList : '/wechat/card/seriesList',
        /*  */
        memberCarNumLst : '/wechat/my/carNumMgt/memberCarNumLst',
        /*  */
        cardNoList : '/wechat/card/cardNoList',
        /*  */
        cardType : '/wechat/card/cardType/',
        /* 获取卡产品折扣 */
        toSellCard : '/wechat/card/toSellCard',
        /* 购卡 */
        sellCard : '/wechat/card/sellCard',
        /* 快速充值 获取用户卡列表 */
        memberCard : '/wechat/card/member/list',
        /* 快速充值 获取卡优惠 */
        toRecharge : '/wechat/card/toRecharge',
        /* 快速充值 - 充值接口 */
        rechargeCard : '/wechat/card/rechargeCard',
        /* 为他人充值 - 查询卡信息 */
        fetchCardDetail : '/memberCard/fetchCardDetail',
        
    //  航班查询
        /* 地点查询 */
        getCitys : '/flight/getCitys',
        /* 按目的地查询 */
        getFlightByTrip:'/flight/getFlightByTrip',
        /* 按航班号查询 */
        getFlightByCode : '/flight/getFlightByCode',
         /* 关注航班 */
        followFlight : '/flight/followFlight',
         /* 取消关注航班 */
        unfollowFlight : '/flight/unfollowFlight',

    //  我的
        /* 关于我们 */
        columnList : '/wechat/mobile/columnList',
        /* 车牌管理 - 查询 */
        memberCarNumLst : '/wechat/my/carNumMgt/memberCarNumLst',
        /* 车牌管理 - 添加 */
        memberCarNumAdd : '/wechat/my/carNumMgt/add',
        /* 车牌管理 - 修改 */
        memberCarNumEdit : '/wechat/my/carNumMgt/edit',
        /* 车牌管理 - 删除 */
        memberCarNumDel : '/wechat/my/carNumMgt/del',

    // 订单

        /* 预约订单详情 */
        showOrderDetail: '/wechat/order/detail',
        /* 会员预约订单列表 */
        showMemberOrderList:'/wechat/order/list',
        /*取消预约订单*/
        cancelOrder:'/wechat/order/cancel',
        /* 新增预约评价 */
        saveEvaluate:'/wechat/evaluate/save',

    // 预约
        /* 查询会员卡 */
        memberList:'/wechat/card/member/list',
        /* 卡详情 */
        cardDetail: '/wechat/card/cardDetail',
        /*  */
        front : '/wechat/common/front',
        //  保存 即时 预约
        instant : '/wechat/order/instant',
        //  在线预约 - 初始化code
        byCode : '/wechat/common/code',
        /* 新增预约订单 */
        saveOrder : '/wechat/order/save',

    // 卡券
         // 卡券管理-首页-卡
         cardIndexList:'/memberCard/indexList',
         // 卡券管理-首页-券
         voucherIndexList:'/memberVoucher/indexList',
         // 卡券管理-会员卡详情
         showCardDetail:"/memberCard/cardDetail",
         // 卡券管理-所有卡
         cardList:'/memberCard/cardList',
         // 会员卡 - 删除有效预约人
         deleteCardOwner:'/memberCard/delCardOwner',
         // 会员卡 - 有效预约人信息
         cardOwner:'/memberCard/cardOwner',
         //  卡券管理-赠送券-查找会员信息
         presentMembers:'/memberVoucher/presentMembers',
         // 会员卡 - 添加有效预约人
         addCardOwner:'/memberCard/addCardOwner',
         // 卡券管理-赠送券-查找会员信息
         presentMembers:'/memberVoucher/presentMembers',
         // 卡券管理-赠送券
         present2Member: '/memberVoucher/present2Member',
         // 卡券管理-所有券
         voucherList: '/memberVoucher/voucherList',
        // 卡券管理-会员卡详情-解除绑定
        unbindCard:'/memberCard/unbindCard',
         // 卡券详情
         getVoucherDetail:'/memberVoucher/detail',
         //体验券卡详情
         getExpCardDetail: '/wechat/card/expCardDetail',
    //交易明细 
        /* 会员交易长图 */
        condition : '/wechat/trade/list/condition',
         /* 会员交易明细列表 */
         showTradeDetailList:'/wechat/trade/list',
         /* 会员交易明细详情 */
         showSingleTradeDetail:'/wechat/trade/detail'
}


export default API
