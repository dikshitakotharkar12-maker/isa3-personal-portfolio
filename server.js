const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Portfolio Backend is Running");
});


// TEST DATABASE
app.get("/api/test-db", (req, res) => {
  db.query("SELECT 1 AS test", (err, results) => {
    if (err) {
      console.error("Database test error:", err);

      return res.status(500).json({
        message: "Database connection failed",
      });
    }

    res.json({
      message: "Database connected successfully",
      result: results,
    });
  });
});


// CONTACT FORM
app.post("/api/contact", (req, res) => {
  console.log("Contact request received");
  console.log(req.body);

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const sql = `
    INSERT INTO contacts (name, email, message)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, message],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);

        return res.status(500).json({
          message: "Failed to save message",
          error: err.message,
        });
      }

      console.log("Contact saved successfully");

      res.status(201).json({
        message: "Message sent successfully!",
        id: result.insertId,
      });
    }
  );
});


// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});