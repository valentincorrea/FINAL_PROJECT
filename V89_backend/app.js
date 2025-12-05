const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { error } = require("console");
const cleanEnergyData = require("./public/cleanEnergyData"); // Import the data
const { INVESTMENT_DATA } = require("./public/summaryData"); // Import the data
const data = require("./public/cleanEnergyData");
const forecastData = require("./public/forecast_data");
const mysql = require("mysql2");

// Database connection
// const connection = mysql.createConnection({
//   //   host: "localhost",
//   host: "209.38.131.209",
//   user: "appuser",
//   password: "Xcvb-$123-Asdf",
//   database: "article",
// });

// --- Database Connection Pool Setup ---
const pool = mysql
  .createPool({
    // 💡 THIS IS WHERE 'pool' IS DEFINED
    host: "209.38.131.209",
    user: "appuser",
    password: "Xcvb-$123-Asdf",
    database: "article",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise();
// CORRECTED CORS AND PREFLIGHT HANDLER
app.use((req, res, next) => {
  // Allow the client's origin (http://localhost:3000 in this case)
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // CRITICAL: Explicitly allow the Authorization and Content-Type headers
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Allow the methods needed, including OPTIONS for preflight
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  // Handle preflight OPTIONS requests immediately (before jwtMw runs)
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const secretKey = "My super secret key";

const jwtMw = expressJwt.expressjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});

let users = [
  {
    id: 1,
    username: "valentin",
    password: "valentin",
  },
];

app.post("/api/login", (req, res) => {
  // destructuring the data
  const { username, password } = req.body;
  let foundUser = null; // Variable to store the matching user
  // User validation logic
  let user;
  for (user of users) {
    if (username == user.username && password == user.password) {
      foundUser = user;
      break;
    }
  }
  if (foundUser) {
    let token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
      expiresIn: "15m",
    });

    res.json({
      success: true,
      err: null,
      token: token, // We can remove the token:
    });
  } else {
    res.status(401).json({
      success: false,
      token: null,
      err: "username or password is incorrect",
    });
  }
});

// Protected routes
app.get("/api/dashboard", jwtMw, (req, res) => {
  console.log(req);
  res.json({
    success: true,
    dashboardContent: `<h1>Welcome to the Dashboard</h1>`,
  });
});

// Endpoint serving data to the Summary page
app.get("/api/summary", jwtMw, (req, res) => {
  // json response
  return res.json({
    status: "Success",
    total: cleanEnergyData.length,
    data: cleanEnergyData,
  });
});

// --- NEW ENDPOINT: GET /api/forecast ---
app.get("/api/reports", jwtMw, (req, res) => {
  console.log("HIT: /api/forecast (JSON)");

  // Serve the data in a clean, consistent wrapper object
  return res.json({
    status: "success",
    total: forecastData.length,
    data: forecastData,
  });
});

// Protected endpoint to serve the investment data
app.get("/api/summary-data", jwtMw, (req, res) => {
  return res.json({
    status: "success",
    total: INVESTMENT_DATA.length,
    data: INVESTMENT_DATA,
  });
});

app.get("/api/articles", jwtMw, async (req, res) => {
  // 💡 1. Retrieve article ID and optional search term
  const articleId = req.query.id;
  const searchTerm = req.query.search;

  let query = "SELECT id, title, body, article_url FROM articles";
  let queryParams = [];

  // 💡 2. Prioritize filtering by ID
  if (articleId) {
    query += " WHERE id = ?";
    queryParams.push(articleId);
  }
  // Otherwise, check for a search term
  else if (searchTerm) {
    query += " WHERE title LIKE ? OR body LIKE ?";
    const wildCardTerm = `%${searchTerm}%`;
    queryParams.push(wildCardTerm, wildCardTerm);
  }

  query += " ORDER BY id DESC"; // Order by ID to ensure ID 1 is easily found

  try {
    const [results] = await pool.query(query, queryParams);

    // When fetching by ID, we return the single object directly (if found)
    const dataToReturn = articleId
      ? results.length > 0
        ? results[0]
        : null
      : results;

    console.log(`✅ Retrieved ${results.length} article(s) from the database.`);

    return res.json({
      status: "success",
      total: results.length,
      data: dataToReturn,
    });
  } catch (queryErr) {
    console.error("❌ Database error fetching articles:", queryErr.stack);
    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve articles from the database.",
      error: queryErr.message,
    });
  }
});

app.use(function (err, req, res, next) {
  console.log(err);
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      officialErr: err,
      err: "username or password is incorrect",
    });
  } else {
    next(err);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serving on port: ${PORT}`); // using `` to wrap the variable
});
