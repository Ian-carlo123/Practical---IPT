const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;
const dbFile = "./db.json";

app.use(cors());
app.use(express.json());

// ===== Helpers =====
function readDB() {
  return JSON.parse(fs.readFileSync(dbFile, "utf8")); // top-level array
}
function writeDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// ===== Root endpoint =====
app.get("/", (req, res) => {
  const db = readDB();
  res.json(db);
});


// ======================= BORROWS CRUD =======================
app.get("/borrows", (req, res) => {
  const db = readDB();
  res.json(db);
});

app.get("/borrows/:id", (req, res) => {
  const db = readDB();
  const borrow = db.find(b => b.borrow_transactionid === req.params.id);
  if (!borrow) return res.status(404).json({ error: "Borrow not found" });
  res.json(borrow);
});

app.post("/borrows", (req, res) => {
  const db = readDB();
  db.push(req.body);
  writeDB(db);
  res.status(201).json(req.body);
});

app.put("/borrows/:id", (req, res) => {
  const db = readDB();
  const index = db.findIndex(b => b.borrow_transactionid === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Borrow not found" });
  db[index] = req.body;
  writeDB(db);
  res.json(req.body);
});

app.delete("/borrows/:id", (req, res) => {
  const db = readDB();
  const index = db.findIndex(b => b.borrow_transactionid === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Borrow not found" });
  db.splice(index, 1);
  writeDB(db);
  res.sendStatus(204);
});


// ======================= STUDENTS CRUD =======================
app.get("/students", (req, res) => {
  const db = readDB();
  const seen = new Set();
  const students = [];
  db.forEach(b => {
    if (b.Student && !seen.has(b.Student.stud_id)) {
      seen.add(b.Student.stud_id);
      students.push(b.Student);
    }
  });
  res.json(students);
});

app.get("/students/:id", (req, res) => {
  const db = readDB();
  const student = db.find(b => b.Student?.stud_id === req.params.id)?.Student;
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
});

app.post("/students", (req, res) => {
  const db = readDB();
  // Attach new student to all borrows (or handle differently if needed)
  db.forEach(b => { b.Student = req.body; });
  writeDB(db);
  res.status(201).json(req.body);
});

app.put("/students/:id", (req, res) => {
  const db = readDB();
  let updated = false;
  db.forEach(b => {
    if (b.Student?.stud_id === req.params.id) {
      b.Student = req.body;
      updated = true;
    }
  });
  if (!updated) return res.status(404).json({ error: "Student not found" });
  writeDB(db);
  res.json(req.body);
});

app.patch("/students/:id", (req, res) => {
  const db = readDB();
  let updated = false;
  db.forEach(b => {
    if (b.Student?.stud_id === req.params.id) {
      Object.assign(b.Student, req.body);
      updated = true;
    }
  });
  if (!updated) return res.status(404).json({ error: "Student not found" });
  writeDB(db);
  res.json({ message: "Student updated", changes: req.body });
});

app.delete("/students/:id", (req, res) => {
  const db = readDB();
  let deleted = false;
  db.forEach(b => {
    if (b.Student?.stud_id === req.params.id) {
      b.Student = null;
      deleted = true;
    }
  });
  if (!deleted) return res.status(404).json({ error: "Student not found" });
  writeDB(db);
  res.sendStatus(204);
});


// ======================= BOOKS CRUD =======================
app.get("/books", (req, res) => {
  const db = readDB();
  const seen = new Set();
  const books = [];
  db.forEach(b => {
    if (b.Book && !seen.has(b.Book.book_id)) {
      seen.add(b.Book.book_id);
      books.push(b.Book);
    }
  });
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const db = readDB();
  const book = db.find(b => b.Book?.book_id === req.params.id)?.Book;
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

app.post("/books", (req, res) => {
  const db = readDB();
  db.forEach(b => { b.Book = req.body; });
  writeDB(db);
  res.status(201).json(req.body);
});

app.put("/books/:id", (req, res) => {
  const db = readDB();
  let updated = false;
  db.forEach(b => {
    if (b.Book?.book_id === req.params.id) {
      b.Book = req.body;
      updated = true;
    }
  });
  if (!updated) return res.status(404).json({ error: "Book not found" });
  writeDB(db);
  res.json(req.body);
});

app.patch("/books/:id", (req, res) => {
  const db = readDB();
  let updated = false;
  db.forEach(b => {
    if (b.Book?.book_id === req.params.id) {
      Object.assign(b.Book, req.body);
      updated = true;
    }
  });
  if (!updated) return res.status(404).json({ error: "Book not found" });
  writeDB(db);
  res.json({ message: "Book updated", changes: req.body });
});

app.delete("/books/:id", (req, res) => {
  const db = readDB();
  let deleted = false;
  db.forEach(b => {
    if (b.Book?.book_id === req.params.id) {
      b.Book = null;
      deleted = true;
    }
  });
  if (!deleted) return res.status(404).json({ error: "Book not found" });
  writeDB(db);
  res.sendStatus(204);
});


// ======================= AUTHORS CRUD =======================
app.get("/authors", (req, res) => {
  const db = readDB();
  const seen = new Set();
  const authors = [];
  db.forEach(b => {
    if (b.Book?.Author && !seen.has(b.Book.Author.aut_id)) {
      seen.add(b.Book.Author.aut_id);
      authors.push(b.Book.Author);
    }
  });
  res.json(authors);
});

app.get("/authors/:id", (req, res) => {
  const db = readDB();
  const author = db.find(b => b.Book?.Author?.aut_id == req.params.id)?.Book.Author;
  if (!author) return res.status(404).json({ error: "Author not found" });
  res.json(author);
});

app.post("/authors", (req, res) => {
  const db = readDB();
  db.forEach(b => { if (b.Book) b.Book.Author = req.body; });
  writeDB(db);
  res.status(201).json(req.body);
});

app.put("/authors/:id", (req, res) => {
  const db = readDB();
  let updated = false;
  db.forEach(b => {
    if (b.Book?.Author?.aut_id == req.params.id) {
      b.Book.Author = req.body;
      updated = true;
    }
  });
  if (!updated) return res.status(404).json({ error: "Author not found" });
  writeDB(db);
  res.json(req.body);
});

app.patch("/authors/:id", (req, res) => {
  const db = readDB();
  let updated = false;
  db.forEach(b => {
    if (b.Book?.Author?.aut_id == req.params.id) {
      Object.assign(b.Book.Author, req.body);
      updated = true;
    }
  });
  if (!updated) return res.status(404).json({ error: "Author not found" });
  writeDB(db);
  res.json({ message: "Author updated", changes: req.body });
});

app.delete("/authors/:id", (req, res) => {
  const db = readDB();
  let deleted = false;
  db.forEach(b => {
    if (b.Book?.Author?.aut_id == req.params.id) {
      b.Book.Author = null;
      deleted = true;
    }
  });
  if (!deleted) return res.status(404).json({ error: "Author not found" });
  writeDB(db);
  res.sendStatus(204);
});


// ===== Start server =====
app.listen(port, () => {
  console.log(`✅ API running at http://localhost:${port}`);
});
