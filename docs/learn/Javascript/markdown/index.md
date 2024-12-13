# 变量

## 变量声明

声明：开辟空间

```js
let web
```

赋值：填充内容

```js
web = "tydumpling"
```

多变量声明赋值

```js
let web = "tydumpling", name = "haha"
// or
let web = name = "haha"
```

## 弱类型

在 JS 中变量类型由所引用的值决定

```js
let web = 'str'
console.log(typeof web) // string
web = 99
console.log(typeof web) // number
```

JavaScript是弱类型语言，当变量修改时变量类型也会发生相应变化。

## 变量提升

解析器会先解析代码，然后把声明的变量的声明提升到最前，这就叫做变量提升。

使用 `var` 声明会被提升到前面，赋值还在原位置

```js
console.log(a); //undefined
var a = 1;
console.log(a);  //1

//以上代码解析器执行过程如下
var a;
console.log(a); //1
a = 1;
console.log(a); //1
```

使用 `let` 解决变量提升的问题。

```js
console.log(web);
let web = 'tydumpling'; //Uncaught SyntaxError: Unexpected token 'while'
```

## 临时性死区

变量在作用域内已经存在，但必须在`let/const`声明后才可以使用。

临时性死区可以让程序保持先声明后使用的习惯，让程序更稳定。

- 变量要先声明后使用
- 建议使用 let/const 而少使用 var

使用`let/const` 声明的变量在声明前存在临时性死区（TDZ）使用会发生错误

```js
console.log(x); // Cannot access 'x' before initialization
let x = 1;
```

在`run`函数作用域中产生 TDZ，不允许变量在未声明前使用。

```js
hd = "tydumpling";
function run() {
  console.log(hd); // Cannot access 'hd' before initialization
  let hd = "duyidao";
}
run();
```

下面代码 b 没有声明赋值不允许直接使用

```js
function hd(a = b, b = 3) {}
hd(); //Cannot access 'b' before initialization
```

因为 a 已经赋值，所以 b 可以使用 a 变量，下面代码访问正常

```js
function hd(a = 2, b = a) {}
hd();
```

# 作用域

## 共同点

`var/let/const`共同点是全局作用域中定义的变量，可以在函数中使用

```js
var hd = 'tydumpling';
function show() {
	return hd;
}
console.log(show()); // tydumpling
```

函数中声明的变量，只能在函数及其子函数中使用，函数中声明的变量就像声明了私有领地，外部无法访问

```js
function hd() {
  var web = "tydumpling";

  function show() {
    console.log(web); //子函数结果: tydumpling
  }
  show();
  console.log(web); //函数结果: tydumpling
}
hd();
console.log(web); //全局访问: hd is not defined
```

## 不同点

### var

使用 `var` 声明的变量存在于最近的函数或全局作用域中，没有块级作用域的机制。

没有块作用域很容易污染全局，下面函数中的变量污染了全局环境

```js
function run() {
  web = "tydumpling";
}
run();
console.log(web); //tydumpling
```

没有块作用作用域时 var 也会污染全局

```js
for (var i = 0; i < 10; i++) {
  console.log(i);
}
console.log(i);
```

下例中体验到 `var` 没有块作用域概念， `do/while` 定义的变量可以在块外部访问到

```js
var num = 0;

function show() {
  var step = 10;
  do {
    var res = 0;
    console.log(num = step++);
    res = num;
  } while (step < 20);
  console.log(`结果是${res}`);
}
show();
```

`var` 全局声明的变量也存在于 `window`对象中

```js
var hd = "tydumpling";
console.log(window.hd); //tydumpling
```

以往没有块任用时使用立即执行函数模拟块作用域

```js
(function() {
  var $ = this.$ = {};
  $.web = "tydumpling";
}.bind(window)());
console.log($.web);
```

### let

与 `var` 声明的区别是 `let/const` 拥有块作用域，下面代码演示了块外部是无法访问到`let`声明的变量。

- 建议将`let`在代码块前声明
- 用逗号分隔定义多个

`let`存在块作用域特性，变量只在块域中有效

```js
if (true) {
    let web = 'duyidao',url = 'tydumpling.com';
    console.log(web); //duyidao
}
console.log(web); //web is not defined
```

块内部是可以访问到上层作用域的变量

```js
if (true) {
  let user = "tydumpling";
  (function() {
    if (true) {
      console.log(`这是块内访问：${user}`); // 这是块内访问：tydumpling
    }
  })();
}
console.log(user); // tydumpling
```

每一层都是独立作用域，里层作用域可以声明外层作用域同名变量，但不会改变外层变量

```js
function run() {
  hd = "tydumpling";
  if (true) {
    let hd = "duyidao";
    console.log(hd); //duyidao
  }
  console.log(hd); //tydumpling
}
run();
```

### const

使用 `const` 用来声明常量，这与其他语言差别不大，比如可以用来声明后台接口的 URI 地址。

- 常量名建议全部大写
- 只能声明一次变量
- 声明时必须同时赋值
- 不允许再次全新赋值
- 可以修改引用类型变量的值
- 拥有块、函数、全局作用域

常量不允许全新赋值举例

```js
try {
  const URL = "https://www.tydumpling.com";
  URL = "https://www.duyidao.com"; //产生错误
} catch (error) {
  throw new Error(error);
}
```

改变常量的引用类型值

