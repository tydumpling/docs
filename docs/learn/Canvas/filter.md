# 滤镜

## 前置知识

### getImageData

`getImageData` 是 `CanvasRenderingContext2D` 对象上的一个方法，用于获取指定矩形区域的像素数据。该方法返回一个 `ImageData` 对象，其中包含了矩形区域内每个像素的 RGBA 值。

以下是 `getImageData` 方法的基本语法：

```js
const imageData = context.getImageData(x, y, width, height);
```

参数解释：

| 参数   | 含义                      |
| ------ | ------------------------- |
| x      | 矩形区域的起始点 x 坐标。 |
| y      | 矩形区域的起始点 y 坐标。 |
| width  | 矩形区域的宽度。          |
| height | 矩形区域的高度。          |

以下是一个示例，展示了如何使用 `getImageData` 方法获取指定区域的像素数据：

```js
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 获取画布上 (0, 0) 到 (100, 100) 的矩形区域的像素数据
const imageData = ctx.getImageData(0, 0, 100, 100);

// 访问像素数据
for (let i = 0; i < imageData.data.length; i += 4) {
  const red = imageData.data[i];
  const green = imageData.data[i + 1];
  const blue = imageData.data[i + 2];
  const alpha = imageData.data[i + 3];

  // 对获取的像素数据进行处理（例如修改颜色值）
  // ...
}
```

在示例中，首先获取到 `<canvas>` 元素的上下文对象 `ctx`。然后，使用 `getImageData` 方法获取画布上指定区域的像素数据，并将结果保存到 `imageData` 对象中。通过访问 `imageData.data`，可以逐个像素地访问像素数组中的 RGBA 值。

> 注意
>
> 1. `getImageData` 方法返回的 `ImageData` 对象是一个包含了具体像素数据的跨域对象。为了避免遇到跨域问题，画布和图像必须来自同一个域或通过 CORS（Cross-Origin Resource Sharing，跨域资源共享）进行设置。
> 2. 由于 `getImageData` 返回的像素数据相当庞大，大量使用该方法可能会对性能产生影响。因此，在使用 `getImageData` 时，最好尽可能限制使用范围和像素数量，以免影响性能。

#### clearRect

`clearRect` 是一个用于在 HTML5 的 `<canvas>` 元素上清除矩形区域的方法。它可以用来擦除画布上的内容，以便进行新的绘制。

`clearRect` 方法接受四个参数：`x`，`y`，`width` 和 `height`。这些参数定义了要清除的矩形区域的位置和尺寸。其中，`(x, y)` 是矩形区域左上角的坐标，`width` 是矩形的宽度，`height` 是矩形的高度。

下面是一个示例，演示了如何使用 `clearRect` 清除一个矩形区域：

```js
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// 绘制一个蓝色的矩形
ctx.fillStyle = "blue";
ctx.fillRect(0, 0, 200, 200);

// 清除矩形的一部分
ctx.clearRect(50, 50, 100, 100);
```

在这个例子中，首先通过 `fillRect` 方法绘制一个蓝色的矩形，然后使用 `clearRect` 方法清除了矩形区域的中间部分，留下四个蓝色的角落。

> 注意
>
> `clearRect` 方法只适用于 `<canvas>` 元素，如果尝试在其他类型的元素上调用该方法，将会产生错误。

#### putImageData

`putImageData` 是 HTML5 `<canvas>` 元素的一个方法，用于将像素数据放回画布中。

该方法接受两个参数：`imageData` 和 `x`、`y`。其中，`imageData` 是一个 ImageData 对象，它包含了要在画布上绘制的像素数据；`x` 和 `y` 是绘制的起始位置。

下面是一个使用示例：

```js
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// 创建一个 ImageData 对象
const imageData = ctx.createImageData(200, 200);

// 填充 imageData 对象的像素数据
const data = imageData.data;
for (let i = 0; i < data.length; i += 4) {
  // 设置像素的红、绿、蓝、透明度通道的值
  data[i] = 255;     // 红色通道
  data[i + 1] = 0;   // 绿色通道
  data[i + 2] = 0;   // 蓝色通道
  data[i + 3] = 255; // 不透明度通道
}

// 在指定位置绘制像素数据
ctx.putImageData(imageData, 50, 50);
```

在上面的示例中，我们首先通过 `ctx.createImageData()` 创建了一个指定宽度和高度的 ImageData 对象。然后，通过访问 `imageData.data` 数组来设置每个像素的值。在这个例子中，我们将每个像素设置为纯红色。

最后，我们使用 `putImageData` 方法将像素数据绘制到画布上的指定位置。在这个例子中，我们将像素数据放置在画布上的位置 `(50, 50)` 处。

> 注意
>
> 像素数据必须与画布的大小相匹配，否则绘制将会产生不可预测的结果。

## 获取图片

先获取用户选择上传的图片：

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
    
    const addFn = () => {}
</script>

<template>
    <div ref="filterRef">
        <input type="file" @change="onChangeFn" />
        <img :src="imgUrl" ref="imgRef" />
        <button @click="addFn">
            点我添加滤镜
        </button>
    </div>
</template>
```

## 滤镜实现

实现滤镜效果本质上是通过 `getImageData()` 方法获取到图片每一个像素点的 RGBA 值，通过修改其像素值实现滤镜。具体步骤如下：

1. 创建一个 `canvas` 画布，绘制图片
2. 通过 `getImageData()` 方法获取到图片的像素数据，在其 `data` 属性是一个数组，能获取到该图片的像素值
3. 通过循环遍历的方法，修改指定索引的像素值
4. 通过 `clearRect()` 方法把画布图片清空
5. 通过 `putImageData()` 方法把修改了像素点的图片添加进去

```js
// ....
const filterRef = ref(null)
const addFn = () => {
    const filterCanvas = document.createElement('canvas')
    filterCanvas.height = imgRef.value.height
    filterCanvas.width = imgRef.value.width
    
    let ctx = filterCanvas.getContext('2d')
    filterRef.value.appendChild(filterCanvas)
    ctx.drawImage(imgRef.value, 0, 0, imgRef.value.width, imgRef.value.height)
    
    // 获取像素值
    let imageData = ctx.getImageData(0, 0, imgRef.value.width, imgRef.value.height)
    let _len = imageData.data.length
    for(let i = 0; i < _len; i++) {
        if(i % 2 === 0) {
            imageData.data[i] = 0
        }
    }
    
    // 清空 canvas
    ctx.clearRect(0, 0, imgRef.value.width, imgRef.value.height)
    
    // 重新绘制像素
    ctx.putImageData(imageData, 0, 0)
}
```

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/info/canvas/filter" />