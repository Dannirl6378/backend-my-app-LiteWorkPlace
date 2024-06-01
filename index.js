// index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { UserModel, UserPasswordModel } = require("./models");
const { hashPassword, comparePassword } = require("./PasswordUtility");
const passwordUtilityRouter = require("./PasswordUtility").router;


require('dotenv').config({ path: './config.env' });
if (!process.env.PORT || !process.env.MONGODB_URL) {
  console.error("Chyba: Konfigurační soubor config.env nebyl správně načten.");
  process.exit(1);
}



const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/passwordUtility", passwordUtilityRouter);

const PORT = process.env.PORT || 3001;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// routes.js
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const newUser = new UserModel({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    const newUserPassword = new UserPasswordModel({ name, email, password });
    const savedUserPassword = await newUserPassword.save();

    console.log("Uživatel byl úspěšně zaregistrován:", savedUser);

    res.status(201).json({ message: "Uživatel byl úspěšně zaregistrován." });
  } catch (error) {
    console.error("Chyba při registraci uživatele:", error);
    res.status(500).json({ error: "Chyba při registraci uživatele." });
  }
});

app.post("/loginUser", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Získání uživatele podle e-mailu
    const user = await UserModel.findOne({ email });

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

    // Zde můžete provádět další kroky po úspěšném přihlášení, např. vytvoření a poslání JWT tokenu

    res.status(200).json({ message: "Přihlášení úspěšné." });
  } catch (error) {
    console.error("Chyba při přihlašování uživatele:", error);
    res.status(500).json({ error: "Chyba při přihlašování uživatele." });
  }
});

app.get("/getUsers", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
    console.log("Seznam uživatelů:", users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chyba při získávání uživatelů" });
  }
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connected to MongoDB");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
