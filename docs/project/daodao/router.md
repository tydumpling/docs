# 路由自动导入

## 前置知识

通过 `vite` 创建的项目可以通过 `import.meta.glob` 实现路由自动导入，括号内的参数是匹配文件的路径，在该路径的文件设置了 `page.js` 后就能被获取到，返回值是匹配到的文件。

## 实现

### 基础实现

```js
const pages = import.meta.glob('../views/**/page.js')

console.log(pages)
```

该代码会自动导入 `./views/**/*page.js` 下的所有包含 `page.js` 文件，打印如下：

![打印](https://pic.imgdb.cn/item/662529260ea9cb1403e4c62f.png)

可以看到它能拿到所有匹配到的文件，因为该方法是编译时态，所以能读取源码目录结构。但是这些信息还不是最需要的，在路由中还需要元信息 `meta` ，获取的时候只需要获取导出结果。

### 获取导出

在每个 `page.js` 文件中默认导出需要的信息：
```js
import cssImg from '@/assets/img/filter.jpg'

export default {
    title: '视觉效果',
    info: 'filter属性实现更丰富的图形效果',
    img: cssImg,
    menuOrder: 2,
}
```

```js
const pages = import.meta.glob('../views/**/page.js', { // [!code ++]
    eager: true, // [!code ++] // 只获取导出结果
    import: 'default', // [!code ++] // 获取默认导出
}) // [!code ++]

console.log(pages)
```
此时查看打印，可以看到已经获取到了导出结果，但是还是需要手动处理一下：

![打印](https://pic.imgdb.cn/item/66252b160ea9cb1403eaf1e7.png)

现在能拿到文件路径和导出信息的键值对。后续可通过循环遍历格式化为路由数组。

### 处理路由
下面来处理一下路由数组：
- path：对象的键名就是该路由的路径，只需通过 `replace` 去除不需要的前缀和后缀即可
- name：通过文件路径修改连接符生成文件名
- meta：路由元信息，即键值
- component：通过文件路径替换掉 `page.js` ，修改为 `index.vue` 
```js
const routes = Object.entries(pages).map([path, meta]) => {
    const compPath = path.replace('../views', '').replace('/page.js', 'index.vue')
    path = path.replace('../views', '').replace('/page.js', '') || '/'
    const name = path.split('/').filter(Boolean).json('-')
    return {
        path,
        name,
        component: () => import(compPath),
        meta
    }
}
```

保存后发现有效果，但是这还是有小问题，打包项目后运行项目，会发现项目报错。打包过后这些路径是不存在的，工程化打包后文件路径会发生改变。

而上面这个做法是把一个变量赋值过去，打包时它不知道这个变量的值是多少，无法得知当前模块依赖了哪些其他的模块。因此需要生成依赖关系。

### 建立依赖

获取所有路由 `.vue` 组件路径：

```js
const comps = import.meta.glob('../views/**/index.vue')
```
打印结果如下：
![模块打印](https://pic.imgdb.cn/item/66252e700ea9cb1403f28df3.png)

此时再进行处理：

```js
const comps = import.meta.glob('../views/**/index.vue') // [!code ++]

const routes = Object.entries(pages).map([path, meta]) => {
    const compPath = path.replace('../views', '').replace('/page.js', 'index.vue')
    path = path.replace('../views', '').replace('/page.js', '') || '/'
    const name = path.split('/').filter(Boolean).json('-')
    return {
        path,
        name,
        component: comps[compPath], // [!code ++]
        meta
    }
}
```

此时打包后运行项目，发现路由已经正常加载了。

## 总结

通过 `import.meta.glob` 实现路由自动导入，该方法是编译时态，所以能读取源码目录结构。

需要注意的是， `import.meta.glob` 获取到的文件路径是相对路径，需要通过 `path.replace` 处理一下。在设置路由组件 `component` 属性时，需要设置依赖关系，让其在打包时能自动关联对应的路由组件。