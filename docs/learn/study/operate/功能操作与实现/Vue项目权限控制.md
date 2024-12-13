# Vue项目权限控制

## 后端返回路由规则 ※

后端返回权限控制步骤一般为：

1. 用户登录
2. 根据用户 `userid` 获取对应菜单
3. 规则化格式（根据数据生成合适的路由规则）
4. 添加动态路由（使用 `addRoute` ）
5. 记录 `state` 

### 登录获取，格式化数组

新建一个 `perssion.js` 文件，用于动态设置路由规则。

获取后端返回的路由数据并格式化。因为后端返回的数据最全面的也是一个数组对象，每一项包含 `name` 、`path` 与 `component` ，值都是字符串。而前端路由 `component` 是需要 `important()` ，因此需要格式化。

- 首先调用接口获取数据
- 遍历返回的数据数组，格式化 `component` 
- 动态添加到 `router` 内

```js
let routeArr = []
function parseRoute(arr) {
    // 返回一个 Promise，后续异步获取数据
    return new Promise((resolve) => {
        	arr.forEach(item => {
            	let newItem = Object.assign({}, item)
            	let str = item.component
            	newItem.component = () => {
                	// return require([`@/views${str}`])
                	return import(`@/views${str}`)
            	}
            	routeArr.push(newItem)
        	})
        return routeArr
	})
}

if(如果有用户id) {
    // 把数据保存到state中
    axios.get('接口').then(res => {
    	let newArr = parseRoute(res.data.data)
        commit('SET_ROUTES', newArr)
   	})
}
```

> **注意：**
>
> 1. 格式化 `component` 时不能先赋值给字符串变量，再放进去，如：
>
>    ```js
>    let str = `@/views${item}`
>    return import(str)
>    ```
>
>    这样会报错。
>
> 2. 低版本不能使用 `import` 时，可以使用 `require` 返回，如：
>
>    ```js
>    return require([`@/views${str}`])
>    ```
>
> 3. 格式化时必须要 `@/views` 拼接，不能后端返回 `/views/page` ，前端直接采取下面的方式引入：
>
>    ```js
>    return import(`@${str}`)
>    ```
>
>    这样会报错。

### 导航守卫，动态添加

```js
const routerArr = store.state.login.routerArr

router.beforeEach(async (to, from, next) => {
    const token = Cookies.get('token')
    if(token) {
        if(to.path === '/login') {
            next('/')
        } else {
            // 判断是否发请求获取路由规则
            if(routerArr.length == 0) {
                // 没有，掉请求
                const _routerArr = await store.dispatch('getRouter')
                
                _routerArr.forEach(item => {
                    router.addRoute(item)
                })
                
                next(to.path) // 继续跳转
            } else {
                // 有了，判断当前用户是否有该路由的权限
                if(to.matched.length !== 0) {
                    next() // 有直接跳转
                } else {
                    next(from.path) // 没有返回来的页面
                }
            }
        }
    } else {
        // 未登录，判断是否在白名单内
        if(whileList.indexOf(to.path) !== -1) {
            next() // 在白名单内，可以访问
        } else {
            next('/login') // 不在白名单内，返回登录页
        }
    }
})
```

> 注意：
>
> 老版本可以使用 `addRoutes()` ，放入路由数组；新版已经弃用，只能使用 `addRoute()` ，放入单个路由对象，因此需要使用数组遍历的形式。
>
> ```js
> let arr = [
>     {
>         name: 'page',
>         path: '/page',
>         component: () => import('')
>     }
> ]
> 
> arr.forEach(item => {
>     router.addRoute(item)
> })
> ```

### 重置路由

路由守卫中我们获取了路由规则来判断是否有路由规则，如果有则不再去调接口获取新的规则，因此如果用户登出再登录其他账号，会导致路由规则还是旧的路由规则。

解决方法：路由规则保存在 `vuex` 内，用户调用登出接口或触发登出按钮点击事件时把 `vuex` 内的路由规则数组置空，把路由规则改为旧的路由状态即可。

```js
export function resetRoute() {
    const newRouter = new VueRouter({
        routes: initRoutes
    })
    router.matcher = newRouter.matcher
}
```

### 总结

- 判断用户是否登录，未登录，判断用户要前往的页面是否再白名单内，在则跳转，不在则去往登录页。
- 用户已登录后判断是否调用获取权限的接口获取数据，如果已有，则直接判断要前往的路由是否有权限，有就跳转，没有则提示无权限，回到上一页。
- 如果没调接口获取数据，则调用 `store` 内的 `action` 函数获取数据，返回一个 `Promise` 对象，通过 `addRoute` 动态添加路由
- 用户登出时清空本地存储与 `vuex` 内保存的数据数组，再获取最新状态的路由重新设置路由权限。

## 按钮权限

获取用户的按钮权限数组，例如：

```js
getCode() {
    // ['BUY', 'SALE']
}
```

页面中获取 `state` 保存的权限，判断是否存在即可。

## 前端控制

前端如果在后端没有配置时，可以在路由数组内通过 `meta` 属性写死，例如：

```js
const initRoutes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/home'),
        meta: {
        	whileList: ['admin','test01']
    	}
    }
]
```

在前置守卫中通过 `to.meta.whileList.includes()` 判断当前用户是否有该权限即可。