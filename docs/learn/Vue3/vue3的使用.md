# Vue3指令

## `setup`

setup 函数是一个新的组件选项, 作为组件中 `compositionAPI` 的起点

1. 从生命周期角度来看， `setup` 会在 `beforeCreate` 钩子函数之前执行
2. **`setup` 中不能使用 `this` ， `this` 指向 `undefined` **
3. 在模版中需要使用的数据和函数，需要在 `setup` 中 `return` 返回，只有返回的值才能在模板中使用。

```vue
<template>
  <div class="container">
    <h1 @click="say()">{{msg}}</h1>
  </div>
</template>

<script>
export default {
  setup () {
    console.log('setup执行了')
    console.log(this)
    // 定义数据和函数
    const msg = 'hi vue3'
    const say = () => {
      console.log(msg)
    }

    return { msg , say}
  },
  beforeCreate() {
    console.log('beforeCreate执行了')
    console.log(this)
  }
}
</script>
```

## `reactive`

1. setup 需要有返回值, 只有返回的值才能在模板中使用
2. 默认普通的数据, 不是响应式的

在传入一个复杂数据类型，需要将复杂类型数据, 转换成响应式数据 （返回该对象的响应式代理）

```vue
<template>
  <div>{{ obj.name }}</div>
  <div>{{ obj.age }}</div>
  <button @click="add">改值</button>
</template>

<script>
import { reactive } from 'vue'

export default {
  setup () {
    // 1. setup 需要返回值, 返回的值才能在模板中使用
    // 2. 默认的普通的值不是响应式的, 需要用 reactive 函数
    const obj = reactive({
      name: 'zs',
      age: 18
    })

    return {
      obj
    }
  },
  methods: {
    add() {
      this.obj.age += 1
      console.log(this.obj);
    }
  }
}
</script>

```

