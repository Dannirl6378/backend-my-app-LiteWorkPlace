// index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes"); // Načte všechny uživatelské endpointy
require("dotenv").config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URL = process.env.MONGODB_URL;

if (!PORT || !MONGODB_URL) {
  console.error("Chyba: Konfigurační soubor config.env nebyl správně načten.");
  process.exit(1);
}
const allowedOrigins = [
  "https://lite-work-place-n2sy.vercel.app",
  "https://localhost:3000", // Pro lokální vývoj
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy blocked this origin."));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use((req, res, next) => {
  //console.log(`Přijatý požadavek: ${req.method} ${req.url}`);
  next();
});

// Připojení routeru pro uživatelské endpointy
app.use("/api", userRouter);

// Připojení k MongoDB
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// Spuštění serveru
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
