const defaultConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
};
const ResponseService = require("./ResponseService");
var redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis);
// var getAsync = promise.promisify(this.client.get);  //chỉ convert duy nhất hàm fs.readFile


class RedisService {
  constructor(config = defaultConfig) {
    this.client = redis.createClient(config);
    this.client.select(2, function() {});
    this.config = config;
  }
  showconnect() {
    return this.config;
  }
  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, async function(err, value) {
        if (err) {
          return reject(err);
        }
        value = JSON.parse(value);
        return resolve(value);
      });
    });
  }
  set(key, value) {
    let result = this.client.setAsync("133", "test");
    return result;
  }
  async getTest(key) {
    let result = await this.client.getAsync(key);
    try {
      result = JSON.parse(result);
      console.log("TCL: RedisService -> getTest -> result", result);
      return result;
    } catch (error) {
      return result;
    }
  }
  close() {
    this.client.end(true);
  }
}

module.exports = RedisService;
