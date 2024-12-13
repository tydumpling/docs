# SVG 滤镜实现图片故障动画

svg 有很多滤镜效果，可以前往 [SVG Filter](https://yoksel.github.io/svg-filters/#/) 网站自主搭配查看效果。想要实现滤镜效果，需要用到 湍流滤镜和置换滤镜。

湍流滤镜用到了柏林噪声算法，该算法用于生成随机且自然的纹理，如纸张的褶皱、物体粗糙表面等。

置换滤镜可以让turbulence滤镜生成的纹理置换到其他图形或文字上，实现故障效果。

## 搭配

前往上方链接，找到 `feTurbulence` 湍流滤镜和 `feDisplacementMap` 置换滤镜搭配使用，注意放置的顺序，置换滤镜需要放在最后。配置好后右侧效果图会发生相应的样式变化：

![初始效果](https://pic.imgdb.cn/item/67209d65d29ded1a8c121d68.png)

可以看到图中左侧部分有很多配置的参数，下面挑几个重要的参数进行说明：
- `feTurbulence`
  1. `type` 置换滤镜的置换类型，可选 `turbulence` 湍流和 `fractalNoise` ，二者会有噪声的区别。选择 `turbulence` 躁点更尖锐，选择 `fractalNoise` 躁点更柔和。下面来两张效果图对比一下：
    ![turbulence](https://pic.imgdb.cn/item/67209fcdd29ded1a8c143eb3.png)
    ![fractalNoise](https://pic.imgdb.cn/item/67209fe9d29ded1a8c145400.png)
  2. `baseFrequency` 置换滤镜的频率，频率有两个方向，左侧代表横向，右侧代表纵向。数值越小噪声越小，数值越大噪声越大。噪声越小效果会呈一条直线，噪声越大会有很多躁点。下面来两张效果图对比一下：
    ![0，0](https://pic.imgdb.cn/item/6720a0bed29ded1a8c152b65.png)
    ![1，1](https://pic.imgdb.cn/item/6720a0dcd29ded1a8c154ec0.png)
  3. `numOctaves` 置换滤镜的躁点数量，数值越大躁点越多
- `feDisplacementMap`
  1. `scale` 置换滤镜的放大倍率，数值越大柏林噪声对其影响越明显，数值越小柏林噪声对其影响越小，如果设为0则完全无影响。下面来两张效果图对比一下：
    ![scale为0](https://pic.imgdb.cn/item/6720a1ced29ded1a8c162a48.png)
    ![scale为30](https://pic.imgdb.cn/item/6720a1ebd29ded1a8c16411b.png)

搭配好之后，效果图下方会生成相应的代码，复制到自己的项目中即可。

## 实现

### 基本效果

新建一个 `.vue` 组件，放置一个 `img` 标签。想要使用前面搭配好的滤镜效果，需要用到 `svg` 标签包裹着 `defs` 标签，然后把 `copy` 的代码放到 `defs` 标签内。代码如下所示：

```html
<img src="./xxx.jpg" />
<svg style="display: none;">
    <defs>
        <!-- 复制的代码 -->
    </defs>
</svg>
```

然后让 `img` 使用该效果。由于是 `svg` 的滤镜效果，因此使用 `url` ，id 为复制过来 `filter` 标签的 id，可自行更改。

```css
img {
    display: block;
    width: 300px;
    filter: url(#filter);
}
```

此时刷新查看，能够看到图片出现故障效果，只不过没有动画。

### 动画添加

#### 第三方库

想要实现动画效果，无外乎就是改变 `feTurbulence` 滤镜的 `baseFrequency` 参数，修改产生的躁点频率。现在有一个问题，如何修改？它不是 `CSS` 属性，是元素属性，无法用到 `transition` 过渡。

有一个第三方库 `gsap` 可以实现这个功能，GSAP（GreenSock Animation Platform）是一个JavaScript 动画库，提供了丰富的API来创建平滑、高性能的动画效果。下面来看看基本使用：

1. 安装GSAP
    - CDN引入：
        ```html
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
        ```
    - npm引入：
        ```bash
        npm install gsap
        ```

2. 基本动画

    GSAP提供了几种基本的动画函数：
   - gsap.to()：最常用的动画类型，从当前状态开始动画到指定状态。
   - gsap.from()：与gsap.to()相反，从指定状态动画到当前状态。
   - gsap.fromTo()：可以自定义开始和结束状态。
   - gsap.set()：立即设置属性，没有动画效果。

3. 时间轴（Timeline）
    GSAP的时间轴功能允许你将多个动画组合在一起，并精确控制它们的执行顺序。以下是一个使用时间轴的示例：

    ```javascript
    const timeline = gsap.timeline();
    timeline
        .to("#box1", { x: 300, duration: 1 })
        .to("#box2", { x: 300, duration: 1 })
        .to("#box3", { x: 300, duration: 1 });
    ```
    在这个例子中，三个元素将依次向右移动300px

4. 控制动画
    GSAP允许你在运行时动态控制动画，例如暂停、恢复、反转等：

    ```javascript
    let tween = gsap.to("#box", { x: 100, duration: 1 });
    // 播放动画
    tween.play();
    // 暂停动画
    tween.pause();
    // 恢复动画
    tween.resume();
    // 反转动画
    tween.reverse();
    ```
    这些方法提供了对动画的细粒度控制

#### 代码实现
使用时间线告诉它把什么东西变成什么样子，这里要把频率的数字从 0.4 变为 0.001，持续时间为 0.2，每一次 `.to()` 就是执行了一次动画。

在 `onUpdate` 回调函数可以查看该值的变化，把变化后的值赋值给 `feTurbulence` 标签的 `baseFrequency` 属性。还能设 `paused` 为 `true` 一开始让这个函数暂停，通过 `tl.play()` 让他启动。动画执行完后还能 `tl.restart()` 重来。

代码如下：
```js
const tb = document.querySelector('feTurbulence')
const tl = new gsap.timeline({
    paused: true,
    onUpdate() {
        console.log(val.value);
        tb.setAttribute('baseFrequency', `0 ${val.value}`)
    }
});
const val = {
    value: 0.4
}
tl.to(val, {
    value: 0.001,
    duration: 0.2,
})
tl.to(val, {
    value: 0.4,
    duration: 0.2,
})

const img = document.querySelector('img')
img.onload = () => {
    tl.play();
}
if(img.complete) {
    tl.play();
}
```

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/info/css/svgFilter" />