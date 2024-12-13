# Sass加Css变量实现现代前端换肤

在开发组件库时，如何实现用户换肤呢？

- 使用者可以固定自定义主题色、基本色等相关主题
- 支持动态切换，可以只切换单个颜色，也支持全部切换

## 思路

现代前端换肤的思路如下：

1. 定义 sass 或者 css 变量
2. 颜色控制都用变量定义
3. 覆盖或者修改变量
4. 完成换肤

## 样式变量定义

下面先来实现通过变量定义部分样式。假设我们已经创建了自己的组件库，放到了 `tydumpling_ui` 文件夹下，样式文件放在 `tydumpling_ui/css` 文件夹下。

自定义组件代码如下所示：

```vue
<template>
	<button class="button button-primary">
    按钮
  </button>
</template>

<script setup></script>
```

组件的样式则在 `tydumpling_ui/css/index.scss` 文件内。

> 注意
>
> 这里的类名都使用 BEM 类名规范来设置类名

在 `tydumpling_ui/index.js` 文件中注册自定义组件（不是本章重点，因此不做过多描述）：

```js
import tydumplingbutton from './tydumplingbutton.vue'

let obj = {
  tydumplingbutton
}

export default {
  install(vue) {
    for(let item in obj) {
      vue.component(item, obj[item])
    }
  }
}
```

最后在入口文件中引入使用：

```js
// 注册的组件
import tydumplingui from './tydumpling_ui/index.js'

// 样式文件
import './tydumpling_ui/css/index.scss'
```

为按钮组件设置样式变量。一般的，为了方便后续换肤，这些变量都设置在新的样式文件中。本案例放到 `tydumpling_ui/css/variable.scss` 文件内。

注意要设置为默认样式：

```css
$theme-color: red !default;
$button-primary: blue !default;
```

> 注意
>
> 在变量赋值之前， 利用 ``!default` 为变量指定默认值。也就是说，如果在此之前变量已经赋值，那就不使用默认值，如果没有赋值，则使用默认值。
>
> 代码实例如下:
>
> ```scss
> $content: "antzone" !default;
> #main {
>   content: $content;
> }
> ```
>
> 编译为css代码如下:
>
> ```scss
> #main {
>   content: "antzone"; 
> }
> ```
>
> 由于在声明默认值之前，并没有变量的赋值，所以就使用默认值。
>
> 再来看一段代码实例:
>
> ```scss
> $content:"softwhy.com";
> $content: "antzone" !default;
> #main {
>   content: $content;
> }
> ```
>
> 编译成css代码如下:
>
> ```scss
> #main {
>   content: "softwhy.com"; 
> }
> ```
>
> 由于在默认变量值声明之前，就已经有变量赋值了，所以就不再使用默认值。
>
> `!default` 一个重要的作用就是，如果我们引入的他人 scss 文件中的变量有默认值的设置，那么我们就可以很灵活的来修改这些默认值，只要在这些导入文件之前引入就一个配置 scss 文件即可,而无需修改他人的 scss 文件，例如:
>
> ```scss
> @import "config";
> @import "variables";
> @import "mixins";
> ```
>
> 只要将重新配置的变量值写入 `config.scss`  文件，即可实现修改 `variables.scss` 和 `mixins.scss` 中默认变量值。

组件的样式文件 `index.scss` 内引入变量样式文件：

```css
@import './variable.scss';

.button-primary {
  color: $button-primary;
  /* ... */
}
```

现在样式变量就能够正常运作了。

## 样式变量修改

先来试试看能不能修改之前定义的默认样式变量。

根目录下新建一个 `myindex.scss` 文件，引入组件库的样式文件，并修改样式变量，代码如下：

```scss
$theme-color: pink;
$button-primary: green;
@import '@/tydumpling_ui/css/index.scss'
```

而入口文件不再引入组件库的样式文件了，改为引入刚新建的样式文件。

```js
// 注册的组件
import tydumplingui from './tydumpling_ui/index.js'

