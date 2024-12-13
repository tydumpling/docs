# 对象
## 基础知识

对象是包括属性与方法的数据类型，JS 中大部分类型都是对象如 `String/Number/Math/RegExp/Date` 等等。

传统的函数编程会有错中复杂的依赖很容易创造意大利式面条代码。

**面向过程编程**

```js
let name = "tydumpling";
let grade = [
  { lesson: "js", score: 99 },
  { lesson: "mysql", score: 85 }
];
function average(grade, name) {
  const total = grade.reduce((t, a) => t + a.score, 0);
  return name + ":" + total / grade.length + "分";
}
console.log(average(grade, name));
```

**面向对象编程**

下面使用对象编程的代码结构清晰，也减少了函数的参数传递，也不用担心函数名的覆盖

```js
let user = {
  name: 'tydumpling',
  grade: [
    {title: 'vue', score: 80},
    {title: 'axios', score: 85}
  ],
  average() {
    return `${this.name}'s grade is ${this.grade.reduce((total, obj) => total += obj.score, 0) / this.grade.length}`
  }
}

console.log(user.average());
```

### OOP

- 对象是属性和方法的集合即封装
- 将复杂功能隐藏在内部，只开放给外部少量方法，更改对象内部的复杂逻辑不会对外部调用造成影响即抽象
- 继承是通过代码复用减少冗余代码
- 根据不同形态的对象产生不同结果即多态

### 基本声明

使用字面量形式声明对象是最简单的方式

```js
let obj = {
  name: 'tydumpling',
  get:function() {
  	return this.name;
  }
}
console.log(obj.get()); //tydumpling
```

属性与方法简写

```js
let name = "tydumpling";
let obj = {
  name,
  get() {
    return this.name;
  }
};
console.log(obj.get()); //tydumpling
```

其实字面量形式在系统内部也是使用构造函数 `new Object`创建的，后面会详细介绍构造函数。

```js
let hd = {};
let tydumpling = new Object();
console.log(hd, tydumpling);
console.log(hd.constructor);
console.log(tydumpling.constructor);
```

### 操作属性

使用点语法获取

```js
let user = {
  name: "tydumpling"
};
console.log(user.name);
```

使用`[]` 获取

```js
console.log(user["name"]);
```

可以看出使用`.`操作属性更简洁，`[]`主要用于通过变量定义属性的场景

```js
let user = {
  name: "tydumpling"
};
let property = "name";
console.log(user[property]);
```

如果属性名不是合法变量名就必须使用扩号的形式了

```js
let user = {};
user["my-age"] = 28;
console.log(user["my-age"]);
```

对象和方法的属性可以动态的添加或删除。

```js
const hd = {
  name: "tydumpling"
};
hd.age = "10";
hd.show = function() {
  return `${this.name}已经${this.age}岁了`;
};
console.log(hd.show());
console.log(hd); // {name: "tydumpling", age: "10", show: f}

delete hd.show;
delete hd.age;

