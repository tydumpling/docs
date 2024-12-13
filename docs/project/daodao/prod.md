# 优化

## 图片处理

### 懒加载与占位图

在进入文章列表和效果列表时，由于图片资源较多，需要一定的时间进行加载，图片未加载时样式相对丑陋。为了提升使用体验，在图片未加载时使用占位图来代替图片，待图片加载完毕后再替换原图。

除此之外还运用到了懒加载，还未出现在视口内的图片会先不加载，出现在视口内之后才加载。

为了方便使用管理和后续维护，封装一个 `my-image` 组件，将图片的懒加载和占位图功能封装在其中。在 `my-image` 组件中，通过封装 `v-lazy` 自定义指令实现懒加载，通过 `:data-src` 属性绑定图片的地址，通过 `src` 属性绑定占位图的地址。

- 自定义指令
  自定义指令主要通过 `IntersectionObserver` API 判断当前元素是否出现在视口内，出现在视口内则通过 `getAttribute` 获取自定义元素的 `data-src` 属性，将其赋值给 `src` 属性。然后取消监听。
  ```js
  import imgErr from '@/assets/img/base/img_err.png';

    // IntersectionObserver API
    const ob = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
            // 出现在视口中
            const img = entry.target;
            const src = img.getAttribute('data-src'); // 获取图片的src属性
            img.src = src; // 设置图片的src属性
            img.onload = () => {
                img.setAttribute('class', 'fade-in');
            }
            img.onerror = () => {
                img.src = imgErr; // 设置图片的src属性为错误图片
            }
            ob.unobserve(entry.target);
            }
        }
    })

    export default {
        mounted(el, binding) {
            // 判断当前元素是否在视口之上或者视口内，在的话不需要播放动画
            // if (!isBelowViewPort(el)) return;
            ob.observe(el); // 观察元素是否进入视口
        },
        unmounted(el) {
            ob.unobserve(el); // 元素卸载后断开观察
        }
    }
  ```
  还有一下小细节比如图片加载失败后用失败占位图来代替，图片加载成功后添加 `fade-in` 动画等，这里不做过多赘述。
- 组件
  ```vue
  <script setup>
    defineProps({
        src: {
            type: String,
            required: true,
        },
        alt: {
            type: String,
            default: '占位图片',
        },
    })
    </script>

    <template>
        <img src="@/assets/img/base/img_load.png"
            v-lazy
            :data-src="src"
            :alt="alt" />
    </template>

    <style lang="less" scoped>
    img {
        width: 100%;
        height: 100%;

        &.fade-in {
            animation: fadeIn .6s ease-in;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    </style>
  ```

### 预加载

部分图片如占位图、`nav` 标签背景图等，在网络不是太好时没加载出来。为了提升使用体验，提前将图片资源加载到浏览器缓存中。

预加载通过 `<line href="图片资源路径" rel="preload" as="image" />` 标签实现，为了方便后续维护，新建一个 js 文件专门处理预加载。

1. 引入所有需要预加载的图片资源
2. 遍历，创建 `link` 标签，为 `href` 属性赋值，添加到 `head` 中
3. 在 `main.js` 引入该文件

```js
import img_err from '../assets/img/base/img_err.png';
import img_load from '../assets/img/base/img_load.png';
import left_active from '../assets/img/base/left_active.png';
import left_inactive from '../assets/img/base/left_inactive.png';
import right_inactive from '../assets/img/base/right_inactive.png';
import right_active from '../assets/img/base/right_active.png';

const data = {
  img_err,
  img_load,
  left_active,
  left_inactive,
  right_inactive,
  right_active,
};

const createPreloadLink = () => {
  Object.keys(data).forEach((key) => {
    const path = data[key];
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    document.head.appendChild(link);
  })
}

createPreloadLink();
```