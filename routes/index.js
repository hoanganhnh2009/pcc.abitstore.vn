var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
  res.send("Hello pcc.abitstore.vn");
});
router.get("/test", function(req, res) {
  res.send({ success: true });
});

function sendMessage(text, chat_id) {
  var request = require("request");
  const assert = require("assert");
  let body = JSON.stringify({
    chat_id: chat_id || "-345145783",
    text
  });
  const headers = {
    "Content-Type": "application/json"
  };
  const uri = `https://api.telegram.org/bot826898658:AAHqMbj9GYSNNvSoh1jRsBIA9Q99mX7feKM/sendMessage`;
  return request(
    {
      headers,
      uri,
      body,
      method: "POST"
    },
    function(error, response, body) {
      assert.equal(null, error);
      try {
        console.log(`[INFO] [${new Date()}] ${body}`)
        body = JSON.parse(body);;
      } catch (error) {
        console.log(`[ERROR] [${new Date()}] ${error}`)
      }
    }
  );
}
var getValue = (defaultObj, keys, defaultValue = null) => {
  if (!defaultObj) return defaultValue;
  keys = keys.split(".");
  keys = keys.map(e => {
    let arrayKey = e.split("|");
    let key = arrayKey[0];
    let position = arrayKey[1];
    if (position) {
      return {
        key,
        position
      };
    }
    return {
      key
    };
  });
  let result = keys.reduce((objectsByKeyValue, obj, i) => {
    if (obj.position) {
      return (
        (objectsByKeyValue[obj.key] &&
          objectsByKeyValue[obj.key][obj.position]) ||
        {}
      );
    }
    return objectsByKeyValue[obj.key] || defaultValue;
  }, defaultObj);
  return result;
};
// status redis
// restart mongo_db
// restart service A
router.post("/my-hook", function(req, res) {
  console.log("TCL: req", req.body);
  let body = req.body;
  let numberRand = Math.floor(Math.random() * 10);
  let chat_id = getValue(body, "message.chat.id");
  sendMessage("ahihi " + numberRand, chat_id);
  // curl --data chat_id="-345145783" --data "text=Hello World" "https://api.telegram.org/bot826898658:AAHqMbj9GYSNNvSoh1jRsBIA9Q99mX7feKM/sendMessage"

  res.send({ success: true });
});

router.get("/app_center_hook", function(req, res) {
  console.log("TCL: req", req);
  res.json({ success: true });
});

module.exports = router;
