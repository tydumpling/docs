用户点击电话或者拨打图标后，进入手机拨号页面。
微信小程序提供了 `wx.makePhoneCall`方法，参数如下所示：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| phoneNumber | String | 是 | 需要拨打的电话号码 |
| success | Function | 否 | 接口调用成功的回调 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

通过给属性 `phoneNumber`赋值手机号即可。
```javascript
// 拨打电话
dial(){
  wx.makePhoneCall({
    phoneNumber: 'phoneNumber',
  })
}
```
