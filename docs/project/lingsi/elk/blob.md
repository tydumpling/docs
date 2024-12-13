后端返回二进制流文件，前端需要通过特殊方法把二进制流文件转为 json 格式。方法如下：

1. 通过 axios 发送请求，设置基准路径、请求参数、响应数据类型为 blob ，请求头携带 token 等。
2. 请求成功后回调函数中执行以下操作：
   - 调用 new Blob() 方法，把参数传递给该方法，设置 type 类型为 {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'} 。
   - 创建一个新的对象 URL ，该对象 URL 可以代表某一个指定的 file 对象或者 bolb 对象。用于在浏览器上预览本地的图片或者视频。
   - 创建 a 标签，使用其 download 方法，这样就能下载文件而不是预览，再设置下载文件名。
   - 下载完毕后移出元素和方法。
```javascript
axios.get( baseUrl + '后端接口', {
  params: {
    id: row.id//这里是参数
  },
  headers: {
    authentication: 'token'
  },
  responseType: 'blob',//响应类型为流
})
```

总体代码如下所示：
```javascript
downLoad(row) {
  axios.get( baseUrl + '/license/down/auth/code', {
    params: {
      id: row.id//这里是参数
    },
    headers: {
      authentication: '2913d3e9-e732-4a1e-a9cc-68cf007dae72'
    },
    responseType: 'blob',//响应类型为流
  }).then((resp) => {
    console.log(resp);
    if(resp) {
      let blob = new Blob([resp.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'});
      let url = window.URL.createObjectURL(blob);
      let link = document.createElement('a');
      link.href = url
      link.download = 'a.txt' || '下载文件';//下载后文件名
      document.body.appendChild(link);
      link.click();//点击下载
      link.remove();//下载完成移除元素
      window.URL.revokeObjectURL(link.href); //用完之后使用URL.revokeObjectURL()释放；
    }else {
      Message.error('文件下载失败，请重试！');
    }
  }).catch(e => {
    Message.error('暂无下载该文件的权限！');
  }).finally(() => {
    //请求结束回调
  })
```
