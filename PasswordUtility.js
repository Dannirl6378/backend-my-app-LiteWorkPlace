// PasswordUtility.js
const { UserModel } = require("./models");

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
  console.log("zadost o hash hesla:", password);
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

router.post("/comparePassword", async (req, res) => {
  const { password } = req.body;
  console.log("zadost o overeni hesla:", password);

  // Získání uživatele podle e-mailu
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return res
      .status(404)
      .json({ error: "Uživatel s daným e-mailem nebyl nalezen." });
  }

  // Porovnání zadaného hesla s hašovaným heslem uloženým v databázi
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Neplatné heslo." });
  }

  res.json({ message: "Přihlášení úspěšné." });
});

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
