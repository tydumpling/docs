# 基础知识

正则表达式是用于匹配字符串中字符组合的模式，在 JavaScript 中，正则表达式也是对象。

- 正则表达式是在宿主环境下运行的，如`js/php/node.js` 等
- 本章讲解的知识在其他语言中知识也是可用的，会有些函数使用上的区别

## 对比分析

与普通函数操作字符串来比较，正则表达式可以写出更简洁、功能强大的代码。

下面使用获取字符串中的所有数字来比较函数与正则的差异。

```js
let fn = "tydumpling2200fndd9988";
let nums = [...fn].filter(a => !Number.isNaN(parseInt(a)));
console.log(nums.join(""));
```

使用正则表达式将简单得多

```js
let fn = "tydumpling2200fndd9988";
console.log(fn.match(/\d/g).join(""));
```

## 创建正则

JS 提供字面量与对象两种方式创建正则表达式

### 字面量创建

使用`//`包裹的字面量创建方式是推荐的作法，但它不能在其中使用变量

```js
let fn = "tydumpling.com";
console.log(/o/.test(fn));//true
```

下面尝试使用 `a` 变量时将不可以查询，因为他把 a 看成字符串来查找。

```js
let fn = "tydumpling.com";
let a = "o";
console.log(/a/.test(fn)); //false
```

虽然可以使用 `eval` 转换为 js 语法来实现将变量解析到正则中，但是比较麻烦，所以有变量时建议使用下面的对象创建方式

```js
let fn = "tydumpling.com";
let a = "o";
console.log(eval(`/${a}/`).test(fn)); //true
```

### 对象创建

当正则需要动态创建时使用对象方式

```js
let fn = "tydumpling.com";
let web = "tydumpling";
let reg = new RegExp(web);
console.log(reg.test(fn)); //true
```

根据用户输入高亮显示内容，支持用户输入正则表达式

```html
<body>
  <div id="content">tydumpling.com</div>
</body>
<script>
  const content = prompt("请输入要搜索的内容，支持正则表达式");
  const reg = new RegExp(content, "g");
  let body = document
    .querySelector("#content")
    .innerHTML.replace(reg, str => {
      return `<span style="color:red">${str}</span>`;
    });
  document.body.innerHTML = body;
</script>
```

通过对象创建正则提取标签

```html
<body>
  <h1>tydumpling.com</h1>
  <h1>fndd.com</h1>
</body>

<script>
function element(tag) {
  const html = document.body.innerHTML;
  let reg = new RegExp("<(" + tag + ")>.+</\\1>", "g");
  return html.match(reg);
}
console.table(element("h1"));
```

## 选择符

`|` 这个符号带表选择修释符，也就是 `|` 左右两侧有一个匹配到就可以。

检测电话是否是上海或北京的坐机

```js
let tel = "010-12345678";
//错误结果：只匹配 | 左右两边任一结果
console.log(tel.match(/010|020\-\d{7,8}/)); // false。该比较是 是否是 ： 010或020-7或8个数字

//正确结果：所以需要放在原子组中使用
console.log(tel.match(/(010|020)\-\d{7,8}/)); // true
```

匹配字符是否包含`tydumpling` 或 `fndd`

```js
const fn = "tydumpling";
console.log(/tydumpling|fndd/.test(fn)); //true
```

## 字符转义

转义用于改变字符的含义，用来对某个字符有多种语义时的处理。

假如有这样的场景，如果我们想通过正则查找`/`符号，但是 `/`在正则中有特殊的意义。如果写成`///`这会造成解析错误，所以要使用转义语法 `/\//`来匹配。

```js
const url = "https://www.tydumpling.com";
console.log(/https:\/\//.test(url)); //true
```

使用 `RegExp` 构建正则时在转义上会有些区别，下面是对象与字面量定义正则时区别

```js
let price = 12.23;
//含义1: . 除换行外任何字符 	含义2: .普通点
//含义1: d 字母d   					含义2: \d 数字 0~9
console.log(/\d+\.\d+/.test(price));

//字符串中 \d 与 d 是一样的，所以在 new RegExp 时\d 即为 d
console.log("\d" == "d");

//使用对象定义正则时，可以先把字符串打印一样，结果是字面量一样的定义就对了
console.log("\\d+\\.\\d+");
let reg = new RegExp("\\d+\\.\\d+");
console.log(reg.test(price));
```

下面是网址检测中转义符使用

```js
let url = "https://www.tydumpling.com";
console.log(/https?:\/\/\w+\.\w+\.\w+/.test(url));
```

## 字符边界

使用字符边界符用于控制匹配内容的开始与结束约定。

| 边界符 | 说明                         |
| ------ | ---------------------------- |
| ^      | 匹配字符串的开始             |
| $      | 匹配字符串的结束，忽略换行符 |

匹配内容必须以`www`开始

```js
const fn = "www.tydumpling.com";
console.log(/^www/.test(fn)); //true
```

匹配内容必须以`.com`结束

```js
const fn = "www.tydumpling.com";
console.log(/\.com$/.test(fn)); //true
```

检测用户名长度为 3~6 位，且只能为字母。如果不使用 `^与$` 限制将得不到正确结果

```html
<body>
  <input type="js" name="username" />
</body>

<script>
  document
    .querySelector(`[name="username"]`)
    .addEventListener("keyup", function() {
      let res = this.value.match(/^[a-z]{3,6}$/i);
      console.log(res);
      console.log(res ? "正确" : "失败");
    });
</script>
```
