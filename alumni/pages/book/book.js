// pages/book/book.js
const db = wx.cloud.database()
Page({
    data: {
        CanIGetUserPravateInfor: false,
        NoticeForUse: true,
        buttonDisabled: true,
        countdown: 5, // 倒计时的秒数
        name: "",
        phone: "",
        workunit: "",
        identity: "",
        position: "",
        address: "",
        sex:"",
        politicalStatus:"",
        gender: [{
                value: '男',
                sex: '男'
            },
            {
                value: '女',
                sex: '女'
            },
        ],
    },
    onLoad(options) {
        this.startCountdown()
    },
    //获得姓名
    getName(e) {
        this.setData({
            name: e.detail.value
        })
    },
    //获得性别
    getSex(e) {
        this.setData({
            sex: e.detail.value
        })
    },
    //获得身份证号
    getIdentity(e) {
        this.setData({
            identity: e.detail.value
        })
    },
    //获得工作单位
    getWorkunit(e) {
        this.setData({
            workunit: e.detail.value
        })
    },
    //获得职务
    getPosition(e) {
        this.setData({
            position: e.detail.value
        })
    },
    //获得电话
    getPhone(e) {
        this.setData({
            phone: e.detail.value
        })
    },
    //获得通讯地址
    getAddress(e) {
        this.setData({
            address: e.detail.value
        })
    },
    //获得政治面貌
    getPoliticalStatus(e){
        this.setData({
            politicalStatus:e.detail.value
        })
    },
    back() {
        wx.redirectTo({
            url: '../index/index',
            success: (res) => {},
            fail: (res) => {},
            complete: (res) => {},
        })
    },
    goNext() {
        this.setData({
            CanIGetUserPravateInfor: true,
            NoticeForUse: false
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
    },
    // 提交申请表
    submit(e) {
        let that = this
        //验证姓名是否输入
        if (!this.data.name) {
            wx.showToast({
                title: '请输入姓名',
                icon: "none",
            })
            return false;
        }
        //验证联系电话是否输入
        if (!this.data.phone) {
            wx.showToast({
                title: '请输入联系电话',
                icon: "none",
            })
            return false;
        }
        //验证工作单位是否输入
        if (!this.data.workunit) {
            wx.showToast({
                title: '请输入工作单位',
                icon: "none",
            })
            return false;
        }
        //验证职务是否输入
        if (!this.data.position) {
            wx.showToast({
                title: '请输入职务',
                icon: "none",
            })
            return false;
        }
        //验证通讯地址是否输入
        if (!this.data.address) {
            wx.showToast({
                title: '请输入通讯地址',
                icon: "none",
            })
            return false;
        }
        wx.showModal({
            title: '提交提醒',
            content: '本人自愿成为“ 广东省汕头大学校友会 ”会员，遵守该社会团体章程和各项规章制度，履行该社会团体赋予的权利和义务。',
            cancelText: '取消提交',
            confirmText: '确认提交',
            complete: (res) => {
                if (res.cancel) {

                }
                if (res.confirm) {
                    //订阅消息获取用户同意，同意一次就可以下发订阅消息一次
                    wx.requestSubscribeMessage({
                        tmplIds: ['SshCUp7piirU09RPYAJhaN4pedyt_qvOzj8br93wN1c'],
                        success(res) {

                        },
                        complete() {
                            db.collection("member")
                                .add({
                                    data: {
                                        isready: 0,
                                        name: that.data.name,
                                        sex:that.data.sex,
                                        phone: that.data.phone,
                                        identity: that.data.identity,
                                        workunit: that.data.workunit,
                                        position: that.data.position,
                                        address: that.data.address,
                                        politicalStatus:that.data.politicalStatus,
                                        currentTime: db.serverDate(),
                                    }
                                })
                                .then(res => {
                                    wx.showToast({
                                        title: '提交成功',
                                    })

                                })

                                .catch(res => {
                                    wx.showToast({
                                        title: '提交失败',
                                        icon: "none"
                                    })
                                })
                            wx.redirectTo({
                                url: '../index/index',
                            })
                        }
                    })
                }
            }
        })
    }
})