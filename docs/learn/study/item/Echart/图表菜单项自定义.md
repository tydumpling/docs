# 图表菜单项自定义

## 效果

效果如下所示：

![效果](https://pic.imgdb.cn/item/6563042ec458853aef795b41.jpg)

1. 图例设置为圆圈形状
2. 文字内容自定义

## 实现

对于图表菜单的修改，需要在 `legend` 对象修改。

实现图例圆圈效果，只需要在 `legend` 对象内设置 `icon` 属性为 `circle` 即可。

实现文字内容自定义的效果，需要在 `legend` 对象内设置 `formatter` ，该属性有两种方式：可以直接返回一个携带变量的字符串；可以是一个返回内容的函数。

代码如下所示：

```js
option = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'right',
    top: 'center',
    align: 'left',
    icon: 'circle',
    formatter(name) {
      return `name${name}`;
    }
  },
};
```

如果想要对内容自定义设置样式，也需要使用到 `rich` 富文属性，在 `formatter` 函数的返回值中设置 `{变量名|变量}` 的格式，然后在 `legend` 对象内设置 `textStyle` 对象用于设置图例文字样式，再设置 `rich` 属性对每一个变量的文字设置样式。

代码如下：

```js
option = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'right',
    top: 'center',
    align: 'left',
    icon: 'circle',
        textStyle: {
      color: '#fff',
      rich: {
        name: {
          fontSize: 12,
          fontFamily: 'PingFang SC',
          color: '#ccc',
          letterSpace: 1,
          fontWeight: 700
        },
        num: {
          fontSize: 12,
          fontFamily: 'PingFang SC',
          color: '#ccc',
          letterSpace: 1,
          fontWeight: 700
        },
        point: {
          fontSize: 12,
          fontFamily: 'PingFang SC',
          color: '#ccc',
          letterSpace: 1,
          fontWeight: 700
        }
      }
    },
    formatter(name) {
      const item = data.value.find(item => item.name === name);
      return `{name|${name}}{num|${item.value}次}    {point|占比${item.point}%}`;
    }
  },
};
```

## 总结

在 `legend` 中设置 `formatter` 和 `rich` 实现内容自定义。
