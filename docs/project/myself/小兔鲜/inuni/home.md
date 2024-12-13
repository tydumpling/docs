# 首页

## 头部自定义导航栏

首页头部想使用自定义的导航栏而非官方提供的导航栏，思路分析如下：

1. 去除官方提供的导航栏
2. 使用自定义的头部导航栏
3. 设置安全区域（重点）

安全区域是指部分机型上下部分会有一定的区域被遮挡，这部分区域需要做处理让内容有足够的内外边距不被挡住。这就是安全区域。

在 `uniapp` 中，官方推出了一个方法 `uni.getSystemInfoSync()` ，其中有一个属性 `safeAreaInsets` ，是一个对象，分别是 `top` 、`left` 、`bottom` 、`right` 四个属性，表示各自的安全区域距离。

获取到安全区域距离后再通过 `style` 动态设置样式即可，代码如下：

```vue
<script setup lang="ts">
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<template>
  <view class="navbar" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
    <!-- ... -->
  </view>
</template>
```

## 自定义组件导入

`uni-ui` 的组件在 `pages.json` 文件中通过 `easycom` 对象设置配置规则，因此使用时可直接使用而无需导入。在 `components` 中配置的自定义组件也可以设置自动导入。

首先需要规定这些自定义组件的统一开头，本项目以 `Xtx + 组件名` 的格式。在 `pages.json` 文件中配置规则，代码如下：

```json
{
  // 组件自动引入规则
  "easycom": {
    // ...
    "custom": {
      // ...
      // 自己封装的组件规则配置，以Xtx开头，在components文件查找引入
      "^Xtx(.*)": "@/components/Xtx$1.vue"
    }
  },
}
```

配置完需要先重启项目，然后才能生效。配置完后发现这个自定义组件 `ts` 类型为 `unknown` ，因此要做额外的配置。

在 `src/components` 文件夹下新建一个 `components.d.ts` 文件，用于配置组件类型。代码如下：

```tsx
import XtxSwiper from './XtxSwiper.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    XtxSwiper: typeof XtxSwiper
  }
}
```

现在组件拥有 `ts` 类型了。

## 滚动组件Scroll-view

### 上拉加载

项目中自定义头部是要固定在页面顶部的，其他内容则在页面中滚动。此处可以使用 `uniapp` 提供的 `scroll-view` 组件，使用方法如下：

1. 把需要滚动的内容放到 `scroll-view` 组件内
2. 设置滚动方向，本项目是纵轴滚动，因此需要设置 `scroll-y` 
3. 通过 `scrolltolower` 方法实现上拉触底，调用接口获取新数据实现上拉加载

代码如下所示：

```vue
<template>
  <!-- 自定义头部 -->
  <CustomNavBar />
  <scroll-view scroll-y class="scroll-view" @scrolltolower="onScrolltolower">
    <!-- 轮播图 -->
    <XtxSwiper :list="bannerList" />
    <!-- 分类 -->
    <CategoryPanel :list="gategoryList" />
    <!-- 推荐 -->
    <HotPanel :list="hotList" />
    <!-- 猜你喜欢 -->
    <XtxGuess ref="guessRef" />
  </scroll-view>
</template>
```

### BUG

运行后发现并没有效果，且无法触发触底事件。查看其结构，发现 `scroll-view` 组件的高度是内容的高度，因此不会触发滚动，也不会触发触底加载事件。

解决方法为给 `scroll-view` 组件设置一个高度，代码如下：

```vue
<style lang="scss">
page {
  height: 100vh;
  background-color: #f7f7f7;
}

.scroll-view {
  height: calc(100vh - 200rpx);
}
</style>
```

现在效果能够生效了。

### 下拉刷新

`scroll-view` 组件可通过 `refresherrefresh` 方法实现下拉刷新，该方法触发时间点是 `scroll-view` 未上拉的情况下下拉，且会显示加载 `loading` 。

通过该方法实现下拉刷新，代码如下：

```vue
// 下拉刷新
const onRefresherrefresh = async () => {
  // 加载数据
  getBannerFn()
	getCategoryFn()
	getHotFn()
  guessRef.value?.reset()
}
```

但是这个代码有两个缺陷：

1. 下拉刷新完毕后 `loading` 效果没有消失
2. 同步任务下没能等接口执行完毕 `loading` 效果就会取消，而一个个添加 `await` 则会导致等待时间过长

我们需要让每个接口都执行完毕后再让 `loading` 效果消失。等待多接口执行完毕可使用 `Promise.all` 方法，等待数组内的接口执行完毕后再往下执行。

