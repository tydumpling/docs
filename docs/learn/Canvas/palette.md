# 色彩提取

有一个功能点，用户鼠标悬浮在一个图片上，整个页面的背景颜色会变为该图片的背景色。

## 思路

想要实现这个功能，需要使用到 `canvas` 画布，将图片绘制到 `canvas` 上，然后获取 `canvas` 最多的像素值，这就是色彩提取。

但是有一个问题，有一些近似的颜色，比如白色和浅色，它们在 `canvas` 上显示的颜色是相近的，但是它们的像素值却不同。所以我们需要使用聚合算法，做色彩近似处理。有专门的第三方库负责实现这个功能 [colorthief](https://www.npmjs.com/package/colorthief) 。

ColorThief 是一个 JavaScript 库，它允许开发者从图像中提取色彩调色板。这个工具可以在浏览器环境中运行，也可以在 Node.js 环境下使用，使得动态地获取图片的主要颜色成为可能。ColorThief 采用了一种智能算法，以确保提取的颜色能够代表整个图像的主色调。

- 在 JavaScript 中使用它来获取图像的颜色：
    ```html
    <script src="https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.min.js"></script>
    ```
    ```javascript
    const colorThief = new ColorThief();
    const img = document.querySelector('img');
    if (img.complete) {
    const color = colorThief.getColor(img);
    console.log(color);
    } else {
    img.addEventListener('load', () => {
        const color = colorThief.getColor(img);
        console.log(color);
    });
    }
    ```

- 在 Node.js 中使用 ColorThief
    1. 安装 ColorThief：
        ```bash
        npm install colorthief
        ```
    2. 导入并使用 ColorThief：
        ```javascript
        const ColorThief = require('colorthief');
        const path = require('path');
        const imgPath = path.resolve(process.cwd(), 'path/to/your/image.jpg');
        ColorThief.getColor(imgPath)
        .then(color => {
            console.log(color);
        })
        .catch(err => {
            console.error(err);
        });
        ```

**ColorThief 主要方法**
|a|a|a|
|-|-|-|
|getColor(image, quality)|获取图像中的主要颜色|quality 是一个可选参数，取值范围是 1 到 10 之间的整数，默认为 10。数值越高，采样的像素数量越多，分析的结果也就越准确，但同时也会增加计算时间。返回值是一个包含 RGB 颜色值的数组，格式为 [r, g, b]|
|getPalette(image, colorCount, quality)|获取图像中的调色板，即一组主要的颜色|colorCount 是指定要获取的颜色数量，默认为 10。quality 也是可选参数，作用同 getColor 方法中的 quality。返回值是一个包含多个 RGB 颜色值数组的调色板，每个数组的格式为 [r, g, b]|

ColorThief 可以用于多种场景，比如主题自适应、视觉一致性和图像预览优化等。在使用时，确保图片已经加载完成再调用 getColor 方法，避免错误。对于大量图片处理，考虑使用异步操作以提升性能，并考虑色彩的可访问性，确保选择的颜色对所有用户都是可见的。

## 实现
下载好依赖后获取对应的图片路径，然后使用 `colorthief` 获取图片的颜色值。

```js
import ColorThief from 'colorthief';
const colorThief = new ColorThief();

const imgs = [];
for (let i = 0; i < 4; i++) {
    imgs.push('图片路径')
}

const hoverIndex = ref(-1);
const html = document.documentElement;
const handlerMouseEnter = async (img, i) => {
    hoverIndex.value = i;
    let colors = await colorThief.getColor(img, 3);
    console.log('colors', colors)
    colors = colors.map(e => `rgb(${e[0]}, ${e[1]}, ${e[2]})`);
    html.style.setProperty('--bg1', colors[0]);
    html.style.setProperty('--bg2', colors[1]);
    html.style.setProperty('--bg3', colors[2]);
}

const handlerMouseLeave = () => {
    hoverIndex.value = -1;
    html.style.setProperty('--bg1', '#fff');
    html.style.setProperty('--bg2', '#fff');
    html.style.setProperty('--bg3', '#fff');
}
```

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/info/canvas/palette" />