# 拓展

## setState

更新状态的两种写法

1. `setState(stateChange, [callback])` —— 对象式的 `setState`
   - `statechange` 为状态改变对象（该对象可以体现出状态的更改）
   - `callback` 是可选的回调函数，它在状态更新完毕、界面更新（`render` 调用）后触发
     
     这也说明，`react` 状态的更新是异步的。直接获取无法获取到最新的值，需要通过回调函数获取，代码如下所示：
     ```jsx
     add = () => {
       const {count} = this.state
       this.setState({count: count + 1}, () => {
         console.log('new', this.state.count) // new, 2
       })
       console.log('old', this.state.count) // old, 1
     }
     ```
2. `setState(updater, [callback])` ——函数式的 `setState` 
   - `updater` 为返回的 `stateChange` 对象的函数
   - `updater` 可以接收到 `state` 和 `props` 
     ```jsx
     add = () => {
       this.setState(state => ({count: state.count + 1}))
     }
     ```
   - `callback` 是可选的回调函数，它在状态更新完毕、界面更新（`render` 调用）后触发

总结：

对象式的 `setState` 是函数式的 `setState` 的简写方式（语法糖）

使用原则如下：

1. 如果新状态不依赖于原状态 => 使用对象方式更简便
2. 如果新状态依赖原状态 => 使用函数方式更简便
3. 如果需要再 `setState()` 执行后获取最新的状态数据，要在第二个 `callback` 函数中读取

## lazyLoad

路由组件懒加载，让路由组件实现需要显示时才加载，提高首屏加载速度。使用方式如下：

1. 在 `react` 中引入 `lazy` 
   ```javascript
   import React, { Component, lazy } from 'react'
   ```
2. 把引入的组件变为懒加载组件
   ```javascript
   const Home = lazy(() => import('./Home.vue'))
   ```
3. 使用
   ```jsx
   <Suspense fallback={<h1>loading...</h1>}>
     <Route path='/home' component={Home}></Route>
   </Suspense>
   ```
   
   通过 `Suspense` 标签包裹，`fallback` 表示在等待组件加载时显示的内容，可以是 DOM 标签，也可以是一个引入的组件。
   > 注意：
   > 
   > 如果使用组件展示 `loading` 该组件不可使用懒加载！

## stateHook

`State Hook` 让函数组件也可以有 `state` 状态, 并进行状态数据的读写操作

语法如下所示：

```javascript
const [xxx, setXxx] = React.useState(initValue) 
```

其中：

- 第一次初始化指定的值在内部作缓存，把 `initValue` 值赋给 xxx，从第二次开始就直接用缓存的数据，因此不会被 `initValue` 覆盖
- 返回包含2个元素的数组，第1个为内部当前状态值, 第2个为更新状态值的函数，可通过解构获取

setXxx() 拥有2种写法：

1. `setXxx(newValue)` ：参数为非函数值, 直接指定新的状态值, 内部用其覆盖原来的状态值。如 `setXxx(xxx + 1)` 
2. `setXxx(value => newValue)` ：参数为函数, 接收原本的状态值, 返回新的状态值, 内部用其覆盖原来的状态值。如`setXxx(xxx => xxx + 1)`

## EffectHook

Effect Hook 可以让你在函数组件中执行副作用操作(用于模拟类组件中的生命周期钩子)

React 中的副作用操作：

- 发ajax请求数据获取
- 设置订阅 / 启动定时器
- 手动更改真实DOM

语法和说明：

```
useEffect(() => { 
  // 在此可以执行任何带副作用操作
  return () => { // 在组件卸载前执行
    // 在此做一些收尾工作, 比如清除定时器/取消订阅等
  }
}, [stateValue]) // 如果指定的是[], 回调函数只会在第一次render()后执行
```

可以传入第二个参数，表明需要监测谁。如果不写，表示监测所有；如果写空数组，表示谁都不监测；如果写变量名，则只监测该变量的变化，变化才执行里面的代码。

