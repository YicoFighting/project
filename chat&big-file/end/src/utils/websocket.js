const query = require('querystring');
//白名单
const whiteUrl = ['chat'];

const searchOnlineUser = (id, sockets, ws) => {
  const index = sockets.findIndex((socket) => {
    return socket.id == id;
  });
  if (index >= 0) {
    ws.send(JSON.stringify({ type: 'online', status: 1, id }));
  } else {
    ws.send(JSON.stringify({ type: 'online', status: 0, id }));
  }
};

const chatWithUser = (msg, sockets) => {
  let socket = sockets.find((socket) => {
    return socket.id == msg['id'];
  });
  if (socket) {
    socket.send(
      JSON.stringify({
        type: msg['type'],
        sendId: msg['sendId'],
        text: msg['text'],
        time: msg['time'],
        textType: msg['textType'],
      })
    );
  }
};

/**
 * 发起视频(传送本身的offer)
 * @param {*} msg
 * @param {*} sockets
 */
const faceWithUser = (msg, sockets) => {
  let socket = sockets.find((socket) => {
    return socket.id == msg['id'];
  });
  if (socket) {
    socket.send(
      JSON.stringify({
        type: msg['type'],
        sendId: msg['sendId'],
        id: msg['id'],
        offer: msg['offer'],
      })
    );
  }
};

const answer_Sdp = (msg, sockets) => {
  let socket = sockets.find((socket) => {
    return socket.id == msg['id'];
  });
  if (socket) {
    socket.send(
      JSON.stringify({
        type: msg['type'],
        sendId: msg['sendId'],
        id: msg['id'],
        answer: msg['answer'],
      })
    );
  }
};

const ice = (msg, sockets) => {
  let socket = sockets.find((socket) => {
    return socket.id == msg['id'];
  });
  if (socket) {
    socket.send(
      JSON.stringify({
        type: msg['type'],
        iceCandidate: msg['iceCandidate'],
      })
    );
  }
};

const handDown = (msg, sockets) => {
  let socket = sockets.find((socket) => {
    return socket.id == msg['id'];
  });
  if (socket) {
    socket.send(
      JSON.stringify({
        type: msg['type'],
        id: msg['sendId'],
      })
    );
  }
};

const faceWithUser_SDP_answer_cand = (msg, sockets) => {
  let socket = sockets.find((socket) => {
    return socket.id == msg['id'];
  });
  if (socket) {
    socket.send(
      JSON.stringify({
        type: msg['type'],
        sendId: msg['sendId'],
        cand: msg['cand'],
      })
    );
  }
};

const webSocket = (wss, app) => {
  //连接时
  wss.on('connection', (ws, req) => {
    //获取url
    const { url } = req;

    //得到发送者与接收者的socket数组
    let { sockets } = app.context;
    sockets = sockets ?? [];

    //如果不在白名单内,就关闭webSocket
    const urlStart = url.slice(1).split('?')[0];
    if (!whiteUrl.includes(urlStart)) {
      return ws.close();
    }

    // 已连接用户;
    const users = wss.clients.size;
    console.log('已连接客户端数量：', users);

    const obj = query.parse(url.split('?')[1]);
    //从url上得到id
    const id = obj['id'];
    //登录
    const index = sockets.findIndex((socket) => socket.id === id);
    ws.id = id;
    if (index >= 0) {
      sockets[index] = ws;
    } else {
      sockets.push(ws);
    }
    app.context.sockets = [...sockets];
    ws.on('message', (msg) => {
      const socketsList = app.context.sockets ?? [];
      if (typeof msg != 'string') {
        msg = JSON.parse(msg.toString());
      }
      const { type } = msg;
      if (type === 'online') {
        searchOnlineUser(msg['id'], socketsList, ws);
      }
      if (type === 'chat') {
        chatWithUser(msg, socketsList);
      }
      if (type === 'face') {
        faceWithUser(msg, socketsList);
      }
      if (type === 'answer-sdp') {
        answer_Sdp(msg, socketsList);
      }
      if (type === 'ice') {
        ice(msg, socketsList);
      }
      if (type === 'handDown') {
        handDown(msg, socketsList);
      }

      if (type === 'face-sdp-answer') {
        faceWithUser_SDP_answer(msg, socketsList);
      }
      if (type === 'face-sdp-answer-cand') {
        faceWithUser_SDP_answer_cand(msg, socketsList);
      }
    });
  });
};

module.exports = webSocket;
