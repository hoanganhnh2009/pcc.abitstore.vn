const ResponseService = require("../core/services/ResponseService");
const { getInfoFromDynamic } = require("../core/ultis/getInfoFromDynamic");
var MySqlService = require("../core/services/MySqlService");
var RedisService = require("../core/services/RedisService");
const options = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
};
const config_common = {
  host: "43.239.223.179",
  user: "apiconnect",
  password: "aFqTXjLXNMNAF4w6",
  database: "abit_common",
  charset: "utf8mb4"
};

/* MYSQL_HOST
MYSQL_USER
MYSQL_PASSWORD
MYSQL_DATABASE
MYSQL_CHARSET */

let redis = require("redis"),
  client = redis.createClient(options);

client.on("error", function(err) {
  console.log("Error " + err);
});
client.select(2, function() {});

exports.getPageCares = async function(req, res) {
  let { dynamic_key } = req.query;
  let iduser = getInfoFromDynamic("iduser", dynamic_key);
  client.get(iduser.toString(), async function(err, value) {
    if (err) {
      return res.send(err);
      // throw err
    }
    value = JSON.parse(value);
    let { id, user_id, idcongty, roleid } = req.user;
    if (value && Array.isArray(value) && value.length) {
      value = value.map(e => {
        return {
          ...e,
          idpage: e.idpage || e.page_id + ""
        };
      });
      return res.send(value);
    }
    let _mySqlService = new MySqlService(config_common);
    let sql = `SELECT page_id,tenpage,pageaccess,is_valid,idfacebookquantri,time_auto_sub FROM abit_care_config INNER JOIN pages ON pages.idpage=abit_care_config.page_id WHERE staff_id=${iduser} AND pages.idcongty=${idcongty}`;
    if (roleid === "H4") {
      sql = `SELECT idpage,tenpage,pageaccess,is_valid,idfacebookquantri,time_auto_sub FROM pages WHERE idcongty=${idcongty}`;
    } else if (roleid === "H8") {
      sql = `SELECT idpage,tenpage,pageaccess,is_valid,idfacebookquantri,time_auto_sub FROM pages WHERE userdk=${user_id} AND idcongty=${idcongty}`;
    }
    try {
      let result = await _mySqlService.query(sql);
      // return res.send(result)
      result = result.map(e => {
        return {
          ...e,
          idpage: e.idpage || e.page_id + ""
        };
      });
      await _mySqlService.close();
      await updateToRedis(iduser + "", result);
      return res.send(result);
    } catch (error) {
      console.log("TCL: error", error);
      return res.send(error);
      // return res.send(ResponseService.errorServer(error))
    }
  });
};

exports.getTest = async function(req, res) {
  let _mySqlService = new MySqlService(config_common);
  let { username } = req.query;
  let sql = `SELECT iduser as id,user_name as username,idcongty FROM abit_common.abit_alluser where user_name="${username}"`;
  let result = await _mySqlService.query(sql);
  await _mySqlService.close();
  return res.send(result);
};
exports.getPage = async function(req, res) {
  let _mySqlService = new MySqlService(config_common);
  let { idcongty } = req.query;
  let sql = `SELECT idpage,tenpage,pageaccess,is_valid,idfacebookquantri,time_auto_sub FROM pages WHERE idcongty=${idcongty}`;
  try {
    let result = await _mySqlService.query(sql);
    result = result.map(e => {
      return {
        ...e,
        idpage: e.idpage || e.page_id + ""
      };
    });
    let id_from_page = result.map(e => e.idpage);
    await _mySqlService.close();
    return res.send({
      type: { $in: [0, 1] },
      ofcompany: parseInt(idcongty),
      id_from_page,
      result
    });
  } catch (error) {
    console.log("TCL: error", error);
    return res.send(error);
  }
};
function updateToRedis(key, value) {
  return new Promise((resolve, reject) => {
    let data = JSON.stringify(value);
    client.set(key, JSON.stringify(value), async function(err, value) {
      if (err) return reject(err);
      return resolve(value);
    });
  });
}

exports.getListMember = async function(req, res) {
  let { user } = req;
  let { idcongty } = user;
  try {
    let _mySqlService = new MySqlService(config_common);
    let sql = `SELECT user_name as staff_name,iduser as staff_id FROM abit_alluser WHERE idcongty=${idcongty} AND status='Active'`;
    let data = await _mySqlService.query(sql);
    await _mySqlService.close();
    return res.json(ResponseService.success({ data }));
  } catch (err) {
    console.log("TCL: err", err);
    return res.json(ResponseService.errorServer());
  }
};

exports.getListAllPage = async function(req, res) {
  let { user } = req;
  let { idcongty } = user;
  try {
    let _mySqlService = new MySqlService(config_common);
    let sql = `SELECT id,idpage,tenpage,is_valid FROM pages WHERE idcongty=${idcongty}`;
    let data = await _mySqlService.query(sql);
    await _mySqlService.close();
    return res.json(ResponseService.success({ data }));
  } catch (err) {
    console.log("TCL: err", err);
    return res.json(ResponseService.errorServer());
  }
};
