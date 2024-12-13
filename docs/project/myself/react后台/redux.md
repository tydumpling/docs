---
title react后台仓库配置
---

# 仓库配置

使用仓库的前置条件需要先下载好 `react-redux` 和 `redux` 两个第三方库。浏览器使用 `react-redux-devtool` 扩展插件可查看 `redux` 的值的变化。

## 仓库创建

新建一个 `store` 文件夹，创建一个 `reducer` 文件作为数据 `state` 值存储，其中：

- 创建一个初始值数据对象
- 声明一个函数，参数一为 `state` 参数值，默认值为初始化的数据对象
- 深拷贝赋值给一个变量并导出

代码如下所示：

```jsx
// 初始数据
const defaultState = {
  num: 20,
  age: 30,
};

// 准备数据，返回state的形式
let reducer = (state = defaultState,) => {
  let newState = JSON.parse(JSON.stringify(state));

  return newState;
};

export default reducer;
```

创建一个 `index` 文件，通过 `redux` 提供的 `legacy_createStore` 方法创建数据仓库，再全部导出。其中：

- 引入刚刚创建好的 `reducer` 给 `legacy_createStore` 方法第一个参数
- 设置`legacy_createStore` 方法的第二个参数使其能正常使用 `react-redux-devtool` 扩展插件

代码如下所示：

```js
import { legacy_createStore } from "redux";
import reducer from "./reducer";

// 创建数据仓库，创建配置项使其能让浏览器正常使用react-redux-devtools扩展插件调试
const store = legacy_createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
```

## 仓库注册

在入口文件 `main.jsx` 文件中引入刚刚导出的数据仓库注册，步骤如下：

- 使用 `react-redux` 中的 `Provider` 方法包裹在组件最外层
- `Provider` 中的 `store` 方法用于注册仓库

代码如下所示：

```jsx
// ...
// 状态管理
import { Provider } from "react-redux";
import store from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);
```

## 数据使用

通过 `react-redux` 中的 `useSelector` hook 获取仓库内的数据，方法传入一个函数，函数形参为仓库内的数据对象。通过解构获取数据，代码如下所示：

```jsx
import React from "react";
import { useSelector } from "react-redux";

export default function Vue() {
  // 获取仓库数据
  const { num, age } = useSelector((state) => ({
    num: state.num,
    age: state.age,
  }));

  return (
    <div>
      <p>{num}</p>
      <p>{age}</p>
    </div>
  );
}
```

## 数据修改

修改数据则通过 `react-redux` 中的 `useDispatch` hook 修改，其方法需要传入一个对象，其中 `type` 为固定的，表示要做什么操作，后面的属性字段是自定义的。

这里以增加数字为例，`type` 设置为 `add` 。代码如下所示：

```jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Vue() {
  // 获取仓库数据
  const { num, age } = useSelector((state) => ({
    num: state.num,
    age: state.age,
  }));

  const dispatch = useDispatch();

  const handleChangeFn = () => {
    // dispatch({type: '字符串（认为是一个记号）'，val：3}) type是固定的，val是自定义的
    dispatch({ type: "add", val: 3 });
  };
  return (
    <div>
      <p>{num}</p>
      <p>{age}</p>
      <button onClick={handleChangeFn}>click me</button>
    </div>
  );
}
```

再去 `reducer.js` 文件中接收 `dispatch` 传过来的对象，当触发 `dispatch` 时 `reducer` 函数也会触发，而他的第二个参数可以获取 `dispatch` 传过来的对象。通过 `type` 来判断要执行什么操作，再修改值即可。代码如下所示：

```js
// 初始数据
const defaultState = {
  num: 20,
  age: 30,
};

// 准备数据，返回state的形式
let reducer = (state = defaultState, action) => {
  // dispatch调用这里的代码也会执行
  let newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case "add":
      newState.num += action.val;
      break;
    default:
      break;
  }

  return newState;
};

export default reducer;
```

## 模块化

如同 `vuex` 和 `pinia` 一样，`redux` 也可以实现模块化，实现步骤如下所示：

1. 分别创建 `reducerA` 和 `reducerB` 两个仓库

2. 在 `index.js` 文件中引入，并通过 `redux` 提供的 `combineReducers` API 实现模块化

   ```js
   import { legacy_createStore, combineReducers } from "redux";
   
   import reducerB from "./reducerB";
   import reducerA from "./reducerA";
   
   const reducers = combineReducers({
     reducerA,
     reducerB,
   });
   ```

