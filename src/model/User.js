const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
      unique: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      minlength: 3,
      maxlength: 100,
      match: /.+\@.+\..+/
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    refreshtoken: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);