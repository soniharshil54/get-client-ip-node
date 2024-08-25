const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const p = require('phin');

const PORT = process.env.PORT || 4010;

// In-memory request logs
const requestLogs = [];

app.use(cors());
app.use(bodyParser.json());

// Controller Functions

// Healthcheck Controller
const healthcheck = async (req, res, next) => {
    try {
        const response = {
            "req.headers['x-forwarded-for']": req.headers['x-forwarded-for'],
            "req.ip": req.ip,
        };
        return res.json({
            userInfo: response,
            message: 'ok',
            note: 'ok man'
        });
    } catch (err) {
        console.log('err', err);
        next({ status: 400, message: "failed to healthcheck" });
    }
};

// Hit Controller
const hit = async (req, res, next) => {
    try {
        const phinResponse = await p({
            url: 'https://httpbin.org/ip',
            parse: 'json'
        });
        const apiResponse = phinResponse && phinResponse.body ? phinResponse.body : {
            message: 'No internet it seems'
        };
        const serverIp = apiResponse.origin || apiResponse.message;
        const log = {
            "req.headers['x-forwarded-for']": req.headers['x-forwarded-for'],
            "req.ip": req.ip,
            "hitAt": new Date(),
            "serverIp": serverIp,
        };
        requestLogs.push(log);
        return res.json({
            data: log,
            message: 'you hit it 9:31',
            note: 'ok'
        });
    } catch (err) {
        console.log('err', err);
        next({ status: 400, message: "failed to hit", error: err });
    }
};

// Request Logs Controller
const getRequestLogs = async (req, res, next) => {
    try {
        return res.json({
            data: requestLogs,
            message: 'you ask it! you got it!',
        });
    } catch (err) {
        console.log('err', err);
        next({ status: 400, message: "failed to retrieve request logs" });
    }
};

// Routes under the /v1 namespace
app.get("/v1/healthcheck", healthcheck);
app.get("/v1/hit", hit);
app.get("/v1/request-logs", getRequestLogs);
app.get("/api/healthcheck", healthcheck);
app.get("/api/hit", hit);
app.get("/api/request-logs", getRequestLogs);
app.get("/healthcheck", healthcheck);
app.get("/hit", hit);
app.get("/request-logs", getRequestLogs);

// Error handling middleware
app.use((err, req, res, next) => {
    return res.status(err.status || 400).json({
        status: err.status || 400,
        message: err.message || "there was an error processing request"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
