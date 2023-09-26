const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');
const mysql = require('mysql'); 

const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: 'MyNewPass1!', 
  database: 'login_db', 
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // Serve the HTML form
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.method === 'POST' && req.url === '/login') {
    // Handle form submission
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const formData = parse(body);
      const username = formData.username;
      const password = formData.password;

      // Validate the username and password against the MySQL database
      const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
      db.query(query, [username, password], (err, results) => {
        if (err) {
          console.error('Error querying MySQL:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else if (results.length === 1) {
          // Valid credentials
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Congratulations! Login successful.');
        } else {
          // Invalid credentials
          res.writeHead(401, { 'Content-Type': 'text/plain' });
          res.end('Invalid username or password.');
        }
      });
    });
  } else {
    // Handle other requests (e.g., 404)
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 3000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
