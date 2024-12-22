const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserModel = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username must be unique"],
  },
  password: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserModel.plugin(passportLocalMongoose);

module.exports = mongoose.model("users", UserModel);
