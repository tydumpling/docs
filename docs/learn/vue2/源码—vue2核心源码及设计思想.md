# vue2核心源码及设计思想

## 使用Rollup搭建开发环境

新建一个文件夹，打开终端，输入命令行：

```
npm init -y
```

此时能够生成 `package.json` 文件。下载 `rollup` 和 `rollup-plugin-babel` 依赖：

```
npm i rollup rollup-plugin-babel @babel/core @babel/preset-env --save
```

上方命令表示下载 `rollup` 模块的 `babel` 依赖，其中 `@babel/core` 用于编译高级 ES6 语法并转换为 ES5 语法。`@babel/preset-env` 是其中一个插件。下载完依赖后文件夹内会有一个 `node_modules` 文件夹，

同级目录下新建一个 `rollup.config.js` 文件，用于打包（默认找  `rollup.config.js` 文件，也可以自定义，后续指定文件）。然后返回 `package.json` 文件，书写打包编译的命令：

```json
{
  "scripts": {
    "dev":"rollup -cw",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```

上方代码表示使用 `rollup` 来打包，`-c` 指定默认配置文件，`-w` 表示 `watch` ，监控文件。

新建一个 `src` 文件夹，为打包入口，文件夹下新建一个 `index.js` 文件，作为入口文件。随便写点 ES6 语法代码。

```js
export const a = 100
```

在打包的配置文件 `rollup.config.js` 中作打包的配置，代码如下：

```js
// rollup默认可以导出一个对象，作为打包的配置文件
import babel from "rollup-plugin-babel";

export default {
  input: "./src/index.js", // 入口
  output: {
    file: "./dist/vue.js", // 出口
    name: "Vue", // 打包全局挂载Vue实例。打包后会生成一个 golbal.vue
    format: "umd", // 打包格式。常见格式有 esm es6模块 commonjs模块 iife自执行函数 umd(commonjs amd)
    sourcemap: true, // 希望可以调试源代码
  },
  // 插件配置。所有插件都是函数，执行即可
  plugins: [
    // 一般babel都会配置一个babel文件
    babel({
      exclude: "node_modules/**", // 排除node_modules下所有文件
    }),
  ],
};
```

> 题外话
>
> 最开始我把 `input` 错敲成 `imput` ，导致一直报错，提示 `options.input` 没有。

根目录下新建一个 `.babelrc` 文件，用于配置 `babel` 。打包后会找到这个文件。代码如下：

```json
{
  "presets": ["@babel/preset-env"]
}
```

现在配置完成，输入命令行开始打包编译：

```
npm run dev
```

运行成功后可以看到根目录下新建一个 `dist` 文件夹，点击查看 `vue.js` 文件，可以看到其已经编译转换成功：

![编译](https://pic.imgdb.cn/item/64eeb143661c6c8e54849a16.jpg)

测试一下是否全局有了 `Vue` 实例，`dist` 文件夹下新建一个 `index.html` 文件，引入 `vue.js` 文件，在输出 `Vue` ，代码如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script src="./vue.js"></script>
  <script>
    console.log(Vue)
  </script>
</body>
</html>
```

最终打印结果为：

```js
{a: 100, __esModule: true}
```

能够拿到打印结果。且因为事先配置允许调试源码，在 `src/index.js` 文件中添加 `debugger` 可以生成断点，用于调试。

> 题外话
>
> 为什么使用了 `babel` 编译为低级语法了只能支持 IE9 以上？
>
> 因为 Vue2 的 `Object.defineProperty` 语法只支持 IE9 以上，没有低级语法可以代替；而 Vue3 的 Proxy 更是直接剔除 IE 行列。

## Vue响应式原理实现

实现响应式数值变化，数值变化了我们可以监控到数据的变化。

首先初始化数据，在 `index.html` 内创建一个 `Vue` 实例，把所有数据放到 `data` 对象内，代码如下：

```html
<script>
  console.log(Vue)
  const vm = new Vue({
    data: {
      name: 'tydumpling',
      age: 23
    }
  })
</script>
```

### 初始化函数

接下来需要创建一个。`Vue` 源码并没有创建类 `class` 来设计，因为当方法多了之后，会造成很多方法的耦合。`Vue` 采取的方法是配置构造函数，通过原型的方式把构造函数挂载到 `Vue` 实例上，最终导出 `Vue` 实例。如下：

```js
function Vue() {}

Vue.prototype.xxx = xxx

export default Vue
```

在 `index.html` 文件中 `new Vue` 就是此处导出的 `Vue` 。

现在可以用上面的方法配置初始化函数。新建一个 `src/init.js` 文件，用于数据初始化操作。

在原型上挂载一个 `_init` 函数，接收一个数据参数。为了能让后续调用的函数都能使用接收的数据参数，故把该形参挂载到 `this` 上，后面的函数都能通过 `this` 拿到了。

代码中用 `vm` 代表 `this` ，后续都通过 `vm` 获取方法变量。代码如下：

```js
import { initState } from "./state";

// 给Vue增加init方法
export function initMixin(Vue) {
  // 初始化操作
  Vue.prototype._init = function (options) {
    // 在vue中，vm.$options就是获取用户配置的。使用Vue时，$开头都是Vue自身的方法
    const vm = this;
    vm.$options = options;

    // 初始化状态处理函数（状态初始化章节详讲）
    initState(vm);
  };
}
```

`index.js` 使用原型上的 `_init` 函数，传递数据参数。代码如下：

```js
import { initMixin } from "./init";

// options就是用户的选项
function Vue(options) {
  this._init(options);
}

initMixin(Vue); // 扩展init的方法

export default Vue;
```

当 `index.html` 文件使用 `new Vue()` 创建构造函数后，就会触发 `_init()` 方法，并把 `new Vue()` 括号内的对象参数传递给 `options` 。

### 状态初始化

接下来作状态初始化处理，创建 `state.js` 文件，声明一个 `initState` 函数，用于作状态初始化。

函数主要判断接收获取到的数据，是否有 `prop` 、`data` 等，每个模块做对应处理。本案例先以 `data` 为主。存在 `data` 则判断其类型做相应的处理。

如果是对象，不需要作额外处理；如果是函数，则通过 `call()` 方法修改其 `this` 指向为 `Vue` 上。代码如下所示：

```js
export function initState(vm) {
  // 获取所有选项
  const opts = vm.$options;

  // 如果有data数据，则初始化data数据
  if (opts.data) {
    initData(vm);
  }
}

function initData(vm) {
  // 获取所有data数据
  let data = vm.$options.data;
  debugger;
  // Vue2中data可以是对象也可以是函数（Vue3统一函数），因此需要先判断
  data = typeof data === "function" ? data.call(vm) : data;
  console.log(data);
}
```

最终保存，通过 `debugger` 查看数据。

## 对象属性劫持

修改数组很少用索引来操作数组，因为[9999]数据要被劫持很多次，有很大的性能浪费。

但是数组内有对象时，索引点语法也应该被劫持。如 `arr[0].a` 是允许修改的

### 数据劫持

劫持数据，在 `src` 文件夹下新建一个 `observe/index.js` 文件，声明一个 `observe` 函数，用于劫持数据。`state.js` 中引入， `initData` 调用该函数。代码如下：

```js
export function initState(vm) {
  // 获取所有选项
  const opts = vm.$options;

  // 如果有data数据，则初始化data数据
  if (opts.data) {
    initData(vm);
  }
}

function initData(vm) {
  // 获取所有data数据
  let data = vm.$options.data;

  // Vue2中data可以是对象也可以是函数（Vue3统一函数），因此需要先判断
  data = typeof data === "function" ? data.call(vm) : data;
  
  // 劫持数据 defindProperty
  observe(data);
}
```

`observe/index.js` 内声明一个 `observe` 函数并按需导出供外部使用，该函数需要先判断数据类型是否为对象，对象才能劫持。然后添加一个类实例，用来判断该对象是否被劫持过，劫持过则不需要再劫持了。代码如下：

```js
export function observe(data) {
  // 判断是否为对象，是则劫持该对象数据
  if (typeof data !== "object" || data == null) {
    return; // 只能对对象进行劫持
  }

  // 如果对象被劫持过了，那就不需要再被劫持了（要判断一个对象是否被劫持过，可以添加一个实例，用实例来判断是否被劫持过）
  // todo...
  
  return new Observe(data);
}
```

定义一个类方法 `Observe` ，构造器中获取传参，并在 `walk` 方法中 **重新定义** 对象的属性。这也是为什么 Vue2 性能比 Vue3 差的原因。

循环遍历对象，调用 `defineReactive` 函数，传递三个参数：整个 `data` 数据对象、键名、键值。代码如下：

```js
class Observe {
  constructor(data) {
    // Object.defineProperty只能劫持已经存在的属性（vue里会为此单独写一些api，如$set、$delete)
    this.walk(data);
  }

  // 循环对象 对属性依次劫持
  walk(data) {
    // “重新定义” 属性（性能比vue3差的原因）
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
}
```

`defineReactive()` 函数主要运用 `Object.defineProperty` 方法定义劫持属性。在劫持之前，重新调用 `observe` 方法，对值判断，看值是否为对象。代码如下：

```js
export function defineReactive(target, key, value) {
  // 递归思想，如果value值的类型不是对象，则return；如果是对象，则继续劫持
  observe(value);

  // 此处value存放在闭包中，不会销毁
  Object.defineProperty(target, key, {
    // 取值执行get
    get() {
      return value;
    },
    // 修改值执行set
    set(newValue) {
      if (newValue === value) return;
      value = newValue;
    },
  });
}
```

### 数据获取

劫持成功后的数据对象并没有在全局 `vm` 变量上，因此我们要返回 `state.js` 文件，把劫持后的数据挂载到 `vm` 上。代码如下：

```js
// ...

function initData(vm) {
  // 获取所有data数据
  let data = vm.$options.data;

  // Vue2中data可以是对象也可以是函数（Vue3统一函数），因此需要先判断。这里的data是用户的数据
  data = typeof data === "function" ? data.call(vm) : data;

  // 此时vm只有用户的数据，没有我们劫持后的数据。把劫持后的数据放到原型上供用户使用。这里的_data是劫持后的对象
  vm._data = data;

  // 劫持数据 defindProperty
  observe(data);
}
```

此时控制台输出能看到数据，通过 `vm._data.xxx` 可以获取到数据。但是想要的效果是通过 `vm.xxx` 就能获取到数据，解决方案为把 `vm._data` 用 `vm` 代理即可。代码如下：

```js
// ...

// 代理。这里的target就是_data，key是每个对象的键
function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key]; // vm._data.xxx
    },
    set(newValue) {
      vm[target][key] = newValue;
    },
  });
}

