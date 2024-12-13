# Vue2 VS Vue3

## Vue2

### 响应式缺陷

#### 无法监听到对象属性的动态添加和删除

在 `data` 中声明一个对象：

```js
data() {
  return {
    obj: {
      a: 1
    }
  }
}
```

在页面上通过 `for...in...` 循环该对象，能够看到数据 `a` 。现在为对象 `obj` 添加一个属性 `b` ：

```js
mounted() {
  this.obj.b = 2
  console.log(b)
}
```

可以看到控制台能够输出 `b` ，但是页面还是只有 `a` 没有 `b` ，也就意味着属性 `b` 没有响应式。

#### 无法监听到数组下标和 length 长度的变化

Vue2 内部重写部分数组 API，让他们能够保持响应式：

- `array.pop()`
- `array.push()`
- `array.shift()`
- `array.unshift()`
- `array.sort()`
- `arry.reverse()`
- `array.splice()`

而通过数组索引的方式修改数据不会响应式修改：

```js
fn() {
  this.arr[0] = 1
}
```

直接修改数组的长度也不会生效：

```js
fn() {
  this.arr.length = 0
}
```

#### 原因

利用 `defineReactive` 方法，通过 `defineProperty` 对属性进行劫持，数组则是通过重写其方法来进行劫持，每个属性值都拥有自己的 `dep` 属性，用来存取所依赖的 `watch` ，当数据发生改变时，触发相应的 `watch` 去更新数据。

但是呢，**Vue2 的响应式还存在一些缺陷**：1.对象新增属性，删除属性界面不会更新 2.通过数组下标修改数组内容界面不会更新

> 原因：
>
> 1. Vue 无法检测 property 的添加或移除。由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 data 对象上存在才能让 Vue 将它转换为响应式的
> 2. 通过数组下标修改数组不会触发响应，尤雨溪也在 `github` 上说过，由于数组的长度可能会很大，通过索引修改数据的方式会造成很大的性能消耗，因此不对索引方法作额外处理

### 数组响应式

在对象中增加或者删除属性的时候，数据的响应式原理是不奏效的，因为 Vue2 是用的 `Object.definedProperty` 方法进行数据劫持。
因此在进行添加元素的时候，应该用 `$set` 来进行添加属性。使用 `$remove` 进行删除属性。

对于数组，因为数组也是一对象，但我们在使用数组的 API 进行操作数组(添加元素或者是删除元素)的时候，视图是有更新的。这个的原因是为什么呢？

原本上，数组的一些方法比如 `push`，`pop` 是不会触发`getter/setter` 的。不会触发的原因是因为这是 Array 原型上的方法，并没有在 Array 本身上面。

Vue 可以使用这些方法的原因是因为 Vue 重写了这些方法。就可以使用 `push.pop.shift,unshift,splice,sort,reserve`操作数组，并且进行响应式。

实现的思路：大体上就是说，是使用了拦截器覆盖了`Array.prototype` 上的方法，在执行原型上的方法之外去做数据的响应式。

- 将数组的原型存到对象 arrayMethods 中
- 找到 Array 上能够改变数组自身的 7 个方法 push, pop, shift,unshift, splice, sort, reverse
- 将这 7 个方法进行响应式处理
- 处理完成后，用它们把 arrayMethods 中对应的方法覆盖掉
- 将需要进行响应式处理的数组 arr 的**proto**指向 arrayMethods，如果浏览器不支持访问**proto**，则直接将响应式处理后的 7 个方法添加到数组 arr 上
- 如果要将一个数组完全实现响应式，需要遍历该数组，将数组中的数组使用该方法进行响应式处理，将对象使用 walk 方法进行响应式处理

#### 定义拦截器

```js
// 获取Array的原型
const arrayProto = Array.prototype;
// 创建一个新对象，该新对象的原型指向Array的原型。
export const arrayMethods = Object.create(arrayProto);
[
	'push',
	'pop',
	'shift',
	'unshift',
	'splice',
	'sort',
	'reverse'
]
.forEach(mentod => {
	 // 缓存原始方法
	const original = arrayProto[method];
	// 对新原型对象上的方法，做数据绑定
	Object.defineProperty(arrayMethods， method， {
		value: function mutator(...args) {
			// 返回原始方法
			return original.apply(this, args);
		},
		enumerable: false,
		writable: true,
		configurable: true
	})
})
```

#### 将拦截器挂载到数组上面

