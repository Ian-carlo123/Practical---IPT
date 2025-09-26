const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors()); // allow all origins

// Ignore favicon requests to prevent 404 logs
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

// Path to your db.json file
const dbFile = "./db.json";

// Route to serve JSON data
app.get("/", (req, res) => {
  fs.readFile(dbFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading db.json:", err);
      res.status(500).json({ error: "Error reading db.json" });
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(jsonData, null, 2));
    } catch (parseErr) {
      console.error("Error parsing db.json:", parseErr);
      res.status(500).json({ error: "Invalid JSON format in db.json" });
    }
  });
});

app.listen(port, () => {
  console.log(`✅ JSON server running at http://localhost:${port}`);
});
