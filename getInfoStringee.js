/* projectId: 2882
userId: nitco_agent_1
expirationTime: 1
authentication: client
iccApi: true */
require("dotenv").config();
const mySqlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  charset: process.env.MYSQL_CHARSET
};
const MySqlService = require("./core/services/MySqlService");

async function getPccConfig(idcongty) {
  let _mySqlService = new MySqlService(mySqlConfig);
  let sql = `SELECT switchboard_config FROM htx_congty WHERE idcongty=${idcongty} LIMIT 1`;
  try {
    let res = await _mySqlService.query(sql);
    _mySqlService.close();
    if (res && res[0]) {
      let { switchboard_config } = res[0];
      if (switchboard_config) {
        console.log("TCL: res", res);
        let data = Buffer.from(switchboard_config, "base64").toString("ascii");
        data = JSON.parse(data);
        console.log("TCL: data", data);
      }
    }
  } catch (error) {
    return false;
  }
}
getPccConfig(1);
