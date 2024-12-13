---
title vant组件二次封装
---

# vant组件二次封装

为了更方便复用组件，更贴切业务范围，本项目对 `vant` 的部分组件进行二次封装，提高组件的复用性和可维护性。

## NavBar导航栏

封装导航栏，可以以更少更好记的代码实现大多数页面使用导航栏。封装导航栏需要实现以下几点：

1. 导航栏的标题：类型字符串，非必传，默认为空字符串。
2. 导航栏的左侧文字：类型字符串，非必传，默认为空字符串。
3. 是否显示左侧返回箭头：类型为布尔值，非必传，默认为真。
4. 是否显示右侧内容：类型字符串，非必填，默认为空。
5. 点击左侧事件：通过 `$emit` 子传父在父组件触发事件，部分页面用于清空 `vuex` 和本地存储的内容。

代码如下所示：

```vue
<template>
  <div class="bar">
    <van-nav-bar
    :title="title"
    :left-text="leftText"
    :left-arrow="leftArrow"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <template #right></template>
  </van-nav-bar>
  </div>
</template>

<script>
export default {
  props: {
    leftText: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    leftArrow: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    // 点击左侧触发事件
    onClickLeft() {
      this.$router.back();
      this.$emit('onClickLeft')
    },
    onClickRight() {
      this.$emit("onClickRight");
    },
  },
};
</script>

<style lang="less" scoped>
.bar {
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}
::v-deep .van-nav-bar {
  background-color: #f4f4f4 !important;
}
::v-deep .van-icon {
  color: #555 !important;
}
</style>
```

## Area地区选择器

地区选择器主要封装以下方面：

- 页面上
  1. 添加遮罩层 `van-overlay` ，使得地区选择器弹出后禁止用户滑动底部内容。
- 传参上
  1. `columnsNum` ：通过父组件传递该变量来动态设置显示几级的地区。默认显示2级（即省市）

## 文件上传组件

`vant` 提供了文件上传组件 `Uploader` ，主要做以下几步封装：

- 判断当前的状态 `disabled` ：是否禁用该组件（查看详情时候）
- 判断是否显示叉叉 `deletable` ：查看详情的时候隐藏
- 最大可上传的数据 `maxCount` 。
- 上传的文件类型：默认为图片 `image/*` ，可设置为 `.doc` 、`.pdf` 、`.zip` 等，详情可见原生 `input:file` 框接收文件类型：[限制允许的文件类型](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/file#%E9%99%90%E5%88%B6%E5%85%81%E8%AE%B8%E7%9A%84%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B)。

图片上传主要分为以下几个步骤：

1. 获取到要上传文件
2. 通过 `new FormData().append()` 把获取到的文件转为二进制保存
3. 调用接口上传文件
4. 返回相应的成功或失败提示

部分代码如下所示：

```js
async afterRead(e) {
  if (this.maxCount === 1) {
    e.status = "uploading";
    e.message = "上传中...";
    let forms = new FormData();
    forms.append("file", e.file);
    const res = await this.$api.data.uploadApi(forms);
    if (res.code === 200) {
      Toast(res.msg);
      e.status = "done";
      e.message = "上传成功";
    } else {
      Toast(res.msg);
      e.status = "failed";
      e.message = "上传失败";
    }
    this.$emit("afterReadFn", res.data);
  }
},
```

### 拓展

本项目的用户头像上传实现方式与此相似，通过调用 `input:file` 文件选择框获取文件，调用接口上传文件，如下所示：

```js
async uploadPic(e) {
  let file = e.target.files[0];//获取文件对象
  let type = file.name.split('.')[1].toLowerCase();//获取文件类型
    const flag = this.judgeFileFn(type, 'img') // mixin函数判断是否为图片
  if(!flag) return

  let forms = new FormData();
  forms.append("file", file);
  const res = await this.$api.data.uploadApi(forms);
  if (res.code === 200) {
    Toast(res.msg);
    this.model.avatar = res.data;
  }
},
```

由于是上传头像，因此要手动判断用户上传的文件类型是否为图片：

```js
// 判断上传的文件类型：e文件后缀；type要判断什么类型的文件
judgeFileFn(e, type) {
  switch (type) {
    // 判断其是否为图片
    case 'img':
      if (!/(jpg|jpeg|png|GIF|JPG|PNG)$/.test(e)) {
        Toast('请上传图片！')
        return false
      }
      break;
    default:
      break;
  }
  return true
},
```

