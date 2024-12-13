---
title 请求封装
---
# 请求封装
`uView` 组件库提供了 `http` 请求封装的方法，详情点击 [链接](https://www.uviewui.com/js/http.html) 查看。
## 全局配置
在 `/config/request.js` 中，通过 `uni.$u.http.setConfig()` 方法配置根路径：
```javascript
module.exports = (vm) => {
    // 初始化请求配置
    uni.$u.http.setConfig((config) => {
        /* config 为默认全局配置*/
        config.baseURL = 'https://xxx.com'; /* 根域名 */
        return config
    })
}
```
## 请求拦截
在 `/config/request.js` 中，通过 `uni.$u.http.interceptors.request.use()` 方法配置请求拦截器：

- 设置请求头，根据接口不同的参数设置该请求是传 `json` 格式还是表单格式。
- 携带 `token` 。登录成功后会把用户 `token` 本地存储，在请求拦截器内获取到并携带过去给后端。
```javascript
module.exports = (vm) => {
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {})

	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => {
		if (config.header.isJson) {
			Reflect.deleteProperty(config.header, "isJson"); // es6语法“反射”，把这个判断字段删除，不删除会有core跨域问题
			config.header['Content-Type'] = 'application/json'
		} else {
			config.header['Content-Type'] = 'application/x-www-form-urlencoded'
		}

		// 设置token，正常请求，把得到的token带过去
		config.header['X-Access-Token'] = uni.getStorageSync('token');

		// 可以对某个url进行特别处理
		if (config.url.indexOf('user/login') !== -1) config.header['X-Access-Token'] = '1';
		// 最后需要将config进行return
		// console.log(config)
		return config;
	}, config => { // 可使用async await 做异步操作
		return Promise.reject(config)
	})
}
```
在打印 `config` 参数的时候，打印出来的效果如下所示：

![Vmo2xv.png](https://i.imgloc.com/2023/07/06/Vmo2xv.png)

其中有一个 `custom` 对象属性，该属性是由 `uni.$u.http` 第三个参数获取，因此代码可以改为如下形式：

```js
uni.$u.http.interceptors.request.use((config) => {
	uni.showLoading()
	if (config.custom.type) {
		config.header['Content-Type'] = 'application/json'
	} else {
		config.header['Content-Type'] = 'application/x-www-form-urlencoded'
	}

	// 设置token，正常请求，把得到的token带过去
	config.header['X-Access-Token'] = uni.getStorageSync('token');

	// 可以对某个url进行特别处理
	if (config.url.indexOf('user/login') !== -1) config.header['X-Access-Token'] = '1';

	return config
}, config => { // 可使用async await 做异步操作
	uni.hideLoading()
	return Promise.reject(config)
})
```

使用的时候可以通过如下方法设置：

```js
export const createOrderAPI = (data) => http.post('/order/create', data, {
	custom: {
		type: 'json'
	}
})
```

现在该接口就是 POST 请求的 JSON 格式。

### 拓展

ES6发布了新语法 “反射”`Reflect.deleteProperty`。
`JavaScript` 中的 `Reflect.deleteProperty()` 方法用于删除对象上的属性。它返回一个布尔值，指示该属性是否已成功删除。
用法:
```javascript
Reflect.deleteProperty(target, propertyKey)
```
参数：此方法接受两个参数，如上所示：

- `target`：要删除属性的对象。
- `propertyKey`：对象所要删除的属性的名称。

返回值：此方法返回一个布尔值，该值指示该属性是否已成功删除。
## 响应拦截
在 `/config/request.js` 中，通过 `uni.$u.http.interceptors.response.use()` 方法配置响应拦截器，判断状态做出对应的举措：

- 200：请求成功，返回响应数据中 `data` 部分。
- 401、402、403：用户未登录，弹出提示并跳转到登录页。
- 500：请求失败，弹出错误提示。
```javascript
module.exports = (vm) => {
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
    // ...
  })

	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => {
    // ...
	})

	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
		/* 对响应成功做点什么 可使用async await 做异步操作*/
		const data = response.data

		switch (data.code) {
			case 200:
				return data;
			case 401:
			case 402:
			case 403:
				// 这里后续跳转到登录页
				uni.$u.toast('身份过期，即将跳转登录')
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/login/Login'
					})
				}, 1500)
				return false;
			case 500:
				uni.$u.toast(data.msg)
				return false;
			default:
				break;
		}
	}, (response) => {
		// 对响应错误做点什么 （statusCode !== 200）
		return Promise.reject(response)
	})
}

```
## 总体代码
总体代码如下所示。
```javascript
import {
	BASE_URL
} from "../config";

module.exports = (vm) => {
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		/* config 为默认全局配置*/
		config.baseURL = BASE_URL; /* 根域名 */
		return config
	})

	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => {
		if (config.header.isJson) {
			Reflect.deleteProperty(config.header, "isJson"); // es6语法“反射”，把这个判断字段删除，不删除会有core跨域问题
			config.header['Content-Type'] = 'application/json'
		} else {
			config.header['Content-Type'] = 'application/x-www-form-urlencoded'
		}

		// 设置token，正常请求，把得到的token带过去
		config.header['X-Access-Token'] = uni.getStorageSync('token');
		// config.header['X-Access-Token'] = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxNjA1Mzg0Mjc4NDUyMTQ2MTc3IiwiaWF0IjoxNjcxNjEyMzEwLCJzdWIiOiJBUFAifQ.-jSyMmWqlvl6GBX2EfH78P-ESMePFnkxqXc42HEHTkU'

		// 可以对某个url进行特别处理
		if (config.url.indexOf('user/login') !== -1) config.header['X-Access-Token'] = '1';
		// 最后需要将config进行return
		// console.log(config)
		return config;
	}, config => { // 可使用async await 做异步操作
		return Promise.reject(config)
	})

	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
		/* 对响应成功做点什么 可使用async await 做异步操作*/
		const data = response.data

		switch (data.code) {
			case 200:
				return data;
			case 401:
			case 402:
			case 403:
				// 这里后续跳转到登录页
				uni.$u.toast('身份过期，即将跳转登录')
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/login/Login'
					})
				}, 1500)
				return false;
			case 500:
				uni.$u.toast(data.msg)
				return false;
			default:
				break;
		}
	}, (response) => {
		// 对响应错误做点什么 （statusCode !== 200）
		return Promise.reject(response)
	})
}
```
# Api集中管理
## 创建子模块并抛出
```javascript
const Index = vm => {
	return {
		// 获取所有轮播图
		getBannerList: params => {
			return uni.$u.http.get('banner/listAll')
		},
	}
}

// 抛出当前模块
export default Index
```
## 大总管接收挂载并导出
```javascript
// 引入 子模块
import Index from "./modules/index";
import Login from "./modules/login";
import Task from "./modules/task";
import Address from "./modules/address";
import Mine from "./modules/mine";
import Message from "./modules/message";

const install = (Vue, vm) => {
	vm.$u.api = {
		IndexApi: Index(vm),
		LoginApi: Login(vm),
		MessageApi: Message(vm),
		MineApi: Mine(vm),
		AddressApi: Address(vm),
		TaskApi: Task(vm)
	};
}

export default {
	install
}
```
# 配置引用
我们可以在 `main.js` 中引用 `/config/request.js` ，注意引用的位置，需要在 `new Vue` 得到 `Vue` 实例之后，如下：
```javascript
import Vue from 'vue'
import App from './App'

// 引入uview
import uView from "uview-ui";
Vue.use(uView);

const app = new Vue({
	store,
	...App
})

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import request from '@/utils/request'
Vue.use(request, app)

// http接口API集中管理引入部分
import requestApi from '@/api/index'
Vue.use(requestApi, app)

app.$mount()
```
