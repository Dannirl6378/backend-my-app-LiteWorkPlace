// testHashing.js
const PasswordUtility = require('./PasswordUtility');

async function testHashing() {
  try {
    const plaintextPassword = 'testPassword';

    // Hašování hesla
    const hashedPassword = await PasswordUtility.hashPassword(plaintextPassword);
    console.log('Hašované heslo:', hashedPassword);

    // Porovnání s platným heslem
    const isValidPassword = await PasswordUtility.comparePassword(plaintextPassword, hashedPassword);
    console.log('Platné heslo:', isValidPassword);

    // Porovnání s neplatným heslem
    const isInvalidPassword = await PasswordUtility.comparePassword('wrongPassword', hashedPassword);
    console.log('Neplatné heslo:', isInvalidPassword);
  } catch (error) {
    console.error('Chyba:', error);
  }
}

// Spuštění testů
testHashing();
