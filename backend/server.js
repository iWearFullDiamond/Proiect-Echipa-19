import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { addStudent, getAllStudents, deleteStudents } from "./database.js";

const app = express()
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, "../frontend");
app.use(express.static(frontendDir));

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

  // Validare backend
  const RegexLitere = /^[A-Za-zĂÂÎȘȚăâîșț]+([ ][A-Za-zĂÂÎȘȚăâîșț]+)*$/;
  const RegexEmail = /^[A-Za-z0-9._]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const RegexTel = /^\+?[0-9\s\-]{10,20}$/;

  if (!RegexLitere.test(prenume)) {
    return res.send("Prenumele contine caractere invalide!");
  }

  if (!RegexLitere.test(nume)) {
    return res.send("Numele de Familie contine caractere invalide!");
  }

  if (!RegexEmail.test(email)) {
    return res.send("Email invalid! Te rugam sa folosesti un format corect (ex: nume@domeniu.com)");
  }

   if (phone && !RegexTel.test(phone)) {
    return res.send("Numarul de telefon contine caractere invalide!");
  }

   if (!RegexLitere.test(facultate)) {
    return res.send("Facultatea contine caractere invalide!");
  }

  if (!RegexLitere.test(specializare)) {
    return res.send("Specializarea contine caractere invalide!");
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

// Sterge un student dupa ID din browser
app.get("/delete/:id", (req, res) => {
  const id = (req.params.id);
  if (isNaN(id)) return res.status(400).send("ID invalid");

  const result = deleteStudents(id);

  if (result.changes === 0) {
    return res.status(404).send(`Nu a fost gasit un student cu ID-ul ${id}`);
  }

  res.send(`Studentul cu ID-ul ${id} a fost sters din baza de date.`);
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
