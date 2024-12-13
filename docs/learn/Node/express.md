# Express

## 简介

官方给出的概念：Express 是基于 Node.js 平台，快速、开放、极简的 Web 开发框架。
通俗的理解：Express 的作用和 Node.js 内置的 http 模块类似，是专门用来创建 Web 服务器的。

Express 的本质：就是一个 npm 上的第三方包，提供了快速创建 Web 服务器的便捷方法。
Express 的中文官网： http://www.expressjs.com.cn/

对于前端程序员来说，最常见的两种服务器，分别是：

- Web 网站服务器：专门对外提供 Web 网页资源的服务器。
- API 接口服务器：专门对外提供 API 接口的服务器。

使用 Express，我们可以方便、快速的创建 Web 网站的服务器或 API 接口的服务器。

## 使用

### 安装

命令如下：

```sh
npm i express@版本
```

### 创建服务器

1. 导入express
2. 创建wen服务器
3. 调用.listen(端口号，启动成功后的回调函数)，启动服务器

```js
const express = require('express')

const app = express()

app.listen(80, () => {
  console.log('runing');
})
```

### 监听请求

通过 `app.get()` 方法，可以监听客户端的 `GET` 请求，具体的语法格式如下：

```js
app.get('请求url', function(req,res) {})
```

- 参数1：客户端请求的url地址
- 参数2：请求对应的处理函数
  - req：请求对象，包含与请求有关的属性与方法
  - res：响应对象，包含与响应有关的属性与方法

通过 `app.post()` 方法，可以监听客户端的 `POST` 请求，具体的语法格式如下：

```
app.post('请求url', function(req,res) {})
```

### 响应

通过 res.send() 方法，可以把处理好的内容，发送给客户端：

```js
app.get('/user', (req, res) => {
	res.send({username: 'tydumpling', age: 23})
})

app.post('/add', (req, res) => {
	res.send('添加成功')
})
```

### 获取参数

