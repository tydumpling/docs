# BEM

官网指路：[BEM](https://getbem.com/introduction/) 。

CSS 命名十分重要，另外如有重名的情况，就会发生样式覆盖，导致最终效果显示错乱。

对于命名，市面上有一些民间组织指定的命名规则，例如 BEM，SMACSS 和 OOCSS。

## 介绍

BEM 命名规则比较常见，其中：

- B 代表 `Block` 块，如 `header`, `container`, `menu`, `checkbox`, `input`, `nav` 等 。
- E 代表 `Element` 元素，是块的一部分，它没有独立的意义，在语义上与其块绑定在一起。如 `header title` , `menu content` , `nav item` 等。
- M 代表 `Modifer` 限定，是块或元素上的标志。用它们来改变外表或行为。如 `nav item active` , `input focus` 等。

用一个例子来说明，我们可以在通常情况下有一个正常的按钮，在不同的情况下有两个状态。因为我们使用 `BEM` 通过类选择器对块进行样式化，所以我们可以使用任何我们想要的标签( `button` 、`a` 甚至 `div` )来实现它们。命名规则告诉我们使用 **块-元素-标志** 的语法。

```html
<button class="button">
	Normal button
</button>
<button class="button button-state_success">
	Success button
</button>
<button class="button button-state_danger">
	Danger button
</button>
```

## 总结

样式设置方面可以使用 `BEM` 方法，其中，E 和 M 可以省略。通过该方法可以高效设置类名与方便后续的维护。