3. `legacy_createStore` 创建数据仓库时参数一改为合并后的仓库

   ```js
   const store = legacy_createStore(
     reducers,
     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
   );
   ```

此时运行，刷新页面，可以发现页面上的数据没了。这是因为之前没做模块化，所有的数据都是在一个对象内，如下所示：

```js
{
  num: 20,
  age: 30
}
```

做了模块化后每一个模块都是一个对象，数据在对应的对象内，如下所示：

```js
{
  reducerA: {
    num: 20,
    age: 30
  },
  reducerB: {}
}
```

因此之前的 `state.num` 获取不到数据了，需要修改为 `state.reducerA.num` 。

## 数据抽离

`reducer.js` 文件目前看起来有点臃肿，如果数据量多了之后，代码量肯定暴增，日后不方便维护。因此需要把数据 `state` 和方法 `actions` 抽离出去放到新的 `index.js` 文件中，而 `reducer.js` 文件只需要判断使用那个方法即可。

新建一个 `indexA.js` 文件（实际上应该创建一个文件夹，同一个模块的 `index.js` 和 `reducer.js` 放到同一个文件夹中），把 `state` 与 `action` 处理出来，并设置名称枚举的对象，代码如下所示：

- `indexA.js`

  ```jsx
  export default {
    state: {
      num: 20,
      age: 30
    },
    actions: {
      add(newState, action) {
        newState.num += action.val
      }
    },
    actionName: {
      add: 'add'
    }
  }
  ```

- `reducerA.js`

  ```js
  // indexA.js文件
  import indexA from './indexA.js'
  
  // 直接通过解构的形式把初始值赋值给参数一的 state 形参
  let reducer = (state = { ...indexA.state }, action) => {
    // dispatch调用这里的代码也会执行
    let newState = JSON.parse(JSON.stringify(state));
  
    switch (action.type) {
      case indexA.actionNames.add:
        indexA.actions[indexA.actionNames.add](newState, action)
        break;
      default:
        break;
    }
  
    return newState;
  };
  
  export default reducer;
  ```

### switch优化

如果方法多的话 `switch` 需要一个个添加 `case` 判断，优化为 `reducerA.js` 文件解放双手，无需再做过多代码书写，只需要添加 `indexA.js` 文件中的 `actions` 方法即可。如何实现呢？

`switch` 的方法本质是遍历匹配符合条件的判断，然后执行特定的代码，因此可以注释掉 `switch` ，通过遍历 `actionName` 对象，判断每一项的值是否与 `type` 相等，相等则执行对应的 `action` 函数。代码如下：

```js
// indexA.js文件
import indexA from './indexA.js'

// 直接通过解构的形式把初始值赋值给参数一的 state 形参
let reducer = (state = { ...indexA.state }, action) => {
  // dispatch调用这里的代码也会执行
  let newState = JSON.parse(JSON.stringify(state));

  for(let key in indexA.actionName) {
    // key为对象的键。判断键是否与当前的action.type相等
    if(action.type === indexA.actionName[key]) {
      // 相等则调用对应名称的方法
      indexA.actions[indexA.actionName[key]](newState, action)
    }
  }

  return newState;
};

export default reducer;
```

此时可以不用再去考虑 `reducerA.js` 文件的修改，只需要看 `indexA.js` 中的 `state` 与 `actions` 。

### 方法名称优化

方法 `actionName` 需要手动设置属性，还是有点麻烦。现在想做到 `actionName` 自动生成，不需要每一次手动添加一个方法。

解决方案：既然 `actionName` 取决于 `actions` 中有多少函数，所以先遍历 `actions` 内的函数，然后做到每一个值 `value` 都等于他的键 `key` 即可。

代码如下所示：

```js
const store = {
  state: {
    num: 20,
    age: 30
  },
  actions: {
    add(newState, action) {
      newState.num += action.val
    }
  },
  actionName: {}
}

// 遍历action设置值
for(let key in store.actions[key]) {
  store.actionName[key] = key
}

export default store
```

## 异步配置

### 配置

异步操作时 `react-redux` 会有问题，需要使用 `react-thunk` 方法实现异步操作。

- 安装

  ```
  yarn add react-thunk
  ```

