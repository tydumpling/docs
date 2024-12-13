# React路由

## SPA的理解

1. 单页Web应用（`single page web application，SPA`）。
2. 整个应用只有一个完整的页面。
3. 点击页面中的链接不会刷新页面，只会做页面的局部更新。
4. 数据都需要通过 `ajax` 请求获取, 并在前端异步展现。


## 路由的理解

### 路由的概念

1. 一个路由就是一个映射关系 `(key:value)`
2. `key` 为路径, `value` 可能是 `function` 或 `component` 

### 路由的分类

#### 后端路由

1. 路由理解： `value` 是 `function` , 用来处理客户端提交的请求。
2. 注册路由： `router.get(path, function(req, res))`
3. 工作过程：当 `node` 接收到一个请求时, 根据请求路径找到匹配的路由, 调用路由中的函数来处理请求, 返回响应数据

#### 前端路由

1. 浏览器端路由，`value` 是 `component` ，用于展示页面内容。
2. 注册路由：`<Route path="/test" component={Test}>`
3. 工作过程：当浏览器的path变为/test时, 当前路由组件就会变为Test组件

### 前端路由原理

本质上是通过浏览器的 `history` 对象，记录请求路径中的变化，其中用到了几个重要的 API：

- `push` ：往路由栈中新增一个路由
- `replace` ：把最上方的路由替换
- `back` ：最上方的路由出栈，显示上一个路由
- `forword` ：之前的路由入栈，显示下一个路由

路由主要是一个栈，为后进先出模式。第一个路由入栈在最底层；后续路由入栈后在其上方。最后入栈的最先出栈。路由又分为 `history` 历史模式和 `hash` 哈希模式，前端路由主要是哈希模式，路由会有一个 `#` ，兼容性更好；`history` 是 H5 提出的，部分老浏览器不支持。

> 总结
> 
> 1. 点击导航链接引起路径的变化
> 2. 被路由器检测到进行匹配组件，从而展示

## react-router-dom

### 含义

1. react的一个插件库。
2. 专门用来实现一个SPA应用。
3. 基于react的项目基本都会用到此库。

### 内置组件

- `<BrowserRouter>`
- `<HashRouter>` 
- `<Route>` 
- `<Redirect>` 
- `<Link>` 
- `<NavLink>` 
- `<Switch>`

### 其它组件

1. `history` 对象
2. `match` 对象
3. `withRouter` 函数

### react-router-dom@5

#### 路由使用

下载依赖：

```
yarn add react-router-dom@5
```

通过路由器 `Link` 与其 `to` 属性设置路由链接切换组件：

```jsx
<Link className="list-group-item active" to="/about">About</Link>
<Link className="list-group-item" to="/home">Home</Link>
```

运行后发现页面报错，报错信息如下所示：

