# Svg组件封装

在 `vue3` 项目中，可以通过第三方库 `vite-plugin-svg-icons` 封装一个 `svg` 组件全局使用，通过父子传参设置 `svg` 图标的宽高、颜色等。

下载依赖：

```
pnpm i vite-plugin-svg-icons
```

在 `vite.config.js` 文件中引入，配置 `svg` 图标存放的文件路径和使用名称格式：

```js
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // ...
    }),
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
      // Specify symbolId format
      symbolId: 'icon-[dir]-[name]',
    }),
    Components({
      // ...
    })
  ],
  // ...
})
```

封装子组件：

```vue
<script setup>
const {width, height} = defineProps({
    //xlink:href属性值的前缀
    prefix: {
        type: String,
        default: '#icon-'
    },
    //svg矢量图的名字
    name: String,
    //svg图标的颜色
    color: {
        type: String,
        default: ""
    },
    //svg宽度
    width: {
        type: [String, Number],
        default: '16'
    },
    //svg高度
    height: {
        type: [String, Number],
        default: '16'
    }
})

const svgRef = ref(null)

const widthUnit = computed(() => typeof width === 'string' && width.includes('px') ? width : width / 16 + 'rem')
const heightUnit = computed(() => typeof height === 'string' && height.includes('px') ? height : height / 16 + 'rem')
</script>

<template>
    <svg :style="{'width': widthUnit, 'height': heightUnit}" ref="svgRef">
        <use :xlink:href="prefix + name"
            :fill="color"></use>
    </svg>
</template>

<style scoped>
svg {
    transition: fill .5s cubic-bezier(0.89, 0.04, 0.96, 0.06);
    fill: var(--normal-word);
}
</style>
```

父组件使用：

```vue
<SvgIcon class="card-svg-dog"
	name="dog"
	width="50px"
	height="50px" />
```

