---
title 优医问诊
---

# 项目初始化

项目搭建可参考项目仓库 `READMe.md` 文档。这里不做过多赘述。下面从以下几步细说项目搭建完毕后的方法封装。

## 移动端适配

1. 下载插件
   
   ```bash
    pnpm add -D postcss-px-to-viewport
   ```
2. 配置： postcss.config.js
   
   ```js
    // eslint-disable-next-line no-undef
    module.exports = {
        plugins: {
            'postcss-px-to-viewport': {
            // 设备宽度375计算vw的值
            viewportWidth: 375,
            },
        },
    };
   ```

> 注意
>
> 在配置的时候项目报错，报错信息如下所示：
>
> ```bash
> node:internal/process/promises:279
>             triggerUncaughtException(err, true /* fromPromise */);
>             ^
> 
> [Failed to load PostCSS config: Failed to load PostCSS config (searchPath: /Users/WH/Desktop/hei/vue-project): [ReferenceError] module is not defined in ES module scope
> This file is being treated as an ES module because it has a '.js' file extension and '/Users/WH/Desktop/hei/vue-project/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
> ReferenceError: module is not defined in ES module scope
> This file is being treated as an ES module because it has a '.js' file extension and '/Users/WH/Desktop/hei/vue-project/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
>     at file:///Users/WH/Desktop/hei/vue-project/postcss.config.js:2:1
>     at ModuleJob.run (node:internal/modules/esm/module_job:193:25)
>     at async Promise.all (index 0)
>     at async ESMLoader.import (node:internal/modules/esm/loader:530:24)
>     at async importDefault (file:///Users/WH/Desktop/hei/vue-project/node_modules/.pnpm/vite@5.0.10_@types+node@18.19.3_sass@1.69.6/node_modules/vite/dist/node/chunks/dep-R0I0XnyH.js:37502:18)
>     at async Object.search (file:///Users/WH/Desktop/hei/vue-project/node_modules/.pnpm/vite@5.0.10_@types+node@18.19.3_sass@1.69.6/node_modules/vite/dist/node/chunks/dep-R0I0XnyH.js:29758:42)]
>  ELIFECYCLE  Command failed with exit code 1.
> ```
>
> 这个错误提示表明在加载 PostCSS 配置时出现了问题。根据错误信息，看起来是因为你的项目被视为 ES 模块进行处理，而在这种情况下，"module" 是不被定义的。
>
> 解决这个问题的方法是将文件后缀名从 ".js" 改为 ".cjs"，或者修改 package.json 文件中的 "type" 字段为 "commonjs"。这样可以将项目以 CommonJS 脚本的方式进行处理，避免上述错误。

## 拦截器封装

拦截器封装可以在拦截器的函数上直接写逻辑，但是为了巩固函数单一，后续维护方便，故此把相关联的方法抽离出来，放到一个对象上，分别保存成功和失败两个属性。代码如下：

拦截器：

```js
import axios, { AxiosError, type Method } from 'axios'
import { headerToken, rejectCode } from './token'

export const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({
    // 基础地址，超时时间
    baseURL,
    timeout: 10000
})

// 请求头封装
instance.interceptors.request.use(
    headerToken.onFulfilled,
    headerToken.onRejected
)

// 响应状态码封装
instance.interceptors.response.use(
    rejectCode.onFulfilled,
    rejectCode.onRejected
)
```

对象方法函数：

```js
import { useUserStore } from '@/stores/index'
import { showToast } from 'vant'
import router from '@/router'

// 请求头添加
export const headerToken = {
    onFulfilled: (res: any) => {
        const store = useUserStore();
        if (store.user?.token && res.headers) {
            res.headers['Authorization'] = `Bearer ${store.user?.token}`
        }
        return res
    },
    onRejected: (err: any) => Promise.reject(err),
}

// 响应状态处理
export const rejectCode = {
    onFulfilled: (res: any) => {
        // 后台约定，响应成功，但是code不是10000，是业务逻辑失败
        if (res.data?.code !== 10000) {
            showToast(res.data?.message || '业务失败')
            return Promise.reject(res.data)
        }
        // 业务逻辑成功，返回响应数据，作为axios成功的结果
        return res.data
    },
    onRejected: (err: any) => {
        if (err.response.status === 401) {
            // 删除用户信息
            const store = useUserStore()
            store.delUser()
            // 跳转登录，带上接口失效所在页面的地址，登录完成后回跳使用
            router.push({
                path: '/login',
                query: { returnUrl: router.currentRoute.value.fullPath }
            })
        }
        return Promise.reject(err)
    },
}
```

## 工具函数封装

导出一个封装好的函数，能够自定义响应数据的类型。分两步实现：

第一步，封装一个工具函数。封装的时候需要考虑到请求路径、请求方式和请求传参以及他们的类型定义，如果是 `get` 请求，请求的参数是 `params` 传参；如果是 `post` 请求，则通过 `data` 传参。

代码如下：

```js
import axios, { AxiosError, type Method } from 'axios'

// 4. 请求工具函数
const request = (url: string, method: Method = 'GET', submitData?: object) => {
  return instance.request({
    url,
    method,
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: submitData
  })
}
```

第二步：类型定义。通过范型定义接口返回的值的类型。代码如下所示：

```js
type Data<T> = {
  code: number
  message: string
  data: T
}

const request = <T>(url: string, method: Method = 'get', submitData?: object) => {
  return instance.request<T, Data<T>>({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
```

其中，这里的 `<T, Data<T>>` 是泛型类型参数，用于在函数调用时指定具体的类型。

具体来说，`<T>` 表示当前请求返回的数据类型，比如一个接口返回的数据是一个 `User` 对象，则 `T` 可以指定为 `User`。而 `Data<T>` 则表示该接口返回的数据结构，包含了 `code`、`message` 和 `data` 三个属性，其中 `data` 属性的类型为 `T`，也就是上一步中指定的数据类型。这样定义的好处是可以更加灵活地处理接口返回的数据结构。
