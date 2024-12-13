# 横向柱状图参数数量设置

UI 图需要实现一个横向柱状图，柱状图有两个数据，一个总数、一个超限数据，且在柱体右上方还要显示其数值。效果如下所示：

![效果](https://pic.imgdb.cn/item/65a2b066871b83018aa86dbc.jpg)

在 EChart 官网中，是没有这些相关的案例参考的代码和图例，但是可以在民间第三方社区中寻找别人做好的效果来参考，地址为 [makeapie echarts社区图表可视化案例](https://www.makeapie.cn/echarts_category/series-bar_7.html) 。

想要实现这个效果，可以通过拆分来依次实现功能，分别为：

1. 实现横向柱状图的渲染，柱状图为重叠的多柱体，且不需要渲染 y 轴的线
2. 鼠标悬停显示文本自定义
3. 在柱体右上方显示数据

## 柱体基础渲染

首先实现第一点，一个横向柱状图，样式都为圆角柱体，且背景柱体颜色为灰色，内容柱体为渐变颜色。

圆角样式通过为 `series` 数组内对应对象的 `itemStyle` 属性中设置 `barBorderRadius` 即可，颜色在`itemStyle` 属性中设置 `color` 即可。如果想要实现渐变颜色，`color` 修改为一个对象，通过 `colorStops` 数组设置，其中 `offset` 为临界值，`color` 为要设置的渐变颜色。

而 y 轴想要不显示竖线，则需要在 `yAxis` 数组对象中设置 `axisLine` 、 `axisTick` 、 `splitLine` 三个对象即可，每个对象都是添加一个 `show` 属性为 `false` 。

代码如下所示：

```js
var option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'none',
        },
    },
    xAxis: {
        show: false,
        type: 'value',
    },
    // y轴坐标，不显示对应的竖线
    yAxis: [{
        type: 'category',
        inverse: true,
        axisLabel: {
            show: true,
            textStyle: {
                color: '#aaa',
            },
        },
        splitLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            show: false,
        },
        data: ['1', '2', '3'],
    }],
    series: [
        {
            name: '同比增长比例',
            type: 'bar',
            zlevel: 1,
            itemStyle: {
                normal: {
                    barBorderRadius: 10,
                    // 柱体颜色渐变
                    color: {
                        type: 'linear',
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(218, 255, 242, 0.1)',
                            },
                            {
                                offset: 1,
                                color: 'rgb(239, 255, 250)',
                            },
                        ],
                    },

                },
            },
            barWidth: 10,
            emphasis: {
                disabled: true,
                focus: 'none',
            },
            data: [1,2,3],
        },
        {
            name: '背景',
            type: 'bar',
            barWidth: 10,
            // barGap: '-100%',
            data: [6,5,4],
            emphasis: {
                disabled: true,
                focus: 'none',
            },
            itemStyle: {
                // 设置颜色和圆角
                normal: {
                    color: 'rgb(159, 159, 159)',
                    barBorderRadius: 10,
                },
            },
        },
    ],
}
```

## 鼠标悬停内容自定义

悬停自定义这个老生常谈了，之前也有做过好几次，即在 `tooltip` 对象属性中设置 `formatter` 函数，返回需要显示的字符串内容即可。

## 柱体数据显示

接下来要处理的是柱体数据显示。在柱状图中想要实现数据显示在柱体上方，只需给 `series` 对应数据对象设置 `label` ，让其展示，`show` 为 `true` ，设置 `position` 定位，`color` 控制颜色。

然后重点是设置 `offset` 偏移量，让其能够偏移到想要的位置去。代码如下所示：

```js
[
     {
        // ...
        label: {
            show: true,
            position: 'insideBottomRight',
            distance: 0,
            offset: [0, -15],
            color: '#fff',
        },
     }
]
```

