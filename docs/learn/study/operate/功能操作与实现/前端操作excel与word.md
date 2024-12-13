# 前端操作excel与word

## Excel

|              | 通用 | Vue               | React             |
| ------------ | ---- | ----------------- | ----------------- |
| 解析内容操作 | xlsx | xlsx              | xlsx              |
| 预览         | xlsx | @vue-office/excel | react-file-viewer |

### 前端excel转为表格或数据

1. 通过 `arrayBuffer` 方法把 `blob` 转为二进制

2. 引入 `xlsx` 库中的 `read` 方法，读取其数据对象，查看打印

   - `SheetNames` ：`excel` 表中所有表的表名，逗号隔开的数组
   - `Sheets` ：每一个表格中包含的数据的数组对象

3. 通过 `utils` 中的 `sheet_to_json` 方法把晦涩难用的数据转为数组格式

4. 通过 `utils` 中的 `sheet_to_html` 方法把晦涩难用的数据转为 `html` 

**代码**

```vue
<template>
  <div id="app">
    <div class="excel-content" v-html="excelHTML"></div>
  </div>
</template>

<script>
import { read, utils } from "xlsx";
export default {
  data() {
    return {
      excelHTML: ''
    };
  },
  methods: {
    change(e) {
      let file = e.target.files[0] // 读取文件数据
      file.arrayBuffer().then((res) => {
        const wb = read(res) // 读取数据

        const sheet1 = wb.Sheets.Sheet1 // 取表，为一个对象
      
        const data = utils.sheet_to_json(sheet1) // utils的方法，可以把获取到的混乱的数据转为数组的形式
        const html = utils.sheet_to_html(sheet1) // utils的方法，可以把获取到的混乱的数据转为html

        this.excelHTML = html
      })
    }
  },
};
</script>
```

> 注意：
>
> 前端通过接口请求获取的 `blob` 格式数据也可以使用该方法。

### 前端对象或表格dom转为excel

- 通过 `utils` 中的 `xx_to_sheet` 方法转为 `sheet` 对象

  数组变量数据转为 `sheet` 对象可以用 `json_to_sheet` 方法；`table` 的 `dom` 元素转换可以使用 `table_to_sheet` 方法

- 通过 `xx_to_sheet()` 方法转为 `workBook` 对象，括号内传入对应的表格

- 通过 `book_new()` 方法创建数据

- 通过 `wirteFile()` 方法写入 `excel` 。第一个参数为`book_new()` 创建的数据，第二个参数为 `excel` 名称

**代码**

```vue
<template>
  <div id="app">
    <div class="excel-content" v-html="excelHTML"></div>
  </div>
</template>

<script>
import { writeFile, utils } from "xlsx";
export default {
  data() {
    return {
      excelHTML: ''
    };
  },
  methods: {
    createExcel() {
      // 转换data数组数据
      let data = [
          {name: 'tydumpling', age: 18},
          {name: 'xiaodao', age: 20},
          {name: 'duyidao', age: 23},
      ]
      const ws = utils.json_to_sheet(data)
      const wb = utils.book_new()
      utils.book_append_sheet(wb,ws, 'sheet1')
      wirteFile(wb, 'test.xlsx')

      // 转换table dom
      const tableDom = this.$refs.table // 获取节点
      const tableWs = utils.table_to_sheet(tableDom)
      const wb2 = utils.book_new()
      utils.book_append_sheet(wb2,tableWs, 'sheet1')
      wirteFile(wb2, 'tableTest.xlsx')
    }
  },
};
</script>
```

### 第三方库实现在线预览

- 下载依赖
  ```
  npm i @vue-office/excel
  ```

- 引入第三方库

  ```js
  import vueofficeExcel from '@vue-office/excel'
  ```

- 为组件的 `src` 属性赋值
  
  允许接收以下三种情况：
  
  1. 把后端返回的 `excel` 路径传给他的 `src` 

    ```vue
    <vueofficeExcel :src="excelSrc" />
    ```

  2. 后端返回的是一个 `blob` 流，则转为 `base64` 

    ```js
    const file = res.data.file
    const fr = file.FileReader()
    fr.readAsDataURL(file)
    fr.onload = (e) => {
        this.excelSrc = e.target.result
    }
    ```
  3. 本地资源，放在public内直接通过路径传递即可

### 总结

无论是 `word` 还是 `excel` 做预览要么是线上地址，要么是 `dataurl` ，如果后端返回的是地址直接使用，如果是 `blob` 则通过 `readAsDataURL` 方法转为 `base64` 即可。

### 拓展

`react` 的第三方库 `fileviews` 可支持阅读多种文件格式，接收两个参数字段：

- `filePath` ：指定要读的文件地址
- `fileType` ：指定要读的文件类型

## Word

|              | 通用                | Vue              | React             |
| ------------ | ------------------- | ---------------- | ----------------- |
| 解析内容操作 | docxtemplater       | docxtemplater    | docxtemplater     |
| 预览         | mammothdocx-preview | @vue-office/docx | react-file-viewer |

### 组件预览

- 下载依赖
  ```
  npm i @vue-office/docx
  ```
- 引入第三方组件

  ```js
  import vueofficedocx from '@vue-office/docx'
  ```

- 获取 `input` 框上传的文件，转为 `dataurl` 格式即可

  ```js
  const changeFn = e => {
    const file = e.data.files[0]
    const fr = new FileReader()
    fr.readAsDataURL(file)
    fr.onload = (e) => {
        this.wordSrc = e.target.result
    }
  }
  ```

- 把变量给组件的 `src` 属性

  ```vue
  <vueofficedocx :src="wordSrc" />
  ```

### mammon预览

- 下载依赖
  ```
  npm i docx-preview
  ```
- 功能实现
  1. 获取文件二进制流
  2. 通过 `renderAsync` 方法读取

  ```js
  import {renderAsync} from 'docx-preview'
  change(e) {
    let file = e.target.files[0] // 读取文件数据
    renderAsync(file, this.$refs.docxPreview)
  }
  ```

### docxtemplater预览

1. 获取文件二进制流
2. 转为 `arrayBuffer` 
3. 压缩形成压缩包
4. 转为二进制流
5. 保存

```js
change(e) {
  let file = e.target.files[0] // 读取文件数据
  file.arrayBuffer().then((res) => {
    let zip = new PizZip(res)
    const doc = new Docxtemplater(zip)
    doc.setData(data)
    doc.render()
    const put = doc.getZip().generate({
      type: 'blob',
      mimeType: '二进制流'
    })
    saveAs(put, 'test.docx')
  })
}
```

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/detail/learn/xlsxAndWord" />