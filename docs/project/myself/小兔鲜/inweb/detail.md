# 详情页

## 数据渲染

1. 复制基础静态页面模板
2. 封装函数
3. 调用接口获取数据渲染页面

做完这些后保存运行，发现控制台却报错了。报错信息如下：

```js
Uncaught (in promise) TypeError: Cannot read properties of undefined (reading '0')
```

这是因为在数据是异步获取的，在返回前模板先渲染一次 DOM 结构，而此时对象还是空对象，`goodData.categories[0].name` 相等于 `undefined[0].name` ，自然会报错了。

解决方法有两个：

1. 可选链 `?.`

   ```vue
   {{ goodData.categories?.[0].name }}
   ```

2. `v-if` 判断

## 放大镜

使用 `vueuse` 中的 `useMouseInElement` 方法获取鼠标的位置，使用方法为：

1. 通过 `ref` 绑定一个节点元素
2. 把该节点元素放在方法`useMouseInElement` 内，获取其 `x` ，`y` ，`isOutside` 是否在节点元素内
3. 通过 `watch` 侦听变化后判断：
   - 假设图片宽高400，小框宽高100，则小框随鼠标移动的距离为 100 ~ 300 之间
   - 如果小于100或大于300，则让其宽高固定在边缘

```js
// 获取鼠标位置
const target = ref(null);
const { x, y, isOutside } = useMouseInElement(target);

const left = ref(0)
const top = ref(0)
watch([x, y, isOutside], () => {
  if(isOutside.value) return
  // 有效范围内横向和纵向控制
  if(x.value > 100 && x.value < 300) {
    left.value = x.value - 100
  }
  if(y.value > 400 && y.value < 600) {
    top.value = y.value - 400
  }

  // 处理边界
  if(x.value > 300) left.value = 200
  if(x.value < 100) left.value = 0
  if(y.value > 600) top.value = 200
  if(y.value < 400) top.value = 0
})
```

大图宽高是其2倍，方向相反，因此设为 `left * -2` 与 `top * -2` 即可。

### 总结

封装复杂交互组件的通用思路为：

1. 功能拆解
2. 寻找核心思路
3. 寻找相关技术
4. 逐个实现，逐个验证，逐个优化

该图片预览组件封装逻辑为：

1. 小兔切换大图显示；放大镜实现
2. 获取鼠标位移位置
3. useMouseInElement
4. 验证优化

## SKU

实际工作中，经常会使用第三方组件，熟悉一个第三方组件最快的方式除了看文档，还能查看其 `props` 和 `emit` 参数，前者是了解它需要什么内容，后者是查看它会返回什么内容回来。

### 全局组件注册

通过在 `components` 文件夹内用插件注册的方式注册全部组件，在入口文件中注册该插件即可。

`components/index.js` ：注册组件通过 `app.component` 注册，参数1为该组件的名称，参数2为该组件模块

```js
import XtxSku from './XtxSku/index.vue'
import BannerCarousel from './BannerCarousel.vue'

export const componentsPlugin = {
  install(app) {
    app.component('XtxSku', XtxSku)
    app.component('BannerCarousel', BannerCarousel)
  }
}
```

`main.js` ：

```js
// 引入全局组件插件并注册
import { componentsPlugin } from "@/components"
app.use(componentsPlugin)
```

