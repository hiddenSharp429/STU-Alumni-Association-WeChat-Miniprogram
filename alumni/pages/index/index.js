Page({
    data: {
        popShow: false,
        isteacher: false,
        openid: "",
        secret: false,
        key: "",
        keyWord: "STUxyh2023"
    },
    onLoad(options) {
        setTimeout(() => {
            this.identify()
        }, 0)
        // this.identify()
        wx.loadFontFace({
            family: "阿里巴巴普惠体 2.0 65 Medium",
            source: 'url("//at.alicdn.com/wf/webfont/99MVIjhM6qkK/tQg7UlvQk1xV.woff")',
            success: console.log
        })
    },
    onShareAppMessage() {
        return {
            title: '汕大校友服务平台',
            path: '/pages/index/index',
            imageUrl:'https://i.328888.xyz/2023/04/10/imlYRx.png'
        }
    },
    //判断教师还是学生
    identify() {
        wx.cloud.callFunction({
                name: "getData"
            })
            .then(res => {
                // console.log(res.result.openid)
                this.setData({
                    openid: res.result.openid
                })
                wx.cloud.database().collection("teacherRegister")
                    .where({
                        _openid: this.data.openid
                    })
                    .get()
                    .then(res => {
                        console.log(res)
                        if (res.data.length != 0) {
                            this.setData({
                                isteacher: true
                            })
                        }
                    })
            })
            .catch(err => {
                console.log(err)
            })
    },
    goNew() {
        let that = this
        wx.login({
            success(e) {
                console.log(e.code)
                that.setData({
                    wxCode: e.code
                })
                console.log(that.data.wxCode)
                wx.showModal({
                    title: '温馨提示',
                    content: '微信授权登录后才能正常使用小程序功能',
                    cancelText: '拒绝',
                    confirmText: '同意',
                    success(res) {
                        console.log(res.confirm)
                        //调用微信小程序的获取用户信息的接口
                        if (res.confirm) {
                            that.setData({
                                popShow: true
                            })
                            wx.getUserProfile({
                                desc: '用于完善会员资料', // 声明获取用户个人信息后的用途
                                lang: 'zh_CN',
                                success(info) {
                                    console.log(info)
                                    setTimeout(() => {
                                        wx.navigateTo({
                                            url: '../new/new',
                                            success() {
                                                that.setData({
                                                    popShow: false
                                                })
                                            }
                                        })
                                    }, 0);
                                },
                                fail(e) {
                                    console.log('获取用户信息失败', e)
                                }
                            })
                            // 获取用户的openid
                            wx.cloud.callFunction({
                                name: "backOpenID",
                                success: (res) => {
                                    console.log(res.result.openid)
                                }
                            })
                        } else return
                    },
                    fail() {
                        console.log("拒绝")
                    },
                    complete() {}
                })

            },
            fail(e) {
                console.log('fail', e)
                wx.showToast({
                    title: '网络异常',
                    duration: 2000
                })
                return
            }
        })

    },
    goTeacher() {
        //订阅消息获取教师同意，同意一次就可以下发订阅消息一次
        wx.requestSubscribeMessage({
            tmplIds: ['qGfwJO3J7Ei5bYrVTaGc5ONmrkdm0YRwKMF17QIwmAY'],
            success (res) {
             },
            fail(res){
                console.log("失败")
            },
            complete(){
                wx.navigateTo({
                    url: '../approval/approval',
                })
            }
          })
    },
    goApprovalOptions() {
        //订阅消息获取教师同意，同意一次就可以下发订阅消息一次
        wx.requestSubscribeMessage({
            tmplIds: ['qGfwJO3J7Ei5bYrVTaGc5ONmrkdm0YRwKMF17QIwmAY'],
            success (res) { },
            fail(res){
                console.log("失败")
            },
            complete(){
                wx.navigateTo({
                    url: '../approvalOptions/approvalOptions',
                })
            }
          })

    },
    goCompanions() {
        let that = this
        wx.login({
            success(e) {
                console.log(e.code)
                that.setData({
                    wxCode: e.code
                })
                console.log(that.data.wxCode)
                wx.showModal({
                    title: '温馨提示',
                    content: '微信授权登录后才能正常使用小程序功能',
                    cancelText: '拒绝',
                    confirmText: '同意',
                    success(res) {
                        console.log(res.confirm)
                        //调用微信小程序的获取用户信息的接口
                        if (res.confirm) {
                            that.setData({
                                popShow: true
                            })
                            wx.getUserProfile({
                                desc: '用于完善会员资料', // 声明获取用户个人信息后的用途
                                lang: 'zh_CN',
                                success(info) {
                                    setTimeout(() => {
                                        wx.navigateTo({
                                            url: '../goCompanions/goCompanions',
                                            success() {
                                                that.setData({
                                                    popShow: false
                                                })
                                            }
                                        })
                                    }, 0);
                                },
                                fail(e) {
                                    console.log('获取用户信息失败', e)
                                }
                            })
                            // 获取用户的openid
                            wx.cloud.callFunction({
                                name: "backOpenID",
                                success: (res) => {
                                    console.log(res.result.openid)
                                }
                            })
                        } else return
                    },
                    fail() {
                        console.log("拒绝")
                    },
                    complete() {}
                })

            },
            fail(e) {
                console.log('fail', e)
                wx.showToast({
                    title: '网络异常',
                    duration: 2000
                })
                return
            }
        })
    },
    goTeacherRegister() {
        wx.navigateTo({
            url: '../goTeacher/goTeacher',
        })
    },
    enterSecretChannel() {
        this.setData({
            secret: true
        })
    },
    inputKey(e) {
        console.log(e.detail.value)
        this.setData({
            key: e.detail.value
        })
    },
    enterSecret() {
        let that = this
        if (this.data.key == this.data.keyWord) {
            this.setData({
                popShow: true
            })
            wx.navigateTo({
                url: '../goTeacher/goTeacher',
            })
        } else {
            wx.showToast({
                title: 'wrong key',
                icon: "error",
                duration: 2000
            })
        }

    },
    lookGuide() {
        wx.showModal({
            title: '.....操作手册',
            content: "https://docs.qq.com/doc/DYmNjcmFlT0dtU1lD",
            showCancel: true,
            confirmText: '复制地址',
            success(res) {
                if (res.confirm) {
                    wx.setClipboardData({
                        data: "https://docs.qq.com/doc/DYmNjcmFlT0dtU1lD",
                        success(res) {
                            wx.getClipboardData({
                                success(res) {
                                    console.log(res.data) // data
                                }
                            })
                        }
                    })
                }
            }

        })

    },
    onClose() {
        this.setData({
            secret: false
        })
    }
})