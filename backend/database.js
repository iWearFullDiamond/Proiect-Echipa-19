import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const dbPath = path.join(__dirname, "db.sqlite");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS inscrieri (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prenume TEXT NOT NULL,
    nume TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    facultate TEXT,
    specializare TEXT,
    an_studiu INTEGER,
    activitate TEXT
  );
`);

export function addStudent({ prenume, nume, email, phone, facultate, specializare, an_studiu, activitate }) {
  const stud = db.prepare(`
    INSERT INTO inscrieri (prenume, nume, email, phone, facultate, specializare, an_studiu, activitate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stud.run(
    prenume,
    nume,
    email,
    phone,
    facultate,
    specializare,
    an_studiu,
    activitate
  );

  return result.lastInsertRowid;
}

export function getAllStudents() {
  const stud = db.prepare(`
    SELECT id, prenume, nume, email, phone, facultate, specializare, an_studiu, activitate
    FROM inscrieri
    ORDER BY id ASC
  `);
  return stud.all();
}

export function deleteStudents(id) {
  const stmt = db.prepare("DELETE FROM inscrieri WHERE id = ?");
  return stmt.run(id);
}


