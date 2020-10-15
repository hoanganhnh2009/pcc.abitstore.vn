/* const apiKeySid = "SKaxZnWQDnFf4IsYd8XVt5QIFDm17eHvno"; //"YOUR_API_KEY_SID";
const apiKeySecret = "VDJWYXd4c3BiaUpvWFk4anBPb1phSnpQOTdGREJwUEI="; //"YOUR_API_KEY_SECRET";
const userId = "nitco_agent_1"; //"YOUR_USER_ID"; */
const {
  pccHelper: { getPccConfig },
} = require("../core/utils");
// dynamic_key => (userId + apiKeySecret + apiKeySid) => accessToken

// access_token_for_rest_api.js
// access_token_for_client.js
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
    icc_api: true,
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
// access_token_for_account.js
function getAccountAccessToken() {
  const accountSid = "AC86f4639a447b750a4b78091e1466c4ad";
  const accountKey = "fd4d91bbc809c5eb88b53f6824e97db1";
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600;
  const header = { typ: "JWT", alg: "HS256", cty: "stringee-api;v=1" };
  const payload = {
    jti: accountSid + "-" + now,
    iss: accountSid,
    exp: exp,
    rest_api: true,
  };

  const jwt = require("jsonwebtoken");
  const token = jwt.sign(payload, accountKey, {
    algorithm: "HS256",
    header: header,
  });
  return token;
}
exports.refreshToken = async function (req, res) {
  let { expired } = req.query;
  if (expired) {
    expired = parseInt(expired);
  }
  let expiration_time = Date.now() + (expired || 0);
  const access_token = getPccAccessToken();
  return res.send({
    success: true,
    code: 200,
    access_token,
    expiration_time: new Date(expiration_time),
  });
};
exports.generateAccessToken = async function (req, res) {
  /* let dynamic_key =
    req.body.dynamic_key || req.query.dynamic_key || req.headers["x-abit-auth"]; */
  // return res.send(req.query); //agentId:"nitco_agent_1" || authentication: "rest"
  let { agentId } = req.query;
  const { idcongty } = req.user;
  // params: agentId
  let options = await getPccConfig(idcongty);
  options.agentId = agentId;
  let { token: access_token, exp } = getAccessToken("client", options);
  return res.send({
    success: true,
    code: 200,
    access_token,
    exp,
  });
};
exports.getPccAccessToken = async function (req, res) {
  /* let dynamic_key =
    req.body.dynamic_key || req.query.dynamic_key || req.headers["x-abit-auth"]; */
  const { idcongty } = req.user;
  let options = await getPccConfig(idcongty);
  // return res.send(options);
  try {
    if (!options) {
      return res.send({
        error: {
          message: "switchboard_config not set value",
          code: 400,
        },
      });
    }
    let { token: access_token, exp } = getAccessToken("rest", options);
    return res.send({
      success: true,
      code: 200,
      access_token,
      exp,
    });
  } catch (error) {
    console.log("error", error);
    return res.send({
      error: {
        message: error,
      },
    });
  }
};
