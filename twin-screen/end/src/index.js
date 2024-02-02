const Koa = require("koa");
// 解析参数
const bodyparser = require("koa-bodyparser");
// 跨域
const cors = require("@koa/cors");
// websocket
const ws = require("ws");

const app = new Koa();
app.use(cors());
app.use(bodyparser());

// 开启服务
const server = app.listen(8080, () => {
  console.log("服务运行在 127.0.0.1:8080");
});

// webSocket
const wss = new ws.Server({ server });

// 存储客户端信息的对象
const clients = {};

wss.on("connection", (ws) => {
  // 为客户端生成唯一标识符
  const clientId = Math.random().toString(36).substr(2, 8);

  // 将客户端信息存储到 clients 对象中
  clients[clientId] = ws;

  ws.send(JSON.stringify({ type: "welcome", clientId }));

  ws.on("message", (message) => {
    // 解析消息内容
    const data = JSON.parse(message);
    const { type, payload } = data;
    // 心跳检测
    if (type == "alive") {
      ws.send(JSON.stringify({ type, payload: { message: "pong" } }));
    } else if (type === "broadcast") {
      // 广播消息给所有客户端
      Object.values(clients).forEach((client) => {
        client.send(JSON.stringify({ type: "warning", payload }));
      });
    } else if (type === "unicast") {
      // 单播消息给指定客户端
      const { clientId, message } = payload;
      const targetClient = clients[clientId];
      if (targetClient) {
        targetClient.send(
          JSON.stringify({ type: "message", payload: message })
        );
      } else {
        console.log(`客户端 ${clientId} 不存在`);
      }
    } else {
      console.log(`未知消息类型: ${type}`);
    }
  });

  ws.on("close", () => {
    console.log(`WebSocket 连接关闭: ${clientId}`);
    delete clients[clientId];
  });
});
