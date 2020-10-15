const request = require("request");
const querystring = require("querystring");
const assert = require("assert");
const AgentModel = require("../model/AgentModel");
const ToolModel = require("../model/ToolModel");

exports.getAgent = async function (req, res) {
  // const dynamic_key = req.body.dynamic_key || req.query.dynamic_key;
  let access_token = req.headers["x-access-token"];
  try {
    let result = await get(access_token, req.query);
    return res.send(result);
  } catch (error) {
    console.log("TCL: error", error);
    return res.send(error);
  }
};

function get(access_token, query) {
  return new Promise((resolve, reject) => {
    const queryString = querystring.stringify(query);
    console.log("TCL: get -> queryString", queryString);
    const headers = {
      "X-STRINGEE-AUTH": access_token,
      Accept: "application/json",
    };
    const uri = `https://icc-api.stringee.com/v1/agent`;
    return request(
      {
        headers,
        uri,
        method: "GET",
      },
      function (error, response, body) {
        assert.equal(null, error);
        try {
          body = JSON.parse(body);
          console.log("TCL: get -> body", body);
          resolve(body);
        } catch (error) {
          console.log("TCL: get -> error", error);
          reject(error);
        }
      }
    );
  });
}

exports.updateAgentStatus = async (req, res) => {
  let { agentId } = req.params;
  const { dynamic_key } = req.query;
  let { status } = req.body;
  const { user } = req;
  let _agentModel = new AgentModel(user.idcongty, user.user_name);
  let result = await _agentModel.updateAgentStatus(
    agentId,
    status,
    dynamic_key
  );
  //
  // idcongty,user_id
  return res.send(result);
};
