# 路由配置

本项目都是一级路由，没有二级路由，因此可以采用创建路由数组、通过循环的形式返回路由组件。

在根目录下创建 `router` 文件夹，在里面新建 `routes.js` 文件用于设置路由对象数组；`index.js` 文件用于处理数组生成路由组件。

## routes.js

通过懒加载的形式引入除首页外的其他路由页面，代码如下：

```js
import { lazy } from "react";
import Home from "@/views/Home.jsx";

const Detail = lazy(() => import("@/views/Detail.jsx"));
const Store = lazy(() => import("@/views/Store.jsx"));
const Personal = lazy(() => import("@/views/Personal.jsx"));
const Update = lazy(() => import("@/views/Update.jsx"));
const Page404 = lazy(() => import("@/views/Page404.jsx"));
const Login = lazy(() => import("@/views/Login.jsx"));

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      title: "知乎日报-WebApp",
    },
  },
  {
    path: "/detail/:id",
    name: "detail",
    component: Detail,
    meta: {
      title: "新闻详情-知乎日报",
    },
  },
  {
    path: "/personal",
    name: "personal",
    component: Personal,
    meta: {
      title: "个人中心-知乎日报",
    },
  },
  {
    path: "/store",
    name: "store",
    component: Store,
    meta: {
      title: "我的收藏-知乎日报",
    },
  },
  {
    path: "/update",
    name: "update",
    component: Update,
    meta: {
      title: "个人信息修改-知乎日报",
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "登录-知乎日报",
    },
  },
  {
    path: "/*",
    name: "404",
    component: Page404,
    meta: {
      title: "404-知乎日报",
    },
  },
];

export default routes;
```

## index.js

### 返回路由配置

该文件引入路由对象数组，通过 `.map()` 的方法循环数组并返回路由组件 `<Route />` ，最后全局导出路由组件给 `<App.js />` 根组件使用。

由于采用了路由懒加载的设置，需要外层包裹一层 `Suspense` 标签

代码如下所示：

```jsx
import React, { Suspense } from "react";
import routes from "./routes.js";

// 统一路由配置
const Element = (props) => {
};

const RouterView = () => {
  return (
    <Suspense
      fallback={<div>loading</div>}
    >
      <Routes>
        {routes.map((route) => {
          let { name, path } = route;
          return (
            <Route key={name} path={path} element={<Element {...route} />} />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default RouterView;
```

### 统一配置路由

通过 `Element` 函数统一配置路由，返回的是一个配置好的 JSX 组件给路由组件使用。配置信息分以下几个步骤：

1. 获取 `meta` 元信息修改页面的 `title` 标题
2. 获取路由信息并传递给组件
3. 获取组件并返回
4. 后续实现路由守卫配置

代码如下：

```js
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
// ...

// 统一路由配置
const Element = (props) => {
  let { component: Component, meta } = props;

  // 修改页面的Title
  document.title = meta ? meta.title : "知乎日报-mobile";

  // 路由守卫设置

  // 获取路由信息，基于属性传递给组件
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams();

  return (
    <Component
      navigate={navigate}
      location={location}
      params={params}
      usp={usp}
    />
  );
};
```

### 懒加载配置

简单的 `Loading` 文本过于简陋，因此去查看有没有组件可以使用。通过查看官方文档，最终敲定使用 `Mask` 遮罩层与 `DotLoading` 加载图标，代码如下：

```jsx
import { Mask, DotLoading } from "antd-mobile";

// ...

const RouterView = () => {
  return (
    <Suspense
      fallback={
        <Mask visible={true}>
          <DotLoading color="white" />
        </Mask>
      }
    >
      <Routes>
        {routes.map((route) => {
          let { name, path } = route;
          return (
            <Route key={name} path={path} element={<Element {...route} />} />
          );
        })}
      </Routes>
    </Suspense>
  );
};
```

修改样式：

```scss
.adm-dot-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60px;
}
```

## 使用

在 `App.js` 根组件中引入导出的路由配置并使用，代码如下：

```js
import RouterView from "@/router/index.js";

function App() {
  return (
    <>
      <RouterView />
    </>
  );
}

export default App;
```

此时运行会报错，提示需要使用 `router` 包裹 `routes` 。在入口文件 `index.js` 中导入路由模式并包裹 `<App />` 组件，代码如下：

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
// ...

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </HashRouter>
  </React.StrictMode>
);
```

目前为止，路由模块搭建完毕。

## 路由守卫

引入 `redux` 仓库内保存的数据，用于判断是否登录来判断能否进入登录后才能进入的页面。如果没有，则调用接口尝试获取数据，获取到数据则放行；获取数据失败则跳转到登录页。代码如下：

```jsx
import React, { Suspense } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  Navigate,
} from "react-router-dom";
import routes from "./routes.js";
import { Mask, DotLoading, Toast } from "antd-mobile";
import store from "@/store";
import Api from "@/api";

