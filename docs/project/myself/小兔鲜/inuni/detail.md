# 订单详情

## 前置知识

### 路由栈

微信小程序中，可通过 `getCurrentPages()` 获取路由栈数组，最新打开的路由信息对象在最后一项，后进先出的形式排列。

### 动画

官方文档指路：[动画](https://developers.weixin.qq.com/miniprogram/dev/framework/view/animation.html#%E7%A4%BA%E4%BE%8B%E4%BB%A3%E7%A0%81) 。

订单详情页中，顶部的导航栏是自定义的，并且还能在页面滚动时拥有动画效果。

此处用到了微信官方提供的 `animate` 动画 API，该接口定义如下：

```js
this.animate(selector, keyframes, duration, ScrollTimeline)
```

> 注意
>
> 目前只支持 `scroll-view`

**参数说明**

| 属性           | 类型   | 默认值 | 必填 | 说明                                                         |
| :------------- | :----- | :----- | :--- | :----------------------------------------------------------- |
| selector       | String |        | 是   | 选择器（同 [SelectorQuery.select](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.select.html) 的选择器格式） |
| keyframes      | Array  |        | 是   | 关键帧信息                                                   |
| duration       | Number |        | 是   | 动画持续时长（毫秒为单位）                                   |
| scrollTimeline | Object |        | 是   |                                                              |

**keyframes 中对象的结构**

| 属性            | 类型          | 默认值 | 必填                              | 说明                                    |
| :-------------- | :------------ | :----- | :-------------------------------- | :-------------------------------------- |
| offset          | Number        |        | 否                                | 关键帧的偏移，范围[0-1]                 |
| ease            | String        | linear | 否                                | 动画缓动函数                            |
| transformOrigin | String        | 否     | 基点位置，即 CSS transform-origin |                                         |
| backgroundColor | String        |        | 否                                | 背景颜色，即 CSS background-color       |
| bottom          | Number/String |        | 否                                | 底边位置，即 CSS bottom                 |
| height          | Number/String |        | 否                                | 高度，即 CSS height                     |
| left            | Number/String |        | 否                                | 左边位置，即 CSS left                   |
| width           | Number/String |        | 否                                | 宽度，即 CSS width                      |
| opacity         | Number        |        | 否                                | 不透明度，即 CSS opacity                |
| right           | Number        |        | 否                                | 右边位置，即 CSS right                  |
| top             | Number/String |        | 否                                | 顶边位置，即 CSS top                    |
| matrix          | Array         |        | 否                                | 变换矩阵，即 CSS transform matrix       |
| matrix3d        | Array         |        | 否                                | 三维变换矩阵，即 CSS transform matrix3d |
| rotate          | Number        |        | 否                                | 旋转，即 CSS transform rotate           |
| rotate3d        | Array         |        | 否                                | 三维旋转，即 CSS transform rotate3d     |
| rotateX         | Number        |        | 否                                | X 方向旋转，即 CSS transform rotateX    |
| rotateY         | Number        |        | 否                                | Y 方向旋转，即 CSS transform rotateY    |
| rotateZ         | Number        |        | 否                                | Z 方向旋转，即 CSS transform rotateZ    |
| scale           | Array         |        | 否                                | 缩放，即 CSS transform scale            |
| scale3d         | Array         |        | 否                                | 三维缩放，即 CSS transform scale3d      |
| scaleX          | Number        |        | 否                                | X 方向缩放，即 CSS transform scaleX     |
| scaleY          | Number        |        | 否                                | Y 方向缩放，即 CSS transform scaleY     |
| scaleZ          | Number        |        | 否                                | Z 方向缩放，即 CSS transform scaleZ     |
| skew            | Array         |        | 否                                | 倾斜，即 CSS transform skew             |
| skewX           | Number        |        | 否                                | X 方向倾斜，即 CSS transform skewX      |
| skewY           | Number        |        | 否                                | Y 方向倾斜，即 CSS transform skewY      |
| translate       | Array         |        | 否                                | 位移，即 CSS transform translate        |
| translate3d     | Array         |        | 否                                | 三维位移，即 CSS transform translate3d  |
| translateX      | Number        |        | 否                                | X 方向位移，即 CSS transform translateX |
| translateY      | Number        |        | 否                                | Y 方向位移，即 CSS transform translateY |
| translateZ      | Number        |        | 否                                | Z 方向位移，即 CSS transform translateZ |

**ScrollTimeline 中对象的结构**

| 属性              | 类型   | 默认值   | 必填 | 说明                                                         |
| :---------------- | :----- | :------- | :--- | :----------------------------------------------------------- |
| scrollSource      | String |          | 是   | 指定滚动元素的选择器（只支持 scroll-view），该元素滚动时会驱动动画的进度 |
| orientation       | String | vertical | 否   | 指定滚动的方向。有效值为 horizontal 或 vertical              |
| startScrollOffset | Number |          | 是   | 指定开始驱动动画进度的滚动偏移量，单位 px                    |
| endScrollOffset   | Number |          | 是   | 指定停止驱动动画进度的滚动偏移量，单位 px                    |
| timeRange         | Number |          | 是   | 起始和结束的滚动范围映射的时间长度，该时间可用于与关键帧动画里的时间 (duration) 相匹配，单位 ms |

示例代码

```javascript
  this.animate('.avatar', [{
    borderRadius: '0',
    borderColor: 'red',
    transform: 'scale(1) translateY(-20px)',
    offset: 0,
  }, {
    borderRadius: '25%',
    borderColor: 'blue',
    transform: 'scale(.65) translateY(-20px)',
    offset: .5,
  }, {
    borderRadius: '50%',
    borderColor: 'blue',
    transform: `scale(.3) translateY(-20px)`,
    offset: 1
  }], 2000, {
    scrollSource: '#scroller',
    timeRange: 2000,
    startScrollOffset: 0,
    endScrollOffset: 85,
  })

  this.animate('.search_input', [{
    opacity: '0',
    width: '0%',
  }, {
    opacity: '1',
    width: '100%',
  }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 120,
    endScrollOffset: 252
  })
```

## 实现

首先获取路由栈：

```js
const pages = getCurrentPages()
```

获取当前页面实例（即路由栈数组最后一项）：

```js
const pageInstance = pages.at(-1) as any
```

在页面渲染完毕之后绑定动画效果：

```js
onReady(() => {
  // 动画效果,导航栏背景色
  pageInstance.animate(
    '.navbar',
    [
      {
        borderRadius: '0',
        borderColor: 'red',
        transform: 'scale(1) translateY(-20px)',
        offset: 0,
      },
      {
        borderRadius: '25%',
        borderColor: 'blue',
        transform: 'scale(.65) translateY(-20px)',
        offset: 0.5,
      },
      {
        borderRadius: '50%',
        borderColor: 'blue',
        transform: `scale(.3) translateY(-20px)`,
        offset: 1,
      },
    ],
    2000,
    {
      scrollSource: '#scroller',
      timeRange: 2000,
      startScrollOffset: 0,
      endScrollOffset: 85,
    },
  )

  pageInstance.animate(
    '.navbar', // 选择器
    [{ backgroundColor: 'transparent' }, { backgroundColor: '#f8f8f8' }], // 关键帧信息
    1000, // 动画持续时长
    {
      scrollSource: '#scroller', // scroll-view 的选择器
      startScrollOffset: 0, // 开始滚动偏移量
      endScrollOffset: 50, // 停止滚动偏移量
      timeRange: 1000, // 时间长度
    },
  )
  // 动画效果,导航栏标题
  pageInstance.animate('.navbar .title', [{ color: 'transparent' }, { color: '#000' }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 0,
    endScrollOffset: 50,
  })
  // 动画效果,导航栏返回按钮
  pageInstance.animate('.navbar .back', [{ color: '#fff' }, { color: '#000' }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 0,
    endScrollOffset: 50,
  })
})
```

自定义导航栏如下：

```vue
 <!-- 自定义导航栏: 默认透明不可见, scroll-view 滚动到 50 时展示 -->
<view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
  <view class="wrap">
    <navigator
      v-if="pages.length > 1"
      open-type="navigateBack"
      class="back icon-left"
    ></navigator>
    <navigator v-else url="/pages/index/index" open-type="switchTab" class="back icon-home">
    </navigator>
    <view class="title">订单详情</view>
  </view>
</view>
```

通过为盒子设置类名的方式，使用 `animate` API 实现绑定类名的盒子实现动画效果。