console.log(hd); // {name: "tydumpling"}
console.log(hd.age); //undefined
```

### 对象方法

定义在对象中的函数我们称为方法，下面定义了学生对象，并提供了计算平均成绩的方法

```js
let lisi = {
  name: "李四",
  age: 22,
  grade: {
    math: 99,
    english: 67
  },
  //平均成绩
  avgGrade: function() {
    let total = 0;
    for (const key in this.grade) {
      total += this.grade[key];
    }
    return total / this.propertyCount("grade");
  },
  //获取属性数量
  propertyCount: function(property) {
    let count = 0;
    for (const key in this[property]) count++;
    return count;
  }
};
console.log(lisi.avgGrade());
```

> 一个学生需要手动创建一个对象，这显然不实际的，下面的构造函数就可以解决这个问题

### 引用特性

对象和函数、数组一样是引用类型，即复制只会复制引用地址。

```js
let hd = { name: "tydumpling" };
let cms = hd;
cms.name = "xiaodao";
console.log(hd.name); //xiaodao
```

对象做为函数参数使用时也不会产生完全赋值，内外共用一个对象

```js
let user = { age: 22 };
function hd(user) {
  user.age += 10;
}
hd(user);
console.log(user.age); //32
```

对多的比较是对内存地址的比较所以使用 `==` 或 `===` 一样

```js
let hd = {};
let xj = hd;
let cms = {};
console.log(hd == xj); //true
console.log(hd === xj); //true
console.log(hd === cms); //false
```

### this

`this` 指当前对象的引用，始终建议在代码内部使用`this` 而不要使用对象名，不同对象的 this 只指向当前对象。

下例是不使用 `this` 时发生的错误场景

- 删除了`xj` 变量，但在函数体内还在使用`xj`变量造成错误
- 使用 `this` 后始终指向到引用地址，就不会有这个问题

```js
let xj = {
  name: "tydumpling",
  show() {
    return xj.name;
  }
};
let hd = xj;
xj = null;
console.log(hd.show()); //Error
```

改用`this` 后一切正常

```js
let xj = {
  name: "tydumpling",
  show() {
    return this.name;
  }
};
let hd = xj;
xj = null;
console.log(hd.show()); //Error
```

### 展开语法

使用`...`可以展示对象的结构，下面是实现对象合并的示例

```js
let hd = { name: "tydumpling", web: "houdurnen.com" };
let info = { ...hd, site: "xiaodao" };
console.log(info);
```

下面是函数参数合并的示例

```js
function upload(params) {
  let config = {
    type: "*.jpeg,*.png",
    size: 10000
  };
  params = { ...config, ...params };
  console.log(params);
}
upload({ size: 999 });
```

## 对象转换

### 基础知识

对象直接参与计算时，系统会根据计算的场景在 `string/number/default` 间转换。

- 如果声明需要字符串类型，调用顺序为 `toString > valueOf`
- 如果场景需要数值类型，调用顺序为 `valueOf > toString`
- 声明不确定时使用 `default` ，大部分对象的 `default` 会当数值使用

下面的数值对象会在数学运算时转换为 `number`

```js
let tydumpling = new Number(1);
console.log(tydumpling + 3); //4
```

如果参数字符串运长时会转换为 `string`

```js
let tydumpling = new Number(1);
console.log(tydumpling + "3"); //13
```

下面当不确定转换声明时使用 `default` ，大部分`default`转换使用 `number` 转换。

```js
let tydumpling = new Number(1);
console.log(tydumpling == "1"); //true
```

### Symbol.toPrimitive

内部自定义`Symbol.toPrimitive`方法用来处理所有的转换场景

```js
let hd = {
  num: 1,
  [Symbol.toPrimitive]: function() {
    return this.num;
  }
};
console.log(hd + 3); //4
```

### valueOf/toString

可以自定义`valueOf` 与 `toString` 方法用来转换，转换并不限制返回类型。

```js
let hd = {
  name: "tydumpling",
  num: 1,
  valueOf: function() {
    console.log("valueOf");
    return this.num;
  },
  toString: function() {
    console.log("toString");
    return this.name;
  }
};
console.log(hd + 3); //valueOf 4
console.log(`${hd}tydumpling`); //toString tydumplingtydumpling
```

## 解构赋值

解构是一种更简洁的赋值特性，可以理解为分解一个数据的结构，在数组章节已经介绍过。

- 建设使用 `var/let/const` 声明

### 基本使用

下面是基本使用语法

```js
//对象使用
let info = {name:'tydumpling',url:'tydumpling.com'};
let {name:n,url:u} = info
console.log(n); // tydumpling

//如果属性名与变量相同可以省略属性定义
let {name,url} = {name:'tydumpling',url:'tydumpling.com'};
console.log(name); // tydumpling
```

函数返回值直接解构到变量

```js
function hd() {
  return {
    name: 'tydumpling',
    url: 'tydumpling.com'
  };
}
let {name: n,url: u} = hd();
console.log(n);
```

函数传参

```js
"use strict";
function hd({ name, age }) {
  console.log(name, age); //tydumpling 18
}
hd({ name: "tydumpling", age: 18 });
```

系统函数解构练习，这没有什么意义只是加深解构印象

```js
const {random} =Math;
console.log(random());
```

### 严格模式

非严格模式可以不使用声明指令，严格模式下必须使用声明。所以建议使用 let 等声明。

```js
// "use strict";
({name,url} = {name:'tydumpling',url:'tydumpling.com'});
console.log(name, url);
```

还是建议使用`let`等赋值声明

```js
"use strict";
let { name, url } = { name: "tydumpling", url: "tydumpling.com" };
console.log(name, url);
```

### 简洁定义

如果属性名与赋值的变量名相同可以更简洁

```js
let web = { name: "tydumpling",url: "tydumpling.com" };
let { name, url } = web;
console.log(name); //tydumpling
```

只赋值部分变量

```js
let [,url]=['tydumpling','tydumpling.com'];
console.log(url);//tydumpling.com

let {name}= {name:'tydumpling',url:'tydumpling.com'};
console.log(name); //tydumpling
```

可以直接使用变量赋值对象属性

```js
let name = "tydumpling",url = "tydumpling.com";
//标准写法如下
let hd = { name: name, url: url };
console.log(hd);  //{name: "tydumpling", url: "tydumpling.com"}

//如果属性和值变量同名可以写成以下简写形式
let opt = { name, url };
console.log(opt); //{name: "tydumpling", url: "tydumpling.com"}
```

### 嵌套解构

可以操作多层复杂数据结构

```js
const hd = {
  name:'tydumpling',
  lessons:{
    title:'JS'
  }
}
const {name,lessons:{title}}  = hd;
console.log(name,title); // tydumpling JS
console.log(lessons); // lessons is not defined
```

### 默认值

为变量设置默认值

```js
let [name, site = 'xiaodao'] = ['tydumpling'];
console.log(site); //xiaodao

