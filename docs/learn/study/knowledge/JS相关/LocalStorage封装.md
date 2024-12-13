# LocalStorage封装

## 基础封装

本地存储方法 `localstorage` 封装首先需要对相关的 API 做封装，其中还需要涉及到以下的思想：

1. key的命名防止互相污染
2. 设置时效性
3. 敏感信息加密
4. 版本更替
5. ssr兼容
6. 内存大小检测

封装方法可以用到 Vue3 的 hook 思想，新建一个 `js` 文件，创建一个函数，在其中创建变量和方法，最后 `return` 返回出去供外部使用。基础代码如下：

```js
export const useStorage = () => {
  // 保存值
  const setItem = (key, value) => {
    // 防止没有传正常的值
    if(!value) value = null
    if(!key) return throw new Error('请传要保存的键名')
    
    localStorage.setItem(key, JSON.stringify(value))
  }
  
  // 获取值
  const getItem = (key) => {
    if(!key) return throw new Error('请传要查的键名')
    
    if(!localStorage.getItem(key) ||  JSON.stringify(window[config.type].getItem(key)) === 'null') return null
    
    return JSON.parse(localStorage.getItem(key))
  }
  
  //  删除值
  const removeItem = (key) => {
    if(!key) return throw new Error('请传要删除的键名')
    
    localStorage.removeItem(key)
  }
  
  // 获取全部本地缓存
  const getAllItem = () => {
    let len = localStorage.length // 可以获取到本地存储的长度
    let arr = new Array() // 定义数组
    for(let i = 0; i < len; i++) {
      // 获取key 索引从0开始
      let getKey = localStorage.key(i)
      // 获取key对应的值
      let getVal = localStorage.getItem(getKey)
      // 放进数组
      arr[i] = { 'key': getKey, 'val': getVal, }
    }
    
    return arr
  }
  
  return {
    setItem,
    getItem,
    removeItem,
    getAllItem
  }
}
```

## 时效性设置

Storage 本身是不支持过期时间设置的，要支持设置过期时间，可以效仿 Cookie 的做法，在存储的时候保存当前的时间戳，在获取的时候获取时间戳来实现时效性。

在设置时效性时用相对时间，单位秒，要对所传参数进行类型检查。可以设置统一的过期时间，也可以对单个值得过期时间进行单独配置。两种方式按需配置。

```js
export const useStorage = () => {
  // 保存值
  const setItem = (key, value, expire = 60) => {
    // 防止没有传正常的值
    if(!value) value = null
    if(!key) return throw new Error('请传要保存的键名')
    
    // 时间是否有效数值
    if (isNaN(expire) || expire < 0) throw new Error("Expire must be a number");

    // 格式化值设置
    let data = {
      value,
      time: Date.now(),
      expire: expire * 1000 // 转为毫秒
    }
    localStorage.setItem(key, JSON.stringify(data))
  }
  
  // 获取值
  const getItem = (key) => {
    if(!key) return throw new Error('请传要查的键名')
    
    if(!localStorage.getItem(key) ||  JSON.stringify(window[config.type].getItem(key)) === 'null') return null
    
    let storage = JSON.parse(localStorage.getItem(key))
    let nowTime = Date.now()
    
    if(storage.expire && nowTime - storage.time < storage.expire) {
      // 还在有效期内，续时间
      setItem(key, storage.value)
    	return storage
    } else {
      // 不在有效期内，删除
      removeItem(key)
      return null
    }
  }
  
  // ...
}
```

## 信息加密

信息加密有很多种，比如基础的 base64 加密、md5 加密等。这里引用 `crypto-js` 第三方库作为加密方式。

```js
npm install crypto-js

// 引入 crypto-js 有以下两种方式
import CryptoJS from "crypto-js";
// 或者
const CryptoJS = require("crypto-js");
```

使用方式为设置密钥，密钥通过 md5 加密生成，代码如下：

```js
// 十六位十六进制数作为密钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse("3333e6e143439161");
// 十六位十六进制数作为密钥偏移量
const SECRET_IV = CryptoJS.enc.Utf8.parse("e3bbe7e3ba84431a");
```

封装加密算法：

```js
/**
 * 加密方法
 * @param data
 * @returns {string}
 */
export function encrypt(data) {
  if (typeof data === "object") {
    try {
      data = JSON.stringify(data);
    } catch (error) {
      console.log("encrypt error:", error);
    }
  }
  const dataHex = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString();
}
```

封装解密算法：

```js
/**
 * 解密方法
 * @param data
 * @returns {string}
 */
export function decrypt(data) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
```

修改设置和获取数据的方法，需要传入一个参数为是否需要加密，默认为 `false` 不需要。代码如下：

```js
export const useStorage = () => {
  // 保存值
  const setItem = (key, value, expire = 60, isEncrypt = false) => {
    // 防止没有传正常的值
    if(!value) value = null
    if(!key) return throw new Error('请传要保存的键名')
    
    if (isNaN(expire) || expire < 0) throw new Error("Expire must be a number");
    
    // 格式化值设置
    let data = {
      value,
      time: Date.now(),
      expire: expire * 1000 // 转为毫秒
    }
    
    // 判断是否需要加密
    const encryptString = isEncrypt ? encrypt(JSON.stringify(data)): JSON.stringify(data);
    
    localStorage.setItem(key, encryptString)
  }
  
  // 获取值
  const getItem = (key) => {
    if(!key) return throw new Error('请传要查的键名')
    
    if(!localStorage.getItem(key) ||  JSON.stringify(localStorage.getItem(key)) === 'null') return null
    
    // 对存储数据进行解密
    const storage = isEncrypt ? JSON.parse(decrypt(localStorage.getItem(key))) : JSON.parse(localStorage.getItem(key));
    let nowTime = Date.now()
    
    if(storage.expire && nowTime - storage.time < storage.expire) {
      // 还在有效期内，续时间
      setItem(key, storage.value)
    	return storage
    } else {
      // 不在有效期内，删除
      removeItem(key)
      return null
    }
  }
  
  //  ...
}
```

