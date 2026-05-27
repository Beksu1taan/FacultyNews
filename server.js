const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  uri: process.env.MYSQL_URL
});

db.connect((err) => {

  if (err) {
    console.log(err);
  } else {

    console.log("MySQL connected");

    db.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        course VARCHAR(255),
        email VARCHAR(255)
      )
    `);

    db.query(`
      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        image VARCHAR(500),
        content TEXT,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255),
        password VARCHAR(255)
      )
    `);

    db.query(`
      INSERT IGNORE INTO admins (id, email, password)
      VALUES (1, 'admin@gmail.com', '123456')
    `);

    console.log("Tables ready");
  }
});

app.get("/", (req, res) => {
  res.send("API WORKING");
});

/* SUBSCRIBE */

app.post("/subscribe", (req, res) => {

  const { name, course, email } = req.body;

  db.query(
    "INSERT INTO subscribers (name, course, email) VALUES (?, ?, ?)",
    [name, course, email],
    (err) => {

      if (err) {
        console.log(err);
        return res.json({ success:false });
      }

      res.json({ success:true });
    }
  );
});

/* LOGIN */

app.post("/login", (req, res) => {

  const { email, password } = req.body;

  db.query(
    "SELECT * FROM admins WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {

      if (err) {
        return res.json({ success:false });
      }

      if (result.length > 0) {
        res.json({ success:true });
      } else {
        res.json({ success:false });
      }
    }
  );
});

/* CREATE NEWS */

app.post("/create-news", (req, res) => {

  const { title, image, content } = req.body;

  db.query(
    "INSERT INTO news (title, image, content) VALUES (?, ?, ?)",
    [title, image, content],
    (err) => {

      if (err) {
        console.log(err);
        return res.json({ success:false });
      }

      res.json({ success:true });
    }
  );
});

/* GET NEWS */

app.get("/news", (req, res) => {

  db.query(
    "SELECT * FROM news ORDER BY id DESC",
    (err, result) => {

      if (err) {
        console.log(err);
        return res.json([]);
      }

      res.json(result);
    }
  );
});

/* REAL VIEWS */

app.post("/view/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "UPDATE news SET views = views + 1 WHERE id = ?",
    [id],
    (err) => {

      if (err) {
        console.log(err);
        return res.json({ success:false });
      }

      res.json({ success:true });
    }
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});
