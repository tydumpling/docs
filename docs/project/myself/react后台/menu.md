---
title react后台菜单封装
---

# 菜单封装

## 模块抽离

首先把菜单模块抽离出来，不让 `HOME` 页面代码冗余，后续维护菜单模块也好维护。

菜单子组件设置菜单子组件，首先能够渲染静态数组数据，代码如下：

```jsx
import React from "react";
import { Menu } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";

const items = [
  {
    key: "/vue",
    label: "Vue",
    icon: <PieChartOutlined />,
  },
  {
    key: "/react",
    label: "React",
    icon: <DesktopOutlined />,
  },
  {
    key: "/ts",
    label: "TS",
    icon: <UserOutlined />,
    children: [
      {
        label: "emun",
        key: "/ts/emun",
      },
    ],
  },
];

export default function MainMenu() {
  return (
    <Menu
      theme="dark"
      mode="inline"
      items={items}
    />
  );
}

```

Home父组件引入挂载使用：

```jsx
import MainMenu from "@/components/MainMenu/index.jsx";

// ....
const Home = () => {
  return (
    // ...
  	<MainMenu />
  )
}

export default Home
```

## 路由跳转

菜单模块要实现点击导航栏能够跳转路由，查看组件库官方文档，找到其点击事件，为其添加点击事件并查看参数打印：

```jsx
export default function MainMenu() {
  const handleMenuFn = (e) => {
    // 路由跳转
    console.log(e)
  };
  
  return (
    <Menu
      theme="dark"
      mode="inline"
      items={items}
      onClick={handleMenuFn}
    />
  );
}
```

打印结果如下所示：

```js
{
  pathname: 'Vue',
  key: '/vue',
  // ...
}
```

可以发现，我们需要的路由在 `key` 参数上。通过该属性实现路由跳转即可。

函数式组件中，想要实现路由跳转，需要配合 `useNavigate` hook 方法，代码如下所示：

```jsx
import React from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
// ...

export default function MainMenu() {
  const navigateTo = useNavigate();

  const handleMenuFn = (e) => {
    // 路由跳转
    if (e.key) navigateTo(e.key);
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      items={items}
      onClick={handleMenuFn}
    />
  );
}
```

## 展开限制

菜单组件默认可以展开无数条菜单项，本项目想要做个限制，使其只能最多展开两条，展开第三条时最开始展开的那条菜单项关闭。

想要实现业务首先先看文档，翻到后面看到该组件提供一个菜单展开关闭的事件 `openChange` ，添加该事件方法并查看打印的数据内容。

```jsx
// ...

export default function MainMenu() {
  const navigateTo = useNavigate();

  const handleMenuFn = (e) => {
    // 路由跳转
    if (e.key) navigateTo(e.key);
  };

  const handleOpenChangeFn = (keys) => {
    console.log(keys)
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      items={items}
      onClick={handleMenuFn}
      onOpenChange={handleOpenChangeFn}
    />
  );
}
```

打印出来的结果是当前展开的菜单栏的 `key` 数组，且按顺序最新的在最后面，最开始的在最前面。

因此实现方法可以为判断当前 `keys` 数组 长度，如果大于2则通过 `filter` 方法过滤出索引不为0的数据；否则直接保存。代码如下所示：

```jsx
// ...

export default function MainMenu() {
  const navigateTo = useNavigate();

  const handleMenuFn = (e) => {
    // 路由跳转
    if (e.key) navigateTo(e.key);
  };

  const [openKeys, setOpenKeys] = useState(['']);

  const handleOpenChangeFn = (keys) => {
    // 切换展开项，默认只展开最新两个侧边栏
    if (keys.length > 2) {
      setOpenKeys(keys.filter((e, i) => i !== 0));
    } else {
      setOpenKeys(keys);
    }
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      items={items}
      openKeys={openKeys}
      onClick={handleMenuFn}
      onOpenChange={handleOpenChangeFn}
    />
  );
}
```

## 默认选中与默认展开

菜单项需要实现刷新后根据当前的路由默认选中菜单项以及默认展开父菜单栏。根据文档得知菜单项默认显示是通过 `defaultSelectedKeys` 属性，设置一个字符串数组，所有符合条件的菜单都会高亮显示。

此时需要获取当前的路由了，函数式组件通过 `useLocation` 方法获取，返回的是一个对象，其中 `pathname` 属性为当前路由，因此代码可以写成如下形式：

```jsx
import { useNavigate, useLocation } from "react-router-dom";
// ...

export default function MainMenu() {
  const navigateTo = useNavigate();
  const location = useLocation();

  const handleMenuFn = (e) => {
    // 路由跳转
    if (e.key) navigateTo(e.key);
  };

  const [openKeys, setOpenKeys] = useState(['']);

  const handleOpenChangeFn = (keys) => {
    // 切换展开项，默认只展开最新两个侧边栏
    if (keys.length > 2) {
      setOpenKeys(keys.filter((e, i) => i !== 0));
    } else {
      setOpenKeys(keys);
    }
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      items={items}
      openKeys={openKeys}
      defaultSelectedKeys={[location.pathname]}
      onClick={handleMenuFn}
      onOpenChange={handleOpenChangeFn}
    />
  );
}
```

默认展开则不能直接把 `openKeys` 变量设置为空，而是动态根据当前路由获取其上级的 `key` 。步骤如下：

1. 循环遍历 `items` 变量，判断其是否有 `children` ，有子属性才需要展开
2. 通过 `find()` 方法遍历当前项的 `children` 数组，判断其 `key` 是否与当前路由匹配
3. 如果匹配，则把当前项的 `key` 值保存起来，赋值给 `openKeys` 做初始值，并终止循环，节省性能

代码如下：

```jsx
import { useNavigate, useLocation } from "react-router-dom";
// ...

export default function MainMenu() {
  const navigateTo = useNavigate();
  const location = useLocation();

  const handleMenuFn = (e) => {
    // 路由跳转
    if (e.key) navigateTo(e.key);
  };

  // 定义默认展开
  let firstKey = "";
  for (let i = 0; i < items.length; i++) {
    // 如果他有children属性才需要默认展开，判断其children数组内的每条数据的key是否与路由匹配
    if (
      items[i]["children"] &&
      items[i]["children"].length > 0 &&
      items[i]["children"].find((obj) => obj.key === location.pathname)
    ) {
      firstKey = items[i].key;
      break;
    }
  }
  const [openKeys, setOpenKeys] = useState([firstKey]);

  const handleOpenChangeFn = (keys) => {
    // 切换展开项，默认只展开最新两个侧边栏
    if (keys.length > 2) {
      setOpenKeys(keys.filter((e, i) => i !== 0));
    } else {
      setOpenKeys(keys);
    }
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      items={items}
      openKeys={openKeys}
      defaultSelectedKeys={[location.pathname]}
      onClick={handleMenuFn}
      onOpenChange={handleOpenChangeFn}
    />
  );
}
```

