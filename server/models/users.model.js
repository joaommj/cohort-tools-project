const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
// Schema - describes and enforces the structure of the documents

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

// CREATE MODEL
const Users = mongoose.model("Users", userSchema);

// EXPORT THE MODEL
module.exports = Users;
