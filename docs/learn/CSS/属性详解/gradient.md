# 渐变

说起渐变，想必大家都不陌生，通过 `background-image` 设置渐变效果，可以在任何使用 `background-image` 的容器盒子内使用。

渐变包含以下几种类型：

- 线性渐变 `linear-gradient()` 
- 径向渐变 `radial-gradient()` 
- 锥形渐变 `conic-gradient()` 
- 重复渐变 `repeating-linear-gradient()` 和 `repeating-conic-gradient()` 

下面依次来详谈这些渐变。

## 线性渐变

### 语法

```css
< linear-ragient> = linear-ragient( [ [ <angle> | to <side-or-corner ]，]? <color-stop>[ ，<color-stop>]+ )
```

### 基础效果

`linear-gradient` 线性渐变是一种两个以上颜色之间的平滑过渡效果。线性渐变为某一方向指向的渐变效果，如由左到右，上到下，左上到右下等。和径向渐变不同的是，径向渐变是一中心点向周围扩散的渐变，径向渐变为某一线性指向方向的渐变。

想要实现最基础的线性渐变效果，只需要指定两个及以上的颜色即可。

基础效果：

```css
div {
  background: linear-gradient(blue, pink);
}
```

设置了颜色后它会自动计算，均匀分布在渐变路径中。

### 方向切换

渐变的角度方向默认从上到下，也可以手动设置调整，允许输入方向单词和角度。方向单词包括以下几种：

