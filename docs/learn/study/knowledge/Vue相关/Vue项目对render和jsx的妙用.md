# Vue项目对render和jsx的妙用

## Vue组件的本质

先看一个例子：

我们有一个数组，需要把这个数组渲染成多个表格列的形式。如果直接在 `template` 中写代码，则需写成如下形式：

```vue
<table>
  <tbody>
  	<tr v-for="item in list" :key="item.id">
      <td>{{ item.name }}</td>
      <td v-if="item.status === 0">状态1</td>
      <td v-if="item.status === 1">状态2</td>
      <td v-if="item.status === 2">状态3</td>
      <td v-if="item.status === 3">状态4</td>
      <td v-if="item.status === 4">状态5</td>
    </tr>
  </tbody>
</table>
```

可以看出代码十分冗余，如果状态多的话还要写很多类似代码。

**如果模板内容需要复杂的比较逻辑实现时，可以利用 `render` 函数来决定模板的内容，这样会比 `vue` 指令更加简洁和高效。**

编写 `.vue` 文件其实最后都会变成一个对象:

```vue
<template>
 <div>
   {{ msg }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'hello'
    }
  }
}
</script>
```

编译后变成如下形式的对象：

```js
let component = {
  template: '<div>{{msg}}</div>',
  data() {
    return {
      msg: 'hello'
    }
  }
}
```

因此我们可以通过对象设置 `render()` 方法属性，配合 `Vue` 提供的 `createElementVNode()` 方法与 `jsx` 语法创建复杂的 DOM 元素，比如表格。

 `createElementNode()` 方法需要传入三个参数，分别为：

1. 所要创建的标签，如 `div` 、`span` 等
2. 该标签的属性对象，如样式 `style` 、类名 `class` 、`id` 等
3. 内容

上方示例代码使用 `render` 函数后改成以下形式：

```vue
<script setup>
let statuTable = {
  name: 'tag',
  props: ['status']
  render() {
    let statusMap = [
      {
        text: '状态1',
      },
      {
        text: '状态2',
      },
      {
        text: '状态3',
      },
      {
        text: '状态4',
      },
      {
        text: '状态5',
      }
    ]
    
    return createElementVNode('span', { style: 'color:'+'green'}, statusMap[this.status].text)
  }
}
</script>
```

使用时以该对象的名称作为标签的名称，通过传参的形式 `jsx` 可以通过 `props` 属性获取到传参的值。代码如下：

```vue
<table>
	<tbody>
  	<tr v-for="item in list" :key="item.id">
      <td>{{ item.name }}</td>
    	<td><statuTable :status="item.status"></statuTable></td>
    </tr>
  </tbody>
</table>
```

## JSX和render的特殊场景使用

首先需要注意一点：

JSX 并不是和 React 绑定的，我们可以在任何地方使用 JSX 。比如 Vue，JSX虽然让我们失去使用 Vue 模板指令的能力，但也对一些复杂模板表达更灵活。

上方案例添加一个条件：表格需要筛选数据，名称为王五或赵六的数据不渲染。如果传统写法 `template` ，需要 `v-if` 来判断，代码如下：

```vue
<table>
  <tbody>
  	<tr v-for="item in list" :key="item.id">
      <template v-if="item.name !== '王五' || item.name！== ‘赵六'">
      	<td>{{ item.name }}</td>
      	<!-- ...... -->
      </template>
    </tr>
  </tbody>
</table>
```

JSX 使用方式如下：

1. 先把 `script` 改为 JSX ：

   ```vue
   <script setup lang="jsx"></script>
   ```

2. 创建一个函数书写 JSX 语法

   ```jsx
   function TrList() {
     return <>
       {
       	list.map((item) => {
           if(item.name === '王五' || item.name === '赵六') {
             return ''
           } else {
             return <tr>
               <td>{item.name}</td>
               <td><statusTable>{item.status}</statusTable></td>
             </tr>
           }
         })
     	}
     </>
   }
   ```

3. 使用

   ```vue
   <table>
     <tbody>
     	<TrList></TrList>
     </tbody>
   </table>
   ```

## 总结

### Render

**Render 函数是 Vue2.x 新增的一个函数、主要用来提升节点的性能，它是基于 JavaScript 计算。使用 Render 函数将 Template 里面的节点解析成虚拟的 Dom 。**

> Vue 推荐在绝大多数情况下使用模板来创建你的 HTML。然而在一些场景中，你真的需要 JavaScript
> 的完全编程的能力。这时你可以用渲染函数，它比模板更接近编译器。

简单的说，在 Vue 中我们使用模板 HTML 语法组建页面的，使用 Render 函数我们可以用 Js 语言来构建 DOM。
因为 Vue 是虚拟 DOM，所以在拿到 Template 模板时也要转译成 VNode 的函数，而用 Render 函数构建 DOM，Vue 就免去了转译的过程。

通过 `createElementVNode` 方法可以实现 `render` 函数编译 DOM 元素。

### JSX

React 使用一种名为 JavaScript XML (JSX) 的特殊语法。 借助 JSX，你可将 HTML（或可能会创建的自定义组件）和 JavaScript 集成到一个文件中，甚至可以集成到单个代码行中。 通过使用 JSX，你可以依赖 JavaScript 语法来实现逻辑。 

> 注意
>
> JSX 依赖于可扩展标记语言 (XML)。 XML 的语法类似于 HTML。 许多情况下，你可能都不会注意到二者之间的差异。 但是，XML 对语法有几点重要的限制：

- 所有元素都必须放置在一个父元素内。
- 必须结束所有元素。

生成过程：

浏览器本身不支持 JSX。 因此，必须从 JSX 文件生成 JavaScript 和 HTML，才能由浏览器呈现它们。 有几种捆绑程序和其他工具可以执行所需完成的任务。 这些工具包括 [Webpack](https://webpack.js.org/)、[Parcel](https://parceljs.org/) 和 [Snowpack](https://www.snowpack.dev/)。 我们将使用 Snowpack，因为它不需要代码，也不需要额外编写脚本。

组件：

React 开发基于组件完成。 组件是自包含显示和工作单元。 它们可在应用程序中重复使用。 你可使用它们将应用程序按逻辑分解为更小的区块（或组件）。