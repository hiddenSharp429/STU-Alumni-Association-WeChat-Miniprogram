const db = wx.cloud.database()
const _ = db.command

Page({
    data: {
        canIUseGetUserProfile: false,
        form: [],
        ApplyShow: false,
        buttonDisabled: true,
        countdown: 5 // 倒计时的秒数
    },

    getList() {
        //调用云函数来获得openid
        wx.cloud.callFunction({
                name: 'getData'
            })

            .then(res => {
                console.log("用户openid", res.result.openid)
                db.collection("accompanyAlumni")
                    .orderBy('currentTime', 'desc')
                    .where({
                        _openid: res.result.openid
                    })
                    .get()
                    .then(res => {
                        console.log(res)
                        this.setData({
                            form: res.data
                        })
                        wx.stopPullDownRefresh()
                    })
            })

            .catch(err => {
                console.log("失败", err)
            })
    },

    onLoad() {
        wx.startPullDownRefresh()
        this.getList()
    },
    delete(e) {
        console.log(e.currentTarget.dataset._id)
        let that = this
        wx.showModal({
            title: '确定删除该申请吗',
            content: '',
            complete: (res) => {
                if (res.cancel) {

                }

                if (res.confirm) {
                    db.collection("accompanyAlumni")
                        .doc(e.currentTarget.dataset._id)
                        .remove()
                        .then(res => {
                            console.log("删除成功")
                            that.setData({
                                popUps: false
                            })
                            that.getList()
                        })
                }
            }
        })

    },
    //更正表单信息
    revise(e) {
        console.log(e.currentTarget.dataset._id)
        let _id = e.currentTarget.dataset._id
        wx.navigateTo({
            url: '../companionsApplication/companionsApplication?_id=' + _id,
        })
    },
    goApplication() {
        let that = this
        this.setData({
            ApplyShow: true
        })
        this.startCountdown()
    },
    goNext() {
        wx.navigateTo({
            url: '/pages/companionsApplication/companionsApplication',
        })
    },
    PopClose() {
        this.setData({
            ApplyShow: false
        })
    },
    //倒数5秒后才能进入
    startCountdown: function () {
        let timer = setInterval(() => {
            if (this.data.countdown > 0) {
                this.setData({
                    countdown: this.data.countdown - 1
                })
            } else {
                clearInterval(timer)
                this.setData({
                    buttonDisabled: false
                })
            }
        }, 1000)
    }
})