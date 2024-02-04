const Router = require('koa-router');
const qrCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { resolutionRes, encryption } = require('../utils/resolution');
const redisHelper = require('../utils/redis');

const qrRouter = new Router({ prefix: '/qr' });

qrRouter.get('/html', async (ctx) => {
  const base64 = await qrCode.toDataURL('http://www.baidu.com');
  const template = ejs.compile(
    fs.readFileSync(path.resolve(__dirname, '../../public/qr.ejs'), 'utf8')
  );
  const html = template({ data: base64 });
  ctx.set('Content-Type', 'text/html');
  ctx.body = html;
});

qrRouter.get('/base64', async (ctx) => {
  const base64 = await qrCode.toDataURL('http://www.baidu.com');
  ctx.body = base64;
});

qrRouter.post('/buffer', async (ctx) => {
  const { key, params } = ctx.request.body;
  const { aesKey, data } = resolutionRes(key, params);
  redisHelper.setString(data['uuid'], 1, 60);
  const base64 = await qrCode.toDataURL(data['uuid']);
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const base64Buffer = Buffer.from(base64Data, 'base64');
  ctx.set('Content-Type', 'application/octet-stream');
  // ctx.body = encryption(aesKey, { base64Buffer });
  ctx.body = base64Buffer;
});

module.exports = qrRouter;
