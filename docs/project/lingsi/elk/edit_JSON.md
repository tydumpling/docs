# JSON 编辑器的使用
vue-json-editor 是一个 json 编辑器，能够格式化 json 数据，同时也支持编辑功能。
## 安装
```shell
yarn add vue-json-editor --save 
```
## 使用

1. 引入模块
2. 注册组件
3. 使用
```javascript
import vueJsonEditor from 'vue-json-editor'
```
```javascript
components: { vueJsonEditor }
```
```vue
<vue-json-editor
  v-model="searchJSON"
  :showBtns="false"
  mode="code"
  lang="zh"
/>
```
## 可用参数

- v-model：双向绑定的数据
- show-btns：是否显示按钮
- mode：模式：tree text form code等
- lang：语言
- expandedOnStart：初始化时，是否自动展开
## 可用事件

- json-change：json 改变时，触发的事件
- json-save：json 保存事件
- has-error：出现错误时，触发的事件
## 整体测试代码
```vue
<template>
  <div style="width: 70%;margin-left: 30px;margin-top: 30px;">
  <vue-json-editor
  v-model="resultInfo"
  :showBtns="false"
  :mode="'code'"

  @json-change="onJsonChange"
  @json-save="onJsonSave"
  @has-error="onError"
  />
  <br>
  <el-button type="primary" @click="checkJson">确定</el-button>
</div>
</template>

  <script>
    // 导入模块
    import vueJsonEditor from 'vue-json-editor'

  export default {
    // 注册组件
    components: { vueJsonEditor },
    data() {
      return {
        hasJsonFlag:true,  // json是否验证通过
        // json数据
        resultInfo: {
          'employees': [
            {
              'firstName': 'Bill',
              'lastName': 'Gates'
            },
            {
              'firstName': 'George',
              'lastName': 'Bush'
            },
            {
              'firstName': 'Thomas',
              'lastName': 'Carter'
            }
          ]
        }
      }
    },
    methods: {
      onJsonChange (value) {
        // console.log('更改value:', value);
        // 实时保存
        this.onJsonSave(value)
      },
      onJsonSave (value) {
        // console.log('保存value:', value);
        this.resultInfo = value
        this.hasJsonFlag = true
      },
      onError(value) {
        // console.log("json错误了value:", value);
        this.hasJsonFlag = false
      },
      // 检查json
      checkJson(){
        if (this.hasJsonFlag == false){
          // console.log("json验证失败")
          // this.$message.error("json验证失败")
          alert("json验证失败")
          return false
        } else {
          // console.log("json验证成功")
          // this.$message.success("json验证成功")
          alert("json验证成功")
          return true
        }
      },
    }
  }
</script>

  <style>
    </style>
```
