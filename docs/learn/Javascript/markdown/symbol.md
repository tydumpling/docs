# Symbol

`Symbol` 用于防止属性名冲突而产生的，比如向第三方对象中添加属性时。

`Symbol` 的值是唯一的，独一无二的不会重复的

## 基础知识

### Symbol

```js
let hd = Symbol();
let edu = Symbol();
console.log(hd); //symbol
console.log(hd == edu); //false
```

`Symbol` 不可以添加属性

```js
let hd = Symbol();
hd.name = "tydumpling";
console.log(hd.name); // undefined
```

### 描述参数

可传入字符串用于描述 `Symbol` ，方便在控制台分辨 `Symbol` 

```js
let hd = Symbol("is name");
let edu = Symbol("这是一个测试");

console.log(hd); //Symbol(is name)
console.log(edu.toString()); //Symbol(这是一个测试)
```

传入相同参数 `Symbol` 也是独立唯一的，因为参数只是描述而已，但使用 `Symbol.for`则不会

```js
let hd = Symbol("tydumpling");
let edu = Symbol("tydumpling");
console.log(hd == edu); //false
```

使用`description`可以获取传入的描述参数

```js
let hd = Symbol("tydumpling");
console.log(hd.description); //tydumpling
```

### Symbol.for

根据描述获取 `Symbol` ，如果不存在则新建一个 `Symbol` 

- 使用 `Symbol.for` 会在系统中将 `Symbol` 登记
- 使用 `Symbol` 则不会登记

```js
let hd = Symbol.for("tydumpling");
let edu = Symbol.for("tydumpling");
console.log(hd == edu); //true
```

### Symbol.keyFor

`Symbol.keyFor` 根据使用 `Symbol.for` 登记的 `Symbol` 返回描述，如果找不到返回 `undefined` 。

```js
let hd = Symbol.for("tydumpling");
console.log(Symbol.keyFor(hd)); //tydumpling

let edu = Symbol("duyidao");
console.log(Symbol.keyFor(edu)); //undefined
```

### 对象属性

`Symbol` 是独一无二的所以可以保证对象属性的唯一。

- `Symbol` 声明和访问使用 `[]`（变量）形式操作
- 也不能使用 `.` 语法因为 `.`语法是操作字符串属性的。

下面写法是错误的，会将`symbol` 当成字符串`symbol`处理

```js
let symbol = Symbol("tydumpling");
let obj = {
  symbol: "tydumpling.com"
};
console.log(obj);
```

正确写法是以`[]` 变量形式声明和访问

```js
let symbol = Symbol("tydumpling");
let obj = {
  [symbol]: "tydumpling.com"
};
console.log(obj[symbol]); //tydumpling.com
```

## 实例操作

### 缓存操作

使用`Symbol`可以解决在保存数据时由于名称相同造成的耦合覆盖问题。

```js
class Cache {
  static data = {};
  static set(name, value) {
    this.data[name] = value;
  }
  static get(name) {
    return this.data[name];
  }
}

let user = {
  name: "tydumpling",
  key: Symbol("首页")
};

let cart = {
  name: "我的",
  key: Symbol("我的")
};

Cache.set(user.key, user);
Cache.set(cart.key, cart);
console.log(Cache.get(user.key));
```

### 遍历属性

`Symbol` 不能使用 `for/in`、`for/of` 遍历操作

```js
let symbol = Symbol("tydumpling");
let obj = {
  name: "tydumpling.com",
  [symbol]: "duyidao.com"
};

for (const key in obj) {
  console.log(key); //name
}

for (const key of Object.keys(obj)) {
  console.log(key); //name
}
```

可以使用 `Object.getOwnPropertySymbols` 获取所有`Symbol`属性

```js
...
for (const key of Object.getOwnPropertySymbols(obj)) {
  console.log(key);
}
```

也可以使用 `Reflect.ownKeys(obj)` 获取所有属性包括`Symbol`

```js
...
for (const key of Reflect.ownKeys(obj)) {
  console.log(key);
}
...
```

如果对象属性不想被遍历，可以使用`Symbol`保护

```js
const site = Symbol("网站名称");
class User {
  constructor(name) {
    this[site] = "tydumpling博客";
    this.name = name;
  }
  getName() {
    return `${this[site]}-${this.name}`;
  }
}
const hd = new User("tydumpling");
console.log(hd.getName());
for (const key in hd) {
  console.log(key);
}
```