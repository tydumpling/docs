---
title 测试页
---
# 测试页

点击上一题前往上一题，点击下一题前往下一题，最后一道题提交测试。看到效果第一时间考虑的是该如何布局才能更简便呢？（以下思路以及代码由CharHua同事提供）

`uniapp` 有一个内置组件 `swiper` ，滑块视图容器。一般用于左右滑动或上下滑动，比如`banner`轮播图。注意滑动切换和滚动的区别，滑动切换是一屏一屏的切换。`swiper`下的每个`swiper-item`是一个滑动切换区域，不能停留在2个滑动区域之间。详情可前往官方文档 [swiper](https://uniapp.dcloud.net.cn/component/swiper.html#swiper) 查看。

**属性说明**

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `indicator-dots` | `Boolean` | `false` | 是否显示面板指示点 |
| `current` | `Number` | 0 | 当前所在滑块的 index |
| `current-item-id` | `String` |  | 当前所在滑块的 item-id ，不能与 `current` 被同时指定 |
| `@change` | `EventHandle` |  | `current` 改变时会触发 `change` 事件，`event.detail = {current: current, source: source}` |

滑块正好符合测试题上下题切换的需求，每一个 `swiper-item` 为一道题目，切换题目即触发 `change` 事件切换到相邻的滑块。

整体代码如下所示。

```vue
<script setup>
	const titleList = ref([]) // 试题数组
	const initTopic = async (id) => {
		const res = await getTestList(id)
		console.log(res)
		if (res.code) {
			titleList.value = res.result
		}
	}
	onLoad((val) => {
		initTopic(val.id)
	})

	/*swiper配置*/
	let swiperCurrent = ref(0);

	/**
	 * @description 切换题目
	 * @param e Number 题号
	 */
	const onSwiperChange = e => {
		swiperCurrent.value = e.detail.current;
	};

	/**
	 * @description 点击切换题目
	 * @param e Number e=1,上一题，e=2下一题
	 */
	const handleClickCutTopic = async e => {
		switch (e) {
			case 1:
				if (swiperCurrent.value === 0) {
					return;
				} else {
					swiperCurrent.value = swiperCurrent.value - 1;
				}
				break;
			case 2:
				// 最后一题，提交测试
				if (swiperCurrent.value == newAnswerOptList.value.length - 1) {
				} else {
					swiperCurrent.value = swiperCurrent.value + 1;
				}
				break;
		}
	}
</script>

<template>
		<view class="examination-program">
			<view class="exam-main-area">
				<swiper class="topic-swiper" @change="onSwiperChange" :current="swiperCurrent">
					<swiper-item class="topic-swiper-item" v-for="(topicItem, topicIndex) in newAnswerOptList" :key="topicItem.id">
						<view class="topic-item-page-select">
							<!--题目内容-->
							<view class="topic-question-title">
								<text>【{{ swiperCurrent + 1 }}/{{ newAnswerOptList.length }}】</text>
								<text>{{ topicItem.topicTitle }}</text>
							</view>
							<!--选项-->
							<view class="topic-answer-option">
								<template v-for="(answerItem, answerIndex) in topicItem.itemVos">
									<view :class="{'answer-option-item': true, 'answer-option-item-active': answerItem.isActive}" @tap.stop="onCheckAnswerItem(topicIndex, answerIndex, answerItem)">
										<!--选项内容-->
										<text>{{ answerItem.itemNo }}、{{ answerItem.itemTitle }}</text>
										<uni-icons type="checkmarkempty" size="24" color="#4790DE" v-show="answerItem.isActive"></uni-icons>
									</view>
								</template>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<!-- 底部按钮 -->
			<view class="exam-footer-area">
				<view class="footer-page-main">
					<view class="footer-prev" @click="handleClickCutTopic(1)">
						<uni-icons type="arrow-left" size="24" color="#999999" v-show="swiperCurrent > 0">
						</uni-icons>
						<text class="footer-text-margin-left">{{ swiperCurrent == 0 ? '当前第一题' : '上一题' }}</text>
					</view>

					<view class="footer-next" @click="handleClickCutTopic(2)">
						<text
							class="footer-text-margin-right">{{ swiperCurrent == newAnswerOptList.length - 1 ? '提交' : '下一题' }}</text>
						<uni-icons type="arrow-right" size="24" color="#FFFFFF"
							v-show="swiperCurrent < newAnswerOptList.length"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
```
