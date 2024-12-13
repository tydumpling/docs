# Bug 修改

## _commonHelpers.js 文件404

### 问题描述

在进入xlsx与word使用的页面中，组件引入 `_commonHelpers.js` 文件出现 404 错误，但是 `dist` 打包文件内有该文件。

### 解决方案

百度搜索问题时一开始没往这方面想，直到看到思否有一篇文章 [如何解决 Vue3 应用在 GitHub Pages 上部署后 404 问题？](https://segmentfault.com/q/1010000045471760) ，它的答案解释了缘由，github pages 会屏蔽下划线开头的文件。附带了一篇链接 [vue3 - Vue 项目处理GitHub Pages 部署后 _plugin-vue_export-helper.js 404](https://blog.csdn.net/iotjin/article/details/133136094)。

因此解决方案就是改写打包配置，把所有下划线等符号去掉。

### 代码展示
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// eslint-disable-next-line no-control-regex
const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;

export default {
    outDir: 'docs',
    rollupOptions: {
      output: {
        // https://github.com/rollup/rollup/blob/master/src/utils/sanitizeFileName.ts
        sanitizeFileName(name) {
          const match = DRIVE_LETTER_REGEX.exec(name);
          const driveLetter = match ? match[0] : "";
          // A `:` is only allowed as part of a windows drive letter (ex: C:\foo)
          // Otherwise, avoid them because they can refer to NTFS alternate data streams.
          return (
            driveLetter +
            name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "")
          );
        },
      },
    },
};
```