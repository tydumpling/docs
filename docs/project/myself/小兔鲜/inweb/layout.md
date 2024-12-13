# Layout 首页结构

## 静态页面编写

首先编写其静态页面，分为头部、nav 导航栏和底部，分为三个子组件即可。

## icon标签引入

前往 iconfont 阿里巴巴标签矢量库添加字体图标到项目中，生成在线链接，组件中复制粘贴对应标签类名即可。

[![p9OZvAs.png](https://s1.ax1x.com/2023/05/28/p9OZvAs.png)](https://imgse.com/i/p9OZvAs)

```vue
<link rel="stylesheet" href="//at.alicdn.com/t/c/font_4090818_d2g9yyp0e4e.css">

<i class="iconfont icon-ren"></i>
```

> 注意
>
> 如果更新一次字体图标项目则需要重新更新一次在线链接

## 一级导航动态渲染

1. 封装接口函数
2. 调用接口函数
3. v-for渲染模版

## 导航吸顶

准备一个新的导航结构组件，用于设置 `fixed` 定位，默认不显示，设置 `show` 类名控制其显示。引入 `vueuse` 中的 `useScroll` 获取其滚动数据，动态添加删除类名。

```bash
yarn add @vueuse/core
```

> 核心逻辑：根据滚动距离判断当前show类名是否显示，大于78显示，小于78，不显示

```vue
<script setup>
import LayoutHeaderUl from './LayoutHeaderUl.vue'
// vueUse
import { useScroll } from '@vueuse/core'
const { y } = useScroll(window)
</script>

<template>
  <div class="app-header-sticky" :class="{ show: y > 78 }">
    <!-- 省略部分代码 -->
  </div>
</template>
```

## Pinia优重复请求

nav 组件和 fixed 组件都要请求获取导航列表，这样要调用两次接口，因此可以封装到 pinia 中，数据存储在 state 内，这样就不用调两次接口了。

- pinia

  ```js
  import { ref } from 'vue'
  import { defineStore } from 'pinia'
  import { getCategoryAPI } from '@api/layout'
  
  export const useLayoutStore = defineStore('layout', () => {
    const list = ref([]) // 导航列表数据
  
    const getCategoryFn = () => {
      getCategoryAPI().then(res => {
        console.log('pinia', res)
        list.value = res.result
      })
    }
  
    return { list, getCategoryFn }
  })
  ```

- Layout 中的 index（即两个页面的父组件）调用 pinia 导出的方法

  ```js
  // pinia获取导航数据
  import { useLayoutStore } from '@/stores/layout'
  const layoutStore = useLayoutStore()
  
  onMounted(() => {
    layoutStore.getCategoryFn()
  })
  ```

- 子组件调用变量

  ```js
  // pinia获取导航数据
  import { useLayoutStore } from '@/stores/layout'
  
  const layoutStore = useLayoutStore()
  ```

  使用的时候通过 `layoutStore.list` 即可使用。

