# 项目总结

## 项目信息

小兔鲜项目是基于 `Vue3` 搭建， `pinia` 全局状态管理， `vue-router` 路由配置， `axios` 发送前后端请求， `elementPlus` 组件库实现。

本项目主要包含以下模块：

- 首页
- 分类页
- 商品详情页
- 登录页
- 支付页

线上完整项目：[tydumpling小兔鲜](https://duyidao.gitee.io/rabit/)

项目仓库以及打包方式指路：[tydumpling小兔鲜仓库](https://gitee.com/duyidao/rabit)

## 项目亮点

### 图片懒加载

#### 思路

通过 `vueuse` 提供的 `useIntersectionObserver()` 方法函数，官网文档指路：[useIntersectionObserver](https://vueuse.org/core/useIntersectionObserver/#useintersectionobserver)。

通过该方法获取绑定的元素节点是否出现在页面视图上，使用方法如下：

```js
const targetRef = ref(null); // 需要绑定的dom节点

const { stop } = useIntersectionObserver(targetRef, ([{ isIntersecting }]) => {
  console.log(isIntersecting);
  if (isIntersecting) {
    // 进入视口区域
  }
});
```

其中传递两个参数：

- 参数一：需要绑定的 DOM 节点（可通过 `ref` 和 `document` 获取）
- 参数二：节点出现在视图内的回调函数，其中可获取参数 `isIntersecting ` ，为 `true` 说明绑定的节点已经出现在视图中，`false` 反之

方法 `useIntersectionObserver()` 返回一个方法 `stop` ，用于停止该节点的方法侦听绑定。

页面上许多 `img` 标签都需要该懒加载方法，封装为一个全局自定义指令是比较好的选择，这样每个页面的 `img` 标签都可使用。

在 `Vue3` 中，自定义指令封装的思路为：

1. 创建一个 `directives/index.js` 文件，按需导出一个对象（如本案例中的 `lazyPlugin` ）
2. 入口文件中导入该对象，通过 `app.use()` 注册自定义指令到全局中
3. `directives/index.js` 文件中通过 `install` 函数挂载自定义指令，其参数 `app` 为全局 `Vue`
4. 通过 `app.directive()` 设置自定义指令逻辑，其接收两个参数：
   - 参数 1：自定义指令名称
   - 参数 2：对象，包含多个生命周期
5. 在组件挂载生命周期函数中获取到使用的组件 `el` ，当其进入可视区域后为其 `src` 属性赋值。通过 `binding.value` 获取自定义指令中等号后的值
6. 赋值后用 `stop()` 停止侦听事件，减少不必要的性能消耗

#### 代码

`directives/index.js`：

```js
// 定义懒加载插件
import { useIntersectionObserver } from "@vueuse/core";

export const lazyPlugin = {
  install(app) {
    // 懒加载指令逻辑
    // 图片懒加载自定义指令
    app.directive("img-lazy", {
      mounted(el, binding) {
        // el：指令绑定的元素
        // binding：指令等号后的值
        const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
          if (isIntersecting) {
            // 进入视口区域
            el.src = binding.value; // binding.value获取到vue组件中 ="" 内的值，此时给 src属性赋值，让其渲染图片
            stop();
          }
        });
      },
    });
  },
};
```

`main.js`：

```js
// 引入懒加载指令插件并且注册
import { lazyPlugin } from "@/directives";

const app = createApp(App);

app.use(lazyPlugin);
```

使用：

```vue
<img v-imh-lazy="图片路径" />
```

### 路由缓存优化

本项目中，主要分为一级分类和二级分类，分别为一级路由 `/category/${id}` 和二级路由 `/category/sub/${id}` 。在 `Vue3` 中，相同的组件实例将会被重复使用，减少性能消耗。但是这也意味着生命周期钩子不会被调用。

因此当我们从某个分类模块切换到另一个分类模块时，页面会使用缓存的数据，不会重新调用接口。

解决方法有两个：

1. 让组件实例不再复用，强制销毁重建
2. 监听路由变化，变化后执行数据更新操作

#### 强制销毁

在 `Vue` 中，`:key` 不仅可以作为 `v-for` 循环时虚拟 DOM 的唯一标识，供 Diff 算法使用，还能作用于强制替换一个元素、组件而不是复用它。

在对应的一级路由和二级路由 `router-view` 页面设置 `:key` ，值为当前完整路由路径。代码如下：

```vue
<router-view :key="$route.fullPath"></router-view>
```

运行后效果实现，查看网络请求发现他把所有接口都调用了一遍，如果接口多的话会造成不必要的性能消耗。

#### 侦听路由

`Vue-router` 提供一个方法 `onBeforeRouteUpdate()` ，当路由发生变化时就会触发，其参数一可接收最新的路由数据，因此可以通过该参数获取最新的路由参数，单独调用分类模块的接口，做到数据刷新即可。

```js
import { onBeforeRouteUpdate } from "vue-router";

/**
 * 侦听路由变化，重新调用接口
 * to：当前最新路由参数
 * */
onBeforeRouteUpdate((to) => {
  // 存在问题：使用最新的路由参数请求最新的分类数据
  getTopCategoryFn(to.params.id);
});
```

### 业务逻辑拆分

通过把相关功能的变量与函数方法拆分到各自的 `js` 文件中，用一个函数封装，`return` 返回 `.vue` 组件需要使用的方法和变量，通过按需导出的方式导出该函数。

> 命名采取 `useXxxx` 的 `use + 功能名` 驼峰命名规范

```js
import { onMounted, ref } from "vue";
import { getBannerAPI } from "@api/layout";

export function useBanner() {
  const bannerList = ref([]); // 轮播图数组

  const getBannerFn = async () => {
    const res = await getBannerAPI({
      distributionSite: "2",
    });
    bannerList.value = res.result;
  };

  onMounted(() => {
    getBannerFn();
  });

  return {
    bannerList,
  };
}
```

在 `.vue` 组件中导入该函数，通过解构获取其 `return` 返回的值，代码如下所示：

```js
import { useBanner } from "./composables/useBanner";

const { bannerList } = useBanner();
```

这样有利于代码的维护，后续新增功能时只需前往对应的 `useXxxx.js` 文件新添功能即可。

### v-model 组件实现

`v-model` 是一个语法糖，在 `vue3` 中父组件通过 `v-model` 绑定变量，实际上子组件是通过 `:modelValue` 绑定数据，`emit` 函数调用 `update:modelValue` 修改数据。

本项目中通过这个特性，在子组件使用 `v-model` 的特性实现功能。代码如下所示：

- 父组件中通过 `v-model` 绑定一个布尔值控制子组件的显示隐藏

  ```vue
  <AddressDialog v-model="show" />
  ```

- 子组件通过 `:modelValue` 为 `dialog` 组件绑定变量，并声明 `emit` ，在其关闭函数事件中使用：

  ```vue
  <script setup>
  defineProps({
    show: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(["update:modelValue"]);

  const handleCloseFn = () => {
    emit("update:modelValue", false);
  };
  </script>

  <template>
    <el-dialog
      :modelValue="show"
      title="切换收货地址"
      width="30%"
      center
      @close="handleCloseFn"
    ></el-dialog>
  </template>
  ```

### 倒计时封装

通过 `dayjs` 第三方库和原生 `js` 封装一个倒计时功能的方法。

在命名方面遵循 `useXxx()` 的规范。该方法通过导出一个变量 `formatTime` 供组件渲染页面；通过导出一个 `start` 方法执行时间倒计时功能，接收一个倒计时参数。步骤如下：

1. 接收到数据后把数据保存到变量中，开启定时器每秒自减一
2. 通过计算属性配合 `dayjs` 把数据转为 `xx分xx秒` 的格式
3. 最后监听页面销毁事件，清除定时器

代码如下所示：

```js
// 封装倒计时逻辑函数
import { computed, ref, onUnmounted } from "vue";
import dayjs from "dayjs";

export const useCountDown = () => {
  // 1.响应式数据
  const time = ref(0);
  // 格式化为时间xx分xx秒的形式（可用计算属性）
  const formatTime = computed(() => dayjs.unix(time.value).format("mm分ss秒"));

  let timer = null;

  // 2.开启倒计时的函数
  const start = (currentTime) => {
    // 先赋值
    time.value = currentTime;
    // 每隔一秒钟就自减一
    timer = setInterval(() => {
      time.value -= 1;
    }, 1000);
  };

  // 组件销毁时取消定时器
  onUnmounted(() => {
    timer && clearInterval(timer);
    timer = null;
  });

  return { formatTime, start };
};
```

使用：

```vue
<script setup>
import { useCountDown } from "@/hooks/useCountDown";
const { formatTime, start } = useCountDown();

start(60);
</script>
```

## 遇到的 BUG

### 数据渲染 cannot read xx of undefined

后端返回的数据格式如下：

```js
{
  result: {
    list: [
      {
        img: "xxx",
        name: "xxx",
      },
    ];
  }
}
```

页面渲染对应内容时写为 `res.result.list[0].name` 。但由于请求是异步的，在请求返回前会先渲染一次 DOM 元素。

而此时 `res.result` 是一个空对象，空对象点语法获取到的是 `undefined` ，`undefined` 再使用 `[0]` 就会报错。

解决方法有两种：

1. 可选链 `?.`
2. `v-if` 动态渲染

#### 可选链

可选链最大的优点是简单快捷，使用方法如下：

```js
{
  {
    res.result.list?.[0].name;
  }
}
```

当 `res.result` 还未返回数据时 `.list` 拿到的是 `undefined` ，后续操作不会执行，因此不会出现报错。

> 缺点
>
> 当组件中有多处地方使用到类似的多层数据渲染，需要一个个加上可选链，步骤繁琐且代码繁杂。

#### 动态渲染

在外层标签中添加一个 `v-if` 标签，判断 `res.result.list` 是否有数据，如果有数据才会显示内部的 DOM 节点，此时必定能获取到数据，也就不会报错。

> 缺点
>
> 当只有一两个元素时代码没有可选链那么简便。

### 状态存储无响应式

购物车模块中购物车数据多个页面需要使用，因此把数据放到 `pinia` 中做状态管理存储，其增删改查函数也声明在 `pinia` 中并对外暴露供外部使用，代码如下：

```js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCarttStore = defineStore('cart', () => {
  const cartList = ref([]) // 购物车列表数据

  // 添加购物车操作
  const addCart = async (e) => {
    // ...
  }

  return { cartList, ... }
}, {
  persist: true
})

```

在页面中通过导入该函数方法并解构出对应的函数和变量来使用，代码如下所示：

```js
import { useCarttStore } from "@/stores/cart";

const { cartList } = useCarttStore();
```

但是在使用时发现数据没能做到响应式，在做增加或删除处理时 `vue` 插件和本地存储的数据已经是新的数据了，而页面中还是旧的数据，手动刷新后才能获取到最新的数据。

这是因为通过上方的方法获取到 `pinia` 内的数据不是响应式的，因此不会响应发生变化，使用的 `storeToRefs` 方法后把变量变为响应式，代码如下：

```js
import { useCarttStore } from "@/stores/cart";
import { storeToRefs } from "pinia";

const { cartList } = storeToRefs(useCarttStore());
```

保存运行后数据能够响应式的变化。更多详细功能可前往 [购物车](/project/myself/小兔鲜/inweb/购物车) 模块查看。

### 部署

项目完成后需要打包部署，放到 `gitee pages` 上代理。在部署的时候勾选了 “强制使用 HTTPS” 的选项，部署完后接口请求被拦截了，并报了以下的错误：

[![pCZ92wR.png](https://s1.ax1x.com/2023/06/11/pCZ92wR.png)](https://imgse.com/i/pCZ92wR)

原因：

在 https 中请求 http 接口或引入 http 资源都会被直接 blocked（阻止），浏览器默认此行为不安全，会拦截。

解决方案：

在 `index.html` 里添加下方代码，强制将 http 请求转成 https(SSL 协议)请求。

```html
<meta
  http-equiv="Content-Security-Policy"
  content="upgrade-insecure-requests"
/>
```

最后重新打包部署，能够正常请求数据。
