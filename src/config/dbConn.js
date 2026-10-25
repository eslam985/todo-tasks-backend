const mongoose = require("mongoose");

const connectedDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

module.exports =connectedDB;
