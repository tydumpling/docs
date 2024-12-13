# 页面截图

## 前置知识

通过 `ctx.drawImage(dom)` 绘制图片，再用 `ctx.toBlob()` 方法可以对以下 DOM 元素做截图处理：

- img
- canvas
- video

但是如果想对 `div` 、`document.body` 等元素做截图操作，上述方法将不再适用。需要用到 `html2canvas` 第三方库。

[html2canvas](https://www.npmjs.com/package/html2canvas) 是一个 JavaScript 库，用于将 HTML 元素转换为 `<canvas>` 元素。它可以捕捉指定的 HTML 元素（或整个页面）的视觉呈现，并生成一个跨域的 `canvas` 对象，可以用于在网页中展示、下载或上传。

以下是使用 `html2canvas` 的基本步骤：

1. 引入 `html2canvas` 库。你可以通过下载该库的源码文件，或者使用类似 npm 的包管理器进行安装。
2. 使用 `html2canvas()` 函数捕捉 HTML 元素，并生成 `<canvas>` 对象。这个函数接受一个参数，即要捕捉的 HTML 元素。你可以通过 CSS 选择器、DOM 节点或直接使用 `document.body` 来选择元素。
3. 在回调函数中处理生成的 `<canvas>` 对象，例如将其插入到页面中、保存为图片或上传到服务器等。

下面是一个示例，展示了如何使用 `html2canvas` 将整个页面转换为 `<canvas>` 元素：

```html
<!DOCTYPE html>
<html>
<head>
  <!-- 引入 html2canvas 库 -->
  <script src="html2canvas.js"></script>
</head>
<body>
  <div>Hello, world!</div>

  <script>
    // 使用 html2canvas 捕捉整个页面
    html2canvas(document.body).then(function(canvas) {
      // 在回调函数中处理生成的 canvas 对象
      document.body.appendChild(canvas);
    });
  </script>
</body>
</html>
```

在上面的示例中，我们首先在 `<head>` 部分引入了 `html2canvas` 库的脚本文件。然后，在 JavaScript 代码部分，使用 `html2canvas()` 函数捕捉整个页面，并在回调函数中将生成的 `<canvas>` 元素添加到页面中。

此外，`html2canvas` 还提供了一系列配置选项，可以用于调整转换的行为，如指定要忽略的元素、设置背景色、跨域处理等。你可以查阅官方文档以获取更多关于配置选项的详细信息。

> 注意
>
> `html2canvas` 在处理复杂页面和一些特殊元素时可能存在一些限制和局限性，例如不支持播放音视频、某些 CSS 属性可能无法正确应用等。在使用之前，最好先检查库的文档和示例，以了解其支持的功能和适用的场景。

## 截图实现

```vue
<script setup>
    import html2canvas from 'html2canvas'
    import { ref } from 'vue'
    import { saveAs } from 'file-saver'
    
    let div1 = ref(null)
    
    const saveScreen = () => {
        html2canvas(div1.value).then(res => {
            res.toBlob((blob) => {
                saveAs(blob, 'screen.png')
            })
        })
    }
</script>
```

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/info/canvas/screenshot" />