const path = require('path');
const log4js = require('koa-log4');
const LOG_PATH = path.join(__dirname, './');

log4js.configure({
  // 日志的输出
  appenders: {
    access: {
      type: 'dateFile',
      //生成文件的规则
      pattern: '-yyyy-MM-dd.log',
      // 文件名始终以日期区分
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      //生成文件名
      filename: path.join(LOG_PATH + '/access', 'access.log'),
    },
    operation: {
      type: 'file',
      filename: path.join(LOG_PATH, 'operation.log'),
      layout: {
        type: 'messagePassThrough',
      },
      encoding: 'utf-8',
      compress: false,
      keepFileExt: true,
    },
    login: {
      type: 'file',
      filename: path.join(LOG_PATH, 'login.log'),
      layout: {
        type: 'messagePassThrough',
      },
      encoding: 'utf-8',
      compress: false,
      keepFileExt: true,
    },
    out: {
      type: 'console',
    },
  },
  categories: {
    default: { appenders: ['out'], level: 'all' },
    access: { appenders: ['access'], level: 'all' },
    operation: { appenders: ['operation'], level: 'all' },
    login: { appenders: ['login'], level: 'all' },
  },
});

module.exports = {
  // 记录所有访问级别的日志
  accessLogger: () => log4js.koaLogger(log4js.getLogger('access')),
  //登录日志
  loginLog: log4js.getLogger('login'),
  //操作日志
  logger: log4js.getLogger('operation'),
};
