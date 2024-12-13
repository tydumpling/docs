# 柱状图封装

UI 出了一个柱状图，效果如下图所示：

![柱状图效果](https://pic.imgdb.cn/item/664efb7bd9c307b7e92263a2.png)

通过观察 UI 设计图可以看出他有很多地方有相似之处，也有几个不同点，因此可以封装为一个公共组件，多个组件引入使用。

下面来梳理一下有哪些地方是需要父子传参做自定义操作的：

1. 柱状图数据
2. 柱体颜色
3. 柱状图图例数据
4. 柱状图 Y 轴单位
5. 鼠标悬停内容显示

下面写一个公共组件，并针对上述几个模块设置不同的参数处理。

## 基础子组件

基础子组件不考虑差异，代码如下：

```vue
<template>
    <div
        ref="chartRef"
        class="structure-chart"
    ></div>
</template>

<script>
import * as echarts from 'echarts';
import {ref, onMounted, nextTick, watch} from 'vue';
export default {
    props: {
    },
    setup(props) {
        const chartRef = ref(null);
        const myChart = ref(null);

        const option = ref();

        const init = () => {
            if (!myChart.value) return;
            myChart.value.setOption(option.value);
        };

        const update = () => {
            option.value = {
                grid: {
                    top: '12%',
                    left: '0%',
                    right: '5%',
                    bottom: '0%',
                    containLabel: true,
                },
                tooltip: {
                    // 配置 tooltip
                    trigger: 'axis', // 触发类型，柱状图使用 'axis'
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    axisPointer: { // 坐标轴指示器配置
                        type: 'shadow', // 阴影指示器
                    },
                },
                xAxis: {
                    type: 'category',
                    data: [],
                },
                legend: {
                    type: 'scroll',
                    width: '80%',
                    data: [],
                    top: 'top', // 设置图例显示在顶部
                    left: 'right', // 设置图例水平居中
                    icon: 'circle', // 设置图例的图标为圆形
                    textStyle: {
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 400,
                        fontFamily: 'OPlusSans',
                    },
                },
                yAxis: {
                    type: 'value',
                    minInterval: 1, // 设置y轴的最小间隔为1
                    name: '单位：台',
                },
                series: [
                  {
                    // ...
                  }
                ]
            };
            init();
        };

        onMounted(() => {
            nextTick(() => {
                myChart.value = echarts.init(chartRef.value);
                init();
            });
        });

        return {
            chartRef,
            option,
        };
    },
};
</script>

<style lang="less" scoped>
</style>
```

现在基础的柱状图就搭建好了，开始考虑传参。

## 动态设置

为子组件传递一个对象 `info` ，所有的参数都放在 `info` 内，有一个参数发生改变，都重新渲染该图表组件。

```js
export default {
  props: {
    type: Object,
    default: () => ({})
  },
  setup(props, {emmit}) {
    // ...
    
    // 侦听info的变化
    watch(() => props.info, () => {
        update();
    }, {
        deep: true,
        immediate: true,
    });
  }
}
```

### 柱状图 Y 轴单位

Y 轴单位由 `yAxis` 属性的 `name` 字段控制，因此代码可以修改为如下形式：

```js
const update = () => {
  option.value = {
    // ...
    yAxis: {
        // ...
        name: props.info.yAxisName, // 设置轴单位
    },
  }
}
```

柱状图数据与其他参数设置

柱状图 `series` 的属性配置大同小异，无外乎设置 `name` 柱体名称（搭配图例 `legend` 使用） 、`type` 类型（柱状图固定为 `bar` ） 、`barWidth` 柱体宽度、`data` 数据、`itemStyle` 对象的 `color` 柱体颜色设置、`emphasis` 事件函数对象下的 `itemStyle` 下的 `color` 鼠标悬停后柱体颜色。

其中，柱体名称、类型、柱体宽度可以写死，后三者动态传入，因此逻辑可以处理为获取到数据后，先渲染长度为传参的数据长度、每一项数据为0的图表，然后依次获取到对应的索引的数据。

代码可以修改为如下形式：

```js
const update = () => {
  option.value = {
    // ...
    series: props.info.seriesData.map((item, index) => {
       let data = Array(props.info.seriesData.length).fill(0);
       data[index] = item.data;
       return {
           name: item.name,
           type: 'bar',
           stack: 'myBar',
           barWidth: 16 * ratio.value,
           data, // 数据
           itemStyle: {
               color: item.itemColor || 'rgb(68, 218, 30)',
           },
           // 事件处理函数
           emphasis: {
               // 鼠标悬停时柱体颜色改变为红色
               itemStyle: {
                   color: item.emphasisColor || item.itemColor || 'rgb(68, 218, 30)',
               },
           },
       };
    ),
  }
}
```

这样父组件只需要考虑传包含显示的数据、其他后端返回的页面需要渲染的数据、柱体颜色配置即可。

### 图例设置

柱状图的图例内容由 `legend` 的 `data` 数组属性和 `series` 数组内每项数据对象的 `name` 属性。

以案例图左侧绿色背景色的柱状图为例，给每一项 `name` 属性都设置为 “设备运行数量”，然后给 `legend` 设置 `['设备运行数量']` ，就能实现效果。

以案例图右侧柱状图为例，给每一项 `name` 属性设置数据的桩号，然后过滤出所有数据的桩号并保存为新数组，就能实现效果。

因此从易用性和自主性方面考虑，可以添加短路运算，如果父组件有传相应的数组，则使用父组件传过来的数组；否则采取 “过滤出所有数据的桩号并保存为新数组” 的方式。

代码如下所示：

```js
const update = () => {
     const seriesDataName = props.info.seriesData.reduce((acc, curr) => {
         if (!acc.includes(curr.name)) {
             acc.push(curr.name);
         }
         return acc;
     }, []);
     option.value = {
         grid: {
             // ...
         },
         tooltip: {
             // ...
         },
         xAxis: {
             type: 'category',
             data: props.info.xAxisData ?? seriesDataName,
         },
         legend: {
             type: 'scroll',
             width: '80%',
             data: props.info.legendData ?? seriesDataName,
             top: 'top', // 设置图例显示在顶部
             left: 'right', // 设置图例水平居中
             icon: 'circle', // 设置图例的图标为圆形
             textStyle: {
                 color: '#fff',
                 fontSize: 12 * ratio.value,
                 fontWeight: 400,
                 fontFamily: 'OPlusSans',
             },
         },
     };
     init();
 };
```

### 鼠标悬停内容显示

该模块主要做以下两步操作：

1. 设置相应的弹窗样式
2. 判断是否有父组件传过来的回调函数，如果有则使用父组件的回调函数，没有则使用自定义内容。

代码如下所示：

```js
tooltip: {
    // 配置 tooltip
    trigger: 'axis', // 触发类型，柱状图使用 'axis'
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    axisPointer: { // 坐标轴指示器配置
        type: 'shadow', // 阴影指示器
    },
    formatter: function (params) {
        if (props.tooltipCallback) {
            return props.tooltipCallback(params);
        }
        // 自定义 tooltip 的内容
        return `<div class="tet">
            <div class="title">${params[0].name}</div>
            <div class="info">
                <div class="num">
                    <div class="num-title">运行数量</div>
                    <div class="num-info">${params[0].value}</div>
                </div>
                <div class="online">
                    <div class="online-title">在线率</div>
                    <div class="online-info">123%</div>
                </div>
            </div>
        </div>`;
    },
},
```

## 总体代码

```vue
<template>
    <div
        ref="chartRef"
        class="structure-chart"
    ></div>
</template>

<script>
import * as echarts from 'echarts';
import {ref, onMounted, nextTick, watch} from 'vue';
import {useUnit} from '@/utils/hooks/useUnit';
export default {
    props: {
        info: {
            type: Object,
            default: () => ({}),
        },
        tooltipCallback: {
            type: Function,
            default: null,
        },
    },
    setup(props) {
        const chartRef = ref(null);
        const myChart = ref(null);

        const {ratio} = useUnit();

        const option = ref();

        const init = () => {
            if (!myChart.value) return;
            myChart.value.setOption(option.value);
        };

        const update = () => {
            const seriesDataName = props.info.seriesData.reduce((acc, curr) => {
                if (!acc.includes(curr.name)) {
                    acc.push(curr.name);
                }
                return acc;
            }, []);
            option.value = {
                grid: {
                    top: '12%',
                    left: '0%',
                    right: '5%',
                    bottom: '0%',
                    containLabel: true,
                },
                tooltip: {
                    // 配置 tooltip
                    trigger: 'axis', // 触发类型，柱状图使用 'axis'
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    axisPointer: { // 坐标轴指示器配置
                        type: 'shadow', // 阴影指示器
                    },
                    formatter: function (params) {
                        if (props.tooltipCallback) {
                            return props.tooltipCallback(params);
                        }
                        // 自定义 tooltip 的内容
                        return `<div class="tet">
                            <div class="title">${params[0].name}</div>
                            <div class="info">
                                <div class="num">
                                    <div class="num-title">运行数量</div>
                                    <div class="num-info">${params[0].value}</div>
                                </div>
                                <div class="online">
                                    <div class="online-title">在线率</div>
                                    <div class="online-info">123%</div>
                                </div>
                            </div>
                        </div>`;
                    },
                },
                xAxis: {
                    type: 'category',
                    data: props.info.xAxisData ?? seriesDataName,
                },
                legend: {
                    type: 'scroll',
                    width: '80%',
                    data: props.info.legendData ?? seriesDataName,
                    top: 'top', // 设置图例显示在顶部
                    left: 'right', // 设置图例水平居中
                    icon: 'circle', // 设置图例的图标为圆形
                    textStyle: {
                        color: '#fff',
                        fontSize: 12 * ratio.value,
                        fontWeight: 400,
                        fontFamily: 'OPlusSans',
                    },
                },
                yAxis: {
                    type: 'value',
                    minInterval: 1, // 设置y轴的最小间隔为1
                    name: props.info.yAxisName,
                },
                series: props.info.seriesData.map((item, index) => {
                    let data = Array(props.info.seriesData.length).fill(0);
                    data[index] = item.data;
                    return {
                        name: item.name,
                        type: 'bar',
                        stack: 'myBar',
                        barWidth: 16 * ratio.value,
                        data, // 数据
                        itemStyle: {
                            color: item.itemColor || 'rgb(68, 218, 30)',
                        },
                        // 事件处理函数
                        emphasis: {
                            // 鼠标悬停时柱体颜色改变为红色
                            itemStyle: {
                                color: item.emphasisColor || item.itemColor || 'rgb(68, 218, 30)',
                            },
                        },
                    };
                }),
            };
            init();
        };

        watch(() => props.info, () => {
            update();
        }, {
            deep: true,
            immediate: true,
        });

        onMounted(() => {
            nextTick(() => {
                myChart.value = echarts.init(chartRef.value);
                init();
            });
        });

        return {
            chartRef,
            option,
        };
    },
};
</script>

<style lang="less"
    scoped>
    .structure-chart {
        width: 100%;
        height: 100%;
    }

    :deep(.tet) {
        width: 80px;
        height: 100%;

        .title {
            font-weight: 700;
            font-size: 12px;
            font-family: 'OPlusSans';
            margin-bottom: 4px;
            color: #fff;
        }

        .info {
            width: 100%;

            >div {
                display: flex;
                justify-content: space-between;
                width: 100%;

                .num-title,
                .online-title {
                    font-weight: 400;
                    font-family: 'OPlusSans';
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.5);
                }

                .num-info,
                .online-info {
                    font-weight: 700;
                    font-family: 'OPlusSans';
                    font-size: 10px;
                    color: rgb(255, 255, 255);
                }
            }
        }
    }
</style>
```



