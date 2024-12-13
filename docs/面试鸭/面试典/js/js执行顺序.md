# JS执行顺序

js执行顺序如下图所示：

[![p96gyR0.png](https://s1.ax1x.com/2023/05/13/p96gyR0.png)](https://imgse.com/i/p96gyR0)

举例 `setTimeout` ，我们都知道定时器是异步任务中的宏任务，但是是 `setTimeout` 中的回调函数是异步的，`setTimeout` 方法本身是同步执行的。

又比如 `Promise` 函数本身是同步任务，其回调是异步任务，如下：

```js
new Promise(() => {
    // 同步任务
}).then(() => {
    // 异步任务：微任务
}).catch(() => {})
```

`Promise` 执行后状态为 `padding` 执行中，执行完毕后如果状态变为 `resolve` ，则说明执行成功，此时触发回调函数 `.then` ；如果状态变为 `reject` ，则说明执行失败，此时触发回调函数 `.catch` 。

## 结论

js首先执行当前作用域下的全部同步任务，同步任务都执行完毕后，就去队列内查看是否有未执行完的异步微任务，有的话就执行，执行完或者没有再去执行宏任务。

而浏览器并不知道什么时候会有异步任务，因此会定时去发起轮询。这个行为也被称之为 `event loop` 。

## 异步组织建议

1. 先把异步 promise 化
2. 梳理清楚逻辑上的操作顺序
3. 组织为队列，按顺序执行

## 案例

### JavaScript

a和b两个异步获取的结果，相加得c。最终计算出c的结果

```js
// 此时a和b是同时执行的，都在异步队列内
function a() {
    return new Promise(() => {
        setTimeout(() => {
            resolve(1)
        })
    }, 1000)
}

function b() {
    return new Promise(() => {
        setTimeout(() => {
            resolve(2)
        })
    }, 1000)
}

function c(v) {
    return new Promise(() => {
        setTimeout(() => {
            resolve(v + 3)
        }, 2000)
    })
}
```

获取结果，promise可通过 Promise.all 获取多个结果

```js
Promise.all([a(), b()]).then((res) => {
    c(res[0] + res[1]).then((result) => {
        console.log(result)
    })
})
```

这么写异步嵌套，代码不够优雅，因此可以做进一步修改。根据需求，需要先得到a和b，才能拿去计算得出c。因此a和b可以先执行。

```js
function set1() {
    return Promise.all([a(), b()])
}

functin set2(val) {
    return c(val)
}

let arr = [set1, set2]
async functionrun() {
    let res
    for(let i = 0; i < arr.length; i++) {
        res = await arr[i]()
    }
}
```

> 也有写法是把全部函数都用 `async` 与 `await` 变为同步操作，但是这样并不建议，此时已经抛弃了 JS 的异步操作。

