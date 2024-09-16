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
  akceCalender: [{ type: String }],
  rQuillText: { type: String },
  toDoList: [{ type: String }],
});
const UserSchemaModel = mongoose.model(`UserSchema`, UserSchema);

module.exports = { UserPasswordModel, UserSchemaModel };
