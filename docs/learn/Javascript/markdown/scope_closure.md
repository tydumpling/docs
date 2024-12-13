# 作用域与闭包

## 作用域

### 含义

就是代码名字（变量）在某个范围内起作用和效果，目的是为了提高程序的可靠性，且减少命名冲突。

### 作用域分类

| 作用域分类 | 特点                                                         |
| ---------- | ------------------------------------------------------------ |
| 全局作用域 | 整个 `script` 标签，或者是一个单独的 `js` 文件               |
| 局部作用域 | 在函数内部的作用域，这个代码的名字只能在函数内部起效果或作用（又被称为函数作用域） |
| 块级作用域 | 块作用域由 `{}` 包括， `if` 语句和 `for` 语句里面等          |

全局作用域只有一个，每个函数又都有作用域（环境）。

- 编译器运行时会将变量定义在所在作用域
- 使用变量时会从当前作用域开始向上查找变量
- 作用域就像攀亲亲一样，晚辈总是可以向上辈要些东西

### 变量作用域

1. 全局变量：全局作用域下的变量，全局都可使用（如果局部变量没有声明直接赋值，即没定义 `let` ，也会被看作全局变量）。
2. 局部变量：函数内部的作用域，只能在函数内部使用（函数的形参也可以看作是局部变量）。
3. 块级变量：只能在块作用域内访问，不能跨块访问。

> 注意：
>
> 若函数作用域内部或块级作用域内部没声明变量，直接赋值，则看成全局作用域，不建议这么做。

### 使用规范

作用域链只向上查找，找到全局 window 即终止，应该尽量不要在全局作用域中添加变量。

函数被执行后其环境变量将从内存中删除。下面函数在每次执行后将删除函数内部的 total 变量。

```js
function count() {
  let total = 0;
}
count();
```

函数每次调用都会创建一个新作用域

```js
let site = 'tydumpling';

function a() {
  let hd = 'tydumpling.com';

  function b() {
      let cms = 'duyidao.com';
      console.log(hd);
      console.log(site);
  }
  b();
}
a();
```

如果子函数被使用时父级环境将被保留

```js
function hd() {
  let n = 1;
  return function() {
    let b = 1;
    return function() {
      console.log(++n);
      console.log(++b);
    };
  };
}
let a = hd()();
a(); //2,2
a(); //3,3
let b = hd()();
b(); //2,2
b(); //3,3
```

构造函数也是很好的环境例子，子可以调用父级的变量，把show返回出去之后 因为show函数可能会存在调用a变量的代码所以 a会被保留，子函数被外部使用父级环境将被保留

```js
function User() {
  let a = 1;
  this.show = function() {
    console.log(a++);
  };
  // 相当于下面的写法
  // return {
  //   show: show
  // }
}
let a = new User(); // 这里的new 相当于 闭包函数里面的return 用了new 就不用手动return了
a.show(); //1
a.show(); //2
let b = new User();
b.show(); //1
```

### let/const

使用 `let/const` 可以将变量声明在块作用域中（放在新的环境中，而不是全局中）。使用 `var` 会把变量放在全局中。

```js
{
	let a = 9;
}
console.log(a); //ReferenceError: a is not defined
if (true) {
	var i = 1;
}
console.log(i);//1
console.log(window.i);//1
```

也可以通过下面的定时器函数来体验。

- 使用 `var` 定义会把变量放在全局中，因此500毫秒后获取到的是全局中最后的 `i` 变量
- 使用 `let` 定义会把 `i` 存储在块作用中，每一次迭代中重新生成不同的变量，500毫秒后再去获取该块作用域的变量，因此不会被污染。

```js
for (var i = 0; i <= 3; i++) {
  setTimeout(() => {
    console.log(i); // 4,4,4
  }, 500);
}

// -------------------------------

for (let i = 0; i <= 3; i++) {
  setTimeout(() => {
    console.log(i); // 1,2,3
  }, 500);
}
```

在没有`let/const` 的历史中使用以下方式产生作用域

```js
//自行构建闭包
var arr = [];
for (var i = 0; i < 10; i++) {
  (function (i) {
      setTimeout(() => {
    	console.log(i); // 1,2,3
  	  }, 500);
  })(i);
}
```

