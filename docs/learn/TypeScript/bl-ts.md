```
可以如下的写法
let num:number = NaN /Infinity /进制数
let str:string = `${num}`
let n:null = null
let v1:viod= null
let v2:viod = undefined
关闭严格模式
可以支持穿插赋值
n=a  
a=n
```

# 类型 

## 类型权重

1. top type 顶级类型  any know
2. Object 
3. Number String Boolean 实例类型
4. number string boolean
5. never 权重最小   

  包含关系和类型赋值关系

```
let a: Object = {}
let b: string = 'null'
a = b
a = false 
a = Symbol(1) 等等都是可以的
```

::: tip unkonw 需要注意的
unkonw只能赋值给自身或者any

~~~
let tydumpling:unknow = {帅:true，open：（）=> 123}
tydumpliing.帅  tydumpling，open（） //会爆红 即unknow是无法读取属性的  方法也是不可调用的

如果不知道变量是什么类型的优先失业unknow类型 因为更加安全

~~~

:::

##  Object类型

原型链中顶级类型对应Object 或者function  Object类型包含所有对象和原始 类型

```
let a: Object = 123
let b: Object = '123'
let c: Object = {}
let d: Object = ()=>123

//理解成一个包含所有类型的Object继续
```

## object

```
let a: object = {}
let b: object = '1212' // 错误
// 常用于泛型约束 代表一个非原始的类型（引用类型  function Array object）

```

## {} 字面量模式

```
let a:{}  = 123
let b:{} = 'asdas' 
// new Object 可以理解为 new Object 也是除了顶级类型的所有类型的上层
a.age = 12 //false
// 虽然可以赋值任意类型但是 是没办法修改的
```



## 接口和对象类型 interface  

主要用于定义对象匹配关系 并且有第一个字母大写代码约束



```
interface IUser {
  id: number;
   name?: string; // optional
  email: string;
  phone: string;
readonly  func: function;
readonly  id: number;
}
//   age 是强校验的
// name ？:可选的可以没有
//  func 是只读的不可修改  常用于函数  id
let a:IUser = {id:1,name:"",email:"",phone:"",website:""}
// 1.遇到重名的interface会被并集重合
interface IUser {
  address: string;
}
let b:IUser = {id:1,name:"阿萨德"
    ,email:"",phone:"",website:"",address:""} 
// ！注意如果同时定义了数字索引签名和其他属性或方法数字索引签名需要定义在最后面例如
// 索引签名  常用于假设接口返回很多个字段的场景我只定义了其中的几个需要的情况  
interface Person {
  name: string;
  age: number;
  [propName: string]: any;
}

let p: Person = {
  name: "zhangsan",
  age: 12,
  sex: "男",
  address: "深圳",
  getName() {
    return this.name;
  }
};

interface IUser {
  id: number;
  name?: string; //
  email: string;
  password: string;
}
// 接口继承extends 相对于重名合并
interface IUser2 extends IUser {
    age: number;
}
// 继承多个
interface IUser3 extends IUser, IUser2 {

}
// 定义函数类型
type Fn = (a: number, b: number) => number;
// interface定义函数类型
interface Fn2 {
  (a: number, b: number): number;
   // 拆解 是一个函数 （）  函数的返回值是数组元素都是number （）：number[] 参数是name(name:string):number[]
}
```

## 数组类型

```
// number []

let arr:number[] = [1, 2, 3]

// Array<number>  数组的普通类型

let b:Array<number> = [1, 2, 3]

interface Arr {

[index:number]: string

}

let c:Arr = ['a','b']

// 定义对象数组

interface Arr2{

  number:string

}

let d: Arr2[] = [{ number: '1' }, { number: '2' }] 
// 定义二维数组
number[][] === Array<Array<number>>
let e:number[][] = [[1, 2], [3, 4]]

// 数组元素多类型 => 元组
let TTuple: [number,string]= [1, '2']  常用是直接any[]   TTuple:any
function getArr(...args:number[]){
}
function getArr(...args:any[]){
}
function getArr(...args: number[]) {

    // 函数两个参数 args  arguments 
    // 当你在函数参数列表中使用 ...args 时，TypeScript 会自动将传入的所有参数收集到一个数组中，并将其赋值给 args。
    //arguments 是一个类数组对象，它具有 length 属性和通过索引访问元素的能力，但它没有数组原型上的方法
    let a: IArguments = arguments
    console.log(args,a,a.length)
}
getArr(1, 2, 3)
```

