---
title 操作页
---

# 操作

## 蓝牙连接

用户需要 `app` 连接蓝牙设备进行各自操作的功能，`uniapp` 有对应的 `API` 可以使用，详情请见 [蓝牙](https://uniapp.dcloud.net.cn/api/system/bluetooth.html#openbluetoothadapter) 与 [低功耗蓝牙](https://uniapp.dcloud.net.cn/api/system/ble.html) 。

### 初始化蓝牙
> 最开始需要初始化蓝牙模块，初始化成功后才能调用其他蓝牙相关的 API，否则会返回 _未初始化蓝牙适配器_ 的错误。

```javascript
const openBluetoothAdapter = () => {
  uni.openBluetoothAdapter({
    success: res => {
      startBluetoothDevicesDiscovery(); // 第二步搜寻设备事件
    },
    fail: res => {
      console.log(res);
      uni.showModal({
        title: '提示',
        content: '请开启本机蓝牙后重进本页面'
      });
    }
  });
};
```
开启成功后会返回 `{"errMsg":"openBluetoothAdapter:ok"}` 提示。

### 开启搜寻
开始搜寻附近的蓝牙外围设备。
> 此操作比较耗费系统资源，搜索并连接到设备后调用 `uni.stopBluetoothDevicesDiscovery` 方法停止搜索。

```javascript
const startBluetoothDevicesDiscovery = () => {
  uni.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: true, //允许重复上报同一个设备
    success: res => {
      uni.showLoading({
        title: '正在搜索设备',
        duration: 2000
      });
      getBluetoothDevices(); // 第三步获取蓝牙设备事件
    },
    fail: err => {
      console.log(err);
    }
  });
};
```

### 获取蓝牙设备

- `uni.getBluetoothDevices` 获取在蓝牙模块生效期间所有已发现的蓝牙设备。本项目的蓝牙设备均以 “TGYY” 开头，过滤出这些需要的设备渲染在页面上。
- 获取成功后 `uni.stopBluetoothDevicesDiscovery` 关闭蓝牙搜索。
```javascript
const getBluetoothDevices = () => {
  setTimeout(() => {
    uni.getBluetoothDevices({
      // 成功搜索到设备列表，停止搜索
      success: res => {
        uni.stopBluetoothDevicesDiscovery({
          success(res) {
            console.log('停止搜索---', res);
          }
        });
        uni.hideLoading();
        // 根据名称，过滤出音果的设备
        list.value = res.devices.filter();
        isShow.value = true;
      },
      fail: err => {
        console.log(err);
        uni.stopBluetoothDevicesDiscovery({
          success(res) {
            console.log('停止搜索---', res);
          }
        });
        isShow.value = true;
      }
    });
  }, 2000);
};
```
搜索到的设备会返回以下数据：
```javascript
{
    "devices": [{
        "deviceId": "B4:10:7B:C4:83:14",
        "name": "蓝牙设备名",
        "RSSI": -58,
        "localName": "",
        "advertisServiceUUIDs": ["0000FFF0-0000-1000-8000-00805F9B34FB"],
        "advertisData": {}
    }]
}
```

### 连接低功耗蓝牙
`uni.createBLEConnection(OBJECT)` 连接低功耗蓝牙设备。

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| deviceId | string | 是 | 用于区分设备的 id |

设备 `id` 在第三步获取蓝牙设备步骤中成功回调里获取。我给每条搜索到的蓝牙结果添加一个 `click` 事件，会向目标设备发送连接请求，连接成功后可获取状态值。流程如下：

1. 连接设备：使用设备ID进行连接 `uni.createBLEConnection`
2. 获取设备所有服务：使用设备ID进行连接 `uni.getBLEDeviceServices`
```javascript
const handleBLEFn = item => {
  deviceId.value = item.deviceId;
  deviceName.value = item.name;
  uni.showLoading({
    title: '正在查询服务',
    duration: 3000
  });
  uni.createBLEConnection({
    // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
    deviceId: item.deviceId,
    success(res) {
      setTimeout(() => {
        // 获取蓝牙设备所有服务(service)。
        uni.getBLEDeviceServices({
          deviceId: item.deviceId,
          success(res) {
            console.log('device services:', res.services);
            uni.hideLoading();
            if (res.services.length === 0) {
              uni.showToast({
                title: '暂无服务',
                icon: 'none'
              });
              return;
            }
            searchList.value = res.services;
            isSearch.value = false;
            handleBLEDeviceFn(res.services[1]) // 第五步获取设备特征值事件
          },
          fail(err) {
            console.log(err);
            getErrInfo(err.code);
            uni.hideLoading();
          }
        });
      }, 2500);
    },
    fail(err) {
      console.log(err);
      getErrInfo(err.code);
      uni.hideLoading();
    }
  });
};
```
获取设备服务返回值如下所示：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| uuid | string | 蓝牙设备服务的 uuid |
| isPrimary | boolean | 该服务是否为主服务 |

```javascript
{
    "services": [{
        "uuid": "00001800-0000-1000-8000-00805F9B34FB",
        "isPrimary": true
    }, {
        "uuid": "00001801-0000-1000-8000-00805F9B34FB",
        "isPrimary": true
    }, {
        "uuid": "0000180A-0000-1000-8000-00805F9B34FB",
        "isPrimary": true
    }, {
        "uuid": "0000FFF0-0000-1000-8000-00805F9B34FB",
        "isPrimary": true
    }, {
        "uuid": "0000FFE0-0000-1000-8000-00805F9B34FB",
        "isPrimary": true
    }],
    "errMsg": "getBLEDeviceServices:ok"
}
```

### 获取设备特征值，开启消息监听并接收消息监听传来的数据
通过获取到的设备ID和蓝牙设备服务数组的第二项元素 `uuid` 去获取蓝牙设备某个服务中所有特征值。

1. 允许读：调用 `uni.readBLECharacteristicValue` 事件监听
2. 允许写：保存其 `uuid` 后续做写的操作
3. 允许监听：调用 `uni.notifyBLECharacteristicValueChange` 事件开启监听，再通过 `uni.onBLECharacteristicValueChange` 监听其变化。
```javascript
const handleBLEDeviceFn = uuid => {
  uni.showLoading({
    title: '正在获取特征值',
    duration: 3000
  });
  uni.getBLEDeviceCharacteristics({
    // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
    deviceId,
    // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
    serviceId,
    success(res) {
      console.log('device getBLEDeviceCharacteristics:', res.characteristics);
      uni.hideLoading();
      getUUidList.value = true;
      for (let i = 0; i < res.characteristics.length; i++) {
        let item = res.characteristics[i];
        if (item.properties.read) {
          // 允许读
          uni.readBLECharacteristicValue({
            deviceId: deviceId.value,
            serviceId: uuid.uuid,
            characteristicId: item.uuid,
            success(res) {
              console.log('读取指令发送胜利', res);
            },
            fail(err) {
              console.log('读取指令发送失败', err);
            }
          });
        }
        if (item.properties.write) {
          // 允许写
          characteristicId.value = item.uuid;
        }
        if (item.properties.notify || item.properties.indicate) {
          // 要开启这个才能监听
          uni.notifyBLECharacteristicValueChange({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
            state: true,
            success(res) {
              uni.showLoading({
                title: '连接中',
                duration: 3000
              });
              console.log('notifyBLECharacteristicValueChange success:', JSON.stringify(res));
              // 监听低功耗蓝牙设备的特征值变化事件成功
              uni.onBLECharacteristicValueChange(characteristic => {
                var array = new Uint8Array(characteristic.value);
                console.log('包' + array);
                let resHex = ab2hex(characteristic.value);
                console.log(resHex);
              });
              setTimeout(() => {
                uni.hideLoading();
              }, 3000);
            },
            fail(err) {
              console.log(err);
              getErrInfo(err.code);
              uni.hideLoading();
            }
          });
        }
      }
    },
    fail(err) {
      console.log(err);
      getErrInfo(err.code);
      uni.hideLoading();
    }
  });
};
```
> 必须先启用 `notifyBLECharacteristicValueChange` 才能监听到设备 `characteristicValueChange` 事件。

获取指定服务的特征值返回值如下所示：
```javascript
{
    "characteristics": [{
        "uuid": "0000FFE1-0000-1000-8000-00805F9B34FB",
        "properties": {
            "read": true,
            "write": true,
            "notify": true,
            "indicate": false
        }
    }],
    "errMsg": "getBLEDeviceCharacteristics:ok"
}
```

### 写入数据
数据的写入需要蓝牙设备厂商提供对应的十六进制指令。

1. 声明一个 `ArrayBuffer` 16进制数据
2. 通过 `DataView` 追加数据
3. 通过 `uni.writeBLECharacteristicValue` 向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 `write` 才可以成功调用。
```javascript
const handleClick = (str) => {
  // 向蓝牙设施发送一个0x00的16进制数据
  const buffer = new ArrayBuffer(16);
  const dataView = new DataView(buffer);
  const arr = str.split(' ')
  for (let i = 0; i < arr.length; i++) {
    dataView.setUint8(i, parseInt(arr[i], 16))
  }
  uni.writeBLECharacteristicValue({
    // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    deviceId,
    // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
    serviceId,
    // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
    characteristicId,
    // 这里的value是ArrayBuffer类型
    value: buffer,
    writeType: 'write',
    success(res) {
      console.log('writeBLECharacteristicValue success', res);
    },
    fail(err) {
      getErrInfo(err.code);
      console.log('writeBLECharacteristicValue error', err);
    }
  });
};
```

### 拓展

#### ArrayBuffer
`ArrayBuffer` 对象代表储存二进制数据的一段内存，一经创建就不能再调整大小。
```javascript
const buf = new ArrayBuffer(16);   // 在内存中分配16 字节
alert(buf.byteLength);               // 16
```
它不能直接读写，只能通过视图（`TypedArray` 视图和 `DataView` 视图)来读写。视图的作用是以指定格式解读二进制数据。`DataView` 视图的创建，需要提供 `ArrayBuffer` 对象实例作为参数。
```javascript
const buf = new ArrayBuffer(32);
const dataView = new DataView(buf);
dataView.getUint8(0) // 0, 参数表示读取的起始位置
```

