---
title 图片上传组件封装
---
# 图片上传组件封装
基于 `uView` 的 `u-upload` 组件进行二次封装，实现可复用的图片上传组件。
## 思路分析

- 用户选择图片后触发组件的 afterRead 事件
- 调用 [uni.uploadfile](https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile) 事件上传图片
- 上传成功保存到数组内，上传失败弹出提示
- 通过父组件传递的参数判断是否要显示删除按钮（一般用于详情和编辑功能复用的场景）
## 总体代码
```vue
<template>
	<view>
		<u-toast ref="uToast" />
		<u-upload :fileList="fileList" @afterRead="successFn" @delete="removeFn" :deletable="!disabled" name="1" multiple :maxCount="10"></u-upload>
	</view>
</template>

<script>
	import {
		BASE_URL,
		IMG_URL
	} from "../../config";
	export default {
		props: {
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				action: BASE_URL + "/public/save",
				fileList: [],
				dataList: [],
				headers: {
					"X-Access-Token": uni.getStorageSync('token'),
				},
			};
		},
		methods: {
			// 添加图片 + 成功回调
			async successFn(file) {
				let length = this.fileList.length
				this.fileList.push({
					url: file.file[0].url,
					status: 'uploading',
					message: '上传中'
				});
				const res = await this.uploadFilePromise(file.file[0].url)
				if (res.code === 200) {
					this.$set(this.fileList, length, {
						url: IMG_URL + res.data,
						status: 'success',
						message: '上传成功'
					})
					this.$set(this.dataList, length, {
						url: res.data,
						status: 'success',
						message: '上传成功'
					})
				}
				
				this.$emit('uploadSuccessFn', this.dataList)
			},
			// 上传图片
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: this.action,
						filePath: url,
						name: 'file',
						header: {
							"X-Access-Token": uni.getStorageSync('token'),
						},
						success: (res) => {
							setTimeout(() => {
								resolve(JSON.parse(res.data))
							}, 1000)
						},
						fail: (err) => {
							setTimeout(() => {
								reject(err)
							}, 1000)
						}
					});
				})
			},
			// 删除成功回调
			removeFn(event) {
				this.fileList.splice(event.index, 1)
				this.dataList.splice(event.index, 1)
				this.$emit('uploadSuccessFn', this.dataList)
			},
		},
	};
</script>
```
## 知识拓展
在小程序和app中，无法通过以下方式收集 `formData `形式的数据：
```javascript
let formData = new FormData()
formData.append('file', file.url)
console.log(formData.get('file'))
```
如果使用，会报错 `FormData is not defined.` 。此时可以通过 `uView` 提供的 `upload` 组件配合 `uni.uploadFile` 方法获取 `formData` 形式的数据。
参数配置如下：

1. `url`：接口地址
2. `filePath`：获取的文件
3. `name`：后端要求的参数名称
4. `formData`：后端还要其他的参数，写在这里
5. `header`：请求头，一般设置 `token` 。

总体代码如下：
```javascript
uni.uploadFile({
  url: 'http://192.168.2.21:7001/upload', // 这里改为自己的接口地址
  filePath: url, // 获取的文件
  name: 'file', // 后端要求的参数名称
  formData: { // 如果后端还要其他的参数，写在这里
    user: 'test'
  },
  // 成功的回调
  success: (res) => {
    setTimeout(() => {
      resolve(res.data.data)
    }, 1000)
  }
})
```