const Element = async (props) => {
  let { component: Component, meta, path } = props;

  // 修改页面的Title
  document.title = meta ? meta.title : "知乎日报-mobile";

  // 路由守卫设置
  let {
      base: { info },
    } = store.getState(),
    checkList = ["/personal", "/store"];
    if (!info && checkList.includes(path)) {
      // 先获取用户信息
      let res = await Api.userInfo();
      info = res.data;
      if (!info) {
        // 还是没有信息，说明没登录，需要去重新登录
        Toast.show({
          icon: "fail",
          content: "请先登录",
        });
        return (
          <Navigate
            to={{
              pathname: "/login",
              search: `?to=${path}`,
            }}
          />
        );
      }
      // 如果获取到信息，说明已登录，派发任务信息存储到容器中
      store.dispatch(res);
    }

  // 获取路由信息，基于属性传递给组件
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams();

  return (
    <Component
      navigate={navigate}
      location={location}
      params={params}
      usp={usp}
    />
  );
};

const RouterView = () => {
  //...
};

export default RouterView;
```

运行后发现报错，提示 `Element` 必须返回一个 JSX 组件而不是 `Promise` 对象。因为 `Element` 是函数式组件，也就是说 `async` 不能加在 `Element` 函数上。

转换思路，通过闭包 加 自运行函数的形式调用接口获取数据的形式，代码如下：

```jsx
// 统一路由配置。不能把async家在这里，因为最终要返回一个 JSX 而不是 Promise
const Element = (props) => {
  let { component: Component, meta, path } = props;

  // 修改页面的Title
  document.title = meta ? meta.title : "知乎日报-mobile";

  // 路由守卫设置
  let {
      base: { info },
    } = store.getState(),
    checkList = ["/personal", "/store"];
  (async () => {
    if (!info && checkList.includes(path)) {
      // 先获取用户信息
      let res = await Api.userInfo();
      info = res.data;
      if (!info) {
        // 还是没有信息，说明没登录，需要去重新登录
        Toast.show({
          icon: "fail",
          content: "请先登录",
        });
        return (
          <Navigate
            to={{
              pathname: "/login",
              search: `?to=${path}`,
            }}
          />
        );
      }
      // 如果获取到信息，说明已登录，派发任务信息存储到容器中
      store.dispatch(res);
    }
  })();

  // ...
  );
};

const RouterView = () => {
  //...
};

export default RouterView;
```

但是保存后运行发现没有效果，他只是提示 “请先登录” ，但是没有跳转登录页。因为调用接口是异步操作，而 `Element` 需要立刻返回一个 JSX ，因此他无法基于异步操作，实现根据异步结果控制同步渲染。

不能加 `async` ，闭包异步函数运行比同步慢，那该怎么办呢？

可以用一个变量 `isShow` 判断，在异步函数执行完毕前先渲染 `Loading` 效果的遮罩层，然后接口调用完毕后再 `return` 返回对应的页面或登录页，实现跳转。

`isShow` 在用户未登录且跳转到需要登陆的页面时，其值为 `false` 表示需要做校验，否则用户登录了或跳转到首页、详情页这种不需要登录的页面，其值为 `true` 表示不需要做校验。

如果不需要做校验，直接返回对应 JSX 组件，否则返回 `Loading` 加载遮罩层。

需要校验的时候，再通过闭包 加 自运行函数 调用接口获取最新的数据，并保存到 `redux` 内。

代码如下：

```jsx
const isLoading = (path) => {
  let {
      base: { info },
    } = store.getState(),
    checkList = ["/personal", "/store"];
  return !info && checkList.includes(path);
};
// 统一路由配置。不能把async家在这里，因为最终要返回一个 JSX 而不是 Promise
const Element = (props) => {
  let { component: Component, meta, path } = props;

  let isShow = !isLoading(path);
  let [_, setRandom] = useState(0);

  // 路由守卫设置
  useEffect(() => {
    if (isShow) return;
    (async () => {
      // 先获取用户信息
      let res = await Api.userInfo();
      let info = res.data;
      if (!info) {
        // 还是没有信息，说明没登录，需要去重新登录
        Toast.show({
          icon: "fail",
          content: "请先登录",
        });
        navigate({
          pathname: '/login',
          search: `?to=${path}`
        }, { replace: true })
        return
      }
      // 如果获取到信息，说明已登录，派发任务信息存储到容器中
      store.dispatch(res);
      setRandom(+new Date());
    })();
  });

  // 修改页面的Title
  document.title = meta ? meta.title : "知乎日报-mobile";

  // 获取路由信息，基于属性传递给组件
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams();

  return !isShow ? (
    <Mask visible={true}>
      <DotLoading color="white" />
    </Mask>
  ) : (
    <Component
      navigate={navigate}
      location={location}
      params={params}
      usp={usp}
    />
  );
};
```

> 注意
>
> 1. 这里 `setRandom` 的作用是更新 `useState` 的值后触发 `render` 的更新，实现 `redux` 仓库的数据更新后也能更新视图。
> 2. 如果没登录，路由实际上是从首页跳转到个人页，然后判断出未登录再跳转到登录页，登录后再跳转回个人页，此时路由栈是：首页、个人页、个人页，需要返回两次才是首页。因此在跳转到登录页时要做 `replace` 操作。

## 总结

在实现业务时应该按照标准的函数组件的操作，基于状态、变量、周期函数，统一处理登录状态的校验：

分析是否需要校验：`isShow`

- true 不需要校验，直接渲染需要渲染的视图即可
- false 需要校验，执行以下操作：
  1. 先渲染 `Loading` 异步操作的遮罩层
  2. 在周期函数中做校验，根据校验结果来决定操作。校验通过，更新视图组件；校验不通过，提示并跳转登录页

