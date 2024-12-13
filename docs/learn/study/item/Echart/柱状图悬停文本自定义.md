# 柱状图悬停文本自定义

## 效果

在项目中产品对直接使用的柱状图提出了批评意见，要求如下：

- 即使没数据也要显示所有的结构，没数据的补0
- 纵坐标数值取整，不要出现小数
- 柱体宽度固定，颜色样式要与原型图统一
- 鼠标悬停后展示同一组的所有数据

效果如下所示：

![效果](https://pic.imgdb.cn/item/6563221ac458853aefcfa287.jpg)

## 实现

### 纵轴单位规定整数

修改纵轴的参数，只需要修改 `yAxis` 对象的值即可生效。想要实现该效果，只需把 `minInterval` 属性设为1，最低单位为1，就不会出现小数的情况。

### 纵轴线不显示，横轴线为虚线

想要实现该效果，需要针对 `xAxis` 和 `yAxis` 两个数据对象进行设置，代码如下所示：

```js
xAxis: [
    {
        type: 'category',
        data: [],
        axisLabel: {
            textStyle: {
                color: 'rgb(239, 255, 255)',
                fontSize: 8,
                fontWeight: 400,
            },
        },
        splitLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
    },
],
yAxis: [
    {
        type: 'value',
        axisLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: 'rgba(255,255,255,0.2)',
                type: 'dashed',
                width: '1',
            },
        },
        axisLabel: {
            show: true,
            color: '#98B8DE',
            fontSize: 12,
            fontFamily: 'DINAlternate-Bold',
        },
    },
],
```

### 轴文本自定义

效果如下所示：

![效果](https://pic.imgdb.cn/item/658d42efc458853aefe24f93.jpg)

自定义文本需要通过 `formatter` 函数方法实现，想要在 X 轴上实现则在 `xAxis` 上添加即可。如下所示：

```js
xAxis: [
    {
        type: 'category',
        data: [],
        axisLabel: {
            textStyle: {
                color: 'rgb(239, 255, 255)',
                fontSize: 8,
                fontWeight: 400,
            },
            formatter: function (value) {
                // eslint-disable-next-line max-len, vue/max-len
                return `${value.substr(0, 3)}\n${value.substr(3, 4)}\n${value.substr(7, 4)}\n${value.substr(11)}`;
            },
        },
        splitLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
    },
],
```

### 柱体宽度与颜色设置

柱体宽度与颜色均在 `series` 中设置，为每一个柱体对象设置 `barWidth`  以控制柱体宽度。

再设置 `itemStyle` 对象属性，这里可以设置柱体的样式，包括颜色，字段为 `color` 。

### 鼠标悬停显示同组柱体的数据

与鼠标悬停有关的效果都在 `tooltip` 属性对象内设置，通过 `formatter` 函数返回需要显示的内容。可以返回一个包含 `HTML` 标签的字符串。

函数的形参 `params` 可以接收 `series` 与 `dataset` 内的柱体数据，包括数组数据、柱体颜色等，因此可以拿到数据渲染自己想要的文本内容，并且可以设置样式。

## 最终代码

```js
option = {
  legend: {
    left: 'right',
    icon: 'circle',
    textStyle: {
      color: '#fff'
    }
  },
  tooltip: {
    trigger: 'axis', // 鼠标悬停在轴线时展示信息
    formatter: function (params) {
      return `<div>
                                    <div>在线率：10%%</div>
                                    <div>
                                        <div
                                            style="
                                                display: inline-block;
                                                background: red;
                                                width: 10px;
                                                height: 10px;
                                                border-radius: 50%;
                                                margin: 5px 8px 0;
                                            "
                                            >
                                        </div>
                                        在线 100
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            style="
                                                display: inline-block;
                                                background: yellow;
                                                width: 10px;
                                                height: 10px;
                                                border-radius: 50%;
                                                margin: 5px 8px 0;
                                            "
                                            >
                                        </div>
                                        离线 0
                                        </div>
                                    </div>`;
    }
  },
  dataset: {
    source: [['online', '在线', '离线'],
    ['bridge', 10, 1],
    ['slope', 0, 1],
    ['tunnel', 5, 5],
    ]
  },
  xAxis: {
    type: 'category',
    axisLine: {
      type: 'dashed' // 设置横轴线为虚线
    }
  },
  yAxis: {
    minInterval: 1,
    axisLine: false // 不显示纵轴线
  },
  series: [
    {
      type: 'bar',
      itemStyle: {
        // 这里定义了柱状的颜色
        color: 'rgb(253, 183, 45)'
      },
      barWidth: 10
    },
    {
      type: 'bar',
      itemStyle: {
        // 这里定义了柱状的颜色
        color: 'rgb(117, 255, 206)'
      },
      barWidth: 10
    }
  ]
};
```

