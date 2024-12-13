# B站banner鼠标移动效果揭秘

## 原理

B站首页 `banner` 随鼠标的移动整体也会有一个变化的动画效果。打开控制台查看其源码，可以看到本质上它是由多个 `div` 和 `img` 标签组成的一个整体 `banner` 。

![源码](https://pic.imgdb.cn/item/660a647f9f345e8d037ea3d0.png)

而在鼠标移动时，对应的 `div` 标签的 `translate` 样式属性发生变化，在视觉效果上就能感觉到其发生改变。

## 模拟

下面模拟实现该功能。

1. 首先在最外层设置一个 `div` 盒子，设置定位
2. 声明一个变量数组，存放每个子盒子距离父组件左侧距离的值
3. 设置几个子盒子，设置绝对定位，设置样式 `transform` ，通过索引获取 `translate` 的值
4. 为父盒子绑定鼠标移动事件 `mousemove` ，判断鼠标是左移还是右移，做相对应的加减法。注意移动距离需要根据屏幕宽度做适配

## 代码

```vue
<script setup>
const divPosition = ref([
  100,
  250,
  400,
  670,
  880
])

const lastX = 0 // 保存上一次的鼠标x轴
const moveFn = e => {
  if (lastX - e.clientX > 0) {
    // 左移动
    divPosition.value[0] -= 2
    divPosition.value[4] -= 10
  }
  else {
    // 右移动
    divPosition.value[0] += 2
    divPosition.value[4] += 10
  }
  
  lastX = e.clientX
}
</script>

<template>
	<div class="banner" @mousemove="moveFn">
    <div v-for="(item, index) in divPosition" :key="index" :style="{
         transform: translate(`${divPosition[index]}px`, 50px)
    }">{{ item }}</div>
  </div>
  </div>
</template>

<style lang="less" scoped>
  .banner {
    position: relavite;
    width: 100vw;
    height: 200px;
    
    div {
      position: absoulute;
      top: 0;
      left: 0;
      width: 100px;
      height: 100px;
      background-color: yellow;
    }
  }
</style>
```

