// server.js nebo app.js (backend-my-app)
const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb+srv://Dantik147:fTMb7RhJdAkqCsOB@cluster0.jnfmix6.mongodb.net/Users', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UsersPasswordSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const UserPasswordModel = mongoose.model('UserPassword', UsersPasswordSchema);

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const UserModel = mongoose.model('User', UserSchema);

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

    console.log('Uživatel byl úspěšně zaregistrován:', savedUser);
    console.log('Uživatel s původním heslem:', savedUserPassword);

    res.status(201).json({ message: 'Uživatel byl úspěšně zaregistrován.' });
  } catch (error) {
    console.error('Chyba při registraci uživatele:', error);
    res.status(500).json({ error: 'Chyba při registraci uživatele.' });
  }
});

app.get('/getUsers', async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
    console.log('Seznam uživatelů:', users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chyba při získávání uživatelů' });
  }
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
