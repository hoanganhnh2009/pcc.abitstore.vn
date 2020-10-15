/* projectId: 2882
userId: nitco_agent_1
expirationTime: 1
authentication: client
iccApi: true */
require("dotenv").config();

const { mySqlConfig } = require("../config");
const MySqlService = require("../services/MySqlService");

async function getPccConfig(idcongty) {
  let _mySqlService = new MySqlService(mySqlConfig);
  let sql = `SELECT switchboard_config FROM htx_congty WHERE idcongty=${idcongty} LIMIT 1`;

  try {
    let res = await _mySqlService.query(sql);
    if (res && res[0]) {
      let { switchboard_config } = res[0];
      if (switchboard_config) {
        let data = Buffer.from(switchboard_config, "base64").toString("ascii");
        data = JSON.parse(data);
        return data;
      }
      return false;
    }
  } catch (error) {
    console.log("TCL: getPccConfig -> error", error);
    return false;
  } finally {
    _mySqlService.close();
  }
}
// getPccConfig(1);
module.exports = { getPccConfig };
