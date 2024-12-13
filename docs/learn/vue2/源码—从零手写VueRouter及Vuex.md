# 从零手写VueRouter及Vuex

## VueRouter

在一个 Vue 的项目中，入口文件 `main.js` 中负责渲染组件和引入路由，代码如下所示：

```js
import Vue from 'vue' // 这里用的vue是runtime，不包含compiler
import App from './App.vue'
import router from './router' // 前端路由

new Vue({
    router,
    render: h => h(App) // 渲染组件，内部_c 发现是对象的话会调用组件的render方法进行渲染。如果在这里写template会报错，因为不包含compiler
}).$mount('#app')
```

在 `router/index.js` 文件中会有这么一段代码：

```js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

VueRouter 会调用插件的 `install` 方法。最后导出一个路由实例，在入口文件中传到 `new Vue` 对象内。

路由既有前端路由，也有后端路由。后端路由在提交一个表单元素时，服务端会根据提交内容，校验提交结果，最终在服务端发生跳转。此时前端会有很多 `html` ，后端判断结果跳转不同的 `html` 。主要针对前后端不分离的项目。

前端路由指跳转不由后端控制，而是由前端控制，如 `router.push` 跳转。根据路径不同，渲染不同组件，不经过服务端，也不会刷新页面。前端路由分两种形式：

1. `hash` 模式，根据哈希值的不同，渲染不同的组件内容。通过 `window.addEventListener('popstate / hashchange')` 可以监控到 `hash` 值的变化。

   哈希模式的路由缺点其一是丑，所有路径都有 `#` 锚点；其二是服务端无法获取锚点，无法根据对应的路径来解析内容，因此无法做 SEO 优化。

2. `history` 模式，是 H5 提供的 API ，路径上没有 `#` 锚点。可以改变路径，同时强制刷新的时候，会带上路径，服务端可以解析此路径。历史模式第一次加载页面会做 SEO 优化，需要配合 SSR，后续页面基于 `historyAPI` 跳转即可。

> 题外话
>
> Node 中没有前端 `url` 地址，因此内部采用的是 `memeryHistory` 。通过 `node` + `vue` 实现路由跳转。（服务端渲染能用到）

### install 方法

现在尝试写一个 VueRouter ，新建一个 `js` 文件，创建一个类，并全部导出。代码如下：

```js
class VueRouter {
    
}

export default VueRouter
```

注释掉原来引入的 `vue-router` 路由，引入手写的文件，刷新后页面报错，报错信息如下所示；

