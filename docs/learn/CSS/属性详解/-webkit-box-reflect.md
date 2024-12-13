# -webkit-box-reflect 实现倒影

## 前置知识

通过设置 `-webkit-box-reflect` CSS 属性可让你将元素内容在特定方向上进行轴对称反射。

该方法主要有三个属性值，分别如下：

- 方向：`abvoe` 、`below` 倒影、`left` 、`right`
- 偏移长度：如 10px，表示反射效果和原本的文本图片中间的距离
- 蒙版：可以设置渐变或图片作为蒙版

> 注意：
>
> 该特性是非标准的，请尽量不要在生产环境中使用它！

## 实现

为一个文本标签或图片标签设置反射样式，添加渐变蒙版即可。代码如下：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        img {
            width: 250px;
            -webkit-box-reflect: below 15px linear-gradient(transparent, transparent, rgba(0, 0, 0, .5));
        }
        p {
            width: 250px;
            -webkit-box-reflect: below 3px linear-gradient(transparent, rgba(0, 0, 0, .5));
        }
    </style>
</head>

<body>
    <img src="./xiaoxin.png" alt="">
    <p>tydumpling</p>
</body>

</html>
```

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/detail/css/below" />