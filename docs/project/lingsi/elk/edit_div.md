# DIV 可编辑文本
DIV 有个属性 contenteditable 可实现文本编辑，代码如下所示：
```vue
<div
  class="editdiv"
  ref="elInput"
  id="elInput"
  @focus="editFocus"
  @blur="editblur"
  @keyup="editdivKeyUp"
  tabindex="0"
  contenteditable
></div>
```
## 参数介绍
![image.png](https://cdn.nlark.com/yuque/0/2023/png/29781801/1675737310538-4e90f0ec-bd6e-4a2e-8dd8-7a037c63184b.png#averageHue=%23f8f7f7&clientId=ucb45ef2f-96a1-4&from=paste&id=u04d1321f&name=image.png&originHeight=297&originWidth=902&originalType=url&ratio=1&rotation=0&showTitle=false&size=27189&status=done&style=none&taskId=u6e3be09a-2f5f-418a-bff6-57cf9ee8699&title=)
## 使用
以上方代码为例，为 div 设置了 contenteditable 属性让其可以编辑后为其添加 聚焦focus 、 失焦blur 、 键盘弹起keyup 事件。
### 聚焦
```javascript
// 编辑器获取焦点
editFocus() {
  // 聚焦后设置相应样式
  document.querySelector(".editbox").style.overflow = "visible";
  document.querySelector(".editbox").style.border = "none";
  document.getElementById("elInput").style.border = "1px solid #409eff";

  // 为其绑定监听文本变化的事件
  document
    .getElementById("elInput")
    .addEventListener("DOMCharacterDataModified", this.DonEveryChange);

  // 全局绑上粘贴监听事件
  document.addEventListener("paste", this.pasteValue);

  // 为编辑器添加新的键盘弹起事件
  document
    .getElementById("elInput")
    .addEventListener("keyup", this.handleKeyUpEvent);
},
```
#### 文本变化
DOMCharacterDataModified 事件在文本节点的值发生变化的时候触发，触发时通过 getSelection 获取最新的文本值，做数据交互等处理。
```javascript
//  div里面的内容每次发生变化
DonEveryChange: debounce(function () {
  var searchStr = "";
  var selection = getSelection();
  var emtypIndex = [];

  for (let i = 0; i < selection.anchorNode.data.length; i++) {
    // 拿取当前光标所在行的所有空格下标
    if (selection.anchorNode.data[i] == " ") {
      emtypIndex.push(i);
    }
  }
  // 如果字符内没有空格，直接传
  if (emtypIndex.length == 0) {
    searchStr = encodeURI(
      selection.anchorNode.data.slice(0, selection.anchorOffset)
    );
  } else {
    if (/(?<=\|\s)[\w\(\)-_]+/.test(selection.anchorNode.data)) {
      // 如果是 管道符+空格 单词的形式，需要第二个空格后的单词，如（| stats count），此时需要stats。
      searchStr =
        selection.anchorNode.data.match(/(?<=\|\s)[\w\(\)-_]+/)[0];
    } else {
      // 都没有则说明是第一行index=，把空格去掉即可
      searchStr = encodeURI(selection.anchorNode.data.replace(/\s*/g, ""));
    }
  }

  sysConfig.syntaxTips({ context: searchStr }).then((res) => {
    this.showallList = res.data;
    this.showListDetial = this.showallList[0] || "";
  });
  this.upDowmIndex = 0;
  var lis = document.querySelectorAll(".showlis");
  lis.forEach((li) => {
    li.classList.remove("showliActive");
  });
  document.querySelector(".showeditbox").style.display = "flex";
  document.querySelector(".showeditbox").style.border = "1px solid #409eff";
  document.querySelector(".showall").style.borderRight =
    "1px solid #409eff";
}),
```
#### 粘贴事件
直接复制粘贴使用即可。
```javascript
pasteValue(e) {
  e.stopPropagation();
  e.preventDefault();
  var text = "",
    event = e.originalEvent || e;

  if (event.clipboardData && event.clipboardData.getData) {
    text = event.clipboardData.getData("text/plain");
  } else if (window.clipboardData && window.clipboardData.getData) {
    text = window.clipboardData.getData("Text");
  }

  if (document.queryCommandSupported("insertText")) {
    document.execCommand("insertText", false, text);
  } else {
    document.execCommand("paste", false, text);
  }
},
```
### 失焦
```javascript
editblur() {
  // 移除聚焦时设置的样式和类名
  document.querySelector(".editbox").style.overflow = "hidden";
  document.querySelector(".editbox").style.border = "1px solid #409eff";
  document.getElementById("elInput").style.border = "none";
  document.querySelector(".showeditbox").style.border = "none";
  document.querySelector(".showall").style.border = "none";
  var lis = document.querySelectorAll(".showlis");
  lis.forEach((li) => {
    li.classList.remove("showliActive");
  });

  // 移除全局绑定的粘贴事件
  document.removeEventListener("paste", this.pasteValue);

  // 数组清空
  this.showListDetial = "";
  this.showallList = "";
},
```
### 键盘弹起

1. 记录编辑框每次最后编辑弹起的光标对象
2. 处理输入款键盘事件
```javascript
editdivKeyUp(e) {
  this.lastRange = getSelection().getRangeAt(0);
},
```
```javascript
handleKeyUpEvent(event) {
  switch (event.code) {
    case "ArrowDown":
      this.handleKeyDown();
      break;
    case "ArrowUp":
      this.handleKeyUp();
      break;
  }
},
```
## 总结
### DOM变动事件的用法
DOM2级的変动事件是为XML或html的DOM设计的，不特定于某种语言。变动事件的分类有7种：

1. DOMSubtreeModified：在DOM结构中发生任何变化时触发；
2. DOMNodeInserted：在一个节点作为子节点被插入到另一个节点中时触发；
3. DOMNodeRemoved：在节点从其父节点中被移除时触发；
4. DOMNodeInsertedIntoDocument：在一个节点被直接插入文档中或者通过子树间接插入文档后触发。在 DOMNodeInserted 之后触发；
5. DOMNodeRemovedFromDocument：在一个节点被直接从文档中删除或通过子树间接从文档中移除之前触发。在 DOMNodeRemoved 之后触发。
6. DOMAttrModified：在特性被修改之后触发；
7. DOMCharacterDataModified：在文本节点的值发生变化的时候触发。
### 粘贴事件
可以用js给页面中的元素绑定 paste 事件的方法，当用户鼠标在该元素上或者该元素处于 focus 状态，绑定到 paste 事件的方法就运行了。
绑定的元素不一定是 input ，普通的 div 也是可以绑定的，如果是给 document 绑定了，就相当于全局了，任何时候的粘贴操作都会触发。
粘贴事件提供了一个 clipboardData 的属性，如果该属性有 items 属性，那么就可以查看 items 中是否有图片类型的数据了。
