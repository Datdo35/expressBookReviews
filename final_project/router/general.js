const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ==================== TASK 6 ====================

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered"
  });
});


// ==================== TASK 1 ====================

// Get all books
public_users.get('/', function (req, res) {
  res.json(books);
});


// ==================== TASK 2 ====================

// Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


// ==================== TASK 3 ====================

// Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const result = [];

  const keys = Object.keys(books);

  for (let i = 0; i < keys.length; i++) {
    const isbn = keys[i];

    if (books[isbn].author === author) {
      result.push(books[isbn]);
    }
  }

  return res.json(result);
});


// ==================== TASK 4 ====================

// Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const result = [];

  const keys = Object.keys(books);

  for (let i = 0; i < keys.length; i++) {
    const isbn = keys[i];

    if (books[isbn].title === title) {
      result.push(books[isbn]);
    }
  }

  return res.json(result);
});


// ==================== TASK 5 ====================

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


// Task 10
async function getAllBooks() {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  }
  
  // Task 11
  function getBookByISBN(isbn) {
    return axios
      .get(`http://localhost:5000/isbn/${isbn}`)
      .then(response => response.data);
  }
  
  // Task 12
  function getBooksByAuthor(author) {
    return axios
      .get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
      .then(response => response.data);
  }
  
  // Task 13
  async function getBooksByTitle(title) {
    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`
    );
    return response.data;
  }
  
  module.exports.general = public_users;
  module.exports.getAllBooks = getAllBooks;
  module.exports.getBookByISBN = getBookByISBN;
  module.exports.getBooksByAuthor = getBooksByAuthor;
  module.exports.getBooksByTitle = getBooksByTitle;