function initData(vm) {
  // 获取所有data数据
  let data = vm.$options.data;

  // Vue2中data可以是对象也可以是函数（Vue3统一函数），因此需要先判断。这里的data是用户的数据
  data = typeof data === "function" ? data.call(vm) : data;

  // 此时vm只有用户的数据，没有我们劫持后的数据。把劫持后的数据放到原型上供用户使用。这里的_data是劫持后的对象
  vm._data = data;

  // 劫持数据 defindProperty
  observe(data);

  // 此时用户想要获取或者修改数据，必须通过 vm._data.xxx 的写法，不够人性化。把 vm._data 用 vm 来代理
  for (const key in data) {
    proxy(vm, "_data", key);
  }
}
```

现在对象数据能够没劫持到了。

## 数组方法劫持

接下来劫持数组的数据，此时不能直接调用 `walk` 方法，而是需要先判断数据的格式，对象格式的数据才走 `walk` 方法。如果是数组格式的数据，则走新的方法 `observeArray` 。

该方法遍历数组后，每一项数据都调用一次 `observe` 方法劫持数据。代码如下所示：

```js
import { newArrayProto } from "./array";

class Observe {
  constructor(data) {
    // Object.defineProperty只能劫持已经存在的属性（vue里会为此单独写一些api，如$set、$delete)
    if (Array.isArray(data)) {
      // 重写数组7个变异方法方法，但也要保留数组原有的特性
      data.__proto__ = newArrayProto;

      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }

  walk(data) {
    // ...
  }

  observeArray(data) {
    // 如果数组中放了对象，对象可以被监控到
    data.forEach((item) => observe(item));
  }
}

// ...
```

在 `src/observe` 文件夹下新建一个 `array.js` 文件，用于重写数组部分方法。步骤如下：

1. 获取数组的原型
2. 把数组原型赋值给新的变量，后续修改新变量即可，不会影响旧的数组原型
3. 找到数组变异方法 API 数组
4. 遍历变异方法 API 数组，先调用旧原型的方法，在获取新增的数据（新增的数组通过方法获取必定是数组格式）。新增的数据调用上面 `observeArray` 劫持。

代码如下：

```js
// 重写数组部分方法

// 获取数组原型
let oldArrayProto = Array.prototype;

// 先拷贝一份，不影响之前的。newArrayProto.__proto__ = oldArrayProto
export let newArrayProto = Object.create(oldArrayProto);

// 找到数组变异方法
let methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"]; // concat、slice都不会改变原数组

methods.forEach((method) => {
  newArrayProto[method] = function (...args) {
    // 内部调用原来的方法，函数的劫持，切片编程
    // 这里的this谁调用指向谁。如一个数组arr.push()，则this指向arr
    const result = oldArrayProto[method].call(this, ...args);

    // 新增的数据也需要劫持
    let inserted;
    let ob = this.__ob__;

    switch (method) {
      case "push":
      case "unshift":
        // 新增数据，获取全部新增的数据
        inserted = args;
        break;
      case "splice":
        // 数据替换，splice第三个参数（索引为2）为新增的数据
        inserted = args.slice(2);
        break;
      default:
        break;
    }

    if (inserted) {
      // 对新增的内容再次观测
      ob.observeArray(inserted);
    }

    return result;
  };
});
```

由于需要调用 `observeArray` 方法，而该方法在同级目录下的 `index.js` 中。因此需要把它当前的 `this` 指向挂载到数据 `__ob__` 上，该文件通过 `this.__ob__` 获取。

而数据上存在 `__ob__` 时，说明该数据被劫持过了，不需再劫持了，刚好可以用于做判断处理。

函数 `defineReactive` 则需要对 `set` 方法做处理，新增的值也需要再次调用 `observe` 方法，让其做数据劫持。

`index.js` 代码如下：

```js
class Observe {
  constructor(data) {
    data.__ob__ = this;

    // ...
}
  
export function defineReactive(target, key, value) {
  // 递归思想，如果value值的类型不是对象，则return；如果是对象，则继续劫持
  observe(value);

  // 此处value存放在闭包中，不会销毁
  Object.defineProperty(target, key, {
    // 取值执行get
    get() {
      return value;
    },
    // 修改值执行set
    set(newValue) {
      if (newValue === value) return;
      observe(newValue);
      value = newValue;
    },
  });
}
  
export function observe(data) {
  // ...

  if (data.__ob__ instanceof Observe) {
    // 已经被劫持过了
    return data.__ob__;
  }

  // 如果对象被劫持过了，那就不需要再被劫持了（要判断一个对象是否被劫持过，可以添加一个实例，用实例来判断是否被劫持过）
  return new Observe(data);
}
```

但是这么写会有一个 BUG，我们可以看到上方代码中，类 `Observe` 会接收一个对象格式的数据，然后为该对象添加一个 `__ob__` 的 `this` 指向的属性，接着对该属性做判断，符合对象的要求，没有 `__ob__` ，就在其身上绑定一个 `__ob__` 。接着在遍历 `__ob__` 内的 `__ob__` ......直到造成死循环。

解决方法为把 `__ob__` 这个属性设置为不可枚举的。代码如下：

```js
class Observe {
  constructor(data) {
    // 把this放到data对象中。如果数据对象上有__ob__，说明他被观测过了
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false, // 把__ob__ 变得不可枚举，无法监测
    });
    // data.__ob__ = this;

    // ...
  }
  // ...
}
```

现在可以对数组进行劫持。

## 模板编译原理，转化ast语法树

### 解析模板参数

将数据解析到el元素上，有以下方式：

1. 模板引擎，性能差，需要正则匹配替换，Vue1.0 版本没有引入虚拟 DOM
2. 虚拟 DOM，数据变化后比较虚拟 DOM 的差异，最后更新需要更新的地方
3. 核心是需要将模板变成 JS 语法，通过 JS 语法生成虚拟 DOM

转换为语法树需要重新组装代码为新语法，将 `template` 语法转换为 `render()` 函数。

修改 `init.js` 文件解析模板参数，步骤如下：

1. 判断传递的参数是否有 `render()` 函数返回 JSX，如果有该函数，无需做任何处理
2. 没有 `render()` 函数则需要判断是否有 `template` 模板标签，有的话通过函数转化为ast树
3. 没有 `template` 模板，则把获取到的 el 的外部标签赋值给 `template` 变量

代码如下：

```js
import { compileToFunction } from "./compiler/index";
import { initState } from "./state";

