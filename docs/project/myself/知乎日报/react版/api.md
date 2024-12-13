# 请求配置

## Axios二次封装

二次封装已经是老生常谈的问题了，`axios` 二次封装无外乎从以下几个方面入手：

- 基准路径：`baseUrl`
- 超时时间：`timeout`
- 请求拦截器：用于判断接口路径以设置不同的请求体、把 `token` 放到请求体上
- 响应拦截器：用于判断请求状态返回数据，并根据相应的状态做对应处理

## 代理

首先需要安装依赖：

```
yarn add http-proxy-middleware --save-dev
```

然后在 `create-react-app` 创建的 `react` 项目想要实现代理，则需要在 `src` 文件夹下新建一个 `setupProxy.js` 文件用于代理处理。

代码如下：

```js
 const {createProxyMiddleware} = require('http-proxy-middleware');
 
module.exports = function(app) {
  app.use('/api', createProxyMiddleware({ 
    target: '',//后台服务器地址
    changeOrigin: true,
    pathRewrite: {
    '^/api': '',
    },}))
};
```

> 注意
>
> 在新版本中已经默认设置代理的文件夹名为 `setupProxy` 。
>
> ![img](https://img-blog.csdnimg.cn/f8958cd1fb344e21987883dfa7824413.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA57mB5pif5Y-s5ZSk,size_20,color_FFFFFF,t_70,g_se,x_16)

到这里所有配置就基本完成，在组件中调用即可。