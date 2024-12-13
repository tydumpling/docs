# clip-path 实现裁剪

## 前置知识

**`clip-path`** [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性使用裁剪方式创建元素的可显示区域。区域内的部分显示，区域外的隐藏。

语法：

```css
/* Keyword values */
clip-path: none;

/* <clip-source> values */
clip-path: url(resources.svg#c1);

/* <geometry-box> values */
clip-path: margin-box;
clip-path: border-box;
clip-path: padding-box;
clip-path: content-box;
clip-path: fill-box;
clip-path: stroke-box;
clip-path: view-box;

/* <basic-shape> values */
clip-path: inset(100px 50px);
clip-path: circle(50px at 0 100px);
clip-path: ellipse(50px 60px at 0 10% 20%);
clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
clip-path: path(
  "M0.5,1 C0.5,1,0,0.7,0,0.3 A0.25,0.25,1,1,1,0.5,0.3 A0.25,0.25,1,1,1,1,0.3 C1,0.7,0.5,1,0.5,1 Z"
);

/* Box and shape values combined */
clip-path: padding-box circle(50px at 0 100px);

/* Global values */
clip-path: inherit;
clip-path: initial;
clip-path: revert;
clip-path: revert-layer;
clip-path: unset;
```

`clip-path` 属性指定为下面列出的值的一个或多个值的组合。

取值：

- `<clip-source>`

  用 [`url()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/url) 引用 [SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG) 的 [``](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/clipPath) 元素

- `<basic-shape>`

  一种形状，其大小和位置由 `<geometry-box>` 的值定义。如果没有指定 `<geometry-box>`，则将使用 `border-box` 用为参考框。取值可为以下值中的任意一个：

  - `inset()` 定义一个 inset 矩形。
  - `circle()` 定义一个圆形（使用一个半径和一个圆心位置）。
  - `ellipse()`  定义一个椭圆（使用两个半径和一个圆心位置）。
  - `polygon()`  定义一个多边形（使用一个 SVG 填充规则和一组顶点）。
  - `path()`  定义一个任意形状（使用一个可选的 SVG 填充规则和一个 SVG 路径定义）。

- `<geometry-box>`

  如果同 `<basic-shape>` 一起声明，它将为基本形状提供相应的参考框盒。通过自定义，它将利用确定的盒子边缘包括任何形状边角（比如说，被 [`border-radius`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius) 定义的剪切路径）。几何框盒可以有以下的值中的一个：

  - `margin-box` 使用 [margin box](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_shapes/From_box_values#margin-box) 作为引用框。
  - `border-box` 使用 [border box](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_shapes/From_box_values#border-box) 作为引用框。
  - `padding-box` 使用 [padding box](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_shapes/From_box_values#padding-box) 作为引用框。
  - `content-box` 使用 [content box](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_shapes/From_box_values#content-box) 作为引用框。
  - `fill-box` 利用对象边界框（object bounding box）作为引用框。
  - `stroke-box` 使用笔触边界框（stroke bounding box）作为引用框。
  - `view-box` 使用最近的 SVG 视口（viewport）作为引用框。如果 `viewBox` 属性被指定来为元素创建 SVG 视口，引用框将会被定位在坐标系的原点，引用框位于由 `viewBox` 属性建立的坐标系的原点，引用框的尺寸用来设置 `viewBox` 属性的宽高值。

- [`none`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path#none)

  不创建剪切路径。

> **备注：** CSS 计算值不为 **`none`** 时，会创建新的[层叠上下文](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context)，就像 CSS [`opacity`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/opacity) 的值不为 `1` 时那样。

形式定义:

| [初始值](https://developer.mozilla.org/zh-CN/docs/Web/CSS/initial_value) | `none`                                                       |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| 适用元素                                                     | all elements; In SVG, it applies to container elements excluding the [`defs`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/defs) element and all graphics elements |
| [是否是继承属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Inheritance) | 否                                                           |
| Percentages                                                  | refer to reference box when specified, otherwise border-box  |
| [计算值](https://developer.mozilla.org/zh-CN/docs/Web/CSS/computed_value) | as specified, but with [`url`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/url) values made absolute |
| Animation type                                               | yes, as specified for [`basic-shape`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/basic-shape), otherwise no |

形式语法:

```css
clip-path = 
  <clip-source>                        |
  [ <basic-shape> || <geometry-box> ]  |
  none                                 

<clip-source> = 
  <url>  

<geometry-box> = 
  <shape-box>  |
  fill-box     |
  stroke-box   |
  view-box     

<url> = 
  url( <string> <url-modifier>* )  |
  src( <string> <url-modifier>* )  

<shape-box> = 
  <box>       |
  margin-box  

<box> = 
  border-box   |
  padding-box  |
  content-box  
```

## 实现

1. 相框显示，鼠标移入后显示全部，移出则裁剪为四方形。这里用到的是多边形裁剪 `polygon` ，代码如下：

   ```html
   <style>
       .container {
           width: 400px;
           height: 400px;
           margin: 0 auto;
           background: #14100f;
       }
       
       .box {
           width: 100%;
           height: 100%;
           display: block;
           clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
           transition: .5s;
       }
       
       .container:hover .box {
           clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 0% 0%);
       }
   </style>
   ```

   实际上就是把四个点的横纵坐标移动一下。这里推荐一下多边形 `clip-path` 的在线样式裁剪网址：[CSS3剪贴路径（Clip-path）在线生成器工具](http://tools.jb51.net/code/css3path) 。

2. 眨眼效果，该效果主要实现的原理是动画搭配椭圆裁剪 `ellipse` 实现。设置动画，在不同的关键帧定义不同的椭圆半径，代码如下：

   ```css
   @keyframes wink {
       15% {
           clip-path: ellipse(50% 1% at 50% 50%);
       }
       30% {
           clip-path: ellipse(50% 19% at 50% 50%);
       }
       45% {
           clip-path: ellipse(50% 1% at 50% 50%);
       }
       70% {
           clip-path: ellipse(50% 40% at 50% 50%);
       }
   }
   ```

3. 文字下落，该效果的本质是通过矩形的裁剪实现，原理如下：

   一个矩形动画开始时其上方裁剪 100% 的区域，此时它是一条线，无法显示内容；然后动画结束时把上方裁剪的区域恢复为 0% ，这样文字就能从下往上显示。

   想要实现从下往上只需要给起始动画设置 Y 轴的偏移量为 100% 即可。代码如下：

   ```css
   @keyframes fall {
       0% {
           clip-path: inset(100% 0% 0% 0%);
           transform: translateY(-100%);
       }
       100% {
           clip-path: inset(0% 0% 0% 0%);
       }
   }
   ```

4. 水平位移，实际上是通过多边形裁剪实现，鼠标移出时不渲染该部分内容，鼠标移入时再显示。代码如下：

   ```html
   <style>
       .img-box img:nth-child(2) {
           clip-path: polygon(-30% 0, -30% 0, 0% 50%, -30% 100%, -30% 100%);
       }
       .img-box:hover img:nth-child(2) {
           clip-path: polygon(-30% 0, 100% 0, 110% 50%, 100% 100%, -30% 100%);
       }
   </style>
   ```

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/detail/css/clipPath" />