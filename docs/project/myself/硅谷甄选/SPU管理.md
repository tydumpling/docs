---
title 甄选SPU管理
---

# SPU管理

SPU 管理模块页面效果如下所示：

![VRNnuC.png](https://i.imgloc.com/2023/07/02/VRNnuC.png)

主要需要注意的是 SPU 属性的添加。属性值通过接口调用获取，下拉框选择完属性后点击按钮可以添加到表格内。下一次选择的时候就无法再选择该属性，效果如下图所示：

[![pCrzUOI.png](https://s1.ax1x.com/2023/07/03/pCrzUOI.png)](https://imgse.com/i/pCrzUOI)

## 属性添加

点击按钮把用户选择的属性添加到表格中，主要步骤如下：

1. 调用接口获取数据，循环遍历渲染到选择器中
2. 点击添加按钮后把数据添加到表格数据绑定的数组中

首先需要获取数据并保存到一个数组内，通过 `v-for` 循环遍历数据渲染给 `el-option` 组件，代码如下所示：

```vue
<script setup ts>
// 计算出当前还未拥有的销售属性
const unSelectAttrList = computed(() => {
  let unSelectArr = spuAttrList.value.filter((item) => {
    return spuHasAttrList.value.every((item1) => {
      // 当该item项都不匹配，返回true，被filter过滤除去
      return item.name !== item1.saleAttrName
    })
  })
  return unSelectArr
})
</script>

<el-select
  v-model="saleChoseAttrVal"
  :placeholder="`还有${unSelectAttrList.length}个未选择`"
  :disabled="typeIsInfo"
>
  <el-option
    v-for="item in unSelectAttrList"
    :key="item.id"
    :value="`${item.id}:${item.name}`"
    :label="item.name"
  >
    {{ item.name }}
  </el-option>
</el-select>
<el-button
  :disabled="!saleChoseAttrVal && typeIsInfo"
  type="primary"
  icon="Plus"
  style="margin-left: 15px"
  @click="addAttrFn"
>
  添加销售属性
</el-button>
```

上方代码中，需要注意两个地方：

1. 通过计算属性把用户未选择的数据过滤处理，通过 `every()` 方法判断当前项是否与已选择属性数组内所有项相等，如果为真，则说明数组内已经有该数据，已经被选择过，此时应该被 `filter` 过滤出去。

   代码可以拆分为两步：

   - 判断当前项是否已被选择

     ```js
     spuAttrList.value.forEach((item) => {
       let flag = spuHasAttrList.value.every((item1) => item.name !== item1.saleAttrName)
     })
     ```

     `flag` 为 `true` 时表示当前项并不存在于已选择的数组内，`false` 反之

   - 过滤魏村在的数据为新的数组

     ```js
     let arr = spuAttrList.value.filter((item) => {
       let flag = spuHasAttrList.value.every((item1) => item.name !== item1.saleAttrName)
       return flag
     })
     ```

2. 接口需要传递 `id` ，而表格需要其 `name` 属性渲染，以往在处理 `:value` 时我们都是为其设置 `id` ，此处可以通过模板字符串拼接 `id` 和 `name` 的方式，获取两个需要属性

## 添加数据

点击添加按钮后解析出 `id` 和 `name` ，加上属性值数组组成新的对象，添加在表格列表数组中，再把选择框内的内容清空，代码如下所示：

```js
// 销售属性选择
const saleChoseAttrVal = ref('')
const addAttrFn = () => {
  console.log(saleChoseAttrVal.value)
  // 准备初始化新的对象
  const [baseSaleAttrId, saleAttrName] = saleChoseAttrVal.value.split(':')
  let newSaleAttr: spuSaleItemType = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  console.log(newSaleAttr)
  // 追加到属性表格中
  spuHasAttrList.value.push(newSaleAttr)
  saleChoseAttrVal.value = ''
}
```

通过点击表格的加号显示输入框，隐藏按钮，输入数据后回车或失焦时把数据保存到对象内，代码如下所示：

```js
// 输入框失焦事件
const handleBlurFn = (row: spuSaleItemType) => {
  const { saleAttrValue, baseSaleAttrId } = row
  // 如果为空，返回
  if(!saleAttrValue?.trim()) {
    ElMessage.warning('属性值不能为空')
    return
  }

  // 判断属性值是否在数组中存在
  const obj = row.spuSaleAttrValueList.find(item => item.saleAttrValueName === saleAttrValue)
  if(obj) {
    ElMessage.warning('已存在相同的属性值，请更换')
    return
  }

  let newSaleAttrValue: spuSaleAttrValueListType = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue!
  }

  // 往数组内新增数据
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.flag = false
  row.saleAttrValue = ''
}
```

上方代码中，判断当前输入内容是否为空，为空则返回错误提示并阻止输入框失焦。判断用户输入的内容是否在当前对象数组内有重复数据，有也弹出提示。

最终效果实现。

## 编辑数据

在编辑数据时通过为编辑按钮绑定点击事件，传递当前项的对象数据来获取被选中的数据项，代码如下所示：

```js
const handleEditFn = (row) => {
  show.value = true
  initAttrData.value = row
}
```

此时能够获取到数据，页面也能回显，修改点击保存按钮后也能成功保存。

但是有一个潜在的问题，当我们再一次点击编辑，修改数据后，不需要保存这一次的修改了，点击取消按钮，发现数据同样也被改了，但是不是调接口，因此刷新后数据恢复正常。

这个 BUG 的原因是在赋值的时候，我们实际上是把复杂数据类型的对象类型的地址传过去。因此，数组内该项的数据与点击编辑时赋值的对象的数据的地址是一致的，也就造成了改了数据后视图发生变化。

解决方法：通过深拷贝来解决问题。

## 拓展：深拷贝的N种方法

### Object.assign

`Object.assign`默认是对对象进行深拷贝的，但是我们需要注意的是，它只对最外层的进行深拷贝，也就是当对象内嵌套有对象的时候，被嵌套的对象进行的还是浅拷贝；

```js
function cloneDeepAssign(obj){
  return Object.assign({},obj)
  //Object.assign({},obj)
}
```

（温馨提示：数组拷贝方法当中，使用`...`、`slice`、`concat`等进行拷贝也是一样的效果，只深拷贝最外层）

同时，我们知道`Object.assign`针对的是对象自身可枚举的属性，对于不可枚举的没有效果；

所以，当我们对于一个层次单一对象的时候，可以考虑这种方法，简单快捷。（试过了，也不支持`undefined`）

### JSON实现的深拷贝

这是我们最最最常提到的一种深拷贝的方式，一般大部分的深拷贝都可以用`JSON`的方式进行解决，本质是因为`JSON`会自己去构建新的内存来存放新对象。

```js
function cloneDeepJson(obj){
  return JSON.parse(JSON.stringify(obj))
}
```

但是我们要注意的是：

- 会忽略 `undefined`和`symbol`；
- 不可以对`Function`进行拷贝，因为`JSON`格式字符串不支持`Function`，在序列化的时候会自动删除；
- 诸如 `Map`, `Set`, `RegExp`, `Date`, `ArrayBuffer `和其他内置类型在进行序列化时会丢失；
- 不支持循环引用对象的拷贝;（循环引用的可以大概地理解为一个对象里面的某一个属性的值是它自己）

### MessageChannel

```js
function deepCopy(obj) {
  return new Promise((resolve) => {
    const {port1, port2} = new MessageChannel();
    port2.onmessage = ev => resolve(ev.data);
    port1.postMessage(obj);
  });
}

deepCopy(obj).then((copy) => {// 异步的
    let copyObj = copy;
    console.log(copyObj, obj)
    console.log(copyObj == obj)
});
```

（个人感觉这种方法还挺有意思的，如果面试的讲出来的话，应该会给面试官一个小惊喜🙌）

缺点：最大的缺点就是异步的，同时也无法支持`Function`

另外，如果对`MessageChannel`感兴趣的友友，为您推荐一篇简单易懂的小文章->[MessageChannel是什么，怎么使用？ - 简书 (jianshu.com)](https://link.juejin.cn/?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F4f07ef18b5d7)

### 递归实现

```js
function cloneDeepDi(obj){
  const newObj = {};
  let keys = Object.keys(obj);
  let key = null;
  let data = null;
  for(let i = 0; i<keys.length;i++){
    key = keys[i];
    data = obj[key];
    if(data && typeof data === 'object'){
      newObj[key] = cloneDeepDi(data)
    }else{
      newObj[key] = data;
    }
  }
  return newObj
}
```

这也是我们最最最最常用的一种解决方案，面试必备，所以扪心自问，你把它写的滚瓜烂熟了嘛？

虽然但是，它也是有缺点的，就是不能解决循环引用的问题，一旦出现了循环引用，就死循环了！

### 解决循环引用的递归实现

```js
js复制代码function deepCopy(obj, parent = null) {
    // 创建一个新对象
    let result = {};
    let keys = Object.keys(obj),
        key = null,
        temp = null,
        _parent = parent;
    // 该字段有父级则需要追溯该字段的父级
    while (_parent) {
        // 如果该字段引用了它的父级则为循环引用
        if (_parent.originalParent === obj) {
            // 循环引用直接返回同级的新对象
            return _parent.currentParent;
        }
        _parent = _parent.parent;
    }
    for (let i = 0; i < keys.length; i++) {
        key = keys[i];
        temp = obj[key];
        // 如果字段的值也是一个对象
        if (temp && typeof temp === 'object') {
            // 递归执行深拷贝 将同级的待拷贝对象与新对象传递给 parent 方便追溯循环引用
            result[key] = DeepCopy(temp, {
                originalParent: obj,
                currentParent: result,
                parent: parent
            });

        } else {
            result[key] = temp;
        }
    }
    return result;
}
```

大致的思路是：判断一个对象的字段是否引用了这个对象或这个对象的任意父级，如果引用了父级，那么就直接返回同级的新对象，反之，进行递归的那套流程。

但其实，还有一种情况是没有解决的，就是子对象间的互相引用，不理解什么意思的友友，可以看->[Javascript之深拷贝 - 知乎 (zhihu.com)](https://link.juejin.cn/?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F23251162)的后半部分的内容，对应也写给出来解决方案；（鄙人懒，就不赘述了🤶）

### [lodash](https://link.juejin.cn/?target=https%3A%2F%2Flodash.com%2F)的_.cloneDeep()

```js
var _ = require('lodash');
var obj1 = {
    a: 1,
    b: { f: { g: 1 } },
    c: [1, 2, 3]
};
var obj2 = _.cloneDeep(obj1);
console.log(obj1.b.f === obj2.b.f);// false
```

这是最最最最完美的深拷贝的方式，它已经将会出现问题的各种情况都考虑在内了，所以在日常项目开发当中，建议使用这种成熟的解决方案；关于原理分析，鄙人无能，只能为各位大佬指个路:

[Lodash](https://link.juejin.cn/?target=https%3A%2F%2Flodash.com%2F)

[lodash.cloneDeep | Lodash 中文文档 | Lodash 中文网 (lodashjs.com)](https://link.juejin.cn/?target=https%3A%2F%2Fwww.lodashjs.com%2Fdocs%2Flodash.cloneDeep%2F)

[BlogPosts/lodash深拷贝源码探究.md at master · moyui/BlogPosts · GitHub](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmoyui%2FBlogPosts%2Fblob%2Fmaster%2F2018%2Flodash%E6%B7%B1%E6%8B%B7%E8%B4%9D%E6%BA%90%E7%A0%81%E6%8E%A2%E7%A9%B6.md)

注：其实lodash解决循环引用的方式，就是用一个栈记录所有被拷贝的引用值，如果再次碰到同样的引用值的时候，不会再去拷贝一遍，而是利用之前已经拷贝好的。

### 总结

其实了解了以上的方式就已经非常够用了；重点记住，在日常生产环境当中，使用完美方案—`lodash.cloneDeep`，面试问起来的话，重点使用递归实现，JSON、Object.assgin、MessageChannel都可以作为补充，这基本上就已经回答的非常好了。

本文重点的内容其实到这里就结束了，后面是补充一些不太常用的方法，感兴趣的友友可以继续了解

#### 补充一些不太主流的方法

##### 对象各种方法的应用

```js
let deepClone = function (obj) {
    let copy = Object.create(Object.getPrototypeOf(obj));
    let propNames = Object.getOwnPropertyNames(obj);
    propNames.forEach(function (items) {
        let item = Object.getOwnPropertyDescriptor(obj, items);
        Object.defineProperty(copy, items, item);

    });
    return copy;
};
```

##### for..in.与Object.create结合实现

```js
function deepClone(initalObj, finalObj) {   
    var obj = finalObj || {};   
    for(var i in initalObj) {       
	var prop = initalObj[i];        // 避免相互引用对象导致死循环，如initalObj.a = initalObj的情况
	if(prop === obj)  continue;      
	if(typeof prop === 'object') {
            obj[i] = (prop.constructor === Array) ? [] : Object.create(prop);
        } else {
          obj[i] = prop;
        }
    }   
    return obj;
}
```

##### History API

利用history.replaceState。这个api在做单页面应用的路由时可以做无刷新的改变url。这个对象使用结构化克隆，而且是同步的。但是我们需要注意，在单页面中不要把原有的路由逻辑搞乱了。所以我们在克隆完一个对象的时候，要恢复路由的原状。

```js
function structuralClone(obj) {
   const oldState = history.state;
   const copy;
   history.replaceState(obj, document.title);
   copy = history.state;
   history.replaceState(oldState, document.title); 
   return copy;
}

var obj = {};
var b = {obj};
obj.b = b

var copy = structuralClone(obj);
console.log(copy);
```

这个方法的优点是。能解决循环对象的问题，也支持许多内置类型的克隆。并且是同步的。但是缺点就是有的浏览器对调用频率有限制。比如Safari 30 秒内只允许调用 100 次

##### Notification API

这个api主要是用于桌面通知的。如果你使用Facebook的时候，你肯定会发现时常在浏览器的右下角有一个弹窗，对就是这家伙。我们也可以利用这个api实现js对象的深拷贝。

```js
function structuralClone(obj) { 
  return new Notification('', {data: obj, silent: true}).data;
}
var obj = {};
var b = {obj};
obj.b = b

var copy = structuralClone(obj);
console.log(copy)
```

同样是优点和缺点并存，优点就是可以解决循环对象问题，也支持许多内置类型的克隆，并且是同步的。缺点就是这个需要api的使用需要向用户请求权限，但是用在这里克隆数据的时候，不经用户授权也可以使用。在http协议的情况下会提示你再https的场景下使用。

#### 参考资料

[壹.3.1 深拷贝与浅拷贝 - 前端内参 (gitbook.io)](https://link.juejin.cn/?target=https%3A%2F%2Fcoffe1891.gitbook.io%2Ffrontend-hard-mode-interview%2F1%2F1.3.1)

[深拷贝的三种实现方式是什么-常见问题-PHP中文网](https://link.juejin.cn/?target=https%3A%2F%2Fwww.php.cn%2Ffaq%2F465102.html%23%3A~%3Atext%3D%E6%B7%B1%E6%8B%B7%E8%B4%9D%E7%9A%84%E4%B8%89%E7%A7%8D%E5%AE%9E%E7%8E%B0%2Cxtend%E6%96%B9%E6%B3%95%E3%80%82)