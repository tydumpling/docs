---
title 项目简介
---
# 项目
该项目为视频分销小程序，主要功能为首页、我的、分类、任务、活动五大模块。后台新增商品，通过商品发布任务，小程序端用户可领取任务和样品去推广。在任务模块上传链接地址提交任务来换取佣金提现。

2023/7/6

添加了商城模块，为单独的小程序，技术栈与分销一致。

现已发布上线，微信小程序搜 “抓猫电商”。

## 技术栈

1. `vue2` + `vuex3`
2. `uniapp`
3. `uview2.x` + `uni.$u.http` 接口调用

## 主要模块

- 商品任务

  商品任务列表点击对应任务进入任务详情页面，可领取任务、申请拿样品、领取素材。

  只有在领取任务后才能申领素材与样品；素材与样品只能申领一次。

- 用户任务

  用户领取了任务后会有一条用户任务，需要在规定时间内完成任务后提交，否则记为超时。当用户申领素材后会有素材链接，复制后在浏览器内打开。

- 我的

  我的模块中主要包含我的地址、个人资料修改、我的申请、抖音授权几大功能。

## 遇到的问题

### 视频轮播

在最开始该项目是想做一个 `app` （后来因为涉及佣金，不给上架，最后改为小程序）。在 `app` 端想要把视频嵌套到 `uview` 组件内，最后因为视频层级问题无法实现，采用了其他方案（见[视频轮播](/project/lingsi/sale/video.md)）。换成小程序端后问题解决。

> 注意：
>
> `APP` 端视频层级过高，导致普通的 `view` 标签无法覆盖在视频标签之上，即使设置定位，`z-index:9999` 也不行。如果需要在视频标签上显示内容，则需要在 `video` 标签内使用 `cover-view` 或 `cover-image` 标签。

### 微信授权获取手机号登录

出现 `getPhoneNumber:fail:access denied` 。

因为该账号未认证，官方文档明确表明小程序要完成认证才可使用。具体实现可见 [微信授权](/project/lingsi/sale/获取手机号.md) 。

### 视频在 `ios` 无法播放

视频轮播修改完后发布到体验版，安卓机播放没问题，苹果手机无法播放，于是开始寻查之旅。