// 给Vue增加init方法
export function initMixin(Vue) {
  // 初始化操作
  Vue.prototype._init = function (options) {
    // ...

    if (options.el) {
      vm.$mount(options.el);
    }
  };

  // 由于把$mount方法挂载到原型上，因此除了传el外，可直接new Vue().$mount也可以
  Vue.prototype.$mount = function (el) {
    const vm = this;
    el = document.querySelector(el);
    let ops = vm.$options;

    // 查看是否写render函数
    if (ops.render) {
      ops.render;
    } else {
      // 没有render看一下是否写template，没写采用外部的template
      let template;
      // 如果没有写模板但是写了el
      if (!ops.template && el) {
        template = el.outerHTML;
      } else {
        if (el) {
          // 如果有el，采用模板的内容
          template = ops.template;
        }
      }

      // 写了template，就采用写了的template
      if (template) {
        const render = compileToFunction(template);
        ops.render = render;
      }
    }
  };
}
```

> 注意
>
> `script` 标签引用的是 `vue.glogal.js` 这个编译过程是在浏览器中运行的。
>
> `runtime` 是不包括模板编译的，整个编译是打包的时候通过 loader来编译 `.vue` 文件的，用 `runtime` 不可使用 `template` .

### 模板转ast语法树

HTML 主要解析标签、文本、属性、表达式，首先在 `src` 文件夹下新建一个 `compiler/index.js` 文件，用于解析语法转为 ast 树。

接着创建正则，通过正则匹配开始标签、属性、闭合标签和表达式或文本内容，代码如下：

```js
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;

// 匹配到的是<xxx 或 <div:xxx 自定义标签名 即匹配到开始标签
const startTagOpen = new RegExp(`^<${qnameCapture}`);

// 匹配的是 </xxx> 即匹配到结束标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);

// 匹配的是属性，如 xxx = "xxx" 或 xxx = 'xxx'
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

// 匹配的是开始闭合标签，如<div> 或 <br />
const startTagClose = /^\s*(\/?)>/;

// 匹配到是表达式变量，如{{name}}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
```

然后声明 `compileToFunction` 函数并导出供上方 解析模板参数 步骤代码时使用，该函数主要做以下两个操作：

1. 将template转为ast语法树
2. 生成render方法（render方法执行后返回的结果就是虚拟 DOM）

代码如下：

```js
export const compileToFunction = (template) => {
  // 1.将template转为ast语法树
  const ast = parseHTML(template);

  // 2.生成render方法（render方法执行后返回的结果就是虚拟 DOM）
};
```

紧接着创建 `parseHTML` 函数，用于通过正则 `.match()` 方法解析 html，文本解析规则如下：

1. 先匹配开始标签，如 `<div`
2. 然后匹配属性，如 `id="xxx" class="xxx"`
3. 接着匹配文本内容
4. 最后匹配结束标签，如 `</div>`
5. 由于标签层层嵌套，因此通过 `while` 循环，循环到一个则通过 `continue` 中止当前循环，减少后续代码执行的性能消耗
6. 解析匹配完后获取到相对应的索引下标，截取字符串的形式截取匹配过的内容。这样匹配完后也截取完了， `while` 循环自动终止

代码如下：

```js
// 解析html
function parseHTML(html) {
  // 处理开始标签
  function start(tag, attrs) {
    console.log(tag, attrs, "开始");
  }
  // 处理文本内容标签
  function chars(text) {
    console.log(text, "文本");
  }
  // 处理结束标签
  function end(tag) {
    console.log(tag, "结束");
  }

  // 裁剪html
  function advance(n) {
    html = html.substring(n);
  }

  // 寻找开启标签
  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1], // 标签名
        attrs: [], // 属性数组对象，保存id、class等
      };
      // 先把 <div 开始标签截取掉
      advance(start[0].length);

      // 如果不是开始标签的结束，则一直匹配
      let attr, end;
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        // 此时 id="xxx" class="xxx" 都被删除，只剩 >
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
      }
      // 此时把 > 删除
      if (end) {
        advance(end[0].length);
      }
      return match;
    }

    // 不是开始标签，返回假
    return false;
  }

  // 每解析一段，就删除一段，直到最后解析完毕。因此可以写一个while循环
  while (html) {
    // html最开始肯定是一个 < (vue2要求单个根目录的原因)
    let textEnd = html.indexOf("<");

    // 如果索引是0，则说明是个开始标签；不为0则说明是结束标签
    if (textEnd === 0) {
      const startTagMatch = parseStartTag();

      if (startTagMatch) {
        // startTagMatch :{
        //   attrs: [{name: 'id', value: 'app'}]
        //   tagName: "div"
        // }
        // 解析到开始标签
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }

      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        end(endTagMatch[0]);
        advance(endTagMatch[0].length);
        continue;
      }
    }

    // 截取文本内容
    if (textEnd > 0) {
      let text = html.substring(0, textEnd);
      if (text) {
        // 解析到文本
        chars(text);
        advance(text.length);
      }
    }
  }
}
```

打印如下所示：

![打印](https://pic.imgdb.cn/item/64f6fcf8661c6c8e54ac3ded.jpg)

匹配解析完毕之后，需要根据解析好的数据构建 ast树对象，而如何得知标签与标签之间的嵌套关系呢？

通过栈的方式，依次往里面放入节点，直到匹配到结束标签，才把该节点从栈中剔除。

AST 树结构为一个对象，包含以下属性：

```js
{
  tag,
  type: 1,
  children: [],
  attrs,
  parent: null,
}
```

其中：

- tag 为标签名，在开始标签匹配时能获取
- type 为标签类型，是标签节点函数文本内容节点
- children 为子节点数组
- attes 为当前标签的属性，在开始标签匹配时能获取
- parent 为当前节点的父节点判断父节点通过栈来获取，栈最后一个即其父节点

分析结束，贴上代码。代码如下：

```js
// 解析html
function parseHTML(html) {
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3;
  const stack = []; // 存放元素的数组
  let currentParent; // 指向栈中的最后一个
  let root; // 是否是根节点

  // 转为抽象语法树
  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null,
    };
  }

  // 处理开始标签
  function start(tag, attrs) {
    let node = createASTElement(tag, attrs); // 创建一个ast树节点
    // 判断是否是空树
    if (!root) {
      root = node; // 空树则是当前树的根节点
    }
    // 如果栈中最后一个有内容，则把当前节点的父亲节点赋值为栈的最后一个
    if (currentParent) {
      node.parent = currentParent; // 子节点记住了父节点
      currentParent.children.push(node); // 父节点的子节点数组也需要保存值
    }
    // currentParent为栈中最后一个
    stack.push(node);
    currentParent = node;
  }
  // 处理文本内容标签
  function chars(text) {
    // 去除空
    text = text.replace(/\s/g, "");
    // 文本直接放到当前指向节点中
    text &&
      currentParent.children.push({
        type: TEXT_TYPE,
        text,
        parent: currentParent,
      });
  }
  // 处理结束标签
  function end(tag) {
    // 弹出最后一个节点，该节点已结束，不能作为父节点的判断
    let node = stack.pop();
    currentParent = stack[stack.length - 1];
  }

  // ...

  console.log("currentParent", currentParent);
  console.log("rot", root);
}
```

### 图解

如果还是无法理解接下来用图解的方式来说明，先看一段 HTML 代码：

```html
<div id="app">
  <div>
    hello
  </div>
  <span>{{name}}</span>
</div>
```

初始化栈 `stack` ，此时栈还是空的。

此时开始循环匹配，匹配第一个是 `<div id="app"` 开始标签，往栈中追加该 `div` ，创建 AST 树，并把它设为根节点 `root` 。然后截取掉该 `div` ，HTML 代码变为了：

```html
>
  <div>
    hello
  </div>
  <span>{{name}}</span>
