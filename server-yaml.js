const express = require("express");
const fs = require("fs");
const cors = require("cors");
const yaml = require("js-yaml");

const app = express();
const port = 3002;
const dbFile = "./db.yml";

app.use(cors());
app.use(express.json());

// 🔹 Helper functions
function readDB() {
  const fileContents = fs.readFileSync(dbFile, "utf8");
  return yaml.load(fileContents);
}

function writeDB(data) {
  fs.writeFileSync(dbFile, yaml.dump(data), "utf8");
}

// ------------------------------------------------------
// 🔹 ROOT ROUTES
// ------------------------------------------------------

// Serve raw YAML
app.get("/", (req, res) => {
  try {
    const fileContents = fs.readFileSync(dbFile, "utf8");
    res.type("text/yaml").send(fileContents);
  } catch (err) {
    res.status(500).send("Error reading db.yml");
  }
});

// Serve JSON version
app.get("/json", (req, res) => {
  try {
    res.json(readDB());
  } catch (err) {
    res.status(500).send("Error converting YAML to JSON");
  }
});

// ------------------------------------------------------
// 🔹 STUDENTS CRUD (Borrowers = Students)
// ------------------------------------------------------
app.get("/students", (req, res) => {
  const db = readDB();
  res.json(db.Borrowers || []);
});

app.get("/students/:id", (req, res) => {
  const db = readDB();
  const student = (db.Borrowers || []).find(s => String(s.borrower_id) === req.params.id);
  student ? res.json(student) : res.status(404).send("Student not found");
});

app.post("/students", (req, res) => {
  const db = readDB();
  db.Borrowers = db.Borrowers || [];
  db.Borrowers.push(req.body);
  writeDB(db);
  res.status(201).json(req.body);
});

app.put("/students/:id", (req, res) => {
  const db = readDB();
  const idx = (db.Borrowers || []).findIndex(s => String(s.borrower_id) === req.params.id);
  if (idx === -1) return res.status(404).send("Student not found");
  db.Borrowers[idx] = { ...db.Borrowers[idx], ...req.body };
  writeDB(db);
  res.json(db.Borrowers[idx]);
});

app.delete("/students/:id", (req, res) => {
  const db = readDB();
  const before = db.Borrowers.length;
  db.Borrowers = db.Borrowers.filter(s => String(s.borrower_id) !== req.params.id);
  if (db.Borrowers.length === before) return res.status(404).send("Student not found");
  writeDB(db);
  res.sendStatus(204);
});

// ------------------------------------------------------
// 🔹 BOOKS CRUD
// ------------------------------------------------------
app.get("/books", (req, res) => {
  const db = readDB();
  res.json(db.Books || []);
});

app.get("/books/:id", (req, res) => {
  const db = readDB();
  const book = (db.Books || []).find(b => String(b.book_id) === req.params.id);
  book ? res.json(book) : res.status(404).send("Book not found");
});

app.post("/books", (req, res) => {
  const db = readDB();
  db.Books = db.Books || [];
  db.Books.push(req.body);
  writeDB(db);
  res.status(201).json(req.body);
});

app.put("/books/:id", (req, res) => {
  const db = readDB();
  const idx = (db.Books || []).findIndex(b => String(b.book_id) === req.params.id);
  if (idx === -1) return res.status(404).send("Book not found");
  db.Books[idx] = { ...db.Books[idx], ...req.body };
  writeDB(db);
  res.json(db.Books[idx]);
});

app.delete("/books/:id", (req, res) => {
  const db = readDB();
  const before = db.Books.length;
  db.Books = db.Books.filter(b => String(b.book_id) !== req.params.id);
  if (db.Books.length === before) return res.status(404).send("Book not found");
  writeDB(db);
  res.sendStatus(204);
});

// ------------------------------------------------------
// 🔹 AUTHORS CRUD
// ------------------------------------------------------
app.get("/authors", (req, res) => {
  const db = readDB();
  res.json(db.Authors || []);
});

app.get("/authors/:id", (req, res) => {
  const db = readDB();
  const author = (db.Authors || []).find(a => String(a.aut_id) === req.params.id);
  author ? res.json(author) : res.status(404).send("Author not found");
});

app.post("/authors", (req, res) => {
  const db = readDB();
  db.Authors = db.Authors || [];
  db.Authors.push(req.body);
  writeDB(db);
  res.status(201).json(req.body);
});

app.put("/authors/:id", (req, res) => {
  const db = readDB();
  const idx = (db.Authors || []).findIndex(a => String(a.aut_id) === req.params.id);
  if (idx === -1) return res.status(404).send("Author not found");
  db.Authors[idx] = { ...db.Authors[idx], ...req.body };
  writeDB(db);
  res.json(db.Authors[idx]);
});

app.delete("/authors/:id", (req, res) => {
  const db = readDB();
  const before = db.Authors.length;
  db.Authors = db.Authors.filter(a => String(a.aut_id) !== req.params.id);
  if (db.Authors.length === before) return res.status(404).send("Author not found");
  writeDB(db);
  res.sendStatus(204);
});

// ------------------------------------------------------
// 🔹 BORROWS CRUD (nested under Borrowers)
// ------------------------------------------------------
app.get("/borrows", (req, res) => {
  const db = readDB();
  const allBorrows = (db.Borrowers || []).flatMap(b => b.BorrowBatches?.flatMap(bb => bb.Borrows || []) || []);
  res.json(allBorrows);
});

// Start server
app.listen(port, () => {
  console.log(`✅ YAML CRUD API running at http://localhost:${port}`);
});
