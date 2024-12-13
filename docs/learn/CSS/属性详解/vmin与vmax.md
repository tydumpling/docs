# vmin与vmax

在做移动端项目时，经常有一个要求是某张图片必须是全屏展示，且不能出现滚动条。这就说明这张图片必须是占满视口最短边。

CSS 新单位可以很优雅解决这一点，其中：

- vmin 表示该元素取视口最短那条边
- vmax 表示该元素取视口最长那条边

代码如下：

```css
img {
    width: 100vmin;
}
```

此时图片取视口相对最短的边，移动端上横向比纵向短，因此取横向距离。

这样就能够实现效果了。

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/detail/css/vmin" />