>  `reactive()` 的局限性
>
>  `reactive()` API 有两条限制：
>
>  1. 仅对对象类型有效（对象、数组和 `Map`、`Set` 这样的[集合类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects#使用键的集合对象)），而对 `string`、`number` 和 `boolean` 这样的 [原始类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive) 无效。
>
>  2. 因为 Vue 的响应式系统是通过属性访问进行追踪的，因此我们必须始终保持对该响应式对象的相同引用。这意味着我们不可以随意地“替换”一个响应式对象，因为这将导致对初始引用的响应性连接丢失：
>
>     js
>
>     ```js
>     let state = reactive({ count: 0 })
>     
>     // 上面的引用 ({ count: 0 }) 将不再被追踪（响应性连接已丢失！）
>     state = reactive({ count: 1 })
>     ```

## `ref`

`reactive` 处理的数据, 必须是复杂类型,  如果是简单类型无法处理成响应式, 所以有 `ref` 函数！

作用: 对传入的数据（一般简单数据类型），包裹一层对象,  转换成响应式。

1. `ref` 函数接收一个的值, 返回一个 `ref` 响应式对象,  有唯一的属性 `value` 。
2. 在 `setup` 函数中, 通过 `ref` 对象的 `value` 属性, 可以访问到值。
3. 在模板中， `ref` 属性会自动解套, 不需要额外的 `.value` 。
4. `ref` 函数也支持传入复杂类型，传入复杂类型，也会做响应式处理。

```vue
<script>
import { ref } from "vue";
export default {
  setup() {
    const num = ref(0)

    const add = () => {
      num.value += 1
    }

    return {num, add}
  }
}
</script>

<template>
	<h1>{{num}}</h1>
	<button @click="add">+</button>
</template>

```

ref 和 reactive 的最佳使用方式：

- **明确的对象，明确的属性，用reactive，其他用 ref**
- 从vue3.2之后，更推荐使用ref

## `script setup`语法

> script setup是在单文件组件 (SFC) 中使用组合式 API 的编译时语法糖。相比于普通的 script 语法更加简洁

要使用这个语法，需要将 `setup` attribute 添加到 `<script>` 代码块上：

```vue
<script setup></script>
```

顶层的绑定会自动暴露给模板，所以定义的变量，函数和import导入的内容都可以直接在模板中直接使用

```vue
<script setup>
import { ref } from 'vue';

console.log('setup钩子执行啦');
const num = ref(100)

const add = () => {
  num.value += 100
}
</script>

<template>
  <h1>{{num}}</h1>
  <button @click="add">+</button>
</template>

```

## v-model

### 值绑定

- 输入框和多行文本框双向绑定输入的字符串内容
- 单个多选框绑定布尔值
- 多个多选框绑定选择的数组
- 单选框绑定的是选中的单选框的 `value` 
- 单个下拉选择框绑定的是选中的 `option` 的值
- 下拉选择框多选绑定的是数组

### 配合组件

vue3中子组件 `v-model` 原理为 `:value` 绑定变量，`@update:value` 修改变量并通过 `$emit` 通知父组件，如下：

父组件：

```vue
<input :value="title" @update:value="change" />
```

子组件：

```js
props: ['value'],
emit: ['update:value'],
change(e) {
    this.title = e.target.value,
    this.$emit('update:value', e)
}
```

因此父组件可以简写为以下语法糖形式：

```vue
<input v-model:value="title" />
```

如果把 `:value` 改为 `:modelValue` 依旧生效

父组件：

```vue
<input v-model:modelValue="title" />
```

子组件：

```js
props: ['modelValue'],
emit: ['update:modelValue'],
change(e) {
    this.title = e.target.value,
    this.$emit('update:modelValue', e)
}
```

且父组件的 `:modelValue` 也能省略（子组件必须有 `props: ['modelValue']` ）

```vue
<input v-model="title" />
```

### 多个 `v-model` 绑定

可以在单个组件实例上创建多个 `v-model` 双向绑定。组件上的每一个 `v-model` 都会同步不同的 prop，而无需额外的选项：

```vue
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

```vue
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

### 处理 `v-model` 修饰符

`v-model` 有一些[内置的修饰符](https://cn.vuejs.org/guide/essentials/forms.html#modifiers)，例如 `.trim`，`.number` 和 `.lazy`。在某些场景可能想要一个自定义组件的 `v-model` 支持自定义的修饰符。

我们来创建一个自定义的修饰符 `capitalize`，它会自动将 `v-model` 绑定输入的字符串值第一个字母转为大写：

```vue
<MyComponent v-model.capitalize="myText" />
```

组件的 `v-model` 上所添加的修饰符，可以通过 `modelModifiers` prop 在组件内访问到。在下面的组件中，我们声明了 `modelModifiers` 这个 prop，它的默认值是一个空对象：

```vue
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

defineEmits(['update:modelValue'])

console.log(props.modelModifiers) // { capitalize: true }
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

注意这里组件的 `modelModifiers` prop 包含了 `capitalize` 且其值为 `true`，因为它在模板中的 `v-model` 绑定 `v-model.capitalize="myText"` 上被使用了。

有了这个 prop，我们就可以检查 `modelModifiers` 对象的键，并编写一个处理函数来改变抛出的值。在下面的代码里，我们就是在每次 `<input />` 元素触发 `input` 事件时将值的首字母大写：

```vue
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function emitValue(e) {
  let value = e.target.value
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

对于又有参数又有修饰符的 `v-model` 绑定，生成的 prop 名将是 `arg + "Modifiers"`。举例来说：

```vue
<MyComponent v-model:title.capitalize="myText">
```

相应的声明应该是：

```js
const props = defineProps(['title', 'titleModifiers'])
defineEmits(['update:title'])

console.log(props.titleModifiers) // { capitalize: true }
```

## 计算属性

1. 根据一个依赖项计算出新结果，接收一个处理函数
2. 处理函数中 `return` 返回

```vue
<script setup>
import { ref, computed } from 'vue';

const myAge = ref(21)

const nextAge = computed(()=> {
  return myAge.value + 1
})

const theAge = computed({
  get() {
    return myAge.value + 2
  },
  set(val) {
    myAge.value = val - 2
  }
})
</script>

<template>
<div>this year <input type="text" v-model.number="myAge" /></div>
<div>next year {{nextAge}}</div>
<div>two years ago <input type="text" v-model="theAge"></div>
</template>

<style>

</style>

```

> 注意：
>
> - Getter 不应有副作用
>
>   计算属性的 getter 应只做计算而没有任何其他的副作用，这一点非常重要，请务必牢记。举例来说，**不要在 getter 中做异步请求或者更改 DOM**！一个计算属性的声明中描述的是如何根据其他值派生一个值。因此 getter 的职责应该仅为计算和返回该值。在之后的指引中我们会讨论如何使用[监听器](https://cn.vuejs.org/guide/essentials/watchers.html)根据其他响应式状态的变更来创建副作用。
>
> - 避免直接修改计算属性值
>
>   从计算属性返回的值是派生状态。可以把它看作是一个“临时快照”，每当源状态发生变化时，就会创建一个新的快照。更改快照是没有意义的，因此计算属性的返回值应该被视为只读的，并且永远不应该被更改——应该更新它所依赖的源状态以触发新的计算。

## 侦听器

侦听器有三个参数，分别是：

1. 参数1: 监视的数据源，该变量不需要加 `.value` ，底层代码已经帮我们自动处理了。
2. 参数2: 回调函数
3. 参数3: 额外的配置

### 基础数据类型的侦听器

```vue
<script setup>
import { ref, watch } from 'vue';

const money = ref(10000)

const cost = () => {
  return money.value -= 520
}

watch(money, ()=> {
  console.log('花钱了');
})
</script>

<template>
  <div>{{money}}</div>
  <button @click="cost">花费</button>
</template>

<style>

</style>

```

#### 侦听多个数据

```vue
<script setup>
import { ref, watch } from 'vue';

const money = ref(10000)
const love = ref(0)

const cost = () => {
  return money.value -= 520, love.value += 1
}

watch([money, love], ([newMoney, newLove], [oldMoney, oldLove])=> {
  console.log('花钱了，好感度上升了');
  console.log(newMoney, newLove);
  console.log(oldMoney, oldLove);
})
</script>

<template>
  <div>{{money}}，{{love}}</div>
  <button @click="cost">花费</button>
</template>

<style>

</style>

```

### 复杂数据类型的侦听器

```vue
<script setup>
import { ref, watch } from 'vue';

const user = ref({
  age: 21,
  name: 'chao'
})

watch(
  user,
  (value)=> {
    console.log('user对象发生变化');
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<template>
  <div>{{user}}</div>
  <div>{{user.name}}</div>
  <button @click="user.name = 'tie'">改名</button>
  <div>{{user.age}}</div>
  <button @click="user.age += 1">长大了</button>
</template>

<style>

</style>

```

#### 侦听对象单个数据

```vue
<script setup>
import { ref, watch } from 'vue';

const user = ref({
  age: 21,
  name: 'chao'
})

watch(
  ()=>{
    return user.value.age
  },
  (value)=> {
    console.log('user年龄发生变化');
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<template>
  <div>{{user}}</div>
  <div>{{user.name}}</div>
  <button @click="user.name = 'tie'">改名</button>
  <div>{{user.age}}</div>
  <button @click="user.age += 1">长大了</button>
</template>

<style>

</style>

```

### watchEffect()

允许我们自动跟踪回调的响应式依赖。

使用 `watch` 的代码：

```js
const todoId = ref(1)
const data = ref(null)

watch(todoId, async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
}, { immediate: true })
```

使用 `watchEffect` 的代码：

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}?type=${todoType.value}`
  )
  data.value = await response.json()
})
```

当 `todoType` 变量和 `todoId` 变量其中一个发生改变就会触发这个侦听回调。

> 注意
>
> `watchEffect` 仅会在其**同步**执行期间，才追踪依赖。在使用异步回调时，只有在第一个 `await` 正常工作前访问到的属性才会被追踪。

### 区别

`watch` 和 `watchEffect` 都能响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：

- `watch` 只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西。另外，仅在数据源确实改变时才会触发回调。`watch` 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。
- `watchEffect`，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

### 回调的触发时机

当你更改了响应式状态，它可能会同时触发 Vue 组件更新和侦听器回调。

默认情况下，用户创建的侦听器回调，都会在 Vue 组件更新**之前**被调用。这意味着你在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。

如果想在侦听器回调中能访问被 Vue 更新**之后**的 DOM，你需要指明 `flush: 'post'` 选项：

```js
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

后置刷新的 `watchEffect()` 有个更方便的别名 `watchPostEffect()`：

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* 在 Vue 更新后执行 */
})
```

### 停止侦听器

在 `setup()` 或 `<script setup>` 中用同步语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止。在大多数情况下，还无需太多关心如何停止侦听器。

一个关键点是，侦听器必须用**同步**语句创建：如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，必须手动停止它，以防内存泄漏。如下方这个例子：

```vue
<script setup>
import { watchEffect } from 'vue'

// 它会自动停止
watchEffect(() => {})

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

要手动停止一个侦听器，请调用 `watch` 或 `watchEffect` 返回的函数：

```js
const unwatch = watchEffect(() => {})

// ...当该侦听器不再需要时
unwatch()
```

注意，需要异步创建侦听器的情况很少，请尽可能选择同步创建。如果需要等待一些异步数据，你可以使用条件式的侦听逻辑：

```js
// 需要异步请求得到的数据
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // 数据加载后执行某些操作...
  }
})
```

## 生命周期钩子函数

vue3 中的生命周期函数, 需要在 `setup` 中调用。

![通讯](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e799f58f8f254c5484964b3b3c61660c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

在 `vue3` 中，生命周期触发时回调函数的执行可以多个，按照代码顺序从上往下依次执行。