</div>
```

而栈为：

```
[div#app]
```

然后继续循环，匹配到开始标签 `<div` ，其父节点则为栈中最后一项，即根节点的 `div#app` ，再往内追加标签，生成 AST 树，最后截取 HTML，代码更新如下：

```html
	>
    hello
  </div>
  <span>{{name}}</span>
</div>
```

而栈更新为：

```
[div#app div]
```

AST 树图解如下：

![AST 树图解](https://pic.imgdb.cn/item/64f712c8661c6c8e54b293ab.jpg)

接着继续循环，匹配到文本内容，赋值给当前节点的 `text` 属性，即当前栈最后一项。然后再截取 HTML。更新后的代码如下：

```html
	</div>
  <span>{{name}}</span>
</div>
```

此时栈不变，而 AST 树更新如下：

![AST 树更新](https://pic.imgdb.cn/item/64f713a1661c6c8e54b2af08.jpg)

继续匹配，匹配到结束标签，则把 `div` 剔除，此时该 `div` 标签的 AST 树生成完毕，栈更新为：

```
[div#app]
```

接着循环，此时匹配到 `span` 标签，获取栈最后一项，是根节点 `div#app` ，则其为 `span` 标签的父节点，再往栈中追加 `span` 标签。代码更新为：

```html
	>{{name}}</span>
</div>
```

栈更新为：

```
[div#app span]
```

此时 AST 更新为：

![AST 更新](https://pic.imgdb.cn/item/64f714f8661c6c8e54b2e82f.jpg)

然后继续匹配，匹配到了文本内容，赋值给当前节点也就是栈最后一项 `span` ，更新 AST 树：

![更新](https://pic.imgdb.cn/item/64f715a1661c6c8e54b3083e.jpg)

截取去除相应 HTML 代码后接着循环，匹配到结束标签，剔除 `span` ，最后匹配到 `div#app` 的结束标签，把该节点也从栈中剔除，最后 AST 树创建完毕。

## 代码生成虚拟DOM

接下来转为虚拟 DOM 元素，虚拟 DOM 包含三个方法：

- `_v` ：创建文本
- `_c` ：创建元素
- `_s` ：创建变量

最终生成的虚拟 DOM 如下所示：

```html
_v(_s(name)+'hello'+_s(age))

# 对应以下的 HTML 标签节点：

<div id="app">
      <div>{{name}} hello {{age}}</div>
</div>
```

处理 `gen` 函数中为文本的判断逻辑，首先创建一个数组 `tokens` ，创建好一个虚拟 DOM 后追加到数组内，后续数组转字符串拼接的形式输出出去。

接着循环文本内容，通过前面写的正则匹配到模板字符串 `{{xxx}}` 的形式，`.match()` 方法匹配到后用 `_s()` 拼接起来。由于不确定其前后是否会有空格，最好用 `.trim()` 方法去除前后空格。

然后开始做判断，总共有以下几种情况：

1. 该标签只有模板字符串，没有其他内容，正常循环完毕即可，无需做额外处理

2. 文本内容在模板字符串前，如下方代码所示：

   ```html
   <span>hello {{name}}</span>
   ```

   因此在循环前先做判断，判断正则匹配到的内容索引是否在当前文本索引后面，如果在后面，说明前面有文本内容，需要先截取这段内容放到 `tokens` 数组内

3. 文本内容在模板字符串后，如下方代码所示：

   ```html
   <span>{{name}} hello</span>
   ```

   此时当前匹配的模板字符串索引比整体文本内容小，需要把后面的内容截取追加到 `tokens` 数组内。

最后通过 `.join()` 方法把数组转为字符串的形式返回出去。代码如下所示：

```js
function gen(child) {
  if (child.type === 1) {
    // 节点
    return codegen(child);
  } else {
    // 文本
    let text = child.text;
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`;
    } else {
      // c创建元素
      // v创建文本
      // s创建变量
      // _v(_s(name)+'hello+_s(name))
      let tokens = [];
      let match;
      let lastIndex = 0;
      defaultTagRE.lastIndex = 0; // 每次捕获后先把索引重置
      while ((match = defaultTagRE.exec(text))) {
        let index = match.index;

        // 不能单纯放 {{xxx}} 的结果，也要放文本。如{{name}} hello {{age}}，第一次匹配到{{name}}，第二次匹配到{{age}}。则hello的索引位置是最后一次匹配到的内容长度（即{{age}}）加上其索引，即为整个文本长度
        // 注意要添加 JSON.stringify 转为字符串的形式
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }

      // 如果匹配结束索引比整体长度要小，说明模板字符串在前内容在后，如{{name}} hello，此时把后面所有文本放进去即可
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      return `_v(${tokens.join("+")})`;
    }
  }
}
```

> 注意
>
> `index` 是当前匹配到哪个位置的索引，初始为0，匹配完毕之后把当前索引加上匹配的模板字符串内容长度即为下一次开始匹配时第一个字符串的索引位置。
>
> 其次是文本内容添加到数组 `tokens` 内时需要搭配 `JSON.stringify()` 方法转为字符串的形式，否则后续会把该文本识别为变量

返回 `compileToFunction` 函数，此时已经能获取到虚拟 DOM 了，返回一个 `with` 函数。代码如下：

```js
export const compileToFunction = (template) => {
  // 1.将template转为ast语法树
  const ast = parseHTML(template);

  // 2.生成render方法（render方法执行后返回的结果就是虚拟 DOM）
  // render() {
  //   return _c('div', {id: 'app'}, _c('div', {style: {color: 'red'}}, _v(_s(name)+'hello'))), _c('span', undefined, _v(_s(age)))
  // }
  let code = codegen(ast);
  code = `with(this){return ${code}}`;
  let render = new Function(code);

  return render;
};
```

## 虚拟DOM生成真实DOM

### 准备执行 render 函数

此时原型上是没有这些 `_c` 、`_v` 的方法的，因此运行刷新后会报错。现在给 Vue 原型绑定这些方法。

前面已经介绍过每个方法的功能与作用，这里不做过多赘述，新建一个 `lifecycle.js` 文件，主要做以下流程：

1. 创造响应式数据
2. 模板转换成ast语法树
3. 将ast语法树转换了render函数
4. 后续每次数据更新可以只执行render函数（无需再执行ast转化过程

render会产生虚拟节点（响应式数据）。根据生成的虚拟节点创造真实dom

代码如下：

```js
import { createElementVNode, createTextVNode } from "./vdom/index";

export const initLifeCycle = (Vue) => {
  Vue.prototype._update = function (vnode) {};

  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments);
  };
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments);
  };

  Vue.prototype._s = function (value) {
    if (typeof value === "object") return;
    return JSON.stringify(value);
  };

  Vue.prototype._render = function () {
    const vm = this;

    // 让with中的this指向vm
    return vm.$options.render.call(vm); // 通过ast语法转义后的render方法
  };
};

export const mountComponent = (vm, el) => {
  // 1.调用render方法产生虚拟节点 虚拟dom
  vm._update(vm._render());

  // 2.根据虚拟DOM产生真实dom

  // 3.插入到el元素中
};
```

返回 `src/index.js` 文件扩展方法，代码如下：

```js
import { initMixin } from "./init";
import { initLifeCycle } from "./lifecycle";

// ...
initLifeCycle(Vue);

export default Vue;
```

新建 `ndom/index.js` 文件，用于创建虚拟DOM 节点，代码如下：

```js
// h() _c()
export function createElementVNode(vm, tag, data, ...children) {
  // 避免data为null报错
  if (data == null) data = {};

  let key = data.key;
  if (key) {
    delete data.key;
  }

  return vnode(vm, tag, key, data, children);
}

// _v()
export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

// ast做的是语法层面的转换，描述的是语法本身（可以描述js、css、html）
// vnode虚拟dom描述的是dom元素，可以增加一些自定义属性
function vnode(vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text,
  };
}
```

最后返回 `src/init.js` 文件，挂载 `mountComponent ` 方法。

```js
import { mountComponent } from "./lifecycle.js";
// ...

// 给Vue增加init方法
export function initMixin(Vue) {
  // ...

  // 由于把$mount方法挂载到原型上，因此除了传el外，可直接new Vue().$mount也可以
  Vue.prototype.$mount = function (el) {
    // ...

    mountComponent(vm, el); // 组件挂载到实例上

    // 获取到render方法
  };
}
```

> 题外话
>
> AST 树与 vnode 虚拟 DOM 节点是不同的含义，AST 树做的是语法层面的转换，描述的是语法本身（可以描述js、css、html）。而 vnode  虚拟dom描述的是dom元素，可以增加一些自定义属性

### 实现转换

接下来修改原型上的 `_update()` 方法实现转换。首先获取到旧 DOM 节点和新的虚拟 DOM，代码如下：

```js
Vue.prototype._update = function (vnode) {
  // 将vnode转换为真实dom
  const vm = this;
  const el = vm.$el;

  // patch既有初始化功能，又有更新的功能
  vm.$el = patch(el, vnode);
};
```

`patch` 方法主要用于判断是真实 DOM 还是虚拟 DOM，真实 DOM 则创建新的 DOM，替换掉旧的 DOM。

```js
function patch(oldVnode, vnode) {
  // 写的是初渲染流程
  const isRealElement = oldVnode.nodeType;

  if (isRealElement) {
    // 是真实dom节点
    const elm = oldVnode; // 获取真实元素
    const parentElm = elm.parentNode; // 拿到父元素

    let newElm = createElm(vnode);
    console.log(newElm);

    // 先把新的放到老旧节点下面，然后再删除老旧节点
    parentElm.insertBefore(newElm, elm.nextSibling);
    parentElm.removeChild(elm);
    
    // 返回新的dom节点
    return newElm;
  } else {
    // 是虚拟dom元素
  }
}
```

`createElm` 方法通过当前的类型判断是标签还是文本，而样式则单独处理。

```js
function createElm(vnode) {
  let { tag, data, children, text } = vnode;

  if (typeof tag === "string") {
    // 是字符串，创建的是标签。将真实节点和虚拟节点对应起来，后续如果修改属性了，可通过虚拟节点找到真实节点
    vnode.el = document.createElement(tag);

    // 处理元素的属性
    patchProps(vnode.el, data);

    // 处理儿子，通过递归的方式；递归创建完后要把它塞到该元素内部
    children.forEach((element) => {
      vnode.el.appendChild(createElm(element));
    });
  } else {
    // 不是字符串，创建的是文本
    vnode.el = document.createTextNode(text);
  }

  return vnode.el;
}

