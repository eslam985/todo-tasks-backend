const { logEvents } = require("./logEvents");

const errorHandlerjSON = (err, req, res, next) => {

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ success: false, message: "The Jason format is not valid" });
  }


  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "حاجة وقعت في السيرفر"
  });
};

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.error(err.stack);
  res.status(500).send(err.message);
};

module.exports = { errorHandler, errorHandlerjSON };