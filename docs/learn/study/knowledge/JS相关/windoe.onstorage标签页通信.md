# window.onstorage标签页通信

标签页通信的常见方案有如下几点：

- BroadCast Channel
- Service Worker
- LocalStorage 通过 window.onstorage 监听
- Shared Worker 定时器轮询（setInterval）
- IndexedDB 定时器轮询（setInterval）
- cookie定时器轮询（setInterval）
- window.open、window.postMessage
- Websocket

这里重点放在如何使用 `windoe.onstorage()` 本地存储监听实现标签页通信。全局对象 `window` 有一个事件 `storage` ，代码如下：

```js
window.addEventListener('storage', (e) => {
    console.log(e)
})
```

该方法在其他标签页改变了本地存储的内容后触发，其形参可以获取到一个对象，其中包含了以下有用的信息：

- 变化的键名 key
- 变化后的新值 newValue
- 变化前的旧值 oldValue

封装两个函数，一个函数用于往本地存储内容，接收两个参数：所要存储的属性键名和要存储的值；一个函数用于调用 `window.onstorage` 函数，获取对应的值，并通过 `return` 一个函数把监听事件卸载。

为了让存储函数不因为存储的键名和键值一样导致本地存储的内容不变，触发不了本地存储函数的触发，因此再存储内容时添加一个时间戳保证值的不同。

代码如下：

```js
export function sendMsg(type, payload) {
    localStorage.setItem(
        '@@' + type,
        JSON.stringify({
            payload,
            temp: Date.now()
        })
    )
}

export function listenMsg(handler) {
    const storageHandler = (e) => {
        const data = JSON.parse(e.newValue)
        handler(e.key.substring(2), data.payload)
    }
    
    window.addEventListener('storage', storageHandler)
    
    return () => {
        window.removeEventListener('storage', storageHandler)
    }
}
```

需要侦听信息时，在 `onMounted` 生命周期内调用 `listenMsg` 方法侦听本地存储。页面销毁时再把函数调用一次销毁掉。代码如下：

```js
let unHandler
onMounted(() => {
    unHandler = listenMsg((type, payload) => {
        console.log(type, payload)
        if(type === 'xxxx') {
            // 满足自定义的键名说明改动了相应模块的本地存储
            arr.value.push(payload)
        }
    })
})

onUnMounted(() => {
    unHandler && unHandler()
})
```

保存信息时，在相应的方法函数内调用 `sendMsg` 方法保存数据，代码如下：

```js
const addFn = () => {
    // ...
    sendMsg('add-emp', emp.value)
}
```

