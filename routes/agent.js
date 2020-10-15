const express = require("express");
const router = express.Router();
const AgentController = require("../controllers/AgentController");
const isAuthenticated = require("../middlewares/auth.js");
/* GET home page. */
router.get("/", AgentController.getAgent);

router.use(isAuthenticated);

router.put("/:agentId/status", AgentController.updateAgentStatus);
// router.post("/", AgentController.getAgent);

module.exports = router;
