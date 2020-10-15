require("dotenv").config();
var express = require("express");
var router = express.Router();
const ResponseService = require("../core/services/ResponseService");
const CommonController = require("../controllers/CommonController");
var MySqlService = require("../core/services/MySqlService");
var config_common = {
  host: "43.239.223.179",
  user: "apiconnect",
  password: "aFqTXjLXNMNAF4w6",
  database: "abit_common",
  charset: "utf8mb4"
};

var isAuthenticated = require("../middlewares/auth.js");

var options = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
};

var redis = require("redis"),
  client = redis.createClient(options);

client.on("error", function(err) {
  console.log("Error " + err);
});
router.get("/validatedynamickey", async function(req, res) {
  let { dynamic_key } = req.query;
  try {
    if (dynamic_key) {
      let buff = Buffer.from(dynamic_key, "base64");
      let [
        timesession,
        sessionId,
        userIdInDynamic,
        serverid,
        maketnoi
      ] = buff.toString("ascii").split("|");
      timesession = parseInt(timesession);
      userIdInDynamic = parseInt(userIdInDynamic);
      serverid = parseInt(serverid);

      if (
        !maketnoi ||
        !serverid ||
        !userIdInDynamic ||
        !sessionId ||
        !timesession
      ) {
        return res.json({
          error: {
            message: "dynamic_key is invalid"
          }
        });
      }
      let now = new Date().getTime();
      if (timesession * 1000 > now) {
        let _mySqlService = new MySqlService(config_common);
        let sql_common = `SELECT id,user_id,idcongty,roleid,type_delivery_conversion from abit_sessions WHERE dynamic_key='${dynamic_key}' order by sessions_logid desc limit 1`;
        let resCommon = await _mySqlService.query(sql_common);
        if (resCommon && resCommon.length > 0) {
          let { id, user_id, idcongty, roleid } = resCommon[0];
          if (user_id && user_id !== userIdInDynamic) {
            return res.status(104).json({
              message: "Authenticate Error!",
              code: 104
            });
          }
          if (timesession && sessionId && now > timesession * 1000 - 3600) {
            let timePlus = Math.round((now + 8 * 3600) / 1000);
            let newDynamicKey = `${timePlus}|${sessionId}|${userIdInDynamic}|${serverid}|${maketnoi}`;
            newDynamicKey = Buffer.from(newDynamicKey).toString("base64");
            let sqlupdatesession = `UPDATE abit_sessions SET dynamic_key='${newDynamicKey}' WHERE id='${sessionId}'`;
            let resUpdate = await _mySqlService.query(sqlupdatesession);
            await _mySqlService.close();
            if (resUpdate && resUpdate.affectedRows) {
              let result = {
                ...resCommon[0],
                dynamic_key: newDynamicKey
              };
              return res.send(result);
            }
          }
          return res.json(resCommon[0]);
        } else {
          let error = {
            error: {
              message: "Server Error",
              code: 501
            }
          };
          return res.status(501).json(error);
        }
      } else {
        let error = {
          error: {
            message: "Đã hết phiên làm việc, vui lòng đăng nhập lại !",
            code: 401
          }
        };
        return res.status(404).json(error);
      }
    } else {
      let error = {
        error: {
          message: "Bạn không có mã xác thực để thực hiện hành động này",
          code: 401
        }
      };
      return res.status(404).json(error);
    }
  } catch (error) {
    return res.json({
      message: "Authenticate Error!",
      code: 401
    });
  }
});
client.select(2, function() {});

router.get("/test", CommonController.getTest);
router.get("/page", CommonController.getPage);

router.use(isAuthenticated);

router.get("/", function(req, res) {
  res.send("common routes");
});

router.get("/", function(req, res, next) {
  let { dynamic_key } = req.query;
  return res.status(200).send({ dynamic_key });
});

router.get("/page_cares", CommonController.getPageCares);
router.get("/cares", CommonController.getPageCares);
router.get("/list_member", CommonController.getListMember);
router.get("/list_all_page", CommonController.getListAllPage);
module.exports = router;
