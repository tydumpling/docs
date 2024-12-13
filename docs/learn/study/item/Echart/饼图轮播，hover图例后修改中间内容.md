# 饼图轮播，hover图例后修改中间内容

## 需求梳理

客户那边说内容一直展示一条数据的值不符合他们的期望，要求能够实现内容轮播滚动，且鼠标悬停在图例上时，能够实现中间内容展示对应的数据。

接到需求，自然需要先梳理一下，用什么方式来实现。

首先看看轮播，查阅官方文档，找到 `EChart` 有两个事件方法 [`highlight`](https://echarts.apache.org/zh/api.html#action.highlight) 和 [`downplay`](https://echarts.apache.org/zh/api.html#action.downplay) 。其中：

- `highlight` 用于高亮指定的图形，用法如下：

  ```js
  myChart.value.dispatchAction({
      type: 'highlight',
      seriesIndex: 0, // setOption中series数组内第几索引的对象
      dataIndex: 1, // setOption中series数组对象中data第几项数据
  });
  ```

- `downplay` 用于取消高亮指定的图形，用法如下：

  ```js
  myChart.value.dispatchAction({
      type: 'downplay',
      seriesIndex: 0, // setOption中series数组内第几索引的对象
      dataIndex: 1, // setOption中series数组对象中data第几项数据
  });
  ```


看到这里可以得出结论，实现饼图轮播无外乎就是 `forEach` 循环遍历数据数组，让当前项的索引触发 `highlight` 激活状态，再通过排他思想把其余所有项索引触发 `downplay` 取消高亮。这样就能实现轮播了。

接着看看鼠标 `hover` 后中间内容修改怎么实现。继续翻阅官方文档，发现可以通过 `on()` 为`echart` 组件绑定事件方法。

为 `echart` 绑定 `highlight` 方法后，能够在内容激活后触发该事件。

```js
const myChart = documment.querySelector('.echart');

myChart.on('highlight', (e) => {
  console.log(e);
})
```

## 轮播

找到方法后就好开始实现功能了。实现步骤如下：

1. 在 `onMounted` 生命周期绑定 `echart` 真实Dom元素
2. 设置相应的 `option` 对象（前置条件）
3. 设置3个变量 `timer` 、`highlightIndex` 、`downplayIndex` 。`timer` 用于设置定时器；`highlightIndex` 用于记录当前激活的索引；`downplayIndex` 用于设置要取消激活的索引。循环数组开启定时轮播，激活当前项，取消激活上一项
4. `highlightIndex` 和 `downplayIndex` 判断是否大于等于数组长度，是则返回0，不是则自增1
5. 更新饼图中部的内容

代码如下所示：

```js
const props = defineProps({
    data: {
        type: Array,
        default: () => ([]),
    },
});

// echart的option配置项设置
const option = ref({
  // ...
})

// 如果data发生变化则重新更新option
watch(
    () => props.data,
    (val) => {
        if (val.length > 0) {
            option.value.series[0].data = val;
            option.value.series[0].label.normal.formatter = '{title|' + val[0].value + '%}' + '
' + '{car|' + val[0].name + val[0].flowValue + '辆}';
        }
    },
    { immediate: true, deep: true }
);

// 开启定时器轮播
const timer = ref(null);
const highlightIndex = ref(0);
const downplayIndex = ref(-1);
const intervalStartFn = () => {
    if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
    }
    const formatterChange = () => {
        if (!pieChart.value) return;
        pieChart.value.myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0, // 第一个系列
            dataIndex: highlightIndex.value,
        });
        pieChart.value.myChart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0, // 第一个系列
            dataIndex: downplayIndex.value,
        });

        // 中部自定义内容调整
        const obj = props.data[highlightIndex.value];
        option.value.series[0].label.normal.formatter = '{title|' + obj.value + '%}' + '
' + '{car|' + obj.name + obj.value + '辆}';

        // 激活与非激活索引自增1
        highlightIndex.value = highlightIndex.value >= props.data.length - 1 ? 0 : highlightIndex.value + 1;
        downplayIndex.value = downplayIndex.value >= props.data.length - 1 ? 0 : downplayIndex.value + 1;
    };
    formatterChange();
    timer.value = setInterval(() => {
        formatterChange();
    }, 3000);
};

onMounted(() => {
    intervalStartFn();
});

onUnmounted(() => {
    clearInterval(timer.value);
    timer.value = null;
});
```

## hover

然后来实现鼠标悬停修改中部内容的功能，需要考虑到以下几点：

1. 鼠标悬停时要取消定时轮播，鼠标移出再继续轮播
2. 鼠标悬停时中部内容要修改为对应的图例的数据
3. 鼠标悬停时只激活鼠标悬停的那一项，其余数据都要取消激活

代码如下所示：

```js
// 为echart绑定图例选中和取消选择事件
const pieChart = ref(null);
const pieChartAddEventFn = () => {
    pieChart.value.myChart.on('highlight', function (params) {
        if (params.name) {
            clearInterval(timer.value);
            timer.value = null;

            props.data.forEach((item, index) => {
                if (item.name !== params.name) {
                    pieChart.value.myChart.dispatchAction({
                        type: 'downplay',
                        seriesIndex: 0, // 第一个系列
                        dataIndex: index,
                    });
                }
                else {
                    option.value.series[0].label.normal.formatter = '{title|' + item.value + '%}' + '
' + '{car|' + item.name + item.value + '辆}';
                }
            });
        }
    });
    pieChart.value.myChart.on('downplay', function (params) {
        if (params.name) {
            intervalStartFn();
        }
    });
};

onMounted(() => {
    pieChartAddEventFn();
});
```

## 总体效果

<Iframe url="https://duyidao.github.io/blogweb/#/info/echart/pieCast" />