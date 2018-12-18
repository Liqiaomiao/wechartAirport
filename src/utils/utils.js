import Promise from '../libs/promise'

let wxRequest = () => {
    return new Promise( (reslove,reject) => {
        setTimeout( () => {
            reslove('it`s ok')
        },3000)
        setTimeout( () => {
            reject('it`s not ok')
        },5000)
    })
}

module.exports = {
    wxRequest : wxRequest
}