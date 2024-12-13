# React Router 6 

## 官网文档

推荐自行阅读一遍官网文档（没有中文！！）

指路：[reactrouter](https://reactrouter.com/en/6.14.1/start/tutorial)

## 概述

1. React Router 以三个不同的包发布到 npm 上，它们分别为：
   1. react-router: 路由的核心库，提供了很多的：组件、钩子。
   2. <strong style="color:#dd4d40">**react-router-dom:**</strong > <strong style="color:#dd4d40">包含react-router所有内容，并添加一些专门用于 DOM 的组件，例如 `<BrowserRouter>`等 </strong>。
   3. react-router-native: 包括react-router所有内容，并添加一些专门用于ReactNative的API，例如:`<NativeRouter>`等。
2. 与React Router 5.x 版本相比，改变了什么？
   1. 内置组件的变化：移除`<Switch/>` ，新增 `<Routes/>`等。
   2. 语法的变化：`component={About}` 变为 `element={<About/>}`等。
   3. 新增多个hook：`useParams`、`useNavigate`、`useMatch`等。
   4. <strong style="color:#dd4d40">官方明确推荐函数式组件了！！！</strong>
      
      ......

## Component

### `<BrowserRouter>`

说明：`<BrowserRouter> `用于包裹整个应用。

示例代码：
```jsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    {/* 整体结构（通常为App组件） */}
  </BrowserRouter>,root
);
```

###  `<HashRouter>`

说明：作用与`<BrowserRouter>`一样，但`<HashRouter>`修改的是地址栏的hash值。

> 备注
>
> 6.x版本中`<HashRouter>`、`<BrowserRouter> ` 的用法与 5.x 相同。

### `<Routes/> 与 <Route/>`

在 `ReactRouter5` 版本，路由通过 `switch` 组件包裹 `router` 组件，`router` 组件通过设置 `path` 路径和 `component` 匹配的路由组件实现路由。

在 `ReactRouter6` 版本，`switch` 已移除，用 `routers` 替代。而 `route` 也不再用 `component` 的方式，取而代之的是 `element` ，设置一个组件而不是单纯的组件名称。

示例代码如下所示：

```jsx
<Routes>
    /*path属性用于定义路径，element属性用于定义当前路径所对应的组件*/
    <Route path="/login" element={<Login />}></Route>

        /*用于定义嵌套路由，home是一级路由，对应的路径/home*/
    <Route path="home" element={<Home />}>
       /*test1 和 test2 是二级路由,对应的路径是/home/test1 或 /home/test2*/
      <Route path="test1" element={<Test/>}></Route>
      <Route path="test2" element={<Test2/>}></Route>
        </Route>
    
        //Route也可以不写element属性, 这时就是用于展示嵌套的路由 .所对应的路径是/users/xxx
    <Route path="users">
       <Route path="xxx" element={<Demo />} />
    </Route>
</Routes>
```

#### 总结

1. v6版本中移出了先前的`<Switch>`，引入了新的替代者：`<Routes>`。
2. `<Routes>` 和 `<Route>`要配合使用，且必须要用`<Routes>`包裹`<Route>`。
3. `<Route>` 相当于一个 if 语句，如果其路径与当前 URL 匹配，则呈现其对应的组件。
4. `<Route caseSensitive>` 属性用于指定：匹配时是否区分大小写（默认为 false）。
5. 当URL发生变化时，`<Routes> `都会查看其所有子` <Route>` 元素以找到最佳匹配并呈现组件 。
6. `<Route>` 也可以嵌套使用，且可配合`useRoutes()`配置 “路由表” ，但需要通过 `<Outlet>` 组件来渲染其子路由。

### `<Link>`

作用: 修改URL，且不发送网络请求（路由链接）。

> 注意
>
> 外侧需要用`<BrowserRouter>`或`<HashRouter>`包裹。

示例代码：
```jsx
import { Link } from "react-router-dom";

function Test() {
  return (
    <div>
        <Link to="/路径">按钮</Link>
    </div>
  );
}
```

### `<NavLink>`

作用: 与 `<Link>` 组件类似，且可实现导航的“高亮”效果。高亮效果原理相同，为标签添加 `active` 类名。

在 `ReactRouter5` 中，要想实现自定义激活类名，需要设置 `activeClassName` 。

而在 `ReactRouter6` 中，需要使用回调函数来设置，回调函数有一个参数，是一个对象，其中 `isActive` 参数控制其是否被激活，通过返回值返回类名即可。代码如下所示：

```jsx
<NavLink
    to="login"
    className={({ isActive }) => {
        console.log('home', isActive)
        return isActive ? 'base one' : 'base'
    }}
>login</NavLink>
```

如果为其添加 `end` 属性，则子组件触发 `active` 时父组件的 `active` 将会被剔除。

示例代码：

```jsx
// 注意: NavLink默认类名是active，下面是指定自定义的class的函数
function componentClassName({ isActive }) {
    console.log('home', isActive)
    return isActive ? 'base one' : 'base'
}

//自定义样式
<NavLink
    to="login"
    className={componentClassName}
>login</NavLink>

/*
    默认情况下，当Home的子组件匹配成功，Home的导航也会高亮，
    当NavLink上添加了end属性后，若Home的子组件匹配成功，则Home的导航没有高亮效果。
*/
<NavLink to="home" end >home</NavLink>
```

### `<Navigate>`

作用：只要`<Navigate>`组件被渲染，就会修改路径，切换视图。需要为其 `to` 属性设置对应路由的路径，不设置则报错。

其中有 `replace`属性，用于控制跳转模式（push 或 replace，默认是push）。

示例代码：
```jsx
import React,{useState} from 'react'
import {Navigate} from 'react-router-dom'

export default function Home() {
    const [sum,setSum] = useState(1)
    return (
        <div>
            <h3>我是Home的内容</h3>
            {/* 根据sum的值决定是否切换视图 */}
            {sum === 1 ? <h4>sum的值为{sum}</h4> : <Navigate to="/about" replace={true}/>}
            <button onClick={()=>setSum(2)}>点我将sum变为2</button>
        </div>
    )
}
```

### `<Outlet>`

当`<Route>`产生嵌套时，渲染其对应的后续子路由。可以理解为 Vue 中二级路由及以后路由的 `router-view` 。

示例代码：
```jsx
//根据路由表生成对应的路由规则
const element = useRoutes([
  {
    path:'/about',
    element:<About/>
  },
  {
    path:'/home',
    element:<Home/>,
    children:[
      {
        path:'news',
        element:<News/>
      },
      {
        path:'message',
        element:<Message/>,
      }
    ]
  }
])

//Home.js
import React from 'react'
import {NavLink,Outlet} from 'react-router-dom'

export default function Home() {
    return (
        <div>
            <h2>Home组件内容</h2>
            <div>
                <ul className="nav nav-tabs">
                    <li>
                        <NavLink className="list-group-item" to="news">News</NavLink>
                    </li>
                    <li>
                        <NavLink className="list-group-item" to="message">Message</NavLink>
                    </li>
                </ul>
                {/* 指定路由组件呈现的位置 */}
                <Outlet />
            </div>
        </div>
    )
}
```

## Hooks

### useRoutes()

作用：根据路由表，动态创建`<Routes>`和`<Route>`。

示例代码：

- 路由表配置：src/routes/index.js

  ```js
  import About from '../pages/About'
  import Home from '../pages/Home'
  import {Navigate} from 'react-router-dom'
  
  export default [
      {
          path:'/about',
          element:<About/>
      },
      {
          path:'/home',
          element:<Home/>
      },
      {
          path:'/',
          element:<Navigate to="/about"/>
      }
  ]
  ```

- App.jsx

  ```jsx
  import React from 'react'
  import {NavLink,useRoutes} from 'react-router-dom'
  import routes from './routes'
  
  export default function App() {
      //根据路由表生成对应的路由规则
      const element = useRoutes(routes)
      return (
          <div>
              ......
        {/* 注册路由 */}
        {element}
            ......
          </div>
      )
  }
  ```

### useNavigate()

> 作用：
>
> 返回一个函数用来实现编程式导航

`Navigate` 是一个组件，用于渲染视图重定向的组件，而 `useNavigate` 是一个 `hook` 函数，如果需要跳转路由，需要传入两个参数：

- 参数一：组件路径
- 参数二：路由参数对象，目前只支持 `replace` 、`state` 参数

如果需要前进后退，只需要在括号内输入要前进后退的数值即可。

示例代码如下：
```jsx
import React from 'react'
import {useNavigate} from 'react-router-dom'

export default function Demo() {
  const navigate = useNavigate()
  const handle = () => {
    //第一种使用方式：指定具体的路径
    navigate('/login', {
      replace: false,
      state: {a:1, b:2}
    }) 
    //第二种使用方式：传入数值进行前进或后退，类似于5.x中的 history.go()方法
    navigate(-1)
  }
  
  return (
    <div>
      <button onClick={handle}>按钮</button>
    </div>
  )
}
```

### useParams()

> 作用
>
> 回当前匹配路由的`params`参数，类似于5.x中的`match.params`。

在 `ReactRouter5` 中，获取路由 `params` 参数通过 `this.props.match.params` 数据对象上获取。

在 `ReactRouter6` 中，通过 `useParams` 获取对象解构出需要的参数。代码如下所示：

```jsx
import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import User from './pages/User.jsx'

function ProfilePage() {
  // 获取URL中携带过来的params参数
  let { id } = useParams();
}

function App() {
  return (
    <Routes>
      <Route path="users/:id" element={<User />}/>
    </Routes>
  );
}
```

### useSearchParams()

> 作用
>
> 用于读取和修改当前位置的 URL 中的查询字符串。

在 `ReactRouter5` 中，获取路由 `search` 参数通过 `this.props.location.search` 数据对象上获取。

在 `ReactRouter6` 中，通过 `useSearchParams` 获取，其返回一个包含两个值的数组，内容分别为：

- 参数一：当前的 `search` 参数
- 参数二：更新 `search` 的函数。

想要提取需要的参数，通过 `参数一.get('想要获取的参数名')` 。参数二的作用则是更新参数（使用的不多），代码如下所示：

```jsx
import React from 'react'
import {useSearchParams} from 'react-router-dom'

export default function Detail() {
    const [search,setSearch] = useSearchParams()
    const id = search.get('id')
    const title = search.get('title')
    const content = search.get('content')
    return (
        <ul>
            <li>
                <button onClick={()=>setSearch('id=008&title=哈哈&content=嘻嘻')}>点我更新一下收到的search参数</button>
            </li>
            <li>消息编号：{id}</li>
            <li>消息标题：{title}</li>
            <li>消息内容：{content}</li>
        </ul>
    )
}

```

### useLocation()

> 作用
>
> 获取当前 `location` 信息，对标5.x中的路由组件的`location`属性。

从前面两个可以看出，`params` 和 `search` 都有自己的 `useXxxx()` 方法，但是 `state` 不行，因为 `react` 已经有内置的 `useState` 方法了，会引发冲突。

解决方法为通过 `useLocation` 方法获取 `state` 对象，从该对象获取数据。

示例代码：
```jsx
import React from 'react'
import {useLocation} from 'react-router-dom'

export default function Detail() {
    const x = useLocation()
    console.log('@',x)
  // x就是location对象: 
    /*
        {
      hash: "",
      key: "ah9nv6sz",
      pathname: "/login",
      search: "?name=zs&age=18",
      state: {a: 1, b: 2}
    }
    */
    return (
        <ul>
            <li>消息编号：{id}</li>
            <li>消息标题：{title}</li>
            <li>消息内容：{content}</li>
        </ul>
    )
}

  


```

### useMatch()

> 作用
>
> 返回当前匹配信息，对标5.x中的路由组件的`match`属性。

使用方法，为 `useMatch()` 方法的括号内传入当前路由的路径。示例代码如下：

```jsx
<Route path="/login/:page/:pageSize" element={<Login />}/>
<NavLink to="/login/1/10">登录</NavLink>

export default function Login() {
  const match = useMatch('/login/:x/:y')
  console.log(match) //输出match对象
  //match对象内容如下：
  /*
      {
      params: {x: '1', y: '10'}
      pathname: "/LoGin/1/10"  
      pathnameBase: "/LoGin/1/10"
      pattern: {
          path: '/login/:x/:y', 
          caseSensitive: false, 
          end: false
      }
    }
  */
  return (
      <div>
      <h1>Login</h1>
    </div>
  )
}
```

### useInRouterContext()

如果组件在 `<Router>` 的上下文中呈现，则 `useInRouterContext` 钩子返回 true，否则返回 false。

> 作用
>
> 第三组件封装者需要知道当前组件是否在路由上时有用

### useNavigationType()

作用：返回当前的导航类型（用户是如何来到当前页面的）。

返回值：

- `POP` 
- `PUSH` 
- `REPLACE`

> 备注：
>
> `POP`是指在浏览器中直接打开了这个路由组件（刷新页面）。

### useOutlet()

作用：用来呈现当前组件中渲染的嵌套路由。

示例代码：
```jsx
const result = useOutlet()
console.log(result)
// 如果嵌套路由没有挂载,则result为null
// 如果嵌套路由已经挂载,则展示嵌套的路由对象
```

### useResolvedPath()

作用：给定一个 URL值，解析其中的：path、search、hash值。

![VpzvLa.png](https://i.imgloc.com/2023/07/07/VpzvLa.png)