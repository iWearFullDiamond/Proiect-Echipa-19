import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
app.use(express.json());

const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, "../frontend");

// test rapid
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.get("/", (_req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
