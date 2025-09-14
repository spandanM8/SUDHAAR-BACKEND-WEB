const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const PORT = 3000;

//  Enable CORS for localhost + future frontend deployment
app.use(cors({
  origin: [
    "http://localhost:3000",              // local Next.js dev
    "https://sudhaar-frontend.onrender.com" // replace with actual deployed frontend URL later
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

//Neon connection string
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_nFcsd9QIlvJ8@ep-odd-darkness-a180vdpd-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
});

//Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

//Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "🚀 Server is running" });
});

// GET /issues → return all rows as JSON
app.get("/issues", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM issues");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching issues:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
