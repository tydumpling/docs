# 任务管理

## 基本信息

JavaScript 语言的一大特点就是单线程，也就是说同一个时间只能处理一个任务。为了协调事件、用户交互、脚本、UI 渲染和网络处理等行为，防止主线程的不阻塞，（事件循环）Event Loop 的方案应用而生。

JavaScript 处理任务是在等待任务、执行任务 、休眠等待新任务中不断循环中，也称这种机制为事件循环。

- 主线程中的任务执行完后，才执行任务队列中的任务
- 有新任务到来时会将其放入队列，采取先进先执行的策略执行队列中的任务
- 比如多个 `setTimeout` 同时到时间了，就要依次执行

任务包括 script(整体代码)、 setTimeout、setInterval、DOM 渲染、DOM 事件、Promise、XMLHTTPREQUEST 等

### 原理分析

下面通过一个例子来详细分析宏任务与微任务

```js
console.log("tydumpling");
setTimeout(function() {
  console.log("定时器");
}, 0);
Promise.resolve()
  .then(function() {
    console.log("promise1");
  })
  .then(function() {
    console.log("promise2");
  });
console.log("tydumpling.com");

#输出结果为
tydumpling
tydumpling.com
promise1
promise2
定时器
```

1. 先执最前面的宏任务 script，然后输出

   ```js
   script start
   ```

2. 然后执行到 setTimeout 异步宏任务，并将其放入宏任务队列，等待执行

3. 之后执行到 Promise.then 微任务，并将其放入微任务队列，等待执行

4. 然后执行到主代码输出

   ```js
   script end
   ```

5. 主线程所有任务处理完成

6. 通过事件循环遍历微任务队列，将刚才放入的 Promise.then 微任务读取到主线程执行，然后输出

   ```js
   promise1
   ```

7. 之后又执行 promse.then 产生新的微任务，并放入微任务队列

8. 主线程任务执行完毕

9. 现次事件循环遍历微任务队列，读取到 promise2 微任务放入主线程执行，然后输出

   ```js
   promise2
   ```

10. 主线程任务执行完毕

11. 此时微任务队列已经无任务，然后从宏任务队列中读取到 setTimeout 任务并加入主线程，然后输出

    ```js
    setTimeout
    ```

### 脚本加载

引擎在执行任务时不会进行 DOM 渲染，所以如果把`script` 定义在前面，要先执行完任务后再渲染 DOM，建议将`script` 放在 BODY 结束标签前。

### 定时器

定时器会放入异步任务队列，也需要等待同步任务执行完成后执行。

下面设置了 6 毫秒执行，如果主线程代码执行 10 毫秒，定时器要等主线程执行完才执行。

HTML 标准规定最小时间不能低于 4 毫秒，有些异步操作如 DOM 操作最低是 16 毫秒，总之把时间设置大些对性能更好。

```js
setTimeout(func,6);
```

下面的代码会先输出 `tydumpling.com` 之后输出 `tydumpling`

```js
setTimeout(() => {
  console.log("tydumpling");
}, 0);
console.log("tydumpling.com");
```

> 其他的异步操作如事件、XMLHTTPREQUEST 等逻辑是一样的

### 微任务

微任务一般由用户代码产生，微任务较宏任务执行优先级更高，`Promise.then` 是典型的微任务，实例化 Promise 时执行的代码是同步的，便 then 注册的回调函数是异步微任务的。

任务的执行顺序是同步任务、微任务、宏任务所以下面执行结果是 `1、2、3、4`

```js
setTimeout(() => console.log(4));

new Promise(resolve => {
  resolve();
  console.log(1);
}).then(_ => {
  console.log(3);
});

console.log(2);
```

我们再来看下面稍复杂的任务代码

```js
setTimeout(() => {
  console.log("定时器");
  setTimeout(() => {
    console.log("timeout timeout");
  }, 0);
  new Promise(resolve => {
    console.log("settimeout Promise");
    resolve();
  }).then(() => {
    console.log("settimeout then");
  });
}, 0);
new Promise(resolve => {
  console.log("Promise");
  resolve();
}).then(() => {
  console.log("then");
});
console.log("tydumpling");
```

以上代码执行结果为

```js
Promise
tydumpling
then
定时器
settimeout Promise
settimeout then
timeout timeout
```

## 实例操作

