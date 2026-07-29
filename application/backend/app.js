require("dotenv").config();

const express = require("express");
const cors = require("cors");
const client = require("prom-client");

const app = express();

app.use(cors());
app.use(express.json());

// Register default metrics
const register = new client.Registry();

client.collectDefaultMetrics({
    register
});

// HTTP Request Counter
const httpRequestCounter = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status"]
});

register.registerMetric(httpRequestCounter);

// Middleware
app.use((req, res, next) => {

    res.on("finish", () => {
        httpRequestCounter.inc({
            method: req.method,
            route: req.route?.path || req.path,
            status: res.statusCode
        });
    });

    next();
});

const productRoutes = require("./routes/productRoutes");

app.use("/api", productRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        service: "backend",
        timestamp: new Date().toISOString()
    });
});

// Prometheus endpoint
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
