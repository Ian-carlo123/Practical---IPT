// server-xml.js
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const { parseStringPromise, Builder } = require("xml2js");

const app = express();
const port = 3001;
const dbFile = "./db.xml";

app.use(cors());
app.use(bodyParser.json());

// --- Utility functions ---
function readXML() {
  return new Promise((resolve, reject) => {
    fs.readFile(dbFile, "utf8", (err, data) => {
      if (err) return reject(err);
      parseStringPromise(data, { explicitArray: false })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  });
}

function writeXML(obj) {
  const builder = new Builder();
  const xml = builder.buildObject(obj);
  fs.writeFileSync(dbFile, xml, "utf8");
}

function toArray(item) {
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
}

// --- ROOT: Show full XML ---
app.get("/", (req, res) => {
  fs.readFile(dbFile, "utf8", (err, data) => {
    if (err) {
      console.error("❌ Error reading db.xml:", err);
      return res.status(500).send("<error>Error reading db.xml</error>");
    }
    res.type("application/xml");
    res.send(data);
  });
});

//
// --- STUDENTS CRUD ---
//
app.get("/students", async (req, res) => {
  try {
    const data = await readXML();
    const students = toArray(data.Database.Students.Student);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/students", async (req, res) => {
  try {
    const data = await readXML();
    if (!data.Database.Students) data.Database.Students = {};
    let students = toArray(data.Database.Students.Student);
    students.push(req.body);
    data.Database.Students.Student = students;
    writeXML(data);
    res.json({ message: "Student added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const data = await readXML();
    let students = toArray(data.Database.Students.Student);
    const idx = students.findIndex((s) => s.stud_id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Student not found" });
    students[idx] = req.body;
    data.Database.Students.Student = students;
    writeXML(data);
    res.json({ message: "Student updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    const data = await readXML();
    let students = toArray(data.Database.Students.Student);
    students = students.filter((s) => s.stud_id !== req.params.id);
    data.Database.Students.Student = students;
    writeXML(data);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// --- BOOKS CRUD ---
//
app.get("/books", async (req, res) => {
  try {
    const data = await readXML();
    const books = toArray(data.Database.Books.Book);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/books", async (req, res) => {
  try {
    const data = await readXML();
    if (!data.Database.Books) data.Database.Books = {};
    let books = toArray(data.Database.Books.Book);
    books.push(req.body);
    data.Database.Books.Book = books;
    writeXML(data);
    res.json({ message: "Book added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const data = await readXML();
    let books = toArray(data.Database.Books.Book);
    const idx = books.findIndex((b) => b.book_id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Book not found" });
    books[idx] = req.body;
    data.Database.Books.Book = books;
    writeXML(data);
    res.json({ message: "Book updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const data = await readXML();
    let books = toArray(data.Database.Books.Book);
    books = books.filter((b) => b.book_id !== req.params.id);
    data.Database.Books.Book = books;
    writeXML(data);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// --- AUTHORS CRUD ---
//
app.get("/authors", async (req, res) => {
  try {
    const data = await readXML();
    const authors = toArray(data.Database.Authors.Author);
    res.json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/authors", async (req, res) => {
  try {
    const data = await readXML();
    if (!data.Database.Authors) data.Database.Authors = {};
    let authors = toArray(data.Database.Authors.Author);
    authors.push(req.body);
    data.Database.Authors.Author = authors;
    writeXML(data);
    res.json({ message: "Author added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/authors/:id", async (req, res) => {
  try {
    const data = await readXML();
    let authors = toArray(data.Database.Authors.Author);
    const idx = authors.findIndex((a) => a.aut_id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Author not found" });
    authors[idx] = req.body;
    data.Database.Authors.Author = authors;
    writeXML(data);
    res.json({ message: "Author updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/authors/:id", async (req, res) => {
  try {
    const data = await readXML();
    let authors = toArray(data.Database.Authors.Author);
    authors = authors.filter((a) => a.aut_id !== req.params.id);
    data.Database.Authors.Author = authors;
    writeXML(data);
    res.json({ message: "Author deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// --- BORROWS CRUD ---
//
app.get("/borrows", async (req, res) => {
  try {
    const data = await readXML();
    const borrows = toArray(data.Database.Borrows.Borrow);
    res.json(borrows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/borrows", async (req, res) => {
  try {
    const data = await readXML();
    if (!data.Database.Borrows) data.Database.Borrows = {};
    let borrows = toArray(data.Database.Borrows.Borrow);
    borrows.push(req.body);
    data.Database.Borrows.Borrow = borrows;
    writeXML(data);
    res.json({ message: "Borrow added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/borrows/:id", async (req, res) => {
  try {
    const data = await readXML();
    let borrows = toArray(data.Database.Borrows.Borrow);
    const idx = borrows.findIndex((b) => b.borrow_transactionid === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Borrow not found" });
    borrows[idx] = req.body;
    data.Database.Borrows.Borrow = borrows;
    writeXML(data);
    res.json({ message: "Borrow updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/borrows/:id", async (req, res) => {
  try {
    const data = await readXML();
    let borrows = toArray(data.Database.Borrows.Borrow);
    borrows = borrows.filter((b) => b.borrow_transactionid !== req.params.id);
    data.Database.Borrows.Borrow = borrows;
    writeXML(data);
    res.json({ message: "Borrow deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Start server ---
app.listen(port, () => {
  console.log(`✅ XML server running at http://localhost:${port}`);
});
