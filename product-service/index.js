const express = require("express");
const { Pool } = require("pg");
const client = require("prom-client");

const app = express();
app.use(express.json());

const pool = new Pool({
  host: "postgres",
  user: "postgres",
  password: "postgres",
  database: "microservices",
  port: 5432
});

// Prometheus metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
});

app.get("/products/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM products WHERE id=$1", [req.params.id]);
  res.json(result.rows[0] || null);
});

app.post("/products", async (req, res) => {
  const { name, price } = req.body;
  const result = await pool.query(
    "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *",
    [name, price]
  );
  res.json(result.rows[0]);
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(8082, () => console.log("Product service running on 8082"));
