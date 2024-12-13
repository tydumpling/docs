# Vue3新特性

Vue3 新特性官方指路：[新特性](https://blog.vuejs.org/posts/vue-3-3#script-setup-typescript-dx-improvements) 。

## setup与Typescrupt

### defineProps

#### 更好的TS提示

在 Vue3 中，defineProps 能够更好的支持 TypeScript  类型提示，父组件引用子组件时能够有更好的 TypeScript 类型提示。代码示例如下：

1. 设置一个 ts 类型 `type.ts`

   ```ts
   export interface type {
       msg: string
   }
   ```

2. 子组件引入类型

   ```vue
   <script setup ts>
   import type { type } from './type.ts'
   
   defineProps<type>()
   </script>
   ```

3. 父组件使用子组件

   ```vue
   <div class="App">
       <h1>App</h1>
       <Hi />
   </div>
   ```

运行后鼠标悬停在子组件上，可以看到其 defineProps 的类型提示。如果没有设置 msg，他还会报警告提示。

![VBoOcq.png](https://i.imgloc.com/2023/07/10/VBoOcq.png)

还可以进行一个扩展，代码如下：

```vue
<script setup lang="ts">
import type { Props } from './foo'

// imported + intersection type
defineProps<Props & { age: number }>()
</script>
```

现在多了一个 age 变量的类型支持。

> 注意
>
> 该功能需要 vscode 下载 1.7.0 版本以上的 Vue Language Features (Volar) 插件搭配使用。
>
> ![VBoPEN.png](https://i.imgloc.com/2023/07/10/VBoPEN.png)

#### 更好的泛型支持

现在能够支持泛型设置，通过 `generic` 关键字来设置。步骤代码如下所示：

1. 子组件通过 `generic` 关键字设置泛型

   ```vue
   <script setup lang="ts" generic="T">
   defineProps<{
     items: T[]
     selected: T
   }>()
   </script>
   ```

   如果设置 T ，则该属性会根据父组件的传入自动推导 ts 类型。

   也可以直接声明其类型，如下：

   ```vue
   <script setup lang="ts" generic="T extends string | number">
   defineProps<{
     items: T[]
     selected: T
   }>()
   </script>
   ```

   此时 `items` 是数字或字符串组合的数组， `selected` 是单个数组或字符串。

2. 父组件使用子组件

   ```vue
   <div class="App">
       <h1>App</h1>
       <Hi :selected="true" />
   </div>
   ```

   子组件设置泛型后父组件为 `selected` 传递一个布尔值，不符合条件，ts 校验会报相应的错误。

以上步骤是关于 `setup` 语法糖的设置方法，它同时也支持 defineComponents 的方法，方法步骤如下：

1. 定义并导出一个 defineComponents 的泛型

   ```jsx
   import { defineComponents } from 'vue'
   
   export default defineComponents (<T,> (props: {msg}) => {
               return () => <div>{ props.msg }</div>
   })
   ```

   > 注意
   >
   > 1. 泛型 T 后面的逗号可能是开发者留下来的小 BUG，不然会报错。等待其后续的修复
   >
   > 2. 想要使用，需要提前在设置中打开
   >
   >    ```js
   >    export default defineConfig({
   >        plugins: [
   >            vue({
   >                script: {
   >                    propsDestructure: true
   >                }
   >            })
   >        ]
   >    })
   >    ```

2. 父组件引入

   ```vue
   <GenericT></GenericT>
   
   <script setup>
   import GenericT from './component/GenericT'
   </script>
   ```

   此时子组件也能拥有 ts 类型提示。

### defineEmits

子组件通过 defineEmit 设置自定义事件现在也可以设置 ts 类型了，设置完类型后子组件如果没有传对应类型的参数会有报错；父组件没有接收对应类型的自定义事件也会报错。

代码如下所示：

1. 子组件定义 defineEmits 及其传参的类型

   ```js
   const emit = defineEmits<{
     foo: [id: number]
     bar: [name: string]
   }>()
   ```

2. 使用自定义事件时需要传对应的类型参数

   自定义方法 `foo` 需要传一个参数，类型为数值型。

   自定义方法 `bar` 需要传一个参数，类型为字符串型。

   ```vue
   <button @click="handleClickFn">
       点我
   </button>
   
   <script setup lang="ts">
   const handleClickFn = () => {
       emit('foo', 1)
   }
   </script>
   ```

3. 父组件使用

   ```vue
   <Hi @bar="bar" @foo="foo" />
   ```

> 注意
>
> 也可以换一种写法，代码如下：
>
> ```js
> const emit = defineEmits<{
>   (e: 'foo', id: number): void
>   (e: 'bar', name: string): void
> }>()
> ```
>
> 写法可根据自己的项目选择。

### defineSlot

纯粹的 ts 支持，专门用于设置类型。写法如下：

1. 定义插槽需要的数据类型

   ```js
   defineSlot<{
       default: (props: {msg: string}) => any;
       foo: (props: {bar: number}) => any
   }>()
   ```

2. 子组件设置插槽

   ```vue
   <template>
   	<div>
           <slot msg="nnnn"></slot>
           <slot name="tydumpling" :bar="1"></slot>
       </div>
   </template>
   ```

3. 父组件使用插槽

   ```vue
   <Sloter>
   	<template v-slot="{msg}">
       	{{ msg }}
       </template>
       <template v-slot:foo="{bar, name}">
       	{{ bar, name }}
       </template>
   </Sloter>
   ```

> 注意
>
> `defineSlots()` 只接受类型参数，不接受运行时参数。类型参数应为类型文本，其中属性键是槽名称，值是槽函数。函数的第一个参数是插槽期望接收的道具，其类型将用于模板中的槽道具。 `defineSlots` 的返回值与从 `useSlots` 返回的插槽对象相同。

## 实验性功能

### Props 响应式解构

之前在解构 defineProps 的值时是没有响应式的，现在允许解构出来的值是响应式的。代码如下所示：

```js
const { msg } = defineProps()

watchEffect(() => {
    console.log(msg)
})
```

> 注意
>
> 1. 上方代码变量 `msg` 实际上是 `props.msg` ，所以能够监听获取到
>
> 2. 如果他传参给一个函数使用，则传参后的数据丢失了响应式，如下：
>
>    ```js
>    const { msg } = defineProps()
>    
>    useXxx(msg)
>    
>    const useXxx = (msg) => {
>        console.log(msg)
>    }
>    ```

### defineModel 语法糖

以前，对于支持与 `v-model` 的双向绑定的组件，它需要：

1. 声明一个 prop
2. 在打算更新 prop 时发出相应的  `update:propName` 事件

代码如下：

```vue
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
console.log(props.modelValue)

function onInput(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <input :value="modelValue" @input="onInput" />
</template>
```

Vue3.3 通过新的 `defineModel` 宏简化了用法。宏会自动注册一个 prop，并返回一个可以直接变异的 ref：

```vue
<script setup>
const bar = defineModel()
console.log(bar.value)
</script>

<template>
  <input v-model="bar" />
</template>
```

父组件使用：

```vue
<script setup>
const bar = ref('tydumpling')
</script>

<template>
  <DefineModel v-model:bar="bar" />
</template>
```

此功能是实验性的，需要在 `vite.config.js` 文件中明确选择加入。

```js
export default defineConfig({
    plugins: [
        vue({
            script: {
                //...
                defineModel: true
            }
        })
    ]
})
```

## 其他功能

### defineOptions

新的 `defineOptions` 宏允许直接在 `<script setup>` 中声明组件选项，而无需单独的 `<script>` 块：

```vue
<script setup>
defineOptions({ 
    inheritAttrs: false,
    name: 'tydumpling'
})
</script>
```

在之前想要给组件添加 `name` 属性不能写在 `setup` 中，只能另起一个 `script` ，如下：

```vue
<script setup></script>
<script>
export default {
    name: 'tydumpling'
}
</script>
```

### toRef

```js
import { ref, toRef } from 'vue'

const himeSelf = ref(2)

const mySelfRef = toRef(1)
const himSelfRef = toRef(himeSelf)
const getterRef = toRef(() => 3)
```

前两者都是 `ref` 类型，没有区别，而最后一个是 `getterRef` 类型，只支持读不支持写操作。

使用 getter 调用 `toRef` 类似于 `computed` ，但当 getter 只是执行属性访问而没有昂贵的计算时，效率会更高。

> 使用场景：
>
> 之前在给函数传递解构出来的 `props` 参数会造成响应式丢失，现在通过 `toRef` 可以继续保留响应式。
>
> ```js
> const props = defineProps<{ msg: string; foo: { bar: string }}>()
> 
> const userXxxx = (e) => {}
> userXxxx(toRef(props.msg))
> ```

### toValue

新的 `toValue` 实用程序方法提供了相反的方法，将值/getter/refs规范化为值：

`toValue` 可以在可组合项中使用，代替 `unref` ，以便可组合项可以接受 getter 作为反应式数据源：

```js
import { ref, toValue } from 'vue'

const value1 = toValue(ref(1))
const value2 = toValue(2)
const value3 = toValue(() => 3)
```

### JSX 导入源支持

目前，Vue 的类型会自动注册全局 JSX 类型。这可能会导致与其他需要 JSX 类型推理的库（特别是 React）一起使用的冲突。

从 3.3 开始，Vue 支持通过 TypeScript 的 jsxImportSource 选项指定 JSX 命名空间。这允许用户根据其用例选择全局或每个文件选择加入。

为了向后兼容，3.3 仍然全局注册 JSX 命名空间。我们计划在 3.4 中删除默认的全局注册。如果你在 Vue 中使用 TSX，你应该在升级到 3.3 后在你的 `tsconfig.json` 中添加显式 `jsxImportSource` ，以避免在 3.4 中出现中断。