const db = wx.cloud.database()
const _ = db.command

Page({
    data: {
        canIUseGetUserProfile: false,
        form: [],
        popUps: false,
        popUpsMsg: [],
        isready: "",
        _id: "",
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
                db.collection("alumni")
                    .orderBy('currentTime', "desc")
                    .where({
                        _openid: res.result.openid
                    })
                    .get()
                    .then(res => {
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
        // this.isrevise()
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
            url: '../application/application',
        })
    },
    PopClose() {
        this.setData({
            ApplyShow: false
        })
    },
    delete(e) {
        wx.showModal({
            title: '是否确定删除该申请',
            content: '',
            complete: (res) => {
                if (res.cancel) {

                }

                if (res.confirm) {
                    let that = this
                    db.collection("alumni")
                        .doc(this.data._id)
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
    popUps(e) {
        console.log("可以")
        console.log(e.currentTarget.dataset._id)
        db.collection("alumni")
            .where({
                _id: e.currentTarget.dataset._id
            })
            .get()
            .then(res => {
                console.log("这里是" + e.currentTarget.dataset._id)
                this.setData({
                    popUpsMsg: res.data,
                    _id: e.currentTarget.dataset._id,
                    isready: res.data[0].isready
                })
            })
            .catch(err => {
                console.log(err)
            })
        // 细节放后面加定时器
        setTimeout(() => {
            this.setData({
                popUps: true
            })
        }, 300);
    },
    //更正表单信息
    revise() {
        console.log("这里是" + this.data._id)
        let _id = this.data._id
        wx.navigateTo({
            url: '../reviseApplication/reviseApplication?_id=' + _id,
        })
    },
    back() {
        this.setData({
            popUps: false
        })
    },
    disappear() {
        this.setData({
            popUps: false
        })
        return
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