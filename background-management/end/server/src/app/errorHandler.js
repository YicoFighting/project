//错误类型
const { UNAUTHORIZATION, UNPERMISSION } = require("../constants/errorTypes");

//错误处理函数
const errorHandler = (error, ctx) => {
  let status, message;
  switch (error.message) {
    case UNAUTHORIZATION:
      status = 401;
      message = "用户身份验证失败";
      break;
    case UNPERMISSION:
      status = 401;
      message = "您没有对应权限";
      break;
    default:
      status = 500;
      message = error.message ?? error;
  }

  //状态
  ctx.status = status;
  //提示信息
  ctx.body = message;
};
module.exports = errorHandler;
