const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"))

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("DB Connection Error:", err);
        return; // ✅ just stop here
    }
    console.log("MySQL Connected...");
});

// Get all seats
app.get('/seats', (req, res) => {
    db.query("SELECT * FROM seats", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Book a seat
app.post('/book/:id', (req, res) => {
    const id = req.params.id;
    db.query("UPDATE seats SET status='booked' WHERE id=?", [id], (err, result) => {
        if (err) throw err;
        res.send({ message: "Seat booked!" });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
