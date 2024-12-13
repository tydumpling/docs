

## 一面

### Q：描述 script 标签放在 HTML 结构前和结构后的区别

JavaScript 是一个单线程语言，自上而下执行，如果把 `script` 放在 `body` 前面，则会先执行 `js` 代码，再往下执行，如果 `js` 代码耗时过长，会造成页面渲染的阻塞。

且如果 `js` 代码中获取了真实 DOM 节点也会报错，因为此时 DOM 节点还未渲染。

### Q：如果我想把 script 放到前面且不阻塞后续 HTML 的渲染，怎么解决？

有 async：

```HTML
<script async src="script.js"></script>
```

有 async，会在 HTML 文档解析时并行下载文件，并在下载完成后立即执行（暂停 HTML 解析）。

有 defer：

```HTML
<script defer src="myscript.js"></script>
```

有 `defer`，加载后续文档元素的过程将和 script.js 的加载并行进行（异步），但是 script.js 的执行会在所有元素解析完成之后，DOMContentLoaded 事件触发之前完成。

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83df384b7a5c4736a12ee295ad1a6a6b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

总结

对于 `defer`，我们可以认为是将外链的 js 放在了页面底部。js 的加载不会阻塞页面的渲染和资源的加载。不过 defer 会按照原本的 js 的顺序执行，所以如果前后有依赖关系的 js 可以放心使用

`async` 和 `defer` 一样，会等待的资源不会阻塞其余资源的加载，也不会影响页面的加载。但是有一点需要注意下，在有 `async` 的情况下，js 一旦下载好了就会执行，所以很有可能不是按照原本的顺序来执行的。如果 js 前后有依赖性，用 `async`，就很有可能出错。

> 动态添加的标签隐含 `async`属性

Defer 和 async 的相同点

- 加载文件时不阻塞页面渲染
- 对于 `inline` 的 `script` 无效
- 使用这两个属性的脚本中不能调用 `document.write` 方法
- 有脚本的 `onload` 的事件回调

Defer 和 async 的区别

- html4.0 中定义了 `defer`；html5.0 中定义了 `async`
- 浏览器支持不同
- 加载时机：
  - 具有 `async` 属性的脚本都在它下载结束之后立刻执行，同时会在 window 的 load 事件之前执行。所以就有可能出现脚本执行顺序被打乱的情况；
  - 具有 `defer` 属性的脚本都是在页面解析完毕之后，按照原本的顺序执行，同时会在 document 的 `DOMContentLoaded` 之前执行。

使用这两个属性会有三种可能的情况

- 如果 `async` 为 true，那么脚本在下载完成后异步执行。
- 如果 `async` 为 false，`defer` 为true，那么脚本会在页面解析完毕之后执行。
- 如果 `async` 和 `defer` 都为 false，那么脚本会在页面解析中，停止页面解析，立刻下载并且执行

### Q：标准盒子模型和怪异盒子模型设置宽度的区别？

盒模型中又包含了以下几个元素： (1) 内容（`content`） （2）填充（`padding`) 3.边框（`border`） （4）边距（`margin`）

