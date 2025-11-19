const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { error } = require("console");
const cleanEnergyData = require("./public/cleanEnergyData"); // Import the data
const data = require("./public/cleanEnergyData");

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Origin", "Content-type,Authorization");
//   next();
// });
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
    username: "val",
    password: "val",
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
      expiresIn: "3m",
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

app.get("/api/settings", jwtMw, (req, res) => {
  res.json({
    success: true,
    settingsContent: `<h1>Welcome to the Settings Page</h1>`,
  });
});

app.get("/api", (req, res) => {
  // 💡 This is the JSON data the Home.jsx component is expecting
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

// Endpoint serving data to the Summary page
app.get("/api/summary", (req, res) => {
  // json response
  return res.json({
    status: "Success",
    total: cleanEnergyData.length,
    data: cleanEnergyData,
  });
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

// Adding a route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serving on port: ${PORT}`); // using `` to wrap the variable
});
