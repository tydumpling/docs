# 通过el-select实现多个省略学习如何改造第三方组件满足自己的要求

现在有一个场景：项目使用了 `element-ui` 中的 `el-select` 组件多选，如下所示：

![iL6Ntc.png](https://i.imgloc.com/2023/05/01/iL6Ntc.png)

但是我们不需要他换行显示，会拉大整体输入框的高度，查看文档发现有一个折叠的字段，使用后效果如下所示：

![iL63so.png](https://i.imgloc.com/2023/05/01/iL63so.png)

虽然能够实现折叠，但是它只要超出一条就折叠了，后面空余的输入框无内容填充，这显然不太合适，因此需要主动修改。

但是修改不能够修改源码，在使用第三方组件时尽可能避开源码的修改，避免引起不必要的错误。如何修改呢？可以使用以下两种方法：

- 纯 `css` 样式修改
- 使用原生 `js` 操作 `dom` 

## CSS修改

先看看 `css` 修改的方法，我们可以采取让他显示一定的数量，比如两个，后续的隐藏。找到对应的类名设置样式，代码如下：

```vue
<style>
.el-tag.el-tag--info:nth-child(n+3) {
  display: none;
}
</style>
```

效果如下所示：

![iL6Bqb.png](https://i.imgloc.com/2023/05/01/iL6Bqb.png)

虽然效果实现了，但是还是很不合理，这样子如果不点开看还以为只选择两个选项，没有相应的提示。因此纯 `css` 修改法不合适。

## 使用JS操作Dom

思路如下：

1. 创建一个 `span` 标签，通过定位样式把标签放在 `el-select` 后面
2. 获取 `el-select` 选中的数量，大于2时显示对应数量，小于等于2时隐藏

代码如下：

```vue
<template>
  <div id="app">
    <el-select multiple v-model="value" placeholder="请选择" @change="changeFn">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
// 创建 span 节点，在此创建整个 script 都可使用
const span = document.createElement("span");
span.className = "num_select";

export default {
  name: "App",
  data() {
    return {
      options: [
          // ...
      ],
      value: "",
    };
  },
  mounted() {
    const select = document.querySelector(".el-select");
    select.appendChild(span);
  },
  methods: {
    changeFn(val) {
      // 触发事件函数后判断长度
      if(val.length > 2) {
        span.setAttribute('style', 'display:inline-block')
        span.innerHTML = `+${val.length - 2}`
      } else{
        span.setAttribute('style', 'display:none')
      }
    }
  }
};
</script>

<style>
/* 超出2的选项隐藏，设置span标签的样式力求一致 */
.el-tag.el-tag--info:nth-child(n + 3) {
  display: none;
}

.num_select {
  display: none;
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  padding: 3px 5px;
  background-color: #f4f4f5;
  border: 1px solid #e9e9eb;
  color: #909399;
  font-size: 12px;
  border-radius: 5px;
}
</style>
```

效果如下：

![iL6adE.png](https://i.imgloc.com/2023/05/01/iL6adE.png)

## 总结

遇到此类需求，可以先用 `css` 隐藏一些不需要显示的东西，达到虚伪的实现效果；如果还是达不到效果，就通过 `js` 直接操作 `dom` 来实现需求。