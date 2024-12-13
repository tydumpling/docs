---
title 登录页
---

# 登录页

## 业务分析

1. 获取验证码
   1. 调用接口
   2. 获取参数并传参
2. 验证码登录/账号密码登录
3. 游客登录
4. 服务条款、隐私协议
5. 忘记密码
6. 微信授权登录

## 业务实现

### 获取验证码
点击获取验证码按钮

- 判断用户有无输入手机号
   - 无：弹出手机号为空提示，不调用接口
   - 有：把手机号作为参数传给后端
- 接口调用成功后
   - 修改按钮文本
   - 开启定时器
      1. 设置一个变量，初始值为60
      2. 每隔一秒自减1
      3. 变量为0时恢复内容，关闭定时器
   - 禁止按钮点击事件

当按钮被点击调用接口成功后禁用按钮，倒计时结束后恢复按钮点击
> **可实现的优化**
> 可以为点击事件添加一个节流操作，防止用户短时间内点击多次调用多次接口。

### 登录
获取用户输入的手机号与验证码（或者账号和密码），正则校验是否符合条件。校验通过调用接口，与机器码一同传递给后端（机器码在游客登录中详谈），失败则给用户提示。

根据接口返回的数据，利用 `uni.setStorageSync` 本地存储用户的 `cookie` 和 用户信息 `userInfo` 。

由于这个方法经常使用，且字段较多容易写错，更推荐把本地存储的方法抽取出来封装为几个函数使用：

```js
const setItem = (key, data) => {
	return uni.setStorageSync(key, data)
}
const getItem = (key) => {
	return uni.getStorageSync(key)
}
const removeItem = (key) => {
	return uni.removeStorageSync(key)
}
const clearItem = () => {
	return uni.clearStorageSync()
}
export {
	setItem,
	getItem,
	removeItem,
	clearItem
}
```

### 游客登录
本项目是一个上传项目，用户希望能够得知使用者对软件的使用情况以及记录他们的使用时间，因此需要获取到机器码（也就是使用者设备的唯一标识）。

对于这个需求，最开始开发时想到的是 `uni-app` 提供的 `uni.getDeviceInfo()` 方法，返回了 `deviceId` 设备id 。但是根据 [官方文档](https://uniapp.dcloud.net.cn/api/system/getDeviceInfo.html#getdeviceinfo) 描述在清除缓存后会改变，不符合要求，因此排除。

经过查询，发现原生 `plus` 有一个获取设备 uuid 的方法，返回的结果是一个16进制的字符串，符合要求。

```js
export const getDeviceId = () => {
	return new Promise((resolve, reject) => {
		let uuid = plus.device.getDeviceId();
		resolve(uuid)
	})
}
```

### 忘记密码
忘记密码与重置密码业务相近，原型相近，因此可以复用同一个页面，通过路径传参判断当前需要实现的是什么业务，通过 `uni.setNavigationBarTitle` 自定义初始化标题。
```js
onLoad((val) => {
  // 传递type，做修改密码业务，修改标题
	if (val.type) {
		type.value = val.type
		uni.setNavigationBarTitle({
			title: '修改密码'
		})
	}
})
```

### 微信授权登录

现在客户那边提出想要一个微信授权登录的功能，查看 `uniapp` 官方文档后发现相关方法，指路：[App端微信授权登录](https://uniapp.dcloud.net.cn/tutorial/app-oauth-weixin.html#%E5%BC%80%E9%80%9A) 。

首先需要前往 `manifest.json` 文件配置相关的 `appid` 、`appSecret` 、`UniversalLinks` 。步骤如下：

- `appid` ：微信开放平台申请应用的 `AppID` 值
- `appSecret` ：微信开放平台申请应用的AppSecret值
- `UniversalLinks` ：iOS平台通用链接，必须与微信开放平台配置的一致

![图片](https://native-res.dcloud.net.cn/images/uniapp/oauth/weixin-manifest.png)

#### 测试版

为了方便测试和调试， `appSecret` 可以直接在源码中设置，如下：

![源码配置](https://pic.imgdb.cn/item/64d49f9c1ddac507cc948536.jpg)

> 注意：
>
> 这么配置的appsecret参数，云端打包后会保存在apk/ipa中，存在参数泄露的风险！且不经业务服务器验证完成登录。最好只在测试环境使用。

配置完成之后通过 `uni.login` 方法，可以获取微信登录返回的 `openId` 与 `uniId` 。

```js
uni.login({
    provider: 'weixin',
    success: function (loginRes) {
        // 登录成功
        console.log(loginRes)
    },
    fail: function (err) {
        // 登录授权失败  
        // err.code是错误码
    }
});
```

打印的结果如下图所示：

![iPmfBQ.png](https://i.imgloc.com/2023/05/04/iPmfBQ.png)

授权登录成功后可以获取用户信息，通过 `uni.getUserInfo` 方法。该方法可以获取用户的头像、昵称、性别等字段。

```js
const wxLoginFn = () => {
	//其他勾选框校验
	if (!checkBox.value) {
		uni.showToast({
			title: '请阅读服务条款与隐私协议',
			icon: 'none'
		});
		return;
	}
    
	uni.showLoading()
	uni.login({
		provider: 'weixin',
		success: function(loginRes) {
			// 登录成功
			uni.getUserInfo({
				provider: 'weixin',
				success: async function(info) {
					uni.hideLoading()
					// 获取用户信息成功, info.authResult保存用户信息
                    console.log(info)
				}
			})
		},
		fail: function(err) {
			// 登录授权失败  
			// err.code是错误码
			uni.showToast({
				title: err,
				icon: 'none'
			})
			uni.hideLoading()
		}
	});
}
```

获取到的返回结果如下所示：

![iPmADC.png](https://i.imgloc.com/2023/05/04/iPmADC.png)

根据所拿到的数据对象与后端沟通，最后讨论出来的解决方案是把该 `openId` 连同手机号密码一起传递给后端接口即可。

**调试**

有两种方法可以调试：

- 打正式包，缺点是无法修改，测试麻烦，无法看到 `console.log` 的参数
- 自定义基座。根据 [文档](https://uniapp.dcloud.net.cn/tutorial/run/run-app.html#customplayground) 步骤操作，打完包后运行时运行自定义基座，即可在手机中真机运行，且能看到控制台打印。
