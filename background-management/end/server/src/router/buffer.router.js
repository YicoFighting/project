const Router = require("koa-router");
const { generateTable } = require("../middleware/buffer.middle");

const router = new Router({ prefix: "/buffer" });

router.get("/excel", generateTable);

module.exports = router;
