const apiKeySid = "SKaxZnWQDnFf4IsYd8XVt5QIFDm17eHvno"; //"YOUR_API_KEY_SID";
const apiKeySecret = "VDJWYXd4c3BiaUpvWFk4anBPb1phSnpQOTdGREJwUEI="; //"YOUR_API_KEY_SECRET";
const userId = "nitco_agent_1"; //"YOUR_USER_ID";

var token = getAccessToken();
console.log(token);

function getAccessToken() {
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

getAccessToken();

var token = getPccAccessToken();
console.log("pcc: " + token);

function getPccAccessToken() {
  var now = Math.floor(Date.now() / 1000) - 3600;
  console.log(now);
  var exp = now + 24 * 3600;

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
