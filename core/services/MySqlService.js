const mysql = require("mysql");
const defaultConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  charset: process.env.MYSQL_CHARSET,
};
class MySqlService {
  constructor(config = defaultConfig) {
    this.connection = mysql.createConnection(config);
    this.connection.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");
    });
    this.connection.on("error", function (err) {
      console.log("db error", err);
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        // Connection to the MySQL server is usually
        console.log("DISCONNECT"); // lost due to either server restart, or a
      } else {
        // connnection idle timeout (the wait_timeout
        throw err; // server variable configures this)
      }
    });
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) {
          console.log("----- Loi ket noi toi my sql");
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      // this.connection.end((err) => {
      //   if (err) return reject(err);
      //   resolve();
      // });
      this.connection.destroy();
      resolve();
    });
  }
}
module.exports = MySqlService;