### 进度条

下面的定时器虽然都定时了一秒钟，但也是按先进行出原则，依次执行

```js
let i = 0;
setTimeout(() => {
  console.log(++i);  // 1
}, 1000);

setTimeout(() => {
  console.log(++i); // 2
}, 1000);
```

下面是一个进度条的示例，将每个数字放在一个任务中执行

```html
<body>
  <style>
    body {
      padding: 30px;
    }
    #fn {
      height: 30px;
      background: yellowgreen;
      width: 0;
      js-align: center;
      font-weight: bold;
    }
  </style>
  <div id="fn"></div>
</body>

<script>
  function view() {
    let i = 0;
    (function handle() {
      fn.innerHTML = i + "%";
      fn.style.width = i + "%";
      if (i++ < 100) {
        setTimeout(handle, 20);
      }
    })();
  }
  view();
  console.log("定时器开始了...");
</script>
```

### 任务分解

一个比较耗时的任务可能造成游览器卡死现象，所以可以将任务拆分为多小小异步小任务执行。下面是一个数字统计的函数，我们会发现运行时间特别长

```js
console.time("runtime");
function fn(num) {
  let count = 0;
  for (let i = 0; i <= num; i++) {
    count += i;
  }
  console.log(count);
  console.timeEnd("runtime");
}
let num=987654321;
fn(num);
console.log("tydumpling.com"); //需要等待上面执行完才会执行
```

现在把任务分解成小块放入任务队列，游览器就不会出现卡死的现象了，也不会影响后续代码的执行

```js
console.time("runtime");
let count = 0;
let num = 987654321;
function fn() {
  for (let i = 0; i < 100000000; i++) {
    if (num <= 0) break;
    count += num--;
  }
  if (num > 0) {
    console.log(num);
    setTimeout(fn);
  } else {
    console.log(num);
    console.log(count);
  }
}
fn();
console.log("tydumpling.com"); //立刻显示出来
```

交给微任务处理是更好的选择

```js
async function fn(num) {
  let res = await Promise.resolve().then(_ => {
    let count = 0;
    for (let i = 0; i < num; i++) {
      count += num--;
    }
    return count;
  });
  console.log(res);
}
fn(987654321);
console.log("tydumpling");
```

# Promise核心

## 起步构建

本章来自己开发一个 Promise 实现，提升异步编程的能力。

首先声明定义类并声明 Promise 状态与值，有以下几个细节需要注意。

- executor 为执行者
- 当执行者出现异常时触发**拒绝**状态
- 使用静态属性保存状态值
- 状态只能改变一次，所以在 resolve 与 reject 添加条件判断
- 因为 `resolve`或`rejected`方法在 executor 中调用，作用域也是 executor 作用域，这会造成 this 指向 window，现在我们使用的是 class 定义，this 为 undefined。

```js
class fn {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";
  constructor(executor) {
    this.status = fn.PENDING;
    this.value = null;
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }
  resolve(value) {
    if (this.status == fn.PENDING) {
      this.status = fn.FULFILLED;
      this.value = value;
    }
  }
  reject(value) {
    if (this.status == fn.PENDING) {
      this.status = fn.REJECTED;
      this.value = value;
    }
  }
}
```

下面测试一下状态改变

```js
<script src="fn.js"></script>
<script>
  let p = new fn((resolve, reject) => {
    resolve("tydumpling");
  });
  console.log(p);
</script>
```

## THEN

现在添加 then 方法来处理状态的改变，有以下几点说明

1. then 可以有两个参数，即成功和错误时的回调函数
2. then 的函数参数都不是必须的，所以需要设置默认值为函数，用于处理当没有传递时情况
3. 当执行 then 传递的函数发生异常时，统一交给 onRejected 来处理错误

### 基础构建

```js
then(onFulfilled, onRejected) {
  if (typeof onFulfilled != "function") {
    onFulfilled = value => value;
  }
  if (typeof onRejected != "function") {
    onRejected = value => value;
  }
  if (this.status == fn.FULFILLED) {
    try {
      onFulfilled(this.value);
    } catch (error) {
      onRejected(error);
    }
  }
  if (this.status == fn.REJECTED) {
    try {
      onRejected(this.value);
    } catch (error) {
      onRejected(error);
    }
  }
}
```

下面来测试 then 方法的，结果正常输出`tydumpling`

