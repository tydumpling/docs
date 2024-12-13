`constructor`  方法是 TypeScript 中类的构造函数，主要作用是在创建类的实例时进行初始化操作，例如初始化类的属性、执行其他必要的操作等。   在 TypeScript 中， `constructor`  方法的使用场景非常广泛，常见的使用场景包括：   1. 初始化类的属性：在  `constructor`  方法中，可以为类的属性赋初值，例如：

```
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const person = new Person('Tom', 18);
console.log(person.name); // 输出：Tom
console.log(person.age); // 输出：18
```

2. 执行其他必要的操作：在  `constructor`  方法中，还可以执行其他必要的操作，例如连接数据库、初始化一些全局变量等。

```
class Database {
  constructor() {
    // 连接数据库
  }
}

class App {
  db: Database;

  constructor() {
    this.db = new Database();
  }
}
```

3. 子类继承父类时进行初始化：当子类继承父类时，可以在子类的  `constructor`  方法中调用父类的  `constructor`  方法进行初始化操作。

```
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

class Cat extends Animal {
  age: number;

  constructor(name: string, age: number) {
    super(name); // 调用父类的 constructor 方法进行初始化
    this.age = age;
  }
}

const cat = new Cat('Tom', 3);
console.log(cat.name); // 输出：Tom
console.log(cat.age); // 输出：3
```

总之， `constructor`  方法是 TypeScript 类的构造函数，主要作用是在创建类的实例时进行初始化操作，使用场景非常广泛。



## super关键字

在 TypeScript 中，可以使用  `super`  关键字来调用父类的属性和方法。 `super`  关键字可以在子类中使用，用于访问父类的属性和方法。  在子类的构造函数中，可以使用  `super`  关键字调用父类的构造函数，例如：

```
class Animal {
  name: string;
   constructor(name: string) {
    this.name = name;
  }
   sayHello() {
    console.log(`Hello, my name is ${this.name}`);
  }
}
 class Cat extends Animal {
  age: number;
   constructor(name: string, age: number) {
    super(name); // 调用父类的 constructor 方法进行初始化
    this.age = age;
  }
   sayHello() {
    super.sayHello(); // 调用父类的 sayHello 方法
    console.log(`I am ${this.age} years old`);
  }
}
 const cat = new Cat('Tom', 3);
cat.sayHello();
```

在上面的例子中， `Cat`  类继承自  `Animal`  类，使用  `super`  关键字调用父类的构造函数进行初始化操作。在  `Cat`  类中，重写了  `sayHello`  方法，并使用  `super`  关键字调用父类的  `sayHello`  方法。  除了在构造函数中使用  `super`  关键字外，还可以在普通方法中使用  `super`  关键字调用父类的方法，例如：

```
class Animal {
  name: string;
   constructor(name: string) {
    this.name = name;
  }
   sayHello() {
    console.log(`Hello, my name is ${this.name}`);
  }
}
 class Cat extends Animal {
  age: number;
   constructor(name: string, age: number) {
    super(name); // 调用父类的 constructor 方法进行初始化
    this.age = age;
  }
   sayHello() {
    super.sayHello(); // 调用父类的 sayHello 方法
    console.log(`I am ${this.age} years old`);
  }
   run() {
    console.log(`${this.name} is running`);
  }
   catchMouse() {
    super.run(); // 调用父类的 run 方法
    console.log(`${this.name} is catching mouse`);
  }
}
 const cat = new Cat('Tom', 3);
cat.catchMouse();
```

在上面的例子中， `Cat`  类中新增了一个  `run`  方法，并在  `catchMouse`  方法中使用  `super`  关键字调用父类的  `run`  方法。  总之， `super`  关键字可以在子类中使用，用于访问父类的属性和方法，可以在构造函数和普通方法中使用。