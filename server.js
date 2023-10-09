const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Create a MySQL connection
const db = mysql.createConnection({
  host: '35.184.0.60',
  user: 'root',
  password: '12345678',
  database: 'logreg',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});

// Middleware for parsing JSON and form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle registration POST request
app.post('/register', (req, res) => {
  const { username, email, password, name } = req.body;

  // Hash and salt the password (you should use a library like bcrypt)
  // Insert the user data into the MySQL database
  const insertQuery = `INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)`;
  db.query(insertQuery, [username, email, password, name], (err, result) => {
    if (err) {
      const errorHTML = `
        <html>
        <head>
            <title>Registration Failed</title>
        </head>
        <body>
            <h2>Registration Failed</h2>
            <p>Sorry, there was an error registering your account.</p>
            <p>${err}</p>
        </body>
        </html>
      `;
      console.log(err);
    } else {
      const successHTML = `
        <html>
        <head>
            <title>Registration Successful</title>
        </head>
        <body>
            <h2>Registration Successful</h2>
            <p>Thank you for registering!</p>
            <p>Your details:</p>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Username:</strong> ${username}</li>
                <li><strong>Email:</strong> ${email}</li>
            </ul>
        </body>
        </html>
      `;
      res.send(successHTML);
    }
  });
});

// Handle login POST request
app.post('/login', (req, res) => {
  const { login_username, login_password } = req.body;

  // Query the MySQL database to check login credentials
  const selectQuery = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.query(selectQuery, [login_username, login_password], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Login failed' });
    } else {
      if (result.length === 1) {
        const LogsuccessHTML=`
        <html>
        <head>
            <title>Login Successful</title>
        </head>
        <body>
            <h2>Login Successful</h2>
            <p>Welcome to our website!</p>
            <p>Your details:</p>
            <ul>
                <li><strong>Name:</strong> ${result[0].name}</li>
                <li><strong>Username:</strong> ${result[0].username}</li>
                <li><strong>Email:</strong> ${result[0].email}</li>
            </ul>

            </body>
            </html>
        `;
        res.send(LogsuccessHTML);
      } else {
        const LogerrorHTML = `
        <html>
        <head>
            <title>Login Failed</title>
        </head>
        <body>
            <h2>Login Failed</h2>
            <p>Sorry, your login details are incorrect.</p>
        </body>
        </html>
      `;
        res.send(LogerrorHTML);
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
