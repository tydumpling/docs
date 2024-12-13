---
title 附件下载
---

# 附件下载

用户需要下载附件的功能，此时通过 `uni.downloadFile` 方法下载文件保存到临时地址，在其成功回调中调用 `openDocument` 方法下载附件。

`openDocument` 方法参数如下所示

| 属性     | 类型    | 默认值 | 必填 | 说明                                           | 最低版本                                                     |
| :------- | :------ | :----- | :--- | :--------------------------------------------- | :----------------------------------------------------------- |
| filePath | string  |        | 是   | 文件路径 (本地路径) ，可通过 downloadFile 获得 |                                                              |
| showMenu | boolean | false  | 否   | 是否显示右上角菜单                             | [2.11.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) |
| fileType | string  |        | 否   | 文件类型，指定文件类型打开文件                 | [1.4.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) |

微信小程序中文件保存到手机的方式比较特殊，我们需要把 `showMenu` 设为 `true` ，预览的时候显示右上角的菜单，通过另存为的方式保存文件。

示例代码：

```js
handleDownFn() {
	const fileType = 获取文件的类型
	uni.downloadFile({
		url: 文件路径（后端返回）,
		success: (data) => {
			if (data.statusCode === 200) {
				uni.showToast({
					icon: 'none',
					mask: true,
					title: '打开成功，请在预览处点击右上方的菜单另存为保存', //保存路径
					duration: 3000,
				});
				// 通过内置文档对象打开文档，便于另存为
				setTimeout(() => {
					wx.openDocument({
						filePath: data.tempFilePath,
						fileType,
						showMenu: true // 关键，这里开启预览页面的右上角菜单，才能另存为
					})
				}, 1000)
			}
		},
		fail: (err) => {
			console.log(err);
			uni.showToast({
				icon: 'none',
				mask: true,
				title: '失败请重新下载',
			});
		},
	})
},
```

## 遇到的问题

运行之后效果实现了，本来以为松了口气，但是测试说她的 IOS 系统手机无法打开预览，测试一下后发现报错，报错信息为：

```
openDocument:fail filetype not supported
```

解决方法：`openDocument` 方法设置 `fileType` 参数，传递其要显示的文件的类型（由于代码量不大，因此上方代码已包含该功能）。

添加之后，苹果系统的手机也可预览了。

> 拓展
>
> 最新版代码去掉了 `wx.saveFile` 方法。直接 `wx.downloadFile` 后 `wx.openDocument` 即可预览，忽略了保存文件方法。

但是还没结束，后台附件上传了格式为图片的附件时， IOS 系统的手机又打不开了。搜索了一下找到解决方法：

判断当前的文件的格式，如果是图片格式则通过 `previewImage` 方法打开图片预览，用户通过长按的方式保存图片；如果是其他文件格式，则继续使用`openDocument` 方法打开。

## 最终代码

```js
// 下载文件
handleDownFn() {
    const imgType = ['jpg', 'png', 'jpeg', 'webp', 'bmp']
	const fileType = 文件格式
    
	uni.downloadFile({
		url: 文件路径,
		success: (data) => {
			if (data.statusCode === 200) {
				uni.showToast({
					icon: 'none',
					mask: true,
					title: '打开成功，请在预览处点击右上方的菜单另存为保存', //保存路径
					duration: 3000,
				});
				//文件保存到本地
				// 通过内置文档对象打开文档，便于另存为
				setTimeout(() => {
                      // 判断是否为图片
					if (imgType.includes(fileType)) {
						uni.previewImage({
							showmenu: true,
							current: data.tempFilePath, // 当前显示图片的http链接
							urls: [data.tempFilePath]
						})
					} else {
						wx.openDocument({
							filePath: data.tempFilePath,
							fileType,
							showMenu: true // 关键，这里开启预览页面的右上角菜单，才能另存为
						})
					}
				}, 1000)
			}
		},
		fail: (err) => {
			console.log(err);
			uni.showToast({
				icon: 'none',
				mask: true,
				title: '失败请重新下载',
			});
		},
	})
}
```