// 样式文件
// import './tydumpling_ui/css/index.scss'
import './myindex.scss'
```

保存运行后，可以看到效果已经生效，样式已被替换。

## 动态替换所有样式

在 css 中， `()` 表示一个对象。把所有相关的主题属性放到该对象中。为了方便替换，需要添加 `!default` 。

修改 `tydumpling_ui/css/index.scss` 文件代码，代码如下：

```scss
$themes:(
	default-theme: (
  	// 这一套主题所有相关颜色
    theme-color: red,
    button-primary: blue
  )
)!default;
```

在同级目录下新建一个 `minxin.scss` 文件，用于生成对应属性的方法。代码如下：

```scss
// 生成背景色.
@mixin get-backcolor($color) {
  @each $themename, $theme in $themes {
    [data-skin='#{$themename}'] & {
      background-color: map-get($theme, 'button-primary')
    }
  }
}

// 生成字体色.
@mixin get-fontcolor() {}
```

上方代码中：

- `@each...in...` 表示循环某个主题属性对象。如上方代码中，循环 `$themes` 属性对象，其中 `$themename` 为键， `$theme` 为值
- `[data-skin='#{}']` 表示在 HTML 中找到符合 `data-skin` 为主题名称的标签
- `map-get()` 方法表示找到对应对象中的键值类名。需要传两个参数，参数一为所要对比的属性对象，参数二为需要查找的类名字符串

生成好对应的属性后再返回 `tydumpling_ui/css/index.scss` 文件内绑定样式。代码如下：

```scss
@import './mixin.scss';
@import './variable.scss';

.button-primary {
  @include get-backcolor('theme-color')
}
```

此时运行发现其默认样式都没了，因为我们在设置时需要 HTML 元素的 `data-skin` 为 `default-theme` 才有默认样式。

解决方法只需要给 HTML 标签设置自定义属性 `data-skin` 即可。代码如下：

```js
onMounted(() => {
  window.document.documentElement.setAttribute('data-skin', 'default-theme')
})
```

现在再刷新运行，可以看到有效果了。

切换也很简单了，返回根目录下的 `myindex.scss` 文件，修改 `$themes` 样式对象的属性。代码如下：

```scss
$themes:(
	default-theme: (
  	// 这一套主题所有相关颜色
    theme-color: red,
    button-primary: blue
  ),
  error-theme: (
  	theme-color: yellow,
    button-primary: green
  )
);

@import '@/tydumpling_ui/css/index.scss'
```

现在只需要修改样式变量类名即可，代码如下：

```vue
<template>
	<button @click="changeSkin('default-theme')">
    默认样式
  </button>
	<button @click="changeSkin('error-theme')">
    错误样式
  </button>
	<button class="button-primary">
    按钮
  </button>
</template>

<script setup>
// 初始化默认样式
onMounted(() => {
  window.document.documentElement.setAttribute('data-skin', 'default-theme')
})
  
// 点击换肤按钮
const changeSkin = (type) => {
  window.document.documentElement.setAttribute('data-skin', type)
}
</script>
```

## 修改某个属性样式

在 css 中可以通过 `var()` 的形式设置样式变量名称，方便后续通过名称实现只修改某些样式。代码如下：

```scss
$themes:(
	default-theme: (
  	// 这一套主题所有相关颜色
    theme-color: var(--data-theme-color, red),
    button-primary: var(--data-button-primary, blue)
  ),
  error-theme: (
  	theme-color: var(--data-theme-color, yellow),
    button-primary: var(--data-button-primary, green)
  )
);

@import '@/tydumpling_ui/css/index.scss'
```

注册一个全局组件，通过父子组件传参需要修改的样式变量和修改成啥的颜色样式；子组件接受并修改。

父组件代码如下：

```vue
<template>
	<config-provider :theme="{'theme-color': 'pink'}">
  	<button class="button-primary">
      按钮
  	</button>
  </config-provider>
</template>
```

子组件代码如下：

```vue
<template>
	<slot></slot>
</template>

<script setup>
defineProps({
  theme
})
  
for(let item in themr) {
	let _name = '--data' + item
  document
  	.querySelector(':root')
  	.style.setProperty(_name, theme[item])
}
</script>
```

上方代码表示在根节点 `"root"` 内通过为 DOM 元素绑定 `--data-xxxx` 的样式类名的方式，做到修改某个属性样式功能。