let {name,url,user='tydumpling'}= {name:'tydumpling',url:'tydumpling.com'};
console.log(name,user); // tydumpling, tydumpling
```

使用默认值特性可以方便的对参数预设

```js
function createElement(options) {
  let {
    width = '200px',
    height = '100px',
    backgroundColor = 'red'
  } = options;

  const h2 = document.createElement('h2');
  h2.style.width = width;
  h2.style.height = height;
  h2.style.backgroundColor = backgroundColor;
  document.body.appendChild(h2);
}
createElement({
	backgroundColor: 'green'
});
```

### 函数参数

数组参数的使用

```js
function hd([a, b]) {
	console.log(a, b);
}
hd(['tydumpling', 'duyidao']);
```

对象参数使用方法

```js
function hd({name,url,user='tydumpling'}) {
	console.log(name,url,user); //tydumpling tydumpling.com tydumpling
}
hd({name:'tydumpling', url:'tydumpling.com'});
```

对象解构传参

```js
function user(name, { sex, age } = {}) {
  console.log(name, sex, age); //tydumpling 男 18
}
user("tydumpling", { sex: "男", age: 18 });
```

## 属性管理

### 添加属性

可以为对象添加属性

```js
let obj = {name: "tydumpling"};
obj.site = "tydumpling.com";
console.log(obj);
```

### 删除属性

使用`delete` 可以删除属性（后面介绍的属性特性章节可以保护属性不被删除）

```js
let obj = { name: "tydumpling" };
delete obj.name;
console.log(obj.name); //undefined
```

### 检测属性

`hasOwnProperty`检测对象自身是否包含指定的属性，不检测原型链上继承的属性。

```js
let obj = { name: 'tydumpling'};
console.log(obj.hasOwnProperty('name')); //true
```

下面通过数组查看

```js
let arr = ["tydumpling"];
console.log(arr);
console.log(arr.hasOwnProperty("length")); //true
console.log(arr.hasOwnProperty("concat")); //false
console.log("concat" in arr); //true
```

使用 `in` 可以在原型对象上检测

```js
let obj = {name: "tydumpling"};
let hd = {
  web: "tydumpling.com"
};

//设置hd为obj的新原型
Object.setPrototypeOf(obj, hd);
console.log(obj);

console.log("web" in obj); //true
console.log(obj.hasOwnProperty("web")); //false
```

### 获取属性名

使用 `Object.getOwnPropertyNames` 可以获取对象的属性名集合

```js
let hd = { name: 'tydumpling', year: 2010 }
const names = Object.getOwnPropertyNames(hd)
console.log(names)
// ["name", "year"]
```

### assign

以往我们使用类似`jQuery.extend` 等方法设置属性，现在可以使用 `Object.assign` 静态方法

从一个或多个对象复制属性

```js
"use strict";
let hd = { a: 1, b: 2 };
hd = Object.assign(hd, { f: 1 }, { m: 9 });
console.log(hd); //{a: 1, b: 2, f: 1, m: 9}
```

### 计算属性

对象属性可以通过表达式计算定义，这在动态设置属性或执行属性方法时很好用。

```js
let id = 0;
const user = {
  [`id-${id++}`]: id,
  [`id-${id++}`]: id,
  [`id-${id++}`]: id
};
console.log(user);
```

使用计算属性为文章定义键名

```js
const lessons = [
  {
    title: "媒体查询响应式布局",
    category: "css"
  },
  {
    title: "FLEX 弹性盒模型",
    category: "css"
  },
  {
    title: "MYSQL多表查询随意操作",
    category: "mysql"
  }
];
let lessonObj = lessons.reduce((obj, cur, index) => {
  obj[`${cur["category"]}-${index}`] = cur;
  return obj;
}, {});
console.log(lessonObj); //{css-0: {…}, css-1: {…}, mysql-2: {…}}
console.log(lessonObj["css-0"]); //{title: "媒体查询响应式布局", category: "css"}
```

### 传值操作

对象是引用类型赋值是传址操作，后面会介绍对象的深、浅拷贝操作

```js
let user = {
	name: 'tydumpling'
};
let hd = {
	stu: user
};
hd.stu.name = 'tydumpling';
console.log(user); // {name: 'tydumpling'}
console.log(user.name); // xiaodao
```

## 遍历对象

### 获取内容

使用系统提供的 API 可以方便获取对象属性与值

```js
const hd = {
  name: "tydumpling",
  age: 10
};
console.log(Object.keys(hd)); //["name", "age"]
console.log(Object.values(hd)); //["tydumpling", 10]
console.table(Object.entries(hd)); //[["name","tydumpling"],["age",10]]
```

### for/in

使用`for/in`遍历对象属性

```js
const hd = {
  name: "tydumpling",
  age: 10
};
for (let key in hd) {
  console.log(key, hd[key]); // name tydumpling  ;  age 10
}
```

### for/of

`for/of`用于遍历迭代对象，不能直接操作对象。但`Object`对象的`keys/`方法返回的是迭代对象。

```js
const hd = {
  name: "tydumpling",
  age: 10
};

