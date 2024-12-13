# LED屏

## 项目简介

由于项目排期问题，我接手了一个 LED大屏 项目，接入百度二维地图，渲染路线和扎点。

该项目的主要技术栈为：Vue3 + axios + pinia + BMapGL。

该模块主要记录该项目从0到1如何搭建百度二维地图项目。

## 前置条件

- 封装 axios
- 创建 pinia 仓库
- 引入 less 样式处理器

## 项目准备

想要使用百度二维地图的 SDK，需要注册一个百度的账号，并且在 [百度地图开放平台 | 百度地图API SDK | 地图开发 (baidu.com)](https://lbs.baidu.com/index.php?title=首页) 中注册百度地图开放平台开发者。

注册成功后根据 [文档](https://lbs.baidu.com/index.php?title=jspopularGL/guide/getkey) 的指引，申请 AK 密钥。申请好后获取创建地图信息应用并保存自己的密钥。最终创建的应用如下：

![应用](https://pic.imgdb.cn/item/65fa51f69f345e8d03029179.png)

接下来复制官方文档的 `script` 标签，粘贴到项目的 `index.html` 文件中。

```html
<script type="text/javascript" src="https://api.map.baidu.com/api?v=1.0&&type=webgl&ak=您的密钥">
</script>
```

在 `App.vue` 中创建一个盒子地图容器，用于展示地图，设置宽高。创建地图实例，设置中心点坐标，最后初始化完成。

```vue
<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useMapStore from '@/store/index.js'

// 获取pinia仓库内的地图实例
const { map } = storeToRefs(useMapStore())

const container = ref(null)

onMounted(() => {
    map.value = new BMapGL.Map(container.value)
    let point = new BMapGL.Point(113.024568, 22.788965);
    map.value.centerAndZoom(point, 16.5); // 设置中心点
    map.value.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    // map.value.setTilt(73); //设置地图的倾斜角度
    // 设置地图的偏转角度（旋转角度），顺时针为正方向
    map.value.setHeading(50); // 设置地图旋转角度为60度
})
</script>

<template>
    <div ref="container" id="map_container"></div>
</template>
```

现在页面上就能看到效果了。