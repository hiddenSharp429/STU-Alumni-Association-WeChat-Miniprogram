const cloud = require('wx-server-sdk')
cloud.init({
  env: 'huahuabuhua-5gg18vlh5e47ced9',
})
exports.main = async (event, context) => {
  let openid = event.openid
  let userName = event.userName
  let state = event.state
       try {
              const result = await cloud.openapi.subscribeMessage.send({
              "touser": openid,
              "page": 'index',
              "lang": 'zh_CN',
              "data": {
              "phrase2": {
                     "value": state
              },
              "name1": {
                     "value": userName
              },
              },
              "templateId": 'SshCUp7piirU09RPYAJhaN4pedyt_qvOzj8br93wN1c',
              "miniprogramState": 'developer'
              })
              return JSON.parse(JSON.stringify(result))
       } 
       catch (err) {
              return err
       }
}