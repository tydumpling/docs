# 图片裁剪

## 获取图片

先获取用户选择上传的图片：

```vue
<script setup>
    import { ref } from 'vue'
    
    const imgUrl = ref('')
    const canvasRef = ref(null)
    const imgRef = ref(null)
    const onChangeFn = e => {
        // 获取用户上传的文件
        const file = e.target.files[0]
        
        // 预览文件
        let fr = new FileReader()
        fr.readAsDataURL(file)
        
        // 获取图片读完的图片结果（非同步，需要在onload获取）
        fr.onload = () => {
            imgUrl.value = fr.result
        }
    }
</script>

<template>
	<input type="file" @change="onChangeFn" />
	<img :src="imgUrl" ref="imgRef" />
	<canvas ref="canvasRef" height="200" width="200"></canvas>
</template>
```

## 裁剪图片

裁剪图片使用 `drawImage()` 方法，通过后几位的参数实现裁剪后替换。代码如下所示：

```js
// ...
fr.onload = () => {
	imgUrl.value = fr.result
    
    let ctx = canvasRef.value.getContext('2d')
    
    // 等比计算截取的图片宽高
    let height = (200 / imgRef.value.height) * imgRef.value.naturalHeight
    let width = (200 / imgRef.value.width) * imgRef.value.naturalWidth
    
    ctx.drawImage(imgRef.value, 0, 0, width, height, 0, 0, 200, 200)
}
```

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/info/canvas/tailor" />