for (const key of hd) {
  console.log(key); // hd is not iterable
}

for (const key of Object.keys(hd)) {
  console.log(key); // name  ;  age
}
```

获取所有对象属性

```js
const hd = {
  name: "tydumpling",
  age: 10
};
for (const key of Object.values(hd)) {
  console.log(key); // tydumpling  ;  10
}
```

同时获取属性名与值

```js
for (const array of Object.entries(hd)) {
  console.log(array); // (2) ['name', 'tydumpling']  ;  (2) ['age', 10]
}
```

使用扩展语法同时获取属性名与值

```js
for (const [key, value] of Object.entries(hd)) {
  console.log(key, value); // name tydumpling  ;  age 10
}
```

添加元素 DOM 练习

```js
let lessons = [
  { name: "js", click: 23 },
  { name: "node", click: 192 }
];
let ul = document.createElement("ul");
for (const val of lessons) {
  let li = document.createElement("li");
  li.innerHTML = `课程:${val.name},点击数:${val.click}`;
  ul.appendChild(li);
}
document.body.appendChild(ul);
```

## 对象拷贝

对象赋值时复制的内存地址，所以一个对象的改变直接影响另一个

```js
let obj = {
  name: 'tydumpling',
  user: {
  	name: 'xiaodao'
  }
}
let a = obj;
let b = obj;
a.name = 'lisi';
console.log(b.name); //lisi
```

### 浅拷贝

使用`for/in`执行对象拷贝

```js
let obj = {name: "tydumpling"};

let hd = {};
for (const key in obj) {
  hd[key] = obj[key];
}

hd.name = "tydumpling";
console.log(hd); // {name: 'tydumpling'}
console.log(obj); // {name: 'tydumpling'}
```

`Object.assign` 函数可简单的实现浅拷贝，它是将两个对象的属性叠加后面对象属性会覆盖前面对象同名属性。

```js
let user = {
	name: 'tydumpling'
};
let hd = {
	stu: Object.assign({}, user)
};
hd.stu.name = 'tydumpling';
console.log(user.name);//tydumpling
```

使用展示语法也可以实现浅拷贝

```js
let obj = {
  name: "tydumpling"
};
let hd = { ...obj };
hd.name = "tydumpling";
console.log(hd); //  {name: 'tydumpling'}
console.log(obj); //  {name: 'tydumpling'}
```

### 深拷贝

浅拷贝不会将深层的数据复制

```js
let obj = {
    name: 'tydumpling',
    user: {
        name: 'xiaodao'
    }
}
let a = obj;
let b = obj;

function copy(object) {
    let obj = {}
    for (const key in object) {
        obj[key] = object[key];
    }
    return obj;
}
let newObj = copy(obj);
newObj.name = 'xiaodao';
newObj.user.name = 'tydumpling.com';
console.log(newObj);
console.log(obj);
```

是完全的复制一个对象，两个对象是完全独立的对象

```js
let data = {
  user: 'name',
  can: {
    eat: 'good',
    sleep: 'well'
  },
  learn: ['vue', 'js', 'axios']
}

function copy(params) {
  let res = params instanceof Object ? {} : [] // 判断当前是数组还是对象
  
  for (const [key, value] of Object.entries(params)) {
    // key为键，value为值。如果值是对象或数组，则递归，再一次执行拷贝函数
    res[key] = typeof value === 'object' ? copy(value) : value
  }

  return res
}

const fn = copy(data)

data.learn[1] = 'react'

console.log(JSON.stringify(fn, null, 2));
// result:
// {
//   "user": "name",
//   "can": {
//     "eat": "good",
//     "sleep": "well"
//   },
//   "learn": {
//     "0": "vue",
//     "1": "js",
//     "2": "axios"
//   }
// }
console.log(JSON.stringify(data, null, 2));
// result:
// {
//   "user": "name",
//   "can": {
//     "eat": "good",
//     "sleep": "well"
//   },
//   "learn": [
//     "vue",
//     "react",
//     "axios"
//   ]
// }
```

## 构建函数

对象可以通过内置或自定义的构造函数创建。

### 工厂函数

在函数中返回对象的函数称为工厂函数，工厂函数有以下优点

- 减少重复创建相同类型对象的代码
- 修改工厂函数的方法影响所有同类对象

使用字面量创建对象需要复制属性与方法结构

```js
const xj = {
  name: "tydumpling",
  show() {
    console.log(this.name);
  }
};
const hd = {
  name: "tydumpling",
  show() {
    console.log(this.name);
  }
};
```

使用工厂函数可以简化这个过程

```js
function stu(name) {
  return {
    name,
    show() {
      console.log(this.name);
    }
  };
}
const lisi = stu("李四");
lisi.show();
const xj = stu("tydumpling");
dd.show();
```

### 构造函数

和工厂函数相似构造函数也用于创建对象，它的上下文为新的对象实例。

- 构造函数名每个单词首字母大写即`Pascal` 命名规范
- `this`指当前创建的对象
- 不需要返回`this`系统会自动完成
- 需要使用`new`关键词生成对象

```js
function Student(name) {
  this.name = name;
  this.show = function() {
    console.log(this.name);
  };
  //不需要返回，系统会自动返回
  // return this;
}
const lisi = new Student("李四");
lisi.show();
const xj = new Student("tydumpling");
xj.show();
```

如果构造函数返回对象，实例化后的对象将是此对象

```js
function ArrayObject(...values) {
  const arr = new Array();
  arr.push.apply(arr, values);
  arr.string = function(sym = "|") {
    return this.join(sym);
  };
  return arr;
}
const array = new ArrayObject(1, 2, 3);
console.log(array);
console.log(array.string("-"));
```

### 严格模式

在严格模式下方法中的`this`值为 undefined，这是为了防止无意的修改 window 对象

```js
"use strict";
function User() {
  this.show = function() {
    console.log(this);
  };
}
let hd = new User();
hd.show(); //User

