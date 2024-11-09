// routes.js
const express = require("express");
const { UserModel, UserPasswordModel } = require("./models");
const { hashPassword, comparePassword } = require("./PasswordUtility");

const router = express.Router();

// Registrace uživatele
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email již je používán." });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();

    const newUserPassword = new UserPasswordModel({ name, email, password });
    await newUserPassword.save();

    res.status(201).json({ message: "Uživatel byl úspěšně zaregistrován." });
  } catch (error) {
    console.error("Chyba při registraci uživatele:", error);
    res.status(500).json({ error: "Chyba při registraci uživatele." });
  }
});

// Přihlášení uživatele
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    console.error("loginUser notfound", user);

    if (!user) {
      return res.status(404).json({ error: "Uživatel nenalezen." });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Neplatné heslo." });
    }

    res.status(200).json({ message: "Přihlášení úspěšné." });
  } catch (error) {
    console.error("Chyba při přihlašování uživatele:", error);
    res.status(500).json({ error: "Chyba při přihlašování uživatele." });
  }
});

// Získání všech uživatelů
router.get("/all", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (error) {
    console.error("Chyba při získávání uživatelů:", error);
    res.status(500).json({ error: "Chyba při získávání uživatelů." });
  }
});

// Získání uživatele podle emailu
router.get("/getUser/:email", async (req, res) => {
  console.log("Získávání uživatele podle emailu:", req.params.email);
  const { email } = req.params;

  if (!email) {
    // Pokud je email null nebo prázdný, neprovádějte další akce
    return res.status(400).json({ error: "Email musí být zadán." });
  }
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Uživatel nenalezen." });
    }

    res.json(user);
  } catch (error) {
    console.error("Chyba při získávání uživatelských dat:", error);
    res.status(500).json({ error: "Chyba serveru." });
  }
});

// Aktualizace uživatelských dat
router.patch("/update", async (req, res) => {
  const { email, akceCalander, Quilltext, todoList } = req.body;

  try {
    const user = await UserModel.findOne({ email });


    // Log before saving
console.log('User object before saving:', user);

try {
  await user.save();
} catch (saveError) {
  console.error('Save error:', saveError);
  res.status(500).json({ error: 'Error saving user data to the database.' });
}


    if (!user) {
      return res.status(404).json({ error: "Uživatel nenalezen." });
    }

    // Update fields only if provided
    if (akceCalander !== undefined) user.akceCalander = akceCalander;
    if (Quilltext !== undefined) user.Quilltext = Quilltext;
    if (todoList !== undefined) user.todoList = todoList;

    await user.save();
    res.json({ message: "Uživatelská data byla úspěšně aktualizována." });
  } catch (error) {
    console.error("Chyba při aktualizaci uživatelských dat:", error);
    res
      .status(500)
      .json({ error: "Chyba serveru při aktualizaci uživatelských dat." });
  }
});

module.exports = router;
