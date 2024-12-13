# Poc迁移

Poc迁移是把这个广东省数据的项目迁移一份给北京总部那边，在那边招标拉项目。由于项目是 Vue2.7 版本的项目，因此会遇到一些 Vue2.7 的写法。此模块用于记录使用 Vue2.7 `setup` 语法的写法。

## v-model语法糖

在 Vue2 中，`v-model` 语法糖实际上是通过 `:value="value"` 和 `@input="value = $event.target.value"` ；在 Vue3 中，`v-model` 语法糖实际上是通过 `:moduleValue` 和 `@update:modelValue="message = $event"` 。

在 Vue2.7 中，想要实现 `v-model` 语法糖功能，需要以下几步：

1. 子组件 `export default` 中设置 `model` 对象，其中有两个参数：`prop: value` 为需要绑定的值，`event: update:value` 为方法名称
2. 子组件在修改值时调用 `update:value` 方法
3. 父组件 `v-model` 绑定数据

父组件代码如下：

```vue
<son v-model="value" />
```

子组件代码如下：

```vue
<template>
	<div>
    {{ value }}
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  model: {
      prop: 'value',
      event: 'update:value',
  },
  setup() {
    function update(value) {
      emit('update:value', value);
    }
  }
}
</script>
```

## 侦听器

在项目中，我在外部声明了一个变量 `const type = ref(false)` ，在使用 Vue2 写法的组件中 `import` 导入，在 `watch` 中侦听，代码如下：

```vue
<script>
import {type} from '@/store/index.js'
export default {
  watch: {
    type: function(newVal) {
      console.log(newVal)
      this.fn()
    }
  },
  methods: {
    fn() {
      // ...
    }
  }
}
</script>
```

结果无法触发侦听，如果写在 `setup` 中则无法通过 `this` 调用 `fn` 函数。

Vue2.7 中，`this` 可以调用 `$watch` 方法侦听，效果与 `watch` 是一样的。不仅能够侦听到 `ref` 声明的变量，同时也能通过 `this` 调用 `data` 或 `method` 内的变量方法。

代码如下所示：

```js
import {type} from '@/store/index'
export default {
  created() {
    this.$watch(() => type.value, (newVaal) => {
      console.log(newVal)
    })
  }
}
```

## 父组件使用子组件变量方法

在 Vue2 中，父组件使用子组件方法可以通过 `this.$refs.xxx` 方式获取；在 Vue3 中，需要子组件 `defineExporse` 中暴露出去才可使用。

在 Vue2.7 中，如果使用 `setup` 的方式，需要在 `return` 中暴露出去；如果使用选项式 API，无需其他操作。

父组件代码如下：

```vue
<son ref="sonRef" />

<script>
import {ref, nextTick} from 'vue'
export default {
  setup() {
    const sonRef = ref(null)
    
    nextTick(() => {
      console.log(sonRef.value.xxx)
    })
    
    return {
      sonRef
    }
  }
}
</script>
```