```js
const INFO = {
  url: 'https://duyidao.gitee.com',
  port: '8080'
};
INFO.port = '443';
console.log(INFO); // {url:'https://duyidao.gitee.com',port: '443'}
```

在不同作用域中可以重名定义常量，如下所示

```js
const NAME = 'tydumpling';

function show() {
  const NAME = 'duyidao';
  return NAME;
}
console.log(show()); // duyidao
console.log(NAME); // tydumpling
```

## 全局

### 全局对象

使用 `var` 声明会挂载到全局中，如果使用部分 `window` 重名方法会覆盖，如下所示：

```js
var screenLeft = 80
console.log(window.screenLeft) // 80
```

`window.screenLeft` 是用于获取屏幕大小的方法，但是用 `var` 声明同名方法后会造成覆盖，此时获取到的一直是自己声明的值。

### 全局污染

变量声明如果不用 `var/let/const` 进行变量声明，变量会隐式变为全局变量，造成变量全局污染。

```js
function fn() {
	web = 'tydumpling'
}
console.log(web) // tydumpling
```

### 重复定义

使用 var 可能造成不小心定义了同名变量

```js
//优惠价
var price = 90;
//商品价格
var price = 100;
console.log(`商品优惠价格是:${price}`);
```

使用`let` 可以避免上面的问题，因为 let 声明后的变量不允许在同一作用域中重新声明

```js
let web = 'tydumpling.com';
let web = 'tydumpling'; //Identifier 'web' has already been declared
```

不同作用域可以重新声明

```js
let web = 'tydumpling.com';
if (true) {
	let web = 'tydumpling'; //Identifier 'web' has already been declared
}
```

但可以改变值这是与 const 不同点

```js
let price = 90;
price = 88;
console.log(`商品价格是:${price}`);
```

`let` 全局声明的变量不存在于 `window`对象中，这与`var`声明不同

```js
let hd = "duyidao";
console.log(window.hd); //undefined
```

##  Object.freeze

如果冻结变量后，变量也不可以修改了，使用严格模式会报出错误。

```js
"use strict"
const INFO = {
  url: 'https://www.tydumpling.com',
  port: '8080'
};
Object.freeze(INFO);
INFO.port = '443'; //Cannot assign to read only property
console.log(INFO);
```

## 传值与传址

基本数据类型指数值、字符串等简单数据类型，引用类型指对象数据类型。

基本类型复制是值的复制，互相不受影响。下例中将 a 变量的值赋值给 b 变量后，因为基本类型变量是独立的所以 a 的改变不会影响 b 变量的值。

```js
let a = 100;
let b = a;
a = 200;
console.log(b); // 100
```

对于引用类型来讲，变量保存的是引用对象的指针。变量间赋值时其实赋值是变量的指针，这样多个变量就引用的是同一个对象。

```js
let a = {
  web: "tydumpling"
};
let b = a;
a.web = "tydumpling";
console.log(b); // {web: 'tydumpling'}
```

## undefined 与 null

### undefined

对声明但未赋值的变量返回类型为 `undefined` 表示值未定义。

```js
let hd;
console.log(typeof hd);
```

对未声明的变量使用会报错，但判断类型将显示 `undefined`。

![image-20191003194105707](https://doc.tydumpling.com/assets/img/image-20191003194105707.a5cd9f56.png)

```js
console.log(typeof tydumpling);
console.log(tydumpling);
```

我们发现未赋值与未定义的变量值都为 `undefined` ，建议声明变量设置初始值，这样就可以区分出变量状态了。

函数参数或无返回值是为`undefined`

```js
function hd(web) {
  console.log(web); //undefined
  return web;
}
console.log(hd()); //undefined
```

### null

`null` 用于定义一个空对象，即如果变量要用来保存引用类型，可以在初始化时将其设置为 null

```js
var hd = null;
console.log(typeof hd);
```

### 总结

基础类型 `null` 引用类型 `undefined` 。

# 严格模式

严格模式可以让我们及早发现错误，使代码更安全规范，推荐在代码中一直保持严格模式运行。

> 主流框架都采用严格模式，严格模式也是未来 JS 标准，所以建议代码使用严格模式开发

## 基本差异

变量必须使用关键词声明，未声明的变量不允许赋值

```js
"use strict";
url = 'tydumpling.com'; //url is not defined
```

强制声明防止污染全局

```js
"use strict";
function run() {
  web = "tydumpling";
}
run();
console.log(web); // 报错
```

关键词不允许做变量使用

```js
"use strict";
var public = 'tydumpling.com'; // 报错
```

变量参数不允许重复定义

```js
"use strict";
//不允许参数重名
function hd(name, name) {}
```

单独为函数设置严格模式

```js
function strict(){
  "use strict";
  return "严格模式";
}
function notStrict() {
  return "正常模式";
}
```

为了在多文件合并时，防止全局设置严格模式对其他没使用严格模式文件的影响，将脚本放在一个执行函数中。

```js
(function () {
  "use strict";
  url = 'tydumpling.com';
})();
```

### 解构差异

非严格模式可以不使用声明指令

```js
// "use strict";
({name,url} = {name:'tydumpling',url:'tydumpling.com'});
console.log(name, url); // {name:'tydumpling',url:'tydumpling.com'}
```

严格模式下必须使用声明。所以建议使用 let 等声明。

```js
"use strict";
({name,url} = {name:'tydumpling',url:'tydumpling.com'});
console.log(name, url); // 报错
```

> 使用严格模式编码总是推荐的