# http

`http` 模块是 `Node.js` 官方提供的、用来创建 web 服务器的模块。通过 `http` 模块提供的 `http.createServer()` 方法，就能方便的把一台普通的电脑，变成一台 `Web` 服务器，从而对外提供 `Web` 资源服务。

如果要希望使用 `http` 模块创建 `Web` 服务器，则需要先导入它

```js
const http = require('http')
```

![img](https://doc.houdunren.com/assets/img/0_bxDKfJauHG6hjB-5.d8d959b1.png)

## 服务器相关概念

### IP

如果不设置ip，或设置为 **0.0.0.0** 表示允许任何IP 访问，这样局域网其他电脑可以通过 IP 访问到你的项目。

设置ip为 **localhost** 或 '127.0.0.1' 只允许本机访问

你可以通过 **ifconfig** 查看本机 IP 地址，然后通过 IP 地址进行访问

```js
service.listen(3000, '0.0.0.0', () => {
  console.log('HOST: http://localhost:3000')
})
```

设置第二个参数主机设置为 **127.0.0.1**，表示只允许本地访问

```js
service.listen(3000, '127.0.0.1', () => {
  console.log('HOST: http://localhost:3000')
})
```

### 域名

管 IP 地址能够唯一地标记网络上的计算机，但IP地址是一长串数字，不直观，而且不便于记忆，于是人们又发明了另一套字符型的地址方案，即所谓的域名（ `Domain Name` ）地址。

IP地址和域名是一一对应的关系，这份对应关系存放在一种叫做域名服务器(`DNS` ，`Domain name server` )的电脑中。使用者只需通过好记的域名访问对应的服务器即可，对应的转换工作由域名服务器实现。因此，域名服务器就是提供 IP 地址和域名之间的转换服务的服务器。

> **注意：**
>
> 1. 单纯使用 IP 地址，互联网中的电脑也能够正常工作。但是有了域名的加持，能让互联网的世界变得更加方便。
> 2. 在开发测试期间， 127.0.0.1 对应的域名是 localhost，它们都代表我们自己的这台电脑，在使用效果上没有任何区别。

### 端口号

计算机中的端口号，就好像是现实生活中的门牌号一样。通过门牌号，外卖小哥可以在整栋大楼众多的房间中，准确把外卖送到你的手中。

同样的道理，在一台电脑中，可以运行成百上千个 web 服务。每个 web 服务都对应一个唯一的端口号。客户端发送过来的网络请求，通过端口号，可以被准确地交给对应的 web 服务进行处理。

> **注意：**
>
> 1. 每个端口号不能同时被多个 web 服务占用。
> 2. 在实际应用中，URL 中的 80 端口可以被省略。

## 基本使用

下面创建http服务器，并监听 `request` 事件，处理用户请求并向客户端发送响应。

1. 导入 http 模块

   ```js
   import http from 'http'
   ```

2. 创建 web 服务器实例

   ```js
   const service = http.createServer()
   ```

3. 为服务器实例绑定 `request` 事件，监听客户端的请求

   - `req.url` 获取客户端请求的地址
   - `req.method` 获取客户端的请求类型
   - `res.write` 向客户端响应内容
   - `res.end` 响应完毕，也可以一次设置响应内容

   ```js
   service.on('request', (req, res) => {
     console.log(req.method)
     console.log(res)
     let str = `url:${req.url}, method:${req.method}`
     //告之客户端数据响应完毕
     res.end(str)
   })
   ```

4. 启动服务器

   ```js
   service.listen(3000, () => {
     console.log('Service: http://127.0.0.1:3000')
   })
   ```

总体代码：

```js
import http from 'http'
//创建服务
const service = http.createServer()
//客户端请求事件
service.on('request', (req, res) => {
  console.log(req.method)
  console.log(res)
  let str = `url:${req.url}, method:${req.method}`
  //告之客户端数据响应完毕
  res.end(str)
})

//监听端口
service.listen(3000,'localhost', () => {
  console.log('Service: http://127.0.0.1:3000')
})
```

或者可以换一种写法，我们通过设置 **http.createServer** 的回调函数，来监听 **request** 事件。

```js
import http from 'http'
//创建服务
const service = http.createServer((req, res) => {
  console.log(req.method)
  //响应完成，并输出内容
  res.end('tydumpling.com')
})

//监听端口
service.listen(3000, () => {
  console.log('Service: http://127.0.0.1:3000')
})
```

### 头信息

当调用 `res.end()` 方法，向客户端发送中文内容的时候，会出现乱码问题，此时，可通过 **setHeader** 与 **statusCode** 设置响应头信息，手动设置内容的编码格式。

下例响应 HTML 数据，并设置编码为 utf-8

```js
import http from 'http'
//创建服务
const service = http.createServer((req, res) => {
  //设置状态码200并指定响应类型与编码
  res.setHeader('Content-type', 'text/html;charset=utf-8')
  let str = `你的url是：${req.url}，你的method是：${req.method}`
  //响应数据
  res.end(str)
})

//监听端口
service.listen(3000, () => {
  console.log('Service: http://127.0.0.1:3000')
})
```

通过 **res.writeHead** 同时设置状态码与响应头信息

```js
import http from 'http'
//创建服务
const service = http.createServer((req, res) => {
  //设置头信息
  res.writeHead(200, {
    'Content-Type': 'application/json',
  })
  //响应数据
  res.end(JSON.stringify({ name: 'tydumpling', url: 'tydumpling.com' }))
})

//监听端口
service.listen(3000, () => {
  console.log('Service: http://127.0.0.1:3000')
})
```

### 页面跳转

通过设置头信息进行页面跳转

```js
import { createServer } from 'http'

const service = createServer((req, res) => {
  res.statusCode = 301
  res.setHeader('Location', 'https://duyidao.gitee.io/tydumpling/')
  res.end()
})

service.listen(3000)
```

## 路由基础

下面我们创建简单的路由，即根据请求响应不同结果，步骤如下：

1. 获取请求的 url 地址
2. 判断用户请求的是否为 / 或 /index.html 首页
3. 判断用户请求的是否为 /about.html 关于页面
4. 都不符合要求响应内容为 404 Not found
5. 设置 Content-Type 响应头，防止中文乱码
6. 使用 res.end() 把内容响应给客户端

```js
import { createServer } from 'http'

const service = createServer((req, res) => {
  const content = ''
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html;charset=utf8')
  switch (req.url) {
    case '/':
    case '/index.html':
      const = '<h1>首页</h1>'
      break
    case '/about.html':
      const = '<h1>关于</h1>'
      break
    case '/user.html':
      res.setHeader('Content-Type', 'application/json') // 单独修改该页面的请求头
      const = '<h1>我的</h1>'
      break
    default:
      const = '<h1>404 Not Found</h1>'
      break;
  }
  res.end()
})

service.listen(3000, () => {
  console.log(`host: http://localhost:3000`)
})
```

## 响应数据

下面介绍掌用客户端数据响应

### HTML

通过设置头信息来告之浏览器，服务器端响应的是 html 数据

```js
import { pipeline } from 'stream'
import { createReadStream } from 'fs'
import { createServer } from 'http'

