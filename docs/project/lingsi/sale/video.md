---
title 视频轮播
---
# 视频轮播
项目有一个视频图片轮播图的功能，想要实现像淘宝那种效果，但由于技术能力有限，最终实现的效果为轮播图 + 视频组件的形式。

轮播图第一张固定为视频的封面图，点击后 `v-show` 切换成视频组件 `video` 。暂停后切换回来轮播图组件。
这里使用 `v-show` 的原因是切换回轮播图后用户下一次点击时能够继续上一次的进度观看。
## 视频组件层级
`app`端底层逻辑的原因，视频标签层级很高，无法使用常规标签和样式覆盖，`uniapp` 提供了专属标签 [cover-view](https://uniapp.dcloud.net.cn/component/cover-view.html#cover-view) 。覆盖在原生组件上的文本视图。
该标签支持 `click` 事件，使用方式为被 `video` 等标签包裹在内，渲染文本。
```html
<video v-show="activeIndex === 0" id="myVideo" autoplay :src="videoSrc" controls :loop="true" @pause="stopFn" @ended="stopFn">
  <cover-view class="imgdiv">
    <cover-image class="img" src="../../static/img/shop/download.png" @click="handleDownloadFn">
    </cover-image>
  </cover-view>
</video>
```
## 下载视频到相册
下载视频到相册用到了 [uni.savevideotophotosalbum](https://uniapp.dcloud.net.cn/api/media/video.html#savevideotophotosalbum) 事件，参数如下：

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| filePath | String | 是 | 视频文件路径，可以是临时文件路径也可以是永久文件路径 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

临时文件路径可通过 `uni.downloadFile` 方法获取。
```javascript
handleChangeFn() {
  uni.downloadFile({
    url: this.videoSrc,
    // 临时地址存储成功
    success: (res) => {
      if (res.statusCode === 200) {
        // 保存到相册
        uni.saveVideoToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(result) {
            uni.showToast({
              title: '下载成功'
            })
          },
          fail: (err) => {
            uni.showToast({
              title: err,
              icon: 'none'
            })
          }
        });
      } else {
        uni.showToast({
          title: '下载失败',
          icon: 'none'
        })
      }
    },
    fail: (err) => {
      uni.showToast({
        title: err,
        icon: 'none'
      })
    }
  });
}
```
