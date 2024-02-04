import bus from '@/utils/bus';
let socket; // socket对象
let socket_open = false; // 开启标识
let is_reconnect = true; // 是否重连
let reconnect_count = 3; //重连次数
let reconnect_current = 0; // 已经发起重连次数
let reconnect_timer = null; // 重连timer
let reconnect_interval = 3000; // 重连间隔
let heartbeat_timer = null; // 心跳timer
let heartbeat_interval = 3000; // 心跳间隔

// 初始化websocket
const initWebSocket = (url) => {
  if ('undefined' === typeof WebSocket || !('WebSocket' in window)) {
    alert('该浏览器不支持websocket!');
    return;
  }
  // 已经创建过连接不再重复创建
  if (socket) return socket;
  // 初始化 WebSocket 对象，指定要连接的服务器地址与端口建立连接
  socket = new WebSocket(url);
  // 打开
  socket.onopen = () => {
    open();
  };

  // 收信
  socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    const { messageType } = data;
    if (!messageType) {
      bus.emit('message', data);
    }
  };

  // 关闭
  socket.onclose = () => {
    console.log('连接已断开');
    clearTimeout(heartbeat_timer);
    socket_open = false;
    if (is_reconnect) {
      reconnect_timer = setTimeout(() => {
        // 超过重连次数
        if (reconnect_current > reconnect_count) {
          clearTimeout(reconnect_timer);
          return;
        }
        // 记录重连次数
        reconnect_current++;
        reconnect();
      }, reconnect_interval);
    }
  };

  // 连接发生错误的回调方法
  socket.onerror = () => {
    console.log('WebSocket连接发生错误');
  };
};

/**
 * 连接成功 需要开启心跳
 */
const open = () => {
  console.log('WebSocket连接成功');
  socket_open = true;
  is_reconnect = true;
  heartbeat(); // 开启心跳
};

/**
 * 主动关闭连接
 */
const close = () => {
  console.log('连接已断开');
  socket.close();
  socket_open = false;
  is_reconnect = false;
  clearTimeout(heartbeat_timer);
  socket = null; // socket对象
  heartbeat_timer = null;
};

/**
 * 重新连接
 */
const reconnect = () => {
  console.log('发起重新连接', socket && socket_open, reconnect_current);
  if (socket && socket_open) close();
  initWebSocket();
};

/**
 * 心跳
 */
const heartbeat = () => {
  if (heartbeat_timer) clearTimeout(heartbeat_timer);
  heartbeat_timer = setTimeout(() => {
    webSocketSend({ messageType: 'PING' });
    heartbeat();
  }, heartbeat_interval);
};

/**
 * 在其他需要socket地方调用的函数，用来发送数据及接受数据
 * @param {*} data 发送数据
 * @param {*} callback 发送后的自定义回调函数 接收的消息
 */
const send = (data) => {
  //下面的判断主要是考虑到socket连接可能中断或者其他的因素，可以重新发送此条消息。
  switch (socket.readyState) {
    //CONNECTING：值为0，表示正在连接。
    case socket.CONNECTING:
      setTimeout(function () {
        webSocketSend(data);
      }, 1000);
      break;
    //OPEN：值为1，表示连接成功，可以通信了。
    case socket.OPEN:
      webSocketSend(data);
      break;
    //CLOSING：值为2，表示连接正在关闭。
    case socket.CLOSING:
      setTimeout(function () {
        webSocketSend(data);
      }, 1000);
      break;
    //CLOSED：值为3，表示连接已经关闭，或者打开连接失败。
    case socket.CLOSED:
      break;
    default:
      break;
  }
};

//发送数据
const webSocketSend = (data) => {
  socket.send(JSON.stringify(data)); //在这里根据自己的需要转换数据格式
};

//将初始化socket函数、发送（接收）数据的函数、关闭连接的函数export出去
export default {
  initWebSocket,
  close,
  send,
  webSocketSend,
};
