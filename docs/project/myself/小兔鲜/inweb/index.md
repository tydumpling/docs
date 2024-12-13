# 项目创建

首先创建一个 `vite + vue3` 项目，命令如下：

```
npm init vue@latest
```

设置项目名称，使用 `pinia` 、`router` ，其余都选择 `No` 。

[![p9I9xyD.md.png](https://s1.ax1x.com/2023/05/21/p9I9xyD.md.png)](https://imgse.com/i/p9I9xyD)

## 配置基础文件夹

文件夹配置如下如所示

[![p9Ikm3q.png](https://s1.ax1x.com/2023/05/21/p9Ikm3q.png)](https://imgse.com/i/p9Ikm3q)

## 前置配置

### @别名

1. 在项目根目录下新值 `jsconfig.json` 文件

2. 添加 `json` 格式的配置项

   ```js
   {
     "compilerOptions": {
       "baseUrl": "./",
       "paths": {
         "@/*": [
           "src/*"
         ]
       }
     }
   }
   ```

> 注意
>
> 这里仅作代码识别提示，真正转换是在 `vite.config.js` 下的 `resolve` 模块。例如我需要添加一个 `@api` 指向 `src/apis` 的文件夹，则需要在 `json` 文件中添加 `@api` 的提示。
>
> ```js
> {
>   "compilerOptions": {
>     "baseUrl": "./",
>     "paths": {
>       "@/*": [
>         "src/*"
>       ],
>       "@api/*": [
>         "src/apis/*"
>       ]
>     }
>   }
> }
> ```
>
> `vite.config.js` 下做相应的配置。
>
> ```js
> alias: {
>   '@': fileURLToPath(new URL('./src', import.meta.url)),
>   '@api': fileURLToPath(new URL('./src/apis', import.meta.url))
> }
> ```
>
> 重启项目刷新配置查看效果。

### element-plus

按需导入的方法安装组件库 `element-plus` 。

1. 安装

   ```
   yarn add element-plus
   ```

2. 安装按需导入的插件

   ```
   yarn add -D unplugin-vue-components unplugin-auto-import
   ```

3. 在 `vite.config.js` 中配置

   ```js
   // ...
   
   // element-plus按需导入
   import AutoImport from 'unplugin-auto-import/vite'
   import Components from 'unplugin-vue-components/vite'
   import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
   
   // https://vitejs.dev/config/
   export default defineConfig({
     plugins: [
       vue(),
       // ...
       AutoImport({
         resolvers: [ElementPlusResolver()],
       }),
       Components({
         resolvers: [ElementPlusResolver()],
       }),
     ],
     resolve: {
       // ...
     }
   })
   ```

复制组件运行代码，生效即为成功。

## 配置主题色

### 安装 Sass

```bash
yarn add sass -D
```

### 重写主题色

在 `styles/element/index.scss` 路径下的 scss 文件重写主题色

```scss
/* 只需要重写你需要的即可 */
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    'primary': (
      // 主色
      'base': #27ba9b,
    ),
    'success': (
      // 成功色
      'base': #1dc779,
    ),
    'warning': (
      // 警告色
      'base': #ffb302,
    ),
    'danger': (
      // 危险色
      'base': #e26237,
    ),
    'error': (
      // 错误色
      'base': #cf4444,
    ),
  )
)
```

### 修改配置

前往 `vite.config.js` 修改配置：

- 新增 `css` 模块，用于引入主题色文件模块并使用
- 配置 element-plus 使用修改后的 scss 文件

```js
// ...
export default defineConfig({
  plugins: [
    // ...
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
    }),
  ],
  resolve: {
    // ...
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 自动导入定制化样式文件进行样式覆盖
        additionalData: `
          @use "@/styles/element/index.scss" as *;
        `,
      }
    }
  }
})
```

重启项目后在运行，引入默认的按钮组件，查看其颜色，发生变化则为成功。

## 配置 axios

### 安装

```bash
yarn add axios
```

### 配置

- 配置基准路径与超时时间
- 配置最基础的拦截器

```js
import axios from "axios";

const http = axios.create({
  baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net/',
  timeout: 5000
})

// axios请求拦截器
http.interceptors.request.use(config => {
  return config
}, e => Promise.reject(e))

// axios响应式拦截器
http.interceptors.response.use(res => res.data, e => {
  return Promise.reject(e)
})

export default http
```

### 测试使用

1. 导入封装好的封装
2. 使用封装好的 axios 设置接口函数并导出
3. 在 main.js 中使用

```js
// api/index.js
import http from '@/utils/http'

export const test = () => {
  return http({
    url: 'home/category/head'
  })
}
```

```js
// main.js
import {test} from '@api/index'
test().then(res => {
  console.log(res);
})
```

## 配置路由

路由设计原则：找页面的切换方式，如果是整体切换，则为一级路由，如果是在一级路由的内部进行的内容切换，则为二级路由

### 一级路由

首页和登录页为一级路由，特征为 `/` 

> 注意
>
> 此时新增组件时 `eslint` 会报错，在 `.eslintrc.cjs` 文件添加以下代码取消强制要求重命名即可。
>
> ```js
> module.exports = {
>     //...
>     rules: {
>         'vue/multi-word-component-name': 0
>     }
> }
> ```

### 二级路由

在一级路由内部切换则为二级路由。创建相应模块，并在 `Layout/index.vue` 组件中配置二级路由的入口。

### 整体代码

```js
// createRouter：创建router实例对象
// createWebHistory：创建history模式的路由
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/index.vue'
import Layout from '@/views/Layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // path和component对应关系的位置
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          component: () => import('@/views/Home/index.vue')
        },
        {
          path: '/category',
          component: () => import('@/views/Category/index.vue')
        }
      ]
    },
    {
      path: '/login',
      component: Login,
    },
  ],
})

export default router
```

### 总结

1. 路由设计的依据是？

   内容切换的方式

2. 默认二级路由如何进行配置

   path 置空即可

## 静态资源引入

引入图片资源到 `assets/images` 文件夹内；引入公共初始化样式 `common.scss` 文件到 `styles` 文件夹内。

## 自动导入公共样式

部分公共色值如果多个页面要使用，则都要做以下步骤：

```vue
<style lang="scss">
import "~@/var.scss"
</style>
```

这样显得步骤很繁琐，因此通过 `vite.config.js` 公共导入会显得很简单，代码如下：

```js
export default defineConfig({
  // ...
  css: {
    preprocessorOptions: {
      scss: {
        // 自动导入定制化样式文件进行样式覆盖
        additionalData: `
          @use "@/styles/element/index.scss" as *;
          @use "@/styles/var.scss" as *;
        `,
      }
    }
  }
})
```