const service = createServer((req, res) => {
  res.writeHead(200, {
    'Content-type': 'text/html;charset=utf8',
  })
  pipeline(createReadStream('index.html'), res, () => {})
})

service.listen(3000)
```

### JSON

后端做为接口时，需要传递 JSON 数据给前端

```js
import { createServer } from 'http'

const user = [{ name: '后盾人' }, { name: '向军大叔' }]

const service = createServer((req, res) => {
  res.writeHead(200, {
    'Content-type': 'application/json',
  })
  res.end(JSON.stringify(user))
})

service.listen(3000)
```

### 变量解析

下面来演示模板变量的替换流程，首先创建模板文件 **index.html**

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>houdunren.com</title>
  </head>
  <body>
    {{name}} 欢迎你
  </body>
</html>
```

然后实现后台逻辑

```js
import { readFileSync } from 'fs'
import { createServer } from 'http'

const service = createServer((req, res) => {
  res.writeHead(200, { 'Content-type': 'text/html' })

	//模板变量
  const vars = { name: '后盾人' } as any
  //加载模板
  const template = readFileSync(__dirname + '/index.html', 'utf-8')
  //替换模板变量
  const content = template.replace(/\{\{(.*?)\}\}/gi, (match, ...args) => {
    return vars[args[0]]
  })

  res.end(content)
})

service.listen(3000, () => {
  console.log('服务已经启动...')
})
```

## 表单数据

下面介绍如何获取客户端表单数据

### 基本原理

```js
import { createServer } from 'http'

const users = [] as any[]
const service = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html;charset=utf8')
  if (req.method == 'POST' && req.url == '/user') {
    req.on('data', (data) => {
      //buffer 转换
      const user = data.toString()
      //转为 JSON 对象保存
      users.push(JSON.parse(user))
      req.pipe(res)
    })
  }

  if (req.method == 'GET' && req.url == '/user') {
    res.end(JSON.stringify(users))
  }
})

service.listen(3000, () => {
  console.log(`host: http://localhost:3000`)
})
```

在 apifox 等发送请求

![image-20220824025713812](https://doc.houdunren.com/assets/img/image-20220824025713812.1db91999.png)

### 使用扩展包

使用 [multiparty (opens new window)](https://www.npmjs.com/package/multiparty)包解析前端非常方便，下面使用流并结合插件 [multiparty (opens new window)](https://www.npmjs.com/package/multiparty)扩展包实现文件上传

```js
import { createReadStream, createWriteStream, mkdirSync } from 'fs'
import { createServer } from 'http'
import multiparty from 'multiparty'
import { pipeline } from 'stream'

const service = createServer((req, res) => {
  var form = new multiparty.Form()
  form.parse(req, function (err: any, fields: any, files: any) {
    //创建目录
    mkdirSync('uploads')

    //将临时文件使用流保存数据
    pipeline(
      createReadStream(files.file[0].path),
      createWriteStream('./uploads/' + files.file[0].originalFilename),
      (error) => {
        error ? console.log(error) : res.end('文件上传成功')
      },
    )
  })
})

service.listen(3000)
```

## 案例

显示静态 html 文件

### 导入模块

```js
const fs = require('fs')
const path = require('path')
const http = require('http')
```

### 搭建服务

```js
const server = http.createServer()

server.on('request', (req, res) => {
})

server.listen(80, () => {
  console.log('已启动');
})
```

### 获取地址

```js
const fPath = path.join(__dirname, url)
```

### 读取文件

```js
fs.readFile(fPath, 'utf8', (err, result) => {
  if(err) return res.end('404 not found')
  res.end(result)
})
```

### 路径优化

```js
if (url === '/') {
  fPath = path.join(__dirname, '/clock/clock.html')
} else {
  fPath = path.join(__dirname, '/clock', url)
}
```

### 总体代码

```js
const fs = require('fs')
const path = require('path')
const http = require('http')

const server = http.createServer()

server.on('request', (req, res) => {
  const url = req.url
  const method = req.method
  
  let fPath = ''
  if (url === '/') {
    fPath = path.join(__dirname, '/clock/clock.html')
  } else {
    fPath = path.join(__dirname, '/clock', url)
  }

  fs.readFile(fPath, 'utf8', (err, result) => {
    if(err) return res.end('404 not')
    res.end(result)
  })
})

server.listen(80, () => {
  console.log('已启动');
})
```

