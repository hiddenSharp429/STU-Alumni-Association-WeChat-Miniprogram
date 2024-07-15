<!--
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2023-05-17 21:42:50
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-07-15 19:50:52
 * @FilePath: /StuAlumni/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# 汕头大学校友办微信小程序

<div align="center">
  
  [![Static Badge](https://img.shields.io/badge/%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-%40hiddenSharp429-red)](https://github.com/hiddenSharp429/STU-Alumni-Association-WeChat-Miniprogram/blob/master/README_CN.md)    |  [![Static Badge](https://img.shields.io/badge/English-%40hiddenSharp429-blue)](https://github.com/hiddenSharp429/STU-Alumni-Association-WeChat-Miniprogram)  |    [![Online Docs](https://img.shields.io/badge/Change%20Log-%40hiddenSharp429-brown)](https://github.com/hiddenSharp429/STU-Alumni-Association-WeChat-Miniprogram/blob/master/docs/ChangeLog.md)
  
</div>

> 已于2024年1月停止维护

## 简介

欢迎来到“汕头大学校友办微信小程序”的GitHub仓库。本微信小程序使用微信原生语法和腾讯云开发框架开发，旨在简化汕头大学校友回校申请的审批流程。

## 功能

- **校友预约进校申请**：与教师预约讨论具体内容、时间和协商形式。
- **预约审批**：管理和审批各种入校申请。

## 项目结构

```commandline
STU-Alumni-Association-Wechat-program
├─cloud (小程序使用的云函数)
├─components (小功能组件)
├─docs (所有文档，包括变更日志)
├─pages (小程序中的各种页面)
├─img (项目中使用的一些必要图片)
├─style/iconfont.wxss
├─app.js 
├─app.wxss 
├─app.json 
└─README.md\README_CN.md
```

## 前置条件

- 微信开发者工具
- 腾讯云账户
- Node.js

## 安装

1. **克隆仓库**：
    ```bash
    git clone https://github.com/hiddenSharp429/STU-Alumni-Association-WeChat-Miniprogram.git
    ```

2. **安装依赖**：
    进入项目目录并安装所需依赖：
    ```bash
    cd WeChatMiniProgram
    npm install
    ```

3. **配置腾讯云**：
    - 设置你的腾讯云账户并初始化云环境。
    - 在项目中更新云环境配置。

## 使用

1. **用微信开发者工具打开**：
    - 打开微信开发者工具。
    - 导入 `WeChatMiniProgram` 项目。

2. **部署云函数**：
    - 通过微信开发者工具将云函数部署到腾讯云环境。

3. **运行小程序**：
    - 在微信开发者工具中点击“编译”按钮运行小程序。

4. **与小程序互动**：
    - 使用小程序提交和审批教师预约申请和活动申请。

## 部分页面截图

<img src="https://pic.imgdb.cn/item/6694c8abd9c307b7e914ec1b.png" alt="Home Page" height="350"/>

<img src="https://pic.imgdb.cn/item/6694c8acd9c307b7e914ec3d.png" alt="Home Page" height="350"/>

<img src="https://pic.imgdb.cn/item/6694c8acd9c307b7e914ec55.png" alt="Home Page" height="350"/>

<img src="https://pic.imgdb.cn/item/6694c8acd9c307b7e914ec63.png" alt="Home Page" height="350"/>


## 贡献

欢迎大家为这个开源项目作出贡献，欢迎提交PR请求和留下你的问题。这个项目单纯为爱发电，所以不会有任何金钱相关的利益。如果这个项目对你有帮助，可以给我一个小星星吗？

## 鸣谢

- 感谢所有为这个项目做出贡献的开发者和贡献者。
- 特别感谢汕头大学和校团委的支持。

如有任何问题或需要帮助，请提交issue或通过[我的网易邮箱](mailto:z404878860@163.com)联系我们。