import Promise from '../libs/promise'
import regeneratorRuntime from '../libs/regenerator'
import Path from 'pagesPath'
import API from 'API'
const { $Toast } = require('../components/iview/base/index');

/* 
    @AUTH_TOKEN 数据请求 token
    @OTHER_TOKEN  其他接口需要的 token
 */

let AUTH_TOKEN = '',OTHER_TOKEN = ''

let setOtherToken = (othertoken) => {

    if(!othertoken){ resolve(false) }
    OTHER_TOKEN = othertoken

}


let setAuthToken = (authtoken) => {

    if(!authtoken){ return  }
    AUTH_TOKEN = authtoken

}

/* 
    @options {
        url, 
        apiUrl,
        imgName,
        method, 请求方式
        dataType, 数据类型
        header, 请求数据头
        responseType 相应类型
        tokenState 是否有token 
        contentJson  JSON形式的 content-type    /  默认是 form-urlencoded
    } 


    url -  apiUrl - imgName 关系                优先级   

    调用外部接口    url 字段 填写  外部地址           1
    调用本地服务    apiUrl 字段 填写 接口地址         2
    调用本地图片    imgName 字段 填写 图片名称        3

    三者写其一 若同时存在按优先级请求 其他的忽略
    

*/

let commonRequest = async (options) => {

    return new Promise( (resolve,reject) => {
        let commonURL = options.apiUrl ? options.getParams ? `${API.BASE_URL}${options.apiUrl}/${options.getParams}` : `${API.BASE_URL}${options.apiUrl}`  : `${API.IMG_BASE_URL}${options.imgName}`,
        headerConfig = options.tokenState ? {'token':OTHER_TOKEN} : {'AUTH_TOKEN':AUTH_TOKEN} 
        headerConfig['content-type'] = options.contentJson ? 'application/json' : 'application/x-www-form-urlencoded';

        const { url = commonURL, method = 'POST' ,dataType = 'json',header = headerConfig,responseType = ''} = options;

        wx.request({
            ...options,
            url,
            method,
            dataType,
            header,
            responseType,
            success(res){
                if(res.errMsg != "request:ok"){ return }
                resolve(res.data)
            },
            fail(err){

                if(!err.errMsg){ reject(err) ; return}

                let errData = {
                    status : 502,
                    message : '请求错误，请稍后重试'
                }
                resolve(errData)
            }
        })
    })
}


/* 
    options {
        type,        路由类型
        path,        页面名称
        params,      页面参数
        isAuth       是否需要权限
    }
*/


let commonRouter = async (options) => {
    return new Promise( (resolve,reject) => {

        if(options.type == 'navigateBack'){
            if(options.type == 'navigateBack'){
                wx.navigateBack({
                    delta : options.path,
                    fail : () => {
                        reject(false)
                    }
                })
            }
            return 
        }

        let packageName = '' , params = '' , needSplit = true

        if(options.path.indexOf('?') != -1){
            let path = options.path.split('?')

            options.path = path[0]
            options.params = path[1]
            needSplit = false

        }

        Path.map( (val,index) => {
            if(val.pages.indexOf(options.path) != -1){
                packageName = val.packageName
            }
        })   

        if(!AUTH_TOKEN || options.isAuth || packageName == ''){

            let pageList = getCurrentPages()[0]
            
            if(packageName != ''){
                commonLoad('hide')
                $Toast({
                    type : 'warning',
                    content : '请登录后查看'
                })
                setTimeout( () => {
                    pageList._bindUserPhone()
                },2000)
                reject({
                    errMsg : 'authToken'
                })
                return
            }

            $Toast({
                type : 'warning',
                content : '没有找到相关页面'
            })

            setTimeout( () => {
                if(pageList.route.indexOf('home') == -1){
                    wx.redirectTo({
                        url : '/pages/home/home',
                        fail : (err) => {
                            reject(false)
                        }
                    })
                }
            },2000)

            reject({
                errMsg : 'packageName'
            })
        }


        if(options.params){

            if(!needSplit){
                params = `?${options.params}`
            }else{
                params = '?'
                for(let key in options.params){
                    params += `${key}=${options.params[key]}&`
                }
                params = params.substring(0,params.length - 1)
            }
        }

        if(options.type == 'navigateTo'){

            wx.navigateTo({
                url : `/${packageName}/${options.path}/${options.path}${params}`,
                fail : () => {
                    reject(false)
                }
            })
        }
        if(options.type == 'redirectTo'){
            wx.redirectTo({
                url : `/${packageName}/${options.path}/${options.path}${params}`,
                fail : () => {
                    reject(false)
                }
            })
        }
        if(options.type == 'reLaunch'){
            wx.reLaunch({
                url : `/${packageName}/${options.path}/${options.path}${params}`,
                fail : (err) => { 
                    reject(err)
                }
            })
        }
    })
}

let commonLoad = (state,contents) => {

    const pages = getCurrentPages();
    const ctx = pages[pages.length - 1];

    const componentCtx = ctx.selectComponent('#load');

    if(state != 'hide'){
        componentCtx._loadShow({
            state : true ,
            content : contents ? contents : '加载中'
        })
    }else{
        componentCtx._loadHide()
    }

}

module.exports = {
    setAuthToken : setAuthToken ,
    setOtherToken : setOtherToken ,
    Request : commonRequest,
    Router : commonRouter,
    Load : commonLoad
}