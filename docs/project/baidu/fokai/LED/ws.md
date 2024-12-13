# Ws

在本项目中，拥堵情况的事件扎点采取 `WebSocket` 实时推送数据渲染。第一次使用 `WebSocket` （后面省略为 `ws` ），来记录一下。

## 前置知识

关于 `ws` ，主要遵循以下几个步骤：

1. 项目中安装 `ws` 

   ```bash
   pnpm i ws
   ```

2. 创建 `WebSocket` 实例

   ```js
   let ws = new WebSocket('ws://localhost:9000')
   ```

   `WebSocket` 服务器地址根据情况作修改

3. 监听其打开事件

   ```js
   ws.onopen = () => {
     console.log('WebSocket 连接已打开');
     ws.send('Hello Server'); // 发送消息给服务器
   };
   ```

4. 监听其接收消息事件

   ```js
   ws.onmessage = (event) => {
     console.log('接收到消息：', event.data);
   };
   ```

5. 监听其错误事件

   ```js
   ws.onerror = (error) => {
     console.error('WebSocket 错误：', error);
   };
   ```

6. 监听其关闭事件

   ```js
   ws.onclose = () => {
     console.log('WebSocket 连接已关闭');
   };
   ```

7. 在需要的时候关闭连接，避免内存泄漏（如组件卸载的时候）

   ```js
   beforeUnmount() {
     if (ws.readyState === WebSocket.OPEN) {
       ws.close();
     }
   }
   ```

## 初步封装

初步封装一个 `ws` 来使用：

```js
// 创建 WebSocket 实例
const ws = new WebSocket('ws://localhost:8080'); // 根据实际情况修改 WebSocket 服务器地址

// 监听 WebSocket 连接打开事件
ws.onopen = () => {
  console.log('WebSocket 连接已打开');
  
  // 向服务器发送消息（传递参数）
  const message = {
    action: 'getData',
    params: {
      key: 'value'
    }
  };
  ws.send(JSON.stringify(message)); // 发送消息给服务器，需要将对象转换为字符串
};

// 监听 WebSocket 接收消息事件
ws.onmessage = (event) => {
  console.log('接收到消息：', event.data);
  // 在这里处理从服务器返回的数据
};

// 监听 WebSocket 错误事件
ws.onerror = (error) => {
  console.error('WebSocket 错误：', error);
};

// 监听 WebSocket 关闭事件
ws.onclose = () => {
  console.log('WebSocket 连接已关闭');
};
```

## 考虑心跳、断点续连

心跳是前端通过定时器，固定间隔发送消息过去，避免长时间无通信被服务器断连。这个功能是否需要取决于后端那边是否做该模块。

```js
startHeartbeat() {
  this.heartbeatInterval = setInterval(() => {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send('ping'); // 发送心跳消息
    }
  }, 30000); // 每隔30秒发送一次心跳消息
}
```

后续在通信开启后调用即可。

```js
ws.onopen = () => {
  console.log('WebSocket 连接已打开');
  startHeartbeat(); // 发送心跳信息
};
```

断点续连功能是在通信非手动关闭是重新建立连接，因此需要一个变量，若是手动关闭则修改为 `false` ，后续判断，若变量为真则重新建立连接。

整体代码封装在一个类中：

```js
// WebSocketUtil.js

class WebSocketUtil {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.autoConnect = true;
    this.initWebSocket();
  }

  initWebSocket() {
    this.ws = new WebSocket(this.url, this.options);

    this.ws.onopen = () => {
      console.log('WebSocket 连接已打开');
      this.startHeartbeat(); // 开启心跳检测
    };

    this.ws.onmessage = (event) => {
      console.log('接收到消息：', event.data);
      // 在这里处理从服务器返回的数据
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket 错误：', error);
      if (this.autoConnect) this.reconnect(); // 发生错误时尝试重新连接
    };

    this.ws.onclose = () => {
      console.log('WebSocket 连接已关闭');
      if (this.autoConnect) this.reconnect(); // 连接关闭时尝试重新连接
    };
  }

  send(message) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket 连接未打开，无法发送消息');
    }
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send('ping'); // 发送心跳消息
      }
    }, 30000); // 每隔30秒发送一次心跳消息
  }

  reconnect() {
    clearInterval(this.heartbeatInterval); // 清除心跳定时器
    setTimeout(() => {
      console.log('尝试重新连接 WebSocket');
      this.initWebSocket(); // 重新初始化 WebSocket 连接
    }, 3000); // 3秒后尝试重新连接
  }

  close() {
    clearInterval(this.heartbeatInterval); // 关闭连接时清除心跳定时器
    this.autoConnect = false;
    this.ws.close();
  }
}

export default WebSocketUtil;
```