```js
import { arrayMethods } from "./array"; // 处理好的Array原型对象
// __proto__是否可用
const hasProto = "__proto__" in {};
// 所有属性名，不论是否可枚举（与Object.keys的区别）
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export class Observe {
  // 将value转为响应式
  constructor(value) {
    this.value = value;

    if (Array.isArray(value)) {
      const augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys);
    } else {
      this.walk(value); // Object的响应式处理，在其他文章中
    }
  }
}

/**
 * __proto__可用的处理方式
 * 将target对象的原型对象替换为src
 */
function protoAugment(target, src, keys) {
  target.__proto__ = src;
}

/**
 * __proto__不可用的处理方式
 * 将src上面的所有属性都copy到target
 */
function copyAugment(target, src, keys) {
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    def(target, key, src[key]);
  }
}

// Object.defineProperty()的封装
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  });
}
```

#### 收集依赖

收集依赖：

```js
function defineReactive(data, key, val) {
  let childOb = observe(val);
  let dep = new Dep(); // 存储依赖
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      dep.depend();

      if (childOb) childOb.dep.depend(); // 收集
      return val;
    },
    set: function (newVal) {
      if (val === newVal) return;
      dep.notify();
      val = newVal;
    },
  });
}

// 返回val的响应式对象
function observe(val, asRootData) {
  if (!isObject(value)) return;
  let ob;
  // 避免重复侦测
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof observer) {
    ob = value.__ob__;
  } else {
    ob = new Observe(value);
  }
  return ob;
}
```

ob、dep、watch

## Vue3

### 响应式原理

Vue3 响应式原理主要是通过 Proxy 和 Reflect 方法实现。

Proxy 是 ES6 提出的新语法，他直接代理对象，而无需像 Object.definePropetry 方法那样重新代理，因此性能方面会更佳。

Reflect 方法可以对源对象的属性进行操作

简单的方法如下所示：

```js
let person = {
  name: "张三",
  age: 18,
};
const p = new Proxy(person, {
  //有人读取p的某个属性时调用
  get(target, prop, receiver) {
    console.log(target, prop);
    //return target[p]
    return Reflect.get(target, prop);
  },
  //有人修改、增加p的某个属性时调用
  set(target, p, value, receiver) {
    console.log(`有人修改了p身上的${p}，我要去更新界面了`);
    //target[p] = value
    Reflect.set(target, p, value);
  },
  //有人删除p的某个属性时调用
  deleteProperty(target, p) {
    console.log(`有人删除了p身上的${p}，我要去更新界面了`);
    //return delete target[p]
    return Reflect.deleteProperty(target, p);
  },
});

console.log((p.age = 23));
console.log(person);
```

### hook

`Vue3`中的`hook`通常被称为`Composition API`，是 Vue.js 框架中的一个重要特性。它们的本质是一些可以在**组件内部使用的函数**，这些函数能够让你在不影响组件逻辑的情况下，增强和扩展组件的功能。