- 获取查询参数

  通过 req.query 对象，可以访问到客户端通过查询字符串的形式，发送到服务器的参数：

  ![img](https://s1.ax1x.com/2023/02/10/pSf7uH1.png)

  ```js
  app.get('/user', (req, res) => {
    console.log(req.query); // { a: '1', b: '2' }
  })
  ```

- 获取动态参数

  通过 `req.params` 对象，可以访问到 `URL` 中，通过 : 匹配到的动态参数：

  ![img](https://s1.ax1x.com/2023/02/10/pSf739O.png)

  ```js
  app.get('/user/:id', (req, res) => {
    console.log(req.params); // { id: '814' }
  })
  ```

### 托管静态资源

1. `express.static()`

   `express` 提供了一个非常好用的函数，叫做 `express.static()`，通过它，我们可以非常方便地创建一个静态资源服务器，例如，通过如下代码就可以将 `public` 目录下的图片、`CSS` 文件、`JavaScript` 文件对外开放访问了：

   ```js
   app.use(express.static('public'))
   ```

   现在，你就可以访问 `public` 目录中的所有文件了：`http://127.0.0.1/clock.html`

   > 注意：
   >
   > `Express` 在指定的静态目录中查找文件，并对外提供资源的访问路径。因此，存放静态文件的目录名不会出现在 `URL` 中。

2. 托管多个静态资源目录

   如果要托管多个静态资源目录，请多次调用 `express.static()` 函数

   ```js
   app.use(express.static('public'))
   app.use(express.static('files'))
   ```

   > 注意：
   >
   > 访问静态资源文件时，`express.static()` 函数会根据目录的添加顺序查找所需的文件。

3. 挂载路径前缀

   如果希望在托管的静态资源访问路径之前，挂载路径前缀，则可以使用如下的方式：
   现在，你就可以通过带有 `/public` 前缀地址来访问 `public` 目录中的文件了：
   `http://127.0.0.1/public/clock.html`

   ```js
   app.use('public', express.static('public'))
   ```

## 路由

### 概念

在 `Express` 中，路由指的是客户端的请求与服务器处理函数之间的映射关系。

`Express` 中的路由分 3 部分组成，分别是请求的类型、请求的 `URL` 地址、处理函数，格式如下：

```
app.METHOD(PATH, CALLBACK)
```

- METHOD：请求方法
- PATH：请求路径
- CALLBACK：请求方法回调函数

### 使用

#### 基础用法

在 `Express` 中使用路由最简单的方式，就是把路由挂载到 `app` 上，示例代码如下：

```
app.get('/user', (req, res) => {
	res.send({username: 'tydumpling', age: 23})
})

app.post('/add', (req, res) => {
	res.send('添加成功')
})
```

#### 模块化管理

为了方便对路由进行模块化的管理，`Express` 不建议将路由直接挂载到 `app` 上，而是推荐将路由抽离为单独的模块。将路由抽离为单独模块的步骤如下：

1. 创建路由模块对应的 `.js` 文件

   创建了一个 `router.js` 文件。

2. 调用 `express.Router()` 函数创建路由对象

   在 `router.js` 文件创建路由对象

   ```js
   const express = require('express')
   const router = express.Router()
   ```

3. 向路由对象上挂载具体的路由

   在 `router.js` 文件挂载

   ```js
   router.get('/user', (req, res) => {
   	res.send('获取列表')
   })
   
   router.post('/add', (req, res) => {
   	res.send('添加成功')
   })
   ```

4. 使用 `module.exports` 向外共享路由对象

   在 `router.js` 文件共享

   ```js
   module.exports = router
   ```

5. 使用 `app.use()` 函数注册路由模块

   在 `index.js` 中导入并使用

   ```js
   // 导入路由
   const router = require('./route')
   // 注册路由
   app.use(router)
   ```

#### 添加前缀

```js
app.use('/api', router)
```

**总体代码**

`index.js`

```js
const express = require('express')

const app = express()

// 导入路由
const router = require('./route')
// 注册路由
app.use(router)

app.listen(80, () => {
  console.log('running');
})
```

`route.js`

```js
const express = require('express')
const router = express.Router()

router.get('/user', (req, res) => {
	res.send('获取列表')
})

router.post('/add', (req, res) => {
	res.send('添加成功')
})

// 向外导出
module.exports = router
```

## 中间件

### 概念

中间件（ `Middleware` ），特指业务流程的中间处理环节。

当一个请求到达 `Express` 的服务器之后，可以连续调用多个中间件，从而对这次请求进行预处理。

`Express` 的中间件，本质上就是一个 `function` 处理函数。多个中间件之间，共享同一份 `req` 和 `res`。基于这样的特性，我们可以在上游的中间件中，统一为 `req` 或 `res` 对象添加自定义的属性或方法，供下游的中间件或路由进行使用。

> 注意：
>
> 中间件函数的形参列表中，必须包含 `next` 参数。而路由处理函数中只包含 `req` 和 `res` 。

`next` 函数是实现多个中间件连续调用的关键，它表示把流转关系转交给下一个中间件或路由

### 定义

定义一个最简单的中间件函数：

```js
const mv = (req, res, next) => {
  console.log('我是最基础的中间件');
  // 中间件必须next把流转关系转交给下一个
  next()
}
```

客户端发起的任何请求，到达服务器之后，都会触发的中间件，叫做全局生效的中间件。通过调用 `app.use(中间件函数)` ，即可定义一个全局生效的中间件，示例代码如下：

```js
const mv = (req, res, next) => {
  console.log('我是最基础的中间件');
  // 中间件必须next把流转关系转交给下一个
  next()
}

// 全局生效
app.use(mv)
```

简化全局中间件的定义形式：

```js
app.use((req, res, next) => {
	console.log('这是一个中间件')
	next()
})
```

可以使用 `app.use()` 连续定义多个全局中间件。客户端请求到达服务器之后，会按照中间件定义的先后顺序依次进行调用，示例代码如下：

```js
app.use((req, res, next) => {
	console.log('这是第一个中间件')
	next()
})

app.use((req, res, next) => {
	console.log('这是第二个中间件')
	next()
})

app.use((req, res, next) => {
	res.send('结束')
})
```

不使用 `app.use()` 定义的中间件，叫做局部生效的中间件，示例代码如下：

```js
const mv = (req, res, next) => {
  console.log('我是中间件');
  next()
}

app.get('/', mv, (req, res) => {
    res.send('我使用了局部中间件')
})
```

可以在路由中，通过如下两种等价的方式，使用多个局部中间件：

```js
app.get('/', mv1, mv2, (req, res) => { res.send('我使用了两个局部中间件') })
app.get('/', [mv1, mv2], (req, res) => { res.send('我使用了两个局部中间件') })
```

### 注意事项

1. 一定要在路由之前注册中间件
2. 客户端发送过来的请求，可以连续调用多个中间件进行处理
3. 执行完中间件的业务代码之后，不要忘记调用 `next()` 函数
4. 为了防止代码逻辑混乱，调用 `next()` 函数后不要再写额外的代码
5. 连续调用多个中间件时，多个中间件之间，共享 `req` 和 `res` 对象

### 分类

为了方便大家理解和记忆中间件的使用，`Express` 官方把常见的中间件用法，分成了 5 大类，分别是：

#### 应用级别的中间件

通过 `app.use()` 或 `app.get()` 或 `app.post()` ，绑定到 `app` 实例上的中间件，叫做应用级别的中间件，代码示例如下：

```js
app.use((req, res, next) => {
	next()
})

app.get('/', mv, (req, res) => {
	res.send('home')
})
```

即全局中间件和局部中间件。

#### 路由级别的中间件

绑定到 `express.Router()` 实例上的中间件，叫做路由级别的中间件。它的用法和应用级别中间件没有任何区别。只不过，应用级别中间件是绑定到 `app` 实例上，路由级别中间件绑定到 `router` 实例上，代码示例如下：

```js
const app = express()
const router = express.Router()

router.use((req, res,next) => {
    next()
})

app.use('/', router)
```



#### 错误级别的中间件

错误级别中间件的作用：专门用来捕获整个项目中发生的异常错误，从而防止项目异常崩溃的问题。

格式：错误级别中间件的 function 处理函数中，必须有 4 个形参，形参顺序从前到后，分别是 `(err, req, res, next)` 。

```js
app.get('/', (req, res) => {
    throw new Error('人为制造服务器错误')
    res.send('前面有错误，这里执行不了')
})

app.use((err, req, res, next) => {
    console.log('发生错误' + err.message)
    res.send('Error!' + err.message)
})
```

![结果](https://s1.ax1x.com/2023/02/10/pShpIGd.png)



> 注意：
>
> 错误级别的中间件，必须注册在所有路由之后！

#### `Express` 内置的中间件

自 `Express 4.16.0` 版本开始，`Express` 内置了 3 个常用的中间件，极大的提高了 `Express` 项目的开发效率和体验：

1. `express.static` 快速托管静态资源的内置中间件，例如： `HTML` 文件、图片、`CSS` 样式等（无兼容性）

2. `express.json` 解析 `JSON` 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）

   ```js
   app.post('/add', (req, res) => {
       console.log(req.body) // 没配置json中间件，打印出来是undefined
       res.send('ok')
   })
   
   // ----------------------分割线------------------------
   app.use(express.json())
   
   app.post('/add', (req, res) => {
       console.log(req.body) // 配置了json中间件，打印出来是{ name: 'tydumpling', age: '20' }
       res.send('ok')
   })
   ```

3. `express.urlencoded` 解析 `URL-encoded` 格式的请求体数据（有兼容性，仅在 `4.16.0+` 版本中可用）

   ```js
   app.post('/book', (req, res) => {
       console.log(req.body) // 没配置urlencoded中间件，打印出来是{}
       res.send('ok')
   })
   
   // ----------------------分割线------------------------
   app.use(express.urlencoded( { extended: false } ))
   
   app.post('/book', (req, res) => {
       console.log(req.body) // 配置了urlencoded中间件，打印出来是[Object: null prototype] { num: '20', name: 'tydumpling博客' }
       res.send('ok')
   })
   ```

#### 第三方的中间件

非 Express 官方内置的，而是由第三方开发出来的中间件，叫做第三方中间件。在项目中，大家可以按需下载并配置第三方中间件，从而提高项目的开发效率。

> 注意：
>
> `Express` 内置的 `express.urlencoded` 中间件，就是基于 `body-parser` 这个第三方中间件进一步封装出来的。

## 总结

`app.use()` 的作用是用来注册全局的中间件。

## 编写接口

### 创建基本服务器

```js
const express = require('express')
const app = express()

app.listen(80, () => {
  console.log('running');
})
```

### 创建API模块

`router.js`

````js
const express = require('express')
const router = express.Router()

// 向外导出
module.exports = router
````

`index.js`

```js
const route = require('./route')

app.use('/api', route)
```

### 编写 GET 接口

```js
router.get('/', (req, res) => {
  const query = req.query
  console.log(query);

  res.send({
    code: 200,
    msg: 'get请求处理成功',
    data: query
  })
})
```

### 编写 POST 接口

```js
router.post('/add', (req, res) => {
  const body = req.body
  console.log(body);

  res.send({
    code: 200,
    msg: 'post请求处理成功',
    data: body
  })
})
```

### 跨域

#### cors

使用步骤：

1. 运行 `npm install cors` 安装中间件
2. 使用 `const cors = require('cors')` 导入中间件
3. 在路由之前调用 `app.use(cors())` 配置中间件

CORS （Cross-Origin Resource Sharing，跨域资源共享）由一系列 HTTP 响应头组成，这些 HTTP 响应头决定浏览器是否阻止前端 JS 代码跨域获取资源。

浏览器的同源安全策略默认会阻止网页“跨域”获取资源。但如果接口服务器配置了 CORS 相关的 HTTP 响应头，就可以解除浏览器端的跨域访问限制。

> **CORS 的注意事项**
>
> 1. CORS 主要在服务器端进行配置。客户端浏览器无须做任何额外的配置，即可请求开启了 CORS 的接口。
> 2. CORS 在浏览器中有兼容性。只有支持 XMLHttpRequest Level2 的浏览器，才能正常访问开启了 CORS 的服务端接口（例如：IE10+、Chrome4+、FireFox3.5+）。

53

# nodemon

在编写调试 `Node.js` 项目的时候，如果修改了项目的代码，则需要频繁的手动 `close` 掉，然后再重新启动，非常繁琐。

使用 [nodemon](https://www.npmjs.com/package/nodemon) 这个工具，它能够监听项目文件的变动，当代码被修改后，`nodemon` 会自动帮我们重启项目，极大方便了开发和调试。

## 安装

```sh
npm i -g nodemon
```

## 使用

```sh
nodemon xxx.js
```

