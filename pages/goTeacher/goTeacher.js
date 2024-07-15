// pages/goTeacher/goTeacher.js
const db = wx.cloud.database()
Page({
    data: {
    show:false,
    tip:"账号",
    password:"密码",
    account:"",
    properPassword:"",
    id:""
    },
    getAccount(e){
        this.setData({
            account:e.detail.value
        })
        console.log(this.data.account)
    },
    getPassword(e){
        this.setData({
            properPassword:e.detail.value
        })
    },
    submit(){
        wx.cloud.database().collection("teacherRegister")
        .add({
            data: {
                account:this.data.account,
                password:this.data.properPassword
            }
        })
        .then(res => {
            console.log(res)
            wx.navigateTo({
              url: '../index/index',
            })
        })
        .catch(res => {
            console.log(res)
        })
    },
    //注册
    getData() {
        wx.cloud.callFunction({
                name: 'getData'
            })
            .then(res => {
                console.log("用户openid", res.result.openid)
                this.setData({
                    openid: res.result.openid
                })
                db.collection("teacherRegister")
                .where({
                    _openid:res.result.openid
                })
                .get()
                .then(r => {
                    console.log(r.data.length)
                    //先判断集合里是否已经有自己的openid
                    if(r.data.length==0){
                        db.collection("teacherRegister")
                        .add({
                            data: {
                            }
                        })
                        .then(rs => {
                            console.log(res.result.openid)
                        })
                        .catch(es => {
                            console.log(es)
                        })                  
                    }
                    wx.showToast({
                      title: '已注册成功',
                    })
                })
                .catch(e => {
                    console.log(e)
                })
            })
            .catch(err => {
                console.log("失败", err)
            })
    },
    onLoad(options) {
        let that = this
        wx.cloud.callFunction({
            name:"getData"
        })
        .then(res => {
            console.log(res.result.openid)
            this.setData({
                id:res.result.openid
            })
            db.collection("teacherRegister")
            .where({
                _openid:that.data.id
            })
            .get()
            .then(res => {
                console.log(res.data.length)
                //先判断集合里是否已经有自己的openid,有则不显示注册页面
                if(res.data.length != 0){
                    this.setData({
                        show:true
                    })
                }
            })
            .catch(e => {
                console.log(e)
            })
        })
        .catch(err => {
            console.log(err)
        })
    },
   
  
})