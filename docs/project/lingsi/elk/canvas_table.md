# Canvas 绘制表格
原理：通过第三方插件 canvas-table 配合画布 canvas 实现表格图的绘制。
## 下载插件
```shell
yarn add canvas-table
```
> 注意：
这里可能会报错没有模块，根据提示下载相对应的模块即可。

## 引用
```javascript
import { CanvasTable } from "canvas-table";
```
## 使用
### 数据源
数据源是一个二维数组，如下所示。
```javascript
const data = [
  ["Alfreds Futterkiste", "Maria Anders", "$400", "Germany"],
  ["Centro comercial Moctezuma", "Francisco Chang", "$200", "Mexico"],
  ["Ernst Handel", "Roland Mendel", "$1400", "Austria"],
  ["Island Trading", "Helen Bennett", "$600", "UK"],
  ["Laughing Bacchus Winecellars", "Yoshi Tannamuri", "$800", "Canada"],
  ["Magazzini Alimentari Riuniti", "Giovanni Rovelli", "$100", "Italy"]
];
```
> 注意：
封装插件的人写法有问题，数组内的值必须是字符串，不能是数值型，不然会出错无法渲染。

### 列名称
创建一个数组对象，每个对象的 `title`即列的名称。
```javascript
const columns = [{
  title: "Name"
 },
 {
   title: "Contact"
 },
 {
   title: "Expense",
 },
 {
   title: "Country"
 }
];
```
### 样式
可设置的样式如下所示，表格颜色，表头、行、表格标题、表脚等。
```javascript
const options = {
  borders: {
    table: {
      color: "#aaa",
      width: 1,

    }
  },
  header: {
    color: 'red',
    fontSize: 24,
    textAlign: 'center'
  },
  cell: {
    fontSize: 24,
    textAlign: 'center'
  },
  fit: true,
  title: {
    text: "Expense Report"
  },
  subtitle: {
    text: '副标题'
  }
};
```
### 事件
```javascript
const events =
{
  cellCreated: (canvas, x, y, data: { cellIndex, rowIndex }) => console.log({ canvas, x, y, cellIndex, rowIndex }),
  fadersCreated: (canvas, x, y) => console.log({ canvas, x, y }),
  headerCreated: (canvas, x, y) => console.log({ canvas, x, y }),
  rowCreated: (canvas, x, y, { rowIndex }) => console.log({ canvas, x, y, rowIndex }),
  rowsCreated: (canvas, x, y) => console.log({ canvas, x, y }),
  subtitleCreated: (canvas, x, y) => console.log({ canvas, x, y }),
  tableBordersCreated: (canvas, x, y) => console.log({ canvas, x, y }),
  tableCreated: (canvas, x, y) => console.log({ canvas, x, y }),
  titleCreated: (canvas, x, y) => console.log({ canvas, x, y }),
};
```
### 渲染页面

1. 获取结构中的画布
2. 收集表格图的数据
3. 绘制表格
```javascript
const canvas = document.getElementById("canvas");
```
```javascript
const config = {
  data,
  columns,
  options,
  events
};
```
```javascript
const ct = new CanvasTable(canvas, config);
let cc = ct.generateTable();
console.log(cc)
```

