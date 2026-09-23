const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// DATABASE
// ===============================

const db = new sqlite3.Database("./expense_tracker.db", (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("SQLite database connected successfully.");
    }
});

// ===============================
// CREATE TABLES
// ===============================

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS income (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            source TEXT NOT NULL,
            description TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS budget (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL
        )
    `);

});


// =====================================================
// EXPENSE API
// =====================================================

// GET ALL EXPENSES
app.get("/expenses", (req, res) => {

    db.all(
        "SELECT * FROM expenses ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );

});


// ADD EXPENSE
app.post("/expenses", (req, res) => {

    const {
        amount,
        date,
        category,
        description
    } = req.body;

    const sql = `
        INSERT INTO expenses
        (amount, date, category, description)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            amount,
            date,
            category,
            description
        ],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Expense added successfully",
                id: this.lastID
            });

        }
    );

});


// DELETE ONE EXPENSE
app.delete("/expenses/:id", (req, res) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM expenses WHERE id = ?",
        [id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Expense deleted successfully"
            });

        }
    );

});


// DELETE ALL EXPENSES
app.delete("/expenses", (req, res) => {

    db.run(
        "DELETE FROM expenses",
        [],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "All expenses deleted successfully"
            });

        }
    );

});


// =====================================================
// INCOME API
// =====================================================

// GET ALL INCOME
app.get("/income", (req, res) => {

    db.all(
        "SELECT * FROM income ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );

});


// ADD INCOME
app.post("/income", (req, res) => {

    const {
        amount,
        date,
        source,
        description
    } = req.body;

    const sql = `
        INSERT INTO income
        (amount, date, source, description)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            amount,
            date,
            source,
            description
        ],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Income added successfully",
                id: this.lastID
            });

        }
    );

});


// DELETE ONE INCOME
app.delete("/income/:id", (req, res) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM income WHERE id = ?",
        [id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Income deleted successfully"
            });

        }
    );

});


// DELETE ALL INCOME
app.delete("/income", (req, res) => {

    db.run(
        "DELETE FROM income",
        [],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "All income deleted successfully"
            });

        }
    );

});


// =====================================================
// BUDGET API
// =====================================================

// GET BUDGET
app.get("/budget", (req, res) => {

    db.get(
        "SELECT * FROM budget ORDER BY id DESC LIMIT 1",
        [],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(row || {
                amount: 0
            });

        }
    );

});


// SAVE / UPDATE BUDGET
app.post("/budget", (req, res) => {

    const { amount } = req.body;

    db.run(
        "DELETE FROM budget",
        [],
        (err) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            db.run(
                "INSERT INTO budget (amount) VALUES (?)",
                [amount],
                function(err) {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.json({
                        message: "Budget saved successfully",
                        id: this.lastID
                    });

                }
            );

        }
    );

});


// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
    res.send("Expense Tracker Backend is Running!");
});


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
