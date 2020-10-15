const { getPccConfig } = require("../core/utils/pccHelper");

class ToolModel {
  constructor(shopId, userId) {
    this._shopId = shopId;
    this._userId = userId;
  }

  getAccessToken(authentication = "rest", options) {
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

  async getPccAccessToken() {
    let _options = await getPccConfig(this._shopId);
    if (!_options) {
      return {
        error: {
          message: "switchboard_config not set value",
          code: 400,
        },
      };
    }
    let { token, exp } = this.getAccessToken("rest", _options);
    return token;
  }
}

module.exports = ToolModel;
