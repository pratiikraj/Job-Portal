const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("../lib/passportConfig");
var cors = require("cors");

require("dotenv").config();

// MongoDB connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  const db = process.env.MONGO_URI;
  await mongoose.connect(db);
  cachedDb = mongoose.connection;
  console.log("MongoDB Connected");
  return cachedDb;
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// Ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ message: "Database connection error" });
  }
});

// Routing
app.use("/auth", require("../routes/authRoutes"));
app.use("/api", require("../routes/apiRoutes"));
app.use("/upload", require("../routes/uploadRoutes"));
app.use("/host", require("../routes/downloadRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Job Portal API is running" });
});

module.exports = app;
