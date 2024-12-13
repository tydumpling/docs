# 函数

## 基础知识

函数是将复用的代码块封装起来的模块，在 JS 中函数还有其他语言所不具有的特性，接下来我们会详细掌握使用技巧。

### 声明定义

在 JS 中函数也是对象函数是`Function`类的创建的实例，下面的例子可以方便理解函数是对象。

```js
let hd = new Function("title", "console.log(title)"); // 参数1：函数名称；参数2：函数体
hd('tydumpling'); // tydumpling
```

标准语法是使用函数声明来定义函数

```js
function hd(num) {
	return ++num;
}
console.log(hd(3)); // 4
```

对象字面量属性函数简写

```js
let user = {
  name: null,
  getName: function (name) {
  	return this.name;
  },
  //简写形式
  setName(value) {
  	this.name = value;
  }
}
user.setName('tydumpling');
console.log(user.getName()); // tydumpling
```

全局函数会声明在 `window` 对象中，这不正确建议使用后面章节的模块处理

```js
console.log(window.screenX); //2200
```

当我们定义了 `screenX` 函数后就覆盖了 `window.screenX` 方法

```js
function screenX() {
  return "tydumpling";
}
console.log(window.screenX); //tydumpling
```

使用`let/const`时不会压入 `window`

```js
let hd = function() {
  console.log("tydumpling");
};
window.hd(); //window.hd is not a function
```

### 匿名函数

函数是对象所以可以通过赋值来指向到函数对象的指针，当然指针也可以传递给其他变量，注意后面要以`;`结束。下面使用函数表达式将 `匿名函数` 赋值给变量

```js
let hd = function(num) {
  return ++num;
};

console.log(hd instanceof Object); //true

let cms = hd;
console.log(cms(3)); // 4
```

标准声明的函数优先级更高，解析器会优先提取函数并放在代码树顶端，所以标准声明函数位置不限制，所以下面的代码可以正常执行。

```js
console.log(hd(3));
function hd(num) {
	return ++num;
};
```

标准声明优先级高于赋值声明

```js
console.log(hd(3)); //4

function hd(num) {
  return ++num;
}

var hd = function(num) {
  return "hd" + num;
};
// 后面使用会覆盖前一个
console.log(hd(3)); // hd3
```

程序中使用匿名函数的情况非常普遍

```js
function sum(...args) {
  return args.reduce((a, b) => a + b);
}
console.log(sum(1, 2, 3));
```

### 立即执行

立即执行函数指函数定义时立即执行

- 可以用来定义私有作用域防止污染全局作用域

  ```js
  "use strict";
  (function () {
      var web = 'duyidao';
  })();
  console.log(web); //web is not defined
  ```

  通过 `window` 把参数传递出去。

  ```js
  (function (window) {
      var web = 'duyidao';
      window.webout = web
  })(window);
  console.log(webout); // duyidao
  ```

- 使用 `let/const` 有块作用域特性，所以使用以下方式也可以产生私有作用域

  ```js
  {
  	let web = 'duyidao';
  }
  console.log(web); //web is not defined
  ```

  同理可使用 `window` 。

  ```js
  {
  	let web = 'duyidao';
       window.webout = web
  }
  console.log(webout); // duyidao
  ```

  

### 函数提升

函数也会提升到前面，优先级行于`var`变量提高

```js
console.log(hd()); //tydumpling
function hd() {
	return 'tydumpling';
}
```

变量函数定义不会被提升

```js
console.log(fn()); // 报错fn is not a function

var fn = function () {
	return 'tydumpling.com';
}

console.log(hd()); //tydumpling

function hd() {
	return 'tydumpling';
}
var hd = function () {
	return 'tydumpling.com';
}
```

### 形参实参

形参是在函数声明时设置的参数，实参指在调用函数时传递的值。

- 形参数量大于实参时，没有传参的形参值为 `undefined`
- 实参数量大于形参时，多于的实参将忽略并不会报错

```js
// n1,n2 为形参
function sum(n1, n2) {
	return n1+n2;
}
// 参数 2,3 为实参
console.log(sum(2, 3)); //5
```

当没传递参数时值为 `undefined`

```js
function sum(n1, n2) {
  return n1 + n2;
}
console.log(sum(2)); // NaN
```

### 默认参数

下面通过计算年平均销售额来体验以往默认参数的处理方式

