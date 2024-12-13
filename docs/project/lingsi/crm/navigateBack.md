# navigateBack 传参
根据官方文档显示，wx.navigateBack() 方法是不支持传参的，因此如果需要返回上一页对数据做某种处理时，可以使用 getCurrentPages() 方法。
## getCurrentPages
获取当前页面栈。数组中第一个元素为首页，最后一个元素为当前页面。
> 注意：
> 不要尝试修改页面栈，会导致路由以及页面状态错误。

不要在 `App.onLaunch` 的时候调用 `etCurrentPages`，此时 `page` 还没有生成。
获取到需要的页面（即上一页）： `let prevPage = page[page.length - 2]` 此时 `prevPage` 代表的就是上一页的实例，相当于 `this` 。
```javascript
let page = getCurrentPages() //获取当前页面栈
let prevPage = page[page.length - 2] //代表的就是上一页的实例，相当于this
prevPage.setData({
  list: []
})
wx.navigateBack({
  delta: 1
})
```
现在就可以对该页面的数据做操作再返回上一页了。
> 拓展
> [getCurrentPages的一些坑点](https://blog.csdn.net/shadow_zed/article/details/104387841/)

