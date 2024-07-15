Page({
    data: {
        id: "",
        name: "",
        number: "",
        othername: "",
        identity: ""
    },
    onLoad(options) {
        console.log(options)
        this.setData({
            id: options._id
        })
        //进入新申请没有携带id参数则为新的申请，否者为修改的申请
        if(this.data.id != null){
            this.getRevise()
        }

    },
    getRevise() {
        wx.cloud.database().collection("accompanyAlumni")
            .where({
                _id: this.data.id
            })
            .get()
            .then(res => {
                console.log(res)
                this.setData({
                    name: res.data[0].name,
                    identity: res.data[0].identity,
                    number: res.data[0].number,
                    othername: res.data[0].othername
                })
            })
    },
    //用户姓名
    getName(res) {
        this.setData({
            name: res.detail.value
        })
    },
    //联系电话
    getNumber(res) {
        this.setData({
            number: res.detail.value
        })
    },
    //同行校友姓名
    getOthername(res) {
        this.setData({
            othername: res.detail.value
        })
    },
    //获得身份证号
    getIdentity(e) {
        this.setData({
            identity: e.detail.value
        })
    },
    submit() {
        let that = this
        if (!this.data.name) {
            wx.showToast({
                title: "请输入姓名",
                icon: "none",
            });
            return false;
        }
        let username = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{1,10}$/;
        let isusername = username.test(this.data.name)
        if (!isusername) {
            wx.showToast({
                title: '请输入正确的姓名',
                icon: "none",
            })
            return false;
        }
        if (!this.data.number) {
            wx.showToast({
                title: "请输入联系电话",
                icon: "none",
            });
            return false;
        }
        let myreg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

        let ismyreg = myreg.test(this.data.number)
        if (!ismyreg) {
            wx.showToast({
                title: '请输入正确格式的联系电话',
                icon: "none",
            })
            return false;
        }
        if (!this.data.othername) {
            wx.showToast({
                title: "请输入同行校友姓名",
                icon: "none",
            });
            return false;
        }
        let othername = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{1,10}$/;
        let isothername = othername.test(this.data.othername)
        if (!isothername) {
            wx.showToast({
                title: '请输入正确的校友同行人姓名',
                icon: "none",
            })
            return false;
        }
        //如果是修改申请则会由id，否则就是新申请
        if (!this.data.id) {
            //订阅消息获取用户同意，同意一次就可以下发订阅消息一次
            wx.requestSubscribeMessage({
                tmplIds: ['SshCUp7piirU09RPYAJhaN4pedyt_qvOzj8br93wN1c'],
                success(res) {

                },
                complete() {
                    wx.cloud.database().collection("accompanyAlumni")
                        .add({
                            data: {
                                name: that.data.name,
                                number: that.data.number,
                                othername: that.data.othername,
                                identity: that.data.identity,
                                isready: 0,
                                currentTime: wx.cloud.database().serverDate()
                            }
                        })
                        .then(res => {
                            +
                            console.log("姓名是：", that.data.name)
                            console.log("联系电话是：", that.data.number)
                            console.log("同行校友姓名是：", that.data.othername)
                            wx.showToast({
                                title: '已成功申请',
                            })
                        })
                        .catch(res => {
                            console.log(res)
                            wx.showToast({
                                title: '申请失败',
                                icon: "none"
                            })
                        })
                    wx.redirectTo({
                        url: '/pages/goCompanions/goCompanions',
                    })
                }
            })
        } else {
            wx.cloud.database().collection("accompanyAlumni")
            .doc(this.data.id)
                .update({
                    data: {
                        name: that.data.name,
                        number: that.data.number,
                        othername: that.data.othername,
                        identity: that.data.identity,
                        isready: 0,
                        currentTime: wx.cloud.database().serverDate()
                    }
                })
                .then(res => {
                    console.log("姓名是：", that.data.name)
                    console.log("联系电话是：", that.data.number)
                    console.log("同行校友姓名是：", that.data.othername)
                    wx.showToast({
                        title: '已成功申请',
                    })
                })
                .catch(res => {
                    console.log(res)
                    wx.showToast({
                        title: '申请失败',
                        icon: "none"
                    })
                })
            wx.redirectTo({
                url: '/pages/goCompanions/goCompanions',
            })
        }

        wx.cloud.database().collection("teacherRegister")
            .get()
            .then(res => {
                let i;
                for(i=0;i<res.data.length;i++){
                wx.cloud.callFunction({
                    name: 'Reminder',
                    data: {
                        openid: res.data[i]._openid,
                        userName: this.data.name,
                        startDate: '无',
                        remark:'校友同行人的审核'
                    },
                })
                .then(res => {
                    console.log("调用成功", res)
                })
                .catch(err => {
                    console.log("请求云函数失败", err)
                })
                }
            })

    }
})