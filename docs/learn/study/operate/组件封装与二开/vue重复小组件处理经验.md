# vue重复小组件处理经验

## 重复小组件处理经验

### 场景模拟

现有一个项目需求需要使用一个授权提示弹窗组件，有多个页面组件需要检测用户是否授权，如果未授权则弹出弹窗提示授权。用户可选择同意或拒绝。该弹窗需求和组件库不太一致，需要自行编写。

该弹窗组件在封装时需要注意：

1. 该弹窗显示的时机不一致，可能在 A 页面是一进入就显示，在 B 页面就点击按钮显示
2. 该弹窗同意或拒绝按钮执行的后续不一致，拒绝隐藏弹窗，同意调用接口，后续操作看各自组件需求

### render方案

把弹窗封为一个组件，点击行为传给组件，通过 `v-if` 控制显隐

缺点：每次都得写组件显隐控制逻辑，还得引入，注册弹窗组件。

希望能像 `element-ui` 的 `messagebox` 方法一样，调用方法就能弹出弹窗。

实现思路如下：

1. 用 `createVnode` 或者 `jsx` 编写组件结构
2. 用 `render` 方法渲染在一个 `div` 里
3. 用 `appendChild` 方法加入

```js
import {createVNode, render} from 'vue'

export const signProp = (content) => {
  // 创建虚拟dom，参数一：dom标签；参数二：dom属性，包括class类名、id、style样式等；参数三：内容，可为数字文本，也可为虚拟dom
  let pop = createVNode('div', {
    class: 'divcover'
  }, {
    createVNode('div', {
      class: 'popcontent'
    }, content)
  })
  
  // 参数一：要渲染的虚拟dom；参数二，要渲染到那个真实dom上
  render(pop, document.body)
}
```

现在页面上就有一个没有样式的效果了。但是这种方法不推荐，更推荐使用 `jsx` 。

### jsx方案

```jsx
import {render} from 'vue'

export const signProp = (content) => {
  let pop = <div class="cover">
  	<div class="covercontent">
        <div>{content}</div>
      	<div>
      		<button onClick={() => {
              document.body.removeChild(pop.el) // 这里需要真实dom，虚拟dom会报错
            }}>不同意</button>
          <button>确认签署</button>
      	</div>
    </div>
  </div>
  
  // 参数一：要渲染的虚拟dom；参数二，要渲染到那个真实dom上
  render(pop, document.body)
}
```

这么写点击按钮后页面能生成对应的 DOM，点击不同意按钮也能卸载。但是再次点击按钮后不再生成 DOM 了，因为 `render` 函数只会执行一次，执行完之后虽然页面的真实 DOMM 被删除了，但是 `render` 认为你已经挂载了，就不再执行。

参考一下 `element-ui` 的方法修改一下。

```jsx
import {render} from 'vue'

export const signProp = (content, handler) => {
    let div = document.createElement('div')
    let pop = <div class="dialog-cover">
  	    <div class="dialog-cover-content">
            <div class="content">{content}</div>
            <div class="btns">
      		    <button onClick={() => {
                    document.body.removeChild(div) // 这里需要真实dom，虚拟dom会报错
                    handler.cancel && handler.cancel()
                }}>不同意</button>
                <button onClick={() => {
                    document.body.removeChild(div) // 这里需要真实dom，虚拟dom会报错
                    handler.confirm && handler.confirm()
                }}>确认签署</button>
      	    </div>
        </div>
    </div>
  
  // 参数一：要渲染的虚拟dom；参数二，要渲染到那个真实dom上
  render(pop, div)
  document.body.appendChild(div)
}
```

它是通过原生 DOM 来加入到 `body` 内，这样他就不会管虚拟 DOM 是否挂载。

现在可以在各个需要的场景使用该方法了。

```vue
<script setup>
import {signProp} from './signProp.jsx'
</script>

<template>
	<button @click="signProp('我是内容文本', {
    confirm: () => {},
    cancel: () => {}
    })"
   >click me</button>
</template>
```

注意的是，有一些场景可能用不到 `cancel` 之类的按钮点击事件，没有传对应的函数方法，需要有良好的代码健壮性意识，添加非空判断，避免代码报错。

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/detail/learn/repeat" />