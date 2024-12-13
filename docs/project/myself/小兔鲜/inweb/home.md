# Home 首页

## 整体结构创建

![image.png](https://cdn.nlark.com/yuque/0/2023/png/274425/1675417667651-eb841c73-5b36-48a5-a8ee-118dbeaaeb0d.png#averageHue=%23fcf8f8&clientId=u19c1ce9d-cad7-4&from=paste&height=458&id=u7e2d2595&name=image.png&originHeight=916&originWidth=1368&originalType=binary&ratio=1&rotation=0&showTitle=false&size=37531&status=done&style=none&taskId=uf8f39479-333b-4074-b888-53dc829c807&title=&width=684)

1- 按照结构新增五个组件，准备最简单的模版，分别在Home模块的入口组件中引入

- HomeCategory
- HomeBanner
- HomeNew
- HomeHot
- HomeProduct

```vue
<script setup>
</script>

<template>
  <div> HomeCategory </div>
</template>
```

2- Home模块入口组件中引入并渲染

```vue
<script setup>
import HomeCategory from './components/HomeCategory.vue'
import HomeBanner from './components/HomeBanner.vue'
import HomeNew from './components/HomeNew.vue'
import HomeHot from './components/HomeHot.vue'
import homeProduct from './components/HomeProduct.vue'
</script>

<template>
  <div class="container">
    <HomeCategory />
    <HomeBanner />
  </div>
  <HomeNew />
  <HomeHot />
  <homeProduct />
</template>
```

## 分类实现

准备详细模版，导入 pinia 内保存的 list 数组，动态渲染数据

## 面板实现

可以发现，新鲜好物与人气推荐两个模块结构几乎相等，因此可以考虑把它们相同的结构抽离出来作为一个骨架，不同的部分使用各自的数据。

> 组件参数可通过两种方式获取：
>
> - prop：内容不复杂，单纯纯文本等的标题
> - 插槽：内容为复杂的模板

使用：

```vue
<HomePanel title="新鲜好物" subTitle="新鲜好物，好多商品">
  <div>新鲜好物的插槽</div>
</HomePanel>
<HomePanel title="人气推荐" subTitle="人气推荐，猜你喜欢">
  <div>人气推荐的插槽</div>
</HomePanel>
```

## 新鲜好物与人气推荐

调用接口渲染数据即可

## 图片懒加载

- 判断图片是否进入视口区域
- 为图片添加地址

`vueuse` 中有一个方法判断当前元素是否进入视口中：`useIntersectionObserver` 。因此设置一个自定义事件，判断元素是否在视口中，如果进入可视区域，则把值给元素的 `src` 属性。其中：

- el：绑定了自定义事件的元素。因此可以 `el.src` 
- binding：等号后的值，可以把图片路径赋过来

```js
import { useIntersectionObserver } from '@vueuse/core'

// 图片懒加载自定义指令
app.directive('img-lazy', {
  mounted (el, binding) {
    // el：指令绑定的元素
    // binding：指令等号后的值
    console.log(el, binding);
    const { stop } = useIntersectionObserver(
      el,
      ([{ isIntersecting }]) => {
        console.log(isIntersecting)
        if (isIntersecting) {
          // 进入视口区域
          el.src = binding.value
          stop()
        }
      },
    )
  }
})
```

组件中：

```vue
<img v-img-lazy="item.picture" alt="" />
```

### 优化

- 逻辑书写位置不合理

  懒加载指令逻辑不能直接写在入口文件，入口文件通常只做一些初始化的事情，不应该包含太多的逻辑代码。应该封装为插件， `main.js` 入口文件只需要负责注册插件即可。

  `src/directives.js` ：

  ```js
  // 定义懒加载插件
  import { useIntersectionObserver } from '@vueuse/core'
  
  export const lazyPlugin = {
    install(app) {
      // 懒加载指令逻辑
      // 图片懒加载自定义指令
      app.directive('img-lazy', {
        mounted(el, binding) {
          // el：指令绑定的元素
          // binding：指令等号后的值
          console.log(el, binding);
          const { stop } = useIntersectionObserver(
            el,
            ([{ isIntersecting }]) => {
              console.log(isIntersecting)
              if (isIntersecting) {
                // 进入视口区域
                el.src = binding.value
                stop()
              }
            },
          )
        }
      })
    }
  }
  ```

  `main.js` ：

  ```js
  // 引入懒加载指令插件并且注册
  import { lazyPlugin } from "@/directives"
  
  const app = createApp(App)
  
  app.use(createPinia())
  app.use(lazyPlugin)
  ```

- 重复监听问题

  `useIntersectionObserver` 对于元素的监听是不合理的，除非手动停止监听，存在内存浪费。

  解决思路：在监听的图片第一次完成加载之后就停止监听。

  ```js
  const { stop } = useIntersectionObserver(
    el,
    ([{ isIntersecting }]) => {
      console.log(isIntersecting)
      if (isIntersecting) {
        // 进入视口区域
        el.src = binding.value
        stop()
      }
    },
  )
  ```

## 产品列表实现

1. 准备静态模板

2. 封装接口

   ```js
   // 获取产品列表的数据
   export const getGoodsAPI = () => {
     return http({
       url: '/home/goods'
     })
   }
   ```

3. 获取数据渲染

4. 图片懒加载

## GoodsItem组件封装

把重复使用的商品项结构封装为一个组件，减少重复代码量，方便复用。封装核心思想：

- 把要显示的数据对象设计为 `props` 
- 如果有复杂结构用插槽

