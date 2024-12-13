# Vue项目中TS意义与麻烦

## TS作用

首先来聊聊 Typescript 的作用，Ts 最大的意义就是避免写错写、漏写，能基本上屏蔽掉低级错误。

1. 编写一些公用方法和全局配置对象，用于提醒使用者别传错参数或者参数值
2. 编写组件时用于提示使用者有没有写错 `props` 
3. 一些第三方库如果使用 Ts 编写，可以检测有没有调错方法写错配置等

### 公共方法

比如接口函数，一些接口需要传参，传什么参数提前定义好可以减少试错时间。

```tsx
export interface listParams {
    pageNo: number,
    PageSize: 10 | 30 | 50
}

export const getPageFn = (params: listParams) => {
    return axios.get('xxx', params)
}
```

### 组件Props参数定义

在使用一个子组件时想要实现父子传参类型的定义和是否必传等。如果组件比较大，会新建一个 `.d.ts` 文件，导出一个接口类型。

```tsx
export interface propsType {
    a: number,
    b?: string
}
```

在组件中引入使用。

```js
import type {propsType} from './test.d.ts'

defineProps<propsType>()
```

后续在父组件中使用时如果不传a，则提示错误，Ts 的作用体现出来了。

### 第三方库

一些第三方库，比如 Vue-router，在使用 `js` 写时如果只传了 `path` 没传 `component` 或 `redirct` ，不会有任何报错提示，直到项目运行。换成 `ts` 后代码保存后就有提示。

![报错](https://pic.imgdb.cn/item/6609408c9f345e8d037af522.png)

其实有一个技巧，在写 `ts` 时把鼠标放在方法上是，可以看到它需要哪些参数以及那些参数的类型。

![参数提示](https://pic.imgdb.cn/item/660940ef9f345e8d037e0038.png)

## 常见问题

### 现阶段类型不匹配

来看几个场景：

1. 一般来说接口请求完后保存数据后，会使用一些属性，在一开始就会给变量初始化空对象。但是在使用时会报错。
2. 在使用一个变量时，一开始声明为空对象，虽然后续会给值，但是 ts 判断还是一个空对象，因此报错。

```js
const list = ref({})
const listParams = ref({})
listParams.value.pageNo = 1

getList(listParams).then(res => {
    list.value = res.data
})

console.log(list.value.a)
```

![error msg](https://pic.imgdb.cn/item/660941e79f345e8d03855808.png)

最常用的解决方法是使用断言，在声明变量时先断言需要使用的属性。

```tsx
interface listData {
    a: string
}
const list = ref<listData>({} as listData)
const listParams = ref({} as listParamsType)

getList({
    pageNo: 10,
    pageSize: 10
}).then(res => {
    list.value = res.data
})

console.log(list.value.a)
```

### 第三方库使用时没定义每个属性

比如使用 Vue-router，在函数接收形参时会报错说有隐式 `any` 类型。此时可以鼠标悬停查看其类型，一般正规大型的第三方库可以导出。导出后使用即可。

```tsx
import type {RouteRecordRaw} from 'vue-router'

function parseRoute(arr: RouteRecordRaw[]) {
    arr.forEach(item => {
        router.addRoute(item)
    })
}
```

如果他没有类型，则在 `node-modules` 内找到该第三方库的文件夹，点开 `package.json` 文件，找到 `types` 属性，根据路径寻找相对于的 `.d.ts` 文件，Ctrl + F寻找即可。

### Dom类型报错

在给一个 `div` 绑定一个点击事件时，形参会被推定为 `MouseEvent` ，其 `target` 属性会推定为 `EventTarget | null` 类型，这个时候如果再 `.innerHTML` 则会报错，因为只有 `HTMLElement` 类型才有该属性， ts 推断不对了，此时通过断言就能修改。如果是 `input` 想要拿到 `.value` ，则需断言为 `HTMLInputElement` 。

```vue
<div @click="(e) => {
             let target = e.target as HTMLElement
             target.innerHTMLElement
             }">
    click me
</div>
```

还有 `canvas` 画图表时推断报错，此时需要断言为相关类型 `HTMLCanvasElement` 。

```js
<div @click="(e) => {
             let target = e.target as HTMLCanvasElement
             target.getContext('2d')
             }">
    click me
</div>
```

