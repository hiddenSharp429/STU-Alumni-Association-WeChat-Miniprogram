const db = wx.cloud.database()
Page({
    data: {
        tip: "账号",
        password: "密码",
        account: "",
        passWord: "",
        openid: ""
    },
    onLoad() {
        console.log("start")
        this.getData()
    },
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
                })
                .catch(e => {
                    console.log(e)
                })
            })
            .catch(err => {
                console.log("失败", err)
            })
    },
    getAccount(e) {
        this.setData({
            account: e.detail.value
        })
    },
    getPassword(e) {
        this.setData({
            passWord: e.detail.value
        })
    },
    submit() {
        console.log("点击了注册")
        db.collection("teacherRegister")
            .where({
                _openid: this.data._openid
            })
            .update({
                data: {
                    account: this.data.account,
                    password: this.data.passWord
                }
            })
            .then(res => {
                console.log("修改成功")
            })
            .catch(err => {
                console.log(err)
            })
    }
})