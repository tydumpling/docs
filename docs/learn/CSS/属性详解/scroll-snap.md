# scroll-snap 实现吸附

## 前置知识

[CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性 **`scroll-snap-type`** 设置了在有滚动容器的情形下吸附至吸附点的严格程度。

此属性不为吸附至吸附点指定任何确切的动画或运动规律，留待用户代理处理。

```css
/* 不吸附 */
scroll-snap-type: none;

/* 表示吸附轴的关键字 */
scroll-snap-type: x;
scroll-snap-type: y;
scroll-snap-type: block;
scroll-snap-type: inline;
scroll-snap-type: both;

/* 表示吸附程度的可选关键字 */
/* mandatory 或 proximity */
scroll-snap-type: x mandatory;
scroll-snap-type: y proximity;
scroll-snap-type: both mandatory;

/* 全局值 */
scroll-snap-type: inherit;
scroll-snap-type: initial;
scroll-snap-type: revert;
scroll-snap-type: revert-layer;
scroll-snap-type: unset;
```

语法：

- [`none`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-snap-type#none)

  在滚动此滚动容器的可见[视口](https://developer.mozilla.org/zh-CN/docs/Glossary/Viewport)时，必须忽略吸附点。

- [`x`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-snap-type#x)

  滚动容器仅在其横轴上吸附至吸附位置。

- [`y`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-snap-type#y)

  滚动容器仅在其纵轴上吸附至吸附位置。

- [`block`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-snap-type#block)

  滚动容器仅在其块向轴上吸附至吸附位置。

- [`inline`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-snap-type#inline)

  滚动容器仅在其行向轴上吸附至吸附位置。

- [`both`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-snap-type#both)

  滚动容器在其两轴上独立地吸附至吸附位置（可能在各轴上吸附至不同的元素）。

- [`mandatory`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-snap-type#mandatory)

  若滚动容器当前未在滚动，则其可见视口必须吸附至吸附位置。

- [`proximity`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-snap-type#proximity)

  若滚动容器当前未在滚动，则其可见视口可以吸附至吸附位置。是否吸附由用户代理根据滚动参数决定。若指定了吸附轴，则此为默认的吸附程度。

> **备注**
>
> 若吸附口中的内容发生变动（如被添加、移动、删除或改变尺寸）或者与滚动吸附相关的任意属性（如 `scroll-snap-type` 或 `scroll-margin`）的值发生变化，则滚动容器将按照 `scroll-snap-type` 最新的值[重新吸附](https://drafts.csswg.org/css-scroll-snap/#re-snap)。

## 实现

案例一的效果通过吸附实现，首先设置 `scroll-snap-type` ，给他两个属性，一个是在哪个轴，一个是如何吸附，根据效果来看可以看出它不允许出现两个元素各展示一部分，强制吸附，因此使用 `mandatory` 。

光有这个属性还不够，需要给被吸附的元素绑定两个样式：

1. 被吸附时对齐的方式，有 `start` 和 `center` 、`end` 三种，由于本案例宽高与父盒子一致，因此三个方式没有差异
2. 被吸附时是否停止，如果不设置它可以从1滑动到3，设置了之后它一次性滑动只能从1滑动到2

代码如下：

```css
.box {
    scroll-snap-type: x mandatory;
}

.item {
    scroll-snap-align: start;
    scroll-snap-stop: always;
}
```

案例二的效果可以举一反三，吸附方向是在 Y 轴，吸附的方式是在接近的时候才吸附，因此代码如下所示：

```css
.box {
    scroll-snap-type: y proximity;
}

.item {
    scroll-snap-align: start;
}
```

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/detail/css/scrollSnap" />