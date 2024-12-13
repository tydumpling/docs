# React

## 本质

是一个由数据渲染视图的 JavaScript 库。

React 是一个用于构建用户界面的 JAVASCRIPT 库。

**特点：**

1. 采用组件化模式、声明式编码，提高开发效率及组件复用率
2. 在 React Native 中可以使用 React 语法进行移动端开放
3. 使用虚拟 DOM + 优秀的 Diffing 算法，尽量减少与真实 DOM 的交互

## 无脚手架项目初实现

1. 引入对应的 react 核心库、dom 操作库与 babel `jsx` 转 `js` 的资源
2. 准备容器（如 vue 中挂载元素的 `#app` ）
3. script 标签设置类型为 babel，进行翻译
4. 创建虚拟 DOM
5. 通过 `ReactDOM.render` 渲染到界面中

```html
<body>
  <!-- 准备一个 “容器” -->
  <div id="test"></div>

  <!-- 引入react核心库，引入后会有全局的React -->
  <script src="../js/react.development.js"></script>
  <!-- 引入react dom操作，引入后会有全局的ReactDOM -->
  <script src="../js/react-dom.development.js"></script>
  <script src="../js/babel.min.js"></script>

  <!-- 告诉浏览器，此处不是js而是jsx，且靠babel编译为js -->
  <script type="text/babel">
    // 1.创建虚拟DOM
    const vDOM = <h1>Hello, React</h1> // jsx可以使用标签和文本混着写。不需要加引号
    // 2.渲染虚拟DOM到界面
    console.log(React);
    ReactDOM.render(vDOM, document.querySelector('#test'))
  </script>
</body>
```

> 注意
> 
> 1. 如果在创建虚拟 DOM 时给标签加上单引号，则不是在创建标签，而是把 `<h1>Hello, React</h1> ` 这个字符串作为内容赋值过去，页面也是显示这个内容。
> 2. 如果想要追加，不能多写一个 `ReactDOM.render` ，代码如下：
>    ```javascript
>    ReactDOM.render(vDOM, document.querySelector('#test'))
>    ReactDOM.render(vDOM2, document.querySelector('#test'))
>    ```
>    
>    这个操作是在覆盖，而不是追加，后面的内容会覆盖原来的内容。后续讲到组件后再实现追加功能。

## 虚拟DOM的创建方式

### js

除了使用 jsx 创建虚拟 DOM 外，还能使用 js 的方式创建，此时不再需要引入 `babel` ，方法如下：

```html
<body>
  <!-- 准备一个 “容器” -->
  <div id="test"></div>

  <!-- 引入react核心库，引入后会有全局的React -->
  <script src="../js/react.development.js"></script>
  <!-- 引入react dom操作，引入后会有全局的ReactDOM -->
  <script src="../js/react-dom.development.js"></script>

  <script type="text/javascript">
    // 参数1：标签名；参数2：标签属性；参数3：标签内容
    const vDOM = React.createElement('h1', {id: 'title'}, 'hello, react by js')
    ReactDOM.render(vDOM, document.querySelector('#test'))
  </script>
</body>
```

在创建虚拟 DOM 时，由于没有 jsx 语法，因此不能直接写标签。React 提供 `React.createElement` 方法，该方法与 `document.createElement` 相比的区别在于前者用于创建虚拟 DOM，后者创建真实 DOM。

但是这个方法并不是一劳永逸替代 jsx 的，jsx 创建之初就是用来做创建虚拟 DOM 的语法糖，自然会有其特点。我们来看下面这个需求：我要那段文本放到一个 `span` 标签内，如果用 js 的方式，写成如下形式：

```javascript
const vDOM = React.createElement('h1', {id: 'title'}, '<span>hello, react by js</span>')
```

结果可想而知，打印到页面上的内容是包含标签的内容。

### jsx

jsx 是语法糖，如果想要实现上面那个需求，代码只需写为如下形式：

```jsx
const vDOM = (
    <h1 id="title">
        <span>Hello, React</span>
    </h1>
)
```

他的实质是通过 `babel` 转换为如下代码：

```javascript
const vDOM = React.createElement('h1', {id: 'title'}, React.createElement('span', {}, 'hello, react by js'))
```

## 虚拟DOM与真实DOM

关于虚拟 DOM ，其本质是 Object 类型的一般对象，而真实 DOM 利用控制台输出则是输出一个标签。通过 `debugger` 断点后可以发现他有很多属性与方法。

### 总结

1. 虚拟 DOM 比较“轻量”，真实 DOM 比较“重”。因为虚拟 DOM 是 React 内部使用，无需真实 DOM 那么多变量方法
2. 虚拟 DOM 最终会被 React 转换成真实 DOM，呈现在页面上
3. 虚拟 DOM 本质是 Object 对象

## jsx语法规则

jsx 全称:  `JavaScript XML`，是 react 定义的一种类似于 XML 的 JS 扩展语法。JS + XML 本质是`React.createElement(component,props, ...children)` 方法的语法糖。

用来简化创建虚拟 DOM，写法如下：

```jsx
var ele = <h1> Hello JSX!</h1>
```

> 注意
> 
> 1. 它不是字符串, 也不是 `HTML/XML` 标签
> 2. 它最终产生的就是一个 JS 对象

基本语法规则：

1. 遇到 `<` 开头的代码，jsx 会以标签的语法解析
   - 如果标签首字母是小写字母开头，该标签会转为 `html` 同名元素，若无该标签对应的同名元素，则报错。
   - 若大写字母开头，`react` 就去渲染对应的组件。若组件没定义，则报错。
   ```jsx
   const vDOM = (
     <h1>
       <span>123</span>
       <Good></Good>
     </h1>
   )
   ```
2. 遇到以 `{` 开头的代码，以 JS 语法解析: 标签中的 `js` 表达式必须用 `{ }` 包含
   ```jsx
   const myId = 'tydumpling'
   const myContent = 'helLo,reAcT'
   // 1.创建虚拟DOM
   const vDOM = (
     <h1 id={myId.toLowerCase()}>
       <span>{myContent.toLowerCase()}</span>
     </h1>
   )
   ```
