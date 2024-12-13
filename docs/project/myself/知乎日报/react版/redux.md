# Redux配置

## 思路分析

项目配置 `redux` 仓库管理，在 `src` 文件夹下新建 `store` 文件夹，然后新建几个文件和文件夹，每个负责不同的功能，其中：

- `index.js` 文件，用于引入配置创建 `store` 并导出
- `action-types.js` 文件，用于设置 `action` 的 `type` 类型
- `reducer` 文件夹，放置所有 `reducer` 相关配置的文件，每个模块来命名，最后在*该文件夹*下的 `index.js` 文件中引入合并 `reducer`
- `action` 文件夹，放置所有 `action` 对象的文，每个模块来命名，最后在*该文件夹*下的 `index.js` 文件中统一导出

## reducer文件夹

`reducer` 文件夹主要放置相关配置，创建两个文件 `base.js` 与 `store.js` ，分别对应不同模块的 `reducer` 。代码如下：

```js
import * as TYPES from "../action-types";

let initial = {
  a: 1,
};

export default function baseReducer(state = initial, action) {
  let newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case value:
      break;

    default:
      break;
  }

  return newState;
}
```

最后创建 `index.js` 文件，导入两个文件并合并，代码如下：

```js
// 合并reducer
import { combineReducers } from "redux";
import base from "./base";
import store from "./store";

const reducers = combineReducers({
  base,
  store,
});

export default reducers;
```

## action文件夹

该文件夹主要放置每个模块的 `action` 对象，与 `reducer` 类似，最后在 `index.js` 文件中导入多文件并统一导出，代码如下：

- 各个模块

  ```js
  import * as TYPES from "../action-types";
  
  const baseAction = {};
  
  export default baseAction;
  ```

- index.js

  ```js
  import base from "./base";
  import store from "./store";
  
  const actions = {
    base,
    store,
  };
  
  export default actions;
  ```

## action-types.js文件

该文件主要设置 `action` 对象中 `type` 的名称，代码如下：

```js
export const BASE_INFO = "BASE_INFO";
```

## index.js文件

通过 `createStore` 创建 `store` 模块，通过 `applyMiddleware()` 方法配置中间件。

其中关于 `redux-logger` 中间件需要判断当前环境是否为开发环境，只有开发环境才需要添加，生产环境则无需添加。

代码如下：

```js
import { createStore, applyMiddleware } from "redux";
import reduxLogger from "redux-logger";
import reduxThunk from "redux-thunk";
import reduxPromise from "redux-promise";
import reducer from "./reducer";

// 根据不同的环境使用不同的中间件
let middleware = [reduxThunk, reduxPromise],
  env = process.env.NODE_ENV;
// 开发环境添加logger
if (env === "development") middleware.push(reduxLogger);

const store = createStore(reducer, applyMiddleware(...middleware));

export default store;
```

## 配置store

在入口文件中引入创建并导出的 `store` ，通过 `react-redux` 提供的 `Provider` 组件注册 `store` 。代码如下：

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/store";

// ...

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <ConfigProvider locale={zhCN}>
          <App />
        </ConfigProvider>
      </Provider>
    </HashRouter>
  </React.StrictMode>
);
```

## 使用

### 单使用

在 `action-types.js` 文件中设置需要使用的方法字典：

```js
export const BASE_INFO = "BASE_INFO";
```

在 `reducer` 文件夹下对应模块的文件中设置相应的 `action` 判断以及对应的数据操作：

```js
import * as TYPES from "../action-types";

let initial = {
  info: null
};

export default function baseReducer(state = initial, action) {
  let newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case TYPES.BASE_INFO:
      newState.info = action.info
      break;
    default:
      break;
  }

  return newState;
}
```

在 `action` 文件夹下对应模块的文件中设置相应的 `action` 方法：

```js
import * as TYPES from "../action-types";
import Api from '@/api/index.js'

const baseAction = {
  // 异步方法
  async infoAsync(phone, code) {
    let info = null;
    try {
      let res = await Api.getUserInfoApi(phone, code);
      if (res.code === 200) {
        info = res.data;
      }
    } catch (error) {
      console.log(error);
    }
    return {
      type: TYPES.BASE_INFO,
      info,
    };
  },
  // 同步方法
  clearInfo() {
    return {
      type: TYPES.BASE_INFO,
      info: null,
    };
  },
};

export default baseAction;
```

在需要使用的函数式组件中引入 `action` 文件夹下的 `index.js` ，引入 `react-redux` 提供的 `connect` API ，把组件和 `redux` 组合起来。代码如下：

```jsx
import { connect } from "react-redux";
import action from "@/store/action";

// ...

function Login() {
  // ...
}

export default connect(
  null,
  action.base
)(Login);
```

链接成功后函数式组件的 `props` 形参能够获取到之前设置的 `action` 方法，代码如下：

```jsx
import { connect } from "react-redux";
import action from "@/store/action";

// ...

function Login(props) {
  const { infoAsync, navigate } = props
  
  // 表单提交
  const submit = async () => {
    // 此时表单校验已经成功。values：Form表单组件自动收集的每个表单中的信息
    try {
      await formIns.validateFields(); // 表单校验
      let { phone, code } = formIns.getFieldsValue();
      const res = await Api.login(phone, code);
      infoAsync() // redux也同步调用接口保存数据
      if (+res.code !== 0) {
        Toast.show({
          icon: "fail",
          content: "登陆失败",
        });
        formIns.resetFields(["code"]); // 重置验证码
      } else {
        // 登录成功
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  // ...
}

export default connect(
  null,
  action.base
)(Login);
```

### 多使用

如果想使用多个 `state` 数据与多个 `action` 方法，可写为以下形式：

```js
export default connect(
  state => ({
    base: state.base,
    store: state.store
  }),
  { ...action.base, ...action.store }
)(Login);
```

上面代码会把 `base` 模块和 `store` 模块的 `reducer` 作为对象形式在形参 `props` 中获取；而两个模块的 `action` 方法则因为展开点语法可以直接使用。代码如下：

```jsx
function Test(props) {
  const { base: {info}, infoAsync } = props
  // ...
}
```

