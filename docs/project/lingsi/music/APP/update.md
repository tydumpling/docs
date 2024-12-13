---
title 更新
---

# 更新

现有一个需求：客户想要点击 “检查更新” 按钮后判断当前是否是最新版本，不是最新版本则自动更新下载最新版本的 `APP` ，无需去到外部下载。

## 前置知识

 `plus` 开头的方法是 `APP` 原生功能，是 `5+Runtime` 的内部对象，在普通浏览器运行plus api时控制台必然会输出 `puls is not defined` 错误提示。

详细的 `runtime` 方法与属性可查阅官方文档 [runtime](https://www.html5plus.org/doc/zh_cn/runtime.html) 。

### plus.runtime.getProperty

拿到的是当前应用的版本，如果热更新过就是热更新的版本。其接收两个参数：

- 参数一：应用的 `Appid` （必传）。
- 参数二：获得应用信息成功回调函数（必传）。

示例代码：

```js
const getAppInfo = () => {
	plus.runtime.getProperty( plus.runtime.appid, function ( wgtinfo ) {
		//appid属性
		var wgtStr = "appid:"+wgtinfo.appid;
		//version属性
		wgtStr += "<br/>version:"+wgtinfo.version;
		//name属性
		wgtStr += "<br/>name:"+wgtinfo.name;
		//description属性
		wgtStr += "<br/>description:"+wgtinfo.description;
		//author属性
		wgtStr += "<br/>author:"+wgtinfo.author;
		//email属性
		wgtStr += "<br/>email:"+wgtinfo.email;
		//features 属性
		wgtStr += "<br/>features:"+wgtinfo.features;
		console.log( wgtStr );
	} );
}
```

回调函数的参数中 `version` 属性是我们需要的版本号；`name` 属性是我们需要的应用名称。

> 注意：
>
> `plus.runtime.version` 也能获取版本号，二者不同之处在于 `plus.runtime.version` 获取到的是 `manifest.json` 中设置的 `apk/ipa` 版本号，整包更新的版本。

### install

安装应用的方法，其接收四个参数：

- 参数一：要安装的文件路径，支持应用资源安装包（wgt）、应用资源差量升级包（wgtu）、系统程序包（apk）（必传）。
- 参数二：应用安装设置的参数（选传）。
- 参数三：正确安装后的回调（选传）。
- 参数四：安装失败的回调（选传）。

```js
plus.runtime.install(
	//安装软件
	软件的下载地址, {
		force: true
	},
    // 成功回调
	function(res) {
		plus.runtime.restart();
	}
);
```

### restart

重启当前的应用。

```js
plus.runtime.restart();
```

应用热重启，重新启动进入首页。

### quit

退出应用。

```js
plus.runtime.quit();
```

## 实现思路

- 前端可以获取到当前用户的版本号信息，通过调用接口获取服务器最新的版本号信息
- 对比二者的版本号，如果当前版本低于最新版本，则根据后端返回的下载地址下载安装包
- 安装完后热重启应用

## 代码实现

```js
// 检测版本更新
const checkUpdates = async () => {
	// #ifdef APP-PLUS
	//调用接口获取后台版本信息，检查是否需要更新
	const versionInfo = await getAppInfo();
	console.log('获取后台版本信息', versionInfo);
	// 待更新版本
	const currentVersion = versionInfo.result.versionName;
	console.log('后台需要更新版本', currentVersion);
	// 更新地址
	let androidUrl = 后端返回的地址;
	
	//  比较版本是否不同 当前版本：plus.runtime.version
	const localVersion = version.value.split('.');
	const current = currentVersion.split('.');
	// 默认是同一个版本，不需要更新
	let flag = false;
	current.forEach((item, i) => {
		if (parseInt(item) > parseInt(localVersion[i])) {
			// 检测到版本不同，需要更新
			flag = true;
		}
	});

	if (flag) {
		uni.showModal({
			// 更新提醒
			title: '发现新版本，是否更新',
			content: '待更新版本号：' + currentVersion,
			// showCancel: showCancel,
			success: res => {
				if (res.confirm) {
					doUpData(androidUrl);
				} else if (res.cancel) {
					// 不更新强制退出app
					// if (showCancel) {
					// 	console.log('不更新强制退出app');
					// 	plus.runtime.quit();
					// }
				}
			}
		});
	} else {
		uni.showToast({
			title: '当前已是最新版本',
			icon: 'none'
		})
	}
	// #endif
}
const doUpData = (Url) => {
	uni.showLoading({
		title: '更新中……'
	});
	const downloadTask = uni.downloadFile({
		//执行下载
		url: Url, //下载地址
		timeout: 1000 * 30, //30秒超时时间
		success: downloadResult => {
			//下载成功
			console.log(downloadResult);
			uni.hideLoading();
			if (downloadResult.statusCode == 200) {
				plus.runtime.install(
					//安装软件
					downloadResult.tempFilePath, {
						force: true
					},
					function(res) {
						plus.runtime.restart();
					}
				);
			}
		},
		complete: com => {
			uni.hideLoading();
		}
	});
}
```

