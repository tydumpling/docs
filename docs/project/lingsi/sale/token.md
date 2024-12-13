---
title token刷新
---
# 刷新 token
本项目 `token` 有效时长为 2小时，超时后需要额外调用接口获取新的 `token` 并替换原来旧的 `token` ，手动实现 `token` 刷新。
**思路分析：**

1. 获取用户登录以及上一次获取到 `token` 的时间戳并保存
2. 在用户发送请求时判断当前时间戳与保存的时间戳是否超过1.5小时，如果超过则调用获取 `token` 的接口。
> 注意：
> 调用接口不能使用封装后的方法，因为调用刷新 `token` 的接口已经封装好了，如果继续调用封装好的方法会一直判断时间戳，调用接口，判断时间戳......进入死循环。

不要用了框架就忘记原生方法。`uniapp` 提供一个方法 [uni.request](https://uniapp.dcloud.net.cn/api/request/request.html#request) 发起网络请求，参数说明如下：
**参数说明**

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| url | String | 是 |  | 开发者服务器接口地址 |
| data | Object/String/ArrayBuffer | 否 |  | 请求的参数 |
| header | Object | 否 |  | 设置请求的 header，header 中不能设置 Referer |
| method | String | 否 | GET | 有效值详见下方说明 |
| timeout | Number | 否 | 60000 | 超时时间，单位 ms |
| dataType | String | 否 | json | 如果设为 json，会尝试对返回的数据做一次 JSON.parse |
| responseType | String | 否 | text | 设置响应的数据类型。合法值：text、arraybuffer |
| success | Function | 否 |  | 收到开发者服务器成功返回的回调函数 |
| fail | Function | 否 |  | 接口调用失败的回调函数 |
| complete | Function | 否 |  | 接口调用结束的回调函数（调用成功、失败都会执行） |

整体代码如下所示：
```javascript
import {
	BASE_URL
} from "../config";

module.exports = (vm) => {
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		// ...
	})

	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => {
		const loginTime = uni.getStorageSync('loginTime') // 获取上一次保存token的时间
		const nowTime = Date.now() // 获取当前时间

		// 刷新token
		if (((nowTime - loginTime) / (1000 * 60 * 60)) % 24 > 1.5) {
			uni.request({
				url: BASE_URL + '/user/refresh',
				header: {
					'X-Access-Token': uni.getStorageSync('token')
				},
				success: (res) => {
					uni.setStorageSync('token', res.data.data.token)
					uni.setStorageSync('loginTime', Date.now())
				},
				fail: (err) => {
					console.log(err);
				}
			});
		}
  	// ...
    
		return config;
	}, config => { // 可使用async await 做异步操作
		return Promise.reject(config)
	})

	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
  	// ...
  )
}
```
