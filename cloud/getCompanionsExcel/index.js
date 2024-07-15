const cloud = require('wx-server-sdk')
cloud.init({
  env:'huahuabuhua-5gg18vlh5e47ced9'
})
const xlsx = require('node-xlsx')    //导入Excel类库
const db = cloud.database()   //声明数据库对象
const _ = db.command
exports.main = async (event, context) => {   //主函数入口
    try {
        // 关键
        let alumni = event.alumni;
        console.log(alumni);
        let dataCVS = `alumni-${Math.floor(Math.random()*1000000000)}.xlsx`
        //声明一个Excel表，表的名字用随机数产生
        let alldata = [];
        let row = ['姓名','电话','陪同人员']; //表格的属性，也就是表头说明对象
        alldata.push(row);  //将此行数据添加到一个向表格中存数据的数组中
//接下来是通过循环将数据存到向表格中存数据的数组中
        for (let key in alumni) {
            let arr = [];
            arr.push(alumni[key].name);
            arr.push(alumni[key].number);
            arr.push(alumni[key].othername);
            alldata.push(arr)
            console.log(arr)
         }
         var buffer = await xlsx.build([{   
          name: "mySheetName",
          data: alldata
          }]);     
            //将表格存入到存储库中并返回文件ID
            return await cloud.uploadFile({
                cloudPath: dataCVS,
                fileContent: buffer, //excel二进制文件
            })
    } catch (error) {
        console.error(error)
    }
      
}