```js
//total:总价 year:年数
function avg(total, year) {
  year = year || 1;
  return Math.round(total / year);
}
console.log(avg(2000, 3));
```

使用新版本默认参数方式如下

```js
function avg(total, year = 1) {
  return Math.round(total / year);
}
console.log(avg(2000, 3));
```

下面通过排序来体验新版默认参数的处理方式，下例中当不传递 type 参数时使用默认值 asc。

```js
function sortArray(arr, type = 'asc') {
	return arr.sort((a, b) => type == 'asc' ? a - b : b - a);
}
console.log(sortArray([1, 3, 2, 6], 'desc'));
```

默认参数要放在最后面

```js
//total:价格,discount:折扣,dis:折后折
function sum(total, discount = 0, dis = 0) {
  return total * (1 - discount) * (1 - dis);
}
console.log(sum(2000, undefined, 0.3));
```

### 函数参数

函数可以做为参数传递，这也是大多数语言都支持的语法规则。

```html
<body>
    <button>订阅</button>
</body>
<script>
    document.querySelector('button').addEventListener('click', function () {
        alert('感谢订阅');
    })
</script>
```

函数可以做为参数传递

```js
function filterFun(item) {
	return item <= 3;
}
let hd = [1, 2, 3, 4, 5].filter(filterFun);
console.log(hd); //[1,2,3]

function times(i = 1) {
    console.log(i++)
}
setTimeInterval(times, 1000)
```

### arguments

`arguments` 是函数获得到所有参数集合，下面是使用 `arguments` 求和的例子

```js
function sum() {
  console.log(arguments) // 2, 3, 4, 2, 6
  return [...arguments].reduce((total, num) => {
    return (total += num);
  }, 0);
}
console.log(sum(2, 3, 4, 2, 6)); //17
```

更建议使用展示语法

```js
function sum(...args) {
 console.log(args) // [2, 3, 4, 2, 6]
 return args.reduce((a, b) => a + b);
}
console.log(sum(2, 3, 4, 2, 6)); //17
```

存储了传递的所有实参，展示形式是一个伪数组。

特性：

1. 具有 `length` 属性
2. 按照索引的方式进行存储
3. 没有真正数组的一些方法。如 `pop()` 、`push()` 等

```js
function getSum() {
   console.log(arguments);  // Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]
   arguments.push(4)
}
getSum(1, 2, 3)
```

