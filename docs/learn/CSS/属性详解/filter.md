# filter 实现滤镜

## 前置知识

**`filter`** 属性将模糊或颜色偏移等图形效果应用于元素自身。滤镜通常用于调整图像、背景和边框的渲染。

下面简单罗列一下它所有的属性语法：

```css
/* <filter-function> 值 */
filter: blur(5px);
filter: brightness(0.4);
filter: contrast(200%);
filter: drop-shadow(16px 16px 20px blue);
filter: grayscale(50%);
filter: hue-rotate(90deg);
filter: invert(75%);
filter: opacity(25%);
filter: saturate(30%);
filter: sepia(60%);

/* URL */
filter: url("filters.svg#filter-id");

/* 多个滤镜 */
filter: contrast(175%) brightness(3%);
filter: drop-shadow(3px 3px red) sepia(100%) drop-shadow(-3px -3px blue);

/* 不使用滤镜 */
filter: none;

/* 全局值 */
filter: inherit;
filter: initial;
filter: revert;
filter: revert-layer;
filter: unset;
```

## 实现

下面针对部分函数方法做详细说明。

### drop-shadow

使用 `<shadow>` 参数沿图像的轮廓生成阴影效果。阴影语法类似于 `<box-shadow>`（在 [CSS 背景和边框模块](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_backgrounds_and_borders)中定义），但不允许使用 `inset` 关键字以及 `spread` 参数。与所有 `filter` 属性值一样，任何在 `drop-shadow()` 后的滤镜同样会应用在阴影上。

使用场景为在 `box-shadow` 只能给整个盒子添加盒子阴影，但效果只是想给盒子内的透明图片添加阴影时使用。效果如下：

代码如下：

```css
filter: drop-shadow(10px 10px 10px orange);
```

其原理是把原来的像素点颜色通过算法来计算，计算完后返回新的像素点。

### blur

将高斯模糊应用于输入图像。括号内输入像素单位的值，该值表示需要做模糊处理时的参考半径范围，值越大处理的结果越模糊。

代码如下所示：

```css
filter: blur(5px);
```

### hue-rotate

应用色相旋转。`<angle>` 值设定图像会被调整的色环角度值。值为 `0deg`，则图像无变化。

代码示例：

```css
filter: hue-rotate(90deg);
```

### contrast

调整输入图像的对比度。值是 `0%` 将使图像变灰（即对比度越小）；值是 `100%`，则无影响；若值超过 `100%` 将增强对比度。

代码语法示例：

```css
filter: contrast(200%);
```

### grayscale

将图像转换为灰度图。值为 `100%` 则完全转为灰度图像，若为初始值 `0%` 则图像无变化。值在 `0%` 到 `100%` 之间，则是该效果的线性乘数。

在特殊纪念日里网站变灰就是用了这个属性，代码如下：

```css
filter: grayscale(1);
```

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/detail/css/filter" />