`Hook`的主要作用是**允许在组件之间重用状态逻辑**。举个例子，如果你有一个处理[异步请求](https://so.csdn.net/so/search?q=异步请求&spm=1001.2101.3001.7020)和管理请求状态的功能，那么你可能会在多个组件中需要这个功能。在`Vue2.x`中，你可能需要使用`mixins`或者`HOC`（高阶组件）来抽象和重用这些逻辑，但这通常会导致命名冲突和逻辑混乱。

而使用`Vue3`中的或者说`Composition API`，就无需担心上述问题。你可以通过调用`useFetch`这样的自定义`hook`，来在任何组件中很容易地重用异步请求逻辑。例如：

```javascript
import { reactive, onMounted } from "vue";

function useFetch(url) {
  const state = reactive({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      state.data = data;
      state.loading = false;
    } catch (error) {
      state.error = error;
      state.loading = false;
    }
  };

  onMounted(fetchData);

  return state;
}

export default useFetch;
```

这样，在其他组件中，我们可以很简单地使用这个状态：

```javascript
import useFetch from "./useFetch";

export default {
  setup() {
    const posts = useFetch("/api/posts");

    return {
      posts,
    };
  },
};
```

这里的`useFetch`就是一个自定义的`hook`（或者说是`Composition API`），它可以在各个组件之间重用。

#### Vue3 中的 hook 和 mixin 的对比

`Vue3`中的`hook`（复用性函数）和`mixin`（混入）都是`Vue.js`中为实现逻辑复用和代码组织提供的机制。不过，这两种方式有一些不同之处。以下是部分对比：

1.**复用性**：``mixin`允许多个`Vue`组件共享`JavaScript`功能，但`mixin`内的生命周期函数不易理解，容易导致命名冲突。`Vue3`的`hook`则是以函数形式将可复用性内容提取出来，可解决命名冲突的问题。

2.**逻辑相关性**：，由于`mixin`混入方法、生命周期函数中的逻辑可能散落在一整块的代码中，不方便管理与维护；而在`Vue3`中，`hook`更容易形成一块独立的、能够根据功能集中管理的代码。

3.**类型支持**：通过`mixin`混入的属性或方法，在类型系统中很难得到良好的支持。`Vue3`通过`Composition API`的`hook`，因其都是通过函数返回值主动暴露出来的，因此在`TypeScript`环境下有更好的类型推导支持。

4.**逻辑组织**：`mixin`无法将一个大的组件拆分为使用`mixin`的更小函数单元，而`Vue3`中的`hook`能够轻松实现这一点。

|                | Hooks                                                                                              | Mixins                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 定义           | hook 是通过 Composition API 引入的一种新特性，类似于 React 的 hook。                               | mixin 是一种对 Vue 组件进行扩展的方式。                                                                                 |
| 功能           | 它可以组织和重用逻辑。在组件中，我们可以创建和重用复杂的逻辑代码，使得组件的逻辑更加清晰和可维护。 | 它可以将组件の代码封装到一个可复用的模块。常用于将公用的代码片段进行抽离，实现复用，使得组件的逻辑更加清晰和可维护。    |
| 使用           | 使用 setup 方法，可以组织和复用各类逻辑.                                                           | 使用 mixin 属性，加载公用的代码片段。                                                                                   |
| 组织代码效果   | 使用 Hooks，我们可以让组件的逻辑函数按功能组织，使得组件的逻辑结构更加清晰。                       | 使用 Mixins，我们可以将组件的各个生命周期的相关函数统一放在一起，但这样做可能会使得组件的逻辑函数分散在各个生命周期中。 |
| 冲突问题       | Hooks 允许我们命名冲突的功能，从而避免了各种命名冲突。                                             | Mixins 可能会导致函数名冲突。如果两个 mixin 中包含相同的函数，会导致后一个 mixin 的函数覆盖先前的函数。                 |
| 难以追踪的来源 | Hooks 使用的是函数，所以如果不加注释，可能不太容易找到其来源。                                     | 在 Mixin 中，我们可以在每个使用了公用代码片段的地方都用注释表明这段代码の来源，有助于我们更好地追踪和维护代码。         |
| Debug 困难度   | Hooks 有更好的 Stack Trace，可以提供更优秀的 debug 体验。                                          | 对 mixins 的支持可能会出现在运行时错误的情况下，无法找到那块代码が出错的问题，从而导致调试困难。                        |

举个例子说明这两者的区别：

使用 mixin 的部分：

```javascript
//定义一个mixin
let myMixin = {
  created: function () {
    this.hello();
  },
  methods: {
    hello: function () {
      console.log("hello from mixin!");
    },
  },
};

//在组件中使用mixin
var Component = Vue.extend({
  mixins: [myMixin],
});
```

这里"hello"方法是被添加到该组件的 methods 属性中的，并且在组件的 created 生命周期钩子被调用后，也调用了 mixin 中的 created。

使用 hook 的部分：

```javascript
//定义一个hook
function useHello() {
  const hello = () => {
    console.log("hello from hook!");
  };

  onMounted(hello);

  return {
    hello,
  };
}

//在组件中使用hook
const Component = {
  setup() {
    const { hello } = useHello();
    return {
      hello,
    };
  },
};
```

在这里，使用"`onMounted`"函数代替了"`created`"生命周期钩子，并且"`hello`"函数是从`hook`中解构出来的。相比之下，`Vue3`的`hook`将逻辑保持在一个独立的函数中，使得组件代码保持清晰。

注意 ：`vue3`中可以继续使用`mixin`,但是，`Vue 3`推荐使用`Composition API`来组合和重用逻辑，这使得逻辑组合和重用变得更加方便和灵活，而且可读性和可维护性也更好。根据`Vue 3` 的官方文档，`Mixin`在`Vue 3`已经被认为是一种过时的`API`，而将来可能会被`Composition API`完全取代

## Vue2 与 Vue3 区别

### 根节点

- vue2 只能有一个根节点，多个根节点存在他会报错
- vue3 允许拥有多个根节点

### 生命周期

| Vue2          | Vue3            | 生命周期含义                              |
| ------------- | --------------- | ----------------------------------------- |
| beforeCreate  | setup()         | 开始创建组件之前，创建的是 data 和 method |
| created       | setup()         | 同上                                      |
| beforeMount   | onBeforeMount   | 组件挂载到节点上之前执行的函数。          |
| mounted       | onMounted       | 组件挂载完成后执行的函数                  |
| beforeUpdate  | onBeforeUpdate  | 组件更新之前执行的函数。                  |
| updated       | onUpdated       | 组件更新完成之后执行的函数。              |
| beforeDestroy | onBeforeUnmount | 组件挂载到节点上之前执行的函数。          |
| destroyed     | onUnmounted     | 组件卸载之前执行的函数。                  |
| activated     | onActivated     | 组件卸载完成后执行的函数                  |
| deactivated   | onDeactivated   | 在组件切换中老组件消失的时候执行          |

### v-if 与 v-for 的优先级

- 在 Vue2 中，`v-for` 的优先级会高于 `v-if` ，因此会每循环一次就判断一次，造成极大的性能消耗和浪费
- 在 Vue3 中，`v-if` 优先级会高于 `v-for` ，因此当判断不生效，不渲染该 DOM 节点时，该节点的 `v-for` 会失效，不生成循环 DOM 节点

> 题外话
>
> 无论是 Vue2 还是 Vue3，都不建议同时在一个 DOM 节点中使用 `v-if` 和 `v-for` 。
>
> 如果想要实现这个效果，可以根据业务来做不同的处理，如：
>
> - 事先使用 `filter` 过滤出需要的数组数据，再通过 `v-for` 循环遍历
> - `v-for` 遍历后再在内部设置 `template` 标签包裹内容，在 `template` 上使用 `v-if` 判断即可

### API

- 在 Vue2 中，使用的是选项式 API，优点是初学者简单易懂，缺点是相关模块十分分散，不易于大型项目的维护。代码如下：

  ```vue
  <template>
    <div>......</div>
  </template>

  <script>
  export default {
    // 数据
    data() {
      return {};
    },
    mounted() {},
    // 方法
    methods: {},
    computed: {},
  };
  </script>
  ```

- 在 Vue3 中，使用的组合式 API，代码如下：

  ```vue
  <script setup>
  // 数据和方法都写这里，更简洁
  </script>
  ```

因为改成了组合式 API ，因此没有 `this` 。

### Diff 算法

Vue2:

```txt
diff算法就是进行虚拟节点对比，并返回一个patch对象，用来存储两个节点不同的地方，最后用patch记录的消息去局部更新Dom。
diff算法会比较每一个vnode,而对于一些不参与更新的元素，进行比较是有点消耗性能的。
```

Vue3:

```txt
diff算法在初始化的时候会给每个虚拟节点添加一个patchFlags，patchFlags就是优化的标识。
只会比较patchFlags发生变化的vnode,进行更新视图，对于没有变化的元素做静态标记，在渲染的时候直接复用。
```

### 父子组件

|      | Vue2                                                                                  | Vue3                                                                                                                                                                                              |
| ---- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prop | 子组件 this.$prop 接收数据                                                            | 子组件 defineProps 接收数据                                                                                                                                                                       |
| emit | 子组件 this.$emit() 设置自定义事件<br />父组件在子组件设置相应的方法使用              | 子组件先需要 const emit = defineEmits() 设置方法<br />然后再通过 emit() 自定义事件通知父组件<br />父组件使用方法和 Vue2 一样                                                                      |
| ref  | 子组件使用关键字 ref = xxxx 设置组件实例名称<br />通过 this.$refs.xxxx 获取子组件实例 | 子组件使用关键字 ref = xxx 设置组件实例名称<br />声明该实例 const xxx = ref()<br />现在可以使用该组件实例内的方法<br />注意：如果想使用子组件的方法变量，需要子组件通过 defineExpose 方法事先导出 |

### 数据绑定原理

| vue2                                                                                             | vue3                                 |
| ------------------------------------------------------------------------------------------------ | ------------------------------------ |
| 利用 ES5 的一个 API Object.defineProperty() 对数据进行劫持，结合发布者订阅者模式的方式来实现的。 | 使用了 ES6 的 Proxy API 对数据代理。 |

Vue3 发生了改变，使用 proxy 替换 Object.defineProperty，使用 Proxy 的优势如下：

1. 可直接监听数组类型的数据变化
2. 性能的提升
3. 监听的目标为对象本身，不需要像 Object.defineProperty 一样遍历每个属性，有一定的性能提升
4. 可直接实现对象属性的新增/删除

### 组件v-model

在 Vue2 中，组件使用 `v-model` 实际上是为组件动态绑定 `value` ，监听 `chang` 或 `input` 事件。

在 Vue3 中，组件使用 `v-model` 实际上是为组件动态绑定 `modelValue` ，监听 `update:modelValue` 事件。

## Vite VS Webpack

这里推荐一个文章 [Vite VS Webpack](https://zhuanlan.zhihu.com/p/568721196) 。
