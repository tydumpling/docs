---
title 个人资料页
---

# 证件照裁剪

音果项目客户那边需要生成证书，证书生成个人证件照有宽高要求。因此 `APP` 这边需要对用户上传的图片做裁剪操作，上传成功后点击可预览，如下所示：

[![p9gyE26.png](https://s1.ax1x.com/2023/05/15/p9gyE26.png)](https://imgse.com/i/p9gyE26)

## chooseImage

`uniapp` 提供了图片选择的方法 `uni.chooseImage()` ，其中可设置选择的图片、压缩类型、拍摄或相册获取等等，官方文档指路：[chooseImage](https://uniapp.dcloud.net.cn/api/media/image.html#chooseimage)。

选择图片成功后触发成功回调函数，参数中可获取临时地址，用于调用接口上传图片。

根据官方文档描述，我们可以设置 `crop` 属性，做图像裁剪参数，设置后 `sizeType` 失效。

### crop

**参数说明**

| 参数名  | 类型    | 必填 | 说明                                                         | 平台差异说明 |
| :------ | :------ | :--- | :----------------------------------------------------------- | :----------- |
| quality | Number  | 否   | 取值范围为1-100，数值越小，质量越低（仅对jpg格式有效）。默认值为80。 |              |
| width   | Number  | 是   | 裁剪的宽度，单位为px，用于计算裁剪宽高比。                   |              |
| height  | Number  | 是   | 裁剪的高度，单位为px，用于计算裁剪宽高比。                   |              |
| resize  | Boolean | 否   | 是否将width和height作为裁剪保存图片真实的像素值。默认值为true。注：设置为false时在裁剪编辑界面显示图片的像素值，设置为true时不显示 |              |

本项目运用场景中证书图片的宽高固定为 123 * 169，因此设置相应的宽高后，`resize` 采用其默认值 `true` ，作为真实的像素值。

```js
// 上传图片
const uploadImgFn = async () => {
	uni.chooseImage({
		count: 1, //最大可选择数量，默认9
		sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		sourceType: ['album', 'camera'], //可以指定从相册选择还是手机拍照，默认二者都有
		crop: {
			quality: 100,
			width: 123,
			height: 169,
		},
		success: function(res) {
			const tempFilePaths = res.tempFilePaths;
			// 上传文件
			uni.uploadFile({
				url: 上传图片接口路径,
				filePath: tempFilePaths[0],
				name: 'file',
				header: {
					'X-Access-Token': uni.getStorageSync('token')
				},
				success: async (uploadFileRes) => {
				}
			});
		}
	});
}
```

### 实际效果

打包后在手机运行，最终效果如下所示：

[![p9g6WX8.jpg](https://s1.ax1x.com/2023/05/15/p9g6WX8.jpg)](https://imgse.com/i/p9g6WX8)

## 预览

预览模块实现起来就相对简单了，只需要根据官方文档调用其 `uni.previewImage()` 方法，以数组的方式传入相对应的图片路径和其索引（由于只有这一张图片所以是0）。

```js
// 预览图片
const previewImgFn = () => {
	uni.previewImage({
		current: 0,
		urls: [src.value]
	});
}
```

