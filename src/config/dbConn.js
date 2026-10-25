const mongoose = require("mongoose");

if (!process.env.DATABASE_URI)
  throw new Error(`DATABASE URI Can Not be empty!`);

const connectedDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw new Error(`MongoDB connection error:, ${err.message}`);
  }
};

module.exports = connectedDB;
