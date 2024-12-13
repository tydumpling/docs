## vue-router4

### 基本使用

1. 安装

   ```csharp
   csharp
   复制代码yarn add vue-router
   ```

2. 配置路由

3. 在 `main.js` 中引入

   ```js
   js复制代码import { createApp } from 'vue'
   import App from './App.vue'
   
   import router from "./router";
   
   const app = createApp(App)
   app.use(router)
   app.mount('#app')
   ```

4. 使用

   ```vue
   vue复制代码<script setup>
   import { useRoute } from "vue-router";
   const route = useRoute()
   
   console.log(route);
   console.log(route.path);
   console.log(route.fullPath);
   console.log(route.query);
   </script>
   
   <template>
     <div>登录页面</div>
   </template>
   ```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b58da09773e2465c96f4e4d6895a3953~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## Pinia

### 基本介绍

> Pinia 是 Vue.js 的轻量级状态管理库

官方网站：[pinia.vuejs.org/](https://link.juejin.cn?target=https%3A%2F%2Fpinia.vuejs.org%2F)

为什么学习pinia?

- pinia和vuex4一样，也是vue官方的状态管理工具(作者是 Vue 核心团队成员）
- pinia相比vuex4，对于vue3的兼容性更好
- pinia相比vuex4，具备完善的类型推荐
- pinia同样支持vue开发者工具,最新的开发者工具对vuex4支持不好
- **Pinia** 的 API 设计非常接近 `Vuex 5` 的[提案](https://link.juejin.cn?target=https%3A%2F%2Flink.segmentfault.com%2F%3Fenc%3Dbzgtx6D37f7ZjuOSGfXM2g%3D%3D.Anbb%2BsTaBijhbf0botKHz0NRal7UrociDtXE3qxoLjZTZb9eHUphdj1aeU96KLV8IczFvQ74HSuMxmKZ6I3R5acIrZrKY8I4FBi6G%2Bufe10A%2FkNDziBeRY8hkZ1bnN8x)。

pinia核心概念

- state: 状态
- actions: 修改状态（包括同步和异步，pinia中没有mutations）
- getters: 计算属性

### 基本使用与state

> 目标：掌握pinia的使用步骤

#### 安装

```csharp
yarn add pinia
# or
npm i pinia
```

#### 在main.js中挂载pinia

```javascript
import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'
const pinia = createPinia()

createApp(App).use(pinia).mount('#app')
```

#### 新建文件store/counter.js

```javascript
import { defineStore } from 'pinia'
// 创建store,命名规则： useXxxxStore
// 参数1：store的唯一表示
// 参数2：对象，可以提供state actions getters
const useCounterStore = defineStore('counter', {
  state: () => {
    return {
      count: 0,
    }
  },
  getters: {
   
  },
  actions: {
    
  },
})

export default useCounterStore
```

#### 在组件中使用

```vue
<script setup>
import useCounterStore from './store/counter'

const counter = useCounterStore()
</script>

<template>
  <h1>根组件---{{ counter.count }}</h1>
</template>

<style></style>
```

### actions的使用

> 目标：掌握pinia中actions的使用

在pinia中没有mutations，只有actions，不管是同步还是异步的代码，都可以在actions中完成。

#### 在actions中提供方法并且修改数据

```javascript
import { defineStore } from 'pinia'
// 1. 创建store
// 参数1：store的唯一表示
// 参数2：对象，可以提供state actions getters
const useCounterStore = defineStore('counter', {
  state: () => {
    return {
      count: 0,
    }
  },
  actions: {
    increment() {
      this.count++
    },
    incrementAsync() {
      setTimeout(() => {
        this.count++
      }, 1000)
    },
  },
})

export default useCounterStore
```

#### 在组件中使用

```vue
<script setup>
import useCounterStore from './store/counter'

const counter = useCounterStore()
</script>

<template>
  <h1>根组件---{{ counter.count }}</h1>
  <button @click="counter.increment">加1</button>
  <button @click="counter.incrementAsync">异步加1</button>
</template>
```

### getters的使用

> pinia中的getters和vuex中的基本是一样的，也带有缓存的功能

#### 在getters中提供计算属性

```javascript
import { defineStore } from 'pinia'
// 1. 创建store
// 参数1：store的唯一表示
// 参数2：对象，可以提供state actions getters
const useCounterStore = defineStore('counter', {
  state: () => {
    return {
      count: 0,
    }
  },
  getters: {
    double() {
      return this.count * 2
    },
  },
  actions: {
    increment() {
      this.count++
    },
    incrementAsync() {
      setTimeout(() => {
        this.count++
      }, 1000)
    },
  },
})

export default useCounterStore
```

#### 在组件中使用

```vue
<h1>根组件---{{ counter.count }}</h1>
<h3>{{ counter.double }}</h3>
```

### pinia模块化

> 在复杂项目中，不可能吧多个模块的数据都定义到一个store中，一般来说会一个模块对应一个store，最后通过一个根store进行整合

#### 新建store/user.js文件

```javascript
import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
  state: () => {
    return {
      name: 'zs',
      age: 100,
    }
  },
})

export default useUserStore
```

#### 新建store/index.js

```javascript
import useUserStore from './user'
import useCounterStore from './counter'

// 统一导出useStore方法
export default function useStore() {
  return {
    user: useUserStore(),
    counter: useCounterStore(),
  }
}
```

#### 在组件中使用

```vue
<script setup>
import { storeToRefs } from 'pinia'
import useStore from './store'
const { counter } = useStore()

// 使用storeToRefs可以保证解构出来的数据也是响应式的
const { count, double } = storeToRefs(counter)
</script>
```

### 组合式API风格

[![p9I9uPx.md.png](https://s1.ax1x.com/2023/05/21/p9I9uPx.md.png)](https://imgse.com/i/p9I9uPx)

### storeToRefs的使用

如果直接从pinia中解构数据，会丢失响应式， 使用storeToRefs可以保证解构出来的数据也是响应式的。

```vue
<script setup>
import { storeToRefs } from 'pinia'
import useCounterStore from './store/counter'

const counter = useCounterStore()
// 如果直接从pinia中解构数据，会丢失响应式
const { count, double } = counter

// 使用storeToRefs可以保证解构出来的数据也是响应式的
const { count, double } = storeToRefs(counter)
</script>
```

> 注意
>
> state和getter内的变量才需要通过 `storeToRefs` 中响应式结构，action内的方法直接解构获取即可。

