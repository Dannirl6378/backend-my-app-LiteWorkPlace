// PasswordUtility.js
const { UserPasswordModel } = require("./models");

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

async function comparePassword(plaintextPassword, email) {
  const user = await UserPasswordModel.findOne({ email: email });
  if (!user) {
    return { error: "Uživatel s daným e-mailem nebyl nalezen." };
  }
  const isValidPassword = await bcrypt.compare(
    plaintextPassword,
    user.password
  );
  if (!isValidPassword) {
    return { success: false, message: "Neplatné heslo." };
  }

  return { success: true, message: "Přihlášení úspěšné." };
}

async function getUser(email) {
  const user = await UserPasswordModel.findOne({ email: email });
  if (!user) {
    return { error: "Uživatel s daným e-mailem nebyl nalezen." };
  }
  return user.name;
}

router.post("/getUser", async (req, res) => {
  const email = req.body;
  const user = await getUser(email);
  if (user) {
    res.json({ message: user.message });
  }
});

router.post("/comparePassword", async (req, res) => {
  const { password, email } = req.body;
  console.log("zadost o overeni hesla:", password, email);

  // Získání uživatele podle e-mailu
  //const user = await UserModel.findOne({ email: email });
  //console.log("useremail", user.email);
  // Porovnání zadaného hesla s hašovaným heslem uloženým v databázi
  const isPasswordValid = await comparePassword(password, email);

  if (isPasswordValid.error) {
    return res.status(401).json({ error: isPasswordValid.error });
  }

  res.json({ message: isPasswordValid.message });
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
  getUser,
  router,
};
