Page({
    data: {
        id: "",
        popMsg: [],
        school: ['桑浦山校区', '东海岸校区'],
        //
        name: '',
        sex: '',
        phone: '',
        major: '',
        college: '',
        identity: '',
        workunit: '',
        position: '',
        email: '',
        accompanyname: '',
        carnumber: '',
        campus: "",
        areanumber: 0,
        grade: "",
        show: false,
        startDate:"",
        endDate:"",
    },
    tip(){
        wx.showModal({
          title: '同行人已不可修改',
          content: '若想修改可将此申请删除并重新申请',
          showCancel:false,
        })
    },
    onLoad(options) {
        console.log(options._id)
        this.setData({
            id: options._id
        })
        console.log(this.data.id)
        this.getRevise()
    },
    getRevise() {
        wx.cloud.database().collection("alumni")
            .where({
                _id: this.data.id
            })
            .get()
            .then(res => {
                console.log("成功来啦")
                this.setData({
                    popMsg: res.data,
                    name: res.data[0].name,
                    sex: res.data[0].sex,
                    phone: res.data[0].phone,
                    major: res.data[0].major,
                    college: res.data[0].college,
                    identity: res.data[0].identity,
                    workunit: res.data[0].workunit,
                    position: res.data[0].position,
                    email: res.data[0].email,
                    accompanyname: res.data[0].accompanyname,
                    carnumber: res.data[0].carnumber,
                    campus: res.data[0].campus,
                    startDate: res.data[0].startDate,
                    endDate: res.data[0].endDate,
                    grade: res.data[0].grade,
                })
            })
    },
    beback() {
        wx.redirectTo({
            url: '../new/new',
        })
    },
    back() {
        wx.cloud.database().collection("alumni")
            .where({
                _id: this.data.id
            })
            .update({
                data: {
                    name: this.data.name,
                    sex: this.data.sex,
                    phone: this.data.phone,
                    major: this.data.major,
                    college: this.data.college,
                    identity: this.data.identity,
                    workunit: this.data.workunit,
                    position: this.data.position,
                    email: this.data.email,
                    campus: this.data.campus,
                    reason: this.data.reason,
                    accompanyname: this.data.accompanyname,
                    carnumber: this.data.carnumber,
                    currentTime: wx.cloud.database().serverDate(),
                    grade: this.data.grade,
                    startDate: this.data.startDate,
                    endDate: this.data.endDate,
                    isready:0 //状态重新变为待审批
                }
            })
            .then(res => {
                wx.redirectTo({
                    url: '../new/new',
                })
            })
            .catch(err => {
                console.log(err)
            })
    },
    //到访校区
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
        console.log(this.data.campus)
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
    //获得入校事由
    getReason(e) {
        this.setData({
            reason: e.detail.value
        })
    },
    //获得同行人姓名
    getAccompanyname(e) {
        console.log(e)
        this.setData({
            accompanyname: e.detail.value
        })

    },

    //获得入校车牌号
    geCarnumber(e) {
        this.setData({
            carnumber: e.detail.value
        })
        console.log(this.data.carnumber)
    },
    //获得入学时间
    getGrade(e) {
        this.setData({
            grade: e.detail.value
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
})