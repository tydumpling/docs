# 操作内嵌ifrname与传递消息

## 直接操作ifrname

点击相对应的按钮，把对应的文字传递给 `ifrname` 内的表单。 `ifrname` 接收消息，把消息插入光标位置处。

`ifrname` 内有 `postMessage` 方法事件来传递。

### 获取元素

1. 通过 `$refs` 获取 `ifrname` 的 `dom` 元素
2. 通过 `.contentWindow` 获取  `ifrname` 的窗口对象（全局对象获取窗口对象）
3. 通过 `.contentDocument` 获取  `ifrname` 的 `document` 对象（操作节点时获取该对象）

### 发送消息与监听消息

通过 `popostMessage` 发送消息，括号内传入两个参数：

- 参数一：要传递的消息参数
- 参数二：传递到哪里去。可传 `*` ，视为传递到任何地方。如果填入 `localhost:8080` ，则会传给对应的已启动的本地项目

```js
let ifrnamedom = this.$refs.ifrnamedom
let _window = ifrnamedom.contentWindow
_window.popostMessage(e, '*')
```

`ifrname` 内则需要监听接收消息，发送消息是通过 `window` 对象发送的，因此也需要用 `window` 对象接收。

```js
mounted() {
    window.addEventListener('message', (e) => {
        console.log(e)
    })
}
```

接收参数e有两个属性：

- `data` ：传递过来的数据
- `origin` ：传递的地址，如 `localhost:8081` 传递的数据就打印其地址

### 潜在问题

运行后发现有一个问题，页面一渲染完毕他就自动调用发送一次消息，消息内容为 `{type: 'webpackOk', data: undefined}` ，因此如果直接赋值使用可能会有问题。

解决方法：传递的数据不直接传数据，而是模仿其形式传一个对象，如 `{type: 'insertTo', data: e}` 

```js
let ifrnamedom = this.$refs.ifrnamedom
let _window = ifrnamedom.contextWindow
_window.popostMessage({type: 'insertTo', text: e}, '*')
```

这样就可以在接收数据的时候通过判断 `type` 来决定什么时候获取数据并赋值（不一定是要用 `type` ，其他字段也行，只要能用于判断唯一性即可）

```js
mounted() {
    window.addEventListener('message', (e) => {
        if(e.type === 'insertTo') {
            this.data = e.data.text
        }
    })
}
```

### 光标位置插入原理

表单的 `focus` 、`blur` 、`input` 、`change` 事件中可通过 `.selectionStart` 获取光标的位置，因此光标插入步骤如下：

1. 获取光标位置
2. 通过 `.slice(0, 光标位置)` 把字符串分割成两半，通过字符串拼接的形式把内容拼接到中间去

```js
methods: {
    blurText(e) {
        this.position = e.target.selectionStart
    }
},
mounted() {
    window.addEvenListener('message', (e) => {
        if(e.type === 'insertTo') {
            this.data = this.data.slice(0, this.position) + e.data.text + this.data.slice(this.position)
        }
    }))
}
```

### 保存

`ifrname` 可通过 `.top` 与 `.parent` 通知引用的组件。其区别为：

- `.top` 始终指向最顶层
- `.parent` 指向上一层

例如：`window` 嵌套一层 `ifrname1` ，`ifrname1` 内再嵌套一个`ifrname2` ，`ifrname2` 内再嵌套一个`ifrname3` ，对于`ifrname3` 而言，`.top` 指向 `window` ，`.parent` 指向`ifrname2` 。

言尽于此，保存步骤为：

1. 点击保存按钮触发 `window.parent.postMessage` 事件，传入两个参数，第一个参数为 `{type: 'saveTo', text: this.data}` ，第二个参数为 `*` 

   ```js
   saveClick() {
       window.parent.postMessage({type: 'saveTo', text: this.data}, '*')
   }
   ```

2. 父组件监听消息获取，如果类型为 `saveTo` ，做自己的操作（正常情况是调接口保存）

   ```js
   mounted() {
       window.addEventListener('message', (e) => {
           console.log(e)
       })
   }
   ```

### 优缺点

优点：代码优雅，易操作，易维护

缺点：需要修改源码，如果使用了第三方库，则无法使用该方法

## 回归Dom操作

### 解决跨域

第三方库会解决跨域问题，因此不需要额外担心。这里模拟一下跨域解决。

设置一下 `.domain` 为相同的域。

```js
document.domain = 'localhost'
```

### 思路

- 获取 `ifrname` 内地元素
- 获取插入前的值
- 获取光标位置
- 替换它的内容

### 实现

#### 获取元素

在 `ifrname` 加载完毕后获取输入框，虽然不能直接操作 `dom` ，但是可以转变思想，在 `ifrname` 加载完毕后再获取，即 `onload` 函数内。

获取光标数据如何保存？可以通过自定义事件。原生 `js` 中 `setAttribute` 可以设置自定义参数，保存数据，`getAttribute` 获取。

```js
let ifrnamedom = this.$refs.ifrnamedom

ifrnamedom.onload = () => {
	let _document = ifrnamedom.contentDocument
	let textarea = _document.querySelector('textarea')
    textarea.addEventListener('blur', (e) => {
        textarea.setAttribute('data-pos', e.target.selectionStart)
    })
}
```

#### 点击保存

```js
saveTo(item) {
    let ifrnamedom = this.$refs.ifrnamedom
    let _document = ifrnamedom.contentDocument
	let textarea = _document.querySelector('textarea')
    let oldVal = textarea.value
    let position = textarea.getAttribute('data-pos')
    let newVal = oldVal.slice(0, position) + item + oldVal.slice(this.position)
    textarea.value = newVal
}
```

## 总结

如果能够改变源码，可以直接操作源码的 `dom` 结构，使用 `postMessage` 的方法。

如果不能操作源码，则在使用的界面获取相对应的 `ifrname` 结构操作原生 `dom` 即可。