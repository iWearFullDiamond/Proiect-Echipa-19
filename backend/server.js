import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { addStudent, getAllStudents } from "./database.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, "../frontend");

//Test rapid
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

//Pagina principala
app.get("/", (_req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

//Pagina formular
app.get("/form", (_req, res) => {
  res.sendFile(path.join(frontendDir, "form.html"));
});

// Colectat date 
app.post("/submit", (req, res) => {
  // ce a trimis formularul
  const {
    prenume,
    nume,
    email,
    phone,
    facultate,
    specializare,
    an_studiu
  } = req.body;

  // Validare
  if (!prenume || !nume || !email) {
    return res.send("Te rog completeaza numele si emailul.");
  }

  // Introducem in baza de date
  const newId = addStudent({
    prenume,
    nume,
    email,
    phone,
    facultate,
    specializare,
    an_studiu
  });

  // Raspuns dupa ce a fost inserat în DB
  res.send(`
    <h2>Inregistrare salvata!</h2>
    <p>Multumim, ${prenume} ${nume}!</p>
    <p>ID inscriere in baza de date: <b>${newId}</b></p>
    <a href="/form">Inapoi la formular</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
