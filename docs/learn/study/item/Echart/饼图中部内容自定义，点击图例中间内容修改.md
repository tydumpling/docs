# 饼图中部内容自定义，点击图例修改中间内容

## 中间内容自定义

### 效果

Echart 饼图中间内容允许自定义，具体效果如下图所示：

![示例](https://pic.imgdb.cn/item/65621720c458853aef11e1d6.jpg)

### 实现

想要实现这个功能，需要在饼图的 `series` 数组对象的 `label` 属性中设置一个 `normal` 属性，其中：

- `formatter` 设置要显示的文本，字符串的形式，格式如下：

  ```js
  '{xxx|}' + 变量1 + '} {yyy|}' + 变量2 + '次}'
  ```

  其中 `xxx` 与 `yyy` 与他们后面的变量分别一一对应，后续通过它们给文本设置样式。

- `rich` 原意是富文本，这里用于给自定义内容设置样式，格式如下：

  ```js
  rich: {
    xxx: {
      fontSize: 14,
      color: 'red'
    },
    yyy: {
      fontWeight: 600
    }
  }
  ```

整体代码如下所示：

```js
option = {
  // ...
  series: [
    {
      name: '结构物管理一张图',
      type: 'pie',
      radius: ['80%', '90%'],
      center: ['20%', '50%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'right',
        normal: {
          show: true,
          position: 'center',
          color: 'red',
          formatter:
            '{total|' + 1 + '次}' + '{title|告警}',
          rich: {
            total: {
              fontSize: 18,
              fontFamily: 'PingFang SC',
              color: 'rgb(254, 201, 49)',
              fontWeight: 400,
              letterSpace: 1.5,
              lineHeight: 20
            },
            title: {
              fontFamily: 'PingFang SC',
              fontSize: 14,
              color: 'rgb(0, 255, 255)',
              lineHeight: 30,
              fontWeight: 400,
              letterSpace: 1.17
            }
          }
        },
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        {
          name: 'a',
          point: 41.67,
          value: 5
        },
        {
          name: 'b',
          point: 22.67,
          value: 3
        },
        {
          name: 'c',
          point: 41.67,
          value: 4
        }
      ]
    }
  ]
};
```

### 总结

在 `formatter` 里写内容，`rich` 里面写你需要的样式。

## 点击图例修改中间内容

### 需求展示

测试在复测项目时发现饼图点击图例后中间内容并没有发生相应的改变，测试想要实现下方效果：

![效果](https://pic.imgdb.cn/item/664dbdb8d9c307b7e9e160d4.png)

查看 EChart 官方文档，发现他有一个方法  `legendselectchanged`，文档指路[Documentation - Apache ECharts](https://echarts.apache.org/zh/api.html#events.legendselectchanged) 。该方法在点击切换图例的选中状态时会触发。

### 事件绑定

为渲染图例的 DOM 元素绑定事件，代码如下

```vue
<template>
    <div ref="diseaseChartRef" class="disease-chart"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  setup(props, {emit}) {
    const myChart = ref(null)
    const diseaseChartRef = ref(null)
    
    const init = () => {
        if (!myChart.value) return;
        myChart.value.setOption(props.option);
    }
    
    onMounted(() => {
      myChart.value = echarts.init(diseaseChartRef.value);
      myChart.value.on('legendselectchanged', function (e) {
          emit('legendselectchanged', e);
      });
      init()
    })
    
    watch(() =. props.option, () => {
      init()
    }, {deep: true, immediate: true})
    
    return {
      diseaseChartRef
    }
  }
}
</script>
```

此时就能绑定上

### 逻辑修改

查看其打印，打印结果如下：

![打印结果](https://pic.imgdb.cn/item/664dc34cd9c307b7e9e7e866.png)

拿到数据后就可以在自定义饼图中间内容的自定义函数内修改内容。代码如下所示：

```js
const initForMatter = () => {
    const obj = legendList.value.find(item => item.chose);
    const num = obj ? obj.value : 0;
    const name = obj ? obj.name : '高';
    labelFormatter.value = '{total|' + num + '%}' + '\n' + '{title|' + name + '}';
};

const legendselectchangedFn = e => {
    legendList.value = legendList.value.map(item => {
        return {
            ...item,
            chose: e.selected[item.name],
        };
    });
    initForMatter();
    setOption.value.series[0].label.normal.formatter = labelFormatter.value;
};
```

这里的逻辑是渲染第一项选中的数据，如有高、较高、中、较低、低五条数据，点击中和低后，第一项选中的数据是高，则中间内容继续渲染高。

### 总结

为组件绑定 `legendselectchanged` ，切换图例就能触发。