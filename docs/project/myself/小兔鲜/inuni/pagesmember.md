# 分包

小程序有大小限制，最大体积只能在4MB。在真实项目中，小程序的大小往往会超出这个范围，因此，通过分包可以有效减少小程序主包的体积。

分包还有另外一个好处，减少了主包的体积后加载速度能有效提高，这也是一种优化手段。

实现分包的步骤如下：

1. 新建一个文件夹，该文件夹下是某模块的所有分包。本项目文件夹名称为 `pagesmenber`

2. 新建一个分包页面，如设置页 `settings/index`

3. 在 `pages.json` 文件中设置分包，需要设置两个属性：

   - `subPackages`

     分包规则，数组格式，其中有两个属性。

     1. `root` ：子包目录，即子包的文件夹名称
     2. `pages` ：页面的路径，设置方式和内容同 `pages` 

     代码如下所示：

     ```json
     // 分包规则
     "subPackages": [
       {
         // 子包目录
         "root": "pagesMember",
         // 页面路径
         "pages": [
           {
             "path": "setting/index",
             "style": {
               "navigationBarTitleText": "设置"
             }
           },
           {
             "path": "profile/index",
             "style": {
               "navigationStyle": "custom",
               "navigationBarTextStyle": "white",
               "navigationBarTitleText": "个人信息"
             }
           }
         ]
       }
     ],
     ```

     如果有多个分包模块，则在 `subPackages` 数组内设置多几个对象即可。

   - `preloadRule`

     子包获取资源规则，用于设置某个子包在什么路由下获取资源，在什么网络下获取资源，`key` 是页面路径，`value` 是进入此页面的预下载配置，每个配置有以下几项：

     | 字段     | 类型        | 必填 | 默认值 | 说明                                                         |
     | :------- | :---------- | :--- | :----- | :----------------------------------------------------------- |
     | packages | StringArray | 是   | 无     | 进入页面后预下载分包的 `root` 或 `name`。`__APP__` 表示主包。 |
     | network  | String      | 否   | wifi   | 在指定网络下预下载，可选值为： `all`: 不限网络 `wifi`: 仅wifi下预下载 |

     代码如下所示：

     ```json
     "preloadRule": {
       "pages/my/index": {
         "network": "all",
         "packages": ["pagesMember"]
       }
     }
     ```

     这段代码表示进入我的页面之后就获取 `pagesMember` 文件夹下的分包资源，在任何网络下都获取。