function patchProps(el, props) {
  for (const key in props) {
    if (key === "style") {
      for (const styleName in props.style) {
        el.style[styleName] = props.style[styleName];
      }
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}
```

### 测试

设置一个定时器，一段时间后修改变量内容，代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="app" style="color: red; font-size: 14px">
      <div>{{name}} hello {{age}}</div>
      <span>world</span>
    </div>
    <script src="./vue.js"></script>
    <script>
      const vm = new Vue({
        el: "#app", // 将数据解析到el元素上
        data: {
          name: "tydumpling",
          age: 23,
          list: ["eat", { a: 1 }],
        },
      });

      vm.$mount("#app");
      setTimeout(() => {
        vm.name = "tydumpling";
        vm.age = 24;
        vm._update(vm._render());
        // console.log(vm);
      }, 1500);
    </script>
  </body>
</html>
```

页面效果能够实现，说明已经成功。

总结一下：

1. 将数据先处理成响应式 `initState()` （针对对象来说主要是增加 `defineProperty` ，针对数组就是重写方法）
2. 模板编译：将模板先转换为 AST 树，将 AST 语法树生成 `render` 方法
3. 调用 `render` 方法函数，进行取值操作，产生对应的虚拟 DOM `render() {_c('div', null, _v(name))}` ，触发 `get` 方法
4. 将虚拟 DOM 渲染成真实 DOM

## 更新

### 依赖收集

依赖收集主要是以下操作：

1. 给模板的属性增加一个 Dep
2. 页面渲染的时候，将渲染逻辑封装到 Watcher 中
3. 让 Dep 记住这个 Watcher，属性变化后可以找到对应 Dep 中存放的 Watcher 进行重新渲染
4. 观察者模式

首先我们要梳理 `Dep` 和 `Watcher` 的关系，给每个属性添加一个dep，目的就是收集watcher。

一个视图有多个属性，也就是n个dep对应1个watcher。同样的，一个属性在多个视图都有，因此1个dep对应多个watcher

在 `observe` 文件夹下新建一个 `watcher.js` 文件，该文件用于设置侦听器

```js
import Dep from "./dep";

let id = 0;

// 当创建渲染watcher的时候，会把当前渲染的watcher放到 Dep。target上
// 调用_render() 会取值，走到get上

class Watcher {
  // 不同组件有不同的watcher 目前只有一个 渲染根实例的
  constructor(vm, fn, options) {
    this.id = id++;

    // 渲染一个watcher
    this.renderWatcher = options;

    // getter意味着调用这个函数可以发生取值操作
    this.getter = fn;

    // 后续实现计算属性，和一些清理工作需要用到
    this.deps = [];

    this.depsId = new Set();

    this.get();
  }

  get() {
    // 静态属性只有一份
    Dep.target = this;
    // 会去vm上取值
    this.getter();
    // 渲染完毕后清空
    Dep.target = null;
  }

  addDep(dep) {
    let id = dep.id;

    if (!this.depsId.has(id)) {
      this.deps.push(dep);
      this.depsId.add(id);
      dep.addSub(this); // watcher已经记住dep而且去重了，此时让dep也记住watcher
    }
  }

  update() {
    console.log("update");
    // 重新渲染
    this.get();
  }
}

// 需要给每个属性添加一个dep，目的就是收集watcher
// 一个视图有多个属性，也就是n个dep对应一个watcher。同样的，一个属性在多个视图都有，因此1个dep对应多个watcher

export default Watcher;
```

回到 `lifecycle.js` 文件中引入该类方法，在调用 `render` 方法产生虚拟 DOM 之前调用该类方法，配置监听器。

```js
import Watcher from "./observe/watcher";

// ...

export const mountComponent = (vm, el) => {
  // 这里的el是通过 querySelector处理过的
  vm.$el = el;

  const updateComponent = () => {
    vm._update(vm._render());
  };
  const a = new Watcher(vm, updateComponent, true);
  console.log(a);

  // 1.调用render方法产生虚拟节点 虚拟dom
  vm._update(vm._render());
};
```

在 `src/observe` 文件夹下新建 `dep.js` 文件，用于为每一个属性绑定，且要与监听器建立联系，代码如下：

```js
let id = 0;

class Dep {
  constructor() {
    // 属性的dep要收集watcher
    this.id = id++;

    // 存放当前属性对应的watcher
    this.subs = [];
  }

  depend() {
    // this.subs.push(Dep.target); 这样写会重复
    // 让watcher记住dep。既要watcher不重复，又要单向关系dep->watcher
    Dep.target.addDep(this);

    // dep和watcher是一个多对多的关系（一个属性可以在多个组件中的加入，一个组件中由多个属性组成）
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }

  notify() {
    // 告诉watcher要更新了
    this.subs.forEach((watcher) => watcher.update());
  }
}

Dep.target = null;

export default Dep;
```

在 `observe/index.js` 文件的 `defineReactive` 函数方法代理对象时先调用 `Dep` 类中的 `depend` 方法记住当前 `watcher` ，在修改完毕后触发更新。代码如下：

```js
import { newArrayProto } from "./array";
import Dep from "./dep";

// ...

export function defineReactive(target, key, value) {
  // 递归思想，如果value值的类型不是对象，则return；如果是对象，则继续劫持
  observe(value);

  let dep = new Dep();

  // 此处value存放在闭包中，不会销毁
  Object.defineProperty(target, key, {
    // 取值执行get
    get() {
      if (Dep.target) {
        dep.depend(); // 让这个属性收集器记住当前的watcher
      }
      return value;
    },
    // ...
  });
}
```

现在运行代码，可以发现依赖已成功收集。

### 异步更新

现在每次代码走到 `observe/index.js` 文件中的 `set` 方法时调用 `dep.notify()` 方法实现更新。但是这是每更新一个属性她都会调用，如果更新多个属性他就会调用多次。

希望等待所有更新事件都执行完毕之后，再去走一个方法，减轻性能消耗。也就是把更新变为异步。

回到 `observe/watcher.js` 文件中修改 `update()` 方法，现在不是直接调用 `get()` 方法更新，而是写一个方法 `queueWatcher()` ，把当前的 `watcher` 暂存放到队列中，并且记录该 `watcher` 。如果更新同一个属性，`watcher` 相同，则不会多次更新。代码如下：

```js
// ...

class Watcher {
  // ...

  update() {
    queueWatcher(this);
    // 重新渲染
    // this.get();
  }
}

let queue = [];
let has = {};
function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has[id]) {
    queue.push(watcher);
    has[id] = true;
    console.log(queue, has);
  }
}

export default Watcher;
```

现在有效果了。但是如果多个组件更新，则 `update()` 操作也会多次调用。

希望的效果是无论 `uopdate` 执行多少次，但是最终只执行一轮刷新操作。也就是防抖操作。设置一个定时器，执行完同步任务后再去把栈和队列清空，执行更新操作。代码如下：

```js
// ...

class Watcher {
  // ...

  update() {
    queueWatcher(this);
    // 重新渲染
    // this.get();
  }

  run() {
    this.get();
  }
}

let queue = [];
let has = {};
let pending = false;

function flushSchedulerQueue() {
  let flushQueue = queue.slice(0);
  queue = [];
  has = {};
  pending = false;
  flushQueue.forEach((q) => q.run());
}

function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has[id]) {
    queue.push(watcher);
    has[id] = true;
    console.log(queue, has);

    if (!pending) {
      setTimeout(flushSchedulerQueue, 0);
      pending = true;
    }
  }
}

export default Watcher;
```

现在效果能够实现在所有属性都更新完毕后再统一更新的操作了。接下来通过 `debugger` 来帮助加深理解。

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <script src="./vue.js"></script>
    <script>
      const vm = new Vue({
        el: "#app", // 将数据解析到el元素上
        data: {
          name: "tydumpling",
          age: 23,
          list: ["eat", { a: 1 }],
        },
      });

      vm.$mount("#app");
      setTimeout(() => {
        debugger;
        vm.name = "tydumpling";
        vm.name = "tydumpling";
        vm.name = "tydumpling";
        vm.age = 24;
        vm._update(vm._render());
      }, 1500);
    </script>
  </body>
</html>
```

首先代码走到 `vm.name='tydumpling'` ，然后走到 `state.js` 文件中 `proxy` 函数的 `set()` 方法修改值，接着进入到 `observe/index.js` 中 `defineReactive` 函数的 `set()` 方法，触发 `notify()` 方法更新。

去到 `dep.js` 文件，调用其 `notify()` 方法，调用 `watcher` 类中的 `update()` 方法，继续调用刚刚写好的 `queueWatcher` 方法函数，把该 `watcher` 放到队列中。第一次 `pending`  为假，则调用定时器。

同步任务还没做完，因此定时器不会执行，而是在队列中等待，继续修改 `name` 属性，走刚刚的操作，但是该属性 `id` 已经有了，因此不再往队列中加入 `watcher` 。

等待所有同步任务执行完毕，最后执行定时器，的内容，清空队列和栈，再调用 `run()` 方法更新数据。

由于是异步更新，因此修改完值后 DOM 元素的数据有时并未能及时获取到最新值，而直接用定时器 `setTimeout` 又不够优雅，Vue2 提出的 `$nextTick` 方法则采用了优雅降级的方法：

1. nextTick中不是直接使用定时器API，而是采用优雅降级的方法，放到队列中是同步，单独开是异步
2. 内部先采用的是promise（ie不兼容） MutationObserver（H5的API） 都不兼容再采用 setImmediate（ie专享），最后都不兼容就采用 定时器

代码如下：

```js
function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has[id]) {
    queue.push(watcher);
    has[id] = true;
    console.log(queue, has);

    if (!pending) {
      nextTick(flushSchedulerQueue, 0);
      pending = true;
    }
  }
}