下面实际使用一次：

```jsx
import React from 'react'

export default function App() {
  const [count, setCount] = React.useState(0)
  const [name, setName] = React.useState('tydumpling')
  function countChange() {
    setCount(count => count + 1)
  }
  function nameChange() {
    setName('tydumpling')
  }

  React.useEffect(() => {
    console.log('@');
  }, [name])


  return (
    <>
      <div>{count}, {name}</div>
      <button onClick={countChange}>数量</button>
      <button onClick={nameChange}>名字</button>
    </>
  )
}
```

此时只有改变 `name` 变量才会触发 Effect 回调，改变 `count` 则不会触发。如果想监听多个，直接在第二个参数的数组内添加即可。

下面有一个案例：我需要在页面挂载完毕后开启定时器，让数量自增1。点击卸载按钮后调用卸载页面的方法，但是卸载后出现报错，信息是页面卸载了但是没有取消定时器。因此需要卸载页面是侦听页面卸载取消定时器。

页面卸载事件是通过 `React.useEffect` 函数的返回值来触发，当页面卸载后会执行该回调函数的事件。示例代码如下所示：

```jsx
import React from 'react'
import ReactDOM from 'react-dom'

export default function App() {
  const [count, setCount] = React.useState(0)
  const [name, setName] = React.useState('tydumpling')

  React.useEffect(() => {
    let timer = setInterval(() => {
      setCount(count => count + 1)
    }, 1000);

    return () => {
      clearInterval(timer)
    }
  }, [])

  function unmountedBtn() {
    ReactDOM.unmountComponentAtNode(document.getElementById('root'))
  }

  return (
    <>
      <div>{count}</div>
      <button onClick={unmountedBtn}>卸载</button>
    </>
  )
}
```

注意：

1. 删掉严格模式，否则影响观测结果：`<React.StrictMode>`
2. 定时器内状态更新的方法的入参必须写成回调形式
3. 严格模式会误导首次渲染，回调形式避免状态受到闭包影响

> 总结
> 
> 可以把 useEffect Hook 看做如下三个函数的组合：
> 
> - componentDidMount()
>   
>   第二个参数设置空数组 `[]` 不监听任何变量的变化，只会在组件挂载完毕后触发一次。
> - componentDidUpdate()
>   
>   第二个参数数组内设置需要监听更新的变量名，当该变量触发更新则会执行其回调函数。
> - componentWillUnmount()
>   
>   `React.useEffect` 返回的回调函数可用于监听页面卸载

## RefHook

Ref Hook可以在函数组件中存储/查找组件内的标签或任意其它数据

语法：

```jsx
const refContainer = useRef()
```

示例代码：

```jsx
import React from 'react'

export default function App() {
  const myRef = React.useRef()
  
  function show() {
    console.log(myRef.current.value);
  }

  return (
    <>
      <input ref={myRef} />
      <button onClick={show}>展示</button>
    </>
  )
}
```

> 作用：
> 
> 保存标签对象,功能与 `React.createRef()` 一样

## Fragment

类似于 Vue 的 `template` 标签，不会被 HTML 渲染成真实 DOM 。

使用

```jsx
import React, { Fragment } from 'react'

export default function App() {
  return (
    <Fragment key={1}><Fragment>
    // 或
    <></>
  )
}
```

二者的区别在于 标签可以添加 `key` 值，`key` 值可以更加的方便 `diff` 算法来进行结点判断。而空标签不允许。

> 作用
> 
> 可以不用必须有一个真实的 DOM 根标签了

## Context

是一种组件间通信方式, 常用于【祖组件】与【后代组件】间通信。

使用方式：

1. 创建Context容器对象：
   ```jsx
   const XxxContext = React.createContext()
   ```
