---
title sku商品规格
---
# sku商品规格
工具类商品提供 `sku` 规格搜索，效果如下图：

![iMS8Xv.png](https://i.imgloc.com/2023/05/03/iMS8Xv.png)

每项分类都有几个选项，选择完相应的规格后会显示对应的图片、价格、库存数量等。

## 数据返回

查看后端返回的数据，根据后端返回的数据来做页面渲染与事件点击操作。

### 商品规格

![iMSuxU.png](https://i.imgloc.com/2023/05/03/iMSuxU.png)

后端返回一个数组对象，对象内返回相应的数据：

- `sku` ：相应的规格数组，后续用于判断选择的规格是否与之相等
- `cover` ：该规格对应的商品图
- `stock` ：该规格对应的库存
- `salesPrice` ：该规格对应的售价
- `goodsId` ：该规格商品 `id` 

### 型号

[![p9gc9hR.png](https://s1.ax1x.com/2023/05/15/p9gc9hR.png)](https://imgse.com/i/p9gc9hR)

型号是数组对象的形式，通过 `v-for` 遍历渲染；子选项则遍历其属性 `values` 即可。

## 页面实现

先把页面布局实现。

本项目是使用 `uview` 组件库。根据效果图，使用的是 `u-popup` 弹出层，其分为上下两部分。

上部分显示商品相关规格信息以及当前用户已选择的规格。

下部分则根据规格与分类渲染布局。后续点击相应规格后保存其规格内容，根据数组内是否有该规格名称来动态添加类名。

```html
<view class="auto">
	<view class="dtoList" v-for="(item, index) in props.data" :key="item.id">
		<view class="name">{{item.name}}</view>
		<view class="list">
			<view class="choseItem" :class="{'active': choseNames.includes(childItem.name)}"
				v-for="(childItem, childIndex) in item.values" :key="childItem.id"
				@click.stop="handleChoseFn(childItem, index)">
				{{childItem.name}}</view>
		</view>
	</view>
</view>
```

## 选择规格

点击规格时做以下步骤：

1. 传入名称与索引
2. 判断当前索引是否有选择的内容，没有则存到数组对应的索引，有内容则判断内容是否相等，相等则删除该索引的规格，不等则替换内容
3. 判断选择规格的数组长度与规格数组长度是否相等，相等则循环上图 `goods` 数组，判断每一项的 `sku` 数据是否与选择的规格数组数据一致。一致则返回该数据对象

```js
// 点击选项选择商品操作
const choseNames = ref([]) // 选中的名称
const btnWord = ref('请选择规格') // 按钮的文本
const choseId = ref('') // 最终选择的商品id
const handleChoseFn = (item, index) => {
	// 如果该规格已选,则去除
	if (choseNames.value[index] && item.name === choseNames.value[index]) {
		choseNames.value[index] = ''
		btnWord.value = '请选择规格'
	} else {
        // 未选择的情况下把该索引设为该值
		choseNames.value[index] = item.name
		if(choseNames.value.length === props.data.length) {
            // 由于存在取消规格的情况，也存在用户从后面选起的可能，因此判断每一项都要有内容
            if(choseNames.value.includes(undefined) || choseNames.value.includes(null) || choseNames.value.includes('')) return
			let obj = props.saleList.find(item => {
				let arr = JSON.parse(item.sku)
				for(let i = 0; i < arr.length; i++) {
					if(!choseNames.value.includes(arr[i])) break // 只要有一项没在sku数组内，就结束当前循环判断开始下一次的循环判断
                      // 长度一致且判断到最后一项（即全部相等）则返回该对象
					if(arr.length === choseNames.value.length && i === arr.length - 1) {
						return item
					}
				}
			})
			
             // 如果有数据，返回想要的数据
			if(obj) {
				showCover.value = obj.cover
				showMoney.value = obj.salesPrice
				showStock.value = obj.stock
				btnWord.value = obj.stock ? '立即购买' : '库存不足'
				choseId.value = obj.id
				return
			}
            
             // 否则返回库存不足等占位符
			btnWord.value = '库存不足'
			showCover.value = '-'
			showMoney.value = '-'
			showStock.value = 0
		}
	}
}
```

## 总结

主要思路为获取用户选择的规格，首先判断每一项是否有内容，只要有一项没有内容就 `return` 阻止后续操作。

如果三项都有值了，则判断选择的值是否在 `sku` 数组中，只要有一项不存在，直接 `break` 跳过当前循环，开始下一次的循环，都符合要求则返回相对应的数据。

如果循环结束都没有该规格，视为不存在该规格，提示库存不足即可。



