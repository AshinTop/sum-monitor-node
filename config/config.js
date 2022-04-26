const fs = require('fs');
const path = require('path');
// 一、使用 charles 手机抓包，获取以下参数：
const userConfig = {
  // -----------------------------------------------
  // 打开山姆app，点击分类->甄选美味，在charles中找到/api/v1/sams/goods-portal/grouping/list
  // (1)在header中找到
  authtoken: '740d926b981716f4d3092f44e6494863a9bf9b11d79a6bcb48f8d99eb68f479e',
  longitude: '121.248276',
  deviceid: '74aa03fb5109b8e89ef448ef00001cb14b16',
  latitude: '31.181001999999999',
  // (2) 复制Request
  data: {
    "pageSize": 20,
    "isReversOrder": false,
    "useNewPage": true,
    "uid": "181820618278",
    "frontCategoryIds": ["156017", "182055", "156018"],
    "storeInfoVOList": [{
      "storeId": "9991",
      "storeType": "32",
      "storeDeliveryAttr": [10]
    }, {
      "storeId": "4865",
      "storeType": "2",
      "storeDeliveryAttr": [3, 4, 5, 6, 7, 12]
    }, {
      "storeId": "9996",
      "storeType": "8",
      "storeDeliveryAttr": [1]
    }],
    "isFastDelivery": false,
    "addressVO": {
      "detailAddress": "通用·昱慧苑5-104",
      "cityName": "上海市",
      "countryName": "中国",
      "districtName": "青浦区",
      "provinceName": "上海市"
    },
    "secondCategoryId": "156017",
    "pageNum": 1
  }
}

// 二、 邮箱配置(非必需，不填则不发送邮件)
const emailConfig = {
  'fromEmail': '783767826@qq.com', // 发送邮件的邮箱
  'toEmail': '783767826@qq.com', // 接受邮件的邮箱
  'emailCode': 'cdwvdtuilwtobfij', // 邮箱授权码， QQ邮箱在 设置 -> 账户 -> POP3/SMTP服务 中开启
  'emailHost': 'smtp.qq.com', // 邮箱服务器地址 如非qq邮箱 请自行更改
}

// 三、 运行配置
const runConfig = {
  'useLogger': true, // 是否开启logger 调试使用
  'runInterval': 300, // 每一个请求的轮询间隔(ms)
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