const request = require("request");
const qs = require("querystring");

class DataService {
  constructor(name) {
    this.name = name;
  }
  static get({
    baseURL = "https://icc-api.stringee.com",
    path,
    body,
    query = {},
    access_token,
  }) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-STRINGEE-AUTH": access_token,
    };
    return new Promise((resolve, reject) => {
      let url = baseURL + path;
      request.get({ url, qs: query, headers }, function (e, r, body) {
        if (e) {
          return reject(e);
        }
        resolve(JSON.parse(body));
      });
    });
  }
  static post({
    baseURL = "https://icc-api.stringee.com",
    path,
    formData,
    query = {},
    access_token,
  }) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-STRINGEE-AUTH": access_token,
    };
    return new Promise((resolve, reject) => {
      let url = baseURL + path;
      request.post(
        { url, body: formData, json: true, qs: query, headers },
        function (e, r, body) {
          if (e) {
            return reject(e);
          }
          resolve(body);
        }
      );
    });
  }
  static put({
    baseURL = "https://icc-api.stringee.com",
    path,
    formData,
    access_token,
  }) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-STRINGEE-AUTH": access_token,
    };
    return new Promise((resolve, reject) => {
      let url = baseURL + path;
      request({ method: "PUT", url, json: formData, headers }, function (
        e,
        r,
        body
      ) {
        console.log("body", body);

        if (e) {
          return reject(e);
        }
        resolve(body);
      });
    });
  }
}

module.exports = DataService;
