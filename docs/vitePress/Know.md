---
title 拓展学习
---
# 拓展学习
部署成功并不是终点， `vitepress` 的学习之旅还在继续。此模块收集一些知识点与功能的使用，还在不断完善中~
> 前路渐行渐远，退路遥遥无期

## 路由跳转
路由跳转有两种模式：
1. 首页配置、导航栏侧边栏配置：`/目录/` ，如 `/learn/` 匹配的是 `learn` 文件夹下的 `index.md` 文件。
  
2. `markdown` 文件配置： `[路由名称](/目录/)` ，如 `[我是learn模块的index.md](/learn/)` 。

## 组件使用
可以使用 `Vue2` 的组件。
- 在 `.vitepress/theme/index.js` 中， 因为enhanceApp 函数接受 Vueapp对象，所以可以像普通 Vue 插件那样注册组件。
  
  ```js
    import DefaultTheme from 'vitepress/theme'
    import MyComponent from '../components/MyComponent.vue';

    export default {
        ...DefaultTheme,
        enhanceApp({ app }) {
            app.component('MyComponent', MyComponent)
        }
    }
  ```

- 在全局组件中使用该组件
  
  ```md
    # Vue.js设计与实现

    <MyComponent/>
  ```

> 注意
>
> 确保自定义组件的名称包含连字符或是 PascalCase 格式。否者，它会被当成内联元素并包裹在 `<p>` 标签内，这将会导致 HTML 渲染紊乱， `<p>` 标签中不允许放置任何块级元素。