var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var toolRouter = require("./routes/tool");
var callRouter = require("./routes/call");
const agentRouter = require("./routes/agent");
const cors = require("./middlewares/cors");
var app = express();

console.log("Hello pcc.abitstore.vn");

var bodyParser = require("body-parser");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(cors);
app.use("/", indexRouter);
app.use("/tool", toolRouter);
app.use("/call", callRouter);
app.use("/agent", agentRouter);


// catch 404 and forward to error handler
//Handling 404
app.use(function(req, res) {
  res.status(404).json({
    error: {
      message: "Not Route Found",
      code: 404
    }
  });
});
// Handling 500
app.use(function(error, req, res, next) {
  console.log("TCL: error", error);
  res.status(500).json({
    error: {
      message: "Server Error",
      code: 500
    }
  });
});
module.exports = app;