let xj = hd.show;
xj(); //undefined
```

### 内置构造

JS 中大部分数据类型都是通过构造函数创建的。

```js
const num = new Number(99);
console.log(num.valueOf());

const string = new String("tydumpling");
console.log(string.valueOf());

const boolean = new Boolean(true);
console.log(boolean.valueOf());

const date = new Date();
console.log(date.valueOf() * 1);

const regexp = new RegExp("\\d+");
console.log(regexp.test(99));

let hd = new Object();
hd.name = "tydumpling";
console.log(hd);
```

字面量创建的对象，内部也是调用了`Object`构造函数

```js
const hd = {
  name: "tydumpling"
};
console.log(hd.constructor); //ƒ Object() { [native code] }

//下面是使用构造函数创建对象
const xiaodao = new Object();
xiaodao.title = "开源内容管理系统";
console.log(xiaodao);
```

### 对象函数

在`JS`中函数也是一个对象

```js
function hd(name) {}

console.log(hd.toString());
console.log(hd.length);
```

函数是由系统内置的 `Function` 构造函数创建的

```js
function hd(name) {}

console.log(hd.constructor);
```

下面是使用内置构造函数创建的函数

```js
const User = new Function(`name`,`
  this.name = name;
  this.show = function() {
    return this.name;
  };
`
);

const lisi = new User("李四");
console.log(lisi.show());
```

## 抽象特性

将复杂功能隐藏在内部，只开放给外部少量方法，更改对象内部的复杂逻辑不会对外部调用造成影响即抽象。

下面的手机就是抽象的好例子，只开放几个按钮给用户，复杂的工作封装在手机内部，程序也应该如此。

### 问题分析

下例将对象属性封装到构造函数内部

```js
function User(name, age) {
  this.name = name;
  this.age = age;
  this.info = function() {
    return this.age > 50 ? "中年人" : "年轻人";
  };
  this.about = function() {
    return `${this.name}是${this.info()}`;
  };
}
let lisi = new User("李四", 22);
console.log(lisi.about()); // 李四是年轻人

lisi.about = function() {
    return '我要污染这个函数'
}
console.log(lisi.about()); // 我要污染这个函数
```

### 抽象封装

上例中的方法和属性仍然可以在外部访问到，比如 `info`方法只是在内部使用，不需要被外部访问到这会破坏程序的内部逻辑。

下面使用闭包特性将对象进行抽象处理

```js
function User(name, age) {
  let data = { name, age };
  let about = function() {
    return data.age > 50 ? "中年人" : "年轻人";
  };
  this.message = function() {
    return `${data.name}是${about()}`;
  };
}
let lisi = new User("tydumpling", 22);
console.log(lisi.message()); // tydumpling是年轻人