## 防止命名污染

方法为创建一个变量作为本地存储命名前缀，这样可以一定程度减少命名污染，代码如下：

```js
import CryptoJS from "crypto-js";
import { ref } from 'vue'

export const useStorage = () => {
  // 前缀名称
  const prefixName = ref('')
  
  // 名称前自动添加前缀
	const autoAddPrefixName = (key) => {
    const prefix = prefix ? prefix + '_' : '';
    return  prefix + key;
	}
  
  // 保存值
  const setItem = (key, value, expire = 60, isEncrypt = false) => {
    // ...
    
    localStorage.setItem(autoAddPrefixName(key), encryptString)
  }
  
  // ...
  
  return {
    prefixName,
    // ...
  }
}
```

在根组件 `App.vue` 中引入设置 `prefixName` 的值即可，由于他是响应式数据，因此全局都有效。

## 内存监测

内存检测通过循环遍历所有保存的数据，`getItem()` 获取到数据之后再使用 `.length` 获取数据大小。最后累加起来除以 1024 再除以 1024，保留两位小数即可获取 MB 为单位的已用内存数据。

可以封装一个函数，代码如下：

```js
import CryptoJS from "crypto-js";
import { ref } from 'vue'

export const useStorage = () => {
  // ...
  
  // 监测内存函数封装
  const getStorageSize = () => {
    let sizeStore = 0
    for(item in window.localStorage) {
			if(window.localStorage.hasOwnProperty(item)) {
				sizeStore += window.localStorage.getItem(item).length;
			}
		}
    return (sizeStore / 1024 / 1024).toFixed(2)
  }
  
  // 保存值
  const setItem = (key, value, expire = 60, isEncrypt = false) => {
    // 查看已存了多大的内存
    const size = getStorageSize()
    if(size >= 5) return throw new Error('内存不足')
    
    // ...
    
    localStorage.setItem(autoAddPrefixName(key), encryptString)
  }
  
  // ...
}
```

## 完整代码

如果有可优化或可扩展的建议，欢迎提个 PR 说明，我会进一步迭代。可以根据自己的需要删除一些不用的方法，以减小文件大小。

```js
import CryptoJS from "crypto-js";
import { ref } from 'vue'

export const useStorage = () => {
  // 前缀名称
  const prefixName = ref('')
  
  // 名称前自动添加前缀
	const autoAddPrefixName = (key) => {
    const prefix = prefix ? prefix + '_' : '';
    return  prefix + key;
	}
  
  // 保存值
  const setItem = (key, value, expire = 60, isEncrypt = false) => {
    // 防止没有传正常的值
    if(!value) value = null
    if(!key) return throw new Error('请传要保存的键名')
    
    if (isNaN(expire) || expire < 0) throw new Error("Expire must be a number");
    
    // 格式化值设置
    let data = {
      value,
      time: Date.now(),
      expire: expire * 1000 // 转为毫秒
    }
    
    // 判断是否需要加密
    const encryptString = isEncrypt ? encrypt(JSON.stringify(data)): JSON.stringify(data);
    localStorage.setItem(autoAddPrefixName(key), encryptString)
  }
  
  // 获取值
  const getItem = (key) => {
    if(!key) return throw new Error('请传要查的键名')
    
    if(!localStorage.getItem(autoAddPrefixName(key)) || JSON.stringify(localStorage.getItem(autoAddPrefixName(key))) === 'null') return null
    
    // 对存储数据进行解密
    const storage = isEncrypt ? JSON.parse(decrypt(localStorage.getItem(autoAddPrefixName(key)))) : JSON.parse(localStorage.getItem(autoAddPrefixName(key)));
    let nowTime = Date.now()
    
    if(storage.expire && nowTime - storage.time < storage.expire) {
      // 还在有效期内，续时间
      setItem(key, storage.value)
    	return storage
    } else {
      // 不在有效期内，删除
      removeItem(key)
      return null
    }
  }
  
  //  删除值
  const removeItem = (key) => {
    if(!key) return throw new Error('请传要删除的键名')
    localStorage.removeItem(autoAddPrefixName(key))
  }
  
  // 获取全部本地缓存
  const getAllItem = () => {
    let len = localStorage.length // 可以获取到本地存储的长度
    let arr = new Array() // 定义数组
    for(let i = 0; i < len; i++) {
      // 获取key 索引从0开始
      let getKey = localStorage.key(i)
      // 获取key对应的值
      let getVal = localStorage.getItem(getKey)
      // 放进数组
      arr[i] = { 'key': getKey, 'val': getVal, }
    }
    
    return arr
  }
  
  return {
    setItem,
    getItem,
    removeItem,
    getAllItem，
    prefixName
  }
}

// 十六位十六进制数作为密钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse("3333e6e143439161");
// 十六位十六进制数作为密钥偏移量
const SECRET_IV = CryptoJS.enc.Utf8.parse("e3bbe7e3ba84431a");

/**
 * 加密方法
 * @param data
 * @returns {string}
 */
export function encrypt(data) {
  if (typeof data === "object") {
    try {
      data = JSON.stringify(data);
    } catch (error) {
      console.log("encrypt error:", error);
    }
  }
  const dataHex = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString();
}

/**
 * 解密方法
 * @param data
 * @returns {string}
 */
export function decrypt(data) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
```

