const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const secretKey = generateSecretKey();
const envFilePath = path.join(__dirname, 'config.env');

// Append the secret key to the .env file
fs.appendFileSync(envFilePath, `\nSECRET_KEY=${secretKey}\n`);

console.log('Vygenerovaný tajný klíč:', secretKey);
