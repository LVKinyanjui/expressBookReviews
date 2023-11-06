const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Set up session middleware
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true,
}));

// Custom authentication middleware for /customer/auth/*
app.use("/customer/auth/*", function auth(req, res, next) {
  // Check if the user is authenticated based on the session
  if (req.session && req.session.authenticated) {
    next(); // User is authenticated, proceed to the next route
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

