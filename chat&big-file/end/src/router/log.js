const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const { encryption, generateMixed } = require('../utils/resolution');

const logRouter = new Router({ prefix: '/log' });

logRouter.get('/', (ctx) => {
  try {
    const logs = fs.readFileSync(
      path.join(__dirname, '../log/operation.log'),
      'utf-8'
    );
    const regex3 = /\{(.+?)\}/g;
    const lo = logs.toString().replaceAll('\\n', '');
    const arr = lo.match(regex3);
    const body = arr.map((el) => {
      return JSON.parse(el);
    });
    ctx.body = encryption(generateMixed(10), body);
  } catch (error) {
    console.log('error_:', error);
  }
});

logRouter.get('/login', (ctx) => {
  try {
    const logs = fs.readFileSync(
      path.join(__dirname, '../log/login.log'),
      'utf-8'
    );
    const regex3 = /\{(.+?)\}/g;
    const lo = logs.toString().replaceAll('\\n', '');
    const arr = lo.match(regex3);
    const body = arr.map((el) => {
      return JSON.parse(el);
    });
    ctx.body = encryption(generateMixed(10), body);
  } catch (error) {
    console.log('error_:', error);
  }
});

module.exports = logRouter;
