---
title 图层

---

# 图层

## 概括

该项目涉及到了地图渲染、地图扎点渲染、Echart 图数据展示、视频流视频播放等。用到的技术项包括图表 `Echart` 、百度地图 `MapVThree` 、渐进式框架`Vue2.7` 、第三方库 `Loadsh` 与 `Truf` 等。

在项目制作中，我负责了结构物健康监测图层、病害综合管理图层、轴载数据分析图层等图层的制作，负责了公共组件视频流组件的二次封装修改开发和头部组件的封装。还涉及到项目 Poc 迁移。

该项目从以下几方面进行梳理和总结：

- [样式](/project/baidu/layer/样式.md)
- [规范](/project/baidu/layer/规范.md)
- [封装](/project/baidu/layer/封装.md)
- [MapVThree](/project/baidu/layer/MapVThree.md)
- [优化](/project/baidu/layer/优化.md)
- [功能](/project/baidu/layer/功能.md)

## 项目结构

项目结构主要如下：

```js
|-examples // 图层的根组件
	|--App.vue // 整个图层的根组件
	|--views // 每个图层的根组件
|-publib // 存放公共资源
	|--assets
  	|--images // 图片
    |--css // 样式
		|--modules // 模型数据
|-src
	|--assets // 图片资源
	|--conpoments // 组件（公共部分与各自图层）
	|--router // 路由
	|--store // 多组件使用的方法与变量
	|--utils // 公共方法封装
|-script // 打包设置与简写设置
|-.env.development // 开发环境的配置
|-.env.test // 测试环境打包的配置
|-index.html // 主页面
|-vite.config.js // 文件夹路径简写和跨域代理
```

本项目是一个项目包含多个图层，每个图层使用到的方法会有相同的地方，但也会有各自不同的方法。因此需要做封装处理，封装时也需要考虑到易用性、复用性和可拓展性。


## 效果展示

下面附上几张效果图展示，以下效果均来自沙盒 Mock 环境：

- 结构物
  
  ![结构物](https://pic.imgdb.cn/item/6709e1b3d29ded1a8c57590c.png)

- 负荷均匀性
  
  ![负荷均匀性](https://pic.imgdb.cn/item/6709e25ad29ded1a8c57f2c4.png)

- 轴载
  
  ![轴载](https://pic.imgdb.cn/item/6709e3a8d29ded1a8c59037d.jpg)