![盒模型的组成.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f26ecfea47034b9b8819f12d3c6f080a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

- 标准盒子模型=`content`(内容)+`border`(边框)+`padding`(内边距)
- 怪异盒子模型=`content`(内容)(已经包含了 `padding` 和 `border`)

1. 设置标准盒模型

   ```css
   box-sizing: content-box;
   ```

   标准盒模型的组成

   ![标准盒模型](https://pic.imgdb.cn/item/65473359c458853aef6b0f47.jpg)

   标准盒模型的宽度高度指的是由content(内容)+border(边框)+padding(内边距)三部分组成的宽高,改变其中任意组成部分宽高会造成盒子整体大小发生改变

2. 怪异盒模型

   ```css
   box-sizing: border-box;
   ```

   怪异盒模型的组成

   ![怪异盒模型](https://pic.imgdb.cn/item/654733a6c458853aef6c10e9.jpg)

   标准盒模型的内容组成是一个整体,改变怪异盒模型的组成部分的宽高不会造成盒子整体大小发生改变,而是内部重新分配组成部分的宽高,如果需要改变怪异盒模型大小,只需设置当前盒子宽高即可。

###  Q：暗黑模式功能怎么实现？

从最简单的思路开始：

1. 首先思路是当页面加载进来的时候进行一个判断，是普通模式还是暗黑模式。
2. 然后根据不同的模式，赋予变量不同的值。

具体代码实现，用less来举例：

1. 需要有一个 `light.less` 文件：定义高亮模式变量值

2. 需要有一个 `dark.less` 文件：定义暗黑模式变量值

3. 需要一个 `mode.less` 文件，导入 `light.less` 和 `dark.less` 

4. 用媒体查询 `@media` 判断设备

   CSS有一个特别强大的特性，那就是媒体查询@media，CSS的@media规则可以用于有条件地将样式应用于文档以及其他各种上下文和语言，如HTML和JavaScript。在W3C的 Media Queries Level 5 引入了**“用户首选媒体特性”**，即**Web网站或应用程序检测用户显示内容的首先方式的方法。**

   ```css
   @media (prefers-color-scheme: 属性值) {}
   ```
   属性值：

   - `no-preference` 表示用户未制定操作系统主题。作为布尔值时，为 false 输出。
   - `light` 表示用户的操作系统是浅色主题。
   - `dark` 表示用户的操作系统是深色主题。

5. 具体判断操作，在 `mode.less` 里编写

   ```css
   body {
       .varsLight();
   }
   
   @media (prefers-color-scheme: dark) {
       body {
           .varsDark();
       }
   }
   ```

   所有页面默认采用的是高光模式。只有用户想要使用暗黑模式的时候，暗黑模式才会根据媒体查询的判断开始生效。

6. 把mode文件，导入到总的样式文件里

7. 最后我们需要在兼容高亮模式和暗黑模式的元素类的属性里，把具体值替换成变量。

> 注意
>
> 做页面有一个原则就是，越有个性的东西，就要越放在后面，导入顺序也要靠后，避免后续样式冲突。所以，在暗黑模式中，当我们要设置一些个性化的变量的时候，比如高光模式下，有一个元素有背景图，但是暗黑模式下没有背景图。这种我们就要放到单独的样式文件里，不能放到 `dark.less` 、`light.less` 、`mode.less` 这类文件里。

### Q：子元素相对父元素水平垂直居中的方法。

1. flex 布局

   给父元素设置 `flex` 布局，代码如下：

   ```css
   .parent {
     display: flex;
     justify-content: center;
     align-items: center;
   }
   ```

2. 定位 + transform

   ```css
   .parent {
     position: relative;
   }
   .children {
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
   }
   ```

3. 定位 + margin

   ```css
   .parent {
     position: relative;
   }
   .children {
     position: absolute;
     top: 0;
     left: 0;
     right: 0;
     bottom: 0;
     margin: auto;
   }
   ```

4. grid

   ```css
   .parent {
     display: grid;
   }
   .children {
     align-self: center;
     justify-self: center;
   }
   ```

### Q：移动端适配的方案有哪些？

前言，先来认识一下em：

em是相对长度单位。相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。

em特点：

- em的值并不是固定的
- em会继承父级元素的字体大小

> 注意
>
> 任意浏览器的默认字体高都是16px。所有未经调整的浏览器都符合: 1em=16px。那么12px=0.75em,10px=0.625em。为了简化font-size的换算，需要在css中的body选择器中声明Font-size=62.5%，这就使em值变为 16px*62.5%=10px, 这样12px=1.2em, 10px=1em, 也就是说只需要将你的原来的px数值除以10，然后换上em作为单位就行了。

所以我们在写CSS的时候，需要注意几点：

- body选择器中声明Font-size=62.5%；
- 将你的原来的px数值除以10，然后换上em作为单位；
- 重新计算那些被放大的字体的em数值。避免字体大小的重复声明。也就是避免1.2 * 1.2= 1.44的现象。比如说你在#content中声明了字体大小为1.2em，那么在声明p的字体大小时就只能是1em，而不是1.2em, 因为此em非彼em，它因继承#content的字体高而变为了1em=12px。

接下来，我们来看移动端适配的几种方案：

1. rem方案

   rem是CSS3新增的一个相对单位（root em，根em）。这个单位与em的区别在于rem相对的是HTML根元素。这个单位可谓集相对大小和绝对大小的优点于一身，通过它既可以做到只修改根元素就成比例地调整所有字体大小，又可以避免字体大小逐层复合的连锁反应。目前，除了IE8及更早版本外，所有浏览器均已支持rem。对于不支持它的浏览器，应对方法也很简单，就是多写一个绝对单位的声明。这些浏览器会忽略用rem设定的字体大小。下面就是一个例子：

   ```css
   p {
       font-size:14px;
       font-size:.875rem;
   }
   ```

   原理：

   rem 是相对长度单位，相对html元素（文档根元素`doucment.documentElement` ）计算值的倍数。根据屏幕宽度设置html标签的 `font-size` ，在布局时使用rem 单位，达到自适应的目的，是弹性布局的一种实现方式。

   当页面全屏显示时，设置 html 默认字体大小为100px，则子元素中1rem就等于100px，相当于设计稿中的1px等于0.01rem，使用的时候设计稿中的尺寸直接除以100，100px就是1rem，10px就是0.1rem。

   当页面缩放后，需要重新计算html的字体大小

   PC端使用相关Js代码如下：

   ```js
   export default class Rem {
       static init(){
       	//设置默认尺寸
           Rem.defaultStyle();
           //缩放后，重新计算html字体大小
           Rem.resizeHandler();
           //监听浏览器缩放事件
           window.addEventListener("resize", Rem.resizeHandler);
       }
       //计算html字体大小
       static resizeHandler() {
           let contW = Math.floor(document.documentElement.clientWidth);
           let fontS = (contW / screen.width) * 100;
           document.documentElement.style.fontSize = fontS + "px";
       }
       //设置html默认字体为100px body字体为16px
       static defaultStyle(){
           document.documentElement.style.fontSize = "100px";
           document.body.style.fontSize = "16px";
       }
       //px 转换成 rem
       static getRem(size) {
           var fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
           return size / fontSize;
       }
   }
   ```

   移动端使用相关JS代码如下（设计图尺寸以750为例）：

   ```js
   (function(w){
       var docEl=w.document.documentElement;
       var timer;
       function refersh(){
     		var width=docEl.getBoundingClientRect().width;
     		if(width>750) width=750;
     		var rem = width/7.5;
     		docEl.style.fontSize=rem+"px";
   	}
   
   	w.addEventListener("resize",function(){
     		timer && clearTimeout(timer);
     		timer=setTimeout(refersh,400)
   	})
   
   	w.addEventListener('pageshow', function () {
     		timer && clearTimeout(timer);
     		timer = setTimeout(refersh, 400)
   	})
   })(window)
   ```

   使用rem方案的优点：

   兼容性好，除了IE8及更早版本外，所有浏览器均已支持rem。

   缺点：

   1. 不是纯css移动适配方案，需要引入js脚本，监听浏览器窗口缩放行为动态改变根元素的字体大小。css样式和js代码有一定耦合性，并且必须将改变 font-size 的代码放在css样式之前。
   2. 小数像素问题，浏览器渲染最小的单位是像素，元素根据屏幕宽度自适应，通过 rem 计算后可能会出现小数像素，浏览器会对这部分小数四舍五入，按照整数渲染。浏览器在渲染时所做的摄入处理只是应用在元素的尺寸渲染上，其真实占据的空间依旧是原始大小。也就是说如果一个元素尺寸是 0.625px，那么其渲染尺寸应该是 1px，空出的 0.375px 空间由其临近的元素填充；同样道理，如果一个元素尺寸是 0.375px，其渲染尺寸就应该是0，但是其会占据临近元素 0.375px的空间。会导致：缩放到低于1px的元素时隐时现（解决办法：指定最小转换像素，对于比较小的像素，不转换为 rem 或 vw）；两个同样宽度的元素因为各自周围的元素宽度不同，导致两元素相差1px；宽高相同的正方形，长宽不等了；border-radius: 50% 画的圆不圆。
   3. Android 浏览器下 line-height 垂直居中偏离的问题。常用的垂直居中方式就是使用line-height，这种方法在Android设备下并不能完全居中。
      cursor: pointer 元素点击背景变色的问题，对添加了cursor:pointer属性的元素，在移动端点击时，背景会高亮。为元素添加 `tag-highlight-color:transparent` 属性可以隐藏背景高亮。

2. vw/vh方案

   视口是浏览器中用于呈现网页的区域，也就是用户所能看到的页面区域。

   - 1vw，等于视口宽度的1%；
   - 1vh，等于视口高度的1%；
   - vmin，选取vw和vh中最小的那个值；
   - vmax，选取vw和vh中最大的那个值；

   使用的时候，所有的px单位除以100，也可以通过css预处理器将px单位转换为vw。以1080px设计稿为基准，转化的计算为

   ```js
   // 以1080px作为设计稿基准
   $vw_base: 1080
   @function vw($px) {
       @return($px / 1080) * 100vw
   }
   ```

   优点：

   - 纯css移动端适配方案，不存在脚本依赖的问题；
   - 根据视口宽度的百分比来定义元素宽度，计算方便；

   缺点：

   存在兼容问题，只在移动端 iOS 8 以上以及 Android 4.4 以上获得支持；

3. rem+vw方案

   vw/vh方案计算方便，能够很好地实现适配效果，但是存在一定的兼容问题，将vw/vh方案和rem方案相结合，设置html元素的font-size单位为vw，然后在布局中直接使用rem单位。

   例如，设计稿的宽度为750px，则1vw=7.5px，为了方便计算，我们将html元素的font-size大小设置为100px，也就是13.333vw=100px。

   ```css
   html {
       font-size:13.333vw;
   }
   ```

   设置 `html{font-size:13.333vw}` ，在样式代码中 `1rem=13.333vw=100px` ，即 `1rem` 等于设计稿上的 `100px` ，使用的时候除以100，直接小数点向左移动2位，1rem等于100px，那么10px就是0.1rem。

   这样的好处是不需要使用postcss-pxtorem 插件来转换单位，如果使用插件，想写px的地方还需要设置propList或者selectorBlackList。使用这种方案的话就不存在这个问题了，想用相对单位就写rem，想用绝对单位就写px，不需要其他的设置。

   优点：

   从rem方案过渡到vw，只是需要通过改变根元素字体大小的计算方式，将单位改成vw，不需要其他处理。

   缺点：

   这种方案只对手机的兼容性很好，ipad或者是pc端的效果就不是很好。因为根节点的字体单位使用的是vw，当设备的宽度越来越大时，使用rem做单位的元素也会越来越大，以至于在ipad或者是pc上展示的效果会很差。

   解决方案：当屏幕过大的时候，我们可以使用媒体查询来限制根元素的字体大小，实现对页面的最大最小宽度限制。

   例如，在样式中加上这句代码，在pc上效果也很不错了。

   ```css
   @media (min-width: 560px) {
     html {
       font-size: 54px;
     }
   }
   ```

4. 百分比

   相对于父元素的宽度，使用百分比的单位来定义子元素的宽度。子元素的高度使用px来定义，使用max-width/min-width 控制子元素的最大最小尺寸。

   | 属性                  | 参考对象                 |
   | --------------------- | ------------------------ |
   | height/width          | 相对于子元素的直接父元素 |
   | top/bottom/left/right | 相对于有定位属性的父元素 |
   | padding/margin        | 相对于直接父元素         |
   | border-radius         | 相对于自身               |

   **优点是**原理简单，不存在兼容性问题。

   缺点：

   - 字体大小无法随着屏幕大小变化而改变；
   - 设置盒模型的不同属性时，其百分比设置的参考元素不唯一，容易使布局问题变得复杂。

5. 基于媒体查询的响应式设计

   基于媒体查询的响应式设计，响应式设计，使得一个网站可以同时适配多种设备和多个屏幕，让网站的布局和功能随用户的使用环境（屏幕大小、输出方式、设备/浏览器）而变化，使其视觉合理，交互方式符合习惯。

   css3中的@media，通过给不同分辨率的设备编写不同的样式规则实现响应式布局，使一个网站可以在不同尺寸的屏幕下显示不同的布局效果。主要用来解决不同设置不同分辨率之间的兼容问题，一般是指pc、平板、手机设备之间较大的分辨率差异。实现上不局限于具体的方案，通常是结合流式布局和弹性布局方案。比如给小屏幕手机设置@2x图，给大屏手机设置@3x图。

   ```css
   @media only screen and (min-width: 375px){
       /*样式1*/
   }
   @media only screen and (min-width: 750){
       /*样式2*/
   }
   ```

   优点：

   能够使网页在不同设备、不同分辨率的屏幕上呈现合理布局，不单单是样式伸缩变换。

   缺点：

   - 如果要匹配足够多的设备与屏幕，一个web页面需要多个设计方案，工作量比较大。
   - 通过媒体查询技术需要设置一定量的断点，到达某个断点前后的页面发生突兀变化，用户体验不太友好。
     总结

> 总结
>
> 对于上述的各种移动端web页面自适应方案来说，都存在着一些优势和不足。对于国内的一些互联网站，通过查看网页源代码发现，它可能不是某一种方案的单独使用，而是几种方案的结合。一个页面上，元素的宽度设置上有百分比，也有rem，字体的样式中有rem，有em，也有固定大小的px；在屏幕宽度过大时不再缩放，也会用到媒体查询，并且响应式设计更多地可能是针对不同设备间的自适应。对于移动端web页面的自适应方案来说，现在用的比较多的是rem，逐渐向vw/vh发展，而rem+vw/vh则是作为vw/vh向后兼容的一种过渡。

### Q：在 Vue2 的 mounted 生命周期为对象添加一个新的属性是否是响应式？

考察的是响应式的原理与 `Object.defineProperty` 的缺陷。

在回答的时候我还说了 `$set()` 源码的逻辑，是手动触发 Watcher 的 `set` 方法，然后调用 `_update` 更新视图。

### Q：为什么 Vue3 直接为对象的新属性赋值能保持响应式？

Vue3 的响应式原理：proxy和Refect。

### Q：Vue 中父组件提供数据，子组件直接共享该数据且能够改变，有什么思路？

我一开始回答了 Vuex，没有想到其他的回答了。然后面试官引导我 Vue2 和 Vue3 组件最大的区别在哪里。我没能回答出来。他说最大的区别是 Vue3 响应式数据的使用。即 useXxxx 的 hooks。因此这也是一个思路。

PS：听到这里为了表现出我知道这个东西，我立刻提出了 `mixin` 这个概念，毕竟 Vue3 的 hook 就是为了解决 `mixin` 的弊端。

### Q：.vue 文件 怎么通过打包工具在浏览器运行的？

没能回答出来，后续看了一下这篇文章获取有帮助：[手把手教你处理 Vue 文件并渲染到页面]([没想到这么简单！手把手教你处理 Vue 文件并渲染到页面 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/535102297))

### Q：处理跨域的方法。

我回答了 ngnix 代理、后端配置、开发时的 devServe 三方面。

### Q：安装依赖时 ^3.2.0 表示什么意思？

**波浪符号（~）**：他会更新到当前minor version（也就是中间的那位数字）中最新的版本。举个例子：body-parser:~1.15.2，这个库会去匹配更新到1.15.x的最新版本，如果出了一个新的版本为1.16.0，则不会自动升级。波浪符号是曾经npm安装时候的默认符号，现在已经变为了插入符号。

**插入符号（^）**：这个符号就显得非常的灵活了，他将会把当前库的版本更新到当前major version（也就是第一位数字）中最新的版本。举个例子：bluebird:^3.3.4，这个库会去匹配3.x.x中最新的版本，但是他不会自动更新到4.0.0。

> 总结
>
> **~1.15.2 :=  >=1.15.2 <1.16.0**   
>
> **^3.3.4 := >=3.3.4 <4.0.0**

### Q：安装依赖时项目安装了 A 包，A包因为需要使用到B包因此它自动安装B包的依赖，此时 package.json 没有 B包的依赖安装信息，项目中可以使用 B 包吗？

可以，隐患是版本更新的问题，依赖是在A包上，而B包的依赖更新控制权拱手给了A包，因此无法自主操控B包的版本更新。

### Q：canvas 上画图片，不同屏幕比例有区别的原因？

没答出来，面试官让我去学习适配像素点的知识点。

### Q：TS参与程序的运行时吗？

不参与，ts 它是编译型语言。

### Q：TS 中 any 和 unknown。

一个变量是any型，后续赋值任何类型都不会报错；但一个变量一开始是 unknown，后续第一次赋值则会成为该变量的类型，后面赋值其他类型就会报错。

面试官：“如果一个 unknown 类型我想使用函数类型的方法，且不能直接把它设置为 function （必须是 unknown）该怎么办？”

我：“用 as 断言成函数型。”

### Q：TS 函数重载和函数重写。

没回答出来，需要百度一下。

## 二面

### Q：Vue3 响应式用的 proxy，有多少个方法？

未能回答出来。

### Q：SEO 项目怎么实现？

未能回答出来。面试官引申到 SEO 的原理，需要 SSR 服务端渲染，并提到 VUE 官方文档有提到这方面，引导我去回答。可惜没有这方面的知识储备。

### Q：App 与 JS 之间的调用。如 App 打开 浏览器一个 H5 页面，然后浏览器通知 App 的回调。

未能回答出来。

### Q：H5 如何适配不同分辨率的手机？

我回答了一面的适配问题的答案 + uniapp 提供的底部安全距离API。

### Q：浏览器的本地缓存、会话存储、cookie的区别。

1. Cookie
   cookie 是存储在本地的数据，本身非常小，它的大小限制为4KB左右。它的主要用途有保存登录信息，比如你登录某个网站市场可以看到“记住密码”，这通常就是通过在 Cookie 中存入一段辨别用户身份的数据来实现的。

2. LocalStorage

   仅在客户端保存（即浏览器），不参与和服务器的通信；没有时间限制，即使浏览器关闭，数据依然存在；

   localStorage 是 HTML5 标准中新加入的技术，它并不是什么划时代的新东西。早在 IE 6 时代，就有一个叫 userData 的东西用于本地存储，而当时考虑到浏览器兼容性，更通用的方案是使用 Flash。而如今，localStorage 被大多数浏览器所支持，如果你的网站需要支持 IE6+，那以 userData 作为你的 polyfill 的方案是种不错的选择。

   （1）创建和访问localStorage

   设置数据：

   ```js
   var forgetData = {phone:vm.phone}
   localStorage.setItem("forgetData",JSON.Stringfy(forgetData)); //forgetData是存储在localStorage里边的本地数据
   Json.Stringfy(forgetData)//将数据转化为字符串格式
   ```

   获取数据

   ```js
   vm.forgetData=JSON.parse(localStorage.getItem("forgetData")); //将字符串转化为JSON化；
   ```

   (2)

   ```js
   设置：localStorage.name = "zhao";
   
   获取：localStorage.name    //zhao     
   
   localStorage.setItem(key,value); //设置数据 
   localStorage.getItem(key); //获取数据       
   localStorage.removeItem(key); //删除单个数据 
   localStorage.clear(); //清除所有localStorage的数据
   ```

3. sessionStorage

   sessionStorage与localStorage的接口类似，但保存数据的生命周期与localStorage不同，做过后端的同学都知道Session这个词，翻译过来就是会话。而sessionStorage是前端的一个概念。它只是可以将一部分数据在当前会话中保存下来，刷新页面数据依旧存在。但是叶敏啊关闭后，sessionStorage中的数据就会被清空。

> 三者区别
>
> 1. 生命周期不同
>
>    Cookie 一般由服务器生成，可设置失效时间，如果在浏览器端生成cookie，默认是关闭后失效。
>
>    localStorage 除非被永久清除，否则永久保存。
>
>    sessionStorage 仅在当前会话会有效，关闭页面或浏览器后被清除
>
> 2. 存放数据的大小不同
>
>    Cookie 一般为4kb
>
>    localStorage 和 sessionStorage 一般为5mb
>
> 3. 与服务器端通信不同
>
>    Cookie 每次都会携带HTTP头中，如果使用cookie保存过多数据会带来性能问题
>
>    localStorage 和 sessionStorage 仅在客户端（即浏览器）中保存，不参与和服务器的通信。
>
> 4. 易用性
>
>    Cookie 需要程序员自己来封装，原生的cookie接口不够友好
>
>    localStorage 和 sessionStorage 原生接口可以接受，可以封装来对Object和Array有更好的支持。