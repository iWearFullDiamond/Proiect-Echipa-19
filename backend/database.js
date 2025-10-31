import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const dbPath = path.join(__dirname, "db.sqlite");
const db = new Database(dbPath);

// Cream tabela daca nu exista deja
db.exec(`
  CREATE TABLE IF NOT EXISTS inscrieri (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prenume TEXT NOT NULL,
    nume TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    facultate TEXT,
    specializare TEXT,
    an_studiu INTEGER
  );
`);

// inserează o inscriere noua
export function addStudent({ prenume, nume, email, phone, facultate, specializare, an_studiu }) {
  const stud = db.prepare(`
    INSERT INTO inscrieri (prenume, nume, email, phone, facultate, specializare, an_studiu)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stud.run(
    prenume,
    nume,
    email,
    phone,
    facultate,
    specializare,
    an_studiu
  );

  // ID-ul nou din baza de date
  return result.lastInsertRowid;
}

export function getAllStudents() {
  const stud = db.prepare(`
    SELECT id, prenume, nume, email, phone, facultate, specializare, an_studiu
    FROM inscrieri
    ORDER BY id ASC
  `);
  return stud.all();
}

