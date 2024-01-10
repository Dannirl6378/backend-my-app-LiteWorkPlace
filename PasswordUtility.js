// PasswordUtility.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secretKey } = require("./config");
const express = require("express");
const router = express.Router();

const saltRounds = 10;

async function hashPassword(plaintextPassword) {
  const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds);
  return hashedPassword;
}

router.post("/hashPassword", async (req, res) => {
  const { password } = req.body;
  console.log('Received request to hash password:', password);
  const hashedPassword = await hashPassword(password);
  res.json({ hashedPassword });
});

async function comparePassword(plaintextPassword, hashedPassword) {
  const isValidPassword = await bcrypt.compare(
    plaintextPassword,
    hashedPassword
  );
  return isValidPassword;
}

function generateToken(user) {
  const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
    expiresIn: "1h",
  });
  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error("Chyba při ověřování tokenu:", error);
    return null;
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  router,
};