而 `scroll-view` 组件通过属性 `refresher-triggered` 控制是否显示 `loading` 加载。

代码如下：

```vue
<script setup lang="ts">
// ...

const isTriggered = ref<boolean>(false)
// 下拉刷新
const onRefresherrefresh = async () => {
  // 加载数据
  isTriggered.value = true
  await Promise.all(
    [getBannerFn(), getCategoryFn(), getHotFn()].map((v) =>
      v.catch((err) => uni.showToast({ icon: 'none', title: err })),
    ),
  )
  guessRef.value?.reset()

  // 加载完毕关闭动画
  isTriggered.value = false
}
</script>

<template>
  <!-- 自定义头部 -->
  <CustomNavBar />
  <scroll-view
    refresher-enabled
    scroll-y
    class="scroll-view"
    :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="onScrolltolower"
  >
    <!-- ... -->
    <XtxGuess ref="guessRef" />
  </scroll-view>
</template>
```

## 泛型与不确定类型

### 不确定类型实现

有一个接口为获取猜你喜欢的数据，但是首页和详情页两个接口的数据有一个对象不一样，为不确定的类型。

通过泛型来实现这个不确定的类型，调用时使用 `<类型>` 来把类型传给该属性，让其拥有对应接口需要的类型。代码如下：

通用接口类型：

```js
/** 通用分页结果类型 */
export type PageResult<T> = {
  /** 列表数据 */
  items: T[]
  /** 总条数 */
  counts: number
  /** 当前页数 */
  page: number
  /** 总页数 */
  pages: number
  /** 每页条数 */
  pageSize: number
}
```

首页猜你喜欢数据类型：

```js
/** 猜你喜欢-商品类型 */
export type GuessItem = {
  /** 商品描述 */
  desc: string
  /** 商品折扣 */
  discount: number
  /** id */
  id: string
  /** 商品名称 */
  name: string
  /** 商品已下单数量 */
  orderNum: number
  /** 商品图片 */
  picture: string
  /** 商品价格 */
  price: number
}
```

在接口函数中使用：

```js
// 首页猜你喜欢
export const getHomeGuessApi = (pageParams: PageParams) => {
  return http<PageResult<GuessItem>>({
    method: 'GET',
    url: '/home/goods/guessLike',
    data: pageParams,
  })
}
```

### 转为确定类型

现在有一个类型如下：

```js
/** 通用分页参数类型 */
export type PageParams = {
  /** 页码：默认值为 1 */
  page?: number
  /** 页大小：默认值为 10 */
  pageSize?: number
}
```

可以看到，其两个属性类型都是 `number | undefined` ，因此如果为其赋值 `number` 类型的数据，就会出现 `ts` 类型的报错。代码如下：

```js
const pageParams = ref<PageParams>({
  page: 1,
  pageSize: 10,
})

pageParams.value.page++ // 出现报错
```

解决方法有两种：

1. 非空断言

   使用断言可以解决，代码如下：

   ```js
   pageParams.value.page!++
   ```

2. 转为确定类型

   他会出现报错是因为当初不确定是否会有该属性，因此为其设置 `?` ，导致其类型为 `number | undefined` 。把其转为确定类型就能解决该报错。

   转为确定类型需要通过 `Required` 设置，代码如下：

   ```js
   const pageParams = ref<Required<PageParams>>({
     page: 1,
     pageSize: 10,
   })
   ```

## 组件实例类型定义

通过 `ref` 可以获取组件实例，但是获取到的数据 `ts` 类型为 `any` 。

通过 `ts` 的 `instance` 可以设置组件实例的类型，代码如下：

- 声明类型

  ```js
  import XtxGuess from '@/components/XtxGuess.vue'
  
  // ...
  
  // 猜你喜欢组件实例类型
  export type XtxGuessInstance = InstanceType<typeof XtxGuess>
  ```

- 设置类型

  ```js
  import type { XtxGuessInstance } from '@/types/components'
  
  const guessRef = ref<XtxGuessInstance>()
  ```

现在鼠标悬停在该变量上，组件实例变量已经设置好类型了。

## 骨架屏设置

微信小程序可以自动生成骨架屏代码，生成成功后代码在微信开发工具中，位置如下图：

![骨架屏位置](https://megasu.gitee.io/uni-app-shop-note/assets/home_picture_8.90926ae4.png)

首页引入骨架屏，放到对应的位置，并通过 `v-if` 判断与真实内容取反即可。