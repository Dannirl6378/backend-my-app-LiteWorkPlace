// PasswordUtility.js
const bcrypt = require('bcrypt');

const saltRounds = 10; // Počet iterací pro hašování

async function hashPassword(plaintextPassword) {
  const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds);
  return hashedPassword;
}

async function comparePassword(plaintextPassword, hashedPassword) {
  const isValidPassword = await bcrypt.compare(plaintextPassword, hashedPassword);
  return isValidPassword;
}

module.exports = { hashPassword, comparePassword };
