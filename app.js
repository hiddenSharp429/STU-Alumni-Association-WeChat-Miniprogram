// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: 'huahuabuhua-5gg18vlh5e47ced9'
    })
    wx.loadFontFace({
      family: '阿里巴巴普惠体 2.0 55 Regular',
      source: 'url("https://at.alicdn.com/wf/webfont/99MVIjhM6qkK/XJtAeSmfK24X.woff")',
      success: console.log()
    })
  }
})