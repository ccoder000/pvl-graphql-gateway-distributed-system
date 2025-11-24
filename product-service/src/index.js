const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "postgres",       // <--- matches docker-compose service name
  database: "microservices",
  password: "postgres",
  port: 5432
});

// -------------------- CRUD Routes --------------------

// Get all products
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Create a new product
app.post("/products", async (req, res) => {
  try {
    const { name, price } = req.body;
    const result = await pool.query(
      "INSERT INTO products(name, price) VALUES ($1, $2) RETURNING *",
      [name, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update a product
app.put("/products/:id", async (req, res) => {
  try {
    const { name, price } = req.body;
    const result = await pool.query(
      "UPDATE products SET name=$1, price=$2 WHERE id=$3 RETURNING *",
      [name, price, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// -------------------- Start server --------------------
app.listen(8082, () => {
  console.log("Product Service running on port 8082");
});