#### DataView
`JavaScript` 中的 `DataView` 函数提供了一个接口，可以将多个数字类型读写到 `ArrayBuffer` 中。句法：
```javascript
new DataView(buffer, byteOffset, byteLength)
```
**参数：**该函数接受三个参数，如下所述：

- **buffer：**一个已经存在的 `ArrayBuffer`，用于存储新的`DataView`对象。
- **byteOffset (optional)：**缓冲区中的`offset`(以字节为单位)用于启动缓冲区的新视图。默认情况下，新视图从第一个字节开始。
- **byteLength (optional)：**它代表字节数组中的元素数。默认情况下，缓冲区的长度被视为视图的长度。

**返回值：**它返回一个新的`DataView`对象，它将代表指定的数据缓冲区。

### 总体代码
```vue
<!-- 蓝牙连接 -->
<script setup>
	import {
		onLoad,
		onReady,
		onShow,
		onHide,
		onUnload,
		onBackPress
	} from '@dcloudio/uni-app';
	import {
		ref
	} from 'vue';

	const deviceId = ref('');

	// 错误信息
	const getErrInfo = err => {
		switch (err) {
			case 10000:
				uni.showToast({
					title: '未初始化蓝牙适配器',
					icon: 'none'
				});
				break;
			case 10001:
				uni.showToast({
					title: '当前蓝牙适配器不可用',
					icon: 'none'
				});
				break;
			case 10002:
				uni.showToast({
					title: '没有找到指定设备',
					icon: 'none'
				});
				break;
			case 10003:
				uni.showToast({
					title: '连接失败',
					icon: 'none'
				});
				break;
			case 10004:
				uni.showToast({
					title: '没有找到指定服务',
					icon: 'none'
				});
				break;
			case 10005:
				uni.showToast({
					title: '没有找到指定特征值',
					icon: 'none'
				});
				break;
			case 10006:
				uni.showToast({
					title: '当前连接已断开',
					icon: 'none'
				});
				break;
			case 10007:
				uni.showToast({
					title: '当前特征值不支持此操作',
					icon: 'none'
				});
				break;
			case 10009:
				uni.showToast({
					title: '系统版本低于 4.3 不支持 BLE',
					icon: 'none'
				});
				break;
			case 10010:
				uni.showToast({
					title: '已连接',
					icon: 'none'
				});
				break;
			case 10011:
				uni.showToast({
					title: '配对设备需要配对码',
					icon: 'none'
				});
				break;
			case 10012:
				uni.showToast({
					title: '连接超时',
					icon: 'none'
				});
				break;
			case 10013:
				uni.showToast({
					title: '连接 deviceId 为空或者是格式不正确',
					icon: 'none'
				});
				break;
			default:
				break;
		}
	};

	// 开启蓝牙
	const openBluetoothAdapter = () => {
		uni.openBluetoothAdapter({
			success: res => {
				startBluetoothDevicesDiscovery();
			},
			fail: res => {
				console.log(res);
				uni.showModal({
					title: '提示',
					content: '请开启本机蓝牙后重进本页面'
				});
			}
		});
	};

	// 开启蓝牙搜索
	const startBluetoothDevicesDiscovery = () => {
		uni.startBluetoothDevicesDiscovery({
			allowDuplicatesKey: true, //允许重复上报同一个设备
			success: res => {
				uni.showLoading({
					title: '正在搜索设备',
					duration: 2000
				});
				getBluetoothDevices(); //监听新设备事件
			},
			fail: err => {
				console.log(err);
			}
		});
	};

	const list = ref([]);
	const isShow = ref(false);
	const deviceName = ref('')

	// 蓝牙搜索结果
	const getBluetoothDevices = () => {
		setTimeout(() => {
			uni.getBluetoothDevices({
				success: res => {
					uni.stopBluetoothDevicesDiscovery({
						success(res) {
							console.log('停止搜索---', res);
						}
					});
					uni.hideLoading();
					// 过滤出音果的设备
					list.value = res.devices.filter(item => item.localName.indexOf('TGYY') !== -1);
					isShow.value = true;
				},
				fail: err => {
					console.log(err);
					uni.stopBluetoothDevicesDiscovery({
						success(res) {
							console.log('停止搜索---', res);
						}
					});
					isShow.value = true;
				}
			});
		}, 2000);
	};

	// 点击蓝牙获取服务
	const isSearch = ref(true);
	const searchList = ref([]);
	const handleBLEFn = item => {
		deviceId.value = item.deviceId;
		deviceName.value = item.name;
		uni.showLoading({
			title: '正在查询服务',
			duration: 3000
		});
		uni.createBLEConnection({
			// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
			deviceId: item.deviceId,
			success(res) {
				setTimeout(() => {
					// 获取蓝牙设备所有服务(service)。
					uni.getBLEDeviceServices({
						deviceId: item.deviceId,
						success(res) {
							console.log('device services:', res.services);
							uni.hideLoading();
							if (res.services.length === 0) {
								uni.showToast({
									title: '暂无服务',
									icon: 'none'
								});
								return;
							}
							searchList.value = res.services;
							isSearch.value = false;
							handleBLEDeviceFn(res.services[1])
						},
						fail(err) {
							console.log(err);
							getErrInfo(err.code);
							uni.hideLoading();
						}
					});
				}, 2500);
			},
			fail(err) {
				console.log(err);
				getErrInfo(err.code);
				uni.hideLoading();
			}
		});
	};

	// 获取蓝牙的特征值
	const getUUidList = ref(false);
	const uuidList = ref([]);
	const uuidStr = ref('');
	const characteristicId = ref('');
	const blueType = ref('') // 蓝牙开启状态
	const blueMove = ref(null) // 蓝牙挡位
	const content = ref('') // 模态框的内容
	const showModal = ref(false) // 模态框的显隐
	const handleBLEDeviceFn = uuid => {
		uni.showLoading({
			title: '正在获取特征值',
			duration: 3000
		});
		uuidStr.value = uuid.uuid;
		uni.getBLEDeviceCharacteristics({
			// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
			deviceId: deviceId.value,
			// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
			serviceId: uuid.uuid,
			success(res) {
				console.log('device getBLEDeviceCharacteristics:', res.characteristics);
				uni.hideLoading();
				getUUidList.value = true;
				for (let i = 0; i < res.characteristics.length; i++) {
					let item = res.characteristics[i];
					if (item.properties.read) {
						// 允许读
						uni.readBLECharacteristicValue({
							deviceId: deviceId.value,
							serviceId: uuid.uuid,
							characteristicId: item.uuid,
							success(res) {
								console.log('读取指令发送胜利', res);
							},
							fail(err) {
								console.log('读取指令发送失败', err);
							}
						});
					}
					if (item.properties.write) {
						// 允许写
						characteristicId.value = item.uuid;
					}
					if (item.properties.notify || item.properties.indicate) {
						// 要开启这个才能监听
						uni.notifyBLECharacteristicValueChange({
							deviceId: deviceId.value,
							serviceId: uuid.uuid,
							characteristicId: item.uuid,
							state: true,
							success(res) {
								uni.showLoading({
									title: '连接中',
									duration: 3000
								});
								setTimeout(() => {
									handleClick('55 AA 04 AA 00 00 A5 5A')
								}, 1500)
								// 监听低功耗蓝牙设备的特征值变化事件成功
								uni.onBLECharacteristicValueChange(characteristic => {
									var array = new Uint8Array(characteristic.value);
									console.log('包' + array);
									let resHex = ab2hex(characteristic.value);
									console.log(resHex);
									if (resHex.length >= 25) {
										blueType.value = resHex.slice(8, 10) === '01' ? '开' :
											'关'
										blueMove.value = parseInt(resHex.slice(14, 16), 16)
										content.value =
											`当前状态：${blueType.value}；当前档位：${blueMove.value}`
										showModal.value = true
									}
									uni.hideLoading();
								});
								setTimeout(() => {
									uni.hideLoading();
								}, 3000);
							},
							fail(err) {
								console.log(err);
								getErrInfo(err.code);
								uni.hideLoading();
							}
						});
					}
				}
			},
			fail(err) {
				console.log(err);
				getErrInfo(err.code);
				uni.hideLoading();
			}
		});
	};

	const handleClick = (str) => {
		// 向蓝牙设施发送一个0x00的16进制数据
		const buffer = new ArrayBuffer(16);
		const dataView = new DataView(buffer);
		const arr = str.split(' ')
		for (let i = 0; i < arr.length; i++) {
			dataView.setUint8(i, parseInt(arr[i], 16))
		}
		uni.showLoading({
			title: '传输协议中',
			duration: 1000
		});
		uni.writeBLECharacteristicValue({
			// 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
			deviceId: deviceId.value,
			// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
			serviceId: uuidStr.value,
			// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
			characteristicId: characteristicId.value,
			// 这里的value是ArrayBuffer类型
			value: buffer,
			writeType: 'write',
			success(res) {
				console.log('writeBLECharacteristicValue success', res);
			},
			fail(err) {
				getErrInfo(err.code);
				console.log('writeBLECharacteristicValue error', err);
			}
		});
	};

	// ArrayBuffer转16进度字符串示例
	const ab2hex = buffer => {
		const hexArr = Array.prototype.map.call(
			new Uint8Array(buffer),
			function(bit) {
				return ('00' + bit.toString(16)).slice(-2)
			}
		)
		return hexArr.join('')
	};

	onLoad(() => {
		openBluetoothAdapter();
	});

	// 改变挡位
	const moveVal = ref('')
	const handleClickChangeMove = type => {
		console.log(type)
		switch (type) {
			case 'add':
				if (blueMove.value >= 20) {
					showModal.value = true
					content.value = '当前档位已经是最大值'
					return
				}
				blueMove.value += 1
				break;
			case 'lose':
				if (blueMove.value <= 0) {
					showModal.value = true
					content.value = '当前档位已经是最小值'
					return
				}
				blueMove.value -= 1
				break;
			default:
				break;
		}
		console.log(blueMove.value)
		handleClick(`55 AA 04 A3 00 ${blueMove.value.toString(16)} A5 5A`)
	}
	
	const handlePageFn = () => {
		uni.closeBluetoothAdapter({
			success(res) {
				uni.navigateBack()
				uni.showToast({
					title: '蓝牙搜索关闭'
				})
			}
		});
	}
</script>

<template>
	<u-modal v-model="showModal" :content="content"></u-modal>
	<!-- 搜索状态 -->
	<view v-if="list.length > 0" class="list">
		<template v-if="isSearch">
			<view v-for="item in list" :key="item.deviceId" class="blue-item" @click="handleBLEFn(item)">
				<view class="phone">
					<view>蓝牙设备</view>
					<view>{{ item.deviceId }}</view>
				</view>
				<view class="name">
					<view>蓝牙名称</view>
					<view>{{ item.name ? item.name : '暂无' }}</view>
				</view>
			</view>
		</template>

		<!-- 点击蓝牙进入其值 -->
		<template v-else>
			<template v-if="getUUidList">
				<view class="close-page" @click="handlePageFn">关闭页面并关闭蓝牙搜索</view>
				
				<view class="blue-item">
					<view class="phone">
						<view>蓝牙设备</view>
						<view>{{ deviceId }}</view>
					</view>
					<view class="name">
						<view>蓝牙名称</view>
						<view>{{ deviceName ? deviceName : '暂无' }}</view>
					</view>
				</view>
				
				<view class="blue-item">
					<view>
						<view>当前档位：</view>
						<view>{{blueMove}}</view>
					</view>
				</view>

				<view class="get-uuid-list">
					<view class="item-list">
						<view class="get-uuid-item" @click="handleClick('55 AA 04 A0 00 01 A5 5A')">
							<i class="iconfont icon-kaiguan"></i>
							<view class="name">开</view>
						</view>
						<view class="get-uuid-item" @click="handleClick('55 AA 04 A0 00 00 A5 5A')">
							<i class="iconfont icon-kaiguan"></i>
							<view class="name">关</view>
						</view>
					</view>
				
					<view class="item-list">
						<view class="get-uuid-item" @click="handleClick('55 AA 04 AA 00 00 A5 5A')">
							<u-icon name="search"></u-icon>
							<view class="name">查询</view>
						</view>
					</view>
				
					<view class="item-list">
						<view class="get-uuid-item" @click="handleClickChangeMove('add')">
							<i class="iconfont icon-jia"></i>
							<view class="name">档位+</view>
						</view>
						<view class="get-uuid-item" @click="handleClickChangeMove('lose')">
							<i class="iconfont icon-jian"></i>
							<view class="name">档位-</view>
						</view>
					</view>
				</view>
			</template>
		</template>
	</view>
	<view v-else>
		<view v-if="isShow" class="no-blue-teeth">
			<u-empty text="暂无可连接蓝牙" mode="wifi"></u-empty>
			<view class="info">
				<view>提示：</view>
				<view>1.请确保你开启了蓝牙和定位</view>
				<view>2.请确保你附近有音果系列的蓝牙设备</view>
				<view>3.请确保你要连接的蓝牙设备没被其他人连接</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.no-blue-teeth {
		padding-top: 200rpx;
		.info {
			display: flex;
			flex-direction: column;
			margin: 100rpx auto 0;
			width: 80%;
			
			> view {
				color: #8e8e8e;
				margin-bottom: 20rpx;
			}
		}
	}
	.list {
		display: flex;
		flex-direction: column;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		
		.close-page {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			background-color: #d41c1c;
			color: #fff;
			border-radius: 50rpx;
		}
	}

	.blue-item {
		display: flex;
		flex-direction: column;
		padding: 0 30rpx;
		background-color: #fafafa;
		border-radius: 20rpx;
		margin: 20rpx 0;
		box-sizing: border-box;

		>view {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 110rpx;
			border-bottom: 2rpx solid #eee;

			&:last-child {
				border-bottom: none;
			}
		}
	}

	.get-uuid-list {
		width: 100%;
		background-color: #fafafa;
		border-radius: 30rpx;
		padding: 35rpx 50rpx;
		box-sizing: border-box;

		.item-list {
			display: flex;
			align-items: center;
			justify-content: space-around;
			margin-bottom: 20rpx;
			box-sizing: border-box;
		}

		.get-uuid-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 150rpx;
			height: 150rpx;
			border: 2rpx solid #ccc;
			border-radius: 50%;
			box-sizing: border-box;

			.name {
				margin-top: 25rpx;
			}
		}
	}
</style>
```