```js
let p = new fn((resolve, reject) => {
  resolve("tydumpling");
}).then(
  value => {
    console.log(value);
  },
  reason => {
    console.log(reason);
  }
);
console.log("tydumpling.com");
```

### 异步任务

但上面的代码产生的 Promise 并不是异步的，使用 setTimeout 来将 onFulfilled 与 onRejected 做为异步宏任务执行

```js
then(onFulfilled, onRejected) {
  if (typeof onFulfilled != "function") {
    onFulfilled = value => value;
  }
  if (typeof onRejected != "function") {
    onRejected = value => value;
  }
  if (this.status == fn.FULFILLED) {
    setTimeout(() => {
      try {
        onFulfilled(this.value);
      } catch (error) {
        onRejected(error);
      }
    });
  }
  if (this.status == fn.REJECTED) {
    setTimeout(() => {
      try {
        onRejected(this.value);
      } catch (error) {
        onRejected(error);
      }
    });
  }
}
```

现在再执行代码，已经有异步效果了，先输出了`tydumpling.com`

```js
let p = new fn((resolve, reject) => {
  resolve("tydumpling");
}).then(
  value => {
    console.log(value);
  },
  reason => {
    console.log(reason);
  }
);
console.log("tydumpling.com");
```

### PENDING 状态

目前 then 方法无法处理 promise 为 pending 时的状态

```js
...
let p = new fn((resolve, reject) => {
  setTimeout(() => {
    resolve("tydumpling");
  });
})
...
```

为了处理以下情况，需要进行几点改动

1. 在构造函数中添加 callbacks 来保存 pending 状态时处理函数，当状态改变时循环调用

   ```js
   constructor(executor) {
   	...
     this.callbacks = [];
     ...
   }
   ```

2. 将 then 方法的回调函数添加到 callbacks 数组中，用于异步执行

   ```js
   then(onFulfilled, onRejected) {
     if (typeof onFulfilled != "function") {
       onFulfilled = value => value;
     }
     if (typeof onRejected != "function") {
       onRejected = value => value;
     }
   	if (this.status == fn.PENDING) {
       this.callbacks.push({
         onFulfilled: value => {
           try {
             onFulfilled(value);
           } catch (error) {
             onRejected(error);
           }
         },
         onRejected: value => {
           try {
             onRejected(value);
           } catch (error) {
             onRejected(error);
           }
         }
       });
     }
     ...
   }
   ```

3. resovle 与 reject 中添加处理 callback 方法的代码

   ```js
   resolve(value) {
     if (this.status == fn.PENDING) {
       this.status = fn.FULFILLED;
       this.value = value;
       this.callbacks.map(callback => {
         callback.onFulfilled(value);
       });
     }
   }
   reject(value) {
     if (this.status == fn.PENDING) {
       this.status = fn.REJECTED;
       this.value = value;
       this.callbacks.map(callback => {
         callback.onRejected(value);
       });
     }
   }
   ```

### PENDING 异步

