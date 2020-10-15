const jwt = require("jsonwebtoken");
const fs = require("fs");
const request = require("request");
const querystring = require("querystring");

const {
  pccHelper: { getPccConfig },
} = require("../core/utils");

const ResponseService = require("../core/services/ResponseService");
function getAccessToken(authentication = "rest", options) {
  //authentication: rest || client || expirationTime=hour ||  exp:default 1 months
  let now = Math.floor(Date.now() / 1000) - 60 * 20; //minus time wrong
  const exp = now + 3600 * 24 * 30;
  let { agentId: userId, apiKeySid, apiKeySecret } = options;
  const header = { cty: "stringee-api;v=1" };
  // client || rest
  let payload = {
    jti: apiKeySid + "-" + now,
    iss: apiKeySid,
    exp: exp,
    iat: now - 60 * 15, //- 15 minutes
  };
  if (authentication === "rest") {
    payload = {
      //     userId:userId,
      ...payload,
      rest_api: true,
    };
  } else {
    payload = {
      ...payload,
      userId: userId,
    };
  }
  const jwt = require("jsonwebtoken");
  const token = jwt.sign(payload, apiKeySecret, {
    algorithm: "HS256",
    header: header,
  });
  return { token, exp };
}
exports.callLogV1 = function (req, res) {
  const access_token =
    req.body.dynamic_key ||
    req.query.dynamic_key ||
    req.headers["x-access-token"];
  let privateKey = fs.readFileSync("private.key");
  try {
    var decoded = jwt.verify(access_token, privateKey);
    res.send(decoded);
  } catch (error) {
    return res.send({
      error: {
        message: error.message, //jwt must be provided
        code: 401,
        type: "ACCESS_TOKEN_INVALID",
      },
    });
  }
};

exports.callLog = async function (req, res) {
  try {
    const { idcongty, roleid, user_id, user_name } = req.user;
    const query = req.query;
    if (roleid === "H4") {
      // query.from_user_id = user_name;
      query.limit = 200;
    }
    let params = querystring.stringify(query);
    let pccOptions = await getPccConfig(idcongty);
    let { token: access_token, exp } = getAccessToken("rest", pccOptions);
    const options = {
      url: `https://api.stringee.com/v1/call/log?${params}`,
      headers: {
        "User-Agent": "request",
        "X-STRINGEE-AUTH": access_token,
      },
    };
    return request(options, (error, response, body) => {
      if (error)
        return res.send({
          error: {
            message: error.message, //jwt must be provided
            code: 500,
            type: "SERVER_ERROR",
          },
        });
      let responseJSON = JSON.parse(body);
     /*  if (roleid === "H28") {
        // query.from_user_id = user_name;
        responseJSON.data.calls = responseJSON.data.calls.filter(
          (x) => x.from_user_id === user_name || x.to_number === user_name
        );
      } */
      return res.send(
        ResponseService.success({
          ...responseJSON,
          from_user_id: user_name,
          payload: {
            access_token,
          },
        })
      );
    });
  } catch (error) {
    return res.send(error);
  }
};

exports.callLogOrder = async function (req, res) {
  try {
    const { idcongty } = req.user;
    const query = req.query;
    let pccOptions = await getPccConfig(idcongty);
    let { token: access_token, exp } = getAccessToken("rest", pccOptions);
    let s = query.s;
    let charAt = s.charAt();
    if (charAt === "0") {
      s = "84" + s.slice(1);
    }
    let toNumberQuery = {
      ...query,
      to_number: s,
    };
    let fromNumberQuery = {
      ...query,
      from_number: s,
    };

    let [toNumber, fromNumber] = await Promise.all([
      requestPromise(toNumberQuery, access_token),
      requestPromise(fromNumberQuery, access_token),
    ]);
    let data = [...toNumber, ...fromNumber];
    data.sort(function (a, b) {
      return b.created - a.created;
    });
    return res.send(
      ResponseService.success({
        data: {
          calls: data,
        },
        payload: {
          access_token,
        },
      })
    );
  } catch (error) {
    return res.send(error);
  }
};

function requestPromise(query, access_token) {
  let params = querystring.stringify(query);
  const options = {
    url: `https://api.stringee.com/v1/call/log?${params}`,
    headers: {
      "User-Agent": "request",
      "X-STRINGEE-AUTH": access_token,
    },
  };
  return new Promise((resolve, reject) => {
    return request(options, (error, response, body) => {
      if (error) return resolve([]);
      try {
        let responseJSON = JSON.parse(body);
        resolve(responseJSON.data.calls);
      } catch (error) {
        resolve([]);
      }
    });
  });
}
