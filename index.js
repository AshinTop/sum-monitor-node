const { default: axios } = require('axios');
const { userConfig, emailConfig, runConfig } = require('./config/config');
const { sendEmail } = require('./utils/sendEmail');
const { logger } = require('./utils/logger');
const { exit } = require('process');
const { getDateStr, getDateOfDay } = require('./utils/util');
const runningTask = null //运行定时器
let runCount = 0;//执行次数
async function main () {
  if (Object.values(userConfig).some(item => item === "")) {
    logger(`请先到/config/config.js中完成所有配置`);
    exit(0);
  }
  if (!runConfig.isLoop && runConfig.maxTime && runningTask === null) {
    const mode = runConfig.isLoop ? '循环执行' : `定时执行，${runConfig.maxTime}分钟后自动停止`
    logger(`开始运行，[模式]${mode}`);
    runningTask = setTimeout(() => {
      logger(`定时执行结束`);
      exit(0);
    }, runConfig.maxTime * 60 * 1000);
  }
  getlist()
}


//开始下单
const getlist = async () => {
  let res = false
  runCount++
  let url = 'https://api-sams.walmartmobile.cn/api/v1/sams/goods-portal/grouping/list'
  let headers = {
    'Host': 'api-sams.walmartmobile.cn',
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'auth-token': userConfig.authtoken,
    'app-version': '5.0.48.3',
    'longitude': userConfig.longitude,
    'device-id': userConfig.deviceid,
    'latitude': userConfig.latitude,
    'device-type': 'ios',
    'Accept-Language': 'zh-Hans-CN;q=1',
    'Accept-Encoding': 'gzip, deflate, br',
    'apptype': 'ios',
    'device-name': 'iPhone13,1',
    'device-os-version': '15.4.1',
    'User-Agent': 'SamClub/5.0.48 (iPhone; iOS 15.4.1; Scale/3.00)',
    'Content-Length': 552,
    'system-language': 'CN',
    'Connection': 'keep-alive',
  }
  let qdata = userConfig.data
  try {
    let ret = await axios.post(url, qdata, { headers });
    let { success, msg, errorMsg, data } = ret.data;
    if (success && data && data.dataList && data.dataList.some(item => item.stockInfo.stockQuantity > 0)) {
      logger('保供套餐有货了！！！')
      let list = data.dataList.filter(item => item.stockInfo.stockQuantity > 0);
      let content = list.map(dd => {
        let price = dd.priceInfo.filter(p => p.priceType === 1)[0].price
        return `${dd.title}, ¥${price / 100}, ${dd.subTitle}`
      })
      //发送邮件
      sendEmail({
        title: `保供套餐有货了！！！（${getDateStr()}）`,
        message: `保供套餐有货了！！！\n 上架的商品有：\n ${content.join('    \n')}`
      });
      //商品加入购物车
      let products = list.map(pit => {
        let price = pit.priceInfo.filter(p => p.priceType === 1)[0].price
        return {
          "componentPath": "{\"category3_id\":\"\",\"category2_index\":0,\"category1_name\":\"肉蛋果蔬\",\"category1_id\":\"35145\",\"category2_id\":\"156017\",\"category3_name\":\"全部\",\"category1_index\":0,\"category2_name\":\"甄选美味\",\"category3_index\":0}",
          "goodsName": pit.title,
          'price': `¥${price / 100}`,
          "increaseQuantity": 1,
          "storeId": pit.storeId,
          "spuId": pit.spuId
        }
      })
      addCartInfo(products)
      res = true
    } else {
      logger(`现在没货：${msg || errorMsg}(${runCount})`);
    }
  } catch (e) {
    logger(`获取list失败：${e}(${runCount})`);
  }
  if (!res) {
    setTimeout(() => {
      getlist()
    }, runConfig.runInterval)
  } else {
    setTimeout(() => {
      exit(0);
    }, 10000)
  }
}


const addCartInfo = async (products) => {
  try {
    let url = 'https://api-sams.walmartmobile.cn/api/v1/sams/trade/cart/addCartGoodsInfo'
    let headers = {
      'Host': 'api-sams.walmartmobile.cn',
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'auth-token': userConfig.authtoken,
      'app-version': '5.0.48.3',
      'longitude': userConfig.longitude,
      'device-id': userConfig.deviceid,
      'latitude': userConfig.latitude,
      'device-type': 'ios',
      'Accept-Language': 'zh-Hans-CN;q=1',
      'Accept-Encoding': 'gzip, deflate, br',
      'apptype': 'ios',
      'device-name': 'iPhone13,1',
      'device-os-version': '15.4.1',
      'User-Agent': 'SamClub/5.0.48 (iPhone; iOS 15.4.1; Scale/3.00)',
      // 'Content-Length': 552,
      'system-language': 'CN',
      'Connection': 'keep-alive',
      'track-info': [{ "labelType": "push_trace", "attachId": "" }, { "labelType": "systemMessage_trace", "attachId": "" }, { "labelType": "apppushmsgtaskid_trace", "attachId": "" }, { "labelType": "systemmsgtasksubid_trace", "attachId": "" }, { "labelType": "tracking_id", "attachId": "1650771521300-02A0B22B-28CA-4632-8339-65B30432A613" }, { "labelType": "tracepromotion", "createTime": "", "attachId": "" }]
    }
    let qdata = {
      'uid': userConfig.data.uid,
      'cartGoodsInfoList': products
    }
    let ret = await axios.post(url, qdata, { headers });
    let { code } = ret.data;
    if (code === 'Success') {
      logger(`添加购物车成功`);
    } else {
      logger(`添加购物车失败`);
    }
  } catch (e) {
    logger(`添加购物车失败`);
  }
}
main()