const ToolModel = require("./ToolModel");
const DataService = require("../core/services/data.service");

const ManualStatus = {
  AVAILABLE: "AVAILABLE",
  NOT_AVAILABLE: "NOT AVAILABLE",
};

class AgentModel {
  constructor(shopId, userName) {
    this._shopId = shopId;
    this._userName = userName;
  }

  async getAgentByName() {
    try {
      let resp = await DataService.get({
        access_token: this._pcc_access_token,
        path: "/v1/agent",
      });
      let { agents } = resp.data;
      let agent = agents.find((x) => x.stringee_user_id === this._userName);
      return agent;
    } catch (error) {
      return "";
    }
  }
  async onChangeAgentIdStatus(status) {
    let formData = {
      manual_status: status
        ? ManualStatus.AVAILABLE
        : ManualStatus.NOT_AVAILABLE,
    };

    try {
      let resp = await DataService.put({
        access_token: this._pcc_access_token,
        path: `/v1/agent/${this._agentId}`,
        formData,
      });
      return resp;
    } catch (error) {
      return error;
    }
  }
  async _getPccAccessToken() {
    let _toolModel = new ToolModel(this._shopId, this._userId);
    let pcc_access_token = await _toolModel.getPccAccessToken();
    return pcc_access_token;
  }

  async updateAgentStatusAbit(status) {
    try {
      let formData = [
        {
          status: status ? 1 : 0,
        },
      ];
      let resp = await DataService.post({
        path: `/callcenter/updatestatusAgent?dynamic_key=${this._dynamic_key}`,
        baseURL: "https://new.abitstore.vn",
        formData,
      });
      console.log("AgentModel -> updateAgentStatusAbit -> resp", resp);
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateAgentStatus(agentName, status, dynamic_key) {
    this._pcc_access_token = await this._getPccAccessToken();
    // this._pcc_access_token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InN0cmluZ2VlLWFwaTt2PTEifQ.eyJqdGkiOiJTS2w5MEdjSkJPWHdleW1oMHc4cmJuRlkwbml0eXZuS05oLTE2MDI2NTAzMjIiLCJpc3MiOiJTS2w5MEdjSkJPWHdleW1oMHc4cmJuRlkwbml0eXZuS05oIiwiZXhwIjoxNjA1MjQyMzIyLCJpY2NfYXBpIjp0cnVlLCJpYXQiOjE2MDI2NDk0MjIsInJlc3RfYXBpIjp0cnVlfQ.YaeTr6PVX4GgzqYKiRM9V0Fw_dEsOE8CClHFjITRJCQ";
    let { id, manual_status } = await this.getAgentByName(agentName);
    this._agentId = id;
    this._dynamic_key = dynamic_key;

    if (this._agentId) {
      let result = await this.onChangeAgentIdStatus(status);
      if (result.r === 0) {
        this.updateAgentStatusAbit(result.manual_status_ready_for_receive_call);
      }
      return result;
    } else {
      return {
        message: `#(400) Agent id ${agentName} not exist`,
        code: 400,
        payload: {},
      };
    }
  }
}

module.exports = AgentModel;
