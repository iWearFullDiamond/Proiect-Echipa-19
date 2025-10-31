import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
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

//Colectat date 
app.post("/submit", (req, res) => {
  // req.body contine toate campurile din formular
  console.log(req.body);

  const { prenume, nume, email, phone, facultate, specializare, an_studiu } = req.body;

  // Verificam ca avem minim cateva date
  if (!prenume || !nume || !email) {
    return res.send("Te rog completeaza numele si emailul.");
  }

  // Facem un obiect simplu cu aceste date
  const student = {
    id: Date.now(),
    prenume,
    nume,
    email,
    phone,
    facultate,
    specializare,
    an_studiu,
  };

  // Salvam in inscrieri.json
  const filePath = path.join(__dirname, "inscrieri.json");

  // Daca nu exista fisierul, il cream gol
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
  }

  // Citeste ce era deja acolo
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  data.push(student);

  // Rescrie fisierul cu noul array
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  // Trimite raspuns in browser
  res.send(`
    <h2>Inregistrare salvata!</h2>
    <p>Mutumim, ${prenume} ${nume}!</p>
    <a href="/form">Inapoi la formular</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
