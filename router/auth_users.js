const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];
let userReviews = {}; // Store user reviews

const isValid = (username) => {
  // Check if the username is valid (you can define your validation logic here)
  return username && typeof username === 'string';
};

const authenticatedUser = (username, password) => {
  // Check if username and password match records (you can define your authentication logic here)
  return users.some((user) => user.username === username && user.password === password);
};

// Register a new user
regd_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists.' });
  }

  // Add the new user to the users array (You should implement a proper user storage mechanism)
  users.push({ username, password });

  return res.status(201).json({ message: 'User registered successfully.' });
});

// Login as a registered user and create a session using JWT
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  if (authenticatedUser(username, password)) {
    // Create a JWT for the user session
    const token = jwt.sign({ username }, 'your-secret-key'); // Replace 'your-secret-key' with a secret key

    // Send the JWT token as a response for session authentication
    res.status(200).json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Add or modify a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username; // Get the username from the JWT token

  if (!review) {
    return res.status(400).json({ message: 'Review content is required.' });
  }

  if (!userReviews[isbn]) {
    userReviews[isbn] = {};
  }

  userReviews[isbn][username] = review;

  return res.status(201).json({ message: 'Review added or modified successfully.' });
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username; // Get the username from the JWT token

  if (userReviews[isbn] && userReviews[isbn][username]) {
    delete userReviews[isbn][username];
    res.status(200).json({ message: 'Review deleted successfully.' });
  } else {
    res.status(404).json({ message: 'Review not found or unauthorized to delete.' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
