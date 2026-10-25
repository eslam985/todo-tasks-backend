require("dotenv").config();
const express = require("express");
const app = express();
app.set("trust proxy", 1);
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");

const connectedDB = require("./config/dbConn.js");
const verifyJWT = require("./middleware/verifyJWT.js");
const corsOptions = require("./config/corsOptions.js");
const { authLimiter, generalLimiter } = require("./config/rateLimiter.js");
const { logger } = require("./middleware/logEvents.js");
const {
  errorHandler,
  errorHandlerjSON,
} = require("./middleware/errorHandler.js");

const PORT = process.env.PORT || 3500;

connectedDB();

app.use(logger);

app.use(helmet());

app.use(cors(corsOptions));

app.use(generalLimiter);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/", require("./routes/root.js"));
app.use(
  "/api/auth/register",
  authLimiter,
  require("./routes/api/auth/register.js"),
);
app.use("/api/auth/login", authLimiter, require("./routes/api/auth/login.js"));
app.use("/api/auth/refresh", require("./routes/api/auth/refresh.js"));
app.use("/api/auth/logout", require("./routes/api/auth/logout.js"));
app.use("/api/auth/logout", require("./routes/api/auth/logout.js"));

app.use(verifyJWT);
app.use("/api/tasks", require("./routes/api/tasks/index.js"));

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandlerjSON);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}\nhttp://192.168.12.1:${PORT}`);
});

mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB successfully");
});
