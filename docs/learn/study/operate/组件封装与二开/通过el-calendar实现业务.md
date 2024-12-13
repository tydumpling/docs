# 通过el-日历实现

## 效果

## 回顾

第三方库按需求改造一般方案：

1. 通过 `css` 改造达到视觉效果欺骗
2. 通过 `css` 配合 `js` 操作 `dom` 

## UI改造

### 样式改造

首先引入 `el-calendar` 日历组件，然后修改样式（样式部分不做过多赘述）：

1. 修改整体日历的宽度和外边距，达到居中

2. 修改每个日历格子的高度

   > 注意
   >
   > 如果该模型的样式设置了怪异盒子模型 `box-sizing: border-box` ，则为其设置行高时需要把内边距去掉才能实现垂直居中。
   >
   > 因为怪异盒子模型的高度把内边距和边框都算进去，因此你设置了高度 37px ，内边距 10px ，实际高度只有17px 。

3. 微调，如取消边框，添加背景颜色等

```vue
<template>
  <div id="app">
    <el-calendar v-model="value"></el-calendar>
  </div>
</template>

<style>
#app {
  width: 300px;
  margin: 100px auto;
}

#app .el-calendar-table .el-calendar-day {
  height: 37px;
  line-height: 37px;
  padding: 0;
  text-align: center;
}

#app .el-calendar-table td {
  border: 0;
}

#app .el-calendar-table td.is-today {
  border-radius: 50%;
  background-color: #409EFF;
  color: #fff;
}

#app .el-calendar-table td.is-today:hover {
  background-color: #fff;
  color: #409EFF;
}
</style>
```

效果如下图所示：

[![p9RwnVs.png](https://s1.ax1x.com/2023/05/16/p9RwnVs.png)](https://imgse.com/i/p9RwnVs)

### 插槽改造

由于需要在已完成与未完成下方显示小点，点击显示待办事项，因此通过插槽遍历数组渲染元素传入给组件是一个不错的选择。

首先查看插槽都提供什么数据，打印数据结果如下图所示：

[![p9Rw2dA.png](https://s1.ax1x.com/2023/05/16/p9Rw2dA.png)](https://imgse.com/i/p9Rw2dA)

接下来获取数据循环遍历即可，再通过其 `state` 状态来动态添加类名。

```vue
<template>
  <div id="app">
    <el-calendar v-model="value">
      <template v-slot:dateCell="obj">
        <div :class="returnClass(obj.data.day)">
          {{ obj.data.day.split("-")[2] }}
        </div>
        <div class="toolTip">
          dasdasddasdasdasdadsadadas
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      deadlineList: [
        {
          time: "2023-05-16",
          state: "finish",
          list: ["tings1", "tings2", "tings3"],
        },
        {
          time: "2023-05-17",
          state: "unfinish",
          list: ["tings1", "tings2", "tings3"],
        },
      ],
    };
  },
  methods: {
    returnClass(v) {
      let classObj = {};
      this.deadlineList.forEach((e) => {
        if (e.time === v) {
          classObj.hastate = true;
          // 进一步判断是已完成还是未完成
          e.state === "finish"
            ? (classObj.finish = true)
            : (classObj.unfinish = true);
        }
      });

      return classObj;
    },
  },
};
</script>

<style>
/* .... */

.hastate {
  position: relative;
}
.hastate::after {
  content: '';
  position: absolute;
  /* display: none; */
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.finish::after {
  background-color: skyblue;
}
.unfinish::after {
  background-color: orange;
}

.toolTip {
  position: absolute;
  display: none;
  widows: 300px;
  background-color: #fff;
  border: 1px solid red;
  color: #000;
  z-index: 500;
}

.is-selected .toolTip  {
  display: block;
}
</style>

```

> 注意：
>
> 如果使用了插槽却不定义元素，则相应的内容则会被置空，如下图所示：
>
> [![p9RwRII.png](https://s1.ax1x.com/2023/05/16/p9RwRII.png)](https://imgse.com/i/p9RwRII)
>
> 因为插槽的本质是如果父组件不传递数据，则使用默认的子组件数据。

现在点击后能够显示列表的值（目前是前端写死而不是动态获取）。

[![p9W4M4K.png](https://s1.ax1x.com/2023/05/17/p9W4M4K.png)](https://imgse.com/i/p9W4M4K)

## 列表制作

目前思考一下如何获取对应的 `list` 列表显示。如果直接给入，则需要配合运算判断来控制。且插槽内无法获取到当天的 `list` 。

此时可以用到 `JSX` 的思想来渲染该节点。思路如下：

1. 通过 `render` 函数渲染节点，循环获取到的 `list` 数组，判断其是否有事项数组。如果有，则返回两个元素：日期渲染和事项模板；没有则只返回日期
2. 通过之前封装的函数获取类名动态设置，由于类名父组件已设置，因此直接使用即可。

子组件：

```vue
<script>
export default {
  name: "dateTd",
  props: {
    day: {
      type: String,
    },
    deadlineList: {
      type: Array,
    },
  },
  render(h) {
    let classObj = {};
    let list = [];

    function createList(list) {
      let arr = list.map(v => {
        return h('p', v)
      })
      return arr
    }

    this.deadlineList.forEach((e) => {
      if (e.time === this.day) {
        classObj.hastate = true;
        list = createList(e.list)
        // 进一步判断是已完成还是未完成
        e.state === "finish"
          ? (classObj.finish = true)
          : (classObj.unfinish = true);
      }
    });
    // 参数1：要渲染的元素；参数2：其属性，如类名；参数3，其内容
    if (list && list.length > 0) {
      return h("div", { class: classObj }, [
        this.day.split("-")[2],
        h("div", { class: 'toolTip' }, [...list]),
      ]);
    } else {
      return h("div", { class: classObj }, this.day.split("-")[2])
    }
  },
};
</script>
```

父组件：

```vue
<el-calendar v-model="value">
  <template v-slot:dateCell="obj">
    <dateTd :day="obj.data.day" :deadlineList="deadlineList"></dateTd>
  </template>
</el-calendar>
```

## 总结

如果遇到类似的场景，可以使用 `jsx` 的思想创建节点并返回渲染元素，该方法能够自主掌控。

jsx创建节点复习：

- 参数1：你要创建的元素标签，如div、p
- 参数2：该元素的属性，如类名，id等，对象形式
- 参数3：该元素的内容。多个内容以数组的形式

