# 手写封装AJAX

封装一个可用于发送请求的 Ajax，只需先考虑 `get()` 和 `post()` 写法，步骤如下：

1. 定义一个 ajax 对象，设置一个 `get()` 方法，一个 `post()` 方法
2. 对应方法设置对应的步骤

```js
const my_ajax = {
    get(url, params, fn) {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                fn(xhr.responseText)
            }
        }
        xhr.send()
    },
    post(url, data, fn) {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', url, true)
        xhr.setRequestHeader('Content-type', 'application/x-www-.....')
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                fn(xhr.responseText)
            }
        }
        xhr.send(data)
    },
}
```

Post 请求与 Get 请求相比，有如下几个区别：

1. Post 请求需要额外设置请求头 `setRequestHeader` ，而 Get 请求的请求头中本来就有这个属性，只需修改该属性的值

   > 注意
   >
   > Post 请求中请求头有两种，一种是表单格式，一种是 JSON 格式，axios 中接收的第三个可以从请求头上获取到，因此可以通过设置对应的值来判断。

2. Post 请求的参数需要通过 `send()` 方法发送，而 Get 请求的参数则是通过 `?a=1` 的形式通过问号拼接在路径后面