2. 渲染子组时，外面包裹xxxContext.Provider, 通过value属性给后代组件传递数据：
   ```jsx
   <xxxContext.Provider value={数据}>
   子组件
   </xxxContext.Provider>
   ```
3. 后代组件读取数据：
   ```jsx
   //第一种方式:仅适用于类组件 
   static contextType = xxxContext  // 声明接收context
   this.context // 读取context中的value数据
   
   //第二种方式: 函数组件与类组件都可以
   <xxxContext.Consumer>
     {
       value => ( // value就是context中的value数据
         要显示的内容
       )
     }
   </xxxContext.Consumer>
   ```

总体示例代码如下所示：

```jsx
const MyContext = React.createContext()
const { Provider } = MyContext

export default class A extends Component {
  state = {username: 'A', age: 23}
  
  render() {
    const {username, age} = this.state
    return (
      <>
        <div>A</div>
        <Provider value={{username, age}}> // 外面的 {} 是分隔符，里面的 {} 是对象
          <B />
        </Provider>
      </>
    )
  }
}

class B extends Component {
  static contextType = MyContext // 可以这么使用，但没必要。父子组件直接使用props即可。最简单方便
  
  render() {
    return (
      <>
        <div>B</div>
        <div>使用：{this.context.age}</div>
        <C />
      </>
    )
  }
}

class C extends Component {
  static contextType = MyContext // 必须声明接收才可使用
  
  render() {
    const {username} = this.context
    return (
      <>
        <div>C</div>
        <div>使用：{username}</div>
      </>
    )
  }
}
```

如果是函数式组件，则无法通过 `this` 来获取 `context` ，需要用到另外一个方法 `Consumer` ，代码如下所示：

```jsx
const MyContext = React.createContext()
const { Provider, Consumer } = MyContext

export default class A extends Component {
  // ...
}

class B extends Component {
  // ...
}

function C() {
  return (
    <>
      <div>C</div>
      <Consumer>
        {
          value => `${value.age}-${value.username}`
        }
      </Consumer>
    </>
  )
}
```

> 注意
> 
> 在应用开发中一般不用 `context` ，一般都用它的封装 `react` 插件

## PureComponent

### Component的2个问题

1. 只要执行 `setState()` ，即使不改变状态数据，组件也会重新 `render()`  效率低
2. 只当前组件重新 `render()` ，就会自动重新 `render` 子组件，纵使子组件没有用到父组件的任何数据 效率低

### 效率高的做法

只有当组件的 `state` 或 `props` 数据发生改变时才重新 `render()` 

### 原因

`Component` 中的 `shouldComponentUpdate()` 总是返回 `true` 

### 使用

- 办法1: 
  
  重写 `shouldComponentUpdate()` 方法
  
  比较新旧 `state` 或 `props` 数据，如果有变化才返回 `true` ，如果没有返回 `false` 
  ```jsx
    // 父组件
    shouldComponentUpdate(nextProps, nextState) {
      if(this.state.name === nextState.name) {
        return false
      } else {
        return true
      }
    }
    
    // 子组件
     shouldComponentUpdate(nextProps, nextState) {
      if(this.props.name === nextProps.name) {
        return false
      } else {
        return true
      }
      // 简写形式：
      // return !(this.props.name !== nextProps.name)
    }
  ```
- 办法2:  
  
  使用 `PureComponent` ，`PureComponent` 重写了 `shouldComponentUpdate()` ，只有 `state` 或 `props` 数据有变化才返回 `true` 
  ```jsx
  import React, { Component, PureComponent } from 'react'
  
  // 把 Component 换成 PureComponent 即可
  class A extends PureComponent{
    render() {
      return ...
    }
  }
  ```

> 注意：
> 
> 1. 只是进行state和props数据的浅比较, 如果只是数据对象内部数据变了, 返回false 。this.setState() 本质上是用新对象替换，修改了引用地址。
> 2. 不要直接修改state数据, 而是要产生新数据
> 
> ```jsx
> changeFn = () => {
>   let obj = this.state
>   obj.name = 'A' // 错误写法
>   this.setState(obj) // 错误写法
> }
> ```
> 
> 项目中一般使用PureComponent来优化