[![pCAsUh9.png](https://s1.ax1x.com/2023/06/09/pCAsUh9.png)](https://imgse.com/i/pCAsUh9)

根据提示需要我们报一个 `Router` 来监管 `Link` ，尝试一下，依旧报错，报错信息如下：

[![pCAyA3R.png](https://s1.ax1x.com/2023/06/09/pCAyA3R.png)](https://imgse.com/i/pCAyA3R)

这是因为前面我们也复习过了，路由分两种模式：哈希和历史。因此这里我们要二选一。本案例先选择历史模式 `BrowserRouter` 。

```jsx
<BrowserRouter>
  <Link className="list-group-item active" to="/about">About</Link>
  <Link className="list-group-item" to="/home">Home</Link>
</BrowserRouter>
```

更换了路由器后运行，切换路由链接后浏览器路径成功发生变化。现在来实现路由内容切换。注册路由通过 `Route` 注册，代码如下：

```jsx
<Route path="/about" component={About} />
<Route path="/home" component={Home} />
```

运行后报错，错误提示为：

[![pCAsUh9.png](https://s1.ax1x.com/2023/06/09/pCAsUh9.png)](https://imgse.com/i/pCAsUh9)

轻车熟路在其外层包裹一个 `BrowserRouter` ，运行后查看控制台，没有报错信息，但是点击的时候路径发生变化，页面内容却没变化。这是因为我们分开两个路由器，因此点击路由链接切换时组件路由器无法侦听到。让一个路由被同一个路由器监听，路由器放到 `index.js` 中是最好的选择，代码如下：

```jsx
ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.querySelector('#root'))
```

现在运行，效果实现，接下来实现动态样式激活的效果。`React` 中除了 `Link` 标签以外，还有一个 `NavLink` ，当路由匹配后它会添加一个 `active` 类名给自身，表名处于激活状态。也可通过 `activeClassName` 设置激活的类名。

```jsx
<NavLink activeClassName="activeClass" className="list-group-item" to="/about">About</NavLink>
<NavLink className="list-group-item" to="/home">Home</NavLink>
```

> 注意
> 
> 别忘记引入 `NavLink` 路由器、路由组件 `BrowserRouter` 和路由注册 `Route` 。

#### Switch

路由在查找时为了防止你把路由放在很下方，他会一直查找直到找完为止，这之中会有一定的性能消耗。通过 `Switch` 包裹 `Route` 标签，当查找完包裹内的标签后就不会再查找，有利于性能优化，提高效率。

#### 路由匹配

路由匹配中区分模糊匹配与精确匹配，例如 `Route` 中的 `path` 属性为 `/home/id` ，而 `Link` 链接提供的是 `/hom` ，代码如下：

```jsx
<Link to="/home/id"></Link>

<Route path="/home" component={Home}></Route>
```

在精确匹配中，此时页面不会渲染 `<Home />` 组件。在模糊匹配下，组件内容可以渲染。

但是还没完，模糊匹配有顺序要求，它采取 “最左匹配” 逻辑，即模糊匹配的路由需要在最开始，顺序要一致，否则还是无法匹配。代码如下：

```jsx
<Link to="/home/id"></Link> // 可以匹配
<Link to="/id/home"></Link> // 不能匹配

<Route path="/home" component={Home}></Route>
```

精准匹配开启方式为添加 `exact` 关键字开启，代码如下：

```jsx
<Route exact path="/home" component={Home}></Route>
```

#### 重定向

有时会希望刚进页面就能默认选中一个路由，进入页面时默认路径为 `/` ，省略不显示。此时如果路由 `path` 没有设置 `/` 的，则什么都不显示。

通过 `<Redirect />` 组件可以做重定向，其写法为：

```javascript
<Switch>
  <Route exact path="/home" component={Home}></Route>
  <Redirect to="/home" />
</Switch>
```

> 注意
> 
> 重定向组件必须写在路由组件的最后。

#### 二级路由

先上一段代码，主要分为两级路由：

一级路由：

```jsx
<Link to="/home"></Link>
<Link to="/about"></Link>

<Switch>
  <Route path="/about" component={About}></Route>
  <Route path="/home" component={Home}></Route>
  <Redirect to="/about" />
</Switch>
```

二级路由：

```jsx
<Link to="/news"></Link>
<Link to="/my"></Link>

<Switch>
  <Route path="/news" component={News}></Route>
  <Route path="/my" component={My}></Route>
  <Redirect to="/news" />
</Switch>
```

此时二级路由挂载到 `<Home />` 组件上，点击 `Home` 路由也能显示，可是点击二级路由切换时却失败了，返回了 `About` 组件页面上。

这是因为在 `React` 中，路由修改后会根据路由挂载顺序开始匹配，在上方示例中，一级路由先挂载。点击 `Home` 路由后会开始匹配，匹配到结果，然后进入到 `<Home />` 组件，挂载了二级路由；接着点击 `News` ，路由发生变化，从先挂载的一级路由中去匹配查找，没有找到符合的，最终重定向。

因此，二级路由想要实现，需要拼接上一级路由的路径，代码如下：

```jsx
<Link to="/news"></Link>
<Link to="/my"></Link>

<Switch>
  <Route path="/home/news" component={News}></Route>
  <Route path="/home/my" component={My}></Route>
  <Redirect to="/home/news" />
</Switch>
```

此时步骤一致，匹配一级路由时由于拼接了一级路由的路径，成功匹配到 `<Home />` 组件，进入该路由，挂载了二级路由，再次匹配，最终能够匹配到对应路径。

后续无论三级还是四级，都需要拼接前面的路径。

如果开启精确模式，会导致无法继续匹配下级的路由。

#### 路由传参

- params传参
  
  可以联想一下 `Vue` 或者 `Node` 的动态传参的方式，通过 `/:` 的方式接收动态的传参。代码如下所示：
  ```jsx
  <Link to={`/home/news/${item.id}/${item.title}`}></Link>
  
  <Route path="/home/news/:id/:title"></Route>
  ```
  
  接收时通过前面介绍过的路由参数 `match` 对象下的 `params` 对象接收对应的参数即可。代码如下所示：
  ```jsx
  export class Son extends Component {
    render() {
      const {id, title} = this.props.match.params
    }
  }
  ```
  > 缺点
  > 
  > 如果需要传递 `params` 参数，`<Route />` 中 `path` 参数必须设置对应的动态参数才能接收，不然无法获取传递的参数。
- search传参
  
  可以理解 `query` 的传参方式，示例代码如下所示：
  ```jsx
  <Link to={`/home/news?id=${item.id}&title=${item.title}`}></Link>
  
  <Route path="/home/news"></Route> // 无需声明接收
  ```
  
  接收的时候需要在 `location` 对象中的 `search` 属性中获取，该属性是一个字符串，如 `?id=0&title=tydumpling` ，需要我们手动转为对象的形式。
  
  `React` 脚手架下载好一个库 `querystring` ，其方法 `stringify()` 可以把一个对象转为 `key=value&key=value` 的格式；其 `parse()` 方法可以把该格式的字符串换为对象的形式。
  
  引入 `querystring` 后转换格式，示例代码如下：
  ```jsx
  import qs from 'querystring'
  
  const url = this.props.location.search.slice(0, 1)
  const {id, title} = qs.parse(url)
  ```
- state传参
  
  在 `<Link />` 组件中为 `to` 设置对象，其中 `pathname` 对应路由路径，`state` 对应参数，代码如下所示：
  ```jsx
  <Link to={{pathname: '/home/news', state: {id: item.id, title: item.title}}}></Link>
  ```
  
  组件中通过 `location` 对象下的 `state` 参数获取，前面传了一个对象，这里获取到的就是那个对象。代码如下所示：
  ```jsx
  export class Son extends Component {
    render() {
      const {id, title} = this.props.location.state || {}
    }
  }
  ```
  
  在地址栏中它不像 `parasm` 和 `search` 传参，该方法传参不会在地址栏中传递参数，有利于参数保密。再刷新也不会参数丢失，因为其传递的参数保存到浏览器的缓存历史记录 `history` 中。当浏览器历史记录被清除后无法找到。

#### push与replace

`push()` 操作是压栈模式，每点击一次路由跳转都会往路由栈中压入一个路由，最先进来的在栈底，最后进来的在栈顶；`replace()` 则是替换掉栈顶，不留下痕迹。

默认开启的是 `push()` 模式，需要替换可以添加 `replace` 关键字修改，代码如下所示：

```jsx
<Link replace={true} to="/home/news"></Link>
```

#### 编程式路由导航

如果不借助 `<Link />` 或 `<NavLink />` 这类路由链接点击跳转，而是通过代码处理跳转，这类跳转被称为编程式导航。主要分为 `push()` 跳转和 `replace()` 跳转。

要想实现编程式路由跳转，需要借助路由内置的 `history` 方法对象实现。示例代码如下所示：

```jsx
class A extends Component {
  handleReplaceFn = (id, title) => {
    // replace + params参数传递法
    this.props.history.replace(`/home/news/${id}/${title}`)
    
    // replace + search参数传递法
    this.props.history.replace(`/home/news?id=${id}&title=${title}`)
    
    // replace + state参数传递法
    this.props.history.replace(`/home/news`, {id, title}})
  }
  
  handlePushFn = (id, title) => {
    // push + params参数传递法
    this.props.history.push(`/home/news/${id}/${title}`)
    
    // push + search参数传递法
    this.props.history.push(`/home/news?id=${id}&title=${title}`)
    
    // push + state参数传递法
    this.props.history.push(`/home/news`, {id, title}})
  }
  
  render() {
    return {
      <button onClick={() => this.handleReplaceFn(id, title)}>replace</button>
      <button onClick={() => this.handlePushFn(id, title)}>push</button>
    }
  }
}
```

前进和后退可通过 `history` 中的 `goBack()` 与 `goForword()` 方法。方法 `go()` 内可以填入数字，正数往前前进，前进的位数是括号内的数字；负数往后退，后退1的位数是括号内的数字。

#### withRouter

在一般组件与路由组件的区别中我们说到，他们最大的区别在于路由组件的 `props` 中有 `history` 方法，一般组件没有。也就是说在一般组件无法通过 `this.props.history` 跳转路由。

解决方法：

1. 引入 `withRouter` 
   ```jsx
   import { withRouter } from 'react-router-dom'
   ```
2. 暴露一个对象
   ```jsx
   class Header extends Component {}
   
   export default withRouter(Header)
   ```
   
   这个对象是 `withRouter` 处理加工后的返回值。`withRouter` 能够接收一个一般组件，为一般组件加上路由组件的专属 API 。
3. 使用
   ```jsx
   handleRouteFn = () => {
     this.props.history.goBack()
   }
   ```

#### 总结

##### 路由基本使用

1. 明确好界面中的导航区、展示区
2. 导航区的a标签改为 `Link` 标签
   ```jsx
   <Link to="/xxxxx">Demo</Link>
   ```
3. 展示区写 `Route` 标签进行路径的匹配
   ```jsx
   <Route path='/xxxx' component={Demo}/>
   ```
4. `<App>` 的最外侧包裹了一个 `<BrowserRouter>` 或 `<HashRouter>`

##### 路由组件与一般组件

1. 写法不同
   - 一般组件：`<Demo/>`
   - 路由组件：`<Route path="/demo" component={Demo}/>`
2. 存放位置不同
   - 一般组件：`components` 
   - 路由组件：`pages`
3. 接收到的props不同：
   - 一般组件：写组件标签时传递了什么，就能收到什么
   - 路由组件：接收到三个固定的属性
     
     [![pCAg5GQ.png](https://s1.ax1x.com/2023/06/09/pCAg5GQ.png)](https://imgse.com/i/pCAg5GQ)
     
     常用方法为：
     ```jsx
     history:
     	go: ƒ go(n)
     	goBack: ƒ goBack()
     	goForward: ƒ goForward()
       push: ƒ push(path, state)
       replace: ƒ replace(path, state)
     location:
       pathname: "/about"
       search: ""
       state: undefined
     match:
       params: {}
       path: "/about"
       url: "/about"
     ```

##### NavLink与封装

1. `NavLink` 可以实现路由链接的高亮，通过 `activeClassName` 指定样式名
2. 标签体的内容可以通过 `children` 属性来设置，如：
   ```jsx
   <NavLink>About</NavLink>
   // 等价于
   <NavLink children="About" />
   ```

##### Switch

1. 通常情况下，path和component是一一对应的关系。
2. Switch可以提高路由匹配效率(单一匹配)。

##### 多级结构

- 在路由请求服务器时，如果请求了一个不存在的数据，最终会把 `public/index.html` 返回。

- 在 `link` 引入样式时有时会出现样式丢失，有可能因为使用相对路径导致请求路径错误，解决方法如下所示：
  1. `public/index.html` 中 引入样式时不写 `./` 写 `/` （常用）
  2. `public/index.html` 中 引入样式时不写 `./` 写 `%PUBLIC_URL%` （常用）
  3. 使用 `HashRouter`

##### 匹配模式

1. 默认使用的是模糊匹配（简单记：【输入的路径】必须包含要【匹配的路径】，且顺序要一致）
2. 开启严格匹配
   ```jsx
   <Route exact={true} path="/about" component={About}/>
   ```
3. 严格匹配不要随便开启，需要再开，有些时候开启会导致无法继续匹配二级路由

##### 重定向

一般写在所有路由注册的最下方，当所有路由都无法匹配时，跳转到Redirect指定的路由。具体编码：

```jsx
<Switch>
  <Route path="/about" component={About}/>
  <Route path="/home" component={Home}/>
  <Redirect to="/about"/>
</Switch>
```

##### 多级路由

1. 注册子路由时要写上父路由的path值
2. 路由的匹配是按照注册路由的顺序进行的
3. 如果开启精确路由模式，会导致无法继续匹配下级的路由

##### 参数传递

- params
  1. 路由链接(携带参数)：
     ```jsx
     <Link to='/demo/test/tom/18'}>详情</Link>
     ```
  2. 注册路由(声明接收)：
     ```jsx
     <Route path="/demo/test/:name/:age" component={Test}/>
     ```
  3. 接收参数：
     ```jsx
     this.props.match.params
     ```
- search
  1. 路由链接(携带参数)：
     ```jsx
     <Link to='/demo/test?name=tom&age=18'}>详情</Link>
     ```
  2. 注册路由(无需声明，正常注册即可)：
     ```jsx
     <Route path="/demo/test" component={Test}/>
     ```
  3. 接收参数：
     ```jsx
     this.props.location.search
     ```
  > 备注：
  > 
  > 获取到的 `search` 是 `urlencoded` 编码字符串，需要借助 `querystring` 解析。
- state
  1. 路由链接(携带参数)：
     ```jsx
     <Link to={{pathname:'/demo/test',state:{name:'tom',age:18}}}>详情</Link>
     ```
  2. 注册路由(无需声明，正常注册即可)：
     ```jsx
     <Route path="/demo/test" component={Test}/>
     ```
  3. 接收参数：
     ```jsx
     this.props.location.state
     ```
  > 备注：
  > 
  > 刷新也可以保留住参数

##### 编程式路程导航

借助 `this.prosp.history` 对象上的 API 对操作路由跳转、前进、后退

- `this.prosp.history.push()`
- `this.prosp.history.replace()`
- `this.prosp.history.goBack()`
- `this.prosp.history.goForward()`
- `this.prosp.history.go()`

##### withRouter

`withRouter` 可以加工一个一般组件，让一般组件拥有路由组件所特有的 API 。`withRouter` 的返回值是一个新组件。

##### BrowserRouter与HashRouter的区别

1. 底层原理不一样：
   - `BrowserRouter` 使用的是 H5 的 `history API` ，不兼容 IE9 及以下版本。
   - `HashRouter` 使用的是 URL 的哈希值。
2. `path` 表现形式不一样
   - `BrowserRouter` 的路径中没有#，例如：`localhost:3000/demo/test`
   - `HashRouter` 的路径包含#，例如：`localhost:3000/#/demo/test`
3. 刷新后对路由 `state` 参数的影响
   - `BrowserRouter` 没有任何影响，因为 `state` 保存在 `history` 对象中。
   - `HashRouter` 刷新后会导致路由 `state` 参数的丢失！！！

> 备注
> 
> `HashRouter` 可以用于解决一些路径错误相关的问题。
