# resize函数封装

## 思路

前端有一个交互是用户拖拽父级盒子，其内容会根据盒子宽度的变化而显示不同数量的内容。如下图所示：

![resize](https://pic.imgdb.cn/item/6529402ac458853aef02bd86.gif)

想要实现该功能，可以通过自定义函数搭配容器尺寸变化方法 `ResizeObserve()` 实现。初步代码如下：

```html
<template>
	<div v-size-ob="handleSizeChange" ref="chartRef"></div>
</template>

<script setup>
import { ref } from 'vue'
const chartRef = ref(null)
const width = ref(500)

function handleSizeChange(size) {
    width.value = size.width
}
</script>
```

接下来配置自定义函数，主要需要做的事情只有两个：

- 在真实 DOM 元素渲染完毕后监听其尺寸的变化
- 在真实 DOM 元素卸载后取消监听减少性能浪费

## DOM存在

由于 `ResizeObserve()` 方法可以监听多个 DOM 元素，因此其形参是一个数组的形式，每一项都是一个对象，包含以下的信息：

- target：目标元素
- borderBoxSize：盒子边框尺寸
- contentBoxSize：盒子内容尺寸
- contentRect：内容区域的整个矩形信息，如坐标、宽高等
- devicePixelContentBoxSize：DPR信息

通过 `for...of...` 循环，获取每一项数据对象的 `target` 对应的回调函数。由于方法和自定义函数不在同一个函数内，因此需要 `WeakMap()` 作为映射表，把 DOM元素与其 `handler` 方法一一对应。`WeakMap()` 与对象的区别简单区分可以理解为 `WeakMap()` 是一个可以用对象作为键的对象形式。

这里不使用 `Map()` 的原因是如果在未来真实 DOM 卸载后，它的键不会清除，因此方法还在，会有潜在的 BUG。`WeakMap()` 是一个弱映射，它的键不会被垃圾回收器所考量，只要真实 DOM不存在，对应的方法就会被删除掉。

在方法中获取到对应的处理函数并传递当前元素的宽高。如果宽高变化就会触发自定义的方法。

代码如下：

```js
// 建立映射表
const map = new WeakMap()

// 配置监视盒子内容盒或边框盒或者 SVGElement 边界尺寸的变化函数
const ob = new ResizeObserver((entries) => {
    for(const entry of entries) {
        // 运行 entry.target 对应的回调函数
        // 保存映射表对应的方法
        const handler = map.get(entry.target)
        if(handler) {
            handler({
                width: entry.borderBoxSize[0].inlineSize
                height: entry.borderBoxSize[0].blockSize
            })
        }
    }
})

export default {
    // 监听el元素尺寸变化
    mounted(el, binding) {
        // 保存映射表对应的方法
        map.set(el, binding.value)
        ob.observe(el)
    }
}
```

## DOM卸载

在 DOM 元素卸载后取消元素的监听即可。代码如下：

```js
// ...

export default {
    // 监听el元素尺寸变化
    mounted(el, binding) {
        // ...
    },
    // 取消监听
    unmounted(el) {
        ob.unobserve(el)
    }
}
```

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/detail/js/resize" />