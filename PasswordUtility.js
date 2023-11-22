// auth.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secretKey } = require('./config');

const saltRounds = 10;

async function hashPassword(plaintextPassword) {
  const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds);
  return hashedPassword;
}

async function comparePassword(plaintextPassword, hashedPassword) {
  const isValidPassword = await bcrypt.compare(plaintextPassword, hashedPassword);
  return isValidPassword;
}

function generateToken(user) {
  const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('Chyba při ověřování tokenu:', error);
    return null;
  }
}

module.exports = { hashPassword, comparePassword, generateToken, verifyToken };
