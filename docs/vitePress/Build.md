---
title 打包
---
# 打包
项目搭建成功后，接下来该打包了。项目打包的好处学习 `webpack` 的时候已经对比过了，这里不做过多赘述。

`vitepress` 打包需要做一个前置步骤：在 `config.js` 文件中设置 `base` 打包基准路径，路径填啥取决于部署时仓库的名称是啥。

例如：我的仓库名称为 “tydumpling” ，则我的 `base` 参数如下：
```js
base: '/tydumpling/'
```

如果仓库名称为 `github用户名.github.io` 或者 `gitee用户名.gitee.io` ，则视为默认路径，斜杆即可。
```js
base: '/'
```

前置工作做好以后，运行打包命令打包项目。
```sh
yarn docs:build
```
一旦打包成功后，就可以通过运行 `yarn docs:serve` 命令来进行本地测试。
```sh
yarn docs:serve
```
可以看到效果即为成功。