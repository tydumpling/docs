# MapVThree

百度地图官方文档指路：[Mapvthree开发文档 (baidu.com)](https://lbsyun.baidu.com/solutions/mapvthreedoc) 。地图方法每个图层都要使用，因此统一封装成公共方法，通过传值的形式设置不同的属性。下面从方法封装、使用入手。

## 地图方法封装

地图方法挑基础的点、线、模型和我负责封装的视野漫游动画详细聊聊。

### 点

根据官方文档，渲染点需要做到以下几步：

1. 引入 `Icon` 方法和 `GeoJSONDataSource` 方法，前者用于创建点，后者用于把传入的数据转换为渲染点需要的数据源

2. 在渲染好的地图上通过调用地图实例的 `add()` 方法添加点，并传参宽度、高度、偏移量等参数

3. 调用 `GeoJSONDataSource` 方法获取数据源，入参可通过 f12 打开网络控制台查看，如下图：

   ![参数示例](https://pic.imgdb.cn/item/658a4fe0c458853aef328e82.jpg)

   只有坐标 `coordinates` 、图标图片路径 `icon` 和尺寸大小 `size` 是自定义的，其余复制粘贴即可。

4. 返回创建好的点和该地图实例

5. 创建一个删除点的方法，调用地图实例的 `remove()` 方法实现删除

代码如下所示：

```js
// 添加icon
export const addIcon = (coordinates, url, info) => {
    coordinates = [coordinates?.[0], coordinates?.[1], coordinates?.[2] || 0];
    const {
      	width = 92,
        height = 118,
        offset = [0, -50],
        geoData = [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': coordinates,
                },
                'properties': {
                    'icon': url,
                    'size': 40,
                },
            },
        ],
        _engine = engine.value,
    } = info || {};

    const icon = _engine.add(new Icon({
        width,
        height,
        vertexSizes: true,
        vertexIcons: true,
        transparent: true,
        offset,
        depthTest: false, // 深度检测
    }));
    GeoJSONDataSource.fromGeoJSON(geoData).then(data => {
        data.setAttribute('size').setAttribute('icon');
        icon.dataSource = data;
    });

    return {
        icon,
        _engine,
    };
};

// 删除icon
export const removeIcon = (icon, _engine = engine.value) => {
    icon && _engine.remove(icon);
};
```

### 线

根据官方文档，渲染线需要做到以下几步：

1. 引入 `FatLine` 方法和 `GeoJSONDataSource` 方法，前者用于创建线，后者用于把传入的数据转换为渲染线需要的数据源

2. 在渲染好的地图上通过调用地图实例的 `add()` 方法添加点，并传参线宽、线的颜色、线的坐标等参数

3. 调用 `GeoJSONDataSource` 方法获取数据源，入参可通过 f12 打开网络控制台查看，如下图：

   ![参数示例](https://pic.imgdb.cn/item/658a8c44c458853aef1cd007.jpg)

   只有坐标二维数组 `coordinates` 、线的颜色 `color` 是自定义的，其余复制粘贴即可。

4. 返回创建好的线和该地图实例

5. 创建一个删除线的方法，调用地图实例的 `remove()` 方法实现删除

代码如下所示：

```js
// 添加线
export const addLine = (coordinates, info, _engine, callback) => {
    if (!_engine) _engine = engine.value;
    const {lineWidth, color, opacity} = info || {};
    const line = _engine.add(new FatLine({
        vertexColors: true,
        lineWidth,
        opacity,
        keepSize: true,
        lineJoin: 'round',
    }));
    const geojson = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates,
        },
        properties: {
            color: color,
        },
    };
    GeoJSONDataSource.fromGeoJSON(geojson).then(geoData => {
        geoData.setAttribute('color');
        line.dataSource = geoData;
        callback && callback(geojson);
    });

    return {line, _engine};
};

// 删除线
export const removeLine = (line, _engine = engine.value) => {
    line && _engine.remove(line);
};
```

### 模型

根据官方文档，渲染模型需要做到以下几步：

1. 使用 `GLTFLoader` 进行模型加载，加载的模型通过地图实例的 `add()` 方法添加到场景中
2. 将单体模型添加到场景的特定位置，可以通过地图实例的 `map.projectPointArr(center)` 方法，根据场景中心点经纬度获取屏幕中心点坐标，然后设置模型的 `position`
3. 在模型方法的 `load` 回调函数中获取到模型数据，并给模型设置坐标和大小
4. 删除同理使用地图实例的 `remove()` 方法移除

代码如下所示：

```js
// 添加模型
export const addModel = (url = 'maplayer/assets/models/car-impact.glb', position, scale = 7, callback) => {
    const loader = new GLTFLoader();
    const point = engine.value.map.projectPointArr(position);
    let model = null;
    loader.load(url, gltf => {
        model = gltf.scene;
        model.position.set(point[0], point[1], 0);
        model.scale.setScalar(scale);
        model.rotation.x = Math.PI / 2;
        engine.value.add(model);
        callback && callback(model);
    });
};

// 删除模型
export const removeModel = model => {
    model && engine.value.remove(model);
};
```

### 视野漫游动画

根据官方文档，实现视野漫游动画需要做到以下几步：

1. 引入 `PathTracker` 方法，用于实现视野漫游动画创建
2. 在渲染好的地图上通过调用地图实例的 `add()` 方法添加视野漫游动画
3. 使用创建好的视野漫游动画变化实例进行方向插值的距离点的阈值、赋值跟踪的路线和模型和视野漫游类型、开启动画
4. 返回创建好的视野漫游动画和该地图实例
5. 创建一个删除点的方法，调用地图实例的 `remove()` 方法实现删除

代码如下所示：

```js
// 添加视野漫游动画
export const addPathTracker = options => {
    const {
        viewMode = 'unlock',
        positions,
        model,
        duration = 10000,
        distance = 50,
        pitch = 70,
        _engine = engine.value,
    } = options;

    const pathTracker = _engine.add(new PathTracker());
    pathTracker.interpolateDirectThreshold = 50; // 进行方向插值的距离点的阈值
    pathTracker.track = positions; // 跟踪的路线,为坐标数组或LineString类型的geojson数据
    pathTracker.start({
        duration,
        distance,
        pitch,
        heading: 10,
    });
    pathTracker.object = model;
    pathTracker.viewMode = viewMode;

    return {
        pathTracker,
        _engine,
    };
};

// 删除视野漫游动画
export const removePathTracker = (name, _engine = engine.value) => {
    name && _engine.remove(name);
};
```

## 地图方法使用

方法有了，现在就是使用方法实现需求了。

使用可以直接调用函数来使用，创建好后添加到地图实例上。但是这种方法会有一个问题：我们无法直观知道当前渲染的地图数据各自的来源和他们的名称，也无法轻松的删除对应位置的地图数据。还需要封装对应的类方法，其步骤如下：

1. 创建一个类，每个类对应一个地图方法渲染，在各自的构造器 `constructure` 中定义映射表 `new Map()` 。
2. 定义一个 `addXxxx()` 方法，方法接收地图函数方法需要的参数，调用前面写好的地图函数方法创建需要的地图数据，并在映射表中保存对应的映射
3. 定义一个 `removeXxxx()` 方法，方法接收一个名称的参数，通过该名称获取映射表对应的映射，从映射表中删除对应的映射，并从地图上删除对应的数据
4. 定义一个 `clear()` 方法，方法循环遍历映射表的 `key` 值，依次调用 `removeXxxx()` 方法删除地图

下面从地图的扎点和视野漫游动画方法入手。

### 扎点

根据 UI 图，先来看看扎点的效果，如下图所示：

![ui效果](https://pic.imgdb.cn/item/658aa954c458853aef6db8d0.jpg)

可以看到，他主要分为三部分：左侧的扎点和其下方的气泡点；右侧的 `label` 。下面依次分析。

扎点类型多种多样，主要有以下的区别：

- 扎点类型，有桥梁、边坡、隧道、路面等
- 扎点状态，有正常（绿色）、告警病害等（红色）；以及其他排名类（UI 图有对应的其他颜色）
- 扎点尺寸，有小尺寸、中尺寸和大尺寸

因此需要根据类型获取需要的图片路径。图片资源放到 `public/assets/image` 文件夹里面。因此可以这么处理：

> 每一个图片都规范命名，命名格式为 `扎点类型_扎点大小_扎点状态` 。由于考虑到扎点数量与种类过多，因此扎点类型取该扎点到中文，如 `qiaoliang` 等；尺寸大小仿照开源组件库的取法， `normal` 、`small` 等；状态则取对应的颜色英文单词，这样也能有一定的语义化。
>
> 由于图片都是放在 `public` 中，因此图片路径最终为 `public/assets/image/${扎点类型}_${扎点尺寸}_${扎点颜色}` 。

右侧采用地图的自定义 `label` ，调用方法传入其需要的真实 `dom` 、坐标和偏移值即可。前两者在调用时参数传入，偏移值通过计算。

底部的气泡图同理，调用方法传入其需要的尺寸大小、颜色、类型即可。

总体示例代码如下所示：

```js
import {addBubble, removeBubble, addIcon, removeIcon, addDOMOverlay, removeDOMOverlay} from '../xxx.js';

// 对象映射表，传入扎点类型中文获取对应扎点类型拼音
const nameMap = {
    '桥梁': 'qiaoliang',
    '边坡': 'bianpo',
    '隧道': 'suidao',
};
// 计算icon的宽高，获取到label的偏移量
const getLabelOffset = (labelDom, size) => {
    if (!labelDom) {
        return [0, 0];
    }
    const {width, height} = labelDom.getBoundingClientRect();
    const iconWidth = size === 'normal' ? 48 : 32;
    const iconHeight = size === 'normal' ? 83 : 55;
    const gapLeft = size === 'normal' ? 10 : 5;
    const gapTop = size === 'nomal' ? 42 : 28;
    const offsetLeft = width / 2 + iconWidth / 2 + gapLeft;
    const offsetTop = -(height / 2 - (iconWidth + gapTop) / 2) - iconHeight;
    return [offsetLeft, offsetTop];
};

// 获取icon图片路径 'maplayer/assets/image/设备类型(中文拼音)_size_status.png
const getIconUrl = (type, size = 'normal', status = 'normal', iconUrl) => {
    if (iconUrl) {
        return iconUrl;
    }
    const getIconStatus = status => {
        return `_${status}`;
    };
    size = size === 'normal' ? '_normal' : '_small';
    status = getIconStatus(status);
    type = nameMap[type] || type;
    return `maplayer/assets/image/${type}${size}${status}.png`;
};

const removeMap = {
    Icon: removeIcon,
    DomOverlay: removeDOMOverlay,
    Text: removeText,
};

// 支持绑定的事件
const eventNameEnum = {
    click: 'clickCallback',
    mouseenter: 'onMouseenter',
    mouseleave: 'onMouseleave',
};

// 扎点
class LayerManager {
    constructor(engine) {
        this.layerDomMap = new Map();
        this.engine = engine;
    }
    addLayerDomPoint(name, point, options) {
        if (this.warningeMap.has(name)) {
            this.removeLaddLayerDomPointByName(name);
        }
        this.options = options;
        const {
            labelDom,
            type = '桥梁',
            iconUrl,
            customData,
            bubbleColor,
            clickCallback,
            size = 'normal',
            status = 'normal',
        } = options || {};

        // 气泡点
        let {bubble} = addBubble(point, {
            size: size === 'normal' ? 60 : 40,
            color: bubbleColor,
            type: 'Wave',
            _engine: this.engine,
        });

        // 右侧label dom
        let {domOverlay} = addDOMOverlay(point, labelDom, {
            _engine: this.engine,
            offset: getLabelOffset(labelDom, size),
        });

        // icon small: 32 * 55 normal: 48 * 83(默认)
        let {icon, _engine} = addIcon(point, getIconUrl(type, size, status, iconUrl), {
            width: size === 'normal' ? 48 : 32,
            height: size === 'normal' ? 83 : 55,
            offset: size === 'normal' ? [0, -42] : [0, -28],
            customData,
            _engine: this.engine,
        });

        this.bind(options, icon);
        this.layerDomMap.set(name, {
            'Bubble': bubble, // 气泡点
            'Label': domOverlay, // 文字 label
            'Icon': icon, // icon
        });
    }
    removeLayerDomPointByName(name) {
        const warning = this.warningeMap.get(name);
        if (!warning) return;
        this.unbind(warning.Icon);
        Object.keys(warning).forEach(key => {
            const remove = removeMap[key];
            remove(warning[key], this.engine);
        });
        this.warning.delete(name);
    }

    // 绑定事件
    bind(element, type) {
        const addEventListener = type => {
            const eventName = eventNameEnum[type];
            const callback = this.options[eventName];
            if (callback && typeof callback === 'function') {
                element.receiveRaycast = true;
                element[type] = callback;
                element.engine.event.bind(element, type, callback);
            }
        };

        if (type) {
            addEventListener(type);
            return;
        }
        Object.keys(eventNameEnum).forEach(eventType => {
            addEventListener(eventType);
        });
    }

    // 移除事件
    unbind(element, type) {
        const removeEventListener = type => {
            element.engine.event.unbind(element, type, element[type]);
            element[type] = null;
        };

        if (type) {
            removeEventListener(type);
            return;
        }
        Object.keys(eventNameEnum).forEach(eventType => {
            removeEventListener(eventType);
        });
    }

    clear() {
        [...this.layerDomMap.keys()].forEach(macro => {
            this.removeLayerDomPointByName(macro);
        });
        this.layerDomMap.clear();
    }
}

export {
    LayerManager,
};
```

### 视野漫游动画

视野漫游动画也拆分一下，官网演示的效果如下图所示：

![效果](https://pic.imgdb.cn/item/658b9b91c458853aef2c5aed.jpg)

可以看到，视野漫游动画主要还是需要线（路径）、卡车等模型和动画效果三者。线、模型、动画方法前面都有封装到，因此直接获取使用即可。下面也来定义一个类方法：

1. 创建一个类，每个类对应一个地图方法渲染，在各自的构造器 `constructure` 中定义映射表 `new Map()` 。
2. 定义一个 `addPathTracker()` 方法，方法接收地图函数方法需要的参数（如模型路径、线路径二维数组等），调用前面封装好的相关方法创建地图数据并在映射表中保存对应的映射
3. 定义一个 `removePathTrackerByName()` 方法，方法接收一个名称的参数，通过该名称获取映射表对应的映射，从映射表中删除对应的映射，并从地图上删除对应的数据
4. 定义一个 `clear()` 方法，方法循环遍历映射表的 `key` 值，依次调用 `removeXxxx()` 方法删除地图

```js
import {addPathTracker, addLine, addModel, removePathTracker, removeModel, removeLine} from '../xxx.js';
// 是野蛮懂管理器
class PathTrackerManager {
    constructor(engine) {
        this.pathTrackerMap = new Map();
        this.engine = engine;
    }
    addPathTracker(name, options) {
        if (this.pathTrackerMap.has(name)) {
            this.removePathTrackerByName(name);
        }
        const {position, positions} = options || {};
        let {line} = addLine(positions, {
            lineWidth: 15, color: '#d0a63c', opacity: 1,
        }, null, geoData => {
            addModel('maplayer/assets/models/kache.glb', position, 150, model => {
                addPathTracker({
                    positions: geoData,
                    position,
                    model,
                });

                this.pathTrackerMap.set(name, {
                    'line': line,
                    'model': model,
                });
            });
        });
    }
    removePathTrackerByName(name) {
        const pathTracker = this.pathTrackerMap.get(name);
        pathTracker && removeModel(pathTracker.model, this.engine);
        pathTracker && removeLine(pathTracker.line, this.engine);
        this.pathTrackerMap.delete(name);
    }

    clear() {
        [...this.pathTrackerMap.keys()].forEach(pathTracker => {
            this.removePathTrackerByName(pathTracker);
        });
        this.pathTrackerMap.clear();
    }
}

export {
    PathTrackerManager,
};
```
