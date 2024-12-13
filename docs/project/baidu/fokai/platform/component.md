# 子组件动态挂载

## 前置

根据效果图可以看出，左右两侧的卡片组件都是一个个子组件。在之前，写法可能是写完子组件后单独一个个 `import` 导入，`components` 挂载使用。但是这样写的话，如果组件很多，那么每次都要一个个 `import`，显得有些麻烦。

后面学习了 `import.meta.glob` 后，发现了一个更方便的写法，`import.meta.glob` 可以批量导入文件，并且可以动态生成 `key`，这样就可以不用一个个 `import` 了。因此先整理一下思路步骤。

## 子组件

现创建三个子组件 `.vue` 文件用于实现效果，分别为 `modelHome.vue` 、`modelAbout.vue` 、`modelInfo.vue` 。

### 统一导出思路
1. 把所有的公共组件都写在统一的文件夹内，比如 `components` 文件夹下，并且规范命名规则，以 `model` 开头为例。这样方便管理。可以再创建 `left` 和 `right` 之类的文件夹，用于区分是哪侧的组件。
2. 在 `components` 文件夹下创建 `index.js`，`import.meta.glob` 导入所有的 `.vue` 文件。
   ```js
    const routeFiles = import.meta.glob(['./*/*.vue', './*.vue']);
   ```
   此时就能获取到所有的子组件，并且生成一个对象 `routeFiles`。`routeFiles` 的 `key` 是文件路径，`value` 是 `import` 函数。
3. 循环遍历对象，过滤出所有需要的组件，即 `model` 开头的组件。然后把组件的名称改为小写。
   ```js
    import {defineAsyncComponent} from 'vue'; // [!code ++]
   
    const routeFiles = import.meta.glob(['./*/*.vue', './*.vue']);
    const asyncComponents = {}; // [!code ++]
    const toLowerCase = s => s[0].toLowerCase() + s.slice(1); // [!code ++]
   
    Object.entries(routeFiles) // [!code ++]
        .filter(([path]) => path.startsWith('./model')) // [!code ++]
        .forEach(([path, component]) => { // [!code ++]
            const name = getCardNameByPath(path); // [!code ++] // 获取组件名
   
    export default asyncComponents; // [!code ++]
   
    function getCardNameByPath(path) { // [!code ++]
        const upperName = path.replaceAll(/^\.\/model([^\/]*)(\/.*|\.vue)$/g, '$1'); // [!code ++]
        return toLowerCase(upperName); // [!code ++]
    } // [!code ++]
   ```
4. 检查 `asyncComponents` 对象是否有以组件名为键的属性，如果有，就获取这个属性的值；如果没有，就创建一个新的空对象。使用 `defineAsyncComponent` 方法将组件定义为异步组件，并将其赋值给 `components` 对象的对应类型的属性。`defineAsyncComponent` 是 Vue3 中的一个函数，用于定义异步组件。最后，将 `components` 对象赋值回 `asyncComponents` 对象的对应组件名的属性。这样，`asyncComponents` 对象就包含了所有以 `./model` 开头的路径的组件。

### 总体代码
```js

import {defineAsyncComponent} from 'vue';
const routeFiles = import.meta.glob(['./*/*.vue', './*.vue']);

const asyncComponents = {};
const toLowerCase = s => s[0].toLowerCase() + s.slice(1);

Object.entries(routeFiles)
    .filter(([path]) => path.startsWith('./model'))
    .forEach(([path, component]) => {
        const name = getCardNameByPath(path); // 获取组件名

        const components = asyncComponents[name] || {};

        components[type] = defineAsyncComponent(component);

        asyncComponents[name] = components;
    });

export default asyncComponents;


function getCardNameByPath(path) {
    const upperName = path.replaceAll(/^\.\/model([^\/]*)(\/.*|\.vue)$/g, '$1');
    return toLowerCase(upperName);
}
```

