# 垃圾回收与内存泄漏

## 垃圾回收

一个应用程序运行过程中需要有内存，运行完之后这块内存空间不再需要了，这块空间就被称之为垃圾，白白占用内存。垃圾回收器作用就是回收这块垃圾空间，后续可写入新的东西。做这个事情的过程就叫做垃圾回收。

之所以需要学习垃圾回收和内存泄漏，是因为垃圾回收器做不到完美的垃圾回收。下面看一段代码：

```js
let user = [
    {name: 'join', age: 24},
    {name: 'amy', age: 25},
    {name: 'cat', age: 23},
]

const avgAge = user
	.reduce((sum, user) => sum + user.age, 0)
	/ user.length

console.log(avgAge)
```

该代码主要求平均年龄，然后将年龄打印出来。当程序运行完之后，`users` 在控制台上还能打印。它是否需不需要不是由垃圾回收器说了算，而是由人说了算，垃圾回收器再聪明，也只是一个算法，无法真正回收所有不需要的内存空间。它无法理解何为需要，何为不需要。

但是垃圾回收器知道有一样东西一定是垃圾，就是我们都无法引用的东西。下面加一段代码：

```js
let user = [
    {name: 'join', age: 24},
    {name: 'amy', age: 25},
    {name: 'cat', age: 23},
]

const avgAge = user
	.reduce((sum, user) => sum + user.age, 0)
	/ user.length

users = null // [!code ++]

console.log(avgAge)
```

代码运行后无论如何也无法拿到 `users` 数组了，这块内存空间就能够被认定为垃圾。

## 内存泄漏

由上可以得出，垃圾回收器回收的东西是垃圾的子集，垃圾回收器回收不到的东西就叫做内存泄漏。

内存泄漏有两个条件：

1. 不需要这块内存空间
2. 垃圾回收器回收不掉

因此如果垃圾回收器回收不掉的内存过多，就会造成严重的内存泄露，需要认为干预。人为干预就需要了解垃圾回收器的机制。

垃圾回收器的机制本质是一套算法，名称叫做标记清除法。核心思想是当前整个程序还能触达哪些内存，能触达的它认为有用，不能触达的就认为没用。

举一个代码例子：

```js
var a = {b: 1}
a = {c: 3}
```

此时只能访问触达到 `{c: 3}` ，原本的 `{b: 1}` 无法触达，变为垃圾空间，后续会被回收。

之前在学习闭包的时候，总会说闭包会造成内存泄漏问题。实际上这个说法并不完全正确，由上述的内存泄漏本质可知，造成内存泄漏只有两个原因：不需要使用和无法被回收。下面来看一段代码：

```js
function createIncrease() {
    let count = 0
    return function () {
        return count++
    }
}
let increase = createIncrease()
    
let handler = function () {
    const n = increase()
    console.log(n)
}

window.addEventListener('click', handler)
```

这段闭包代码没有造成任何内存泄漏，因为每个变量都是可访达的，是需要使用到的。如果代码修改一下变为下面这段：

```js
function createIncrease() {
    let count = 0
    return function () {
        return count++
    }
}
let increase = createIncrease()
    
let handler = function () {
    const n = increase()
    if (n === 3) { // [!code ++]
        window.removeListener('click', handler) // [!code ++]
        return // [!code ++]
    } // [!code ++]
    console.log(n)
}

window.addEventListener('click', handler)
```

在 `n` 等于3时移出点击事件，此时整个代码都不需要了，但是 `increase` 和 `handler` 还存在可被访达，此时才会造成内存泄漏。

解决方法也很简单，把这两个变量置空即可。

```js
function createIncrease() {
    let count = 0
    return function () {
        return count++
    }
}
let increase = createIncrease()
    
let handler = function () {
    const n = increase()
    if (n === 3) {
        window.removeListener('click', handler)
        increase = null // [!code ++]
        handler = null // [!code ++]
        return
    }
    console.log(n)
}

window.addEventListener('click', handler)
```

这样无法访达后这块内存就能被回收掉。

## console.log导致内存泄漏

`console.log` 在调试的时候非常方便，但是在 `eslint` 中会有报错或警告，这是因为 `console.log` 一般用于调试信息，而这些信息不建议在客户端打印。

但是很多人都忽视了，`console.log` 也会造成内存泄漏问题。一个程序在运行完毕后是会把其中的变量内存销毁，但是当你添加了打印，它需要**保持控制台的对象引用**，因此就会造成内存泄漏。

下面分别看两个例子，首先是无 `console.log` 的情况：

![无console.log](https://pic.imgdb.cn/item/65f85a679f345e8d033e6128.png)

下面是添加了 `console.log` 后的内存：

![](https://pic.imgdb.cn/item/65f85b5d9f345e8d0344da8a.png)

可以看到，有很多数据内存没被回收，因此造成内存泄漏。

在生产环境推荐把所有 `console.log` 干掉，手动一个个删除固然可以，但是麻烦。可以借助 `terser` 第三方库帮我们减少手动操作部分。

如果是 `vue-cli` 配置的项目，它内部已经支持该工具的使用，无需再 `npm i` 引入。在 `vue.config.js` 文件中做相应的配置处理。

```js
const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
    transpileDependencies: true,
    terser: {
        terserOptions: {
            // 压缩的方式
            compress: {
                drop_console: true,
                drop_debugger: true,
            }
        }
    }
})
```

如果项目用的是 Vue3 的 `vite` ，也是可以做到的。在 `vite.config.js` 文件做相应的配置即可。

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugin: [vue()],
    build: {
        minify: 'terser',
        terserOptions: {
            // 压缩的方式
            compress: {
                drop_console: true,
                drop_debugger: true,
            }
        }
    }
})
```

注意的是，`vite` 没有内置该库，因此需要先引入。

```bash
npm i terser
```