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
      res.status(500).send('Registration failed');
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
        res.send('Login successful');
      } else {
        res.status(401).json({ message: 'Login failed' });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
