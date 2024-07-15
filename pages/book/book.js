// pages/book/book.js
const db = wx.cloud.database()
Page({
    data: {
        Page: 0, //Page为页面的层级，0为入会
        CanIGetUserPravateInfor: false,
        NoticeForUse: false,
        buttonDisabled: true,
        countdown: 5, // 倒计时的秒数
        form: [],
        popUps: false,
        popUpsMsg: [],
        isready: "",
        _id: "",
        name: "",
        phone: "",
        degree: "",
        alumni: "",
        workunit: "",
        identity: "",
        position: "",
        address: "",
        sex: "",
        grade: "",
        politicalStatus: "",
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
    popUps(e) {
        console.log("可以")
        console.log(e.currentTarget.dataset._id)
        db.collection("member")
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
    PopClose() {
        this.setData({
            popUps: false
        })
    },
    getList() {
        console.log(this.data.form)
        //调用云函数来获得openid
        wx.cloud.callFunction({
                name: 'getData'
            })

            .then(res => {
                console.log("用户openid", res.result.openid)
                db.collection("member")
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
    onLoad(options) {
        this.getList();
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
    //获得入学时间
    getGrade(e) {
        this.setData({
            grade: e.detail.value
        })
    },
    //获得培养层次
    getDegree(e) {
        this.setData({
            degree: e.detail.value
        })
    },
    //获得专业
    getMajor(e) {
        this.setData({
            major: e.detail.value
        })
    },
    //获得学院
    getCollege(e) {
        this.setData({
            college: e.detail.value
        })
    },
    //所属校友会
    getAlumni(e) {
        this.setData({
            alumni: e.detail.value
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
    //获得常用邮箱
    getEmail(e) {
        this.setData({
            email: e.detail.value
        })
    },
    //获得政治面貌
    getPoliticalStatus(e) {
        this.setData({
            politicalStatus: e.detail.value
        })
    },

    back() {
        this.setData({
            Page: 0,
            NoticeForUse: false
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
    //删除
    delete(e) {
        wx.showModal({
            title: '是否确定删除该申请',
            content: '',
            complete: (res) => {
                if (res.cancel) {

                }

                if (res.confirm) {
                    let that = this
                    db.collection("member")
                        .doc(this.data._id)
                        .remove()
                        .then(res => {
                            console.log("删除成功")
                            that.setData({
                                popUps: false,
                                _id: ""
                            })
                            that.getList()
                        })
                }
            }
        })

    },
    //更正表单信息
    revise() {
        wx.cloud.database().collection("member")
            .where({
                _id: this.data._id
            })
            .get()
            .then(res => {
                console.log("成功来啦", res)
                this.setData({
                    Page: 1,
                    popUps: false,
                })
                //若没有用户许可需要申请
                if (!this.data.CanIGetUserPravateInfor) {
                    this.setData({
                        NoticeForUse: true
                    })
                }
                this.startCountdown();
                this.setData({
                    name: res.data[0].name,
                    sex: res.data[0].sex,
                    identity: res.data[0].identity,
                    grade: res.data[0].grade,
                    degree: res.data[0].degree,
                    major: res.data[0].major,
                    college: res.data[0].college,
                    alumni: res.data[0].alumni,
                    workunit: res.data[0].workunit,
                    position: res.data[0].position,
                    phone: res.data[0].phone,
                    address: res.data[0].address,
                    email: res.data[0].email,
                    politicalStatus: res.data[0].politicalStatus,
                })
            })
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

        if (!this.data.identity) {
            wx.showToast({
                title: '请输入身份证号',
                icon: "none",
            })
            return false;
        }

        if (!this.data.grade) {
            wx.showToast({
                title: '请选择入学时间',
                icon: "none",
            })
            return false;
        }

        if (!this.data.degree) {
            wx.showToast({
                title: '请输入培养层次',
                icon: "none",
            })
            return false;
        }

        if (!this.data.major) {
            wx.showToast({
                title: '请输入专业',
                icon: "none",
            })
            return false;
        }
        if (!this.data.college) {
            wx.showToast({
                title: '请输入学院',
                icon: "none",
            })
            return false;
        }
        if (!this.data.alumni) {
            wx.showToast({
                title: '请输入所属校友会',
                icon: "none",
            })
            return false;
        }
        if (!this.data.email) {
            wx.showToast({
                title: '请输入常用邮箱',
                icon: "none",
            })
            return false;
        }
        if (!this.data.politicalStatus) {
            wx.showToast({
                title: '请输入政治面貌',
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
                    //如果没有_id则说明没有入会登记则add
                    if (!that.data._id) {
                        db.collection("member")
                            .add({
                                data: {
                                    isready: 0,
                                    name: that.data.name,
                                    sex: that.data.sex,
                                    identity: that.data.identity,
                                    grade: that.data.grade,
                                    degree: that.data.degree,
                                    major: that.data.major,
                                    college: that.data.college,
                                    alumni: that.data.alumni,
                                    workunit: that.data.workunit,
                                    position: that.data.position,
                                    phone: that.data.phone,
                                    address: that.data.address,
                                    email: that.data.email,
                                    politicalStatus: that.data.politicalStatus,
                                    currentTime: db.serverDate(),
                                }
                            })
                            .then(res => {
                                wx.showToast({
                                    title: '提交成功',
                                })
                                that.setData({
                                    Page: 0
                                })
                                that.getList();
                            })

                            .catch(res => {
                                wx.showToast({
                                    title: '提交失败',
                                    icon: "none"
                                })
                            })
                    }
                    //否则为修改,使用updata
                    else {
                        console.log("123123")
                        db.collection("member")
                            .where({
                                _id: this.data._id
                            })
                            .update({
                                data: {
                                    isready: 0,
                                    name: that.data.name,
                                    sex: that.data.sex,
                                    identity: that.data.identity,
                                    grade: that.data.grade,
                                    degree: that.data.degree,
                                    major: that.data.major,
                                    college: that.data.college,
                                    alumni: that.data.alumni,
                                    workunit: that.data.workunit,
                                    position: that.data.position,
                                    phone: that.data.phone,
                                    address: that.data.address,
                                    email: that.data.email,
                                    politicalStatus: that.data.politicalStatus,
                                    currentTime: db.serverDate(),
                                }
                            })
                            .then(res => {
                                wx.showToast({
                                    title: '提交成功',
                                })
                                that.setData({
                                    Page: 0
                                })
                                that.getList();
                            })

                            .catch(res => {
                                wx.showToast({
                                    title: '提交失败',
                                    icon: "none"
                                })
                            })
                    }
                    //订阅消息获取用户同意，同意一次就可以下发订阅消息一次
                    // wx.requestSubscribeMessage({
                    //     tmplIds: ['SshCUp7piirU09RPYAJhaN4pedyt_qvOzj8br93wN1c'],
                    //     success(res) {

                    //     },
                    //     complete() {

                    //     }
                    // })
                }
            }
        })
    },
    goApplication() {
        this.setData({
            Page: 1,
        })
        if(!this.data.CanIGetUserPravateInfor){
            this.setData({
                NoticeForUse:true
            })
        }
        this.startCountdown()
    },
})