getInfoFromDynamic = function(key, dynamic_key) {
  let buff = Buffer.from(dynamic_key, "base64");
  let [timesession, sessionId, iduser, id_server, ma_ketnoi] = buff
    .toString("ascii")
    .split("|");
  iduser = parseInt(iduser);
  id_server = parseInt(id_server);
  switch (key) {
    case "ma_ketnoi":
      return ma_ketnoi;
    case "iduser":
      return iduser;
    case "id_server":
      return id_server;
    default:
      return dynamic_key;
  }
};

module.exports = { getInfoFromDynamic };
