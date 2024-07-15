const db = wx.cloud.database()
const _ = db.command
Page({
    data: {
        info: "待审批的申请信息",
        active:0,
        _id:"",
        isready:0,
        icon:{
            normal0:'../../img/normalNeedApprove.png',
            active0: '../../img/activeNeedApprove.png',
            normal1:'../../img/normalReject.png',
            active1: '../../img/activeReject.png',
            normal2:'../../img/normalPass.png',
            active2: '../../img/activePass.png'
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
     //页面加载调用
     onLoad() {
        var sum = db.collection("accompanyAlumni").where({isready:this.data.isready}).count()
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
        wx.cloud.database().collection("accompanyAlumni")
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
            popUps:false,
            onlyView:false,
            currentPage:1
            // isapproval:false,
        })
        // console.log(this.data.changeIsready)
        this.getMsg()
        this.onLoad()
    },
     //已驳回
     disApprove(){
        this.setData({
            info:"已驳回的申请信息",
            isready:2,
            popUps:false,
            currentPage:1
        })
        this.onLoad()
    },
    pass(e){
        this.setData({
            _id: e.target.dataset._id
        })
        db.collection("accompanyAlumni")
        .doc(this.data._id)
        .update({
            data: {
                isready:1
            }
        })
        .then(res => {
            console.log("成功")
            this.getMsg()
        })
        .catch(err => {
            console.log(err)
        });
        this.onLoad()
       //先访问该申请的信息，然后将获取的信息传给云函数sendMessage
       db.collection("accompanyAlumni")
       .doc(this.data._id)
       .get()
       .then(res=>{
       let openid = res.data._openid
       let userName = res.data.name
       //发送订阅消息给用户
       wx.cloud.callFunction({
              name:'sendMessage',
              data: {
                     openid: openid,
                     userName:userName,
                     state:"审批通过",
              },
              })
              .then(res=>{
              console.log("调用成功",res)
              })
              .catch(err=>{
              console.log("请求云函数失败",err)
              })
       })
    },
    overrule(e){
        console.log( e.target.dataset._id)
        this.setData({
            _id: e.target.dataset._id
        })
        db.collection("accompanyAlumni")
        .doc(this.data._id)
        .update({
            data: {
                isready:2
            }
        })
        .then(res => {
            console.log("成功")
            this.getMsg()
        })
        .catch(err => {
            console.log(err)
        });
        this.onLoad()
             //先访问该申请的信息，然后将获取的信息传给云函数sendMessage
       db.collection("accompanyAlumni")
       .doc(this.data._id)
       .get()
       .then(res=>{
       let openid = res.data._openid
       let userName = res.data.name
       //发送订阅消息给用户
       wx.cloud.callFunction({
              name:'sendMessage',
              data: {
                     openid: openid,
                     userName:userName,
                     state:"审批驳回",
              },
              })
              .then(res=>{
              console.log("调用成功",res)
              })
              .catch(err=>{
              console.log("请求云函数失败",err)
              })
       })
    },
    //导出excel
    getExcel() {
        this.setData({
        throttle:true
        })
        if(this.data.throttle==false)return
        else db.collection("accompanyAlumni")
        .where({
            isready:this.data.isready
        })
        .skip((this.data.currentPage-1)*20)
        .limit(20)
            .get()
            .then(res => {
                console.log(res)
                wx.cloud.callFunction({
                    name: 'getCompanionsExcel',
                    data: {
                        alumni: res.data
                    },
                    success: r => {
                        console.log("这首" + r.result)
                        this.getFileUrl(r.result.fileID),
                            this.copyFileUrl()
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
                    duration: 2000
                })
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

    }
})