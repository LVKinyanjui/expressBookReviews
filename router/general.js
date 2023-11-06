const express = require('express');
const axios = require('axios'); // Import the Axios library
const books = require('./booksdb.js');
const public_users = express.Router();

// Function to get book details based on title using Promise and Axios
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://your-api-endpoint/books/title/${title}`) // Replace with your actual API endpoint
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Get book details based on title using async-await
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const booksByTitle = await getBooksByTitle(title);
    res.status(200).json(booksByTitle);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ... Other routes ...

module.exports.general = public_users;
const axios = require('axios'); // Import the Axios library
const books = require('./booksdb.js');
const public_users = express.Router();

// Function to get book details based on author using Promise and Axios
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://your-api-endpoint/books/author/${author}`) // Replace with your actual API endpoint
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Get book details based on author using async-await
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const booksByAuthor = await getBooksByAuthor(author);
    res.status(200).json(booksByAuthor);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ... Other routes ...

module.exports.general = public_users;


// Function to get book details based on ISBN using Promise and Axios
const getBookDetailsByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://your-api-endpoint/book/${isbn}`) // Replace with your actual API endpoint
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const bookDetails = await getBookDetailsByISBN(isbn);
    res.status(200).json(bookDetails);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ... Other routes ...

module.exports.general = public_users;


// Function to get the list of books using Promise and Axios
const getBooksFromShop = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://your-api-endpoint/books') // Replace with your actual API endpoint
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Get the list of books available in the shop using async-await
public_users.get('/books', async (req, res) => {
  try {
    const booksFromShop = await getBooksFromShop();
    res.status(200).json(booksFromShop);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ... Other routes ...

module.exports.general = public_users;


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Retrieve the list of books with ISBN codes from your books database
  const booksWithISBN = Object.entries(books)
    .filter(([isbn, book]) => !isNaN(parseInt(isbn, 10)))
    .map(([isbn, book]) => ({
      isbn: isbn,
      author: book.author,
      title: book.title,
    }));

  // Respond with the list of books in a neat JSON format
  res.json(booksWithISBN);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn] && !isNaN(parseInt(isbn, 10))) {
    res.json(books[isbn]);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.entries(books)
    .filter(([isbn, book]) =>
      !isNaN(parseInt(isbn, 10) && book.author === author)
    )
    .map(([isbn, book]) => ({
      isbn: isbn,
      author: book.author,
      title: book.title,
    }));

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: 'No books by this author found' });
  }
});

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.entries(books)
    .filter(([isbn, book]) =>
      !isNaN(parseInt(isbn, 10) && book.title.toLowerCase().includes(title.toLowerCase()))
    )
    .map(([isbn, book]) => ({
      isbn: isbn,
      author: book.author,
      title: book.title,
    }));

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: 'No books with this title found' });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    res.json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: 'Reviews not found for this book' });
  }
});

module.exports.general = public_users;