百度“微信小程序ios无法播放视频”，微信开发平台有人专门询问了这个问题，下方回复为：
- 播放视频的路径 不能是中文的 不能有空格。后端对返回的文件名称做了处理，因此不是这个原因。
- MP4压缩级别不够。根据 [该博客](https://www.cnblogs.com/aleafo/p/7644553.html) 的解释，h264编码（通过某种特定的压缩技术，将某个视频格式的文件转换为另一种视频格式的文件的技术称为视频编码。h264是视频流中其中一种编码标准）的压缩级别问题导致。 因此需要做转码处理。在线文件转换地址：[在线文件转换](https://convertio.co/zh/)
  

苹果手机上运行，依旧无法查看。
- 看到官方提出“是否能在ios浏览器上观看该视频”，去ios浏览器查看，发现浏览器无法查看，证明是视频文件的问题。经过搜索，找到一条疑似有用的解答，原地址为：[java处理苹果浏览器safari无法播放视频流（Accept-Ranges）](https://blog.csdn.net/u010120886/article/details/79007001)

   让后端对返回的视频格式做一定的处理（没参与不知道是否为这个问题，不清楚后端做了什么操作），最后效果实现。

### 过审

小程序审核需要遵循规范，否则无法过审。目前为止分销小程序已经被驳回几次，分别为：

- 获取用户信息：要求用户绑定微信号、手机号，让用户输入姓名
- 强制登录：小程序的 `tabbar` 页面需要登录才能使用，强制要求用户登录
- 视频类目：小程序如果需要用到视频播放，需要添加视频类目
- 授权登录：不能存在存在混淆腾讯官方的元
  素，包括但不限于“微信”字样、微信官方logo等。需要将微信号授权登录提示修改为“手机号快捷登录”等

### 长按触发点击事件

在投票界面用户需要长按对应作品复制其链接，轻车熟路从 `uniapp` 文档中找到 `longtap` 方法，运行测试一下有效果了，但是微信开发工具爆了一个警告：

```
[Deprecation] 'longtap' event is deprecated. Please use 'longpress' instead.
```

大意是`longtap` 方法会触发点击事件，可以使用`longpress` ，这样就不会触发点击事件。

## 项目亮点

### 防抖的实现

部分功能模块（如 `tab` 栏切换）用户频繁操作时会多次调用接口，增加服务器压力，且请求返回时间不一致导致数据错乱。因此封装一个防抖函数，等待用户切换完毕后再调接口。

- 函数封装

  ```js
  // 防抖
  export function debounce(fn, delay = 500) {
  	let timer = null;
  	return function() {
  		if (timer) {
  			clearTimeout(timer);
  		}
  		timer = setTimeout(() => {
  			fn.apply(this, arguments);
  		}, delay)
  	}
  }
  ```

- 函数导入

  ```js
  import {debounce} from '@/utils/utils.js'
  ```

- 函数使用

  ```js
  click: debounce(function(e) {
      // 执行操作
  }, 1000),
  ```

### 扫码跳转页面

通过二维码扫码可跳转到对应的页面，二维码的参数可在 `onLoad` 的形参中接收获取。

后端返回的数据格式是通过编码过的，因此需要转码翻译再去获取，解码的方法为 [decodeURIComponent](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent) 。

通过二维码扫码跳转的页面包含活动详情页，如果用户未登录，则会跳转到登录页，登录成功后返回的是首页，体验很不友好，因此需要让用户从哪里进的登录页，就回到哪里去。

`uniapp` 中没有路由的概念，可以通过 `getCurrentPages()` 方法获取当前的页面栈，为数组对象的形式，第一项为当前的页面，第二项为上一页。`route` 属性的值是该页面的路由，因此可以获取然后跳转页面。

```js
const pages = getCurrentPages() //获取加载的页面，数组形式，route是页面栈的路由
const url = pages[pages.length - 2].route === 'pages/login/Login' ? pages[pages.length - 3].route : pages[pages.length - 2].route; // 上个来登录页的页面，有可能会跳两次登录页，因此判断上一个页面是否为登录页，如果是登录页则再向上上个页面获取
uni.navigateTo({
	url
})
```

### 字体图标引入

为了减小项目包的体积，部分小图片采取引入字体图标的形式减少图片的存储，减少文件的体积。字体图标引入方式如下：

1. 在 `iconfont` 阿里巴巴矢量库中选择需要的字体图片，新增一个项目并保存

   [![pCSDxD1.png](https://s1.ax1x.com/2023/06/02/pCSDxD1.png)](https://imgse.com/i/pCSDxD1)

2. 下载项目到本地，把其中的 `iconfont.css` 样式文件拖拽到项目中

   [![pCSrXi8.png](https://s1.ax1x.com/2023/06/02/pCSrXi8.png)](https://imgse.com/i/pCSrXi8)

3. 去生成链接并粘贴到 `iconfont.css` 文件中

   [![pCSsVWF.png](https://s1.ax1x.com/2023/06/02/pCSsVWF.png)](https://imgse.com/i/pCSsVWF)

4. 把链接每一个 `url` 内都添加 `https` 。修改后的效果如下：

   ```css
   @font-face {
     font-family: 'iconfont';  /* Project id 3839320 */
     src: url('https://at.alicdn.com/t/c/font_3839320_svujarqdy4e.woff2?t=1685685427701') format('woff2'),
          url('https://at.alicdn.com/t/c/font_3839320_svujarqdy4e.woff?t=1685685427701') format('woff'),
          url('https://at.alicdn.com/t/c/font_3839320_svujarqdy4e.ttf?t=1685685427701') format('truetype'),
          url('https://at.alicdn.com/t/c/font_3839320_svujarqdy4e.svg?t=1685685427701#iconfont') format('svg');
   }
   ```

5. 使用。为需要使用的标签添加类名。首先需要添加 `iconfont` 类名，让字体 `font-family` 为 `iconfont` （主要看 `iconfont.css` 文件中设置了啥类名），然后设置对应字体图标类名。

   ```vue
   <i class="icon-douyin iconfont" style="color: #e85751; font-size: 30rpx;"></i>
   ```

   [![pCScmQg.png](https://s1.ax1x.com/2023/06/02/pCScmQg.png)](https://imgse.com/i/pCScmQg)
   
6. 最后在 `App.vue` 文件中引入

   ```vue
   <style lang="scss">
   	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
   	@import '/static/iconfont.css';
   	@import "uview-ui/index.scss";
   </style>
   ```