const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');

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

      // For demonstration purposes, you can check the username and password here
      // Replace this with your actual authentication logic

      // Respond with a message
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Received username: ${username}, password: ${password}`);
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
