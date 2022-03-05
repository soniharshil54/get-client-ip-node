const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 4010;
const cors = require("cors");
const p = require('phin');

const requestLogs = [];

app.use(cors());
app.use(bodyParser.json());

app.get("/healthcheck", async (req, res, next) => {
  try {
    const response = {
      "req.headers['x-forwarded-for']": req.headers['x-forwarded-for'],
      "req.ip": req.ip,
    }
    return res.json({
      userInfo: response,
      message: 'ok',
      note: 'ok'
    })
  } catch (err) {
    console.log('err', err);
    next({ status: 400, message: "failed to healthcheck" });
  }
});

app.get("/hit", async (req, res, next) => {
  try {
    const phinResponse = await p({
      'url': 'https://httpbin.org/ip',
      'parse': 'json'
    })
    const apiResponse = phinResponse && phinResponse.body ? phinResponse.body : {
      message: 'No internet it seems'
    }
    const serverIp = apiResponse.origin || apiResponse.message;
    const log = {
      "req.headers['x-forwarded-for']": req.headers['x-forwarded-for'],
      "req.ip": req.ip,
      "hitAt": new Date(),
      "serverIp": serverIp,
    }
    requestLogs.push(log);
    return res.json({
      data: log,
      message: 'you hit it',
      note: 'ok'
    })
  } catch (err) {
    console.log('err', err);
    next({ status: 400, message: "failed to healthcheck", error: err });
  }
});

app.get("/request-logs", async (req, res, next) => {
  try {
    return res.json({
      data: requestLogs,
      message: 'you ask it! you got it!',
    })
  } catch (err) {
    console.log('err', err);
    next({ status: 400, message: "failed to healthcheck" });
  }
});

app.use((err, req, res, next) => {
  return res.status(err.status || 400).json({
    status: err.status || 400,
    message: err.message || "there was an error processing request"
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
