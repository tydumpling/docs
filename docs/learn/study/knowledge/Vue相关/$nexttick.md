# $nexttick

## 执行原理

Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个任务队列，并缓冲在同一时间循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。（这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的）

然后，在下一个的事件循环 “tick” 中，Vue 刷新队列并执行任务队列 (已去重的) 工作。

$nextTick 方法内部采用了一种异步队列技术，它采用了宏任务和微任务的处理机制来保证在 DOM 更新之后执行回调函数。这个方法的执行时间依赖于浏览器的刷新机制，也就是说，它的执行是在下一个浏览器刷新周期之前，而不是立刻执行。

## 宏任务还是微任务

首先查看一下核心代码—— `nextTick` 函数：

```js
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

更**核心的代码**：

```js
if (!pending) {
  pending = true
  if (useMacroTask) {
    macroTimerFunc()
  } else {
    microTimerFunc()
  }
}
```

即：**nextTick既可以是宏任务，又可以是微任务**！

接着看**微任务**的定义：

```js
// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc
}
```

即：**vue环境支持 Promis 的话，使用 Promise。否则microTimerFunc 被定义为宏任务 macroTimerFunc**。

接着看 macroTimerFunc 的定义：

```js
// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  /* istanbul ignore next */
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```

**优先使用 setImmediate（只有ie浏览器10以上支持），其次是 MessageChannel，最后是 setTimeout**。以上三个都属于宏任务。

HTML5中规定 setTimeout 的最小时间延迟是4ms，也就是说理想环境下异步回调最快也是4ms才能触发。Vue使用这么多函数来模拟异步任务，其目的只有一个，**就是让回调异步且尽早调用**。而 [MessageChannel](https://link.juejin.im/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FMessageChannel) 和 [setImmediate](https://link.juejin.im/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FWindow%2FsetImmediate) 的延迟明显是小于 [setTimeout](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2FPDKSophia%2Fblog.io%2Fblob%2Fmaster%2F%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AF%87%20-%20setTimeout%E4%B8%8EsetInterval.md)的。

那什么时候使用宏任务，什么时候使用微任务呢？

在 Vue 2.4 之前都是使用的 `microtasks(微任务)`，但是 microtasks 的优先级过高，在某些情况下可能会出现比事件冒泡更快的情况，但如果都使用 `macrotasks(宏任务)` 又可能会出现渲染的性能问题。所以*在新版本中，会默认使用 microtasks*，**但在特殊情况下会使用 macrotasks。比如 v-on**。

下图是使用v-on时，源码调试截图：

![img](https://img2018.cnblogs.com/blog/757824/201811/757824-20181122142518024-950260975.png)

在chrome下使用了MessageChannel实现的宏任务。

![img](https://img2018.cnblogs.com/blog/757824/201811/757824-20181122142707435-2139698661.png)

宏任务和微任务执行顺序

```js
for (macroTask of macroTaskQueue) {
    // 1. Handle current MACRO-TASK
    handleMacroTask();
      
    // 2. Handle all MICRO-TASK
    for (microTask of microTaskQueue) {
        handleMicroTask(microTask);
    }
}
```



