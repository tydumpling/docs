# 自定义样式

地图默认样式是白色底，可以通过相应的 API 实现切换不同种类的样式。

根据 [个性化地图](https://lbs.baidu.com/index.php?title=jspopularGL/guide/custom) 文档可看出，可以通过两种方式实现效果：

1. 通过样式ID调用个性化地图样式

   1. 进入地图开放平台控制台页面，在[我的地图](http://lbsyun.baidu.com/apiconsole/custommap)中，创建一个地图样式：

      ![样式](https://pic.imgdb.cn/item/65fa5f259f345e8d0333630c.png)

   2. 点击创建的地图样式，进入样式编辑器，根据需求自由编辑地图样式：

      ![编辑](https://pic.imgdb.cn/item/65fa5f559f345e8d033423c4.png)

   3. 完成编辑后，在我的地图或者编辑器中发布该地图样式，获取发布后生成的样式ID

   4. 在JavaScript API中应用地图样式

      将第三步中获取的样式ID作为setMapStyleV2方法的参数。(注意：发布的styleID需要与ak为同一个用户)

      ```js
      map.setMapStyleV2({     
        styleId: '3d71dc5a4ce6222d3396801dee06622d'
      });
      ```

2. 通过样式 JSON 文件调用样式

   1. 在编辑界面复制 JSON 文件

      ![json](https://pic.imgdb.cn/item/65fa7d9a9f345e8d03bce80c.png)

   2. 在项目中粘贴，引入使用

      ```js
      import { onMounted, ref } from 'vue'
      import { storeToRefs } from 'pinia'
      import useMapStore from '@/store/index.js'
      import styleJson from '@/assets/json/mapStyle.json'
      
      // 获取pinia仓库内的地图实例
      const { map } = storeToRefs(useMapStore())
      
      onMounted(() => {
          map.value = new BMapGL.Map(container.value)
          // ...
          map.value.setMapStyleV2({ styleJson: styleJson }); // 地图自定义样式
      })
      ```

   通过以上两种方式都能实现地图样式自定义调整。