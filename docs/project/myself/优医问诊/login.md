---
title 登录模块

---

# 登录模块

## 路由回退

登录页面顶部导航了允许点击左侧的箭头返回上一页，此时需要判断当前路由栈是否有历史路由。如果有，返回上一个路由即可；如果没有，则直接返回到首页。

代码如下所示：

```js
// 判断历史记录中是否有回退
if (history.state?.back) {
  router.back()
} else {
  router.push('/')
}
```

## 组件类型

想要实现组件也有 typescript 类型，在使用时能够给予事件、属性提示，可以给组件添加类型。

添加类型方法分为如下几步：

1. 写一个组件类型声明文件（以 `.d.ts` 为后缀），`declare module 'vue'` 声明一个 vue 类型模块
2. 然后 `interface GlobalComponents` 书写全局组件的类型
3. key组件名称支持大驼峰，value是组件类型,通过 typeof 组件实例得到

代码如下所示：

```js
import MyNavBar from '@/components/MyNavBar.vue'

declare module 'vue' {
  interface GlobalComponents {
    MyNavBar: typeof MyNavBar
  }
}
```

> 总结
>
> 怎么给全局的组件提供类型？
>
> - 写一个类型声明文件，`declare module 'vue'` 声明一个 vue 类型模块
> - 然后 `interface GlobalComponents` 书写全局组件的类型
> - key组件名称支持大驼峰，value是组件类型,通过 typeof 组件实例得到

## SVG项目打包

将 SVG 图标文件自动转换为 Vue 组件，并自动导入到项目中，能够极大提高开发效率。实现该功能需要分为两步：

1. 使用 `vite-plugin-svg-icons` 插件

   使用 `vite-plugin-svg-icons` 可以免去手动导入每个 SVG 图标的麻烦，同时还可以享受到 Vue 组件的好处，例如轻松地在模板中使用、添加 props 等等。

   该插件的主要功能包括：

   - 自动读取指定目录下的 SVG 图标文件，将其转换为 Vue 组件。
   - 自动生成一个包含所有 SVG 图标组件的 Vue 全局组件。
   - 在编译时自动导入 SVG 图标组件，无需手动导入。

   使用 `vite-plugin-svg-icons` 的方法非常简单，只需要安装插件并在 Vite 配置文件 `vite.config.js` 中进行配置即可。例如：

   ```js
   import { defineConfig } from 'vite'
   import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
   
   export default defineConfig({
     plugins: [
       // ....
       createSvgIconsPlugin({
         iconDirs: [/* 指定 SVG 图标所在的目录 */],
         symbolId: 'icon-[dir]-[name]'
       })
     ]
   })
   ```

   上述代码中，我们通过 `iconDirs` 参数指定了 SVG 图标所在的目录，`symbolId` 则指定了生成的图标 ID 的格式。

2. 获取图片路径

   使用 `path.resolve` 方法将当前工作目录和相对路径拼接成绝对路径。

   更具体地说，代码中的 `process.cwd()` 返回的是当前 Node.js 进程的工作目录，而 `'src/icons'` 是相对于工作目录的相对路径。`path.resolve` 方法会将这两者拼接成绝对路径，例如：`/Users/WH/Desktop/hei/vue-project/src/icons`。

   这个路径的含义可能是指项目中存放 SVG 图标的目录，因为 `vite-plugin-svg-icons` 插件需要知道图标所在的目录才能自动导入和转换它们。

   其中在大多数情况下，这个工作目录指的是运行 Vue 项目的根目录。在终端中使用 `npm run` 命令或者其他类似的命令来启动 Vue 项目时，Node.js 进程会以项目根目录作为当前的工作目录。这意味着，对于一个 Vue 项目而言，`process.cwd()` 返回的路径就是 Vue 项目的根目录。

   例如，如果你的 Vue 项目的根目录是 `/Users/Desktop/vue-project`，那么在项目的任何地方调用 `process.cwd()` 都会返回该路径。

   在上述代码中，`path.resolve(process.cwd(), 'src/icons')` 的含义就是基于当前工作目录解析出 `src/icons` 相对路径的绝对路径。这样做可以确保正确地定位到 Vue 项目中存放 SVG 图标的目录。

   最终代码如下所示：

   ```js
   import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
   import path from 'path'
   // ...
   
   export default defineConfig({
     plugins: [
       createSvgIconsPlugin({
         iconDirs: [path.resolve(process.cwd(), 'src/icons')],
       })
     ],
     // ...
   })
   ```

3. 在入口文件 `main.js` 中导入：

   ```js
   import 'virtual:svg-icons-register'
   ```

4. 使用svg精灵地图，使用方式为 `svg-文件夹名称-图标名称`

   ```html
   <svg aria-hidden="true">
     <!-- #icon-文件夹名称-图片名称 -->
     <use href="#icon-login-eye-off" />
   </svg>
   ```

   注意的是文件夹名称是在第二步设置的文件夹，即示例中 `src/icons` 。

> 总结
>
> - icons文件打包的产物？
>
>   会生成一个 svg 结构（js创建的）包含所有图标，理解为 `精灵图`
>
> - 怎么使用svg图标？
>
>   通过 svg 标签 `#icon-文件夹名称-图片名称` 指定图片，理解 `精灵图定位坐标`