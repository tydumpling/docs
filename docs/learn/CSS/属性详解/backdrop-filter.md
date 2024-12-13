# backdrop-filter 实现背景滤镜

## 前置知识

`backdrop-filter` CSS 属性可以让你为一个元素后面区域添加图形效果（如模糊或颜色偏移）。因为它适用于元素背后的所有元素，为了看到效果，必须使元素或其背景至少部分透明。

语法参考：
```css
/* 关键词值 */
backdrop-filter: none;

/* 指向 SVG 滤镜的 URL */
backdrop-filter: url(commonfilters.svg#filter);

/* <filter-function> 滤镜函数值 */
backdrop-filter: blur(2px);
backdrop-filter: brightness(60%);
backdrop-filter: contrast(40%);
backdrop-filter: drop-shadow(4px 4px 10px blue);
backdrop-filter: grayscale(30%);
backdrop-filter: hue-rotate(120deg);
backdrop-filter: invert(70%);
backdrop-filter: opacity(20%);
backdrop-filter: sepia(90%);
backdrop-filter: saturate(80%);

/* 多重滤镜 */
backdrop-filter: url(filters.svg#filter) blur(4px) saturate(150%);

/* 全局值 */
backdrop-filter: inherit;
backdrop-filter: initial;
backdrop-filter: revert;
backdrop-filter: unset;
```

## 效果实现

### 磨砂玻璃

使用 `blur` 让元素背景模糊，实现磨砂玻璃效果。注意：想要实现效果，元素自身需要部分透明。

```css
.blur {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
```

### 黑白滤镜

使用 `grayscale` 让元素背景变成黑白滤镜。

```css
.grayscale {
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: all .3s;
  backdrop-filter: grayscale(100%);
  -webkit-backdrop-filter: grayscale(100%);
}

div:hover .grayscale {
  width: 0;
}
```

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/detail/css/backdropFilter" />