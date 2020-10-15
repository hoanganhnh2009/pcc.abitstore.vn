const apiKeySid = "SKaxZnWQDnFf4IsYd8XVt5QIFDm17eHvno"; //"YOUR_API_KEY_SID";
const apiKeySecret = "VDJWYXd4c3BiaUpvWFk4anBPb1phSnpQOTdGREJwUEI="; //"YOUR_API_KEY_SECRET";
const userId = "nitco_agent_1"; //"YOUR_USER_ID";

function getClientAccessToken() {
  var now = Math.floor(Date.now() / 1000);
  var exp = now + 3600; //1 hours

  var header = { cty: "stringee-api;v=1" };
  var payload = {
    jti: apiKeySid + "-" + now,
    iss: apiKeySid,
    exp: exp,
    userId: userId
  };

  var jwt = require("jsonwebtoken");
  var token = jwt.sign(payload, apiKeySecret, {
    algorithm: "HS256",
    header: header
  });
  return token;
}

function getPccAccessToken() {
  var now = Math.floor(Date.now() / 1000);
  var exp = now + 3600;

  var header = { cty: "stringee-api;v=1" };
  var payload = {
    jti: apiKeySid + "-" + now,
    iss: apiKeySid,
    exp: exp,
    rest_api: true
  };

  var jwt = require("jsonwebtoken");
  var token = jwt.sign(payload, apiKeySecret, {
    algorithm: "HS256",
    header: header
  });
  return token;
}

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
    rest_api: true
  };

  const jwt = require("jsonwebtoken");
  const token = jwt.sign(payload, accountKey, {
    algorithm: "HS256",
    header: header
  });
  return token;
}

var clientToken = getClientAccessToken();
console.log("TCL: clientToken", clientToken);

var pccToken = getPccAccessToken();
console.log("TCL: pccToken", pccToken);

let accToken = getAccountAccessToken();
console.log("TCL: accToken", accToken);
/* header 
{
        "typ": "JWT",
        "alg": "HS256",
        "cty": "stringee-api;v=1"
    }

// payload
    {
        "jti": "fd4d91bbc809c5eb88b53f6824e97db1",
        "iss": "AC86f4639a447b750a4b78091e1466c4ad",
        "exp": 3600,
        "userId": "nitco_agent_1"
    }

    https://github.com/stringeecom/server-samples/tree/master/access_token */
