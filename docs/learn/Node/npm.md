## NPM

我们在安装时版本号是很关键的，大家要清楚版本更新规则，下面进行说明。

### 版本号说明

版本示例: **a.b.c** 表示 **主版本号.次版本号.修补版本号**

- a 兼容版本，一般来讲版本 2.0.0 不一定向 1.0.0 兼容，所以这个版本号更新要慎重
- b 次版本号，一般为功能上的升级
- c 修订号，一般指对程序 bug 的修复

### 指定版本

我们可以通过 ^、 ~、 \*来指定版本号

- ^ 表示与版本兼容，指从最左边非 0 算起，该数值不能变
  1. 版本号 ^2.1.0：指 >=2.1.0 但< 3.0.0
  2. 版本号^0.2.1：指>=0.2.1 但 <0.3.0
  3. 版本号^0.1.0: 指 >=0.1.0 但 <0.2.0
- ~ 表示次版本号的更新规则，指从最右边非 0 算起，该数值不能变
  1. ~2.1.0：指>=2.1.0 但 <2.2.0
  2. ~2.0.0：指>=2.0.0 但 ❤️.0.0 因为次版本号为 0
- \*表示任意版本，永远更新最新版本
- -表示版本区间
  - 1.2.1-1.6.5：指 1.2.1 与 1.6.5 间的任意版本

### 锁定版本

每次更新版本后会生成 yarn.lock 文件，用于记录当前项目的使用的软件版本号，这样别人执行 `yarn`安装包时与项目开发者使用的是相同版本，来保证程序的稳定运行。

### 常用命令

下面介绍 npm 常用命令的使用

#### 安装软件

**全局安装**

```txt
npm install -g \<Module Name\>
```

安装软件包，但不修改 package.json 文件，以后使用 npm install 时不会自动安装

```txt
npm install \<Module Name\>
```

**生产环境**

- 在 package.json 文件 dependencies 属性下增加记录
- npm install 时会自动安装该软件包
- 使用 npm install --production 或者 NODE_ENV 变量值为 production 时，安装该软件包

```txt
npm install --save <Module Name>
```

> 可以简写为 `npm install -S <Module Name>`

**开发环境**

- 在 package.json 文件 devDependencies 属性下增加记录
- npm install 时会自动安装该软件包
- 使用 `npm install --production` 或者 NODE_ENV 变量值为 production 时，不会安装该软件包

```sh
npm install --save-dev <Module Name>
```

> 可以简写为 `npm install -D <Module Name>`

#### 查看软件

查看安装的模块列表

```txt
npm ls
```

查看本地已安装的包信息

```txt
npm ls tailwindcss
或
npm ls | grep tailwind
```

查看包信息

```txt
npm info tailwindcss
或
npm view tailwindcss
```

列出项目的依赖

```txt
npm list
```

列出项目的依赖，并限制显示的依赖深度

```txt
npm list --depth=2
```

#### 更新软件

更新 npm 自身

```txt
npm install npm -g
```

更新所有软件包

```txt
npm update
```

更新指定软件包

```txt
npm update <Module Name>
```

#### 卸载软件

删除全局软件

```txt
npm uninstall -g <Module Name>
```

删除项目中软件包

```txt
npm uninstall <Module Name>
```

#### npx

node 安装后会提供 npx 命令，使用 npx 命令可以直接调用模块命令。

下面是不使用 npx 调用 mockjs 中的 random 命令方式

```txt
node_modules/mockjs/bin/random
```

使用 npx 可以简化调用，他会在`node_modules/.bin` 目录和环境变量`$PATH`中查找命令并执行

```txt
npx random
```
