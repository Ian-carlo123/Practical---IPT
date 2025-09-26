// server-xml.js
const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3001;
const dbFile = "./db.xml";

// Allow frontend to fetch
app.use(cors());

// Serve XML
app.get("/api/xml", (req, res) => {
  fs.readFile(dbFile, "utf8", (err, data) => {
    if (err) {
      console.error("❌ Error reading db.xml:", err);
      return res.status(500).send("<error>Error reading db.xml</error>");
    }
    res.type("application/xml");
    res.send(data);
  });
});

// Start server
app.listen(port, () => {
  console.log(`✅ XML server running at http://localhost:${port}/api/xml`);
});
