---
title tabbar页
---
# tabbar页
主页面 `tabBar` 页面根据高保真原型图设计开发即可。

## 首页轮播图跳转
用户有一个需求是点击轮播图的图片跳转到指定链接页面，uniapp 有一个内置的组件 [webview](https://uniapp.dcloud.net.cn/component/web-view.html#web-view) 。根据官方文档，为其 `src` 设置指定的网页链接后可跳转到该页面。可能常用属性如下：

| 属性名 | 类型 | 说明 |
| --- | --- | --- |
| src | String | webview 指向网页的链接 |
| webview-styles | Object | webview 的样式 |

更多属性前往官网查看

- 点击轮播图路由跳转
```js
const swiperToPage = e => {
  // 如果有参数再跳转
	if (!e) return
	uni.navigateTo({
		url: `/pages/routerWebView/RouterWebView?src=${e}`
	})
}
```

- 拿到链接参数赋给 src 属性
```vue
<script setup>
import {ref} from 'vue'

const webviewStyles = ref({
	top: 0
})
const src = ref('')

onLoad((val) => {
	src.value = val.src
})
</script>

<template>
	<web-view :webview-styles="webviewStyles" :src="src"></web-view>
</template>
```
更多 `webview` 使用技巧可参考官网文档、DCloud上的问答 [在web-view加载的本地及远程HTML中调用uni的API及网页和vue页面通讯](https://ask.dcloud.net.cn/article/35083) 与这两篇文章 [在uniapp中优雅地使用WebView](https://www.kancloud.cn/xiaoyulive/uniapp/1849196) 、 [webview使用](https://blog.csdn.net/qq_40716795/article/details/127576627) 。

## tabbar隐藏

原生 `tabbar` 层级极高，即使通过 `css` 为元素设置 `z-index` 为9999都无法覆盖。而本项目中需要进入页面判断用户是否复制了领取优惠券的码，如果有则不展示下方的 `tabbar` 。不然会有一个 `bug` ：在首页展示了领取优惠券的模态框，不点击去往我的页面，我的页面也展示。返回首页取消掉模态框后我的页面的模态框并没有取消掉。

如果无法从层级方面下手，能否从显隐方面呢？查看官方文档发现有对应的显示 `tabbar` 方法 `showTabBar()` 和隐藏 `tabbar` 方法 `hideTabBar()` 。

```js
onShow(() => {
	setTimeout(() => {
		if (如果有复制到优惠券码) {
			uni.hideTabBar()
			id.value = uni.getStorageSync('couponShow')
			// 做其他处理
		}
	}, 500)
})

const closeFn = () => {
	// 移出本地存储，清除复制的内容，隐藏弹窗
	uni.removeStorageSync('couponShow')
	uni.setClipboardData({
		data: '',
		showToast: false,
		success: function() {
		}
	});
	show.value = false
	uni.showTabBar()
}
```

现在的效果如下所示：

[![p9gWBi4.png](https://s1.ax1x.com/2023/05/15/p9gWBi4.png)](https://imgse.com/i/p9gWBi4)