## 闭包

闭包指子函数可以访问外部作用域变量的函数特性，即使在子函数作用域外也可以访问。如果没有闭包那么在处理事件绑定，异步请求时都会变得困难。

- JS 中的所有函数都是闭包
- 闭包一般在子函数本身作用域以外执行，即延伸作用域

### 基本示例

前面在讲作用域时已经在使用闭包特性了，下面再次重温一下闭包。

```js
function hd() {
  let name = 'tydumpling';
  return function () {
  	return name;
  }
}
let duyidao = hd();
console.log(duyidao()); //tydumpling
```

使用闭包返回数组区间元素

```js
let arr = [3, 2, 4, 1, 5, 6];
function between(a, b) {
  return function(v) {
    return v >= a && v <= b;
  };
}
console.log(arr.filter(between(3, 5))); // 相当于 arr.filter(gunction(v) { return v>=a && v <= b })
```

下面是在回调函数中使用闭包，当点击按钮时显示当前点击的是第几个按钮。

```html
<body>
  <button message="tydumpling">button</button>
  <button message="duyidao">button</button>
</body>
<script>
  var btns = document.querySelectorAll("button");
  for (let i = 0; i < btns.length; i++) {
    btns[i].onclick = (function(i) {
      return function() {
        alert(`点击了第${i + 1}个按钮`);
      };
    })(i);
  }
</script>
```

### 移动动画

计时器中使用闭包来获取独有变量

```html
<body>
  <style>
    button {
      position: absolute;
    }
  </style>
  <button message="tydumpling">tydumpling</button>
  <!-- <button message="duyidao">duyidao</button> -->
</body>
<script>
  let btns = document.querySelectorAll("button");
  btns.forEach(function(item) {
    let bind = false;
    item.addEventListener("click", function() {
      if (!bind) {
        // 如果不为假，说明有定时器了，则不开辟新的空间触发新的定时器
        let left = 1;
        bind = setInterval(function() {
          item.style.left = left++ + "px";
        }, 100);
      }
    });
  });
</script>
```

### 闭包排序

下例使用闭包按指定字段排序

```js
let lessons = [
  {
    title: "媒体查询响应式布局",
    click: 89,
    price: 12
  },
  {
    title: "FLEX 弹性盒模型",
    click: 45,
    price: 120
  },
  {
    title: "GRID 栅格系统",
    click: 19,
    price: 67
  },
  {
    title: "盒子模型详解",
    click: 29,
    price: 300
  }
];
function order(params, type = 'asc') {
  return (a,b) => type === 'asc' ? a[params] - b[params] : b[params] - a[params] // 闭包原理，返回一个函数
}
console.table(lessons.sort(order("price")));
```

### 闭包问题

**内存泄漏**

闭包特性中上级作用域会为函数保存数据，从而造成的如下所示的内存泄漏问题

```html
<body>
  <div desc="tydumpling">在线学习</div>
  <div desc="duyidao">开源产品</div>
</body>
<script>
  let divs = document.querySelectorAll("div");
  divs.forEach(function(item) {
    item.addEventListener("click", function() {
      console.log(item.getAttribute("desc"));
    });
  });
</script>
```

下面通过清除不需要的数据解决内存泄漏问题

```js
let divs = document.querySelectorAll("div");
divs.forEach(function(item) {
  let desc = item.getAttribute("desc");
  item.addEventListener("click", function() {
    console.log(desc);
  });
  item = null;
});
```

**this 指向**

this 总是指向调用该函数的对象，即函数在搜索 this 时只会搜索到当前活动对象。

下面是函数因为是在全局环境下调用的，所以 this 指向 window，这不是我们想要的。

```js
let hd = {
  user: "tydumpling",
  get: function() {
    return function() {
      return this.user;
    };
  }
};
console.log(hd.get()()); //undefined
```

使用箭头函数解决这个问题

```js
let hd = {
  user: "tydumpling",
  get: function() {
    return () => this.user;
  }
};
console.log(hd.get()()); //undefined
```