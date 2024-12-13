# 导出PDF
导出页面为一个 pdf 文件，我们需要用到两个第三方包： html2Canvas 和 jsPdf 。
## html2Canvas
### 安装
yarn add html2canvas 
### 引用
```javascript
import html2Canvas from 'html2canvas'
```
### 是什么
允许让我们直接在用户浏览器上拍摄网页或其部分的“截图”。
它的屏幕截图是基于 DOM 的，因此可能不会 100% 精确到真实的表示，因为它不会生成实际的屏幕截图，而是基于页面上可用的信息构建屏幕截图。
### 怎么用

1. 获取到需要“截图”的 DOM 节点
2. 传递“截图”的参数：
   - allowTaint：允许跨域图片
   - useCORS：开启跨域配置
   - scale：比例缩放整体图片
3. 在回调中通过 toDataURL 方法把获取到的图片转为 base64 的形式
```javascript
html2Canvas(document.querySelector('.id'), {
  allowTaint: true,
  useCORS: true,
}).then((canvas) => {
  /* 导出不分页处理 */
  const pageData = canvas.toDataURL('image/jpeg', 1.0)
  const img = new Image()
  img.src = pageData
})
```
### 常见问题

1. Error loading img
图片跨域时会造成污染，导致绘制失败。看后台是否开启跨域，开启后设置 useCORS 和 allowTaint 。
2. 不支持 css3
插件不支持 css3 新特性，因此使用 background 等背景图会有一些潜在的 bug ，如果确定该页面需要导出，就使用 img 配合定位的形式实现效果。
## jsPdf
### 安装
yarn add jspdf 
### 引用
```javascript
import jsPDF from "jspdf"
```
### 使用
```javascript
let pdf = new jsPDF('p', 'pt', [pdfX, pdfY]);
```

- 参数一：方向（l：横向 p：纵向）
- 参数二：测量单位（"pt"，"mm", "cm", "m", "in" or "px"）
- 参数三：可以是下面格式，默认为“a4”。如果想使用自己的格式，只需将大小作为数字数组传递，例如[595.28, 841.89];
### 添加图片
通过 pdf.addImage() 将图像添加到 PDF ，addImage 参数设置如下：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/29781801/1675736751934-4ea419c8-ccbb-4a7b-8c44-0cef59c52cfa.png#averageHue=%23fefefe&clientId=ua586776f-4dd9-4&from=paste&id=u7cb72feb&name=image.png&originHeight=1334&originWidth=2262&originalType=url&ratio=1&rotation=0&showTitle=false&size=314753&status=done&style=none&taskId=u1871541a-1796-4e07-9a05-9c92a370708&title=)
### 保存文档
通过 pdf.save(name + '.pdf'); 的方法导出文档并命名。
### 整体代码
```javascript
const pageData = canvas.toDataURL('image/jpeg', 1.0)
const img = new Image()
img.src = pageData
const imgWidth = (canvas.width) * 0.195
const imgHeight = (canvas.height) * 0.195 // 内容图片这里不需要留白的距离
let PDF
img.onload = function() {
  if (contentWidth > contentHeight) {
    PDF = new JsPDF('l', 'mm', [contentWidth, contentHeight])
  } else {
    PDF = new JsPDF('p', 'mm', [contentWidth, contentHeight])
  }
  PDF.addImage(pageData, 'jpeg', 10, 10, imgWidth, imgHeight)
  PDF.save(title + '.pdf')
}
return true
```
## 导出函数封装
```javascript
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function(title,id) {
      html2Canvas(document.querySelector(id), { // 使用页面的总DIV 的ID，比如 el-col
        allowTaint: true,
        useCORS: true,
        // scale: 2 // 提升画面质量，但是会增加文件大小
      }).then((canvas) => {
        // 以下大小经过测试比较合适，可以根据自己的需要，一点点调整
        const contentWidth = (canvas.width + 100) * 0.2
        const contentHeight = (canvas.height + 100) * 0.2

        /* 导出不分页处理 */
        const pageData = canvas.toDataURL('image/jpeg', 1.0)
        const img = new Image()
        img.src = pageData
        const imgWidth = (canvas.width) * 0.195
        const imgHeight = (canvas.height) * 0.195 // 内容图片这里不需要留白的距离

        // 导出pdf
        let PDF
        img.onload = function() {
          if (contentWidth > contentHeight) {
            PDF = new JsPDF('l', 'mm', [contentWidth, contentHeight])
          } else {
            PDF = new JsPDF('p', 'mm', [contentWidth, contentHeight])
          }
          PDF.addImage(pageData, 'jpeg', 10, 10, imgWidth, imgHeight)
          PDF.save(title + '.pdf')
        }
        return true
      })
    }
  }
}
```
