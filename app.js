const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 3000;

// Collect default Node.js and process metrics
client.collectDefaultMetrics();

app.get("/fast", (req, res) => {
    res.json({
        endpoint: "/fast",
        message: "Fast response",
        status: "success"
    });
});

app.get("/slow", async(req, res) => {
    // Wait for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 30% chance of a simulated error
    if (Math.random() < 0.3) {
        return res.status(503).json({
            endpoint: "/slow",
            message: "Service temporarily unavailable"
        });
    }

    res.json({
        endpoint: "/slow",
        message: "Slow response",
        delay: "5 seconds",
        status: "success"
    });
});

app.get("/error", (req, res) => {
    if (Math.random() < 0.5) {
        return res.status(500).json({
            error: "Simulated internal server error"
        });
    }

    res.json({ message: "Request succeeded" });
});

app.get("/health", (req, res) => {
    res.json({ status: "UP" });
});

// Prometheus default metrics
app.get("/metrics", async(req, res) => {
    try {
        res.set("Content-Type", client.register.contentType);
        res.end(await client.register.metrics());
    } catch (err) {
        res.status(500).end(err.message);
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
});