执行以下代码发现并不是异步操作，应该先输出 `大叔视频` 然后是`tydumpling

```js
let p = new fn((resolve, reject) => {
  setTimeout(() => {
    resolve("tydumpling");
    console.log("大叔视频");
  });
}).then(
  value => {
    console.log(value);
  },
  reason => {
    console.log(reason);
  }
);
```

解决以上问题，只需要将 resolve 与 reject 执行通过 setTimeout 定义为异步任务

```js
resolve(value) {
  if (this.status == fn.PENDING) {
   	this.status = fn.FULFILLED;
		this.value = value;
    setTimeout(() => {
      this.callbacks.map(callback => {
        callback.onFulfilled(value);
      });
    });
  }
}
reject(value) {
  if (this.status == fn.PENDING) {
  	this.status = fn.REJECTED;
    this.value = value;
    setTimeout(() => {
      this.callbacks.map(callback => {
        callback.onRejected(value);
      });
    });
  }
}
```

## 链式操作

Promise 中的 then 是链式调用执行的，所以 then 也要返回 Promise 才能实现

1. then 的 onReject 函数是对前面 Promise 的 rejected 的处理
2. 但该 Promise 返回状态要为 fulfilled，所以在调用 onRejected 后改变当前 promise 为 fulfilled 状态

```js
then(onFulfilled, onRejected) {
  if (typeof onFulfilled != "function") {
    onFulfilled = value => value;
  }
  if (typeof onRejected != "function") {
    onRejected = value => value;
  }
  return new fn((resolve, reject) => {
    if (this.status == fn.PENDING) {
      this.callbacks.push({
        onFulfilled: value => {
          try {
            let result = onFulfilled(value);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        onRejected: value => {
          try {
            let result = onRejected(value);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }
      });
    }
    if (this.status == fn.FULFILLED) {
      setTimeout(() => {
        try {
          let result = onFulfilled(this.value);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }
    if (this.status == fn.REJECTED) {
      setTimeout(() => {
        try {
          let result = onRejected(this.value);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }
  });
}
```

下面执行测试后，链式操作已经有效了

```js
let p = new fn((resolve, reject) => {
  resolve("tydumpling");
  console.log("fncms.com");
})
.then(
  value => {
    console.log(value);
    return "大叔视频";
  },
  reason => {
    console.log(reason);
  }
)
.then(
  value => {
    console.log(value);
  },
  reason => {
    console.log(reason);
  }
);
console.log("tydumpling.com");
```

## 返回类型

如果 then 返回的是 Promise 呢？所以我们需要判断分别处理返回值为 Promise 与普通值的情况

### 基本实现

下面来实现不同类型不同处理机制

```js
then(onFulfilled, onRejected) {
  if (typeof onFulfilled != "function") {
    onFulfilled = value => value;
  }
  if (typeof onRejected != "function") {
    onRejected = value => value;
  }
  return new fn((resolve, reject) => {
    if (this.status == fn.PENDING) {
      this.callbacks.push({
        onFulfilled: value => {
          try {
            let result = onFulfilled(value);
            if (result instanceof fn) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        },
        onRejected: value => {
          try {
            let result = onRejected(value);
            if (result instanceof fn) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        }
      });
    }
    if (this.status == fn.FULFILLED) {
      setTimeout(() => {
        try {
          let result = onFulfilled(this.value);
          if (result instanceof fn) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      });
    }
    if (this.status == fn.REJECTED) {
      setTimeout(() => {
        try {
          let result = onRejected(this.value);
          if (result instanceof fn) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      });
    }
  });
}
```

### 代码复用

现在发现 pendding、fulfilled、rejected 状态的代码非常相似，所以可以提取出方法 Parse 来复用

```js
then(onFulfilled, onRejected) {
  if (typeof onFulfilled != "function") {
    onFulfilled = value => value;
  }
  if (typeof onRejected != "function") {
    onRejected = value => value;
  }
  return new fn((resolve, reject) => {
    if (this.status == fn.PENDING) {
      this.callbacks.push({
        onFulfilled: value => {
          this.parse(onFulfilled(this.value), resolve, reject);
        },
        onRejected: value => {
          this.parse(onRejected(this.value), resolve, reject);
        }
      });
    }
    if (this.status == fn.FULFILLED) {
      setTimeout(() => {
        this.parse(onFulfilled(this.value), resolve, reject);
      });
    }
    if (this.status == fn.REJECTED) {
      setTimeout(() => {
        this.parse(onRejected(this.value), resolve, reject);
      });
    }
  });
}
parse(result, resolve, reject) {
  try {
    if (result instanceof fn) {
      result.then(resolve, reject);
    } else {
      resolve(result);
    }
  } catch (error) {
    reject(error);
  }
}
```

### 返回约束

then 的返回的 promise 不能是 then 相同的 Promise，下面是原生 Promise 的示例将产生错误

```js
let promise = new Promise(resolve => {
  setTimeout(() => {
    resolve("tydumpling");
  });
});
let p = promise.then(value => {
  return p;
});
```

解决上面的问题来完善代码，添加当前 promise 做为 parse 的第一个参数与函数结果比对

```js
then(onFulfilled, onRejected) {
  if (typeof onFulfilled != "function") {
    onFulfilled = value => value;
  }
  if (typeof onRejected != "function") {
    onRejected = value => value;
  }
  let promise = new fn((resolve, reject) => {
    if (this.status == fn.PENDING) {
      this.callbacks.push({
        onFulfilled: value => {
          this.parse(promise, onFulfilled(this.value), resolve, reject);
        },
        onRejected: value => {
          this.parse(promise, onRejected(this.value), resolve, reject);
        }
      });
    }
    if (this.status == fn.FULFILLED) {
      setTimeout(() => {
        this.parse(promise, onFulfilled(this.value), resolve, reject);
      });
    }
    if (this.status == fn.REJECTED) {
      setTimeout(() => {
        this.parse(promise, onRejected(this.value), resolve, reject);
      });
    }
  });
  return promise;
}
parse(promise, result, resolve, reject) {
  if (promise == result) {
    throw new TypeError("Chaining cycle detected for promise");
  }
  try {
    if (result instanceof fn) {
      result.then(resolve, reject);
    } else {
      resolve(result);
    }
  } catch (error) {
    reject(error);
  }
}
```

现在进行测试也可以得到原生一样效果了

```js
let p = new fn((resolve, reject) => {
  resolve("tydumpling");
});
p = p.then(value => {
  return p;
});
```

## RESOLVE

下面来实现 Promise 的 resolve 方法

```js
static resolve(value) {
  return new fn((resolve, reject) => {
    if (value instanceof fn) {
      value.then(resolve, reject);
    } else {
      resolve(value);
    }
  });
}
```

使用普通值的测试

```js
fn.resolve("tydumpling").then(value => {
  console.log(value);
});
```

使用状态为 fulfilled 的 promise 值测试

```js
fn.resolve(
  new fn(resolve => {
    resolve("tydumpling.com");
  })
).then(value => {
  console.log(value);
});
```

使用状态为 rejected 的 Promise 测试

```js
fn.resolve(
  new fn((_, reject) => {
    reject("reacted");
  })
).then(
  value => {
    console.log(value);
  },
  reason => {
    console.log(reason);
  }
);
```

## REJEDCT

下面定义 Promise 的 rejecte 方法

```js
static reject(reason) {
  return new fn((_, reject) => {
    reject(reason);
  });
}
```

使用测试

```js
fn.reject("rejected").then(null, reason => {
  console.log(reason);
});
```

## ALL

下面来实现 Promise 的 all 方法

```js
static all(promises) {
  let resolves = [];
  return new fn((resolve, reject) => {
    promises.forEach((promise, index) => {
      promise.then(
        value => {
          resolves.push(value);
          if (resolves.length == promises.length) {
            resolve(resolves);
          }
        },
        reason => {
          reject(reason);
        }
      );
    });
  });
}
```

来对所有 Promise 状态为 fulfilled 的测试

```js
let p1 = new fn((resolve, reject) => {
  resolve("tydumpling");
});
let p2 = new fn((resolve, reject) => {
  reject("tydumpling");
});
let promises = fn.all([p1, p2]).then(
  promises => {
    console.log(promises);
  },
  reason => {
    console.log(reason);
  }
);
```

使用我们写的 resolve 进行测试

```js
let p1 = fn.resolve("tydumpling");
let p2 = fn.resolve("tydumpling.com");
let promises = fn.all([p1, p2]).then(
  promises => {
    console.log(promises);
  },
  reason => {
    console.log(reason);
  }
);
```

其中一个 Promise 为 rejected 时的效果

```js
let p1 = fn.resolve("tydumpling");
let p2 = fn.reject("rejected");
let promises = fn.all([p1, p2]).then(
  promises => {
    console.log(promises);
  },
  reason => {
    console.log(reason);
  }
);
```

## RACE

下面实现 Promise 的 race 方法

```js
static race(promises) {
  return new fn((resolve, reject) => {
    promises.map(promise => {
      promise.then(value => {
        resolve(value);
      });
    });
  });
}
```

我们来进行测试

```js
let p1 = fn.resolve("tydumpling");
let p2 = fn.resolve("tydumpling.com");
let promises = fn.race([p1, p2]).then(
  promises => {
    console.log(promises);
  },
  reason => {
    console.log(reason);
  }
);
```

使用延迟 Promise 后的效果

```js
let p1 = new fn(resolve => {
  setInterval(() => {
    resolve("tydumpling");
  }, 2000);
});
let p2 = new fn(resolve => {
  setInterval(() => {
    resolve("tydumpling.com");
  }, 1000);
});
let promises = fn.race([p1, p2]).then(
  promises => {
    console.log(promises);
  },
  reason => {
    console.log(reason);
  }
);
```