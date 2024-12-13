# j-vxe-table搭配其他组件

`j-vxe-table` 是 `jeecg-boot` 基于`vxe-table`组件开发的自定义组件，在弹窗组件中引入一个子表单，效果如下图所示：

![ijiFXF.png](https://i.328888.xyz/2023/04/04/ijiFXF.png)

官方文档指路：[JVXETable 文档](http://doc.jeecg.com/2043991) 。

## 类型

`j-vxe-table` 表格中列数据是由 `column` 参数进行配置，如标题 `title` 、每列对应字段 `key` （传参时每列的字段由 `key` 决定）、默认值 `defaultValue` 以及类型 `type` 。

如上图所示，从左往右的类型依次为输入框 `input` 、输入框 `input` 、在线报表 `popup` 、输入框 `input` 、数字输入框 `inputNumber` 等。

用户的需求为点击设计的报表，选择后不再单纯的显示效果图名称，而是显示相对应的效果图。

因此需要使用到组件的插槽。

## 插槽

阅读官方文档可知，需要把插槽类型

- 类型：`JVXETypes.slot` 。
- 参数：`slotName`：**【必填】** slot的名称，根据该字段做具名插槽。

## 使用

设置插槽以及名称：

```js
{
  title: '设计',
  key: 'designName',
  type: JVXETypes.slot,
  slotName: 'img_url',
},
```

使用插槽动态判断当前是显示效果图还是输入框：

```html
<template v-slot:img_url="props">
  <!-- props.row.designImg-->
  <a-input v-if='!productImg[props.index]' placeholder="请选择产品设计" @click='showSelectFn(props)' />
  <img v-else @click='showSelectFn(props)' :src='$SN_DESIGN_BASE_IMG + productImg[props.index]' alt=''>
   
  <!-- 设计选择的在线报表（更换为自己的组件即可，去掉部分与本案例无关的属性，让效果看起来更直观） -->
  <SelectPopup ref="selectDesignPopupRef" :value="productImg[props.index]" :selected-items="productId" @confirm="(e) => handleOkConsultDesign(e, props)" modalTitle="选择产品设计" />
</template>
```

`prop` 为当前行的数据，部分数据如下图所示：

![im5oV5.png](https://i.328888.xyz/2023/04/10/im5oV5.png)

可以看到，当前行数据会保存在 `prop` 下的 `row` 对象内。

阅读更深层次的源码，发现其通过 `mixins` 封装保存每一列的数据到 `props` 对象内，依据同名变量中本地文件的变量优先级高于 `mixins` 文件内的变量，可以设置一个变量对象 `props` ，把修改后的值保存到 `props` 内。

> 保存到 `props` 变量内而不是直接保存到传参内还有一个好处，如果用户点击新增多行，然后修改非最后一行的数据，修改的数据只会保存到最后一行中。

页面回显的图片数据则另外保存到一个数组中，，保存依据为当前操作的是哪一行的表单。通过 `props.index` 即可操作。

```js
handleOkConsultDesign(record, props) {
  // 保存数据到 props 中
  this.props.row.designName = record[0].name
  this.props.row['designImg'] = record[0].img_url
  this.props.row['designId'] = record[0].id
    
  // 保存相应的图片和id到数组中做前端回显
  this.$set(this.productImg, this.props.index, record[0].img_url)
  this.$set(this.productIds, this.props.index, record[0].id)
    
  // 操作会导致row对象内生成一个id，格式为 row_，把它去除
  if (this.props.row.id && this.props.row.id.indexOf('row_') !== -1) delete this.props.row.id
},
```

## 拓展

一开始使用 `j-vxe-table` 组件时看文档以为他新增时数据保存到 `dataSource` 数组内，在那里操作数据好一会发现没有数据可操作，点击底层代码后才得知，他的原理是点击确定按钮后通过 `Object.ossign` 把数据合并传参，点击编辑后才把数据赋值给 `dataSource` 做回显操作。