# 图片压缩

## 前置知识

### 第三方库

`file-saver` ，其 `saveAs` 方法用于获取并保存 `blob` 等格式的图片。

#### Canvas

使用 `drawImage` 绘制图片，语法如下：

```js
context.drawImage(image, dx, dy);
context.drawImage(image, dx, dy, dWidth, dHeight);
context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
```

参数解释：

| 参数            | 含义                                                         |
| --------------- | ------------------------------------------------------------ |
| image           | 要绘制的图像，可以是 `<img>` 元素、`<canvas>` 元素或 `Image` 对象。 |
| sx（可选）      | 图像剪裁的起始点 x 坐标。                                    |
| sy（可选）      | 图像剪裁的起始点 y 坐标。                                    |
| sWidth（可选）  | 图像剪裁的宽度。                                             |
| sHeight（可选） | 图像剪裁的高度。                                             |
| dx              | 绘制图像的起始点 x 坐标。                                    |
| dy              | 绘制图像的起始点 y 坐标。                                    |
| dWidth（可选）  | 绘制图像的宽度。                                             |
| dHeight（可选） | 绘制图像的高度。                                             |

下面是几个示例，展示了如何使用 `drawImage` 方法：

```js
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 例子1: 在画布上绘制一个图像
const image = new Image();
image.src = 'image.png';
image.onload = function() {
  ctx.drawImage(image, 0, 0);
};

// 例子2: 绘制图像的一部分，并指定目标宽度和高度
ctx.drawImage(image, 10, 10, 50, 50, 100, 100, 50, 50);

// 例子3: 使用剪裁区域绘制图像
ctx.drawImage(image, 20, 20, 100, 100, 0, 0, 50, 50);
```

> 注意
>
> 如果图像还没有加载完成，绘制操作可能不会生效，因此你需要使用 `onload` 事件或其他方式确保图像加载完成后再进行绘制。

`toBlob()` 是 `<canvas>` 元素上的一个方法，用于将当前画布内容转换为一个 Blob 对象， Blob 对象可以用于各种用途，例如上传到服务器或保存为本地文件。

通过 `canvas` 中的 `toBlob()` 转换为一个 Blob 对象，基本语法如下所示：

```js
canvas.toBlob(callback, type, quality);
```

参数解释：

| 参数            | 含义                                                         |
| --------------- | ------------------------------------------------------------ |
| callback        | 转换完成后的回调函数，用来接收生成的 Blob 对象作为参数。     |
| type（可选）    | 指定生成的 Blob 对象的 MIME 类型，默认为 `image/png`。       |
| quality（可选） | 指定生成的 Blob 对象的质量参数，仅针对 `image/jpeg` 和 `image/webp` 类型的图片有效，范围为 0 到 1，默认为 0.92。 |

以下是一个示例，展示了如何使用 `toBlob()` 方法将 `<canvas>` 元素的内容转换为 Blob 对象：

```js
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 绘制画布内容
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 100, 100);

// 将画布内容转换为 Blob 对象
canvas.toBlob(function(blob) {
  // 在回调函数中处理生成的 Blob 对象
  // 可以将它上传到服务器或进行其他操作
}, 'image/png');
```

在示例中，首先获取到 `<canvas>` 元素的上下文对象 `ctx`，接着使用绘图方法绘制画布内容（这里绘制一个红色的矩形）。然后，使用 `toBlob()` 方法将画布内容转换为 Blob 对象，并在回调函数中进行处理。

> 注意
>
> `toBlob()` 方法是HTML5新增的方法，不是所有的浏览器都支持它。在使用之前，最好检查一下浏览器的兼容性。

## 获取图片

首先先获取用户选择上传的图片，前端文件上传与相关操作方法复习可点击 [前端文件上传与相关操作](/learn/study/operate/功能操作与实现/前端文件上传与相关操作) 。代码如下所示：

```vue
<script setup>
    import { ref } from 'vue'
    
    const imgUrl = ref('')
    const onChangeFn = e => {
        // 获取用户上传的文件
        const file = e.target.files[0]
        
        // 预览文件
        let fr = new FileReader()
        fr.readAsDataURL(file)
        
        // 获取图片读完的图片结果（非同步，需要在onload获取）
        fr.onload = () => {
            imgUrl.value = fr.result
        }
    }
</script>

<template>
	<input type="file" @change="onChangeFn" />
	<img :src="imgUrl" />
</template>
```

## 压缩实现

保存运行后，选择图片可以成功渲染到页面上。现在利用 `canvas` 转 `blob` 或 `DataURL` 格式时实现图片压缩。步骤如下：

1. 创建一个 `canvas` 真实 DOM，并获取到图片 DOM 的宽高
2. 通过 `canvas` 的 `getContext('2d')` 方法法创建获取 2D  渲染上下文
3. 通过 `drawImage()` 在 `<canvas>` 元素上绘制图像
4. 使用 `toBlob()` 方法把 `canvas` DOM 节点转换为一个 Blob 对象
5. 把转换好的 blob 对象通过第三方库 `file-saver` 的 `saveAs` 方法转为图片格式
6. 做其他业务处理（如发请求）

```js
import { saveAs } from 'file-saver'

const onChangeFn = e => {
    const imgRef = ref(null) // img DOM 节点
    // ...
    fr.onload = () => {
        imgUrl.value = fr.result
        
        // 创建canvas真实dom元素
        let canvas = document.createElement('canvas')
        canvas.height = imgRef.value.height
        canvas.width = imgRef.value.width
            
        // 创建2d上下文
        let ctx = canvas.getContext('2d')
        setTimeout(() => {
            ctx.drawImage(imgRef.value, 0, 0, imgRef.value.width, imgRef.value.height)
            
            // 把canvas转为blob格式
            canvas.toBlob((blob) => {
                // saveAs(blob, 'img.jpeg')
                let form = new FormData()
                form.append('file', blob)
                axios.post('xxx', form)
            }, 'image/jpeg', 0.4)
        }, 1000)
    }
}
```


## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/info/canvas/compress" />