lisi.about = function() {
    return '我要污染这个函数'
}
console.log(lisi.message()); // tydumpling是年轻人
```

## 属性特征

JS 中可以对属性的访问特性进行控制。

### 查看特征

使用 `Object.getOwnPropertyDescriptor`查看对象单个属性的描述。参数2指定查看哪个属性。

```js
"use strict";
const user = {
  name: "tydumpling",
  age: 18
};
let desc = Object.getOwnPropertyDescriptor(user, "name"`);
console.log(JSON.stringify(desc, null, 2));
```

使用 `Object.getOwnPropertyDescriptors`查看对象所有属性的描述

```js
"use strict";
const user = {
  name: "tydumpling",
  age: 18
};
let desc = Object.getOwnPropertyDescriptors(user);
console.log(JSON.stringify(desc, null, 2));
```

属性包括以下四种特性

| 特性         | 说明                                                    | 默认值    |
| ------------ | ------------------------------------------------------- | --------- |
| configurable | 能否使用 delete、能否需改属性特性、或能否修改访问器属性 | true      |
| enumerable   | 对象属性是否可通过 for-in 循环，或 Object.keys() 读取   | true      |
| writable     | 对象属性是否可修改                                      | true      |
| value        | 对象属性的默认值                                        | undefined |

### 设置特征

使用`Object.defineProperty` 方法修改属性特性，通过下面的设置属性 name 将不能被遍历、删除、修改。

```js
"use strict";
const user = {
  name: "tydumpling"
};
Object.defineProperty(user, "name", {
  value: "tydumpling",
  writable: false,
  enumerable: false,
  configurable: false
});
```

通过执行以下代码对上面配置进行测试，请分别打开注释进行测试

```js
// 不允许修改
// user.name = "tydumpling"; //Error

// 不能遍历
// console.log(Object.keys(user));

//不允许删除
// delete user.name;
// console.log(user);

//不允许配置
// Object.defineProperty(user, "name", {
//   value: "tydumpling",
//   writable: true,
//   enumerable: false,
//   configurable: false
// });
```

使用 `Object.defineProperties` 可以一次设置多个属性，具体参数和上面介绍的一样。

```js
"use strict";
let user = {};
Object.defineProperties(user, {
  name: { value: "tydumpling", writable: false },
  age: { value: 18 }
});
console.log(user);
user.name = "tydumpling"; //TypeError
```

### 禁止添加

`Object.prevenjsensions` 禁止向对象添加属性

```js
"use strict";
const user = {
  name: "tydumpling"
};
Object.prevenjsensions(user);
user.age = 18; //Error
```

`Object.isExtensible` 判断是否能向对象中添加属性

```js
"use strict";
const user = {
  name: "tydumpling"
};
Object.prevenjsensions(user);
console.log(Object.isExtensible(user)); //false
```

### 封闭对象

`Object.seal()` 方法封闭一个对象，阻止添加新属性并将所有现有属性标记为 `configurable: false` 。

```js
"use strict";
const user = {
  name: "tydumpling",
  age: 18
};

console.log(
  JSON.stringify(Object.getOwnPropertyDescriptors(user), null, 2)
);

Object.seal(user);
console.log(Object.isSealed(user));
delete user.name; //Error
```

`Object.isSealed` 如果对象是密封的则返回 `true`，属性都具有 `configurable: false`。

```js
"use strict";
const user = {
  name: "tydumpling"
};
Object.seal(user);
console.log(Object.isSealed(user)); //true
```

### 冻结对象

`Object.freeze`  冻结对象后不允许添加、删除、修改属性，`writable`、`configurable` 都标记为`false` 。

```js
"use strict";
const user = {
  name: "tydumpling"
};
Object.freeze(user);
user.name = "tydumpling"; //Error
```

`Object.isFrozen()`方法判断一个对象是否被冻结

```js
"use strict";
const user = {
  name: "tydumpling"
};
Object.freeze(user);
console.log(Object.isFrozen(user));
```

## 属性访问器

`getter` 方法用于获得属性值，`setter` 方法用于设置属性，这是 JS 提供的存取器特性即使用函数来管理属性。

- 用于避免错误的赋值
- 需要动态监测值的改变
- 属性只能在访问器和普通属性任选其一，不能共同存在

### getter/setter

向对是地用户的年龄数据使用访问器监控控制

```js
"use strict";
const user = {
  data: { name: 'tydumpling', age: null },
  set age(value) {
    if (typeof value != "number" || value > 100 || value < 10) {
      throw new Error("年龄格式错误");
    }
    this.data.age = value;
  },
  get age() {
    return `年龄是: ${this.data.age}`;
  }
};
user.age = 99;
console.log(user.age);
```

下面使用 getter 设置只读的课程总价

```js
let Lesson = {
  lists: [
    { name: "js", price: 100 },
    { name: "mysql", price: 212 },
    { name: "vue.js", price: 98 }
  ],
  get total() {
    return this.lists.reduce((t, b) => t + b.price, 0);
  }
};
console.log(Lesson.total); //410
Lesson.total = 30; //无效
console.log(Lesson.total); //410
```

下面通过设置站网站名称与网址体验`getter/setter`批量设置属性的使用

```js
const web = {
  name: "tydumpling",
  url: "tydumpling.com",
  get site() {
    return `${this.name} ${this.url}`;
  },
  set site(value) {
    [this.name, this.url] = value.split(",");
  }
};
web.site = "tydumpling,xiaodao.com";
console.log(web.site);
```

下面是设置 token 储取的示例，将业务逻辑使用`getter/setter`处理更方便，也方便其他业务的复用。

```js
let Request = {
  get token() {
    let con = localStorage.getItem('token');
    if (!con) {
    	alert('请登录后获取token')
    } else {
    	return con;
    }
  },
  set token(con) {
  	localStorage.setItem('token', con);
  }
};
// Request.token = 'tydumpling'
console.log(Request.token);
```

定义内部私有属性

```js
"use strict";
const user = {
  get name() {
    return this._name;
  },
  set name(value) {
    if (value.length <= 3) {
      throw new Error("用户名不能小于三位");
    }
    this._name = value;
  }
};
user.name = "tydumpling";
console.log(user.name);
```

### 访问器描述符

使用 `defineProperty` 可以模拟定义私有属性，从而使用面向对象的抽象特性。

```js
function User(name, age) {
  let data = { name, age };
  Object.defineProperties(this, {
    name: {
      get() {
        return data.name;
      },
      set(value) {
        if (value.trim() == "") throw new Error("无效的用户名");
        data.name = value;
      }
    },
    age: {
      get() {
        return data.name;
      },
      set(value) {
        if (value.trim() == "") throw new Error("无效的用户名");
        data.name = value;
      }
    }
  });
}
let hd = new User("tydumpling", 33);
console.log(hd.name);
hd.name = "tydumpling";
console.log(hd.name);
```

上面的代码也可以使用语法糖 `class`定义

```js
"use strict";
const DATA = Symbol();
class User {
  constructor(name, age) {
    this[DATA] = { name, age };
  }
  get name() {
    return this[DATA].name;
  }
  set name(value) {
    if (value.trim() == "") throw new Error("无效的用户名");
    this[DATA].name = value;
  }
  get age() {
    return this[DATA].name;
  }
  set age(value) {
    if (value.trim() == "") throw new Error("无效的用户名");
    this[DATA].name = value;
  }
}
let hd = new User("tydumpling", 33);
console.log(hd.name);
hd.name = "tydumpling1";
console.log(hd.name);
console.log(hd);
```

### 闭包访问器

下面结合闭包特性对属性进行访问控制

- 下例中访问器定义在函数中，并接收参数 v
- 在 get() 中通过闭包返回 v
- 在 set() 中修改了 v，这会影响 get()访问的闭包数据 v

```js
let data = {
  name: 'tydumpling.com',
}
for (const [key, value] of Object.entries(data)) {
  observer(data, key, value)
}

function observer(data, key, v) {
  Object.defineProperty(data, key, {
    get() {
      return v
    },
    set(newValue) {
      v = newValue
    },
  })
}
data.name = 'tydumpling'
console.dir(data.name) //tydumpling
```

## 代理拦截

代理（拦截器）是对象的访问控制，`setter/getter` 是对单个对象属性的控制，而代理是对整个对象的控制。

- 读写属性时代码更简洁
- 对象的多个属性控制统一交给代理完成
- 严格模式下 `set` 必须返回布尔值

### 使用方法

代理对象时get方法有两个参数，set方法有三个参数，前两个参数相同。

- 参数一：代理的对象
- 参数二：当前使用的属性
- 参数三：传递过来的值

```js
"use strict";
const hd = { name: "tydumpling" };
const proxy = new Proxy(hd, {
  get(obj, property) {
    return obj[property];
  },
  set(obj, property, value) {
    obj[property] = value;
    return true;
  }
});
proxy.age = 10;
console.log(hd);
```

### 代理函数

如果代理以函数方式执行时，会执行代理中定义 `apply` 方法。

- 参数说明：函数，上下文对象，参数

下面使用 `apply` 计算函数执行时间

```js
function factorial(num) {
  return num == 1 ? 1 : num * factorial(num - 1);
}
let proxy = new Proxy(factorial, {
  apply(func, obj, args) {
    console.time("run");
    func.apply(obj, args);
    console.timeEnd("run");
  }
});
proxy.apply(this, [1, 2, 3]);
```

### 代理数组

代理数组有两个参数：

- 参数一：代理的数组元素
- 参数2：当前选中的索引（如果没有选择索引就没有该打印）

下例中对数组进行代理，用于截取标题操作

```js
const stringDot = {
  get(target, key) {
    const title = target[key].title;
    const len = 5;
    return title.length > len
      ? title.substr(0, len) + ".".repeat(3)
      : title;
  }
};
const lessons = [
  {
    title: "媒体查询响应式布局",
    category: "css"
  },
  {
    title: "FLEX 弹性盒模型",
    category: "css"
  },
  {
    title: "MYSQL多表查询随意操作",
    category: "mysql"
  }
];
const stringDotProxy = new Proxy(lessons, stringDot);
console.log(stringDotProxy[0]);
```

### 双向绑定

下面通过代理实现`vue` 等前端框架的数据绑定特性特性。

![Untitled](https://doc.tydumpling.com/assets/img/Untitled-5190245.5087f5bc.gif)

```html
<body>
<input type="js" v-model="title" />
<input type="js" v-model="title" />
<div v-bind="title"></div>
</body>
<script>
function View() {
	//设置代理拦截
  let proxy = new Proxy(
    {},
    {
      get(obj, property) {},
      set(obj, property, value) {
        obj[property] = value;
        document
          .querySelectorAll(
            `[v-model="${property}"],[v-bind="${property}"]`
          )
          .forEach(el => {
            el.innerHTML = value;
            el.value = value;
          });
      }
    }
  );
  //初始化绑定元素事件
  this.run = function() {
    const els = document.querySelectorAll("[v-model]");
    els.forEach(item => {
      item.addEventListener("keyup", function() {
        proxy[this.getAttribute("v-model")] = this.value;
      });
    });
  };
}
let view = new View().run();
```

### 表单验证

```html
<style>
  body {
    padding: 50px;
    background: #34495e;
  }
  input {
    border: solid 10px #ddd;
    height: 30px;
  }
  .error {
    border: solid 10px red;
  }
</style>
<body>
  <input type="js" validate rule="max:12,min:3" />
  <input type="js" validate rule="max:3,isNumber" />
</body>
<script>
  "use strict";
  //验证处理类
  class Validate {
    max(value, len) {
      return value.length <= len;
    }
    min(value, len) {
      return value.length >= len;
    }
    isNumber(value) {
      return /^\d+$/.test(value);
    }
  }

  //代理工厂
  function makeProxy(target) {
    return new Proxy(target, {
      get(target, key) {
        return target[key];
      },
      set(target, key, el) {
        const rule = el.getAttribute("rule");
        const validate = new Validate();
        let state = rule.split(",").every(rule => {
          const info = rule.split(":");
          return validate[info[0]](el.value, info[1]);
        });
        el.classList[state ? "remove":"add"]("error");
        return true;
      }
    });
  }

  const nodes = makeProxy(document.querySelectorAll("[validate]"));
  nodes.forEach((item, i) => {
    item.addEventListener("keyup", function() {
      nodes[i] = this;
    });
  });
</script>
```

## JSON

- json 是一种轻量级的数据交换格式，易于人阅读和编写。
- 使用`json` 数据格式是替换 `xml` 的最佳方式，主流语言都很好的支持`json` 格式。所以 `json` 也是前后台传输数据的主要格式。
- json 标准中要求使用双引号包裹属性，虽然有些语言不强制，但使用双引号可避免多程序间传输发生错误语言错误的发生。

### 声明定义

**基本结构**

```js
let hd = {
  "title": "tydumpling",
  "url": "tydumpling.com",
  "teacher": {
  	"name": "tydumpling",
  }
}
console.log(hd.teacher.name);
```

**数组结构**

```js
let lessons = [
  {
    "title": '媒体查询响应式布局',
    "category": 'css',
    "click": 199
  },
  {
    "title": 'FLEX 弹性盒模型',
    "category": 'css',
    "click": 12
  },
  {
    "title": 'MYSQL多表查询随意操作',
    "category": 'mysql',
    "click": 89
  }
];

console.log(lessons[0].title);
```

### 序列化

- 参数1：要转json的数组对象
- 参数2：需要保留的属性，可选
- 参数3：缩进字符

序列化是将 `json` 转换为字符串，一般用来向其他语言传输使用。

```js
let hd = {
  "title": "tydumpling",
  "url": "tydumpling.com",
  "teacher": {
  	"name": "tydumpling",
  }
}
console.log(JSON.stringify(hd));
//{"title":"tydumpling","url":"tydumpling.com","teacher":{"name":"tydumpling"}}
```

根据第二个参数指定保存的属性

```js
console.log(JSON.stringify(hd, ['title', 'url']));
//{"title":"tydumpling","url":"tydumpling.com"}
```

第三个是参数用来控制 TAB 数量，如果字符串则为前导字符。

```js
let hd = {
  "title": "tydumpling",
  "url": "tydumpling.com",
  "teacher": {
  	"name": "tydumpling",
  }
}
console.log(JSON.stringify(hd, null, 4));
```

为数据添加 `toJSON` 方法来自定义返回格式

```js
let hd = {
    "title": "tydumpling",
    "url": "tydumpling.com",
    "teacher": {
        "name": "tydumpling",
    },
    "toJSON": function () {
        return {
            "title": this.url,
            "name": this.teacher.name
        };
    }
}
console.log(JSON.stringify(hd)); //{"title":"tydumpling.com","name":"tydumpling"}
```

### 反序列化

使用 `JSON.parse` 将字符串 `json` 解析成对象

```js
let hd = {
  "title": "tydumpling",
  "url": "tydumpling.com",
  "teacher": {
  	"name": "tydumpling",
  }
}
let jsonStr = JSON.stringify(hd);
console.log(JSON.parse(jsonStr));
```

使用第二个参数函数来对返回的数据二次处理

```js
let hd = {
  title: "tydumpling",
  url: "tydumpling.com",
  teacher: {
    name: "tydumpling"
  }
};
let jsonStr = JSON.stringify(hd);
console.log(
  JSON.parse(jsonStr, (key, value) => {
    if (key == "title") {
      return `[推荐] ${value}`;
    }
    return value;
  })
);
```

## Reflect

**Reflect** 是一个内置的对象，它提供拦截 JavaScript 操作的方法

- `Reflect`并非一个构造函数，所以不能通过 new 运算符对其进行调用