let callbacks = [];
let waiting = false;

function flushCallbacks() {
  waiting = false;
  let cbs = callbacks.slice(0);
  callbacks = [];
  // 按照顺序执行nextTick内容方法函数
  cbs.forEach((cb) => cb());
}

let timeFn;
if (Promise) {
  timeFn = () => {
    Promise.resolve().then(flushCallbacks);
  };
} else if (MutationObserver) {
  // 这里传入的回调是异步执行的
  let observe = new MutationObserver(flushCallbacks);
  let textNode = document.createTextNode(1);
  observe.observe(textNode, {
    characterData: true,
  });
  timeFn = () => {
    textNode.textContent = 2;
  };
} else if (setImmediate) {
  timeFn = () => {
    setImmediate(flushCallbacks);
  };
} else {
  timeFn = () => {
    setTimeout(flushCallbacks);
  };
}

export function nextTick(cb) {
  // 先内部还是先用户？先用户。维护nextTick中的callback方法
  callbacks.push(cb);
  if (!waiting) {
    timeFn();
    waiting = true;
  }
}
```

再 `src/index.js` 文件中挂载该方法到原型上：

```js
import { nextTick } from "./observe/watcher";

// ...

Vue.prototype.$nextTick = nextTick;


export default Vue;
```

最后测试一下，效果实现：

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="app" style="color: red; font-size: 14px">
      <div>{{name}} hello {{age}}</div>
      <span>world</span>
    </div>
    <script src="./vue.js"></script>
    <script>
      const vm = new Vue({
        el: "#app", // 将数据解析到el元素上
        data: {
          name: "tydumpling",
          age: 23,
          list: ["eat", { a: 1 }],
        },
      });

      vm.$mount("#app");
      vm.name = "tydumpling";
      vm.age = 24;

      // $nextTick并不是创建一个异步任务，而是将这个任务维护到队列中而已
      vm.$nextTick(() => {
        let app = document.querySelector("#app");
        console.log(app.innerHTML);
      });
    </script>
  </body>
</html>
```

### 计算属性

计算属性 依赖的值发生变化才重新执行 计算属性中要维护一个 `dirty` 属性，默认计算属性不会立即执行。

计算属性就是一个 `definePropety` 。计算属性也是一个 watcher，默认渲染会创造一个渲染 watcher 。

去到 `observe/dep.js` 文件，之前 `dep` 是直接把 `watcher` 赋值上去，现在要把其作为一个队列，然后依次放入栈中；取出则把栈最后一个去除。代码如下：

```js
let stack = [];
// 渲染时入栈
export function pushTarget(watcher) {
  stack.push(watcher);
  Dep.target = watcher;
}
// 渲染完后出栈
export function popTarget() {
  stack.pop();
  Dep.target = stack[stack.length - 1];
}
```

`observe/watcher.js` 文件引入使用：

```js
import Dep, { popTarget, pushTarget } from "./dep";

class Watcher {
  // ...

  get() {
    // 静态属性只有一份
    pushTarget(this);
    // 会去vm上取值
    this.getter();
    // 渲染完毕后清空
    popTarget();
  }
}

// ...

export default Watcher;
```

在 Vue2 ，计算属性有两种写法：

```js
computed: {
  full() {
    return this.name
  },
  // 或者
  full: {
    get() {
      return this.name
    },
    set(newVal) {
      console.log(newVal)
    }
  }
}
```

因此后续需要做判断。

首先来到 `state.js` 文件。这里曾初始化 `data` 内的数据，因此在下方添加计算属性 `computed` 的初始化方法，步骤如下：

1. 循环遍历 `computed` 对象，获取其每一个属性
2. 判断当前的属性是函数写法还是对象写法，如果是函数写法，直接获取该属性为 `get` ；如果是对象写法，则获取其 `get` 属性
3. 通过 `Object.defineProperty` 代理

代码如下：

```js
export function initState(vm) {
  // 获取所有选项
  const opts = vm.$options;

  // 如果有data数据，则初始化data数据
  if (opts.data) {
    initData(vm);
  }

  // 如果有计算属性，则初始化计算属性
  if (opts.computed) {
    initComputed(vm);
  }
}

function initComputed(vm) {
  const computed = vm.$options.computed;

  // 循环computed对象，拿到每一个计算属性
  for (const key in computed) {
    let userDef = computed[key];

    defineComputed(vm, key, userDef);
  }
}

function defineComputed(target, key, userDef) {
  const getter = typeof userDef === "function" ? userDef : userDef.get;
  const setter = userDef.set || (() => {});

  // 通过实例拿到对应的属性
  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
  });
}
```

现在能够实现计算属性的页面渲染了，但是有一个问题：

```js
computed: {
  full() {
    console.log("run");
    return this.name + this.age;
  },
},
```

在计算属性内添加一个 `console.log` ，查看控制台，他会在初始化渲染、值变动多次调用，不符合计算属性 “缓存” 的特性，因此接下来需要实现缓存的操作。

让自己的依赖属性通过侦听器去收集依赖，在类中声明一个变量 `dirty` ，如果未发生变化，则为 `false` 表示没有污染，可以使用旧值；如果发生改变则变为 `true` ，使用新值。

首先去到 `state.js` 文件，修改新增三个函数方法：

```js
function initComputed(vm) {
  const computed = vm.$options.computed;
  // 吧计算属性watcher保存到vm上
  const watchers = (vm._computedWatchers = {});

  // 循环computed对象，拿到每一个计算属性
  for (const key in computed) {
    let userDef = computed[key];

    // 监控计算属性get的变化
    let fn = typeof userDef === "function" ? userDef : userDef.get;

    // 如果直接 new Watcher，就会直接执行fn，但是我们不希望他立即执行，而是懒执行
    watchers[key] = new Watcher(vm, fn, { lazy: true });

    defineComputed(vm, key, userDef);
  }
}

function defineComputed(target, key, userDef) {
  // const getter = typeof userDef === "function" ? userDef : userDef.get;
  const setter = userDef.set || (() => {});

  // 通过实例拿到对应的属性
  Object.defineProperty(target, key, {
    get: createComputedGetter(key),
    set: setter,
  });
}

// 计算属性根本不会收集依赖，只会让自己的依赖属性去收集依赖
function createComputedGetter(key) {
  // 检测是否要执行这个getter
  return function () {
    // 获取到对应属性的watcher
    const watcher = this._computedWatchers[key];
    if (watcher.dirty) {
      // 如果是脏的就去执行用户传入的函数。求值后dirty变为false，下次就不求值了
      watcher.evaluate();
    }
    if (Dep.target) {
      // 计算属性出栈后 还要渲染watcher 应该让计算属性watcher里的属性也收集上一层watcher
      watcher.depend();
    }
    return watcher.value;
  };
}
```

