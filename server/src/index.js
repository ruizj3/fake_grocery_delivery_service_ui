require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const apiRoutes = require("./routes/api");

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3001;

// --------------- Security middleware ---------------
app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  })
);

app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60,             // 60 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(express.json({ limit: "1mb" }));

// --------------- Routes ---------------
app.use("/api", apiRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// --------------- Serve React build in production ---------------
const clientBuild = path.join(__dirname, "../../client/build");
app.use(express.static(clientBuild));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientBuild, "index.html"));
});

// --------------- Error handler ---------------
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// --------------- Start ---------------
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
