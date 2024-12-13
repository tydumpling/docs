# 项目初始化

## 项目创建

### hbuilder 创建

1. 下载 `hbuilder` ，官网指路：[hbuilder](https://www.dcloud.io/hbuilderx.html)

2. 新建项目，选择默认模板即可，版本选择 `Vue3`

3. 点击运行，选择微信小程序运行

   如果是第一次运行，他需要使用者给出微信小程序开发工具下载的路径地址，用于开启微信开发者工具。

   如果是初次运行且没打开微信开发者工具，他会报错，提示还没打开，打开即可。

   如果需要预览，需要配置 APPID ，在 `mainifets.json` 文件中的微信小程序配置添加。

4. 通过 `HBuilderX` 修改代码，通过微信开发者工具调试页面效果

### 命令行创建

使用命令行创建 `vue3 + ts` 项目步骤如下：

1. 输入命令行

   ```
   npx degit dcloudio/uni-preset-vue#vite-ts 项目名
   ```

2. 配置微信开发工具地址、配置 APPID 等操作（和上面一样）

3. 启动终端（首次使用需要先安装插件），再下载依赖

   ```
   npm i
   #or
   yarn
   # or
   pnpm i
   ```

4. 通过命令启动项目

   ```
   npm run dev:mp-weixin
   # or
   yarn dev:mp-weixin
   # or
   pnpm dev:mp-weixin
   ```

5. 启动项目成功后会在根目录下新增一个 `dist` 文件夹，打开微信开发者工具，导入 `dist/dev/mp-weixin` 文件夹，起一个项目名称，即可启动项目

6. 安装拓展

   VS code 安装对应插件帮助开发过程更舒服，插件如下：

   - 快速创建 `uniapp` 页面：`uni-create-view`
   - `uniapp` 代码提示：`uni-helper`
   - 鼠标悬停查看文档：`uniapp小程序扩展`

7. 安装 TS 配置

   - 安装依赖

     ```
     pnpm i -D @types/wechat-miniprogram @uni-helper/uni-app-types
     ```

   - 在 `tsconfig.json` 文件修改添加 TS 校验

     ```json
     {
       "compilerOptions": {
         // ...
         "types": [
           "@dcloudio/types",
           "@types/wechat-miniprogram",
           "@uni-helper/uni-app-types"
         ]
       },
       "vueCompilerOptions": {
         "experimentalRuntimeMode": "runtime-uni-app"
       }
     }
     ```

   ![zongjie](https://pic.imgdb.cn/item/64dae7ab1ddac507cc966334.jpg)

8. 配置 VS code 的设置让 `json` 文件允许添加注释

   - 打开设置
   - 输入 “文件关联”
   - 点击添加项按钮
   - 添加 `mainifest.json` 和 `pages.json` 两个文件，值为 `jsonc`

   效果如下图所示：

   ![效果](https://pic.imgdb.cn/item/64dae7111ddac507cc94fb62.jpg)

## UNI-UI 安装

官网指路：[uni-ui 官网](https://uniapp.dcloud.net.cn/component/uniui/quickstart.html) 。

由于项目是命令行创建的，因此采取 NPM 的方式引入项目，比单独引入好处在于可以获取最新版。

安装命令如下：

```
pnpm i sass sass-loader@10.1.1 -D
pnpm i @dcloudio/uni-ui
```

**配置 easycom**

使用 `npm` 安装好 `uni-ui` 之后，需要配置 `easycom` 规则，让 `npm` 安装的组件支持 `easycom`

打开项目根目录下的 `pages.json` 并添加 `easycom` 节点：

```javascript
// pages.json
{
  // 组件自动引入规则
	"easycom": {
    // 是否开启自动扫描
		"autoscan": true,
      // 正则方式自定义组件匹配规则
		"custom": {
			// uni-ui 规则如下配置
			"^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
		}
	},

	// 其他内容
	pages:[
		// ...
	]
}
```

**配置 TS 类型**

官方在写 `uni-ui` 时用 js 来写，因此没有类型。不过前端生态圈很完善，有民间人士写了相关的类型第三方库，配置步骤如下：

1. 安装依赖

   ```
   pnpm i @uni-helper/uni-ui-types -D
   ```

2. 去往 `tsconfig.json` 文件配置

   ```json
   {
     "compilerOptions": {
       // ...
       "types": [
         // ...
         "@uni-helper/uni-ui-types"
       ]
     }
   }
   ```

## 状态管理

状态管理使用了 `pinia` ，通过插件 `pinia-plugin-persistedstate` 实现持久化存储，用法与之前的一致。

在 `stores/index.ts` 文件中，创建 `pinia` 仓库：

```js
import { createPinia } from "pinia";
import persist from "pinia-plugin-persistedstate";

// 创建 pinia 实例
const pinia = createPinia();
// 使用持久化存储插件
pinia.use(persist);

// 默认导出，给 main.ts 使用
export default pinia;

// 模块统一导出
export * from "./modules/member";
```

在模块化 `stores/modules/member.ts` 中通过组合式创建模块话仓库：

```js
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useMemberStore = defineStore(
  'member',
  () => {
    // 会员信息
    const profile = ref<any>()

    // 保存会员信息，登录时使用
    const setProfile = (val: any) => {
      profile.value = val
    }

    // 清理会员信息，退出时使用
    const clearProfile = () => {
      profile.value = undefined
    }

    // 记得 return
    return {
      profile,
      setProfile,
      clearProfile,
    }
  },
  // TODO: 持久化
  {
    persist: true
  }
)
```

在 `main.ts` 文件中，引入 `pinia` 并注册：

```js
import { createSSRApp } from "vue";
import App from "./App.vue";
import pinia from "@/stores/index";

export function createApp() {
  const app = createSSRApp(App);
  app.use(pinia);

  return {
    app,
  };
}
```

> 注意
>
> 通过 `vue3 + uniapp` 创建的项目在微信小程序运行时，本地村粗不再是通过 `localStorage` ，而是通过 `uni.getStorageSync()` 等 API 实现。
>
> 因此，如果使用之前的本地持久化方法 `{ persist: true }` 会无法生效，需要修改持久化的方法。代码如下：
>
> ```js
> import { defineStore } from "pinia";
> import { ref } from "vue";
>
> // 定义 Store
> export const useMemberStore = defineStore(
>   "member",
>   () => {
>     // ...
>   },
>   // TODO: 持久化
>   {
>     persist: {
>       storage: {
>         getItem(key: string) {
>           return uni.getStorageSync(key);
>         },
>         setItem(key: string, value: any) {
>           uni.setStorageSync(key, value);
>         },
>       },
>     },
>   }
> );
> ```

## 请求封装

### 拦截器封装

小程序与 APP 不支持 `axios` ，可以使用 `uniapp` 提供的 `uni.request` 方法发送请求获取数据。该方法可通过 `uni.addInterceptor` 做二次封装。

二次封装的思路如下：

- 拦截器

  `request` 请求、`uploadFile` 上传文件请求

- 请求函数

  1. 基础地址，并判断当前路径是否是完整路径。非完整路径则拼接基准路径
  2. 超时时间。默认 60 秒，单位为毫秒
  3. 添加小程序端请求体标识
  4. 添加 `token`

代码如下所示：

```js
/**
 * 添加拦截器：
 *  拦截 request 请求
 *  拦截 uploadFile 文件上传
 *
 * 需要实现的步骤：
 *  非 http 开头需要拼接地址
 *  请求超时
 *  添加小程序端请求体标识
 *  添加 token 请求体标识
 */

import { useMemberStore } from "@/stores/index";

// 基准路径
const baseURL = "https://pcapi-xiaotuxian-front-devtest.itheima.net";

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1. 非 http 开通需要拼接地址
    if (!options.url.startsWith("http")) options.url = baseURL + options.url;

    // 2. 请求超时，默认60s，单位为ms
    options.timeout = 10000;

    // 3. 添加小程序端请求头标识
    options.header = {
      ...options.header,
      "source-client": "miniapp",
    };

    // 4. 添加 token 请求头
    const memberStore = useMemberStore();
    const token = memberStore.profile?.token;
    if (token) options.header.Authorization = token;
  },
};
uni.addInterceptor("request", httpInterceptor);
uni.addInterceptor("uploadFile", httpInterceptor);
```

### 请求函数封装

封装完拦截器后，在 `.vue` 文件中导入相关文件，再通过 `uni.request` 方法即可实现接口请求。代码如下：

```vue
<script setup lang="ts">
import "@/utils/http";

const getBanner = () => {
  uni.request({
    method: "GET",
    url: "/home/banner",
  });
};
</script>
```

但是如果每个接口都需要这么写，重复步骤太多显得繁琐，最好的方法是封装一个请求函数，按需导出给外部使用。在 `utils/http.ts` 文件中封装一个请求函数，思路如下：

1. 返回 `Promise` 对象
2. 判断其请求响应状态
   - 成功：提取核心数据，添加类型，支持泛型
   - 失败：判断错误类型并作出相应的处理
3. 设置泛型返回数据类型

代码如下：

```tsx
/**
 * 响应函数
 * @param UniApp.RequestOptions
 * @returns Promise
 *  1. 返回 Promise 对象
 *  2. 请求成功
 *    2.1 提取核心数据
 *    2.2 添加类型，支持泛型
 *  3. 请求失败
 *    3.1 网络错误 -> 提示用户更换网络
 *    3.2 401错误 -> 清除用户信息，跳转登录页
 *    3.1 其他错误 -> 根据后端错误信息提示
 */

interface Data<T> {
  code: string;
  msg: string;
  result: T;
}

// 泛型支持
export const http = <T,>(options: UniApp.RequestOptions) => {
  // 返回 Promise 对象
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,

      // 请求成功
      success(res) {
        // 提取核心数据 res.data
        resolve(res.data as Data<T>);
      },

      // 请求失败
      fail(err) {
        // 给予轻提示
        reject(err);
      },
    });
  });
};
```

现在只需要按需导入使用即可。代码如下：

```vue
<script setup lang="ts">
import { http } '@/utils/http'

const getBanner = () => {
  http<string[]>({
    method: 'GET',
    url: '/home/banner',
  }).then(res => {
    console.log(res)
  })
}
</script>
```

但是刚才的封装并没有太严谨，因为请求响应成功后他并没有做状态码的区分，需要做状态码判断处理。

错误处理总共分为以下几部分：

1. 请求失败
2. 登录过期
3. 网络无响应

针对不同的错误做不同的处理，代码如下所示：

```js
// 泛型支持
export const http = <T>(options: UniApp.RequestOptions) => {
  // 返回 Promise 对象
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,

      // 请求成功
      success(res) {
        console.log(res)

        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 提取核心数据 res.data
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // 登录过期，清除登录信息
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          // 返回登录页
          uni.navigateTo({ url: '/pages/login/index' })
          reject(res)
        } else {
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求错误',
          })
          reject(res)
        }
      },

      // 请求失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        // 给予轻提示
        reject(err)
      },
    })
  })
}
```

### 接口类型设置

接口设置了类型之后该类型会被泛型 `T` 接收，作为 `result` 属性的数据类型。接口函数 `ts` 类型如下所示：

```js
export const getHomeCategoryApi = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: '/home/category/mutli',
  })
}
```

## 总结

### 请求拦截器与请求函数的封装

```js
/**
 * 添加拦截器：
 *  拦截 request 请求
 *  拦截 uploadFile 文件上传
 *
 * 需要实现的步骤：
 *  非 http 开头需要拼接地址
 *  请求超时
 *  添加小程序端请求体标识
 *  添加 token 请求体标识
 */

import { useMemberStore } from '@/stores/index'

// 基准路径
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1. 非 http 开通需要拼接地址
    if (!options.url.startsWith('http')) options.url = baseURL + options.url

    // 2. 请求超时，默认60s，单位为ms
    options.timeout = 10000

    // 3. 添加小程序端请求头标识
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }

    // 4. 添加 token 请求头
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) options.header.Authorization = token
  },
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 响应函数
 * @param UniApp.RequestOptions
 * @returns Promise
 *  1. 返回 Promise 对象
 *  2. 请求成功
 *    2.1 提取核心数据
 *    2.2 添加类型，支持泛型
 *  3. 请求失败
 *    3.1 网络错误 -> 提示用户更换网络
 *    3.2 401错误 -> 清除用户信息，跳转登录页
 *    3.1 其他错误 -> 根据后端错误信息提示
 */

interface Data<T> {
  code: string
  msg: string
  result: T
}

// 泛型支持
export const http = <T>(options: UniApp.RequestOptions) => {
  // 返回 Promise 对象
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,

      // 请求成功
      success(res) {
        console.log(res)

        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 提取核心数据 res.data
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // 登录过期，清除登录信息
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          // 返回登录页
          uni.navigateTo({ url: '/pages/login/index' })
          reject(res)
        } else {
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求错误',
          })
          reject(res)
        }
      },

      // 请求失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        // 给予轻提示
        reject(err)
      },
    })
  })
}
```

### 请求接口函数使用

```js
// 首页分类导航
export const getHomeCategoryApi = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: '/home/category/mutli',
  })
}
```

### 请求接口函数数据的类型

```js
// 分类单项类型
export type CategoryItem = {
  icon: string
  id: string
  name: string
}
```

