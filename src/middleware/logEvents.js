const fsPromises = require("fs").promises;
const fs = require("fs");
const { format } = require("date-fns");
const path = require("path");

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyy:MM:dd\tHH:mm:ss")}`;


  const { v4: uuidv4 } = await import("uuid");
  const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;

  if (process.env.NODE_ENV === "production") {
    console.log(`[LOG]: ${logItem.trim()}`);
    return;
  }

  try {
    const logsDir = path.join(__dirname, "..", "logs");

    if (!fs.existsSync(logsDir)) {
      await fsPromises.mkdir(logsDir);
    }
    await fsPromises.appendFile(path.join(logsDir, logName), logItem);
  } catch (err) {
    console.error("Failed to write log:", err);
  }
};

const logger = (req, _res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logger, logEvents };