3. 类名指定不能使用 `class` ，要用 `className` 
   ```jsx
   const myId = 'tydumpling'
   const myContent = 'helLo,reAcT'
   // 1.创建虚拟DOM
   const vDOM = (
     <h1 className="title" id={myId.toLowerCase()}>
       <span>{myContent.toLowerCase()}</span>
     </h1>
   )
   ```
   
   如果使用了 `class` 虽然页面上会有效果，但是控制台会报错且给出提醒。
4. 内联样式设置不能写成字符串，需要使用双花括号 `{{}}` 的形式，采取驼峰命名法。
   ```jsx
   const myId = 'tydumpling'
   const myContent = 'helLo,reAcT'
   // 1.创建虚拟DOM
   const vDOM = (
     <h1 className="title" id={myId.toLowerCase()}>
       <span style={{color: '#eee', fontSize: '14px'}}>{myContent.toLowerCase()}</span>
     </h1>
   )
   ```
5. 虚拟 DOM 只能有一个根标签
   ```jsx
   const myId = 'tydumpling'
   const myContent = 'helLo,reAcT'
   // 1.创建虚拟DOM
   const vDOM = (
     <div>
         <h1 className="title" id={myId.toLowerCase()}>
           <span style={{color: '#eee', fontSize: '14px'}}>{myContent.toLowerCase()}</span>
         </h1>
       <h2 className="title" id={myId.toUpperCase()}>
           <span style={{color: '#eee', fontSize: '14px'}}>{myContent.toLowerCase()}</span>
         </h2>
     </div>
   )
   ```
6. 标签必须闭合。双标签需要 `<></>` ，单标签则是 `< />`

> babel.js的作用
> 
> 1. 浏览器不能直接解析 JSX 代码, 需要 `babel` 转译为纯 JS 的代码才能运行
> 2. 只要用了 JSX，都要加上`type="text/babel"` , 声明需要 `babel` 来处理

## jsx练习

下面有一段代码：

```html
<body>
  <div id="test"></div>

  <!-- 引入react核心库，引入后会有全局的React -->
  <script src="../js/react.development.js"></script>
  <!-- 引入react dom操作，引入后会有全局的ReactDOM -->
  <script src="../js/react-dom.development.js"></script>
  <!-- 通过jsx创建的方式 -->
  <script src="../js/babel.min.js"></script>


  <script type="text/babel">
    // 模拟数据
    const data = ['vue', 'react', 'uniapp']
    // 创建虚拟DOM
    const vDom = (
      <div>
        <h1>tydumpling学前端</h1>
        <ul>
          <li>vue</li>
          <li>react</li>
          <li>uniapp</li>
        </ul>
      </div>
    )

      // 渲染
      ReactDOM.render(vDom, document.querySelector('#test'))
  </script>
</body>
```

页面上效果实现，但是这么写数据是静态的写死的，现在需要通过 `data` 数组把里面的数据动态渲染到页面上。

前面也学到，可以通过 `{}` 把变量渲染到页面上，尝试把数组放进去渲染。代码如下：

```jsx
const vDom = (
  <div>
    <h1>tydumpling学前端</h1>
    <ul>
      {data}
    </ul>
  </div>
)
```

最终效果如下：

