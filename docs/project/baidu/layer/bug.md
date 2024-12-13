---
title BUG
---

# 抓虫记录

## 与JSON有关

### Uncaught (in promise) SyntaxError: Unterminated string in JSON at position 204800 (line 1 column 204801)

- 报错原因：

  这个错误通常表示在解析 JSON 数据时出现了语法错误。在你的情况下，JSON 字符串中存在一个未结束的字符串，在第 1 行第 204801 列（或者附近的位置）。

  在解决这个问题之前，你需要确定你正在处理的是 JSON 格式的数据。如果是，请检查 JSON 字符串是否正确格式化并且所有双引号都有成对出现。

  可以通过以下步骤来查看 JSON 字符串中的错误：

  1. 打开浏览器的开发者工具，并切换到“控制台”选项卡。
  2. 复制出现错误的 JSON 字符串。
  3. 在控制台中输入 `JSON.parse(yourJsonString)`，其中 `yourJsonString` 是你复制的 JSON 字符串。
  4. 如果存在语法错误，你将会看到类似于 "Uncaught SyntaxError: Unterminated string in JSON at position 123" 的错误信息，其中 `123` 表示 JSON 字符串中的错误位置。

  根据错误信息所提供的位置，检查 JSON 字符串中的该位置，并确保所有字符串都被正确地结束。

  注意：如果 JSON 数据太大，可能需要分段检查。

- 排查复现：后端返回的数据是数组转 JSON 格式

- 最终解决：等待后端返回正确的格式数据

## 与组件库有关

### 时间筛选组件样式修改不生效

在开发的时候，引用了 `element-ui` 的时间筛选组件 `el-date-picker` ，在给下面的时间筛选部分通过 `deep` 穿透设置样式时未生效。

经过排查发现该组件默认是设置在 `body` 下，而非组件内。组件样式做了 `scoped` 防污染后样式只在该组件内生效。因此无论怎么调试都不生效。

其官方文档也写明，通过设置 `append-to-body` 为 `false` ，让其在组件内挂载，这样就能生效了。

### vite-plugin-vue2导致el-table等组件不生效
在开发的时候发现表格位置空白，无表格 DOM 组件。主要依赖为 vite + vue2.7 + elementui2.15.10 + vite-plugin-vue2。

查看 [vite 官网](https://cn.vitejs.dev/guide/features#vue) 发现 vue2.7 有单独的支持包，更换成该包。

![更换包](https://pic.imgdb.cn/item/670a1b93d29ded1a8c8848fe.png)

现在开发模式有效果了，但是打包后还是空白。查看 vite-plugin-vue2 的 `issuess` 发现有相关问题，有人给出相关解答和问题原因，感兴趣可前往 [vite-plugin-vue2 does not support some components of ElementUI](https://github.com/vitejs/vite-plugin-vue2/issues/16) 。

解决方法如下：
```js
export default defineConfig({
  // ...
  resolve: {
    alias: {
      // ...
      vue: 'vue/dist/vue.esm.js',
    }
  }
});
```

## 与Vue相关

### 变量修改导致的组件更新导致了扎点重新渲染

有一个场景，一个父组件引用了公共扎点子组件，在地图上渲染扎点，其代码如下所示：

```vue
<template>
	<marker-dom
    v-for="(item, index) in list" :key="item.id"
    :info="{
      ...item,
      :position="[item.lng, item.lat]"
      :name="item.name"
      :onClickCallback="() => clickCallbackFn(item)"
      :onMouseenterCallback="() => mouseenterCallbackFn(index)"
      :onMouseleaveCallback="() => mouseleaveCallbackFn(index)"
    }"
  >
    <div v-show="showList[index]"> ... </div>
  </marker-dom>
</template>
  
<script>
  export default {
    setup() {
      const showList = ref([])
      
      const mouseenterCallbackFn = index => {
        set(showList.value, index, true)
      }
      
      const mouseleaveCallbackFn = index => {
        set(showList.value, index, false)
      }
      
      return {
        showList,
        mouseleaveCallbackFn, mouseenterCallbackFn
      }
    }
  }
</script>
```

根据上述代码不难看出它主要做了循环数据，把每一项的数据和经纬度、点击、鼠标移入移出回调函数等放到对象中传递给子组件。鼠标移入把数组对应索引改为 `true` 展示对应的卡片；鼠标移出后隐藏。

查看效果发现虽然鼠标移入展示了，但是页面上的扎点全部都重新渲染了一遍，且不触发鼠标移出方法。

然后开始排查问题，既然重新渲染，那么就去看哪里触发了子组件的渲染函数。在子组件中有两个地方用到了该方法，一个在 `onMounted` ，一个在 `watch` 。前者可以排除，生命周期只触发一次，`watch` 代码如下所示：

```js
watch(() => props.info, (_, {name}) => {
  removeIcon(name); // 删除旧扎点
  addIcon(); // 新建新扎点
}, {deep: true})
```

打印 `props.info` ，控制台有相关打印，可以判断是子组件侦听到数据发生改变，因此重新渲染扎点图标。但是父组件并没有修改到 `list` 数组，`info` 内的数据不会被变动到。

后面想起在学习组件封装时听到的一个知识点：修改了组件内的变量会让 `template` 重新加载一次。由于 `info` 变量是 `template` 内直接设置，因此每次重新加载，都会赋一个新的对象过去，子组件侦听到是新对象就会触发。

找到问题所在后就好办了，通过计算属性格式化一下数据，这样数据不变动就不会触发子组件的侦听器了。代码如下：

```vue
<template>
	<marker-dom
    v-for="(item, index) in markerList" :key="item.id"
    :info="item"
  >
    <div v-show="showList[index]"> ... </div>
  </marker-dom>
</template>

<script>
  export default {
    setup() {
      const markerList = computed(() => {
        return list.value.map(item => ({
          ...item,
          position="[item.lng, item.lat]"
          name="item.name"
          onClickCallback="() => clickCallbackFn(item)"
          onMouseenterCallback="() => mouseenterCallbackFn(index)"
          onMouseleaveCallback="() => mouseleaveCallbackFn(index)"
        }))
      })

      return {
        markerList
      }
    }
  }
</script>
```