![报错](https://pic.imgdb.cn/item/65464884c458853aefaf56ff.jpg)

`Vue.use()` 方法内如果放一个函数，默认会执行，因此如果把一个类放进去则会报错。解决方法为在类中设置一个 `install` 方法，代码如下：

```js
class VueRouter {
    
}

// 如果用户导出一个类，在类上写一个install方法，会调用该方法
VueRouter.install = function(Vue) {
    console.log('install')
}

export default VueRouter
```

因为 VueRouter 会调用插件的 `install` 方法。在源码中，它会去判断是否有 `nstall` 方法，如果有则调用，没有才执行函数。

方法 `install` 会拿到 Vue 构造函数，为了能够每个文件都可使用，在 `install` 方法中保存到全局属性上。代码如下：

```js
export let Vue
class VueRouter {
    constructor(options) {
        let routes = options.routes
    }
}

// 如果用户导出一个类，在类上写一个install方法，会调用该方法
VueRouter.install = function(_Vue) {
    Vue = _Vue // 将传入的Vue的构造函数变为全局的
    console.log('install')
}

export default VueRouter
```

在创建路由表时，前端代码如下：

```js
const routes = [
    {
        path: '/',
        component: import() => './home.vue',
        children: [
        	{
        		path: 'a',
        		component: {
        			render: (h) => h('<div>a</div>')
    			}
    		}
        ]
    },
    {
        path: '/about',
        component: import() => './about.vue',
        children: [
        	{
        		path: 'a',
        		component: {
        			render: (h) => h('<div>about a</div>')
    			}
    		}
        ]
    }
]
```

在源码中，需要把这个路由表格式化为一个一一对应的映射表，如：

```js
{'/':Home, '/a':HomeA, '/about': About, '/about/a': AboutA}
```

还需要把根实例注入的 `router` 属性共享给每一个组件，让每一个组件都能通过 `this.$router` 获取到路由对象。

可能会有人第一时间想到原型，把 `$router` 方法挂载到原型上。但是需要考虑以下的情况：

```js
new Vue({
    router,
    render: h => h(App)
})
new Vue({
    render: h => h(App)
})
```

只有通过 `new Vue` 中传入了 `router` 才能被共享，因此原型的方法不可取。

利用 `mixin` 方法，在生命周期 `beforeCreate` 中传递 `router` ，所有组件初始化都会采用该方法，会先渲染该 `mixin` 方法，后渲染组件的方法。说明组件渲染是从父到子的。

然后通过劫持，在实例上取值的时候，会拿到 `_router` 属性。代码如下：

```js
VueRouter.install = function(_Vue) {
    Vue = _Vue
    
    Vue.mixin({
        beforeCreate() {
            // 组件渲染从父 _router 到子
            if(this.$options.router) {
                // 如果有router，说明是根实例且传递了router。此时 this 指向根实例
                this._routerRoot = this
                this._router = this.$options.router
            } else {
                // 没有说明是子组件，从父组件拿router，所有组件上增加一个 _routerRoot 指向根实例
                this._routerRoot = this.$parent && this.$parent._routerRoot
            }
            
            // 在组件中都可以通过 this 属性获取到 _router 属性
            Object.defineProperty(Vue.prototype, '$router', {
                // 为了取值方便，做一层代理。后面无需通过 this.$options._router 获取
                get() {
                    return this._routerRoot && this._routerRoot._router
                }
            })
        }
    })
}
```

> 答疑解惑
>
> 1. 可不可以不用这么麻烦，直接在 `beforeCreate` 钩子上写 `this.$router = this.$options?.router` ？
>
>    不可以，如果这么写意思就变为 “当前 `this` 指向的如果有 `router` 才加，没有就不加。后果是只有根实例 `new Vue` 有 `router` 。
>
> 2. 可不可以不代理，直接 `this.$router = this.$options?.router` ？
>
>    可以，但是这样每次都会给 `this.$router` 重新赋值。不如代理。

此时查看控制台，报错，提示没有 `router-link` 和 `router-view` 方法，需要一一设置，底层原理是通过 `Vue.component` 配置为组件，其中：

1. `router-link` 先通过插槽最终把标签的内容渲染到 `a` 标签上。
2. `router-view` 先渲染一个空的 `div` 。

代码如下所示：

```jsx
VueRouter.install = function(_Vue) {
    // ...
    
    // react 中叫children；vue中所有的插槽会被变道 vm.$slots 对象上
    Vue.component('router-link', {
        render() {
            return <a>{this.$slots.default}</a>
        }
    })
    Vue.component('router-view', {
        render() {
            return <div></div>
        }
    })
}
```

### 跳转逻辑

#### 路由表扁平化

现在该把路由表扁平化存储了，变成映射表，方便后续的匹配操作，可以匹配也可以添加新的路由。在 VueRouter 类的 `constructor` 构造器中书写相应的逻辑，步骤如下：

1. 定一个方法 `createMatcher()` ，用于调用扁平化路由表的函数，返回路由相关的方法，把获取到的路由表数组传参进去
2. 方法 `createMatcher()` 需要返回一个对象，包含 `addRoutes` 、`addRoute` 和 `match` 三个方法，因此需要定义这三个函数方法并 `return` 返回。它们分别用于：
   - `addRoutes` 添加路由（多个路由）
   - `addRoute` 添加路由（单个路由）
   - `match` 给一个路径，返回对应的路由
3. 定义一个方法 `createRouteMap()` ，用于扁平化路由表，并最终返回一个映射表对象。其中：
   1. 创建一个空对象 `pathMap` ，后续存放路由与组件映射关系。循环遍历路由表数组
   2. 由于要递归子数组，因此封装一个方法复用更方便，定义一个 `addRouteRecord()` 方法，把当前路由对象和 `pathMap` 作为参数传过去
   3. 获取当前路由的 `path` 对象，如果没有，则说明还没存过，则往其内部存放路径对应属性；有则说明已经存了
   4. 判断其是否有子数组，如果有则遍历其子路由数组，调用 `addRouteRecord()` 方法

做完上述这些操作还不够，打印出来发现它有两个问题：

1. 子组件没有关联父组件
2. 子组件名字相同会被忽略（主要还是第一个问题的原因）

因此需要修改上述的 BUG，在 `addRouteRecord()` 方法中修改获取 `path` 的逻辑，不再是之间获取路径，而是判断是否有父路由组件，如果有则拼接，没有才直接获取。

#### 路由添加方法

接下来实现添加路由的方法，用户调用 `addRoutes` 或 `addRoute` 方法时会传入相对应的路由表数组，因此分别调用 `createRouteMap` 方法即可。

```js
// 扁平化路由信息
function createRouteMap(routes, pathMap) {
    // 最终返回的映射表对象，如果用户传入则使用用户传的，用户没传说明第一次创建，赋值空对象
    pathMap = pathMap || {}
    
    // 遍历数组
    routes.forEach(route => {
        addRouteRecord(route, pathMap)
    })
    
    return pathMap
}

function addRouteRecord(route, pathMap, parentRecord) {
    // 判断是否有父组件路由，如果有判断是否是 / ，如果是则只使用一个 / 进行拼接，避免 //a 的情况
    let path = parentRecord ? `${parentRecord.path === '/' ? '/' : `${parentRecord.path}/`}` : route.path
    let record = {
        path,
        component: route.component,
        props: route.props,
        meta: route.meta
    }
    
    // 看看它有没有被存过
    if(!pathMap[path]) {
        // 维护路径对应信息，如组件、元信息等
        pathMap[path] = record
    }
    
    // 如果有子路由数组，则遍历递归调用 addRouteRecord 方法
    route.children && route.children.forEach(childRoute => {
        // 把当前的父组件路由信息record传过去
        addRouteRecord(childRoute, pathMap, record)
    })
}

function createMatcher(routes) {
    // 映射关系处理
    let { pathMap } = createRouteMap(routes)
    
    // 路由匹配与路由添加的方法
    function addRoutes(routes) {
        createRouteMap(routes, pathMap)
    }
    function addRoute(route) {
        createRouteMap([route], pathMap)
    }
    function match() {}
    
    return {
        addRoutes, // 添加路由（多个路由）
        addRoute, // 添加路由（单个路由）
        match // 给一个路径，返回对应的路由
    }
}

class VueRouter {
    constructor(options) {
        // 用户传递的路由表数组，需要进行映射表处理
        let routes = options.routes || []
        
        // 封装并调用方法做映射表扁平化处理，并实现可以匹配也可以添加新路由
        this.matcher = createMatcher(routes)
        
    }
}
```

> 注意
>
> 此时 `createRouteMap` 方法有两个用处：
>
> 1. 刚开始时路由表为空，用于扁平化路由表
> 2. 调用添加路由方法，往路由表内添加路由

#### 不同路由模式创建对应路由系统

获取到用户用的路由模式，分别调用不同的路由系统，并设置路由初始化和调用路由的 `match` 方法获取路径对应的组件映射。代码如下所示：

```js
class VueRouter {
    constructor(options) {
        // 用户传递的路由表数组，需要进行映射表处理
        let routes = options.routes || []
        
        // 封装并调用方法做映射表扁平化处理，并实现可以匹配也可以添加新路由
        this.matcher = createMatcher(routes)
        
        // 判断用户使用哪种路由模式，默认hash模式
        let mode = options.mode || 'hash'
        if(mode === 'hash') {
            this.history = new HashHistory(this)
        } else {
            this.history = new BrowserHistory(this)
        }
    }
    
    init(app) {
        let history = this.history
        // 监听路由变化，并匹配对应的组件来进行渲染，更新视图
        history.transitionTo(history.getCurrentLocation(), () => {
            // 跳转后再监听路由变化
            history.setupListener()
        })
    }
    
    // 调用路由的match方法
    match(location) {
        return this.router.match(location)
    }
}
```

现在都是在做映射关系，没有做初始化。而初始化的方法只需要调用一次，放到最开始 `install` 中，判断是否为跟路由处调用，这样就能实现初始化。代码如下：

```js
VueRouter.install = function(_Vue) {
    Vue = _Vue
    
    Vue.mixin({
        beforeCreate() {
            if(this.$options.router) {
                this._routerRoot = this
                this._router = this.$options.router
                
                this._router.init(this) // this指的是整个应用
            }
            
            // ...
        }
    })
}
```

下面依次书写两个路由模式类对应的代码：

- 基础代码

  两个路由模式的部分逻辑是一样的，如来自哪个路由路径、路由跳转、路由对应的组件等，因此把它们都抽离出来，然后让两个路由模式类继承。代码如下：

  ```js
  class Base {
      constructor(router) {
          this.router = router
      }
      
      // 路由跳转。参数一为要跳转的路径，参数二为监听的回调
      transitionTo(location, listener) {
          // 获取映射表上对应的路由与其组件
          let record = this.router.match(location)
          
          // 路由切换时也调用该方法，再次拿到新记录
          
          
          listener && listener()
      }
  }
  
  export default Base
  ```

  把路由放到 `this` 上，这样历史模式和哈希模式都可以拿到。

- 哈希模式

  首先需要判断它有没有哈希路径，如果有则不用做处理，没有则需要加上哈希路径。

  ```js
  import Base from './base'
  class HashHistory extends Base {
      constructor(router) {
          super(router)
          
          // 初始化hash路由时候，要给定一个默认哈希路径
          ensureSlash()
      }
      
      // 稍后调用此方法，监控hash路径的变化
      setupListener() {
          window.addEventListener('hashchange', function() {
              // hash值发生变化则获取新的hash值
              getHash()
          })
      }
      
      // 获取要跳转的路径
      getCurrentLocation() {
          return getHash()
      }
  }
  
  function ensureSlash() {
      if(window.location.hash) {
          return
      }
      window.location.hash = '/'
  }
  
  function getHash() {
      return window.location.hash.slice(1)
  }
  ```

- 历史模式

  ```js
  import Base from './base'
  class BrowerHistory extends Base {
      constructor(router) {
          super(router)
      }
      // 稍后调用此方法，监控history路径的变化
      setupListener() {
          window.addEventListener('popstate', function() {
              // history值发生变化则获取新的history值
              getHash()
          })
      }
      
      // 获取要跳转的路径
      getCurrentLocation() {
          return window.location.pathname
      }
  }
  ```

#### 跳转逻辑

回到 `router-link` 的组件注册模块，实现路由跳转逻辑。

在原来的代码基础上为它添加一个 `to` 方法，用于跳转；添加一个 `tag` ，用于设置其标签，默认是 `a` 。

```jsx
Vue.component('router-link', {
    props: {
        // to必传
        to: {type: String, required: true},
        tag: {type: String,default: 'a'}
    },
    methods: {
        handler() {
            // 去哪里调用push方法把路径传过去即可
            this.$router.push(this.to)
        }
    },
    render() {
        let tag = this.tag
        return <tag onClick={this.handler}>{this.$slots.default}</tag>
    }
})
```

VueRouter 类中注册一个 `push` 方法，用于跳转路由。

```js
class VueRouter {
    // ...
    push(location) {
        this.history.transitionTo(location)
    }
}
```

此时跳转逻辑已经初步写完了，后续所有逻辑都需要写在方法 `transitionTo` 内。然后跳转后页面的渲染逻辑放到 `router-view` 内。

注意一点，路由 `/about/a` 实际上是路由 `/about` 加上 `/a` ，一级路由渲染 `/about` 的内容，二级路由渲染 `/a` 的内容。

### 响应式原理

#### 路径响应式变化

做到这里点击路由可以在 `transitionTo()` 方法内监听到路由的变化，并且能够获取到当前跳转到哪个路由。但是浏览器的路径并没有响应式变化。因此需要在 VueRouter 类的 `push`  方法做处理。代码如下：

```js
class VueRouter {
    // ...
    push(location) {
        this.history.transitionTo(location, () => {
            window.location.hash = location
        })
    }
}
```

> 注意
>
> 这里不能直接写死，因为还要考虑历史模式的路由，因此后续还需要修改。先暂时这么写实现功能。

添加该监听事件后点击路由可以响应式修改路径，但这里还有一个 BUG：它无法监听到路径的前进和后退，如下图所示：

![无法监听](https://pic.imgdb.cn/item/6559b97dc458853aef4b9c45.gif)

因此还需要去到 `hash` 路由对应的类，在其 `setupListener()` 方法上也添加一个 Hash 值变化的事件，触发事件后跳转路由。代码如下：

```js
import Base from './base'
class HashHistory extends Base {
    // ...
    
    // 稍后调用此方法，监控hash路径的变化
    setupListener() {
        window.addEventListener('hashchange', function() {
            // hash值发生变化则获取新的hash值
            this.transitionTo(getHash())
        })
    }
}

//...
```

不过现在会有一个小 BUG：由于两个地方都添加了 Hash 值变化监听事件，导致触发改变后 `transitionTo()` 方法会调用两次。处理方法也很简单，做个判断即可。

#### 组件查找

如果访问的是 `/about/a` ，实际上是访问两个组件，先访问 `/about` ，把组件渲染到一级 `router-view` ；然后再访问 `/a` ，把组件放到二级 `router-view` 。

在父类 `Base` 中创建一个对象 `current` ，用于保存当前的路由 `path` 和对象的组件数组 `match` 。通过给方法 `createRoute()` 传参，接收其返回值。代码如下：

```js
function createRoute(record, location) {
    let matched = [];
    if(record) {
        // 不停去父级找
        while(record) {
            // 父级要放在最前面
            matched.unshift(record)
            record = record.parent
        }
    }
    
    return {
        ...location,
        matched
    }
}

class Base {
    constructure(router) {
        this.router = router
        this.current = createRoute(null, {
            path: '/'
        })
    }
    
    transitionTo(location, listener) {
        let record = this.router.match(location)
        let route = createRoute(record, {
            path: location
        })
        // 如果路由路径相同，且新旧的组件数组matched长度也相等，表示同一个路径跳转，返回
        if(location === this.current.path && route.match.length === this.current.matched.length) {
            return
        }
        // 每次更新的都是current，稍后current变化了，就切换页面显示
        this.current = route
        
        // ...
    }
}
```

默认 `path` 传基准路径 `/` ，路由切换触发 `transitionTo` 方法后再调用 `createRoute` 方法把当前的路由传过去获取对应组件数组。

做一个优化，避免跳转同一个路径重复匹配。判断条件为新旧的路径 `path` 相等，且新旧组件匹配的数组 `matched` 长度相等，都相等说明新旧是同一个路由。此时不做操作。

#### 组件路由实例响应式

给根实例添加一个属性 `_route` ，即当前的 `current` 。在组件中可以获取到当前组件的路由属性。在 `install` 方法的 `beforeCreate()` 钩子上挂载，代码如下：

```js
function install() {
    Vue.mixin({
        beforeCreate() {
            if(this.$options.router) {
                // ...
                Vue.util.defineReactive(this, '_route', this._router._route)
            }
        }
    })
    
    Object.defineProperty(Vue,prototype, '$route', {
        get() {
            return this._routerRoot && this.__routerRoot.history.current
        }
    })
}
```

但是在页面中打印 `$route` 时，切换路由页面的内容也没有变化。明明前面已经变为响应式了。这是为什么呢？

在代码里，`route` 代理了 `current` ，此时他们指向同一个对象地址；路由切换后改变的是 `current` 对象，此时 `current` 指向新的对象地址，而 `route` 没变。因此需要改变 `route` 。

在两个路由模式的父类 `Base` 定义一个 `listen` 方法：

```js
class Base {
    // ...
    listen(cb) {
        this.cb = cb
    }
    
    transitionTo() {
        // ...
        this.cb && this.cb(route)
    }
}
```

在 VueRouter 类中的 `init` 方法调用，每次路由切换后把新的 `current` 数据传过去，实现更新，代码如下：

```js
class VueRouter {
    // ...
    init(app) {
        let history = this.history
        history.transitionTo(history.getCurrentLocation(), () => {
            history.setupListener() // 监听路由的变化
        })
        
        // 每次路由切换都需要调用listen方法中的回调函数，更新_route的值，使它能自动渲染视图
        history.listen(newRoute => {
            app._route = newRoute
        })
    }
}
```

#### router-view组件

新建一个 `js` 文件，导出一个对象，用于配置 `router-view` 组件的配置项。

组件渲染流程为：

- 默认先渲染根组件 `App.vue` 中的一级路由 `router-view` 
- 再渲染对应组件中的二级路由 `router-view` 

接收两个参数，获取到 `$route` ，定义一个变量用于控制层级（即 `matched` 数组的索引，默认为0）。

```js
export default {
    functional: true,
    render(h, {parent, data}) {
        let route = parent.$route
        let depth = 0
        
        while(parent) {
            // _vnode对应的是组件的渲染函数中虚拟节点，$vnode代表的是home组件本身。$vnode是_vnode本身
            if(parent.$vnode && parent.$vnode.data.routerView) {
                depth++
            }
                
                parent = parent.$parent
        }
        
        let record = route.matched[depth]
        if(!record) {
           return h()
        }
        
        return h(record.component, data)
    }
}
```

### 路由钩子

路由守卫使用如下：

```js
router.beforeEach((from, to, next) => {
    next()
})
```

在类 VueRouter 中定义一个方法 `beforeEach()` ，调用该方法则往一个数组内追加，后续依次执行。代码如下：

```js
class VueRouter {
    constructure() {
        // ...
        this.beforeEachHooks = []
    }
    // ...
    beforeEach(cb) {
        this.beforeEachHooks.push(cb)
    }
}
```

去到 `Base` 类中，定义一个变量 `queue` ，代码如下：

```js
function runQueue(queue, cb) {
    function next(index) {
        if(queue.length < index) return cb()
        
        let hook = queue[index]
        hook(from, to, () => next(index+1))
    }
    next(0)
}

class Base {
    // ...
    transitionTo() {
        // ...
        let queue = [].cancat(this.router.beforeEachHooks)
        runQueue(queue, () => {
            listener && listener()
            this.cb && this.cb(route)
        })
    }
}
```



### 总结

1. 路由的 `install` 方法就做了一件事情，把 `beforeCreate` 通过 `mixin` 混入，在根实例上保存根组件，其子路由不断找其父亲，获取根组件。

   这样子组件可以通过点 `_routerRoot` 获取到根组件。然后通过 `Object.defineProperty` 代理，放到原型上。后续可直接 `this.$router` 获取。

   也就是把 `router` 共享出去。

2. 组件 `router-link` 负责跳转路由。创建该组件的原因是路由切换有两种模式，通过封装，无需考虑如何跳转，

   只需要传两个参数：跳转到哪个路由，和该 HTML 的标签（默认 `a` 链接）即可。

3. 组件 `router-view` 用于渲染路由组件。原理是在切换路由时把当前路由从父组件到子组件一一匹配放到数组 `matched` 中，于其路径 `path` 一一对应。在 `router-view` 中通过循环与下标索引一一获取，调用 `h()` 方法渲染。