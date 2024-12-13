# 关于 forEach 使用 break 跳出循环

## 错误抛出

如果采用错误抛出的方法来结束循序，代码如下：

```js
arr.forEach(item => {
    if(item.id === '2') throw 'Error'
})

console.log('后续执行的代码')
```

执行后我们发现，虽然循环停止了，但是后续的代码也不再执行了。这显然不是我们想要的效果，需要做点改进。

## try...catch

在之前，我们有用过通过 `try...catch...` 捕获抛出的异常错误，可以用在这里，到捕获到 `forEach` 抛出的错误后，`catch` 内执行后续的代码。

```js
try {
    arr.forEach(item => {
    	if(item.id === '2') throw 'Error'
	})
} catch {
	console.log('后续执行的代码')
}
```

现在运行代码，能够正常执行，且效果是我们想要的效果。

## 题外话

用异常控制语句来达到流程控制语句的效果，这是一种反模式，不要在工作中使用。代码要么改为for需要，要么根据实际情况，先用 `filter` 过滤一遍再处理。