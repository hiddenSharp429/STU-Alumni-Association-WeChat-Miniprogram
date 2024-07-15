const db = wx.cloud.database()
const _ = db.command

Page({
    data: {
        rejectPop:false, //点击驳回将会弹出的窗口
        active: 0,
        info: "待审批的申请信息",
        msg: [],
        // changeIsready: false,
        popUps: false,
        popUpsMsg: [],
        isready: 0,
        show: false,
        rejectReason:"",
        _id: "",
        accompanyname: "",
        fileUrl: "",
        throttle: false,
        //导航栏
        icon: {
            normal0: '../../img/normalNeedApprove.png',
            active0: '../../img/activeNeedApprove.png',
            normal1: '../../img/normalReject.png',
            active1: '../../img/activeReject.png',
            normal2: '../../img/normalPass.png',
            active2: '../../img/activePass.png',
        },


        total:"",
        currentPage:1,
        pageMax:""
    },
    //下一页
    next(){
        if(this.data.currentPage==this.data.pageMax){
            wx.showToast({
              title: '已经是最后一页',
              icon:"none"
            })
            return}
        this.data.currentPage=this.data.currentPage+1;
        console.log(this.data.currentPage)
        this.onLoad()
    },
    //上一页
    previous(){
        if(this.data.currentPage==1){
            wx.showToast({
              title: '已经在首页',
              icon:"none"
            })
            return
        }
        this.data.currentPage=this.data.currentPage-1;
        this.onLoad()
    },
    showPopup() {
        this.setData({
            show: true
        });
    },

    onClose() {
        this.setData({
            show: false
        });
    },
    rejectClose() {
        this.setData({
            rejectPop: false
        })
    },
    //点击驳回显示弹窗
    rejectShow(){
        this.setData({
            rejectPop:true
        })
    },
    //页面加载调用
    onLoad() {
        //关于分页查询
        var sum = db.collection("alumni").where({isready:this.data.isready}).count()
        .then(res => {
            console.log(res.total)
            this.data.pageMax = Math.ceil(res.total/20);
            console.log(this.data.pageMax)
            this.setData({
                total:res.total
            })
        })
        .catch(err => {
            console.log(err)
        })
        console.log(sum)

        console.log("aaa")
        this.getMsg()
    },
    //得到需要审批信息
    getMsg() {
        // console.log(this.data.changeIsready)
        wx.cloud.database().collection("alumni")
            .orderBy('startDate', "asc")
            .where({
                isready: this.data.isready,
            })
            .skip((this.data.currentPage-1)*20)
            .limit(20)
            .get()
            .then(res => {
                this.setData({
                    msg: res.data,
                })

            })
            .catch(err => {
                console.log(err)
            })
    },
    onChange(event) {
        // event.detail 的值为当前选中项的索引
        this.setData({
            active: event.detail
        });

    },
    //已审批
    haveApprove() {
        this.setData({
            info: "已通过的申请信息",
            popUps: false,
            isready: 1,
            currentPage:1
        })
        this.onLoad()

    },
    //待审批
    approve() {
        this.setData({
            info: "待审批的申请信息",
            // changeIsready: false,
            isready: 0,
            popUps: false,
            onlyView: false,
            currentPage:1
            // isapproval:false,
        })
        // console.log(this.data.changeIsready)
        this.getMsg()
        this.onLoad()
    },
    //已驳回
    disApprove() {
        this.setData({
            info: "已驳回的申请信息",
            isready: 2,
            popUps: false,
            currentPage:1
        })
        this.onLoad()
    },
    //弹窗
    popUps(e) {
        console.log("可以")
        console.log(e.currentTarget.dataset._id)
        db.collection("alumni")
            .where({
                _id: e.currentTarget.dataset._id
            })
            .get()
            .then(res => {
                this.setData({
                    popUpsMsg: res.data,
                    _id: e.currentTarget.dataset._id,
                    accompanyname: e.currentTarget.dataset.accompanyname
                })
            })
            .catch(err => {
                console.log(err)
            })
        // 细节放后面加定时器
        setTimeout(() => {
            this.setData({
                popUps: true,
            })
        }, 250);
    },
    back() {
        this.setData({
            popUps: false,
        })
    },
    inputReject(e){
        console.log(e.detail.value)
        this.setData({
            rejectReason:e.detail.value
        })
        console.log(this.rejectReason)
    },
    //驳回
    overrule() {
        db.collection("alumni")
            .doc(this.data._id)
            .update({
                data: {
                    isready: 2,
                    rejectReason:this.data.rejectReason
                }
            })
            .then(res => {
                this.setData({
                    popUps: false, //没有问题
                    rejectPop:false,
                })
                this.getMsg()
                console.log("这里是" + this.data.accompanyname)
                db.collection("accompanyAlumni")
                    .where({
                        name: this.data.accompanyname
                    })
                    .update({
                        data: {
                            isready: 2
                        }
                    })
                    .then(r => {
                        console.log(r)
                        console.log("成功")
                    })
                    .catch(er => {
                        console.log("失败", er)
                    })
            })
            .catch(err => {
                console.log(err)
            });
        this.onLoad()
        //先访问该申请的信息，然后将获取的信息传给云函数sendMessage
        db.collection("alumni")
            .doc(this.data._id)
            .get()
            .then(res => {
                let openid = res.data._openid
                let userName = res.data.name
                //发送订阅消息给用户
                wx.cloud.callFunction({
                        name: 'sendMessage',
                        data: {
                            openid: openid,
                            userName: userName,
                            state: "审批驳回",
                        },
                    })
                    .then(res => {
                        console.log("调用成功", res)
                    })
                    .catch(err => {
                        console.log("请求云函数失败", err)
                    })
            })
    },
    //将获取到的数据传入学校提供的接口
    // sendDataToSchool() {
    //     db.collection("alumni")
    //         .doc(this.data._id)
    //         .get()
    //         .then(res => {
    //             let openid = res.data._openid
    //             let fullname = res.data.name
    //             let idNumber = res.data.identity
    //             let plateNumber = res.data.carnumber
    //             let mobile = res.data.phone
    //             let campus = res.data.campus
    //             let reason = res.data.reason
    //             let startDate = res.data.startDate
    //             let endDate = res.data.endDate
    //             console.log(openid)
    //             console.log(fullname)
    //             console.log(idNumber)
    //             console.log(plateNumber)
    //             console.log(mobile)
    //             console.log(campus)
    //             console.log(reason)
    //             console.log(startDate)
    //             console.log(endDate)
    //             wx.cloud.callFunction({
    //                 name: 'aes',
    //                 data: {
    //                     openid: openid
    //                 },
    //                 complete: res => {
    //                     console.log('callFunction test result:', res.result)
    //                     wx.request({
    //                         url: 'https://wechat.stu.edu.cn/health-report/api/create-guest/',
    //                         method: "POST",
    //                         data: {
    //                             openid: openid, //初始的openid
    //                             captcha: res.result, //加密后的openid
    //                             fullname: fullname,
    //                             idNumber: idNumber,
    //                             plateNumber: plateNumber,
    //                             mobile: mobile,
    //                             campus: campus,
    //                             reason: reason,
    //                             startDate: startDate,
    //                             endDate: endDate,
    //                         },
    //                         header: {
    //                             'content-type': 'application/x-www-form-urlencoded' // 提交webform
    //                         },
    //                         success(res) {
    //                             console.log(res.data)
    //                         },
    //                         fail(res) {
    //                             console.log("请求失败", res)
    //                         },
    //                     })
    //                 }
    //             })
    //         })
    // },
    //通过
    pass() {
        let that = this
        db.collection("alumni")
            .doc(this.data._id)
            .update({
                data: {
                    isready: 1
                }
            })
            .then(res => {
                this.setData({
                    popUps: false
                })
                this.getMsg()
                db.collection("accompanyAlumni")
                    .where({
                        name: this.data.accompanyname
                    })
                    .update({
                        data: {
                            isready: 1
                        }
                    })
                    .then(r => {
                        console.log(r)
                        console.log("成功")
                    })
                    .catch(er => {
                        console.log("失败", er)
                    })
            })
            .catch(err => {
                console.log(err)
            })
        this.onLoad()
        //先访问该申请的信息，然后将获取的信息传给云函数sendMessage
        db.collection("alumni")
            .doc(this.data._id)
            .get()
            .then(res => {
                let openid = res.data._openid
                let userName = res.data.name
                //发送订阅消息给用户
                wx.cloud.callFunction({
                        name: 'sendMessage',
                        data: {
                            openid: openid,
                            userName: userName,
                            state: "审批通过",
                        },
                    })
                    .then(res => {
                        console.log("调用成功", res)
                    })
                    .catch(err => {
                        console.log("请求云函数失败", err)
                    })
            })
        // wx.showModal({
        //   title: '是否确定要将审核通过的信息提交到接口？',
        //   content: '测试',
        //   complete: (res) => {
        //     if (res.cancel) {
              
        //     }
        
        //     if (res.confirm) {
        //         that.sendDataToSchool()
        //     }
        //   }
        // })
    },
    //导出excel
    getExcel() {
        this.setData({
            throttle: true
        })
        if (this.data.throttle == false) return
        else db.collection("alumni")
            .where({
                isready: this.data.isready
            })
            .skip((this.data.currentPage-1)*20)
            .limit(20)
            .get()
            .then(res => {
                console.log(res)
                wx.cloud.callFunction({
                    name: 'getExcel',
                    data: {
                        alumni: res.data
                    },
                    success: r => {
                        console.log("这首" + r.result)
                        this.getFileUrl(r.result.fileID)
                    },
                    fail: e => {
                        console.log("fail")
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })
    },
    getFileUrl(fileID) {
        let that = this;
        wx.cloud.getTempFileURL({
            fileList: [fileID],
            success: res => {
                console.log("文件下载链接", res.fileList[0].tempFileURL)
                that.setData({
                    fileUrl: res.fileList[0].tempFileURL
                })

                wx.showToast({
                    title: '数据导出成功',
                    icon: 'success',
                    duration: 1000
                })
                this.copyFileUrl()
            },
        })
    },
    copyFileUrl() {
        let that = this
        wx.setClipboardData({
            data: that.data.fileUrl,
            success(res) {
                wx.getClipboardData({
                    success(res) {
                        console.log(res.data) // data
                        wx.getClipboardData({
                            success(res) {
                                console.log(res.data)
                            }
                        })
                    }
                })
            }
        })

    },
});