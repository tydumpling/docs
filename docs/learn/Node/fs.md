# fs

fs 模块是 Node.js 官方提供的、用来操作文件的模块。它提供了一系列的方法和属性，用来满足用户对文件的操作需求。下面来一一介绍。

## 异步操作

我们使用 `readFile` 与 `writeFile` 对文件进行异步读写操作

同步文件操作会阻塞进程，所以使用异步文件操作拥有更好的性能，也是推荐的做法。

### 读取文件

使用 `fs.readFile()` 方法，可以读取指定文件中的内容，语法格式如下：

```js
fs.readFile(path[, options], callback)
```

- 参数 1：必选参数，字符串，表示文件的路径。
- 参数 2：可选参数，表示以什么编码格式来读取文件。
- 参数 3：必选参数，文件读取完成后，通过回调函数拿到读取的结果

#### 示例代码

`1.txt` 文件内容：

```
hello
```

`index.js` 文件内容：

- 成功情况

  ```js
  const fs = require("fs");
  fs.readFile("./1.txt", "utf8", function (err, dataStr) {
    console.log(err); // null
    console.log(dataStr); // hello
  });
  ```

- 失败情况

  ```js
  const fs = require("fs");
  fs.readFile("./11.txt", "utf8", function (err, dataStr) {
    console.log(err);
    // {
    //	errno: -4058,
    //	code: 'ENOENT',
    //	syscall: 'open',
    //	path: 'C:\\Users\\Administrator\\Desktop\\blog\\node\\11.txt'
    // }
    console.log(dataStr); // undefined
  });
  ```

### 写入文件

使用 `fs.writeFile()` 方法，可以向指定的文件中写入内容，语法格式如下：

```js
fs.writeFile(file, data[, options], callback)
```

- 参数 1：必选参数，需要指定一个文件路径的字符串，表示文件的存放路径。
- 参数 2：必选参数，表示要写入的内容。
- 参数 3：可选参数，表示以什么格式写入文件内容，默认值是 utf8。
- 参数 4：必选参数，文件写入完成后的回调函数

#### 示例代码

- 成功状态

  ```js
  const fs = require("fs");

  fs.writeFile("./1.txt", "add", "utf8", function (err) {
    console.log(err); // null
  });
  ```

- 失败状态

  ```js
  const fs = require("fs");

  fs.writeFile("./11.txt", "add", "utf8", function (err) {
    console.log(err);
    // {
    //  errno: -4058,
    //  code: 'ENOENT',
    //  syscall: 'open',
    //  path: 'C:\\Users\\Administrator\\Desktop\\blog\\abc\\1.txt'
    // }
  });
  ```

### 案例

使用 `fs` 文件系统模块，将素材目录下成绩 `.txt` 文件中的考试数据，整理到成绩 `ok.txt` 文件中。

整理前的格式：

```
小红=99 小白=100 tydumpling=150 小李=50
```

整理后的格式：

```txt
小红：99
小白：100
tydumpling：150
小李：50
```

代码：

```js
const fs = require("fs");

fs.readFile("./1.txt", "utf8", function (err, dataStr) {
  // 判断读取是否成功
  if (err) {
    return console.log("读取文件失败，", err);
  }

  // 把获取到的字符串中的 = 正则替换为：，空格替换为换行
  const arr = dataStr.replace(/\=/g, "：").replace(/ /g, "\r\n");

  fs.writeFile("./2.txt", arr, "utf8", function (err) {
    // 判断写入是否成功
    if (err) {
      console.log("成绩写入失败");
    } else {
      console.log("成绩写入成功");
    }
  });
});
```

## 同步操作

- 同步操作会阻塞进程
- 如果是写入文件，可以不设置编码

### 回调函数

使用 **readFile** 与 **writeFile** 可以对文件进行异步操作，不阻塞进程拥有更好的性能。

- Node.js 以错误优先为思想，所以回调函数第一个参数为错误信息，没有错误时值为 null

```txt
import { readFile, writeFile } from 'fs'

readFile('hd.txt', 'utf8', (error, content) => {
  if (error) {
    console.log(error)
  } else {
    console.log(content)
    //异步写入文件
    writeFile('xj.txt', content, (error) => {
      if (error) console.log(error)
      else console.log('文件写入成功')
    })
  }
})
console.log('后盾人提示，因为是异步，所以这行较readFile的回调函数先执行')
```

### Promise

下面使用 Promise 对文件的操作方法进行封装

```txt
import { readFile, writeFile } from 'fs'

//获取文件
function fileGetContent(file: string): Promise<string> {
  return new Promise((resolve) => {
    readFile(file, 'utf8', (error, content) => {
      resolve(content)
    })
  })
}

//写入文件
function filePutContent(file: string, content: string) {
  return new Promise((resolve) => {
    writeFile(file, content, (error) => {
      if (error) throw error
      resolve(true)
    })
  })
}

// 使用 async/await 使用代码更清晰
async function hd() {
  const content = await fileGetContent('hd.txt')

  await filePutContent('xj.txt', content)
  console.log('xj.txt 写入成功')
}

hd()
console.log('先输出...')
```

