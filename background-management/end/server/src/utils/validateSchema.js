const schema = (schemas) => {
  return async (ctx, next) => {
    const data =
      ctx.request.method === "GET" ? ctx.request.query : ctx.request.body;
    const { error } = schemas.validate(data);
    if (error) {
      ctx.status = 500;

      ctx.body = {
        code: 5000,
        message: "字段校验失败",
      };
    } else {
      await next();
    }
  };
};
module.exports = schema;
