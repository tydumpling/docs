# 正则中的lastIndex

先来复刻一下 BUG 的产生：输入一个符合长度的手机号，符合正则校验；修改中间的一个数字，正则校验失败开始报错，再次修改则不报错。如下图所示：

![手机号正则校验](https://pic.imgdb.cn/item/651faa94c458853aef9d4b17.gif)

而代码也很简单，如下所示：

```js
const reg = /^1\d{10}$/g

const msg = document.querySelector('.form-msg')
const input = document.querySelector('.form-input input')

input.oninput = function() {
    if(reg.test(this.value)) {
        msg.style.display = 'none'
    } else {
        msg.style.display = 'block'
    }
}
```

正则校验失败时显示错误提示，校验成功则不显示。

## 报错原因

正则匹配添加粘性匹配或全局匹配时会产生一个属性 `lastIndex` 。这个属性表达的是上一次匹配时匹配到哪一个位置索引。匹配完手机号后 `reg.lastIndex` 为11，修改后它匹配不上，就会归0；下一次再匹配才匹配到11.

## 解决方案

既然知道他为啥会报错，那么就知道如何解决了。有两个解决方案：

1. 取消全局匹配

2. 重置 `lastIndex` 的值，让他从0匹配

   ```js
   reg.lastIndex = 0
   ```

   