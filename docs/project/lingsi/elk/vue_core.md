# vue-core的使用
## 下载插件
```shell
npm i vue-cron 
```
## 插件全局引用
```javascript
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

//全局引入
import VueCron from 'vue-cron'
Vue.use(VueCron);//使用方式：<vueCron></vueCron>
```
## 示例
vue-cron 有两个方法：

- change ：失焦后修改时间时触发。
- close ：点击取消按钮时触发。
### HTML部分
```vue
<el-popover v-model="cronPopover">
  <vueCron @change="onChangeCron" @close="cronPopover = false"></vueCron>
    <el-input
  slot="reference"
  @click="cronPopover = true"
  v-model="formData.triggerCron"
  placeholder="请输入定时策略"
  size="small"
    ></el-input>
    </el-popover>
```
### JS部分
```javascript
methods: {
  onChangeCron(v) {
    this.formData.triggerCron = v
  },
}
```
