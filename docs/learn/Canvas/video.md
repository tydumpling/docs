# 视频提取画面帧

## 思路

视频提取画面帧主要操作是拿到视频的画面后，把画面画到 `canvas` 上，`canvas` 可以拿到文件对象 `blob` 和 `url` 。而 `canvas` 不能直接画一个文件，需要使用 `video` 这类多媒体元素画到 `canvas` 内。

所以，整体思路如下：

1. 根据选择的文件，放到 `video` 内
2. 定格到某一帧
3. 把 `video` 画到 `canvas` 内
4. 导出

## 工具函数

此时写一个工具函数，获取视频文件和帧，返回一个包含 `blob` 和 `url` 的对象。

该函数主要做以下操作：

1. 创建一个 `video` 标签
2. 通过 `URL.createObjectURL` 获取 object url 。以 `blob:` 为前缀，复制粘贴到新的网页打开就能看到视频
3. 让 `video` 定格在某个时间，以及让其自动播放。直接设置自动播放可能会播放失败，因为要考虑到不同浏览器的限制，设置静音播放可以在全部浏览器播放成功
4. 画到 `canvas` 。画的时机要在视频能够开始播放后再画，并且添加一个定时器，否则有可能失败，导致画面帧白屏
5. 通过 `toBlob` 方法转为 `blob` ，`return` 返回 `blob` 和 `url` 

```js
const box = ref(null)

const drawVideo = vdo => {
    return new Promise(resolve => {
        const cvs =  document.createElement('canvas')
        const ctx = cvs.getContext('2d')
        cvs.width = vdo.videoWidth
        cvs.height = vdo.videoHeight
        ctx.drawImage(vdo, 0, 0, cvs.width, cvs.height)
        cvs.toBlob(blob => {
            resolve({
                blob,
                url: URL.createObjectURL(blob)
            })
        })
    })
}

const captureImg = frame => {
    const img = document.createElement('img')
    img.src = frame
    box.value.appendChild(img)
}

/**
 * 获取视频画面帧
 * @params vdoFile: 视频文件
 * @params time: 第几帧
 * @return 返回blob和url
 */
const captureFrame = (vdoFile, time = 0) => {
    return new Promise(resolve => {
        const vdo = document.createElement('video')
        vdo.currentTime = time // 视频定格
        vdo.muted = true // 静音播放
        vdo.autoplay = true // 视频自动播放
        vdo.oncanplay = () => {
            setTimeout(async () => {
                const res = await drawVideo(vdo)
                resolve(res)
            }, 1000);
        }
        vdo.src = URL.createObjectURL(vdoFile) // 把object url赋值给video标签的src，blob:为前缀，复制粘贴到新的网页打开就能看到视频
    })
}

const onChangeFn = async e => {
    if(!e) return
    for (let i = 0; i < 10; i++) {
        const res = await captureFrame(e, (i + 50) * 1)
        captureImg(res.url)
    }
}
```

后续也可以通过循环获取多个画面帧。

## 拓展

之所以使用 `URL.createObjectURL` 而不是转为 `base64` ，是因为如果视频文件过大，要全部转为 `base64` 的话，会很耗时。

## 总体效果
<Iframe url="https://duyidao.github.io/blogweb/#/info/canvas/video" />