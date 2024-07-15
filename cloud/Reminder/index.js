// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'huahuabuhua-5gg18vlh5e47ced9'
})

// 云函数入口函数
exports.main = async (event, context) => {
    // const wxContext = cloud.getWXContext()
    let openid = event.openid
    // let openid = openid.toString();
    let userName = event.userName
    let startDate = event.startDate
    let remark = event.remark
    try {
        const result = await cloud.openapi.subscribeMessage.send({
            "touser": openid, // 接受当前模板消息的用户openid
            "page": 'index', // 定义用户点击该模板消息跳转的小程序路径
            "lang": 'zh_CN',
            "data": {
                "thing1": {
                    "value": userName
                },
                "time5": {
                    "value": startDate
                },
                "thing3": {
                    "value": remark
                },
            },
            "templateId": 'qGfwJO3J7Ei5bYrVTaGc5ONmrkdm0YRwKMF17QIwmAY', // 当前下发的模板ID
            "miniprogramState": 'developer'
        })
        console.log(result)
        return JSON.parse(JSON.stringify(result))
    } catch (err) {
        console.log(err)
        return err
    }
}