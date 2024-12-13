# 登录

## 持久化

插件官网指路：[pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/why.html)

### 实现

首先下载插件：

```js
yarn add pinia-plugin-persistedstate
```

然后在入口文件中导入并注册持久化插件

```js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

pinia.use(piniaPluginPersistedstate)
```

然后返回 `store` 中使用，使用方式为在 `defineStore` 方法中传入第三个参数，如下：

```js
export const useUserStore = defineStore('user', () => {
  // ...
}, {
  persist: true
})
```

### 原理

插件会在开启本地存储需求后帮我们把`state` 数据实时保存到本地中。因此无论是新值、修改还是删除，本地中都是最新的数据存储。

## token请求头

把 `token` 保存在 `pinia` 中有利于多个页面使用数据，如首页个人信息动态渲染，又如请求拦截器封装中把 `token` 放到请求头上。

```js
// axios请求拦截器
http.interceptors.request.use(config => {
  const { userinfo } = useUserStore()
  // 获取token
  const token = userinfo.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, e => Promise.reject(e))
```

## 401、403状态

当 `token` 过期或未登录没有 `token` 时，需要做以下处理：

1. 清空本地存储与 `pinia` 状态管理中的信息
2. 跳转到登录页

```js
// axios响应式拦截器
http.interceptors.response.use(res => res.data, e => {
  ElMessage({ type: 'error', message: e.response.data.message })
  
  // 401错误处理
  if(e.response.status === '401' || e.response.status === '403') {
    const { logoutFn } = useUserStore()
    logoutFn()
    useRouter.replace({path: '/login'})
  }

  return Promise.reject(e)
})
```

