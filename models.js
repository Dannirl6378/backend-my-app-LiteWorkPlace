// models.js
const mongoose = require("mongoose");

const UsersPasswordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserPasswordModel = mongoose.model("UserPassword", UsersPasswordSchema);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  akceCalender: [{ type: String }],
  QuillText: { type: String },
  toDoList: [{ type: String }],
});
const UserModel = mongoose.model(`UserSchema`, UserSchema);

module.exports = { UserPasswordModel, UserModel };
