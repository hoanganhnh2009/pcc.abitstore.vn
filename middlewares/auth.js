require("dotenv").config();
const request = require("request");
const querystring = require("querystring");
const MySqlService = require("../core/services/MySqlService");
const ResponseService = require("../core/services/ResponseService");

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_CHARSET,
} = process.env;

const config_common = {
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  charset: MYSQL_CHARSET,
};

async function isAuthenticated(req, res, next) {
  let dynamic_key =
    req.body.dynamic_key || req.query.dynamic_key || req.headers["x-abit-auth"];
  if (dynamic_key) {
    let buff = Buffer.from(dynamic_key, "base64");
    let [
      timesession,
      sessionId,
      userIdInDynamic,
      serverid,
      maketnoi,
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
      return res.json(
        ResponseService.error({
          message: "dynamic_key invalid",
          type: "DYNAMIC_KEY_INVALID",
          code: 498,
        })
      );
    }

    let now = Date.now();
    if (timesession * 1000 > now) {
      let _mySqlService = new MySqlService(config_common);
      // id,user_id,idcongty,roleid
      let sql_common = `SELECT * from abit_sessions WHERE dynamic_key='${dynamic_key}' order by sessions_logid desc limit 1`;
      let resCommon = await _mySqlService.query(sql_common);
      if (resCommon && resCommon.length > 0) {
        let { user_id } = resCommon[0];
        // get user_name
        let sql_get_user = `SELECT user_name from abit_alluser WHERE iduser=${user_id};`;
        let res_get_user = await _mySqlService.query(sql_get_user);
        resCommon[0].user_name = res_get_user[0].user_name;
        // #get user_name
        if (user_id && user_id !== userIdInDynamic) {
          return res.json(
            ResponseService.error({
              message: "dynamic_key không hợp lệ",
              code: 498,
              type: "DYNAMIC_KEY_INVALID",
            })
          );
        }
        let timePlus = Math.round((now + 8 * 3600) / 1000);
        if (timesession && sessionId && now > timesession * 1000 - 3600) {
          let newDynamicKey = `${timePlus}|${sessionId}|${userIdInDynamic}|${serverid}|${maketnoi}`;
          newDynamicKey = Buffer.from(newDynamicKey).toString("base64");
          let sqlupdatesession = `UPDATE abit_sessions SET dynamic_key='${newDynamicKey}' WHERE id='${sessionId}'`;
          let resUpdate = await _mySqlService.query(sqlupdatesession);
          await _mySqlService.close();
          if (resUpdate && resUpdate.affectedRows) {
            let result = {
              ...resCommon[0],
              dynamic_key: newDynamicKey,
            };
            req.user = result;
            return next();
          }
        }
        req.user = resCommon[0];
        return next();
      }
    } else {
      return res.json(
        ResponseService.error({
          message: "Đã hết phiên làm việc, vui lòng đăng nhập lại",
          code: 400,
          type: "DYNAMIC_KEY_EXPIRED",
        })
      );
    }
  } else {
    return res.json(
      ResponseService.error({
        message: "Bạn không có mã xác thực để thực hiện hành động này",
        code: 400,
        type: "DYNAMIC_KEY_REQUIRED",
      })
    );
  }
}

module.exports = isAuthenticated;