[![p9vhQu4.png](https://s1.ax1x.com/2023/05/31/p9vhQu4.png)](https://imgse.com/i/p9vhQu4)

发现 jsx 自动帮我们循环遍历数组获取数据渲染页面上了，如果换成对象又会有什么效果呢？尝试一下

```jsx
const data1 = {a:'vue', b:'react', c:'uniapp'}
// 创建虚拟DOM
const vDom = (
  <div>
    <h1>tydumpling学前端</h1>
    <ul>
      {data1}
    </ul>
  </div>
)
```

运行后发现页面无效果，控制台有报错，报错信息如下图所示：

[![p9vhwKe.png](https://s1.ax1x.com/2023/05/31/p9vhwKe.png)](https://imgse.com/i/p9vhwKe)

翻译一下大意就是他无法自动遍历循环对象数据，如果需要请使用数组代替。并很贴心的给我们把对象的每一项 `key` 值贴出来。

既然能循环，为何不在 `{}` 内使用 `for` 循环呢？说干就干。

[![p9vhsUI.png](https://s1.ax1x.com/2023/05/31/p9vhsUI.png)](https://imgse.com/i/p9vhsUI)

不等我们编译，编译器就已经给我们报错了。在 jsx 中，`{}` 内只能写表达式，不能写语句。其中：

- 表达式：一个表达式会产生一个值，可以放在任何需要值的地方
  1. `a`
  2. `a + b`
  3. `demo(1)`
  4. `arr.map()`
  5. `function test() {}`
- 语句：控制代码的流程走向
  1. `if() {}`
  2. `for() {}`
  3. `swicth() { case '': break; }`

因此通过 `map` 加工数组，让每一项都带一个 `li` 标签即可。尝试一下：

```jsx
const vDom = (
  <div>
    <h1>tydumpling学前端</h1>
    <ul>
      {
        data.map(item => {
          return <li>{item}</li>
        })
      }
    </ul>
  </div>
)
```

此时页面渲染成功，但是还不能完事大吉大利，查看控制台，发现他有如下报错：

```
Each child in a list should have a unique "key" prop.
```

他需要一个 `key` 值，作为虚拟 DOM 的每一项不同的标识，后续 `diff` 算法会以 `key` 为依据，因此 `key` 要唯一。本练习中可以使用索引来作为 `key` 值。

```jsx
const vDom = (
  <div>
    <h1>tydumpling学前端</h1>
    <ul>
      {
        data.map(item => {
          return <li key={index}>{item}</li>
        })
      }
    </ul>
  </div>
)
```

现在页面有效果，且不会报错。

## 组件

### 概念

用来实现局部功能效果的代码和资源的集合(html/css/js/image等等)。

作用：复用编码, 简化项目编码, 提高运行效率。

### 函数式组件

#### 使用

创建一个函数式组件，返回一个标签内容，代码如下所示：

```jsx
// 创建函数式组件
function Demo(params) {
  return <h1>函数式组件</h1>
}
```

创建完组件后就需要渲染到页面上，可是要如何渲染组件呢？回顾之前 《jsx 语法规则》里提到的，当 jsx 遇到 `<` ，就会渲染 `html` 结构。如果首字母小写，则当做 `html` 原生标签，首字母大写则视为组件。因此代码如下：

```jsx
ReactDOM.render(<Demo/>, document.querySelector('#test'))
```

运行后页面上有效果，且控制台不会报错。

#### 踩坑日记

1. 直接写 `demo` 
   ```jsx
   ReactDOM.render(demo, document.querySelector('#test'))
   ```
   
   报错信息如下：
   
   [![p9vIiuD.png](https://s1.ax1x.com/2023/05/31/p9vIiuD.png)](https://imgse.com/i/p9vIiuD)
   
   不能把函数作为渲染对象，只能使用虚拟 DOM 或 组件。
2. 首字母小写
   ```jsx
   ReactDOM.render(<demo/>, document.querySelector('#test'))
   ```
   
   这个错误就很眼熟了，原因上方也说明了。
   
   [![p9vIZ4I.png](https://s1.ax1x.com/2023/05/31/p9vIZ4I.png)](https://imgse.com/i/p9vIZ4I)

#### 拓展

- 函数式组件经过 `babel` 编译后开启严格模式，因此内部的 `this` 指向为 `undefined` 。
- `ReactDOM.reder(<Demo/>)` 执行之后，会做以下的操作：
  1. `React` 解析组件标签，找到 `Demo` 标签。
  2. 发现组件是使用函数定义的，随后调用该函数，将返回的虚拟 DOM 转为真实 DOM，随后呈现到页面中。

#### 总结

1. 函数式组件必须有返回
2. `ReactDOM.render()` 内必须是标签
3. 首字母必须大写

### 类式组件

#### 回顾

类的定义：创建一个 `Person` 类

```javascript
class Person {
    
}
// 创建一个实例对象
const p1 = new Person()
console.log(p1)
```

其中，类中的 `this` 指向 `new` 的对象，上方代码中，`this` 指向 `p1` 。

类中的方法放在了原型对象上，供实例对象使用。

```javascript
class Person {
    constructor(name) {
        this.name = name
    }
    speak() {
        console.log(this.name)
    }
}
// 创建一个实例对象
const p1 = new Person()
p1.speak()
```

但是方法 `speak` 内的 `this` 指向不一定是指向 `Person` 实例，在通过类调用时，指向实例对象。如果调用对象使用 `call` 或 `apply` 等改变 `this` 指向的方法，则 `speak` 的 `this` 指向也会改变。

```javascript
p1.speak().call({a: 1, b: 2})
```

> 总结：
> 
> 1. 类中的构造器不是必须写的，要对实例进行一些初始化操作（如添加指定属性时，才写）
> 2. 如果类A 继承类 B，且类 A 写了构造器，那么类 A 构造器中的 `super` 是必须调用的
> 3. 类中所定义的方法，都是放在类的原型对象上，供实例去使用

类中可以直接写赋值语句，例如：

```javascript
class A {
    constructor(name) {
        this.name = name
    }
    sex = '男'
}
```

如果这么写，其含义是给 A 的实例对象添加一个属性，值为 `sex` ，值为男。这个值是固定的，如果需要外部传递的还是需要写在构造器内。

#### 使用

创建一个类式组件，查看官网，官方代码要求我们做两个步骤：

1. 继承内置的 `React.Component` 类
2. 提供 `render` 方法，且要返回数据

最终代码如下所示：

```html
<body>
  <div id="test"></div>

  <!-- 引入react核心库，引入后会有全局的React -->
  <script src="../js/react.development.js"></script>
  <!-- 引入react dom操作，引入后会有全局的ReactDOM -->
  <script src="../js/react-dom.development.js"></script>
  <!-- 通过jsx创建的方式 -->
  <script src="../js/babel.min.js"></script>


  <script type="text/babel">
    // 创建类式组件
    // react中，类式组件要继承内置的一个类
    class ClassFn extends React.Component {
         // render放在 ClassFn 类原型对象上，供实例对象使用
      render() {
        return (
          <div>
            tydumpling
          </div>
        )
      }
    }

    // 渲染类式组件
    ReactDOM.render(<ClassFn />, document.querySelector('#test'))
  </script>
</body>
```

运行查看效果，页面能够看到效果，控制台也没有报错。但是要考虑多几步，既然页面能渲染，说明 `<ClassFn />` 获取到 `render` 内 `return` 的值。而 `render` 返回值只能给实例对象使用。我们又没有 `new` 创建实例对象，那么类式组件 `ReactDOM.render` 后发生了什么呢？

1. React 解析组件标签，找到 `ClassFn` 类式组件
2. `new` 一个实例对象，通过该实例对象调用原型上的 `render` 方法
3. 将 `render` 返回的数组渲染成真实 DOM，随后呈现在页面上

打印一下 `render` 内的 `this` ，打印如下：

[![p9vxToV.png](https://s1.ax1x.com/2023/05/31/p9vxToV.png)](https://imgse.com/i/p9vxToV)

后续我们主要考虑 `props` 、`refs` 、`state` 三个属性。

> 注意
> 
> 由于类式组件继承了 `React.Component` 组件方法，因此在原型上也能找到组件实例对象。

## state

### 概念

`state` 是组件对象最重要的属性, 值是对象(可以包含多个 `key-value` 的组合)。

组件被称为"状态机", 通过更新组件的 `state` 来更新对应的页面显示(重新渲染组件)。

在旧版本中，`state` 只能作用于 `this` 上获取，因此只有组件实例对象能够使用，函数式组件无法获取。新版函数式组件拥有 `hooks` ，也能使用对应的方法。

在类式组件中，借助构造器初始化 `state` 内的值，由于是继承，因此构造器需要接收实例对象传递过来的参数并调用 `super` ，否则报错。但是创建实例对象的操作并不是我们来做，而是底层代码帮我们处理，该怎么办呢？

遇事不决看文档，查看官方文档，发现其构造器接收一个 `props` （这个后续介绍），这个是一个形参，因此写成 abc 都没问题，但是要规范代码，因此不能那么写。

然后通过 `this` 初始化 `state` 的值。最终代码如下：

```html
<body>
  <div id="test"></div>

  <!-- 引入react核心库，引入后会有全局的React -->
  <script src="../js/react.development.js"></script>
  <!-- 引入react dom操作，引入后会有全局的ReactDOM -->
  <script src="../js/react-dom.development.js"></script>
  <!-- 通过jsx创建的方式 -->
  <script src="../js/babel.min.js"></script>


  <script type="text/babel">
    // 创建类式组件
    // react中，类式组件要继承内置的一个类
    class Weather extends React.Component {
      constructor(props) {
        super(props)
        this.state = {isHot: true}
      }
      render() {
        return (
          <div>
            今天天气很{this.state.isHot ? '炎热':'凉爽'}
          </div>
        )
      }
    }

    // 渲染类式组件
    ReactDOM.render(<Weather />, document.querySelector('#test'))
  </script>
</body>
```

### 事件绑定

#### 绑定事件

在原生中，绑定事件的方法为获取元素后，通过 `addEventListener` 或 `on + 事件名` 的形式绑定事件，试验一下：

```jsx
<div onclick="clickFn()">
  今天天气很{this.state.isHot ? '炎热':'凉爽'}
</div>

function clickFn(params) {
   console.log('click')
}
```

控制台提示报错，报错信息如下：

```javascript
Warning: Invalid event handler property `onclick`. Did you mean `onClick`?
```

提示我们要采取驼峰命名法的形式，事件要改为大写，这个是 `react` 的一个规范。修改后运行，发现控制台报了一个新的错误：

```javascript
Warning: Expected `onClick` listener to be a function, instead got a value of `string` type.
```

他想要一个函数，拿到的是一个字符串，联想一下 jsx 语法特性，尝试把引号去掉改为括号，再运行一次，发现有效果了，但是一运行就触发事件。推测是括号的原因让他自运行。去掉括号让他作为回调函数，刷新后发现正常运行，代码如下：

```jsx
class Weather extends React.Component {
  constructor(props) {
    super(props)
    this.state = {isHot: true}
  }
  render() {
    return (
      <div onClick={clickFn}>
        今天天气很{this.state.isHot ? '炎热':'凉爽'}
      </div>
    )
  }
}

function clickFn() {
   console.log('click')
}
```

#### this指向

接下来就是要在函数内获取 `state` 的值了，在其中输入 `console.log(this)` 查看其 `this` 指向，运行后符合预期，打印的是 `undefined` （原因在 jsx 语法与函数式组件已经说明了）

函数已经无法通过 `this` 获取到 `state` 的值了，需要另寻蹊径。可以创建一个变量存储 `constructor` 内的 `this` ，代码如下：

```jsx
let that
class Weather extends React.Component {
  constructor(props) {
    super(props)
    that = this
    this.state = {isHot: true}
  }
  render() {
    return (
      <div onClick={clickFn}>
        今天天气很{this.state.isHot ? '炎热':'凉爽'}
      </div>
    )
  }
}

function clickFn() {
   console.log(that)
}
```

这样就能够获取到类的 `this` 指向。但是代码不够优雅，还要多创建一个变量，有没有更好的方法呢？

类式组件中我们不仅能用构造器保存变量，也能创建方法，而方法内的 `this` 的指向是通过 `new` 创建出来的实例对象。因此尝试一下，代码如下：

```jsx
class Weather extends React.Component {
  constructor(props) {
    super(props)
    this.state = {isHot: true}
  }
  render() {
    return (
      <div onClick={this.clickFn}>
        今天天气很{this.state.isHot ? '炎热' : '凉爽'}
      </div>
    )
  }
  clickFn() {
    console.log(this)
  }
}
```

> 注意
> 
> 函数方法 `clickFn` 是在类 `Weather` 上，因此需要通过 `this.` 来获取调用。

查看控制台的打印，发现打印出来的 `this` 是 `undefined` 。这是为什么？为什么不是类 `Weather` ？

前面在回顾类的内容时也说过了，只有通过 `new 类名` 创建出来的实例对象调用方法时，方法中 `this` 的指向才是该实例。而本案例中调用方法的是 `div` 的点击事件，因此没办法获取到实例对象。

为了论证这个这个思想，我们新开一个测试页面，声明一个类，包含构造器和一个方法，创建一个实例对象，调用该方法。代码如下：

```javascript
class Test {
  constructor() {}
  say() {
    console.log(this);
  }
}

const test = new Test()
test.say() // Test {}
```

通过  `new` 创建的实例对象，打印出来的 `this` 确实是类 `Test` 。如果我把 `test.say` 这个函数赋值给一个变量 `a` ，那么 `a()` 调用函数后打印的 `this` 是谁呢？尝试一下：

```javascript
class Test {
  constructor() {}
  say() {
    console.log(this);
  }
}

const test = new Test()
test.say() // Test {}

let a = test.say
a()
```

此时查看控制台，打印出来的是 `undefined` 。为什么会这样？虽然我们知道只有通过 `new` 创建的实例对象调用的方法 `this` 才指向类，为什么赋值后指向是 `undefined` 呢？

在前面类的回顾中，我们讲到了类中的方法实际上是挂载到类的原型上，上面示例代码 `test.say()` 实际上是在 `test` 上找不到 `say()` 方法，继续往原型上找，最终找到类 `Test` 原型上的方法。

而 `let a = test.say` 这一步操作，则是把这个 `say()` 函数的地址赋值给 `a` ，画图演示：

[![p9xHgUg.png](https://s1.ax1x.com/2023/06/01/p9xHgUg.png)](https://imgse.com/i/p9xHgUg)

因此 `a()` 实际上只是通过地址找到内存中的这个 `say()` 函数并调用，而不是通过查找原型查找。而函数这么调用函数内的 `this` 指向的是 `window` ，但是类中声明的方法做了局部严格模式，因此最终打印的是 `undefined` 。下面可以做一个例子：

```javascript
function demo() {
    console.log(this) // window {}
}
function demo1() {
    'use strict'
    console.log(this) // undefined
}
demo()
demo1()
```

返回前面天气的例子，我们只是通过 `this.clickFn` 把这个函数的内存地址赋给 `div` 的 `onClick` 事件，严格模式下他自然打印 `undefined` 。

#### 解决指向

分析到此，那我们只需要考虑如何解决 `this` 指向问题即可。

修改函数 `this` 指向首先联想到 `call` 、`apply` 和 `bind` ，前二者都是立即执行，`bind` 是返回一个新函数，刚好可以把返回的新函数赋值给 `div` 的点击事件。

```jsx
class Weather extends React.Component {
  constructor(props) {
    super(props)
    this.state = {isHot: true}
    this.my_clickFn = this.clickFn.bind(this) // 类本身没有clickFn函数，往原型上找，找到了，修改this指向为类自身（原函数this指向是调用者），赋值给新函数
  }
  render() {
    return (
      <div onClick={this.my_clickFn}>
        今天天气很{this.state.isHot ? '炎热' : '凉爽'}
      </div>
    )
  }
  clickFn() {
    console.log(this)
  }
}
```

现在去打印，能够获取到类的 `this` 指向。

### setState

在 `react` 中，状态不可直接更改，需要调用 `react` 提供的 API `setState` ，让 `react` 监听到值的变化。更新是修改需要的属性然后合并，而不是替换全部的属性。

写法如下所示：

```jsx
const {isHot} = this.state
this.setState({isHot: !isHot})
```

现在点击后页面数据能够切换了。

效果实现后，往深层次考虑一下，在上面那个天气案例中，每个事件方法各自调用了几次：

- `constructor` ：在 `new` 创建实例后调用一次，之后不再调用
- `render` ：在 `new` 创建实例后调用一次，之后 `setState` 修改了值后再调用，因此是 `1 + n` 次（`n` 为状态修改的次数）
- `clickFn` ：方法被点击几次就调用了几次

### state简写形式

目前的构造器十分臃肿，既通过 `this` 为 `state` 设置变量，又通过修改 `this` 指向创建新函数，要怎么简写呢？

类可以把值写在类中，不需要写在构造器内，因此 `state` 可以抽取出来。

```javascript
constructor(props) {
  super(props)
  this.my_clickFn = this.clickFn.bind(this)
}
state = {isHot: true}
```

而函数也可以通过等号赋值的方式在类中创建声明，让其内部 `this` 指向类，先采取下方的代码：

```javascript
constructor(props) {
  super(props)
}
state = {isHot: true}
my_clickFn = function() {
    console.log(this)
    // ...
}
```

打印出来的 `this` 还是 `undefined` ，这是因为 `function` 创建出来的函数 `this` 指向其调用者，而调用者是 `div` 的点击事件，因此指向了全局 `window` ，又因为局部严格模式，最终打印出来的 `undefined` 。

难道要止步于此了么？别忘了 ES6 新出一个箭头函数，其最大的特点就是没有自己的 `this` 指向，指向外部的环境。如果我们把代码成为以下形式：

```javascript
constructor(props) {
  super(props)
}
state = {isHot: true}
my_clickFn = () => {
    console.log(this)
    // ...
}
```

此时函数 `my_clickFn` 的 `this` 指向是其外部环境类 `Weather` ，正好可以获取到 `state` 的值。

现在再来看看构造器，此时就剩下一句 `super` ，也不再需要，可以删除了，至此 `state` 简写完成。

### 总结

1. 组件中 `render` 方法中的 `this` 为组件实例对象
2. 组件自定义的方法中 `this` 为 `undefined`，如何解决？
   - 强制绑定 `this` ：通过函数对象的 `bind()`
   - 箭头函数
3. 状态数据，不能直接修改或更新，需要通过 `setState()`

## props

### 含义

通过标签属性从组件外向组件内传递变化的数据

```jsx
class Person extends React.Component {
  render() {
    const {name, age, sex} = this.props
    return (
      <ul>
        <li>{name}</li>
        <li>{age}</li>
        <li>{sex}</li>
      </ul>
    )
  }
}

ReactDOM.render(<Person name="tydumpling" age="18" sex="男"/>, document.querySelector('#test1'))
ReactDOM.render(<Person name="tydumpling" age="21" sex="男"/>, document.querySelector('#test2'))
ReactDOM.render(<Person name="tydumpling" age="23" sex="男"/>, document.querySelector('#test3'))
```

现在可以在组件实例动态传参渲染数据。

> 注意
> 
> 组件内部不要修改 `props` 数据，如果修改 `props` 的值并且替换原值则会报错。
> 
> ```javascript
> class Person extends React.Component {
>   render() {
>     const {name, age, sex} = this.props
>     this.props.name = 'newName' // 报错
>     // ...
>   }
> }
> ```
> 
> [![pCC4x78.png](https://s1.ax1x.com/2023/06/05/pCC4x78.png)](https://imgse.com/i/pCC4x78)

### 批量操作

在之前学习 ES6 新语法时，我们有学习过 `...` 展开运算符，可以展开数组 `...arr` ，但是不能展开对象。展开对象需要使用 `{}` 包裹，如 `{...obj}` 。

在 `react` 中，通过 `react` 和 `babel` 处理，让我们也能在组件上使用该语法批量传参，代码如下所示：

```jsx
const p = {name: 'tydumpling', age: 18, sex: '🚹'}
ReactDOM.render(<Person {...p}/>, document.querySelector('#test1'))
```

> 注意
> 
> 1. 该 `{...p}` 中的花括号 `{}` 与 es6 中的花括号不是同一个功能，因此不要把他理解为展开解构语法
> 2. `react` 与 `babel` 的处理仅能让我们在组件中批量赋值，不可在其他地方使用。如 `console.log({...p})` ，虽然不报错，但是结果为空

### 限制

`react` 中属性限制需要通过以下的方法设置：

```javascript
类.propTypes = {
  // 。。。
}
```

其中，`类.propTypes` 表示给该类设置限制，且 `propTypes` 不可修改，`react` 底层会去寻找它，找到它后就说明它有做限制。

#### 类型限制

导入 `prop-types` 包，用于做属性限制。导入后全局会有一个 `PropTypes` 。

```html
<script src="../js/prop-types.js"></script>

Person.propType = {
  name: PropTypes.string
}
```

> 注意
> 
> 1. 类型限制中为了不与 `React` 内置的 `String` 、`Number` 等方法冲突，这里采用小写的形式。但是函数类型限制不可使用 `function` ，因为这是声明函数的关键字，因此需要改为 `func` 
> 2. 旧版本中 `PropTypes` 放在 `React` 上。后续因为太臃肿才分离出来。旧版本写法为：
>    ```javascript
>    Person.propType = {
>      name: React.PropTypes.string
>    }
>    ```

#### 必传限制

必传限制可通过 `isRequired` 字段限制，可以跟在之前做的限制后面。

```javascript
Person.propType = {
  name: PropTypes.string.isRequired
}
```

#### 默认值

默认值可通过 `defineProps` 对象内设置对应的键值。

```javascript
Person.defineProps = {
  name: '默认名称'
}
```

### 简写形式

既然是类的方法，可以不要把他们放在类外部创建，而是写在类里面，写法如下：

```javascript
class Person extends React.Component {
  static propType = {
      name: PropTypes.string.isRequired
  }

  static defineProps = {
      name: 'abc'
  }
    
  render() {
    // ...
  }
}
```

### 构造器与props

构造器在继承父类时如果需要使用则必须要先在构造器中定义关键字 `super()` ，把参数传过去，如下：

```javascript
class A extends React.Component {
    constructor(props) {
        super(props)
    }
}
```

在 `React` 中，构造器接收的参数为 `props` 组件实例的传参。那么，有几个问题产生了：

- 问题一：`props` 传给 `super()` 和不传有什么区别
- 问题二：类中的构造器有什么作用

前往 `react` 官方文档，查询构造器，文档指路：[`constructor()`](https://zh-hans.legacy.reactjs.org/docs/react-component.html#constructor) 。

查看官网文档描述，已经针对两个问题都给出了答复：

问题一的答复：

在 React 组件挂载之前，会调用它的构造函数。在为 React.Component 子类实现构造函数时，应在其他语句之前调用 `super(props)`。否则，`this.props` 在构造函数中可能会出现未定义的 bug。

问题二的答复：

- 通过给 `this.state` 赋值对象来初始化[内部 state](https://zh-hans.legacy.reactjs.org/docs/state-and-lifecycle.html)。
- 为[事件处理函数](https://zh-hans.legacy.reactjs.org/docs/handling-events.html)绑定实例

### 函数式组件使用props

函数式组件也可以接收 `props` ，接收方法为函数接收参数的方法：通过形参接收参数。代码如下：

```jsx
function Person(props) {
    return (
        <ul>
            <li>{props}</li>
        </ul>
    )
}

Person.propType = {
  name: PropTypes.string.isRequired
}

Person.defineProps = {
  name: '默认名称'
}
```

但是目前的函数式组件无法使用 `state` 与 `refs` 。

### 总结

1. 通过为组件自身添加 `propTypes` 做类型、必传限制
2. 通过为组件自身添加 `defineProps` 做默认值
3. 通过 `static` 关键字可以把限制放到类中
4. 函数式组件只有新版的 `hooks` 帮助下可以使用 `refs` 和 `state` ，旧版只能使用 `props` 
5. `React` 15.5 版本后把限制 `propTypes` 抽离为单独的库，而不是放在 `React` 里，减少包体积

## refs

组件内的标签可以定义 `ref` 属性来标识自己，`ref` 有三种写法，下面一一介绍。

### 字符串写法

通过 `ref="xx"` 的形式为 DOM 节点绑定一个 `ref` 。

```jsx
class A extends React.Component {
  showFn = () => {
    const { input1 } = this.refs
    alert(input1.value)
  }
  
  showDataFn = () => {
    const { input2 } = this.refs
    alert(input2.value)
  }
  render() {
    return (
      <div>
        <input ref="input1" id="input1" type="text" />
        <button onClick={this.showFn}>点我</button>  
        <input ref="input2" id="input2" type="text" onBlur={showDataFn} />  
      </div>
    )
  }
}
```

> 注意
> 
> 这个写法不被官方推荐，且后续可能会被官方删除。因为字符串声明的 `ref` 会有效率问题。如果需要，更推荐使用回调函数或 `createRef()` 声明。

### 回调写法

通过一个回调函数，形参获取到 `ref` ，代码如下：

```jsx
<input ref={(a) => {console.log(a);}} id="input1" type="text" />
```

查看打印， `a` 为当前 DOM 节点。因此可以把获取到的值保存下来。

```jsx
class A extends React.Component {
  showFn = () => {
    const {input1} = this
    alert(input1.value)
  }
  render() {
    return (
      <div>
        <input ref={a => this.input1 = a} id="input1" type="text" />
        <button onClick={this.showFn}>点我</button>  
        <input ref="input2" id="input2" type="text" />  
      </div>
    )
  }
}
```

> 注意
> 
> 回调 `ref` 函数是以内联的方式定义的，在更新过程中他会被执行两次，一次是传入参数 `null` ，一次是传入参数 DOM 元素。可通过 将回调函数定义在 `class` 类中解决此问题。
> 
> 修改后的代码如下所示：
> 
> ```jsx
> class A extends React.Component {
>   showFn = () => {
>     const {input1} = this
>     alert(input1.value)
>   }
>   
>   myInput = e => {
>       this.input1 = e
>   }
>   render() {
>     return (
>       <div>
>         <input ref={this.myInput} id="input1" type="text" />
>         <button onClick={this.showFn}>点我</button>  
>         <input ref="input2" id="input2" type="text" />  
>       </div>
>     )
>   }
> }
> ```

### createRef

在 DOM 节点中创建 `ref` ：`ref={this.xx}` ，在类中通过 `xx = React.createRef()` 创建 `ref` 。

`React.createRef` 调用后返回一个容器，该容器可以存储被 `ref` 所标识的节点。输出后是一个对象 `{current : DOM 节点}` 。因此可以通过 `this.xx.current` 获取。

```jsx
class A extends React.Component {
  showFn = () => {
    const {myInput} = this
    alert(myInput.current.value)
  }
  
  myInput = React.createRef()
  render() {
    return (
      <div>
        <input ref={this.myInput} id="input1" type="text" />
        <button onClick={this.showFn}>点我</button>
      </div>
    )
  }
}
```

> 注意
> 
> 该容器是专人专用的，也就是说如果有两个 DOM 节点绑定同名的 `ref` ，后设置的 DOM 节点会覆盖前面的。

### 总结

字符串 `ref` 是最简单的，通过 `ref="xx"` 即可声明，但是是最不推荐的方法，因此条件允许下，能避免就避免。

回调形式的 `ref` 可采取内联式与外嵌式，写法如下：

- 内联式
  ```jsx
  <input ref={e => console.log(e)}
  ```
- 外嵌式
  ```jsx
  setInputRef = e => {
      this.inputRef = e
  }
  
  <input ref={this.setInputRef}
  ```

`createRef` 目前是官方最推荐的写法，步骤为：

1. 先声明 `ref` 
   ```jsx
   <input ref={this.myRef}
   ```
2. 通过 `React.createRef()` 把 `ref` 放到容器内
   ```jsx
   myRef = React.createRef()
   ```
3. 使用则通过其 `current` 获取
   ```jsx
   showFn = () => {
       console.log(this.myRef.current.value)
   }
   ```

> 注意
> 
> DOM节点与 `createRef` 声明的 `ref` 是一一对应关系。

## 事件处理

1. 通过 `onXxxx` 属性指定事件处理函数
   1. `React` 使用的是自定义事件，目的是为了更好的兼容性
   2. `React` 中的事件是通过事件委托的方式把子元素的事件绑定到父元素上，目的是提高效率
2. 触发事件的元素刚好是需要操作元素，可以通过 `event` 事件对象获取 DOM 元素对象，避免过度使用 `ref`

## 表单

### 受控组件

在输入的时候就能获取到值，把值放到 `state` 中。注意先初始化一遍状态。

```jsx
// 初始化state
state = {
    username: ''
}

// 保存用户名
demo = e => {
    this.setState({username: e.target.value})
}

<input onChange={this.demo} />
```

与非受控组件相比他能省略更多的 `ref` 绑定，更推荐使用这个方法。

### 非受控组件

现用现取，直接从自身的 DOM 元素绑定的 `ref` 获取值。

```jsx
handleSubmit = e => {
    e.preventDefault()
    const {username} = this
}

<form onSubmit={this.handleSubmit}>
    <input ref={e => this.username = e} name="username" />
    <button>登录</button>
</form>
```

## 生命周期

### 概念

1. 组件从创建到死亡它会经历一些特定的阶段。
2. `React` 组件中包含一系列勾子函数(生命周期回调函数), 会在特定的时刻调用。
3. 我们在定义组件时，会在特定的生命周期回调函数中，做特定的工作。

### 流程图（旧）

[![pCPxbDO.png](https://s1.ax1x.com/2023/06/06/pCPxbDO.png)](https://imgse.com/i/pCPxbDO)

#### 挂载流程

组件挂载到销毁的生命周期可查看左侧部分：

1. `constructor` 构造器获取参数
2. `componentWillComponent` 组件将要被创建时执行
3. `render` 组件执行创建 DOM 节点操作
4. `componentDidMount` 组件创建完毕，可以获取到 DOM 节点
5. `componentWillUnmount` 组件即将被销毁时触发

#### setState流程

调用 `setState()` 时触发页面更新，本质上是 `react` 调用了 `shouldComponentUpdate` 生命周期钩子，触发页面更新。

`shouldComponentUpdate` 钩子如果返回 `true` ，后续的操作都会执行；如果返回 `false` ，后续的操作都不会执行，页面不会更新。如果返回的不是一个布尔值，则会报错提示我们要返回 `true` 或 `false` 。

如果不写该钩子，则默认返回 `true` 。

当返回值为 `true` 时，会继续往下执行，触发组件即将更新 `componentWillUpdate` 钩子，然后 `render` 更新 DOM 节点。更新完毕后触发 `componentDidUpdate` 钩子表示更新完毕。

#### forceUpdate流程

`setState` 需要对状态 `state` 做出修改后发生更新，会走阀门 `shouldComponentUpdate` ，为真才继续更新。

而 `forceUpdate` 强制更新，不需要走阀门，可以在不更改任何状态的数据也能执行更新操作。

#### 父组件render流程

父组件的前提是组件之间要形成父子关系，下面创建两个类式组件，子组件写在父组件内就能形成父子组件关系，示例代码如下：

```jsx
class A extends React.Component {
    state = {
        carName = '奔驰'
    }

changeCarFn = () => {
    this.setState({carName: '迈巴赫'})
}

    render() {
          return (
            <div>
                A
                <B carName={this.state.carName} />
                <button onClick={this.changeCarFn}>点我换车</button>
            </div>
          )
    }
}

class B extends React.Component {
    componentWillReceiveProps() {
        console.log('componentWillReceiveProps')
    }
    
    render() {
          return (
            <div>
                B：this.props.carName
            </div>
          )
    }
}
```

 子组件中，`componentWillReceiveProps` 钩子在父组件第一次赋值时不会触发，只有点击换车按钮后更新新值才会触发该钩子函数。

#### 总结

1. 初始化阶段：由`ReactDOM.render()` 触发---初次渲染
   - `constructor()`
   - `componentWillMount` 
   - `render` 
   - `componentDidMount` （常用于发送请求初始化渲染数据、开启定时器、订阅消息等）
2. 更新阶段：由组件内部 `this.setState()` 或父组件 `render` 触发
   - `shouldComponentUpdate` 
   - `componentWillUpdate` 
   - `render` 
   - `componentDidUpdate`
3. 卸载组件：由 `ReactDOM.unmountComponentAtNode()` 触发
   - `componentWillUnmount` （常用于关闭定时器、取消订阅等）

### 流程图（新）

[![pCifYND.png](https://s1.ax1x.com/2023/06/07/pCifYND.png)](https://imgse.com/i/pCifYND)

#### 新旧版本对比

在新版中，旧版生命周期中的 `componentWillMount` 、`componentWillUpdate` 、`componentWillReceiveProps` 需要添加 `UNSAFE_` 前缀，不是不安全的意思，而是会出现潜在的 BUG。后期即将废弃。

新生命周期中，提出了两个新的钩子：`getDerivedStateFromProp` 、`getSnapshotBeforeUpdate` 。

#### getDerivedStateFromProp

根据生命周期图，`getDerivedStateFromProp` 会在 `constructor` 构造器后运行，尝试一下：

```jsx
class A extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getDerivedStateFromProp() {
        console.log('getDerivedStateFromProp')
    }
    
    // ...
}
```

运行后报错，提示信息如下：

[![pCi4rtS.png](https://s1.ax1x.com/2023/06/07/pCi4rtS.png)](https://imgse.com/i/pCi4rtS)

提示我们需要为其添加 `static` 关键字。

```jsx
class A extends React.Component {
    constructor(props) {
        super(props)
    }
    
    static getDerivedStateFromProp() {
        console.log('getDerivedStateFromProp')
    }
    
    // ...
}
```

添加后有打印了，但是还是有报错，报错信息如下：

[![pCi4h7V.png](https://s1.ax1x.com/2023/06/07/pCi4h7V.png)](https://imgse.com/i/pCi4h7V)

类 A 的 `getDerivedStateFromProp` 方法必须要返回一个 `state` 状态对象或者 `null` ，可是你返回的是一个 `undefined` 。其可以接收一个参数 `props` ，把 `props` 返回出去，但是不可更改。

此方法适用于 `state` 的值任何时候都适用于 `props` 。

#### getSnapshotBeforeUpdate

根据生命周期图，`getSnapshotBeforeUpdate` 会在 `render` 后运行，尝试一下：

```jsx
class A extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getSnapshotBeforeUpdate() {
        console.log('getSnapshotBeforeUpdate')
    }
    
    // ...
}
```

运行后有一个警告，提示我们需要返回一个快照，但是我们返回的是 `undefined` 。任何元素都可以作为一个快照：字符串、数值、布尔值，这个快照有什么用呢？

返回之前学习的一个钩子：`componentDidUpdate` ，他能接收两个参数：

- 参数一：`preProps` ，旧的 `props` 。
- 参数二：`preState` ，旧的状态对象 `state` 。
- 参数三：快照值。

而这个钩子返回的快照，会作为参数传给 `componentDidUpdate` 钩子的第三个参数。一般用于捕获页面滚动条位置，类似于 `Vue` 中的 `beforeUpdate` 生命周期函数，在 DOM 重新渲染更新前执行，获取快照。

#### 案例演示

```html
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible"
    content="IE=edge">
  <meta name="viewport"
    content="width=device-width, initial-scale=1.0">
  <title>test</title>
  <style>
    * {
      box-sizing: border-box;
    }

    .list {
      width: 300px;
      background-color: aqua;
      height: 180px;
      overflow: auto;
    }

    .list .item {
      height: 30px;
    }
  </style>
</head>

<body>
  <div id="test"></div>

  <script src="../js-new/react.development.js"></script>
  <script src="../js-new/react-dom.development.js"></script>
  <script src="../js-new/prop-types.js"></script>
  <script src="../js-new/babel.min.js"></script>

  <script type="text/babel">
    class Test extends React.Component {
      state = {newArr: []}

      getSnapshotBeforeUpdate() {
        return this.refs.list.scrollHeight
      }

      // 更新后保持高度，计算公式为：当前的高度减去保存的高度的差累加给其被卷去的高
      componentDidUpdate(preProps, preState, height) {
        this.refs.list.scrollTop += this.refs.list.scrollHeight - height
      }

      // 在这里模拟发送请求获取最新的数据
      componentDidMount() {
        setInterval(() => {
          const {newArr} = this.state
          const news = '新闻' + (newArr.length + 1)
          this.setState({newArr: [news, ...newArr]})
        }, 1000);
      }

      render() {
        return (
          <div className="list" ref="list">
            {
              this.state.newArr.map((item, index) => {
                return <div key={index} className="item">{item}</div>
              })
            }
          </div>
        )
      }
    }

    ReactDOM.render(<Test />, document.querySelector('#test'))
  </script>
</body>
```

#### 总结

1. 初始化阶段: 由ReactDOM.render()触发---初次渲染
   - constructor()
   - getDerivedStateFromProps 
   - render()
   - componentDidMount()
2. 更新阶段: 由组件内部this.setSate()或父组件重新render触发
   - getDerivedStateFromProps
   - shouldComponentUpdate()
   - render()
   - getSnapshotBeforeUpdate()
   - componentDidUpdate()
3. 卸载组件: 由ReactDOM.unmountComponentAtNode()触发
   - componentWillUnmount()

重要的勾子

1. render：初始化渲染或更新渲染调用
2. componentDidMount：开启监听, 发送ajax请求
3. componentWillUnmount：做一些收尾工作, 如: 清理定时器

即将废弃的勾子

1. componentWillMount
2. componentWillReceiveProps
3. componentWillUpdate

现在使用会出现警告，下一个大版本需要加上UNSAFE_前缀才能使用，以后可能会被彻底废弃，不建议使用。
