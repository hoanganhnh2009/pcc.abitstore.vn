var express = require("express");
var router = express.Router();
const ToolController = require("../controllers/ToolController");
var isAuthenticated = require("../middlewares/auth.js");
/* GET home page. */

router.use(isAuthenticated);
router.get("/refresh_token", ToolController.refreshToken);
router.get("/generate_access_token", ToolController.generateAccessToken);
router.get("/generate_pcc_access_token", ToolController.getPccAccessToken);

module.exports = router;