## renderProps

如何向组件内部动态传入带内容的结构(标签)?

- Vue中：
  
  使用 `slot` 技术, 也就是通过组件标签体传入结构  
  ```jsx
  <A><B/></A>
  ```
- React中:
  - 使用 `children props` ：通过组件标签体传入结构
  - 使用 `render props` ：通过组件标签属性传入结构,而且可以携带数据，一般用 `render` 函数属性

### children props

react 中，组件内的值是作为一个特殊属性传给子组件。子组件通过 `this.props.children` 获取。示例代码如下所示：

```jsx
export defalut class App extends Component {
  render() {
    return (
      <A>
        <B />
      </A>
      <C>xxxx</C>
    )
  }
}

class A extends Component {
  state = {name: 'A'}
  
  render() {
    return (
      <div>A</div>
      <div>{this.props.children}</div>
    )
  }
}

class B extends Component {
  render() {
    return (
      <div>B</div>
      <div>{this.props.children}</div>
    )
  }
}

class C extends Component {
  render() {
    return (
      <div>C</div>
      <div>{this.props.children}</div>
    )
  }
}
```

组件中间的值可以输入内容，也可设置一个组件。但是这种写法子组件无法获取父组件内的数据。如上方代码 B 组件无法拿到 A 组件内 state 的数据

### render props

```jsx
export defalut class App extends Component {
  render() {
    return (
      <A render={(name) => <B name={name}></B>} />
    )
  }
}

class A extends Component {
  state = {name: 'A'}
  
  render() {
    return (
      <div>A</div>
       {this.props.render(name)}
    )
  }
}

class B extends Component {
  render() {
    return (
      <div>B</div>
      <div>{this.props.name}</div>
    )
  }
}
```

> 总结
> 
> 父组件通过下方语句调用 render 把子组件放到自身组件内
> 
> ```jsx
> {this.props.render(内部state数据)}
> ```
> 
> 子组件通过下方语句显示获取到的数据
> 
> ```jsx
> {this.props.data}
> ```
> 
> 在顶层标签属性中传递 render
> 
> ```jsx
> <父组件 render={(data) => <子组件 data={data}></子组件>} />
> ```
> 
> 注意：render 并不是写死的，可以随便起其他名字，如 `xiaozhupeiqi={}` ，`this.props.xiaozhupeiqi(state)` 。只不过用 `render` 更加有语义化。

## ErrorBoundary

### 理解

错误边界( Error boundary )：用来捕获后代组件错误，渲染出备用页面

### 特点

只能捕获后代组件生命周期产生的错误，不能捕获自己组件产生的错误和其他组件在合成事件、定时器中产生的错误

### 使用方式

getDerivedStateFromError 配合 componentDidCatch

```javascript
// 生命周期函数，一旦后台组件报错，就会触发
static getDerivedStateFromError(error) {
    console.log(error);
    // 在render之前触发
    // 返回新的state
    return {
        hasError: true,
    };
}

componentDidCatch(error, info) {
    // 统计页面的错误。发送请求发送到后台去
    console.log(error, info);
}
```

## 组件通信总结

### 组件间的关系：

- 父子组件
- 兄弟组件（非嵌套组件）
- 祖孙组件（跨级组件）

### 几种通信方式：

1. props：
   - children props
   - render props
2. 消息订阅-发布：
   
   pubs-sub、event等等
3. 集中式管理：
   
   redux、dva等等
4. conText:
   
   生产者-消费者模式

### 比较好的搭配方式：

- 父子组件：props
- 兄弟组件：消息订阅-发布、集中式管理
- 祖孙组件(跨级组件)：消息订阅-发布、集中式管理、conText(开发用的少，封装插件用的多)