---
title 详情页
---

# 详情

## 音频详情

音频详情页需要一个播放音频的控件，在最开始的时候使用的是 `uniapp` 提供的 `audio` 组件，在app上运行无误，但是在h5上运行时报错，发现其组件停止维护。根据项目经理的要求，为了不给后续埋雷，改成使用 API  ` uni.createInnerAudioContext()` 的形式。

### 音频组件

#### 初步实现

##### 思路

音频 API 详情查看 [音频组件控制](https://uniapp.dcloud.net.cn/api/media/audio-context.html#createinneraudiocontext) 官方文档。该方法用于创建并返回内部 audio 上下文 `innerAudioContext` 对象。

我们需要实现下方的效果：

[![pCoPrRS.png](https://s1.ax1x.com/2023/07/17/pCoPrRS.png)](https://imgse.com/i/pCoPrRS)

我们需要音频的总时长、当前播放的时长、进度条、暂停播放的控制等。

首先查看文档的代码示例，示例代码如下：

```js
const innerAudioContext = uni.createInnerAudioContext();
innerAudioContext.autoplay = true;
innerAudioContext.src = 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3';
innerAudioContext.onPlay(() => {
  console.log('开始播放');
});
innerAudioContext.onError((res) => {
  console.log(res.errMsg);
  console.log(res.errCode);
});
```

从示例代码可以得知，使用 `uni.createInnerAudioContext()` 方法创建一个音频对象，通过 `src` 属性接收音频的路径，`autoplay` 为是否自动播放，`onPlay` 开始播放后触发回调函数的方法，`onError` 音频发生错误触发回调函数的方法······

查看 `innerAudioContext` 对象属性列表和方法列表，找到了我们需要的几个参数：

- `currentTime` ：当前音频的播放位置（单位：s），只有在当前有合法的 `src` 时返回。在音频播放事件内也要实时获取数据并赋值。
- `paused` ：当前是是否暂停或停止状态，`true` 表示暂停或停止，`false` 表示正在播放。通过该状态判断按钮的点击事件是触发播放还是暂停。
- `duration` ：当前音频的长度（单位：s），只有在当前有合法的 `src` 时返回，需要在 `onCanplay` 中获取。该值获取到后不再变动，不需要二次赋值。
- `play` ：音频播放方法。
- `pause` ：音频暂停方法。
- `onCanplay` ：音频加载完可以开始播放后触发的回调函数，在该回调函数中获取音频的总时长。（回调函数是重点，后面要考）
- `onPlay` ：音频播放事件，传入一个回调函数，开始播放后触发该回调函数。
- `onPause` ：音频暂停事件，传入一个回调函数，暂停播放后触发该回调函数。
- `onTimeUpdate` ：音频播放进度更新事件，传入一个回调函数，播放音频时触发该回调函数，此时音频对象的 `currentTime` 属性是最新的音频时间，因此要在这里实时做赋值操作。

总结一下，在页面刚进入时获取音频路径，创建音频上下文对象，把音频路径赋值给其 `src` 属性。在其 `onCanplay` 回调中获取其总时长。由于可以开始播放后会触发 `onCanplay` 事件，因此可以先创建一个变量 `loading` ，初始值为 `true` ，等触发`onCanplay` 回调后再改为 `false` ，表示已加载完毕。

创建一个变量 `playStatus` 用于保存当前音频的播放状态。给音频上下文文件添加回调函数：开始播放、错误、停止、音频进度发生改变。其中音频进度发生改变时实时把值赋值给音频当前时长的变量。

当页面退出后销毁该音频。

##### 代码

```vue
<script setup>
	import {
		onBeforeUnmount,
		ref,
	} from "vue";
	import {
		onHide,
		onLoad,
	} from '@dcloudio/uni-app';
	import Loading from "@/components/audioControl/component/Loading";
	import useMineStore from '@/stores/modules/mine';
	import {
		storeToRefs
	} from 'pinia'

	const mineStore = useMineStore()
	const {
		saveMusic
	} = storeToRefs(mineStore)

	//音频信息
	//当前音频时长
	let duration = ref(-1);
	//当前播放时间
	let currentTime = ref(0);
	//当前停止状态 true为停止 false为播放
	let playStatus = ref(false);

	//创建音频上下文
	let context = ref({});
	let loading = ref(false)

	onLoad((val) => {
		context.value = uni.createInnerAudioContext()
		loading.value = true
		context.value.src = saveMusic.value.playUrl;
		currentTime.value = context.value.currentTime;
		playStatus.value = context.value.paused;
		context.value.onCanplay(() => {
			duration.value = context.value.duration;
			console.log("音频播放控件准备好了", context.value.buffered, duration.value);
			loading.value = false
		});
		//音频错误时
		context.value.onError((res) => {
			uni.showToast({
				title: res.errMsg,
				icon: 'none'
			})
			loading.value = false
		});
		context.value.onTimeUpdate(() => {
			timeUpdateFn()
		});
		
		context.value.onEnded(() => {
			ended()
		})
	})

	//点击播放暂停
	const onPlay = () => {
		if (context.value.paused) {
			changeType.value = true
			//播放
			context.value.play()
		} else {
			changeType.value = false
			//暂停
			context.value.pause()
		}
	};
    
	//拖动进度条时
	let seekChangeType = ref(false);
	const changingAudioProgress = (e) => {
	};
	//进度条拖动结束
	const changeAudioProgress = (e) => {
	};

	// 音频播放结束后
	const ended = async () => {
		context.value.stop()
	}

	//音频进度改变时，此回调有原生BUG，音频停止后会继续执行
	const timeUpdateFn = () => {
		currentTime.value = context.value.currentTime
	}
    
    onBeforeUnmount(() => {
        context.value.destroy() // 退出后销毁该音频
    })
</script>

<template>
	<view>
		<!-- 标题 -->
		<view class="title">{{saveMusic.title}}</view>
		
		<view class="music">
			<view class="music-box">
				<!-- 进度条 -->
				<view class="audio-control-page">
					<slider :min="0" :max="saveMusic.totalDuration ? saveMusic.totalDuration.toFixed(1) : duration.toFixed(1)" activeColor="#e1a452" backgroundColor="#e2e2e2" block-color="#fff" block-size="12" :value="currentTime.toFixed(1)" :step="0.1" @change="changeAudioProgress" @changing="changingAudioProgress" :disabled='loading' />
				</view>
				<!--时间显示-->
				<view class="audio-time">
					<template v-if="loading">
						<text>音频加载中..</text>
					</template>
					<template v-else>
						<text class="">{{ useComputeAudioTime(currentTime) }}</text>
						<text class="">{{ useComputeAudioTime(saveMusic.totalDuration ? saveMusic.totalDuration : duration) }}</text>
					</template>
				</view>
			</view>
		
			<!-- 播放按钮区域 -->
			<view class="play-btn">
				<!--  loading  -->
				<view class="audio-play-btn" v-if="loading">
					<Loading :loading="true"></Loading>
				</view>
				<view class="audio-play-btn" v-else>
					<!--   暂停   -->
					<u-icon name="pause" size="50" v-show="!playStatus" @click="onPlay"></u-icon>
		
					<!--   开始   -->
					<u-icon name="play-right-fill" size="50" v-show="playStatus" @click="onPlay"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>
```

#### 进度条拖拽

##### 思路

现在基于第一版做功能升级。市面上的音频功能大多都可以通过拖拽进度条的形式改变当前音频播放的进度。进度条组件上方的示例代码中已存在，因此不再二次展示。

音频的进度条可以使用 `uniapp` 官方提供的 `slider` 进度条组件，官网文档指路 [slider](https://uniapp.dcloud.net.cn/component/slider.html#slider) 。其提供的属性和方法如下所示：

| 属性名          | 类型        | 默认值               | 说明                                                         |
| :-------------- | :---------- | :------------------- | :----------------------------------------------------------- |
| min             | Number      | 0                    | 最小值，音频最小默认为0                                      |
| max             | Number      | 100                  | 最大值，把音频的时长赋值给他即可                             |
| step            | Number      | 1                    | 步长，取值必须大于 0，并且可被(max - min)整除，取默认值1，无需更改 |
| value           | Number      | 0                    | 当前取值，把当前音频播放的进度currentTime赋值过去            |
| activeColor     | Color       | 各个平台不同，详见下 | 滑块左侧已选择部分的线条颜色                                 |
| backgroundColor | Color       | #e9e9e9              | 滑块右侧背景条的颜色                                         |
| block-size      | Number      | 28                   | 滑块的大小，取值范围为 12 - 28                               |
| block-color     | Color       | #ffffff              | 滑块的颜色                                                   |
| show-value      | Boolean     | false                | 是否显示当前 value                                           |
| @change         | EventHandle |                      | 完成一次拖动后触发的事件，event.detail = {value: value}      |
| @changing       | EventHandle |                      | 拖动过程中触发的事件，event.detail = {value: value}          |

可以看到，其提供了两个方法：正在拖动中的 `@changing` 和拖动完毕的 `@change` 。打印他的参数，输出的数据如下所示：

```js
拖动进度条时：{
    "type": "changing",
    "timeStamp": 0,
    "target": {
        "id": "",
        "dataset": {
            "v-4fc88c49": "",
            "v4fc88c49": ""
        },
        "offsetTop": 10,
        "offsetLeft": 29
    },
    "currentTarget": {
        "id": "",
        "dataset": {
            "v-4fc88c49": "",
            "v4fc88c49": ""
        },
        "offsetTop": 10,
        "offsetLeft": 29
    },
    "detail": {
        "value": 170.3
    }
}

停止拖动进度条：{
    "type": "change",
    "timeStamp": 0,
    "target": {
        "id": "",
        "dataset": {
            "v-4fc88c49": "",
            "v4fc88c49": ""
        },
        "offsetTop": 10,
        "offsetLeft": 29
    },
    "currentTarget": {
        "id": "",
        "dataset": {
            "v-4fc88c49": "",
            "v4fc88c49": ""
        },
        "offsetTop": 10,
        "offsetLeft": 29
    },
    "detail": {
        "value": 170.3
    }
}
```

对象中的 `detail` 下的 `value` 值正是当前拖拽的进度，因此获取到这个值，并赋值给音频文件对象即可。改变音频进度的方法查阅了官方文档后找到以下的方法：

| 方法 | 参数     | 说明                   |
| :--- | :------- | :--------------------- |
| seek | position | 跳转到指定位置，单位 s |

把方才获取的拖拽音频最新进度传给该方法即可。

##### 代码

```js
//拖动进度条时
const changingAudioProgress = (e) => {
	currentTime.value = e.detail.value;
};
//进度条拖动结束
const changeAudioProgress = (e) => {
	context.value.startTime = e.detail.value;
	context.value.seek(e.detail.value);
};
```

##### 优化

到刚刚那一步功能已经完成，运行项目也有效果。只不过有一个小 Bug：当我慢慢的拖拽进度条时，能够看到进度条在 “我拖拽的进度位置” 和 “当前音频播放到的位置” 来回抽动，且因为这个抽动有时用户的拖拽还不成功，不利于用户体验。

判断一下这个 BUG 是如何产生的，当音频正在播放时进度条会被实时赋值变化，我们拖拽进度条时进度条会跟着我们拖拽的进度变化。因此两个变化发生冲突，在拖拽时就会发生来回抽动的现象。

知道 BUG 产生的原因修改起来就容易多了，可以设置一个变量，初始值为 `false` ，表示当前并没有拖拽进度条。如果触发了拖拽事件，改为 `true` ，在结束拖拽后再改为 `false` 。而进度条改变 `onTimeUpdate` 方法则添加一个判断，只有不在拖拽的时候才实时赋值修改进度。

```js
//拖动进度条时
let seekChangeType = ref(false);
const changingAudioProgress = (e) => {
	currentTime.value = e.detail.value;
	seekChangeType.value = true
};
//进度条拖动结束
const changeAudioProgress = (e) => {
	seekChangeType.value = false
	context.value.startTime = e.detail.value;
	context.value.seek(e.detail.value);
};
const timeUpdateFn = () => {
	if (!context.value.paused && !seekChangeType.value) {
		currentTime.value = context.value.currentTime
	}
}
```

现在再运行查看，发现已经有效果了。

#### 次数循环

客户那边又提出一个新的需求：要求能够提供循环播放功能，有三种选择，单次播放、循环三次和循环五次。

查看音频对象的文档，找到它有提供一个 `loop` 属性，是否开启循环播放。但是没有限制循环的次数，且用户切换循环方式时设置也不方便。

因此另寻蹊径，设置一个变量存储用户想要循环的次数，开启播放音频。当触发音频的停止事件时判断次数变量是否小于等于1，如果不符合要求，说明还没循环完，重新调用一次播放事件，并让变量自减一，直到变量等于一，表示循环播放结束。

```js
/* 
循环播放
 loopNum：当前循环播放的次数
 loopNumAll：共需要循环播放的次数
 loopTitle：循环播放的标题
 handleSheetFn：点击选择循环播放
 */
const loopNum = ref(0)
const loopNumAll = ref(0)
const loopTitle = ref('单次播放')
const handleSheetFn = index => {
	list.value.forEach(item => {
		item.color = '#000'
	})
	switch (index) {
		case 0:
			loopNumAll.value = 0
			list.value[0].color = '#e9a97e'
			loopTitle.value = '单次播放'
			break;
		case 1:
			loopNumAll.value = 2
			list.value[1].color = '#e9a97e'
			loopTitle.value = '循环3次'
			break;
		case 2:
			loopNumAll.value = 4
			list.value[2].color = '#e9a97e'
			loopTitle.value = '循环5次'
			break;
		default:
			break;
	}
	if(context.value.paused context.value.play()
}

// 音频播放结束后
const ended = async () => {
	const duration = currentTime.value
	if (loopNum.value < loopNumAll.value) {
		loopType.value = false
		loopNum.value += 1
		context.value.play()
	} else {
		loopNum.value = 0
		context.value.stop()
		loopType.value = true
	}
}
```

#### 退出播放（实现失败）

由于我们在页面销毁事件中调用 `destroy()` 方法销毁该实例对象，因此退出音频详情页面后音频就被销毁，无法继续播放，客户要求即使退出当前页面也能继续播放。

一开始我的想法很简单，只要不销毁当前实例不就好了嘛，把 `destroy()` 方法注释，运行，发现退出后音频继续播放，正以为可以交差了，重新进入音频详情页面一看，发现他虽然在播放，但是进度条变为从0开始且没有在变化、播放状态为未播放。

反复打 `log` 调试，最后发现退出页面重新进入后 `onCanplay` 方法的回调函数重新触发，立刻反应过来，进入这个页面后重新创建了一个音频上下文对象，旧的音频上下文对象没有销毁，所以还在播放，而此时页面上是新的音频对象，所以是未播放状态。

于是顺着这个逻辑，当退出该音频页面时我在 `pinia` 内保存当前的音频对象和音频详情的数据，进入页面后判断当前音频详情的 `id` 是否和 `pinia` 内保存的相等，相等则说明回到旧的音频页，不创建新的上下文而是使用旧的音频对象。

```js
onLoad((val) => {
	playId.value = val.id
	if (!saveMusic.value.id || saveMusic.value.id !== playId.value) {
		// 否则获取最新的context音频
		context.value = uni.createInnerAudioContext()
		loading.value = true
		context.value.src = saveMusic.value.playUrl;
		currentTime.value = saveMusic.value.auditionTime ? Math.round(context.value.currentTime) : context.value.currentTime;
		playStatus.value = context.value.paused;
	} 
	else {
		// 如果保存的正在听的数据与本数据一致，且他是正在播放的状态，则拿保存的context音频
		context.value = saveMusic.value.context
		duration.value = context.value.duration; // 如果是获取缓存的值则不会走下面context.value.onCanplay方法，无法给duration赋值
	}
	context.value.onCanplay(() => {
		duration.value = context.value.duration;
		console.log("音频播放控件准备好了", context.value.buffered, duration.value);
		loading.value = false
	});
	//音频错误时
	context.value.onError((res) => {
		uni.showToast({
			title: res.errMsg,
			icon: 'none'
		})
		loading.value = false
	});
	//音频进度改变结束
	context.value.onSeeked(() => {
		onPlayAudio();
	})
	context.value.onTimeUpdate(() => {
		timeUpdateFn()
	});
	
	context.value.onEnded(() => {
		ended()
	})
	console.log(context.value)

	// 首页点击小图标销毁音频
	uni.$once('监听销毁按钮点击事件', () => {
		context.value.destroy();
	})
})
```

现在可以播放，且进度条正常行走。

本以为能够交差了，测试和我说当重复进入该页面后就会卡顿，我尝试了一下到第三次已经明显的卡了，到第六次直接点不动了，打印音频对象结果如下所示：

[![p9hWor9.png](https://s1.ax1x.com/2023/05/19/p9hWor9.png)](https://imgse.com/i/p9hWor9)

可以看到每点击一次他就往里面添加一次函数。还记得吗？在前面介绍的时候我们已经介绍过了，那些方法都是传一个回调函数进去，等那些方法触发后再触发回调。因此越积越多，直到最后内存溢出。

后续又做了其他尝试，比如手动清空再赋值，把那些方法都放进if内，都没有效果。

### 背景音频播放管理

#### 思路与代码

在寻找解决方法时，无意间发现 `uniapp` 提供另外一个背景音频方法 `uni.getBackgroundAudioManager()` ，官网指路 [ uni.getBackgroundAudioManager()](https://uniapp.dcloud.net.cn/api/media/background-audio-manager.html) 。官方描述是这么写的：

> 获取**全局唯一**的背景音频管理器 `backgroundAudioManager`。
>
> 背景音频，不是游戏的背景音乐，而是类似QQ音乐那样，App在后台时，仍然在播放音乐。如果你不需要在App切后台时继续播放，那么不应该使用本API，而应该使用普通音频API[uni.createInnerAudioContext](https://uniapp.dcloud.io/api/media/audio-context)。

刚好符合我们的场景要求，查看其事件方法和属性，与音频组件差异不大，直接使用即可，注意事项贴在下方。

```js
const mineStore = useMineStore()
const {
	saveMusic
} = storeToRefs(mineStore)

// 变量

onLoad((val) => {
	playId.value = val.id
	if (!saveMusic.value.id || saveMusic.value.id !== playId.value) {
		// 一系列的赋值操作
	} else {
		context.value = 旧数据 // 如果保存的正在听的数据与本数据一致，且他是正在播放的状态，则拿保存的context音频
		playStatus.value = context.value.paused // 重新进来后获取到的context.value.paused参数正确，true 表示暂停或停止，false 表示正在播放
		if (context.value.paused) currentTime.value = 之前保存的时间 // 如果是暂停状态出去再进来，初试时间会为0，因此使用之前赋值保存的音频时长
	}
	context.value.onCanplay(() => {
		duration.value = context.value.duration;
		console.log("音频播放控件准备好了", context.value.buffered, duration.value);
		loading.value = false
	});
	// 音频正在播放事件回调
	context.value.onPlay(() => {
		播放的时候保存该音频的id和图片，其他页面做小窗口显示
	});
	//音频错误时
	context.value.onError((res) => {
		uni.showToast({
			title: res.errMsg,
			icon: 'none'
		})
		loading.value = false
	});
	// 音频进度改变事件回调
	context.value.onTimeUpdate(() => {
		timeUpdateFn()
	});
	// 音频结束事件回调
	context.value.onEnded(() => {
		ended()
	})

	// 首页点击小图标销毁音频
	uni.$once('close_play', () => {
		context.value.stop();
	})
})

/*音频控制*/
//播放
const onPlayAudio = async () => {
	context.value.play();
	playStatus.value = false;
};
//暂停
const onPauseAudio = async () => {
	context.value.pause();
	playStatus.value = true;
};
//停止
const onStopAudio = async () => {
	context.value.stop();
	playStatus.value = true;
	currentTime.value = 0;
	context.value.seek(0)
};

/* 
循环播放
 loopNum：当前循环播放的次数
 loopNumAll：共需要循环播放的次数
 loopTitle：循环播放的标题
 handleSheetFn：点击选择循环播放
 */
const loopNum = ref(0)
const loopNumAll = ref(0)
const loopTitle = ref('单次播放')
const handleSheetFn = index => {
	list.value.forEach(item => {
		item.color = '#000'
	})
	switch (index) {
		case 0:
			loopNumAll.value = 0
			list.value[0].color = '#e9a97e'
			loopTitle.value = '单次播放'
			break;
		case 1:
			loopNumAll.value = 2
			list.value[1].color = '#e9a97e'
			loopTitle.value = '循环3次'
			break;
		case 2:
			loopNumAll.value = 4
			list.value[2].color = '#e9a97e'
			loopTitle.value = '循环5次'
			break;
		default:
			break;
	}
	onPlayAudio()
}

//点击播放暂停
const onPlay = () => {
	if (playStatus.value) {
		//播放
		onPlayAudio();
	} else {
		//暂停
		onPauseAudio();
	}
};
//拖动进度条时
let seekChangeType = ref(false);
const changingAudioProgress = (e) => {
	currentTime.value = e.detail.value;
	saveMusic.value.time = e.detail.value
	seekChangeType.value = true
};
//进度条拖动结束
const changeAudioProgress = (e) => {
	seekChangeType.value = false
	context.value.seek(e.detail.value);
};

// 音频播放结束后
const ended = async () => {
	const duration = currentTime.value
	if (loopNum.value < loopNumAll.value) {
		loopType.value = false
		loopNum.value += 1
		onPlayAudio()
	} else {
		loopNum.value = 0
		onStopAudio()
		loopType.value = true
	}
}

/* 
 音频进度改变
 seekChangeType：音频结束拖动
 context.value.paused：音频是否在播放
 如果音频正在播放，值为true；如果正在拖动，值为true，拖动且播放的时候就不改变音频进度条，不然会出现左右反复横跳的情况
 */
const timeUpdateFn = () => {
	if (!context.value.paused && !seekChangeType.value) {
        // 再把数据存储到pinia中，存储当前的时长和音频对象
		currentTime.value = context.value.currentTime
	}
}
```

#### 注意事项

1. 背景音频没有 `onSeeked` 事件，因此需要把它删掉，否则报错
2. 一进入页面默认播放音频，而在 `onCanplay` 中获取其播放状态是 `true` ，未播放，所以此处不获取，直接写死为 `false` 
3. 背景音频组件没有销毁方法，只有停止方法，需要的时候调用停止方法即可

### 循环播放进度条进度不变

由于该事件方法没有 `loop` 方法，在实现循环播放时我采取在停止事件回调中重新调用音频播放的方法，做到循环播放。

然后今天测试发现一个新 BUG ：当音频播放完后重新播放时进度条不走，但是还是在正常播放。

开始排查问题，首先在音频进度条改变的回调中打印当前音频的时长 `currentTime` ，发现他有一直打印，但是值都是0，所以进度条才不变。

找到问题后就要解决问题，百度一番后在 微信问答社区一个提 BUG 的帖子找到有类似的问题和解决方法，附上链接：[InnerAudioContext.onTimeUpdate再次调用不触发](https://developers.weixin.qq.com/community/develop/doc/00068a72a2c588d3c6c8edeac56800) 。

根据回答，在播放事件中添加下面一句代码即可实现，代码如下：

```js
//播放
const onPlayAudio = () => {
    context.value.pause()
    context.value.play();
    playStatus.value = false;
    // ...
};
```

### 代码优化

完成后可以发现代码已经有800行了，因此需要把音频事件方法单独抽离出来，后续也好维护。音频模块有多个页面需要使用，因此放到 `pinia` 中是不错的选择。

在 `pinia` 中创建仓库，导出一个函数，函数中通过 `return` 外部需要使用的方法和变量即可，示例代码如下：

```js
import {
	defineStore
} from "pinia";
import {
	ref
} from 'vue';

//全局可控状态hook
export const useMusicStore = defineStore("music", () => {
	const context = ref(uni.getBackgroundAudioManager())
	// ...

	// 销毁
	const distoryAudioFn = () => {
		saveMusic.value = {}
		context.value.src = ''
		musicFinishFn()
	}

	return {
		context,
		distoryAudioFn,
        // ...
	}
});
```

### 其他功能

#### 播放时长

用户还提出了其他的需求，比如每一个音频售卖的是该音频的播放时长，需要在用户音频暂停、停止时把用户听的时长传过去给后端。

目前整理下来，需要用到的地方有：

1. 用户点击暂停
2. 音频播放完毕
3. 循环播放每一次的结束
4. 用户点击叉号关闭音频

而用户听的时长我一开始通过音频播放的当前时间作为参数传递过去，但是这样出现了一个问题：用户听到30秒，点暂停，传了30过去；用户继续听，听到50点暂停，传了50过去。用户实际上听了50秒，但是传给后端的是80。

我的解决方法是，在音频播放回调函数中开启定时器，当音频播放时让变量自增1，代码如下：

```js
context.value.onPlay(() => {
    if(!timer.value) {
        timer.value = setInterval(() => {
            listerenTime.value += 1
        }, 1000)
    }
})
```

当触发暂停或停止调用接口传完参数后再把参数清0，定时器关闭。只不过这个方法并不优雅，且有一定的秒数误差，暂时没有更好的优化方法。

#### 断网停止

由于要记录用户听的时长，并调用接口传参给后端，因此当用户断网时前端无法调接口。故加了一个断网后停止播放的功能。

思路如下所示：

1. 在音频持续播放时检测当前网络
2. 如果网络中断则停止音频并本地存储音频的时长
3. 下一次联网播放音频时把本地存储的时长加上去

思路分析完毕，接下来着手如何实现。

当音频在播放时，会持续触发 `onTimeUpdate` 回调函数，因此在这上面添加判断。 `uniapp` 提供了 `uni.getNetworkType()` 方法，其中成功回调函数返回 `networkType` 网络类型，有效值如下所示：

|          |                            |              |
| :------- | :------------------------- | :----------- |
| 值       | 说明                       | 平台差异说明 |
| wifi     | wifi 网络                  |              |
| 2g       | 2g 网络                    |              |
| 3g       | 3g 网络                    |              |
| 4g       | 4g 网络                    |              |
| 5g       | 5g 网络                    |              |
| ethernet | 有线网络                   | App          |
| unknown  | Android 下不常见的网络类型 |              |
| none     | 无网络                     |              |

因此只需要判断其是否是 `none` 类型即可。代码如下所示：

```js
// 检测当前是否有网络
const checkNetworkStatus = () => {
	uni.getNetworkType({
		success: function(res) {
			const networkType = res.networkType;
			if (networkType === 'none') {
				// 用户无网络连接
				uni.showToast({
					title: '检测到你的网络未连接，请先连接网络',
					icon: 'none'
				})
				context.value.pause()
			}
		}
	});
}

// 音频进度改变事件回调
context.value.onTimeUpdate(() => {
	checkNetworkStatus()
    //...
});
```

#### 音频下载

免费音频支持用户下载功能，下载功能的实现依靠 `uniapp` 提供的 [uni.downloadFile](https://uniapp.dcloud.net.cn/api/request/network-file.html#downloadfile) 方法。该方法成功后会触发 `success` 函数，返回下载好的临时路径，如下所示。

```js
{
    "tempFilePath": "_doc/uniapp_temp_1672380474492/download/WeChat_0002_1672367513721.mp4",
    "statusCode": 200,
    "errMsg": "downloadFile:ok"
}
```

关闭项目后地址不存在，因此需要搭配 [uni.saveFile](https://uniapp.dcloud.net.cn/api/file/file#savefile) 缓存到本地中。下载成功后文件会保存在 `\Android\data\com.yinguo.....\apps\doc\uniapp_save` 路径的文件夹下。

思路整理：

- `uni.downloadFile` 把文件缓存到临时地址
- `uni.saveFile` 把文件下载到手机内

```js
const downloadMusicFn = () => {
	uni.showLoading({
		title: '下载中，请稍等'
	})
	// 下载临时文件事件
	uni.downloadFile({
		url: 音频地址,
		success: (res) => {
			if (res.statusCode === 200) {
				// 临时文件下载到本地
				uni.saveFile({
					tempFilePath: res.tempFilePath,
					success: function(result) {
						uni.hideLoading()
					}
				});
			}
		}
	});
}
```

### H5适配

#### API选择

应客户与上头要求，该项目不仅需要出安卓与 IOS 版本，还要出一个 H5 版本，在 H5 中 ` uni.getBackgroundAudioManager()` 方法不可使用。

解决方法：

通过 `#ifdef H5` 与 `#ifndef H5` 对是否是 H5 做处理，非 H5 页面就使用 ` uni.getBackgroundAudioManager()` 方法，如果是 H5 页面使用回之前 `uni.createInnerAudioContext()` 方法。

需要注意的是，这两个 API 有部分功能不一致，需要做额外的处理。比如， ` uni.getBackgroundAudioManager()` API 没有 `onSeeked` 事件回调等。

#### 加载顺序

测试在使用 IOS 系统的手机测试 H5 端时，发现一直处于 `loading` 效果。查看代码，代码处理逻辑没问题，一开始开启 `loading` 状态，在 `onCanplay` 回调中关闭。

为了检查是什么问题，我把 `loading` 去掉，发现点击播放按钮触发 `play()` 方法后才触发 `onCanplay` 回调，官方文档也有这么一句话：

播放（H5端部分浏览器需在用户交互时进行）

#### 断网停止

测试在测试的时候发现 IOS 上的 H5 端断网逻辑没有触发，于是开始排查。

打印网络类型时发现，其返回的不是 `none` ，而是 `unknown` ，无论当前是否有连接到网络，因此这个判断无效了（这里我要恶狠狠吐槽一波）

[![pC4cTcq.png](https://s1.ax1x.com/2023/07/14/pC4cTcq.png)](https://imgse.com/i/pC4cTcq)

既然这个方法不能走，那就换一个方法。通过 ChatGPT 发现有 `navigator` 方法可以使用， ChatGPT 是这么介绍它的：

> `navigator` 是 Web 浏览器提供的一个内置对象，它包含了很多有关浏览器环境和用户设备的信息，可以通过它来获取和操作这些信息。
>
> 以下是一些常见的 `navigator` 对象的属性和方法：
>
> - `navigator.userAgent`：返回浏览器的用户代理字符串，它可以用来确定用户使用的浏览器和操作系统。
> - `navigator.platform`：返回当前操作系统的平台信息，如 "Win32"、"MacIntel" 等。
> - `navigator.language`：返回用户的首选语言，根据浏览器设置的语言偏好进行确定。
> - `navigator.cookieEnabled`：返回一个布尔值，表示浏览器是否启用了 cookie。
> - `navigator.geolocation`：提供了获取用户地理位置信息的方法和属性。
> - `navigator.onLine`：返回一个布尔值，表示当前是否处于联网状态。
> - `navigator.sendBeacon(url, data)`：用于异步向服务器发送数据，适用于在页面卸载、关闭或导航发生时发送异步请求。
> - `navigator.clipboard`：提供了读取和写入剪贴板内容的方法和属性。
> - `navigator.vibrate(pattern or time)`：用于控制设备的震动功能。
>
> 需要注意的是，`navigator` 对象中的属性和方法在不同的浏览器中可能会有所差异，所以在使用之前最好检查其兼容性或使用相关的 polyfill 库来保证代码的正确运行。
>
> 希望以上信息可以帮助到你。如果还有其他问题，请随时提问。

根据介绍可以通过 `online` 来判断是否有联网，实现逻辑。代码如下：

```js
const checkNetworkStatus = () => {
    if (!navigator.onLine) {
		uni.showToast({
			title: '检测到你的网络未连接，请先连接网络',
			icon: 'none'
		})
		context.value.pause()
    }
}
context.value.onTimeUpdate(() => {
	checkNetworkStatus()
});
```

#### 刷新关闭

测试又和我反应 H5 端用户通过关闭浏览器或者刷新浏览器时，用户听的时长不会记录在内。第一时间就判断出来他因为没有触发音频的停止暂停时间因此没有触发接口，因此剩余时长没变。

在复现的时候，发现在刷新浏览器的时候，会触发 `App.vue` 根组件中的 `onHide()` 生命周期函数，因此我的处理方法为：

1. 用户播放时实时记录并本地存储
2. 在根组件的 `onHide()` 生命钩子函数获取本地存储的数据，调用接口发送数据获取最新的剩余时长，并且删除对应的本地存储

刷新实现了，关闭浏览器该方法不可使用，因此转换一个思路：

1. 把音频的时长和id都保存到本地了，在播放的时候获取本地存储的数据
2. 判断是否有相应的id，如果有，则把对应的时长加到播放时长中

最后打包运行项目，能够成功实现。

#### 音频下载

在 APP 端音频下载是通过 `uni.saveFile()` API 实现，但是该 API 不支持 H5端，因此需要对 H5 端做特殊处理。

在 H5 端，一般的下载方法都是创建 `a` 标签并利用其 `download` 属性实现下载，修改代码：

```js
const downloadMusicFn = () => {
	uni.showLoading({
		title: '下载中，请稍等'
	})
	// #ifdef APP-PLUS
	uni.downloadFile({
        // ...
	});
	// #endif
	// #ifdef H5
	const downloadLink = document.createElement('a');
	downloadLink.href = '文件路径';
	downloadLink.download = '文件名称';
	downloadLink.style.display = 'none';
	document.body.appendChild(downloadLink);
	downloadLink.click();
	downloadLink.remove();
	uni.hideLoading()
	document.body.removeChild(downloadLink);
	// #endif
}
```

运行后发现点击按钮后页面跳转，地址为音频路径，这显然不是我们想要的，故询问 ChatGPT 如何解决。以下为 ChatGPT 提供的解决方案：

> 如果你希望在前端实现点击后不跳转直接下载音频文件的功能，可以使用 JavaScript 的 XMLHttpRequest 或 Fetch API 来获取音频文件，并利用 Blob 对象创建下载链接。
>
> 以下是一个示例代码：
>
> ```javascript
> const audioUrl = 'https://your-aliyun-server.com/audio.mp3'; // 音频文件的 URL
> const filename = 'audio.mp3'; // 音频文件的文件名
> 
> fetch(audioUrl)
>   .then(response => response.blob())
>   .then(blob => {
>     const downloadLink = document.createElement('a');
>     downloadLink.href = URL.createObjectURL(blob);
>     downloadLink.download = filename;
>     downloadLink.style.display = 'none';
>     document.body.appendChild(downloadLink);
>     downloadLink.click();
>     document.body.removeChild(downloadLink);
>   });
> ```
>
> 在这个示例中，我们使用 Fetch API 来获取音频文件的响应对象，并使用 `blob()` 方法将响应内容转换为 Blob 对象。然后，我们创建一个 `<a>` 元素，设置其 `href` 属性为 Blob 对象的 URL，将文件名设置为 `download` 属性，并将其添加到页面上。最后，我们模拟用户点击操作，实现直接下载功能，并在下载完成后将 `<a>` 元素从页面上移除。
>
> 这种方法可以在前端直接下载音频文件，并且无需后端参与。
>
> 请注意，部分旧版浏览器可能不支持 Fetch API，你可以使用 XMLHttpRequest 来替代。
>
> 希望这个解决方案对你有帮助。如果你有其他问题，请随时提问。

没用过 `fetch` ，而 XML 是我们熟悉的 AJAX，因此试一下原生 AJAX 的方法可不可行，代码修改如下形式：

```js
const downloadMusicFn = () => {
	uni.showLoading({
		title: '下载中，请稍等'
	})
	// #ifdef APP-PLUS
	uni.downloadFile({
		// ...
	});
	// #endif
	// #ifdef H5
	const xhr = new XMLHttpRequest();
	xhr.open('GET', props.detail.playUrl, true);
	xhr.responseType = 'blob';
	xhr.setRequestHeader('Accept', 'audio/mpeg'); // 设置 MIME 类型为 audio/mpeg
	
	xhr.onload = function() {
	  if (xhr.status === 200) {
	    const blob = xhr.response;
	    const downloadLink = document.createElement('a');
	    downloadLink.href = URL.createObjectURL(blob);
	    downloadLink.download = props.detail.title;
	    downloadLink.style.display = 'none';
	    document.body.appendChild(downloadLink);
	    downloadLink.click();
		downloadLink.remove();
		dowmLoadArr.push(props.detail.id)
		uni.setStorageSync('download', JSON.stringify(dowmLoadArr))
		downloadType.value = true
		uni.hideLoading()
	    document.body.removeChild(downloadLink);
	  }
	};
	
	xhr.send();
	// #endif
}
```

最后运行，效果实现。

#### 页面切换

在用户切换页面（非关闭浏览器）时没有调用接口传参，导致剩余时长没有扣除。在调试的时候发现 `stop` 回调函数有触发，因此修改相关逻辑，把接口放到回调函数中触发，其他事件单纯调用 `stop` 方法即可。

### 播放时长记录优化

使用定时器的最大缺点就是，定时器并不是延迟多少秒后必定触发，而是在相应的时间后把它放到队列中，等待同步任务与微任务执行完毕再去轮询获取宏任务（即定时器）。

因此会有一定的秒数误差，不能使用不使用定时器记录时长，那采用什么方法记录呢？

解决方法为采用时间戳的形式，在播放回调触发时通过 `new Date()` 获取开始播放的时间戳，触发暂停或停止回调时再通过过 `new Date()` 获取停止听的时长，两者相减即为用户听的时长，再通过 `Math.round()` 或 `Math.floor()` 取整即可。

## 课程详情

需要实现视频播放功能。

### 阿里云播放器SDK
课程视频用户统一上传到阿里云服务器上，播放视频考虑使用阿里云sdk。详情可前往官方文档 [阿里云播放器sdk](https://help.aliyun.com/document_detail/125570.html) 查看。

#### 引入资源

```html
<link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.12.1/skins/default/aliplayer-min.css" />  //（可选）如果您的使用场景需要用到H5模式的播放器，则需引用此css文件。
<script charset="utf-8" type="text/javascript" src="https://g.alicdn.com/de/prismplayer/2.12.1/aliplayer-min.js"></script>  //（必须）引入js文件。
```

提供挂载元素

在结构中创建一个 `dom` 元素供点播器挂载，注意复制时看 `id` 是否对应。
```html
<div id="aliplayerVedio"></div>
```

#### 播放设置
点播播放有多种方式可供选择，这里采取的是官方最为推荐的 `VID + PlayAuth` 的方式。
```js
var player = new Aliplayer({
   id: 'J_prismPlayer',
   width: '100%',
   vid : '<your video ID>',//必选参数。音视频ID。示例：1e067a2831b641db90d570b6480f****。
   playauth : '<your PlayAuth>',//必选参数。音视频播放凭证。
 },function(player){
   console.log('The player is created.')
});
```
此时运行，运行在浏览器中的 `demo` 已经成功跑起来，返回 `uniapp` 中运行，却报以下错误。
> `Aliplayer is not defined`

`uniapp` 运行机制不一样，因此拿不到 `index.html` 引入的js文件，运行之后会报错。

#### 改造

- 基于 `uniapp` 开发的在浏览器上运行的解决方案
   1. 动态创建 `script` 标签，引入资源
   2. 动态创建 `link` 标签，实现跳转
```js
function loadScriptString(src) {
  var script = document.createElement('script') //创建一个script标签
  script.type = 'text/javascript'
  script.src = src
  document.getElementsByTagName('head')[0].appendChild(script)
}

function loadLinkString(src) {
  var link = document.createElement('link') //创建一个link标签
  link.rel = 'stylesheet'
  link.href = src
  document.getElementsByTagName('head')[0].appendChild(link)
}

// 使用阿里云播放器
loadLinkString('https://g.alicdn.com/de/prismplayer/2.9.19/skins/default/aliplayer-min.css')
loadScriptString('https://g.alicdn.com/de/prismplayer/2.9.19/aliplayer-min.js')
```

- 基于手机 `app` 开发

手机 `app` 没有 `document` 标签，因此无法使用这个方案。上文 《tabBar页》 中描述了 `webview` 的功能，刚好符合这个场景。

在 `webview` 中写原生 `html` 代码，把需要的参数通过 query 的方式传递过去。
```vue
<template>
 <view class="content">
  <web-view :src="videoUrl"></web-view>1
 </view>
</template>

<script>
export default {
    data() {
        return {
         videoUrl:'static/index.html?'
        }
    },
    onLoad() {
        let vid = '808243746770483c843bef3e4f91b629';
        let playauth = "凭证";
        this.videoUrl +=`vid=${vid}&playauth=${playauth}`;
    },
    methods: {
    }
}
</script>
```
```html
<!DOCTYPE html>
<html lang="zh">
 <head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, user-scalable=no,initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <head>
   <link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.12.1/skins/default/aliplayer-min.css" />
   <script charset="utf-8" type="text/javascript"
    src="https://g.alicdn.com/de/prismplayer/2.12.1/aliplayer-h5-min.js"></script>
  </head>
  <title>视频详情</title>
 </head>
 <body>
  <div id="ali_video"></div>
  
  <script>
   let vid = getValue('vid');
   let playauth = getValue('playauth');
   var player = new Aliplayer({
    id: 'ali_video',
    width: '100%',
    vid: vid,
    playauth: playauth,
   }, function(player) {
    console.log('The player is created.')
   });
   console.log(player)

   /**
    * @description 从地址栏获取参数
    * @param {Object} key 地址栏关键字key名称
    */
   function getValue(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
   }
  </script>
 </body>
</html>
```

#### 总结
利用 `webview` 书写原生，根据官方文档实现阿里云点播器播放视频功能。
> 题外话：
> 最后使用的时候项目经理觉得体验感极差，让后端修改接口，直接返回视频的 `url` ，前端修改为使用 `uniapp` 自带的视频组件 `video` 。

## 活动详情
效果如下图所示。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/29781801/1675129545381-370b1a74-daf5-4b3c-a7af-2d07f3fd7cee.png#averageHue=%23bec2a9&clientId=u4be0b9f7-2df9-4&from=paste&height=474&id=u276d4dc6&name=image.png&originHeight=474&originWidth=247&originalType=binary&ratio=1&rotation=0&showTitle=false&size=121890&status=done&style=none&taskId=u79a1e18c-f581-4835-8d60-44d49b560b4&title=&width=247)

下方是一个富文本内容，第一时间联想起使用富文本的几种方式。

### 富文本的使用方式

#### rich-text
`rich-text` 是 `uni-app` 的内置组件，提供了高性能的富文本渲染模式。API参考 [rich-text](https://uniapp.dcloud.io/component/rich-text) 。

`rich-text` 的优势是全端支持、高性能。但是 `rich-text` 不支持内嵌视频，可以通过拆分多个 `rich-text`，中间插入 `video` 来实现。
> 注：
> 小程序端有个缺陷是只能整体设点击事情，无法对富文本中的图片、超链接单独设点击事件。

如果是图片，可以把内容拆成多个 `rich-text` 解决。


#### v-html
`v-html` 指令，是 `web` 开发中很常用的。小程序不支持。

#### uParse
`uView` 组件库有一个富文本解析器，详情可见官方文档 [富文本解析器](https://vkuviewdoc.fsq.pub/components/parse.html) 。

### uParse图片丢失
在本项目中，最初使用的是 `v-html` 渲染富文本，但是部分图片太大超出手机屏幕的范围，且点击图片没有预览效果，因此改成了 `u-parse` 组件。

切换组件后，h5 上运行没事，真机调试时问题来了，图片无法加载。

百度后在 `DCloud` 社区找到了答案，是这个插件判断图片宽高出了问题。当图片宽度大于 窗口宽度的时候，这个插件无法获取 `windowWidth`，导致这个值成了 0。详情可前往社区查看： [uParse 富文本解析图片无法显示](https://ask.dcloud.net.cn/question/132415) 。

得知问题原因，解决思路就有了，在获取到数据后修改一下图片的最大宽度。
```js
/**
 * 转换富文本的图片最大为100%
*/
const formatRichText = (html) => { //控制小程序中图片大小
	let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
		match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
		match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
		match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
		return match;
	});
	newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
		match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi,
			'max-width:100%;');
		return match;
	});
	newContent = newContent.replace(/<br[^>]*\/>/gi, '');
	newContent = newContent.replace(/\<img/gi,
		'<img style="max-width:100%;height:auto;"');
	return newContent
}
export default formatRichText
```
最终效果实现，图片大小能够全部显示在手机屏幕上。
