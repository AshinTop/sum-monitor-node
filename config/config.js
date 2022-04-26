const fs = require('fs');
const path = require('path');
// 一、使用 charles 手机抓包，获取以下参数：
const userConfig = {
  // -----------------------------------------------
  // 打开山姆app，点击分类->甄选美味，在charles中找到/api/v1/sams/goods-portal/grouping/list
  // (1)在header中找到
  authtoken: '',
  longitude: '',
  deviceid: '',
  latitude: '',
  // (2) 复制Request
  data: {}
    
}

// 二、 邮箱配置(非必需，不填则不发送邮件)
const emailConfig = {
  'fromEmail': '', // 发送邮件的邮箱
  'toEmail': '', // 接受邮件的邮箱
  'emailCode': '', // 邮箱授权码， QQ邮箱在 设置 -> 账户 -> POP3/SMTP服务 中开启
  'emailHost': '', // 邮箱服务器地址 如非qq邮箱 请自行更改
}

// 三、 运行配置
const runConfig = {
  'useLogger': true, // 是否开启logger 调试使用
  'runInterval': 1000, // 每一个请求的轮询间隔(ms)
  'maxRunCount': 100,//每个请求的最大重复执行次数
  'isLoop': true, //是否循环执行，为true则一直循环运行直到下单成功，为false则根据maxTime超时则停止
  'maxTime': 10, // 单次运行最长时间,分钟
}

if (fs.existsSync(path.resolve(__dirname, './my.js'))) {
  // 请忽略这部分，填写上面的config
  module.exports = require('./my');
} else {
  module.exports = { userConfig, emailConfig, runConfig };
}
