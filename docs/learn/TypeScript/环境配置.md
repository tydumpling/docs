# TypeScript

## 介绍

typescript 是 javascript 的一个超集，typescript 可以运行于任何系统，并且是开源免费的。

![img](data:image/jpeg;base64,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)

typescript 有以下几个特点

- typescript 会在编译时对代码进行严格的静态类型检查，可以在编码阶段就发现问题，而不是在上线运行时才发现
- typeScript 语法遵循 ES 规范，更细速度快，不断支持最新的 ECMAScript 新特性，如装饰器、public/private 修饰符
- typescript 支持 OOP（面向对象）的接口，抽象类，多态特性
- typescript 可以为 IDE 提供更好的代码补全、接口提示、跳转到定义
- 还有重要一点是众多科技公司已经采用 typeScript 进行开发，也是前端工程师需要掌握的就业技能

## 安装环境

下面来安装学习 typescript 时的开发环境

### node

首先需要安装 [node.js (opens new window)](https://nodejs.org/en/)我相信做前端的都已经安装了

![img](https://doc.houdunren.com/assets/img/u=3401268567,2977119306&fm=26&fmt=auto.4efa1d98.jpeg)

### 全局安装 TS

然后执行以下命令安装 typescript

```txt
npm install -g typescript
```

如果你使用的是 mac 系统也可以执行

```txt
brew install typescript
```

如果是 linux 系统可以通过相应的软件管理命令安装，比如以下是 manjaro 的安装示例

```txt
sudo pacman -Sy typescript
```

安装后执行以下命令检查是否安装成功

```txt
tsc -v
//如果显示以下内容即表示安装成功
// Version 4.2.4
```

### 项目安装 TS

除了全局安装外，也可以在项目中独立安装 typescript，这可以限定项目使用的 typescript 版本

```txt
yarn init -y
```

安装 typescript

```txt
yarn add -D typescript
```

查看版本

```txt
yarn tsc -v
```

## 编辑器

.ts 是 typescript 的扩展名，在首次使用 vscode 编写.ts 文件时，vscode 会自动下载支持 typescript 的插件环境

![image-20210927101547461](https://doc.houdunren.com/assets/img/image-20210927101547461.fce7eba7.png)

### 关闭 JS 的检验

默认在编写普通.js 文件时，vscode 也会进行类型校验，这有时不需要

![image-20210927104116383](https://doc.houdunren.com/assets/img/image-20210927104116383.26b5980d.png)

## 编译 TS

我们使用 tsc 命令可以将 ts 文件编译为 js 文件，如果在编译过程中有 ts 错误将在命令行报出

```txt
tsc test.ts //会编译生成 test.js 文件
```

每次修改 ts 文件后再执行命令编译会过于繁琐，可以执行以下命令自动监听 ts 文件内容并自动生成 js 文件

```txt
tsc test.ts -w
```

### include

需要编译的文件路径，设置如下所示：

```json
{
  "include": ["./src/xx/x"]
}
```

上方配置表示在 src 文件夹下的 任意文件夹下的 ts 文件都会被编译。

### exclude

需要编译的文件路径，设置如下所示：

```json
{
  "include": ["./src/xx/x"],
  "exclude": ["./src/hello/x"]
}
```

上方配置表示在 src 文件夹下的 任意文件夹，除了 hello 文件夹下的 ts 文件都会被编译。

### compilerOptions

编译器的选项，有以下几个属性：

- target：TS 编译为 ES 的版本
- module：指定要使用的模块化规范（commonjs、amd、system、umd、es6，none）
- lib：指定项目中用到的库
- outDir：指定编译后文件所在的目录
- outFile：将代码合并为一个文件
- allowJs：是否对 hs 文件进行编译，默认为 false
- checkJs：是否检测 js 代码是否符合规范，默认为 false
- removeComments：是否移除注释
- noEmit：不生成编译后的文件
- noEmitOnError：当有错误时不生成编译后的文件
- strict：所有严格模式总开关，为 true 下面四个都开启
- alwaysStrict：设置编译后的文件是否使用严格模式，默认为 false（最新版本默认为 true）
- noImplicitAny：不允许出现隐式 any
- noImplicitThis：不允许出现不明确类型的 this（不允许指向 window）
- strictNullChecks：严格的检查空值

```json
{
  "include": ["./src/xx/x"],
  "exclude": ["./src/hello/x"],
  "compilerOptions": {
    "target": "ES6",
    "module": "ES6",
    "lib": ["ES6", "dom"],
    "outDir": "./dist",
    "outFile": "./dist/app.js",
    "allowJs": true,
    "checkJs": true,
    "removeComments": true,
    "noEmit": false,
    "noEmitOnError": true,
    "alwaysStrict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true
  }
}
```

## 常见问题

### windows

如果在 windows 系统中执行 tsc 命令报以下错误

```txt
... 因为在此系统上禁止运行脚本 ...
```

需要以管理员身份执行 powerShell，然后执行以下命令，在出现的提示选择 `Y`

```txt
set-ExecutionPolicy RemoteSigned
```