## 扫一扫
uniapp 内置事件 [uni.scanCode](https://uniapp.dcloud.net.cn/api/system/barcode.html#scancode) 可调起客户端扫码界面，扫码成功后返回对应的结果。

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| onlyFromCamera | Boolean | 否 | 是否只能从相机扫码，不允许从相册选择图片 |
| scanType | Array | 否 | 扫码类型，参考下方scanType的合法值 |
| autoDecodeCharset | Boolean | 否 | 是否启用自动识别字符编码功能，默认为否 |
| autoZoom | Boolean | 否 | 是否启用自动放大，默认启用 |
| barCodeInput | Boolean | 否 | 是否支持手动输入条形码 |
| hideAlbum | Boolean | 否 | 是否隐藏相册（不允许从相册选择图片），只能从相机扫码。默认值为 false。 |
| success | Function | 否 | 接口调用成功的回调，返回内容详见返回参数说明。 |
| fail | Function | 否 | 接口调用失败的回调函数（识别失败、用户取消等情况下触发） |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

成功状态返回值如下所示：
```javascript
{
 "scanType": "QR_CODE",
 "path": "/storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/HBuilder/doc/uniapp_temp/compressed/1672372115339_Screenshot_2022-12-16-05-50-02-044_com.tencent.mm.jpg",
 "charSet": "UTF-8",
 "result": "{\"label\":\"yss\",\"cid\":\"440************015\",\"cidtype\":\"1000\",\"name\":\"杜**\",\"phone\":\"188******29\",\"encode\":\"l49BgRYoHgYOjGVJo6TxZmha70+LSFrnJ2UpZRuroDbgr/hmzGLsoLQhyE1TmBkm\",\"c\":\"G\",\"t\":1671140993,\"v\":3,\"s\":\"r4us4uH/T+LO2AJClsso/MvZs3YOP4h47rm5RyxvBVkrwudliJNjFBhevkcUKPVB1HWXILwxXIpnT59PUQa1FA==\"}",
 "errMsg": "scanCode:ok"
}
```
对象内的 result 包含二维码的内容，是一个 JSON 格式的字符串。
```javascript
const scanCodeFn = () => {
  uni.scanCode({
    scanType: ['qrCode'], //条形码
    success: function(res) {
      if (res.errMsg == "scanCode:ok") {
        let result = res.result
        // 扫码成功后自己的业务操作
      } else {
        uni.showToast({
          title: '未识别到二维码，请重新尝试！',
          icon: 'none'
        })
      }
    }
  })
}
```
