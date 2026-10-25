const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

const allowedOrigins = [...envOrigins];
const PORT = process.env.PORT || 3500;

if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push(
    `http://localhost:${PORT}`,
    `http://192.168.1.105:${PORT}`,
    `http://192.168.12.1:${PORT}`,
    `http://192.168.1.105:5173`,
    `http://192.168.12.1:5173`,
    `http://localhost:5173`,
  );
  console.log(allowedOrigins);
}

module.exports = allowedOrigins;