![error](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f25f57b0c5fa49f5bf3f1a2a00b9f3d4~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

### 箭头函数

箭头函数是函数声明的简写形式，在使用递归调用、构造函数、事件处理器时不建议使用箭头函数。

无参数时使用空扩号即可

```js
let sum = () => {
	return 1 + 3;
}
console.log(sum()); //4
```

函数体为单一表达式时不需要 `return` 返回处理，系统会自动返回表达式计算结果。

```js
let sum = () => 1 + 3;
console.log(sum()); //4
```

多参数传递与普通声明函数一样使用逗号分隔

```js
let hd = [1, 8, 3, 5].filter((item, index) => {
	return item <= 3;
});
console.log(hd);
```

只有一个参数时可以省略括号

```js
let hd = [1, 8, 3, 5].filter(item => item <= 3);
console.log(hd);
```

### 递归调用

递归指函数内部调用自身的方式。

- 主要用于数量不确定的循环操作
- 要有退出时机否则会陷入死循环

下面通过阶乘来体验递归调用

```js
function factorial(num = 3) {
	return num == 1 ? num : num * factorial(--num);
}
console.log(factorial(5)); //120
```

累加计算方法

```js
function sum(...num) {
	return num.length == 0 ? 0 : num.pop() + sum(...num);
}
console.log(sum(1, 2, 3, 4, 5, 7, 9)); //31
```

递归打印倒三角

```js
******
*****
****
***
**
*

function star(row = 5) {
  if (row == 0) return "";
  document.write("*".repeat(row) + "<br/>");
  star(--row);
}
```

使用递归修改课程点击数

```js
let lessons = [
  {
    title: "媒体查询响应式布局",
    click: 89
  },
  {
    title: "FLEX 弹性盒模型",
    click: 45
  },
  {
    title: "GRID 栅格系统",
    click: 19
  },
  {
    title: "盒子模型详解",
    click: 29
  }
];
function change(lessons, num, i = 0) {
  if (i == lessons.length) {
    return lessons;
  }
  lessons[i].click += num;
  return change(lessons, num, ++i);
}
console.table(change(lessons, 100));
```

### 回调函数

在某个时刻被其他函数调用的函数称为回调函数，比如处理键盘、鼠标事件的函数。

```js
<button id='hd'>button</button>
<script>
     document.getElementById('hd').addEventListener('click', () => alert('通过回调函数调用'));
</script>
```

使用回调函数递增计算

```js
let hd = ([1, 2, 3]).map(item => item + 10);
console.log(hd)
```

### 展开语法

展示语法或称点语法体现的就是`收/放`特性，做为值时是`放`，做为接收变量时是`收`。

```js
let hd = [1, 2, 3];
let [a, b, c] = [...hd];
console.log(a); //1
console.log(b); //2
console.log(c); //3
[...hd] = [1, 2, 3];
console.log(hd); //[1, 2, 3]
```

使用展示语法可以替代 `arguments` 来接收任意数量的参数

```js
function hd(...args) {
  console.log(args);
}
hd(1, 2, 3, "tydumpling"); //[1, 2, 3, "tydumpling"]
```

也可以用于接收部分参数

```js
function hd(site, ...args) {
  console.log(site, args); //tydumpling (3) [1, 2, 3]
}
hd("tydumpling", 1, 2, 3);
```

使用 `...` 可以接受传入的多个参数合并为数组，下面是使用点语法进行求合计算。

```js
function sum(...params) {
	console.log(params);
	return params.reduce((pre, cur) => pre + cur);
}
console.log(sum(1, 3, 2, 4));
```

多个参数时`...参数`必须放后面，下面计算购物车商品折扣

```js
function sum(discount = 0, ...prices) {
  let total = prices.reduce((pre, cur) => pre + cur);
  return total * (1 - discount);
}
console.log(sum(0.1, 100, 300, 299));
```

### 标签函数

使用函数来解析标签字符串，第一个参数是字符串值的数组，其余的参数为标签变量。

```js
function hd(str, ...values) {
  console.log(str); //["站点", "-", "", raw: Array(3)]
  console.log(values); //["tydumpling", "duyidao.com"]
}
let name = 'tydumpling',url = 'duyidao.com';
hd `站点${name}-${url}`;
```

## this

调用函数时 `this` 会隐式传递给函数指函数调用时的关联对象，也称之为函数的上下文。

### 函数调用

全局环境下`this`就是 window 对象的引用

```html
<script>
  console.log(this == window); //true
</script>
```

使用严格模式时在全局函数内`this`为`undefined`

```js
var hd = 'tydumpling';
function get() {
  "use strict"
  return this.hd;
}
console.log(get());
//严格模式将产生错误 Cannot read property 'name' of undefined
```

### 方法调用

函数为对象的方法时`this` 指向该对象

可以使用多种方式创建对象，下面是使用构造函数创建对象

**构造函数**

函数当被 `new` 时即为构造函数，一般构造函数中包含属性与方法。函数中的上下文指向到实例对象。

- 构造函数主要用来生成对象，里面的 this 默认就是指当前对象

```js
function User() {
  this.name = "tydumpling";
  this.say = function() {
    console.log(this); //User {name: "tydumpling", say: ƒ}
    return this.name;
  };
}
let hd = new User();
console.log(hd.say()); //tydumpling
```

**对象字面量**

- 下例中的 hd 函数不属于对象方法所以指向`window`
- show 属于对象方法执向 `obj`对象

```js
let obj = {
  site: "tydumpling",
  show() {
    console.log(this.site); //tydumpling
    console.log(`this in show method: ${this}`); //this in show method: [object Object]
    function hd() {
      console.log(typeof this.site); //undefined
      console.log(`this in hd function: ${this}`); //this in hd function: [object Window]
    }
    hd();
  }
};
obj.show();
```

在方法中使用函数时有些函数可以改变 this 如`forEach`，当然也可以使用后面介绍的`apply/call/bind`

```js
let Lesson = {
  site: "tydumpling",
  lists: ["js", "css", "mysql"],
  show() {
    return this.lists.map(function(title) {
      return `${this.site}-${title}`;
    }, this);
  }
};
console.log(Lesson.show());
```

也可以在父作用域中定义引用`this`的变量

```js
let Lesson = {
    site: "tydumpling",
    lists: ["js", "css", "mysql"],
    show() {
      const self = this;
      return this.lists.map(function(title) {
        return `${self.site}-${title}`;
      });
    }
  };
  console.log(Lesson.show());
```

### 箭头函数

箭头函数没有`this`, 也可以理解为箭头函数中的`this` 会继承定义函数时的上下文，可以理解为和外层函数指向同一个 this。

> 如果想使用函数定义时的上下文中的 `this`，那就使用箭头函数

下例中的匿名函数的执行环境为全局所以 `this` 指向 `window`。

```js
var name = 'tydumpling';
var obj = {
  name: 'tydumpling',
  getName: function () {
    return function () {
    	return this.name;
    }
  }
}
console.log(obj.getName()()); //返回window.name的值tydumpling
```

以往解决办法会匿名函数调用处理定义变量，然后在匿名函数中使用。

```js
var name = 'tydumpling';
var obj = {
  name: 'tydumpling',
  getName: function () {
    var self = this;
		return () => {
    	return this.name;
    }
  }
}
console.log(obj.getName()()); //返回window.name的值tydumpling
```

使用箭头函数后 `this` 为定义该函数的上下文，也可以理解为定义时父作用域中的`this`

```js
var name = 'tydumpling';
var obj = {
  name: 'tydumpling',
  getName: function () {
    return () => {
    	return this.name;
    }
  }
}
console.log(obj.getName()()); //tydumpling
```

事件中使用箭头函数结果不是我们想要的

- 事件函数可理解为对象`onclick`设置值，所以函数声明时`this`为当前对象
- 但使用箭头函数时`this`为声明函数上下文

下面体验使用普通事件函数时`this`指向元素对象

使用普通函数时`this`为当前 DOM 对象

```html
<body>
  <button desc="tydumpling">button</button>
</body>
<script>
  let Dom = {
    site: "tydumpling",
    bind() {
      const button = document.querySelector("button");
      button.addEventListener("click", function() {
        alert(this.getAttribute("desc"));
      });
    }
  };
  Dom.bind();
</script>
```

下面是使用箭头函数时 this 指向上下文对象

```html
<body>
  <button desc="tydumpling">button</button>
</body>
<script>
  let Dom = {
    site: "tydumpling",
    bind() {
      const button = document.querySelector("button");
      button.addEventListener("click", event => {
        alert(this.site + event.target.innerHTML);
      });
    }
  };
  Dom.bind();
</script>
```

使用`handleEvent`绑定事件处理器时，`this`指向当前对象而不是 DOM 元素。

> `handleEvent()` 
>
> 当 `EventListener` 所注册的事件发生的时候，该方法会被调用。可以把任意对象注册为事件处理程序，只要它拥有 `handleEvent` 方法

```html
<body>
  <button desc="tydumpling">button</button>
</body>
<script>
  let Dom = {
    site: "tydumpling",
    handleEvent: function(event) {
      console.log(this);
    },
    bind() {
      const button = document.querySelector("button");
      button.addEventListener("click", this);
    }
  };
  Dom.bind();
</script>
```

## 总结

箭头函数this指向上下级父级的this，普通函数this指向全局。

## apply/call/bind

改变 this 指针，也可以理解为对象借用方法，就现像生活中向邻居借东西一样的事情。

### 原理分析

构造函数中的`this`默认是一个空对象，然后构造函数处理后把这个空对象变得有值。

```js
function User(name) {
  this.name = name;
}
let hd = new User("tydumpling");
console.log(hd) // User {name: 'tydumpling'}
```

可以改变构造函数中的空对象，即让构造函数 this 指向到另一个对象。

```js
function User(name) {
  this.name = name;
}

let tydumpling = {age: 20};
User.call(tydumpling, "tydumpling");
console.log(tydumpling); // User {name: 'tydumpling', age: 20}
```

### apply/call

`call` 与 `apply` 用于显示的设置函数的上下文，两个方法作用一样都是将对象绑定到 this，只是在传递参数上有所不同。

- `apply` 用数组传参
- `call` 需要分别传参
- 与 `bind` 不同 `call`/`apply` 会立即执行函数

语法使用介绍

```js
function show(title) {
    alert(`${title+this.name}`);
}
let lisi = {
    name: '李四'
};
let wangwu = {
    name: '王五'
};
show.call(lisi, 'tydumpling'); // tydumpling李四
show.apply(wangwu, ['tydumpling']); // tydumpling王五
```

使用 `call` 设置函数上下文

```html
<body>
    <button message="tydumpling">button</button>
    <button message="tydumpling">button</button>
</body>
<script>
    function show() {
        alert(this.getAttribute('message'));
    }
    let bts = document.getElementsByTagName('button');
    for (let i = 0; i < bts.length; i++) {
        bts[i].addEventListener('click', () => show.call(bts[i]));
    }
</script>
```

找数组中的数值最大值

```js
let arr = [1, 3, 2, 8];
console.log(Math.max(arr)); //NaN
console.log(Math.max.apply(Math, arr)); //8
 console.log(Math.max(...arr)); //8
```

#### 练习

实现构造函数属性继承

```js
function Learn(params) {
  this.url = '/learn/js'
  Request.call(this)
}

function Product(params) {
  this.url = '/product/music'
  Request.call(this)
}

function Request() {
  this.axios = function(params) {
    // 获取对象key值并遍历赋值等号
    let arr = Object.keys(params).map(k => {
      return `${k}=${params[k]}`
    })
    // 此时的this指向各自的构造函数
    return `${this.url}?${arr.join('&')}`
  }
}

let learn = new Learn()
console.log(learn.axios({id: 1, name: 'tydumpling'})); // /learn/js?id=1&name=tydumpling

let product = new Product()
console.log(product.axios({id: 2, name: 'duyidao'})) // /product/music?id=2&name=duyidao
```

制作显示隐藏面板

```html
<style>
    * {
        padding: 0;
        margin: 0;
    }

    body {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
    }

    dl {
        width: 400px;
        display: flex;
        flex-direction: column;
    }

    dt {
        background: #e67e22;
        border-bottom: solid 2px #333;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    dd {
        height: 200px;
        background: #bdc3c7;
        font-size: 5em;
        js-align: center;
        line-height: 200px;
    }
</style>

<body>
    <dl>
        <dt>tydumpling</dt>
        <dd>1</dd>
        <dt>tydumpling</dt>
        <dd hidden="hidden">2</dd>
    </dl>
</body>
<script>
  function panel(i) {
    let dds = document.querySelectorAll("dd");
    dds.forEach(item => item.setAttribute("hidden", "hidden"));
    dds[i].removeAttribute("hidden");
  }
  document.querySelectorAll("dt").forEach((dt, i) => {
    dt.addEventListener("click", () => panel.call(null, i));
  });
</script>
```

### bind

`bind()` 是将函数绑定到某个对象，比如 `a.bind(hd)` 可以理解为将 a 函数绑定到 hd 对象上即 `hd.a()` 。

- 与 `call/apply` 不同 `bind` 不会立即执行
- `bind` 是复制函数形为会返回新函数

`bind` 是复制函数行为，赋值后得到的是新函数的地址

```js
let a = function() {};
let b = a;
console.log(a === b); //true
//bind是新复制函数
let c = a.bind();
console.log(a == c); //false
```

由于它不立即执行，返回一个新函数，因此有两次传参的机会，一次在bind，一次在调用新函数。

```js
function hd(a, b) {
  return this.f + a + b;
}

//使用bind会生成新函数
let newFunc = hd.bind({ f: 1 }, 3);

//1+3+2 参数2赋值给b即 a=3,b=2
console.log(newFunc(2));
```

在事件中使用`bind`

```html
<body>
  <button>tydumpling</button>
</body>
<script>
  document.querySelector("button").addEventListener(
    "click",
    function(event) {
      console.log(event.target.innerHTML + this.url);
    }.bind({ url: "duyidao.com" })
  );
</script>
```

#### 练习

动态改变元素背景颜色，当然下面的例子也可以使用箭头函数处理

```html
<style>
  * {
    padding: 0;
    margin: 0;
  }

  body {
    width: 100vw;
    height: 100vh;
    font-size: 3em;
    padding: 30px;
    transition: 2s;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #34495e;
    color: #34495e;
  }
</style>
<body>
  duyidao.com
</body>
<script>
  function Color(elem) {
    this.elem = elem;
    this.colors = ["#74b9ff", "#ffeaa7", "#fab1a0", "#fd79a8"];
    this.run = function() {
      setInterval(
        function() {
          // 不添加bind，this指向window
          let pos = Math.floor(Math.random() * this.colors.length);
          this.elem.style.background = this.colors[pos];
        }.bind(this),
        1000
      );
    };
  }
  let obj = new Color(document.body);
  obj.run();
</script>
```

