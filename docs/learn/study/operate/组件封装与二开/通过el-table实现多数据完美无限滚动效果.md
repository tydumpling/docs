# 通过el-table实现多数据完美无限滚动效果

有一个场景：表格数据有200多条，用户滚动和操作起来十分卡顿，需要优化。

## 思路

- 直接写在 `.vue` 文件中（复用难）
- 写在 `mixin` 文件中（只能复用核心逻辑，dom还是要自己获取）
- 利用子组件复用（改变原有父子结构）
- 自定义指令实现

## 自定义指令

数据过多必然会引起卡顿，因此先通过 `slice` 截取20条，即现在的数据是0到20。等滚动到底部再获取20条数据渲染，即现在的数据是0到40。以此类推，直到滚动到最底部。

为表格绑定滚动的自定义指令，监听其被卷去的距离 `scollTop` ，当 `scollTop` 加上 `clientTop` 大于等于表格总高度，说明已经滚动到最底部，获取新数据。

### 自适应添加数据

表格子组件：通过延时器模拟接口返回数据的场景。

```vue
<template>
  <div>
    <el-table v-myscroll="20" :data="tableData" height="300" style="width: 100%">
      <el-table-column prop="date" label="索引" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'MyTable',
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    setTimeout(() => {
      for (let i = 0; i < 200; i++) {
        this.tableData.push({
          date: i + 1,
          name: "tydumpling",
          address: "哈哈哈",
        });
      }
    }, 1000);
  },
  methods: {},
};
</script>
```

自定义指令：通过 `Vue.directive` 设置自定义指令。

```js
Vue.directive('myscroll', {
  bind(el, bind, vnode) {
    console.log(el, bind, vnode);
  }
})
```

- el：绑定了自定义指令的dom元素
- bind：等号后面传的参数
- vnode：父节点数据对象，其中，`context` 是其对应的 `this` 指向

```js
Vue.directive('myscroll', {
  bind(el, bind, vnode) {
    const that = vnode.context
    const target = el.querySelector('.el-table__body-wrapper') // 触发下滑事件的是表格体内容，不包含表格头

    // 绑定滚动事件
    target.addEventListener('scroll', () => {
      if(target.scrollTop + target.clientHeight >= target.scrollHeight) {
        // 如果最后的数据大于等于总数居，则不再执行
        if(that.over >= that.tableData.length) return
  
        that.over += 20
      }
    })
  }
})
```

mixin文件：把那些需要定义的数据变量方法定义到 `mixin` 文件中，方便复用。

```js
const mixin = {
  data() {
    return {
      start: 0, // 起始位置
      over: 0, // 终止位置
      tableHeight: 300, // 默认高度
    };
  },
  mounted() {},
  methods: {},
};

export default mixin
```

现在查看效果，发现数据能够根据滚动底部来自适应添加，但是这只是在最开始渲染时速度有所提高，后续操作中页面还是拥有200条数据，操作起来还是会卡顿。怎么办呢？

### 固定页面内容数量

我们不妨假设一下，在最开始 `start` 为0，`over` 为20，页面渲染20条数据；然后滚动到底部，触发自定义事件，此时让 `start` 为20，`over` 为40，这样不仅能实现下拉获取新数据，还能让页面中的数据保存20条，操作起来也方便，不会卡顿。如果往上拉，则让 `start` 和 `over` 减去相应的数字即可。

- `start` ：起始索引，计算方式为被卷曲的高度除以每个列的高度。如200除以48得出被卷曲5列。
- `end` ：结束索引，计算方式为被卷曲的高度加上表格高度的和除以每列高度。如 `(200+300)/48` 得出在第八列结束。
- 内边距：我们采取的是截取，因此会有部分被遮盖无法显示到表格内，可以使用内边距把它顶出来。计算方法为未显示的数量乘高度即可。
- 初始被卷曲的距离：设置初始被卷曲的距离，如288，则被卷曲的数量为 288 / 48 = 6，因此起始位置要减去6获取初始位置0。

```js
const mixin = {
  data() {
    return {
      tableHeight: 300, // 表单默认高度
      scrollTop: 288, // 表单顶部被卷曲的高度
    };
  },
  computed: {
    // 计算起始位置的索引。最大值为0，不能有负数。
    start() {
      return Math.max(this.scrollTop / 48 - 6, 0) // 初始卷曲值为288，288/48=6
    },
    // 计算结束1位置的索引。最小值为数组长度
    over() {
      return Math.min((this.scrollTop + this.tableHeight) / 48, this.tableData.length)
    },
    padding() {
      const paddingTop = this.start * 48
      const paddingBottom = (this.tableData.length - this.over) * 48

      return [paddingTop, paddingBottom]
    },
  },
  methods: {},
};
```

自定义指令中为表格整体设置样式内边距；实时获取对应的表格高度与被卷曲的高度即可。

```js
Vue.directive('myscroll', {
  bind(el, bind, vnode) {
    const that = vnode.context
    const target = el.querySelector('.el-table__body-wrapper') // 触发下滑事件的是表格体内容，不包含表格头
    const table = target.querySelector('table')

    target.addEventListener('scroll', () => {
      setTimeout(() => {
        table.style.paddingTop = that.padding[0] + 'px'
        table.style.paddingBottom = that.padding[1] + 'px'

        that.scrollTop = target.scrollTop
        that.tableHeight = target.clientHeight
      }, 200);
    })
  }
})
```

## 总结

在部分场合下使用自定义指令配合 `mixin` 能够极大实现产品的复用。