去到 `observe/watcher.js` 文件，为 `watcher` 类添加以下属性或方法：

1. 添加 `lazy` 属性，表示是否需要懒执行函数

   因为直接 `new Watcher` 调用类，其 `fn` 函数会立即执行。如果不想他立即执行，就需要变量来做三元表达式。

2. 添加 `dirty` 属性，表示当前的计算属性是否被污染了

3. 添加 `evaluate()` 方法，该方法实际上也是调用了 `get()` 方法，只不过还处理 `dirty` 变量

4. 添加 `depend()` 方法，让计算属性也收集渲染 `watcher`  

代码如下：

```js
class Watcher {
  // 不同组件有不同的watcher 目前只有一个 渲染根实例的
  constructor(vm, fn, options) {
    this.id = id++;

    // 渲染一个watcher
    this.renderWatcher = options;

    // getter意味着调用这个函数可以发生取值操作
    this.getter = fn;

    // 后续实现计算属性，和一些清理工作需要用到
    this.deps = [];

    this.depsId = new Set();

    // 获取是否需要懒加载的布尔值
    this.lazy = options.lazy;
    this.dirty = this.lazy;
    this.vm = vm;
    // 如果为真则不执行，为假才执行
    this.lazy ? undefined : this.get();
  }

  evaluate() {
    // 获取用户的返回值，并且标识为脏
    this.value = this.get();
    this.dirty = false;
  }

  get() {
    // 静态属性只有一份
    pushTarget(this);
    // 会去vm上取值
    let value = this.getter.call(this.vm);
    // 渲染完毕后清空
    popTarget();
    // 返回给evaluate函数使用
    return value;
  }

  depend() {
    let i = this.deps.length;

    while (i--) {
      // 让计算属性watcher也收集渲染watcher
      this.deps[i].depend();
    }
  }
}
```

### 侦听器

侦听器有三种写法：

- 字符串

  ```js
  watch: {
    name: 'listerenName'
  },
  methods: {
    listerenName(newVal, oldVal) {
      // ...
    }
  }
  ```

- 数组

  ```js
  watch: {
    listerenName: [
      (newVal, oldVal) => {
        // ...
      }
    ]
  }
  ```

- 函数

  ```js
  watch: {
    listerenName(newVal, oldVal) {
      // ...
    }
  }
  ```

- 直接调用

  ```js
  vm.$watch((newVal, oldVal) => {
    //...
  })
  ```

因此写法可以给 Vue 函数的原型上添加 `$watch` 的方法，所有写法最终都调用该方法。

首先前往 `index.js` 给原型挂载方法：

```js
// 侦听器最终调用的都是这个方法
Vue.prototype.$watch = function (exprOrFn, cb) {
};
```

`exprOrFn` 可能是一个函数，如 `()=>vm.nam` ；也可能是字符串，如 `name` 。

`cb` 为对应的侦听函数。

接着去到 `state.js` 文件添加侦听器的判断，并对侦听器做处理，处理内容如下：

1. 循环 `watch` 对象，得到每一个属性
2. 判断该属性是哪种写法，如果是数组，则再次循环，获取其中每一项函数方法；字符串或函数则无需额外操作
3. 创建并调用 `createWatcher` 新方法，接收三个参数：当前实例 `vm` 、当前属性的键名、当前属性的键值
4. 判断键值是什么类型，如果是字符串，则说明其函数方法在 `methods` 内，需要获取。最后调用实例原型上的 `$watch` 方法

代码如下：

```js
export function initState(vm) {
  // 获取所有选项
  const opts = vm.$options;

  // ...

  // 如果有侦听器，则初始化侦听器
  if (opts.watch) {
    initWatch(vm);
  }
}

function initWatch(vm) {
  let watch = vm.$options.watch;

  for (const key in watch) {
    // 拿到值来判断是哪种情况：字符串、数组、函数
    const handler = watch[key];

    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

// 侦听器处理
function createWatcher(vm, key, handler) {
  if (typeof handler === "string") {
    // 如果是字符串，写法为 watch: {name: 'fn'} 此时函数在methods内，直接拿过来用
    handler = vm[handler];
  }

  // 最后都是走$watch方法
  return vm.$watch(key, handler);
}
```

回到 `index.js` 修改原型上的 `$watch` 方法，经过处理后传了侦听器的名称和对应函数方法，只需要调用 `Watcher` 类去侦听做处理。代码如下：

```js
// 侦听器最终调用的都是这个方法
Vue.prototype.$watch = function (exprOrFn, cb) {
  console.log(exprOrFn, cb);
  // exprOrFn可能是一个函数，如()=>vm.nam；也可能是字符串，如name

  // {user：true} 表示这是用户写的

  // 调用Watcher类表示值发生了变化，调用cb函数即可
  new Watcher(this, exprOrFn, { user: true }, cb);
};
```

`Watcher` 类现在需要修改调整。第二个参数之前传的必定是函数，因此直接使用。现在可能是字符串，就需要做额外的处理。

在 `this` 上保存函数 `cb` 与是否是用户自己的 `watcher` 。

`Watcher` 类执行的方法是 `run()` ，之前是直接调用 `get()` 方法，现在则需要判断，如果是用户的，则需要调用 `cb` 函数，返回新值与旧值。

代码如下：

```js
class Watcher {
  // 不同组件有不同的watcher 目前只有一个 渲染根实例的
  constructor(vm, exprOrFn, options, cb) {
    this.id = id++;

    // 渲染一个watcher
    this.renderWatcher = options;

    // getter意味着调用这个函数可以发生取值操作
    if (typeof exprOrFn === "string") {
      // 去实例上取相对应的函数
      this.getter = function () {
        return vm[exprOrFn];
      };
    } else {
      this.getter = exprOrFn;
    }

    // ...

    this.cb = cb;
    this.user = options.user; // 标识是否是用户自己的watcher
  }

  // ...

  run() {
    let oldValue = this.value;
    let newValue = this.get();
    if (this.user) {
      // 用户自己的watcher
      this.cb.call(this.vm, newValue, oldValue);
    }
  }
}
```

### 数组更新

在此之前，需要先明确几点：

1. `vm.arr[0] = 1` 这种方法不能监控到，因为只重写数组方法
2. `vm.arr.length = 100` 没有监控数组长度变化，因此也不能监控到

在 `template` 取值的时候，会调用 `JSON.stringfy()` 对数组中的对象取值，所以对象会收集依赖。

这里要注意的是，改变的不是 `arr` 属性，而是 `arr` 对象的数组对象。

给数组本身添加 dep，如果数组更新某一项，可以触发 dep 更新；给对象也添加 dep，如果后续用户增添属性，可以触发 dep 更新。

## Diff 算法

在之前更新中每次更新，都会产生新的虚拟节点，通过新的虚拟节点生成真实节点，生成后替换掉老的节点。

第一次渲染的时候会产生虚拟节点，第二次更新我们也会调用 render 方法产生新的虚拟节点。比对出需要更新的内容后再更新部分。

diff 算法是一个平级比较的过程，父亲和父亲对比，儿子和儿子对比。比对思路如下：

1. 两个节点不是同一个节点，直接删除老的换上新的（没有比对）
2. 同一个节点（判断节点的tag和key）比较两个几点是否有差异（复用老节点）
3. 节点比较完毕后比较两人的孩子

在 `lifecycle.js` 文件的 `patch` 函数方法中比对虚拟节点，首先比对新旧节点的 `tag` 和 `key` 是否相等，相等说明没有更新，复用旧节点；然后比对文本内容是否有更新，有更新则覆盖；最后调用 `patchProps` 来比对标签属性。代码如下：

```js
export function isSameVnode(vnode1, vnode2) {
  return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
}

function patch(oldVnode, vnode) {
  if (isRealElement) {
    // ...
  } else {
    // 是虚拟dom元素，考虑几种情况
    // 1.两个节点不是同一个节点，直接删除老的换上新的（没有比对）
    // 2.同一个节点（判断节点的tag和key）比较两个几点是否有差异（复用老节点）
    // 3.节点比较完毕后比较两人的孩子
    if (isSameVnode(oldVnode, vnode)) {
      // 用老父亲的节点进行替换
      let el = createElm(vnode);
      oldVnode.el.parentNode.replaceChild(el, oldVnode.el);
      return el;
    }

    // 文本的情况，文本我们期望比较一下内容
    let el = (vnode.el = oldVnode.el); // 复用老节点的元素
    if (!oldVnode.tag) {
      if (oldVnode.text !== vnode.text) {
        el.textContent = vnode.text; // 新文本覆盖老文本
      }
    }

    // 标签的情况，比对标签属性
    patchProps(el, oldVnode.data, vnode.data);
  }

  return el;
}
```