#### fs/promises

其实我们不需要自己封装，因为 Node 提供了 Promise 操作机制

**fs/promises** 提供了 Promise 操作机制

```txt
import { readFile } from 'fs/promises'

readFile('hd.txt', 'utf-8').then((content) => {
  console.log(content)
}).catch(error=>console.log(error))
```

## 路径拼接

在使用 `fs` 模块操作文件时，如果提供的操作路径是以 `./` 或 `../` 开头的相对路径时，很容易出现路径动态拼接错误的问题。

原因：代码在运行的时候，会以执行 `node` 命令时所处的目录，动态拼接出被操作文件的完整路径。

解决方案：在使用 `fs` 模块操作文件时，直接提供完整的路径，或者通过 `__dirname` 字段拼接获取路径，不要提供 `./` 或 `../` 开头的相对路径，从而防止路径动态拼接的问题。

## 文件信息

### existsSync

使用 **existsSync** 判断文件或目录是否存在，返回值是 **boolean**

```txt
import { existsSync } from 'fs'

if (existsSync('hd.txt')) {
  console.log('文件存在')
}
```

### [#](https://doc.houdunren.com/系统课程/node/8 FS 模块.html#stat)stat

使用 **stat** 可以获取文件或目录详细信息，比如可用来判断是否是文件或目录。

```txt
import { stat } from 'fs'

stat('hda', (error, stats) => {
  if (error) throw new Error('文件不存在或没有操作权限')
  if (stats.isFile()) {
    console.log('这是文件')
  }
  if (stats.isDirectory()) {
    console.log('这是目录')
  }
})
```

**fs/promises** 提供了 Promise 的操作方法

```txt
import { stat } from 'fs/promises'

//是否是目录
async function fileType(file: string) {
  try {
    const stats = await stat(file)
    return stats.isDirectory() ? 'dir' : 'file'
  } catch (error) {
    if (error) throw new Error('文件不存在或没有操作权限')
  }
}

fileType('hd').then((type) => {
  console.log(type === 'dir' ? '目录' : '文件')
})
```

### [#](https://doc.houdunren.com/系统课程/node/8 FS 模块.html#unlink)unlink

使用 **unlink** 执行异步删除文件

```txt
import { unlink, writeFileSync } from 'fs'
writeFileSync('hd.txt', 'houdunren')
setTimeout(() => {
	//三秒后删除文件
  unlink('hd.txt', (error) => {
    if (error) throw error
    console.log('文件删除成功')
  })
}, 3000)
```

**fs/promises** 中封装了 Promise 删除文件方法

```txt
import { writeFileSync } from 'fs'
import { unlink } from 'fs/promises'

async function hd() {
  await unlink('hd.txt')
}

writeFileSync('hd.txt', 'houdunren.com')
setTimeout(() => {
  hd()
}, 3000)
```

## [#](https://doc.houdunren.com/系统课程/node/8 FS 模块.html#目录管理)目录管理

下面向军大叔教大家使用 Node 操作目录

### [#](https://doc.houdunren.com/系统课程/node/8 FS 模块.html#创建目录)创建目录

下面是使用 **mkdirSync** 以同步的方式创建多级目录

```txt
import { mkdirSync } from 'fs'

const state = mkdirSync('a/b/c/d', { recursive: true })
if (state) {
  console.log('目录创建成功')
}
```

使用 **mkdir** 可以创建目录，如果目录已经存在将报错

```txt
import { mkdir } from 'fs'

mkdir('hd', (error) => {
  if (error) throw error
  console.log('目录创建成功')
})
```

**fs/promises** 提供了 Promise 操作方法

```txt
import { mkdir } from 'fs/promises'

async function hd() {
  await mkdir('hd')
}

hd()
```

### [#](https://doc.houdunren.com/系统课程/node/8 FS 模块.html#删除目录)删除目录

使用 **rmdirSync** 以同步的方式删除多级目录，同步删除会阻塞代码，建议尽可能使用异步操作。

```txt
import { rmdirSync } from 'fs'

rmdirSync('a', { recursive: true })
```

使用 **rmdir** 异步删除目录，默认只能删除空目录

```txt
import { rmdir } from 'fs'

rmdir('hd', (error) => {
  if (error) throw error
  console.log('目录删除成功')
})
```

递归删除目录，即删除目录中的所有内容，可以删除非空目录

```txt
import { rmdir } from 'fs'

rmdir('hd', { recursive: true }, (error) => {
  if (error) throw error
  console.log('目录删除成功')
})
```

**fs/promises** 提供了 Promise 操作方法，用于异步删除目录

```txt
import { rmdir } from 'fs/promises'

rmdir('hd')
  .then((e) => console.log('删除成功'))
  .catch((error) => console.log('删除失败'))
```

下面是递归删除目录，非空目录也可以一次删除

```js
import { rmdir } from "fs";

rmdir("hd", { recursive: true }, (error) => {
  if (error) throw error;
  console.log("目录删除成功");
});
```
