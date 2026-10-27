
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Fast endpoint
app.get("/fast", (req, res) => {
  res.status(200).json({
    success: true,
    endpoint: "/fast",
    message: "Fast response received!",
    responseTime: "Immediate"
  });
});

// Slow endpoint: waits 5 seconds and sometimes fails
app.get("/slow", async (req, res) => {
  const delay = 5000; // 5 seconds

  await new Promise((resolve) => setTimeout(resolve, delay));

  // 30% chance of an error
  if (Math.random() < 0.3) {
    return res.status(503).json({
      success: false,
      endpoint: "/slow",
      error: "Service temporarily unavailable",
      message: "Simulated intermittent backend failure"
    });
  }

  return res.status(200).json({
    success: true,
    endpoint: "/slow",
    message: "Slow response received successfully!",
    delay: `${delay / 1000} seconds`
  });
});

// Endpoint that sometimes succeeds and sometimes fails
app.get("/error", (req, res) => {
  if (Math.random() < 0.5) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "This is a simulated error. Try again."
    });
  }

  return res.status(200).json({
    success: true,
    message: "The request succeeded this time!"
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Node.js backend is running"
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
