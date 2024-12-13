---
title 支付页
---
# 支付
根据后端的接口文档，支付模块需要调用两个接口：

1. 创建订单

   创建成功后会返回相应的订单编号

2. 支付

   拿到订单编号后调用支付接口

   ```js
   // 点击支付按钮
   const toPayFn = async () => {
     if (!checked.value) {
       uni.showToast({
         title: '请选择支付方式',
         icon: 'error'
       })
       return
     }
     //发起创建订单接口请求
     shopStore.payFn(传参).then(res => {
       switch (checked.value) {
         case 'wxpay':
           uni.showToast({
             title: '暂未支持微信支付',
             icon: 'none'
           })
           break;
         case 'alipay':
           realPay(res)
           break;
         default:
           break;
       }
     })
   };
   ```

## 微信支付
由于项目客户未申请到微信开发者账号，因此暂时无法实现此业务。

## 支付宝支付

- 调用支付接口获取回调参数 `alipay sdk`
- 通过 `uni.requestPayment` 调用支付宝支付

**参数说明**

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `provider` | `String` | 是 | 服务提供商，通过 [uni.getProvider](https://uniapp.dcloud.net.cn/api/plugins/provider) 获取。 |
| `orderInfo` | `String/Object` | 是 | 订单数据，[注意事项](https://uniapp.dcloud.net.cn/api/plugins/payment#orderinfo) |
| `timeStamp` | `String` | 微信小程序必填 | 时间戳从1970年1月1日至今的秒数，即当前的时间。 |
| `nonceStr` | `String` | 微信小程序必填 | 随机字符串，长度为32个字符以下。 |
| `package` | `String` | 微信小程序必填 | 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx。 |
| `signType` | `String` | 微信小程序必填 | 签名算法，应与后台下单时的值一致 |
| `paySign` | `String` | 微信小程序必填 | 签名，具体签名方案参见 [微信小程序支付文档](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=3) |
| `bannedChannels` | `Array<String>` | 否 | 需要隐藏的支付方式，详见 [百度小程序支付文档](https://smartprogram.baidu.com/docs/develop/api/open_payment/#requestPolymerPayment/) |

```javascript
const realPay = (res) => {
  shopStore.orderPayFn({
    orderNo: 后端返回的订单编号,
    provider: provider.value
  }).then(resu => {
    //调用uniapp API uni.requestPayment 支付接口
    uni.requestPayment({
      provider: 'alipay',
      //后台返回的订单数据
      orderInfo: xxx, // 后端返回的支付宝sdk
      //调用成功的回调
      success(success) {
        uni.showToast({
          title: '支付成功',
          icon: 'success'
        })
      },
      //调用失败的回调
      fail(err) {
        uni.showToast({
          title: err.errMsg.split(']')[1],
          icon: 'none'
        })
      }
    })
  })
}

```

## 注意事项

### manifest.json配置相关参数

1. 在manifest.json - App模块权限选择 中勾选 payment(支付)
2. 在 manifest.json - App SDK配置 中，勾选需要的支付平台，目前有微信支付、支付宝支付、苹果应用内支付(IAP)，其中微信支付需要填写从微信开放平台获取的AppID
3. 这些配置需要打包生效，真机运行仍然是HBuilder基座的设置，可使用自定义基座调试。离线打包请参考离线打包文档在原生工程中配置。
4. 配置并打包后，通过 `uni.getProvider` 可以得到配置的结果列表，注意这里返回的是manifest配置的，与手机端是否安装微信、支付宝无关。

### H5微信浏览器无效

产品在测试的时候通过微信内置的浏览器打开项目时，发现支付宝支付只能显示链接不能跳转，且链接复制到浏览器后部分链接会报错，如下所示：

[![pC42OfJ.jpg](https://s1.ax1x.com/2023/07/14/pC42OfJ.jpg)](https://imgse.com/i/pC42OfJ)

最终经过商讨，决定在用户使用微信内置浏览器打开时，给予提示使用外部浏览器打开项目。如何判断当前浏览器是微信浏览器的方法可见 [音果H5](/project/lingsi/music/H5/index.md) 。

## 优化

当支付失败时，前端也要做对应的处理，不能让用户一直盯着 `loading` 看。实现该效果需要配合支付事件的 `fail` 回调函数与 `tyy..catch` 方法。

首先当触发 `fail` 函数时，说明支付失败发生错误，此时通过 `reject()` 让 `Promise` 变为失败状态，抛出错误；再通过 `try...catch` 捕获错误，显示对应的提示，并作出相应的处理。