修改 `patchProps` 方法函数，对比标签属性，思路如下：

1. 老属性有新属性没有的，要删除对应老属性
2. 老样式有新样式没有的，要删除对应老样式
3. 用新的覆盖老的（即之前的代码）

修改后代码如下：

```js
function patchProps(el, oldProps, props) {
  // 老的属性中有新的没有，要删除老的
  let oldStyles = oldProps.style || {};
  let newStyles = props.style || {};
  // 老的样式中有新的吗？没有则删除
  for (const key in oldStyles) {
    if (!newStyles[key]) {
      el.style[key] = "";
    }
  }

  // 老的属性中有新的吗？没有则删除
  for (const key in oldProps) {
    if (!props[key]) {
      el.removeAttribute(key);
    }
  }

  // 用新的覆盖老的
  // ...
}
```

然后在 `patch` 函数后面继续比对子节点，在比较前需要判断双方是否有子节点，没有则赋值空数组。共有以下几种可能：

1. 双方都有子节点（数组长度大于0）则完整diff 算法比较，比较二者的儿子
2. 旧节点没有子节点，新节点有，把新节点添加
3. 旧节点有子节点，新节点没有，直接删除

代码如下：

```js
function patch(oldVnode, vnode) {
  // ...

  // 比较儿子节点，比较的时候需要判断双方是否有儿子
  let oldChildren = oldVnode.children || [];
  let newChildren = vnode.children || [];
  if (oldChildren.length > 0 && newChildren.length > 0) {
    // 完整的diff算法，需要比较二个人的儿子
    updateChildren(el, oldChildren, newChildren);
  } else if (newChildren.length > 0) {
    // 没有老的，有新的
    mountChildren(el, newChildren);
  } else if (oldChildren.length > 0) {
    // 没有新的，有老的，直接删除即可
    el.innerHTML = "";
  }

  return el;
}

// 把新的儿子节点给老的父节点
function mountChildren(el, newChildren) {
  for (let i = 0; i < newChildren.length; i++) {
    const child = newChildren[i];
    el.appendChild(createElm(child));
  }
}

function updateChildren(el, oldChildren, newChildren) {
  // 针对数组的方法（push、pop、sort、unshift、shift）做优化。Vue2采取双指针，比较两个节点
  let oldStartIndex = 0;
  let newStartIndex = 0;
  let oldEndIndex = oldChildren.length - 1;
  let newEndIndex = newChildren.length - 1;

  let oldStartVnode = oldChildren[0];
  let newStartVnode = newChildren[0];

  let oldEndVnode = oldChildren[oldEndIndex];
  let newEndVnode = newChildren[newEndIndex];

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 双方有一方头指针大于尾部指针，则停止循环（有一方不满足则停止，|| 有一方满足则为true，继续执行）
  }
}
```

接下来判断它们子节点 diff 算法的索引位置，有开始索引和结束索引。

判断新节点的开始索引和新节点的结束索引匹配，旧节点的开始索引和旧节点的结束索引匹配。从两边往中间缩小。

然后判断旧节点开始索引和新节点结束索引，旧节点结束索引和新节点开始索引。

如果新节点的开始索引到最后小于等于新节点的结束索引说明新节点有多的虚拟 DOM，多余的追加进去。

如果旧节点的开始索引到最后小于等于旧节点的结束索引说明旧节点有多的虚拟 DOM，多余的删除。

代码如下：

```js
function updateChildren(el, oldChildren, newChildren) {
  // 针对数组的方法（push、pop、sort、unshift、shift）做优化。Vue2采取双指针，比较两个节点
  let oldStartIndex = 0;
  let newStartIndex = 0;
  let oldEndIndex = oldChildren.length - 1;
  let newEndIndex = newChildren.length - 1;

  let oldStartVnode = oldChildren[0];
  let newStartVnode = newChildren[0];

  let oldEndVnode = oldChildren[oldEndIndex];
  let newEndVnode = newChildren[newEndIndex];

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 双方有一方头指针大于尾部指针，则停止循环（有一方不满足则停止，|| 有一方满足则为true，继续执行）
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 相同节点，递归比较子节点
      patchVnode(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];

      // 比较开头节点
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 相同节点，递归比较子节点
      patchVnode(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];

      // 比较开头节点
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 交叉对比 abcd -> dabc
      patchVnode(oldEndVnode, newStartVnode);
      // 将旧的尾部节点移动到旧的头部去。insertBefore具有移动性，会将原来的元素移动走
      el.insertBefore(oldEndVnode.el, oldStartVnode.el);

      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 交叉对比 abcd -> dabc
      patchVnode(oldStartVnode, newEndVnode);
      // 将旧的尾部节点移动到旧的头部去。insertBefore具有移动性，会将原来的元素移动走
      // nextSibling如果没写，则会插入错误，如 abcd -> dcba 时，a会插到d前面
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);

      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    }
  }

  if (newStartIndex <= newEndIndex) {
    // 新的多了，多余的插入进去
    for (let i = newStartIndex; i < newEndIndex; i++) {
      let childEl = createElm(newChildren[i]);

      // 这里可能向后追加，也有可能是向前添加
      let anchor = newChildren[newEndIndex + 1]
        ? newChildren[newEndIndex + 1].el
        : null;
      // el.appendChild(childEl);
      anchor为null是会被认为是appendChild;
      el.insertBefore(childEl, anchor);
    }
  }

  if (oldStartIndex <= oldEndIndex) {
    // 老的多了，需要删除老的
    for (let i = oldStartIndex; i < oldEndIndex; i++) {
      let childEl = oldChildren[i].el;
      el.removeChild(childEl);
    }
  }
}
```

最后才考虑乱序更新 Diff 算法流程，乱序更新无非三种情况，根据老的列表做映射关系，用新的去寻找。找得到则移动，找不到则添加，多余的就删除。

## 组件

在 Vue2 中，提供了一个 [extend](https://v2.cn.vuejs.org/v2/api/) 方法手动挂载组件，官方文档Demo使用示例代码如下：

```js
// 创建构造器
var Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data: function () {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
// 创建 Profile 实例，并挂载到一个元素上。
new Profile().$mount('#mount-point')
```

可以看出步骤为：创建组件，`new` 组件实例，最后挂载。

因此需要为 Vue 全局挂载一个 `extend` 方法，该方法是一个函数。示例代码中 `new` 调用了组件实例后调用 `$mount()` 方法挂载，而这个方法在 Vue 原型上，因此可以把 Vue 的原型挂载到 `extend` 下的子类原型上。

代码如下：

```js
export function initGloablAPI(Vue) {
  Vue.options = {};
  Vue.extend = function (options) {
    function Sub(options = {}) {
      // 最终使用一个组件 就是new一个实例
      this._init(options)
    }

    // 原型复用，方法独立 Sub.prototype.__proto__ === Vue.prototype
    Sub.prototype = Object.create(Vue.prototype);
    Sub.prototype.constructor = Sub;
    Sub.options = options; // 保存用户传递的选项

    return Sub;
  };
}
```

本质上就是创造了一个子类，继承了 Vue 内的原型方法。每一次创建实例，都会 `new Sub` ，初始化子组件，把子组件的选项赋值给 `Sub.options` 上。如果 `data` 是一个对象形式，则会相互影响。

> 注意
>
> 第 10 行代码必须要有，因为 `Object.create` 方法会造成一个潜在的 BUG ，继承后方法 `Sub` 原型上的构造器就不是自己的了，因此要指向自己。

在 Vue 中有一个全局 `component` 方法，用于创建组件，因此收集对应的 `id` 和 `definition` ，代码如下：

```js
Vue.options.components = {}; // 全局指令 Vue.options.directives
Vue.component = function (id, definition) {
  // 如果definition是一个函数，说明用户调用了 Vue.extend
  definition = typeof definition === 'function' ? definition : Vue.extend(definition)
  Vue.options.components[id] = definition;
};
```

接着创建子类的构造函数时，会将全局的组件和自己身上定义的组件进行合并（组件的合并，会先查找自己在查找全局）

然后渲染组件，编译组件的模板变成 `render` 函数，调用 `render` 方法。会根据标签类型来区分是否是组件，如果是组件会创造组件的虚拟节点（组件增加初始化钩子，增加 `componentOption` 选项，稍后创在组件的真实节点。

最后创建真实节点。