const db = wx.cloud.database()

Page({
    data: {
        isready: '',
        // tip: ' 必填*',
        name: '',
        sex: '',
        gender: [{
                value: '男',
                sex: '男'
            },
            {
                value: '女',
                sex: '女'
            },
        ],
        phone: '',
        grade: '',
        major: '',
        college: '',
        // identity: '',
        workunit: '',
        position: '',
        email: '',
        campus: '',
        school: ['桑浦山校区', '东海岸校区'],
        areanumber: '',
        reason: '',
        startDate: '',
        endDate: '',
        carnumber: '',
        accompanyname: '',
        accompanyname: [{}],
        show: false,
        currentTime: new Date().toISOString().substring(0, 10)

    },

    onLoad(options) {

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

    //获得联系电话
    getPhone(e) {
        this.setData({
            phone: e.detail.value
        })
    },

    //获得入学时间
    getGrade(e) {
        this.setData({
            grade: e.detail.value
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

    //获得常用邮箱
    getEmail(e) {
        this.setData({
            email: e.detail.value
        })
    },

    //获得到访校区
    getCampus(e) {
        this.setData({
            areanumber: e.detail.value,
        })
        var area0 = '桑浦山校区'
        var area1 = '东海岸校区'
        if (e.detail.value == 0) {
            this.setData({
                campus: area0
            })
        } else {
            this.setData({
                campus: area1
            })
        }
    },

    //获得入校事由
    getReason(e) {
        this.setData({
            reason: e.detail.value
        })
    },

    // 获得计划入校时间
    getStartDate(e) {
        this.setData({
            startDate: e.detail.value
        })
    },
    getEndDate(e) {
        this.setData({
            endDate: e.detail.value
        })
    },

    //获得同行人姓名
    getAccompanyname(e) {
        this.setData({
            [`accompanyname[${(this.data.accompanyname.length)-1}]`]: e.detail.value
        })
    },
    //添加和删除输入框
    addList() {
        console.log("tap")
        var accompanyname = this.data.accompanyname;
        var newData = {};
        if (accompanyname.length >= 5) {
            wx.showToast({
                title: '最多再增加4个输入框',
                icon: "none",
            })
            return;
        }
        accompanyname.push(newData);
        this.setData({
            accompanyname: accompanyname,
        })
        console.log(accompanyname)
    },
    delList() {
        var accompanyname = this.data.accompanyname;
        if (accompanyname.length <= 1) {
            wx.showToast({
                title: '不能删除默认输入框',
                icon: "none",
            })
            return;
        }
        accompanyname.pop();
        this.setData({
            accompanyname: accompanyname,
        })
    },
    //获得入校车牌号
    geCarnumber(e) {
        this.setData({
            carnumber: e.detail.value
        })
    },

    // 提交申请表
    getApplication(e) {
        let that = this
        //验证姓名是否输入
        if (!this.data.name) {
            wx.showToast({
                title: '请输入姓名',
                icon: "none",
            })
            return false;
        }
        //验证输入名是否正确
        let username = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{1,10}$/;
        let isusername = username.test(this.data.name)
        if (!isusername) {
            wx.showToast({
                title: '请输入正确的姓名',
                icon: "none",
            })
            return false;
        }
        //验证性别是否输入
        if (!this.data.sex) {
            wx.showToast({
                title: '请输入性别',
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
        //验证联系电话是否输入正确
        let myreg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

        let ismyreg = myreg.test(this.data.phone)
        if (!ismyreg) {
            wx.showToast({
                title: '请输入正确格式的联系电话',
                icon: "none",
            })
            return false;
        }
        //验证入学时间是否输入
        if (!this.data.grade) {
            wx.showToast({
                title: '请输入入学时间',
                icon: "none",
            })
            return false;
        }
        //验证专业是否输入
        if (!this.data.major) {
            wx.showToast({
                title: '请输入专业',
                icon: "none",
            })
            return false;
        }
        //验证学院是否输入
        if (!this.data.college) {
            wx.showToast({
                title: '请输入学院',
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
        //验证常用邮箱是否输入
        if (!this.data.email) {
            wx.showToast({
                title: '请输入常用邮箱',
                icon: "none",
            })
            return false;
        }
        //验证到访校区是否输入
        if (!this.data.campus) {
            wx.showToast({
                title: '请输入到访校区',
                icon: "none",
            })
            return false;
        }
        //验证入校事由是否输入
        if (!this.data.reason) {
            wx.showToast({
                title: '请输入入校事由',
                icon: "none",
            })
            return false;
        }
        //验证计划入校时间是否输入
        if (!this.data.startDate) {
            wx.showToast({
                title: '请输入计划入校开始时间',
                icon: "none",
            })
            return false;
        }
        if (!this.data.endDate) {
            wx.showToast({
                title: '请输入计划入校结束时间',
                icon: "none",
            })
            return false;
        }
        //订阅消息获取用户同意，同意一次就可以下发订阅消息一次
        wx.requestSubscribeMessage({
            tmplIds: ['SshCUp7piirU09RPYAJhaN4pedyt_qvOzj8br93wN1c'],
            success(res) {

            },
            complete() {
                db.collection("alumni")
                    .add({
                        data: {
                            isready: 0,
                            name: that.data.name,
                            sex: that.data.sex,
                            phone: that.data.phone,
                            grade: that.data.grade,
                            major: that.data.major,
                            college: that.data.college,
                            identity: that.data.identity,
                            workunit: that.data.workunit,
                            position: that.data.position,
                            email: that.data.email,
                            campus: that.data.campus,
                            reason: that.data.reason,
                            startDate: that.data.startDate,
                            endDate: that.data.endDate,
                            accompanyname: that.data.accompanyname,
                            carnumber: that.data.carnumber,
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
                    url: '/pages/new/new',
                })
            }
        })

        //发送订阅消息给用户
        db.collection("teacherRegister")
            .get()
            .then(res => {
                let i;
                for (i = 0; i < res.data.length; i++) {
                    console.log(res.data[i]._openid)
                    wx.cloud.callFunction({
                            name: 'Reminder',
                            data: {
                                openid: res.data[i]._openid,
                                userName: this.data.name,
                                startDate: this.data.startDate,
                                remark: '无'
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