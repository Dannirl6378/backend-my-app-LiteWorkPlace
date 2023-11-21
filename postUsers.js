// server.js nebo app.js (backend-my-app)
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

app.post('/registerUser', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hašování hesla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Uložení uživatele s hašovaným heslem do databáze Users
    const newUser = new UserModel({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    // Uložení uživatele s původním heslem do databáze UserPassword
    const newUserPassword = new UserPasswordModel({ name, email, password });
    const savedUserPassword = await newUserPassword.save();

    res.status(201).json({ message: 'Uživatel byl úspěšně zaregistrován.' });
  } catch (error) {
    console.error('Chyba při registraci uživatele:', error);
    res.status(500).json({ error: 'Chyba při registraci uživatele.' });
  }
});


