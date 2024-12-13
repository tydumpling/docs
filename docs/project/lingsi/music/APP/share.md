---
title 分享页
---
# 分享

使用者点击分享按钮后会跳到分享页，生成落地海报，点击保存按钮可将海报保存到相册中。思路整理：

- 由于要能够下载整张落地页海报到相册，因此需用到画布组件 [canvas](https://uniapp.dcloud.net.cn/component/canvas.html#canvas) 。
- 画布内容生成用到 [uni.canvasToTempFilePath](https://uniapp.dcloud.net.cn/api/canvas/canvasToTempFilePath.html#canvastotempfilepath) 方法。
- 生成的图片通过 [uni.saveImageToPhotosAlbum](https://uniapp.dcloud.net.cn/api/media/image.html#saveimagetophotosalbum) 保存到相册。

## 画布设置
根据官方文档，在使用画布标签时需要为其添加一个 id 属性，该id必须唯一，不可重复。
```vue
<canvas canvas-id="drawing" id="drawing"></canvas>
```

### 获取设备信息
由于是整张落地页海报，因此获取用户设备大小是第一步，根据该大小来调整图片宽高。
```javascript
const getSystemInfo = () => {
  return new Promise((req, rej) => {
    uni.getSystemInfo({
      success: function(res) {
        req(res)
      }
    });
  })
}
```

### 获取图片信息
落地页的背景图片在本地文件夹中，绘制画布时需要等待其绘制背景图片，可以通过 [uni.getImageInfo](https://uniapp.dcloud.net.cn/api/media/image.html#getimageinfo) 获取图片信息，获取成功后再绘制画布，返回值如下所示。
```javascript
{
  errMsg: "getImageInfo:ok",
    height: 1688,
    path: "./static/img/smallIcon/share.png",
    width: 780
}
```
可以看到图片获取成功，可以进行下一步的绘制了。
```javascript
const getImageInfo = (image) => {
  return new Promise((req, rej) => {
    uni.getImageInfo({
      src: image,
      success: function(res) {
        req(res)
      },
    });
  })
}
```

### 渲染上下文
脚本需要找到渲染上下文，然后在它的上面绘制。<br />`<canvas>` 元素创造了一个固定大小的画布，它公开了一个或多个渲染上下文，其可以用来绘制和处理要展示的内容。具体参数如下所示。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| canvasId | String | 画布表示，传入定义在 <canvas/> 的 canvas-id或id（支付宝小程序是id、其他平台是canvas-id） |
| componentInstance | Object | 自定义组件实例 this ，表示在这个自定义组件下查找拥有 canvas-id 的 <canvas/> ，如果省略，则不在任何自定义组件内查找 |

```javascript
var ctx = uni.createCanvasContext('drawing', this);
// 1.填充背景色，白色
ctx.setFillStyle('#fafafa'); //默认白色
```
注意：2D 上下文的坐标开始于 `<canvas>` 元素的左上角，原点坐标是(0,0)

### 绘制矩形填充模块
`fillRect()` 方法绘制一个填充了内容的矩形，这个矩形的开始点（左上点）在 (x, y) ，它的宽度和高度分别由 `width` 和 `height` 确定，填充样式由当前的 `fillStyle` 决定。
```javascript
ctx.fillRect(0, 0, canvasW.value, canvasH.value) // fillRect(x起点,y起点,宽度，高度)
```

### 绘制图片
使用 `drawImage()` 方法把一幅图像绘制到画布上。

| **语法** | **说明** | **示例代码** |
| --- | --- | --- |
| ctx.drawImage(image, dx, dy); | 绘制起点的x和y坐标 | ctx.drawImage(image, 10, 10); |
| ctx.drawImage(image, dx, dy, dWidth, dHeight); | 绘制目标的宽、高 | ctx.drawImage(image, 50, 10, 20, 30); // 表示绘制出来的图像大小会变成 20×30 像素 |
| ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight); |  |  |

**全部参数说明：**

| **参数** | **说明** |
| --- | --- |
| image | 要绘制的图像 |
| sx | 源图像的 x 坐标 |
| sy | 源图像的 y 坐标 |
| sWidth | 源图像的宽度 |
| sHeight | 源图像的高度 |
| dx | 目标图像的 x 坐标 |
| dy | 目标图像的 y 坐标 |
| dWidth | 目标图像的宽度 |
| dHeight | 目标图像的高度 |

```javascript
ctx.drawImage(goodsImgUrl, 37, 200, canvasW.value - 75, 400) // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度)
ctx.drawImage(codeImg.value, canvasW.value - canvasW.value / 2 - 70, 370, 140, 140) // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度)
```

### 绘制文字
绘制文本主要有两个方法： fillText() 绘制文本。<br />可接收 4 个参数：要绘制的文本字符串、x 坐标、y 坐标和可选的最大像素宽度。如果第四个参数提供了最大宽度，文本会进行缩放以适应最大宽度。

| **属性** | **说明** |
| --- | --- |
| ctx.setFillStyle | 设置文本样式 |
| ctx.setFontSize | 设置文本字体大小、字体 |
| ctx.fillText | 设置文本和位置 |

示例：
```javascript
ctx.setFontSize(20) // 字号
ctx.setFillStyle('#f1654d') // 颜色
ctx.fillText(code, canvasW.value - canvasW.value / 2 - 57, 330) // （文字，x坐标，y坐标）
```
注意：如果要绘制图片和文字，则要把文字绘制的方法写在绘制图片之后。

### 画布绘制内容
```javascript
ctx.draw(true, (ret) => {
});
```

### 代码展示
```vue
<script setup>
	const init = async () => {
		const res = await getUserShareCode(code)
		if (res.code === 200) {
			codeImg.value = res.result

			// 获取设备信息，主要获取宽度，赋值给canvasW 也就是宽度：100%
			SystemInfo.value = await getSystemInfo()

			// 获取商品主图，二维码信息，APP端会返回图片的本地路径（H5端只能返回原路径）
			let goodsImgUrl = '/static/img/smallIcon/share.png' // 主图本地路径，也可以用网络地址
			goodsImg.value = await getImageInfo(goodsImgUrl);

			canvasW.value = SystemInfo.value.windowWidth; // 画布宽度
			canvasH.value = SystemInfo.value.windowHeight;  // 画布高度
			heightVal.value = canvasH.value * 0.45

			// 如果主图，设备信息都获取成功，开始绘制海报，这里需要用setTimeout延时绘制，否则可能会出现图片不显示。
			if (goodsImg.value.errMsg == 'getImageInfo:ok' && SystemInfo.value.errMsg == 'getSystemInfo:ok') {
				uni.showToast({
					icon: 'loading',
					mask: true,
					duration: 10000,
					title: '海报绘制中',
				});
				setTimeout(() => {
					var ctx = uni.createCanvasContext('drawing', this);
					// 1.填充背景色，白色
					ctx.setFillStyle('#fafafa'); // 默认白色
					ctx.fillRect(0, 0, canvasW.value, canvasH.value) // fillRect(x,y,宽度，高度)

					// 2.绘制主图，二维码
					ctx.drawImage(goodsImgUrl, 0, 0, canvasW.value, canvasH.value) // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度)
					ctx.drawImage(codeImg.value, canvasW.value - canvasW.value / 2 - canvasW.value / 4, heightVal.value - 20, canvasW.value / 2 , canvasW.value / 2) // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度)

					// 3、邀请码
					ctx.setFontSize(25) // 字号
					ctx.setFillStyle('#f1654d') // 颜色
					ctx.fillText(code, canvasW.value - canvasW.value / 2 - 75, canvasH.value * 0.4 - 10) // （文字，x，y）

					// draw方法 把以上内容画到 canvas 中
					ctx.draw(true, (ret) => {
						isShow.value = true // 显示按钮-保存图片到相册
						uni.showToast({
							icon: 'success',
							mask: true,
							title: '绘制完成',
						});

            // 生成图片代码
            
					});
				}, 1500)
			} else {
				console.log('读取图片信息失败')
			}
		}
	}

	// 获取图片信息
	const getImageInfo = (image) => {
		return new Promise((req, rej) => {
			uni.getImageInfo({
				src: image,
				success: function(res) {
					req(res)
				},
			});
		})
	}

	// 获取设备信息
	const getSystemInfo = () => {
		return new Promise((req, rej) => {
			uni.getSystemInfo({
				success: function(res) {
					req(res)
				}
			});
		})
	}
</script>
```

## 生成图片
`uni.canvasToTempFilePath(object, component)`<br />把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。在自定义组件下，第二个参数传入自定义组件实例，以操作组件内 `<canvas>` 组件。<br />**object参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| x | Number | 否 | 画布x轴起点（默认0） |
| y | Number | 否 | 画布y轴起点（默认0） |
| width | Number | 否 | 画布宽度（默认为canvas宽度-x） |
| height | Number | 否 | 画布高度（默认为canvas高度-y） |
| destWidth | Number | 否 | 输出图片宽度（默认为 width * 屏幕像素密度） |
| destHeight | Number | 否 | 输出图片高度（默认为 height * 屏幕像素密度） |
| canvasId | String | 是 | 画布标识，传入 <canvas/> 的 canvas-id（支付宝小程序是id、其他平台是canvas-id） |
| fileType | String | 否 | 目标文件的类型，只支持 'jpg' 或 'png'。默认为 'png' |
| quality | Number | 否 | 图片的质量，取值范围为 (0, 1]，不在范围内时当作1.0处理 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

```javascript
uni.canvasToTempFilePath({ // 保存canvas为图片
  canvasId: 'drawing',
  quality: 1,
  complete: function(res) {
    // 在H5平台下，tempFilePath 为 base64, // 图片提示跨域 H5保存base64失败，APP端正常输出临时路径
    console.log(res)
    uni.setStorageSync('filePath', res.tempFilePath) //保存临时文件路径到缓存
  },
})
```

## 保存相册
`uni.saveImageToPhotosAlbum(OBJECT)` 保存图片到系统相册。

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| filePath | String | 是 | 图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

```javascript
const saveImage = () => {
  let filePath = uni.getStorageSync('filePath') //从缓存中读取临时文件路径			
  wx.saveImageToPhotosAlbum({
    filePath: filePath,
    success(res) {
      uni.showToast({
        icon: 'success',
        mask: true,
        title: '保存到相册了',
      });
    },
    fail(res) {
      console.log(res.errMsg)
    }
  })
}
```

### 注意事项

在项目多端开发发布到 H5 上时，测试和我说点击按钮保存无效果。本地运行后发现控制台报以下错误：

```
saveImageToPhotosAlbum:fail method 'uni.saveImageToPhotosAlbum' not supported
```

看到这个错误提示第一反应是该 API 不支持 H5 端，直奔文档，果真如此：

**平台差异说明**

| App  |  H5  | 微信小程序 | 支付宝小程序 | 百度小程序 | 抖音小程序、飞书小程序 | QQ小程序 | 快手小程序 | 京东小程序 |
| :--: | :--: | :--------: | :----------: | :--------: | :--------------------: | :------: | :--------: | :--------: |
|  √   |  x   |     √      |      √       |     √      |           √            |    √     |     √      |     √      |

解决方法也很简单，提供用户点击图片预览的功能，长按保存即可。