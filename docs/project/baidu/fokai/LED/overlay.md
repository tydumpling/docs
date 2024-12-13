# 覆盖物

在百度二维地图中，扎点、线等这些统称为覆盖物。项目需要的效果如下图所示：

![效果](https://pic.imgdb.cn/item/65fa859f9f345e8d03e05bf8.png)

## 线

查阅 [线覆盖物](https://lbs.baidu.com/index.php?title=jspopularGL/guide/addOverlay) 文档，需要使用 `Polyline` 类绘制折线，其需要接收两个参数：

1. 参数一：数组。数组中每一项数据均是 `Point` 类创建的点
2. 参数二：线的属性对象。包括线的颜色 `strokeColor` 、线的宽度 `strokeWeight` 、线的不透明度 `strokeOpacity` 等

```js
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { BusStatus } from '@/config/index.js'
import useMapStore from '@/store/index.js'

// 获取pinia仓库内的地图实例
const { map } = storeToRefs(useMapStore())

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
})

onMounted(() => {
    // 画线
    props.list.forEach((v, i) => {
        let polyline = new BMapGL.Polyline(
            v.map(e => new BMapGL.Point(...e)),
            {
                strokeColor: BusStatus.get(i + 1) || "rgba(134, 255, 0, 0.98)",
                strokeWeight: 8,
                strokeOpacity: 0.7
            }
        );
        map.value.addOverlay(polyline);
    });
})
```

若想要使用数组遍历的样式给参数一传值，必须使用 `map` 、`filter` 等可返回新数组的数组方法，使用 `forEach` 等会因为没有传数组而报错。

## 扎点

根据效果图显示，其扎点是通过 UI 提供的图片和文本组合在一起的。

### 文本

比起百度三维地图，二维地图的文本不仅提供了文字大小颜色等属性，还提供了内边距、背景颜色等属性设置。文档指路 [文本标注](https://lbs.baidu.com/index.php?title=jspopularGL/guide/label) 。

根据文档指示，通过 `Label` 类实现创建文本，需要传两个参数：

1. 参数一：文本内容
2. 参数二：文本属性对象，如 `position` 位置坐标，`offset` 偏移量等

```js
let point = new BMapGL.Point(lng, lat);
let label = new BMapGL.Label(content, {       // 创建文本标注
    position: point,                          // 设置标注的地理位置
    offset: new BMapGL.Size(25, -30)           // 设置标注的偏移量
})
map.value.addOverlay(label);                        // 将标注添加到地图中
label.setStyle({                              // 设置label的样式
    color: '#fff',
    fontSize: '20px',
    backgroundColor: 'red',
    padding: '0 5px'
})
```

### 自定义HTML图层

百度二维地图中有两个类方法可以生成自定义 HTML 图层，分别为 [自定义覆盖物CustomOverlay](https://lbsyun.baidu.com/jsdemo.htm#customoverlay-canvas) 和 [自定义覆盖物图层类CustomHtmlLayer)](https://lbs.baidu.com/index.php?title=jspopularGL/guide/CustomhtmlLayer) 。二者的区别是前者只能自定义单个覆盖物，后者可以自定义多个。

自定义HTML图层需要分为一下几步：

1. 使用 `CustomHtmlLayer` 自定义图层，类方法需要传两个参数，参数一是一个函数，返回一个 DOM；参数二是熟悉对象，包含偏移量，最小最大显示层级等
2. 定义一个图层数据变量，通过 `setData` 设置图层数据
3. 把自定义 HTML 图层 `addCustomHtmlLayer` 添加到地图上

```js
const cusLayer = new BMapGL.CustomHtmlLayer(
    () => {
        const img = document.createElement('img');
        img.style.height = '68px';
        img.style.width = '60px';
        img.src = iconImg;
        img.draggable = false;
        return img;
    },
    {
        offsetX: 0,
        offsetY: 0,
        minZoom: 1,
        maxZoom: 100,
        enablePick: true
    }
);
const data = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lng, lat]
            },
            "properties": { "prop0": "value0" }
        }
    ]
};
// 设置图层数据
cusLayer.setData(data);

// 将自定义html图层添加到地图上
map.value.addCustomHtmlLayer(cusLayer);

// 覆盖物绑定点击事件
// cusLayer.addEventListener('click', function (e) {
//   console.log('e:', e)
// });
```

