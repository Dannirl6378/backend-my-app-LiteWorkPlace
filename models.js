// models.js
const mongoose = require("mongoose");

const UsersPasswordSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const UserPasswordModel = mongoose.model("UserPassword", UsersPasswordSchema);

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel, UserPasswordModel };
