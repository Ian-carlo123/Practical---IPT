const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;
const dbFile = "./db.json";

app.use(cors());
app.use(express.json());

// Helper functions
function readDB() {
  return JSON.parse(fs.readFileSync(dbFile, "utf8"));
}
function writeDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// ===== Root endpoint: show entire db.json =====
app.get("/", (req, res) => {
  const db = readDB();
  res.json(db);
});

// ===== Borrows CRUD =====
app.get("/borrows", (req, res) => {
  const db = readDB();
  res.json(db.Borrows);
});

app.get("/borrows/:id", (req, res) => {
  const db = readDB();
  const borrow = db.Borrows.find(b => b.borrow_transactionid === req.params.id);
  if (!borrow) return res.status(404).json({ error: "Borrow not found" });
  res.json(borrow);
});

app.post("/borrows", (req, res) => {
  const db = readDB();
  db.Borrows.push(req.body);
  writeDB(db);
  res.status(201).json(req.body);
});

app.put("/borrows/:id", (req, res) => {
  const db = readDB();
  const index = db.Borrows.findIndex(b => b.borrow_transactionid === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Borrow not found" });
  db.Borrows[index] = req.body;
  writeDB(db);
  res.json(req.body);
});

app.delete("/borrows/:id", (req, res) => {
  const db = readDB();
  const index = db.Borrows.findIndex(b => b.borrow_transactionid === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Borrow not found" });
  db.Borrows.splice(index, 1);
  writeDB(db);
  res.sendStatus(204);
});

// ===== Student info (single object) =====
app.get("/student", (req, res) => {
  const db = readDB();
  res.json(db.Student);
});

app.put("/student", (req, res) => {
  const db = readDB();
  db.Student = req.body;
  writeDB(db);
  res.json(db.Student);
});

// ===== Update fines/status only =====
app.patch("/student/fines", (req, res) => {
  const db = readDB();
  if (req.body.borrow_fines !== undefined) db.Student.borrow_fines = req.body.borrow_fines;
  if (req.body.borrow_status !== undefined) db.Student.borrow_status = req.body.borrow_status;
  writeDB(db);
  res.json(db.Student);
});

// ===== Start server =====
app.listen(port, () => {
  console.log(`✅ API running at http://localhost:${port}`);
});
