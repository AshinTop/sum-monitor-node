# [sum-monitor-node 山姆保供套餐nodejs监控脚本](https://github.com/AshinTop/sum-monitor-node.git)

## 注意事项

**1. 本项目仅供技术学习和交流，不可用作商业行为，任何违法违规造成的问题与本人无关。**

**2. 不可并非太高，不然账号可能会被风控。**

## 0. 前言

山姆商品疫情的当下，基本只做保供套餐了，虽然还是很想买，但是永远摸不清它什么时候上架

so，写了这个脚本，想监控下山姆保供套餐的上架时间

上架了会发邮件通知！！


**快速开始**

```
// 克隆代码
git clone git@github.com:AshinTop/sum-monitor-node.git

// install依赖
npm i

// 填入配置信息
# 按照 【1.填入用户配置】 自行配置用户信息

// 运行程序
npm start
```


## 1. 填入用户配置

使用 charles 手机抓包, [Windows 教程](https://blog.csdn.net/weixin_54789946/article/details/114879602)，[MAC 教程](https://www.jianshu.com/p/6ec799ecfb15)

```
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
  'fromEmail': '783767826@qq.com', // 发送邮件的邮箱
  'toEmail': '783767826@qq.com', // 接受邮件的邮箱
  'emailCode': 'cdwvdtuilwtobfij', // 邮箱授权码， QQ邮箱在 设置 -> 账户 -> POP3/SMTP服务 中开启
  'emailHost': 'smtp.qq.com', // 邮箱服务器地址 如非qq邮箱 请自行更改
}

// 三、 运行配置
const runConfig = {
  'useLogger': true, // 是否开启logger 调试使用
  'runInterval': 500, // 每一个请求的轮询间隔(ms)
  'maxRunCount': 100,//每个请求的最大重复执行次数
  'isLoop': true, //是否循环执行，为true则一直循环运行直到下单成功，为false则根据maxTime超时则停止
  'maxTime': 10, // 单次运行最长时间,分钟
}

```


## 2. 邮件通知配置

- 需要准备发送邮箱和接收邮箱（发送邮箱和接收邮箱可以为同一个）

- 接收邮箱可以绑定iphone自带的邮件APP，实现铃声提醒

### 发送邮箱的配置

1. 打开发送邮箱的 ‘设置 => 账户  => 开启 POP3/SMTP服务’，复制下授权码

2. 如果已经开启服务，点击’生成授权码‘获取授权码

3. 将接收邮箱的授权码和email 配置到 emailCode 和 fromEmail


### 接收邮箱的配置

1. 打开接受邮箱的 '设置 => 账户  => 开启 IMAP/SMTP服务'，复制下授权码

2. 如果已经开启服务，点击’生成授权码‘获取授权码

3. 打开iphone手机的 '设置 =》 邮件 =》 账户 =》 添加账户'，选择邮箱，输入以下信息

|  字段   | 填入内容  |
|  ----  | ----  |
| 全名  | 自定义 |
| 电子邮件  | 接收邮箱的email |
| 密码  | 接收邮件的授权码 |
| 描述  | 自定义 |

4. 将接收邮箱email 配置到 toEmail

[iphone绑定QQ邮箱教程](https://zhidao.baidu.com/question/1950479000046686868.html?qbl=relate_question_2&word=iphone%D3%CA%BC%FE%D4%F5%C3%B4%CC%ED%BC%D3qq%D3%CA%CF%E4);

另外，如要开启强通知（类似电话铃声），需要在iphone设置里面邮件提示声音