## 父组件

接下来是通过代码逻辑实现把子组件对象 `asyncComponents` 提取出父组件需要的对应组件的数组形式。

### 字典

在项目中，当前页面左右分别是哪些子组件是通过后端配置字典，调用接口返回的。这里省略后端，由前端配置字典。

```js
const dict = {
  // 设备
  emquity: {
    left: [
        {
            "component": "home",
            "size": {
                "x": 1,
                "y": 1
            },
            "name": "索引",
        },
        {
            "component": "about",
            "size": {
                "x": 1,
                "y": 1
            },
            "name": "关于",
        },
        {
            "component": "info",
            "size": {
                "x": 1,
                "y": 2
            },
            "name": "详情",
        },
    ],
    right: [
      // ...
    ]
  },
  // 设施
  facility: {
    left: {
      //...
    },
    right: {
      // ...
    }
  },
}
```

其中，`component` 是组件的名称，要和前面子组件的文件名相对应；`size` 是子组件的尺寸， `x` 为1则表示纵轴占一格，`y` 为1表示横轴占一格，为2则表示占两格铺满；`name` 表示组件的标题。

### 过滤对应子组件

封装一个函数，用于过滤查找出当前页面对应的左侧、右侧子组件。通过字典可以看出，我需要接收当前是哪个页面，以及需要哪侧的子组件参数。

这里可以通过 `reduce` 方法来实现，代码如下：

```js
function getSys(configKey) {
    return configKey.split('.').reduce((p, c) => {
        return p?.[c];
    }, dict);
};
```

以设备左侧为例，调用该函数的代码如下所示：

```js
const leftCard = getSys('emquity.left')
```

此时就能拿到对应页面的对应侧位的对应子组件数组。

### 封装组件数组

拿到对应的子组件字典数组后，根据前面的子组件统一导出数组，封装出可以循环遍历给 `component` 组件使用。

```js
import leftCard fromm './xxx.js';

function getComponent(carInfo) {
  	const {component} = carInfo;
    return asyncComponents[component];
};

const components = computed(() => leftCard.map(e => {
     return {
         ...e,
         asyncComponent: getComponent(e),
     };
 }));

const cards = computed(() => {
    return components;
});
```

### 组件挂载

```vue
<template>
	<transition-group
      enter-active-class="animate__animated animate__fadeIn"
  >
      <component
          :is="el.asyncComponent"
          v-for="el in cards"
          :key="el.component"
          v-bind="el"
      />
  </transition-group>
</template>

<script setup>
import useCard from './useCard';

const {cards} = useCard('right');

const show = ref(false);

const click = () => {
    show.value = !show.value;
};
</script>
```

此时子组件已经能够成功显示了。

### 添加挂载动画

这里是作子组件挂载动画的补充，希望能够看到子组件一个个挂载上去的动画效果，此时可以用到 `component` 的 `@vue:mounted` 方法。

首先声明一个变量，表示能渲染多少组件，然后通过计算属性过滤数组。每当一个组件挂载成功，让该变量自增一，这样就能一个个挂载，并由于有 `transition-group` ，能够实现动画效果。

```vue
<template>
	<transition-group
      enter-active-class="animate__animated animate__fadeIn"
  >
      <component
          :is="el.asyncComponent"
          v-for="el in cards"
          :key="el.component"
          v-bind="el"
          @vue:mounted="mounted" <!-- [!code ++] -->
      />
  </transition-group>
</template>

<script setup>
import useCard from './useCard';

const {cards} = useCard('right');

const show = ref(false);
const getInitIndex = () => (show.value ? 1 : 0); // [!code ++] // 0:未展开 1:展开;
const renderIndex = ref(getInitIndex()); // [!code ++]
const mounted = () => { // [!code ++]
    renderIndex.value++; // [!code ++]
}; // [!code ++]

const click = () => {
    show.value = !show.value;
};
</script>
```