- 配置

  不能在 `action` 中使用，其只能使用同步的方法，需要配置 `react-thunk` 。前往 `store/index.js` 文件中配置

  ```js
  import { legacy_createStore, combineReducers, compose } from "redux";
  import reduxThunk from 'redux-thunk'
  // ...
  
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__({}) : compose
  
  // 把仓库数据、浏览器redux-dev-tools、redux-yhunk插件关联在store中
  const store = legacy_createStore(
    reducers,
    composeEnhancers(applyMiddleware(reduxThunk))
  );
  
  export default store;
  ```

### 使用

`react-thunk` 方法需要传递一个函数，函数形参可使用 `dispatch` 的方法。代码如下所示：

```js
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Vue() {
  // ...
  const dispatch = useDispatch();

  const handleChangeFn = () => {
    // 异步方法
    dispatch((dis) => {
      setTimeout(() => {
        dis({ type: "addTime", val: 3 })
      }, 1000)
    });
  };
  // ...
}
```

保存运行，现在就可以使用异步的方法。

### 优化

上面的写法把 `react-thunk` 的调用放在组件代码中，可以把它抽离出去放到 `indexA.js` 文件中，实现代码模块化处理。

在 `indexA.js` 文件中新建一个异步 `actions` 的对象，把函数复制过去。代码如下：

```js
const store = {
  state: {
    num: 20,
    age: 30
  },
  actions: {
    add(newState, action) {
      newState.num += action.val
    }
  },
  asyncActions: {
    asyncAdd(dispatch) {
      setTimeout(() => {
        dispatch({type: 'add'})
      }, 1000)
    }
  },
  actionName: {}
}

// 遍历action设置值
for(let key in store.actions[key]) {
  store.actionName[key] = key
}

export default store
```

则 `index.js` 只需要引入对应的方法并且调用即可。代码如下：

```js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import indexA from '@/store/indexA.js'

export default function Vue() {
  // ...
  const dispatch = useDispatch();

  const handleChangeFn = () => {
    // 异步方法
    // dispatch((dis) => {
    //   setTimeout(() => {
    //     dis({ type: "addTime", val: 3 })
    //   }, 1000)
    // });
    dispatch(indexA.asyncActions.asyncAdd);
  };
  // ...
}
```

> 注意
>
> `dispatch` 方法内传的是一个回调函数，因此只需要获取函数方法并填入即可，不需要在后面添加 `()` 。对应的函数则能获取到对应的形参 `dispatch` 。

## 总结

如果需要使用 `react-redux` ，首先在 `store` 文件夹下新建对应模块文件夹，在其中一个 `index.js` 文件，设置变量与方法，代码如下：

```js
const store = {
  state: {
    // 变量
  },
  actions: {
    // 放同步方法
  },
  asyncActions: {
    // 放异步方法
  },
  actionName: {}
}

// 遍历action设置值
for(let key in store.actions[key]) {
  store.actionName[key] = key
}

export default store
```

再同级目录下新建 `reducer.js` 文件，引入 `index.js` 文件，设置默认值与遍历方法。代码如下：

```js
// indexA.js文件
import index from './reducerA.js'

// 直接通过解构的形式把初始值赋值给参数一的 state 形参
let reducer = (state = { ...indexA.state }, action) => {
  // dispatch调用这里的代码也会执行
  let newState = JSON.parse(JSON.stringify(state));

  for(let key in indexA.actionName) {
    // key为对象的键。判断键是否与当前的action.type相等
    if(action.type === indexA.actionName[key]) {
      // 相等则调用对应名称的方法
      indexA.actions[indexA.actionName[key]](newState, action)
    }
  }

  return newState;
};

export default reducer;
```

需要使用时引入对应的 `index.js` 文件使用即可，其中：

- 通过 `useSelector` 获取数据
- 通过 `useDispatch` 调用方法

代码如下：

```js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import indexA from '@/store/indexA.js'

export default function Vue() {
  // 获取仓库数据
  const { num, age } = useSelector((state) => ({
    num: state.indexA.num,
    age: state.indexA.age,
  }));
  
  const dispatch = useDispatch();

  const handleChangeFn = () => {
    // 同步方法
    dispatch({ type: "add", val: 3 });

    
    // 异步方法
    dispatch(indexA.asyncActions.方法名);
  };
  // ...
}
```