## 优化

还可以从以下几点进行优化：

1. 空指针判断。比如 `url` 、`this.ws` 等，做空指针判断处理，如果是空返回 `error` 信息
2. 事件卸载。在建立 `ws` 连接时，会给它添加 `open` 、`message` 等事件，但关闭后没有卸载这些事件。卸载后可以有效避免内存泄漏

最终优化代码如下：

```js
// WS.js
class WS {
    /**
    * 构造函数，用于创建WebSocket实例
    *
    * @param url WebSocket连接地址
    * @param options 可选参数，WebSocket连接配置选项
    * @throws 当url参数不存在时，会抛出Error异常
    */
    constructor(url, options = {}) {
      if (!url) {
        throw new Error('URL is required');
      };
      this.autoReconnect = true; // 是否需要断续重连，默认需要
      this.url = url;
      this.options = JSON.stringify(options);

      //   解决this指向问题
      this._onopen = this._onopen.bind(this);
      this._onmessage = this._onmessage.bind(this);
      this._onerror = this._onerror.bind(this);
      this._onclose = this._onclose.bind(this);

      // 初始化ws链接
      this.initWebSocket();
    }

    /**
      * 初始化 WebSocket 连接
      */
    initWebSocket() {
      this.ws = new WebSocket(this.url);
      this.listen();
    }

    _onopen() {
      console.log('WebSocket 连接已打开');
      this.startHeartbeat(); // 开启心跳检测
    }

    _onmessage(event) {
      console.log('接收到消息：', event.data);
      // 在这里处理从服务器返回的数据
    }

    _onerror(error) {
      console.error('WebSocket 错误：', error);
      this.reconnect(); // 发生错误时尝试重新连接
    }

    _onclose() {
      console.log('WebSocket 连接已关闭');
      if (this.autoReconnect) {
        this.reconnect(); // 连接关闭时尝试重新连接
      };
    }

    /**
       * 发送消息
       *
       * @param message 要发送的消息的对象
       */
    send(message) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
      } else {
        console.error('WebSocket 连接未打开，无法发送消息');
      }
    }

    /**
       * 开始心跳检测
       */
    startHeartbeat() {
      if (!this.ws) {
        console.error('WebSocket is not initialized.');
        return;
      }

      this.heartbeatInterval = setInterval(() => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send('ping'); // 发送心跳消息
        } else {
          console.warn('WebSocket is not open. Current state:', this.ws.readyState);
        }
      }, 10000); // 每隔10秒发送一次心跳消息
    }

    /**
       * 重新连接 WebSocket
       */
    reconnect() {
      clearInterval(this.heartbeatInterval); // 清除心跳定时器
      this.removeListen();
      setTimeout(() => {
        console.log('尝试重新连接 WebSocket');
        this.initWebSocket(); // 重新初始化 WebSocket 连接
      }, 3000); // 3秒后尝试重新连接
    }

    /**
       * 关闭连接
       *
       * 在关闭连接时，会清除心跳定时器并关闭WebSocket连接，同时设置不再需要断续重连。
       */
    close() {
      clearInterval(this.heartbeatInterval); // 关闭连接时清除心跳定时器
      this.removeListen();
      this.autoReconnect = false; // 不再需要断续重连
      this.ws.close();
    }

    listen() {
      this.ws?.addEventListener('open', this._onopen);
      this.ws?.addEventListener('message', this._onmessage);
      this.ws?.addEventListener('close', this._onclose);
      this.ws?.addEventListener('error', this._onerror);
    }

    removeListen() {
      this.ws?.removeEventListener('open', this._onopen);
      this.ws?.removeEventListener('message', this._onmessage);
      this.ws?.removeEventListener('close', this._onclose);
      this.ws?.removeEventListener('error', this._onerror);
    }
}

export default WS;
```

上方代码需要注意的是 `this` 指向问题。普通函数中，`this` 指向是谁使用了该函数，`this` 指向谁。因此如果没有在构造器上通过 `bind` 修改 `this` 这一步骤，后续 `addEventListener` 后，`_onerror` 等事件函数内的 `this` 指向的就是 `ws` ，而不是 `WS` 类。