- 从上到下：`to bottom` 

  ```css
  div {
    background: linear-gradient(to bottom, blue, pink);
  }
  ```

  ![to bottom](https://pic.imgdb.cn/item/663f0f250ea9cb1403ab7b83.png)

- 从左到右：`to right` 

  ```css
  div {
    background: linear-gradient(to right, blue, pink);
  }
  ```

  ![to right](https://pic.imgdb.cn/item/663f0eee0ea9cb1403ab1109.png)

- 从右到左

  ```css
  div {
    background: linear-gradient(to left, blue, pink);
  }
  ```

  ![to left](https://pic.imgdb.cn/item/663f0fa10ea9cb1403ac5bf2.png)

- 从下到上

  ```css
  div {
    background: linear-gradient(to top, blue, pink);
  }
  ```

  ![to top](https://pic.imgdb.cn/item/663f0fc60ea9cb1403ac9a48.png)

- 从左上到右下

  ```css
  div {
    background: linear-gradient(to right bottom, blue, pink);
  }
  ```

  ![to right bottom](https://pic.imgdb.cn/item/663f0fef0ea9cb1403acd7db.png)

- 从右上到左下

  ```css
  div {
    background: linear-gradient(to left bottom, blue, pink);
  }
  ```

  ![to left bottom](https://pic.imgdb.cn/item/663f102c0ea9cb1403ad3b7f.png)

- 从左下到右上

  ```css
  div {
    background: linear-gradient(to right top, blue, pink);
  }
  ```

  ![right top](https://pic.imgdb.cn/item/663f1bd90ea9cb1403c3a732.png)

- 从右下到左上

  ```css
  div {
    background: linear-gradient(to left top, blue, pink);
  }
  ```

  ![to left top](https://pic.imgdb.cn/item/663f27be0ea9cb1403d6e407.png)

除了设置对角方向，还能设置角度，`0deg` 表示从下到上，`90deg` 表示从左到右。正角度表示顺时针，逆角度表示逆时针。

### 色标位置

可以为径向和线性渐变设置 0、1 或 2 个百分比值或者绝对长度值来调整它们的位置。如果将位置设置为百分数，`0%` 表示起始点，而 `100%` 表示终点，但是如果需要的话也可以设置这个范围之外的其他值。

如果有些位置你没有明确设置，那么将会自动计算，第一个色标在 `0%` 处，最后一个色标在 `100%`，其他的色标则位于其相邻的两个色标中间。

```css
div {
  background: linear-gradient(to left, lime 50px, red 60%, cyan);
}
```

![xiaoguo](https://pic.imgdb.cn/item/663f292d0ea9cb1403d92d23.png)

### 过渡效果

#### 硬过渡

如果不想要平滑过渡，想要硬线过渡效果，可以将相邻的颜色停止设置为相同的位置。

```css
div {
  background: linear-gradient(to bottom left, cyan 50%, palegoldenrod 50%);
}
```

![yingguodu](https://pic.imgdb.cn/item/663f2bbd0ea9cb1403dd3f44.png)

#### 过渡中心

默认情况下，渐变会平滑地从一种颜色过渡到另一种颜色，通过设置一个值可以把渐变的中心点移动到指定位置。

```css
div1 {
  background: linear-gradient(blue, 10%, pink);
}
div2 {
  background: linear-gradient(blue, pink);
}
```

下面查看一下对比效果：

![duibitu](https://pic.imgdb.cn/item/663f30a30ea9cb1403e4ef43.png)

#### 条纹

要在渐变中包含一个实心、非过渡的颜色区域，请包含色标的两个位置。色标可以有两个位置，这相当于两个连续颜色在不同位置具有相同的色标。颜色将在第一个色标时达到完全饱和，保持该饱和度到第二个色标，并通过相邻色标的第一个位置过渡到相邻色标的颜色。

```css
.multiposition-stops {
  background: linear-gradient(
    to left,
    lime 20%,
    red 30%,
    red 45%,
    cyan 55%,
    cyan 70%,
    yellow 80%
  );
  background: linear-gradient(
    to left,
    lime 20%,
    red 30% 45%,
    cyan 55% 70%,
    yellow 80%
  );
}
.multiposition-stop2 {
  background: linear-gradient(
    to left,
    lime 25%,
    red 25%,
    red 50%,
    cyan 50%,
    cyan 75%,
    yellow 75%
  );
  background: linear-gradient(
    to left,
    lime 25%,
    red 25% 50%,
    cyan 50% 75%,
    yellow 75%
  );
}
```

![xiaoguo](https://pic.imgdb.cn/item/663f339d0ea9cb1403e9a997.png)

### 叠加效果

渐变支持透明度，可以将多个背景叠加起来以实现一些非常好看的效果。背景是从顶部到底部堆叠的，指定的第一个就是顶部。

```css
div {
  background: linear-gradient(to right, transparent, mistyrose),
    url("critters.png");
}
```

![diejia](https://pic.imgdb.cn/item/663f34810ea9cb1403ed5e44.png)

还可以将渐变与其他的渐变堆叠起来。只要顶部的渐变不是完全不透明的，那么下面的渐变就会依然可见。

```css
div {
  background: linear-gradient(
      217deg,
      rgba(255, 0, 0, 0.8),
      rgba(255, 0, 0, 0) 70.71%
    ), linear-gradient(127deg, rgba(0, 255, 0, 0.8), rgba(0, 255, 0, 0) 70.71%),
    linear-gradient(336deg, rgba(0, 0, 255, 0.8), rgba(0, 0, 255, 0) 70.71%);
}
```

![duidie](https://pic.imgdb.cn/item/663f350d0ea9cb1403ee5afe.png)

## 径向渐变

`radial-gradient()` 函数用径向渐变创建 "图像"。径向渐变由中心点定义。 为了创建径向渐变需要设置两个中止色。

### 语法

```css
<radial - gradient> = radial-gradient( [ [ <shape> || <size> ] [ at <position> ]?，| at <position> ，] ? <color-stop> ]+)
```

### 基础效果

和线性渐变一样，创建径向渐变所需要的就是两个颜色。默认情况下，渐变的中心点是 50% 50% 的位置，默认椭圆 `ellipse` 渐变，可换成圆形 `circle` 渐变。

```css
div {
  background: radial-gradient(ellipse, red, blue);
}
```

![xiaoguo](https://pic.imgdb.cn/item/663f38820ea9cb1403f4920d.png)

### 色标位置

和线性渐变一样，可以用百分比或者绝对长度指定每个径向色标的位置。

```css
div {
  background: radial-gradient(red 10px, yellow 30%, #1e90ff 50%);
}
```

![sebiao](https://pic.imgdb.cn/item/663f3a8a0ea9cb1403f8c93c.png)

### 中心点

可以使用关键字、百分比或者绝对长度、长度和百分比值的重复（如果存在，否则就是从左侧位置和顶部位置开始的）以指定渐变的中心。

```css
div {
  background: radial-gradient(at 0% 30%, red 10px, yellow 30%, #1e90ff 50%);
}
```

### 径向渐变的大小

和线性渐变不同，可以指定径向渐变的大小。可能的值包括 `closest-corner`、`closest-side`、`farthest-corner` 和 `farthest-side`，其中 `farthest-corner` 是默认值。圆的大小为长度，椭圆则是长度和百分比。

####  closet-side 

大小通过开始点（中心）和包围盒的最近一侧的距离设置的。假设一个 `div` 是长 200px 高 100px 的矩形，则中心点离上下两条线距离最近。若修改了一下中心点，则选取距离如下图所示：

![20191114175519939.png (682×337) (csdnimg.cn)](https://img-blog.csdnimg.cn/20191114175519939.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDI5NjkyOQ==,size_16,color_FFFFFF,t_70)

根据图所示该中心点最近的边是下边。

```css
.radial-ellipse-side {
  background: radial-gradient(
    ellipse closest-side,
    red,
    yellow 10%,
    #1e90ff 50%,
    beige
  );
}
```

#### closest-corner

指定径向渐变的半径长度为从圆心到离圆心最近的角

#### farthest-side

指定径向渐变的半径长度为从圆心到离圆心最远的边

#### farthest-corner

指定径向渐变的半径长度为从圆心到离圆心最远的角

```css
.radial-ellipse-far {
  background: radial-gradient(
    ellipse farthest-corner at 90% 90%,
    red,
    yellow 10%,
    #1e90ff 50%,
    beige
  );
}
```

####  closet-side 

这个例子使用了 `closest-side`，使得圆的半径是渐变中心到最近一侧的距离。在这个例子中，半径是中心到底部的距离，因为渐变位于左侧 25%、底部 25% 的位置，而 div 元素的高度小于宽度。

```css
.radial-circle-close {
  background: radial-gradient(
    circle closest-side at 25% 75%,
    red,
    yellow 10%,
    #1e90ff 50%,
    beige
  );
}
```

#### 椭圆形渐变长度或百分比

对于椭圆，可以使用长度或者百分比来设置其大小，第一个值代表了水平半径，第二个值是竖直半径，你可以使用百分比以表示相对于盒在那个维度上的大小的值。在下面这个例子中，使用了百分比以表示水平半径。

```css
.radial-ellipse-size {
  background: radial-gradient(
    ellipse 50% 50px,
    red,
    yellow 10%,
    #1e90ff 50%,
    beige
  );
}
```

### 叠加效果

就像线性渐变一样，可以堆叠径向渐变。指定的第一个位于顶部，最后一个位于底部。

```css
.stacked-radial {
  background:
    radial-gradient(
      circle at 50% 0,
      rgba(255, 0, 0, 0.5),
      rgba(255, 0, 0, 0) 70.71%
    ),
    radial-gradient(
      circle at 6.7% 75%,
      rgba(0, 0, 255, 0.5),
      rgba(0, 0, 255, 0) 70.71%
    ),
    radial-gradient(
        circle at 93.3% 75%,
        rgba(0, 255, 0, 0.5),
        rgba(0, 255, 0, 0) 70.71%
      ) beige;
  border-radius: 50%;
}
```

## 锥形渐变

`conic-gradient()` 函数创建包含颜色围绕中心点旋转（而不是从中心点辐射）产生的渐变的图像。锥形渐变的例子包括了饼图和[色轮](https://developer.mozilla.org/zh-CN/docs/Glossary/Color_wheel)，但是也可以用于创建棋盘格和其他有趣的效果。

锥形渐变的语法和径向渐变的语法类似，但是色标是围绕渐变弧（圆的圆周）进行的，而不是从渐变中心出现的渐变线上，并且色标是百分比或度数：绝对长度无效。

在径向渐变中，颜色从椭圆中心的位置在各个方向上向外过渡。在锥形渐变中，颜色围绕圆的中心在圆周上旋转过渡，从顶部开始，顺时针进行。类似于径向渐变，可以设置渐变的中心。类似于线性渐变，可以改变渐变的角度。

### 语法

```css
conic-gradient( [ from <angle> ]? [ at <position> ]?, <angular-color-stop-list> )
```

### 基础效果

和线性和径向的渐变类似，创建锥形渐变所需要的就是两个颜色。默认情况下，渐变的中心位于 50% 50% 的位置，渐变的开始点是朝上的。

```css
div {
  background: conic-gradient(red, blue);
}
```

### 位置设置

和锥形渐变类似，可以使用关键词、百分比或者绝对长度，以及关键字“at”来设置锥形渐变的中心位置。

```CSS
.conic-gradient {
  background: conic-gradient(at 0% 30%, red 10%, yellow 30%, #1e90ff 50%);
}
```

### 角度设置

默认情况下，指定的不同色标是围绕着圆均等分布的。在开始时可以使用 “from” 关键字以及一个角度或者长度以指定锥形渐变的起始点，然后在后面包括角度或者长度以指定不同的位置。

```css
div {
  background: conic-gradient(from 45deg, red, orange 50%, yellow 85%, green);
}
```

## 重复渐变

[`linear-gradient()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/linear-gradient)、[`radial-gradient()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/radial-gradient) 和 [`conic-gradient()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/conic-gradient) 函数不支持自动重复的色标。但是，[`repeating-linear-gradient()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/repeating-linear-gradient)、[`repeating-radial-gradient()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/repeating-radial-gradient) 和 [`repeating-conic-gradient()`](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/repeating-conic-gradient) 函数可以用于提供此功能。

重复渐变线或弧的大小，是第一个色标和最后一个色标之间的长度。如果第一个色标只有颜色没有色标长度，那么值默认为 0。如果最后一个色标只有颜色没有色标长度，那么值默认为 100%。如果都没有指定，那么渐变线是 100%，意味着线性和锥形的渐变都不会重复，径向渐变只会在渐变的半径小于中心点和最远角之间的距离时重复。如果第一个色标声明了，其值大于 0，渐变也会重复，因为线或弧的大小就是第一个色标和最后一个色标之间的距离，小于 100% 或 360 度。

### 重复线性渐变

```css
div {
  background: repeating-linear-gradient(
    -45deg,
    red,
    red 5px,
    blue 5px,
    blue 10px
  );
}
```

和常规的线性和径向渐变类似，可以包含多个渐变，一个在另一个的顶部。这只有在渐变部分透明时有效，以允许的后续的渐变穿透透明区域显示，或者为每个渐变图像指定不同的 [background-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)，还可以有不同的 [background-position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-position) 属性值。

```css
.multi-repeating-linear {
  background: repeating-linear-gradient(
      190deg,
      rgba(255, 0, 0, 0.5) 40px,
      rgba(255, 153, 0, 0.5) 80px,
      rgba(255, 255, 0, 0.5) 120px,
      rgba(0, 255, 0, 0.5) 160px,
      rgba(0, 0, 255, 0.5) 200px,
      rgba(75, 0, 130, 0.5) 240px,
      rgba(238, 130, 238, 0.5) 280px,
      rgba(255, 0, 0, 0.5) 300px
    ), repeating-linear-gradient(
      -190deg,
      rgba(255, 0, 0, 0.5) 30px,
      rgba(255, 153, 0, 0.5) 60px,
      rgba(255, 255, 0, 0.5) 90px,
      rgba(0, 255, 0, 0.5) 120px,
      rgba(0, 0, 255, 0.5) 150px,
      rgba(75, 0, 130, 0.5) 180px,
      rgba(238, 130, 238, 0.5) 210px,
      rgba(255, 0, 0, 0.5) 230px
    ), repeating-linear-gradient(23deg, red 50px, orange 100px, yellow 150px, green
        200px, blue 250px, indigo 300px, violet 350px, red 370px);
}
```

### 重复径向渐变

```css
div {
  background: repeating-radial-gradient(
    black,
    black 5px,
    white 5px,
    white 10px
  );
}
```

### 重复锥形渐变

```css
div {
  background: repeating-conic-gradient(
    black,
    black 5px,
    white 5px,
    white 10px
  );
}
```

