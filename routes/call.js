var express = require("express");
var router = express.Router();
const CallController = require("../controllers/CallController");
var isAuthenticated = require("../middlewares/auth.js");
/* GET home page. */

router.use(isAuthenticated);
router.get("/call_log", CallController.callLog);
router.get("/call_log_order",CallController.callLogOrder)
module.exports = router;
