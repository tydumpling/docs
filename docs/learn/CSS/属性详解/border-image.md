# border-image 实现图片边框

## 前值知识

`border-image` 是一个复合属性，具体详情可前往文档查看 [border-image](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-image)，它拆分为以下三个属性：

- `border-image-source` 图片源

  如果单单设置这个属性，它只会在 `div` 的四个角添加图片效果，如下图所示：

  ![四个角](https://pic.imgdb.cn/item/670f7510d29ded1a8c04cf4d.png)

- `border-image-slice` 图片切割

  这个属性用于设置图片的切割，切割的原理如下图

  ![切割](https://pic.imgdb.cn/item/670f75a8d29ded1a8c053d3a.png)

  它如果设置一个值则表示全部这么切割，也可以像 `padding` 、`margin` 那样设置四个值。

- `border-image-repeat` 边框过渡

  该值用于控制中间的重复方式，默认为拉伸 `stretch` ，如果盒子过长则拉伸，如果过小则压缩。效果如下：

  ![拉伸](https://pic.imgdb.cn/item/670f76a1d29ded1a8c05ff40.png)

  一种是重复 `repeat` ，效果如下：

  ![重复](https://pic.imgdb.cn/item/670f76f5d29ded1a8c0639c0.png)

  重复 `repeat` 的效果和环绕 `round` 的效果咋一看很相似，但是 `repeat` 设置的边框他是以中心点为原点，如果有超出的部分，两侧与角的交界处会对不齐。因此上方的效果图可以看出四个角附近有一点不连贯的感觉。


## 效果实现

首先设置边框 `border` ，然后设置边框图片 `border-image` ，接收三个参数，图片的 SVG 路径，图片剪切距离，图片的裁剪效果。

代码如下所示：

```css
div {
  border: 50px soild #fff;
  border-image: url('./xxx.svg') 50 round;
}
```

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/detail/css/imageBorder" />