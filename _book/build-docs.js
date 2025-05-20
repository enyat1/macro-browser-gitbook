const fs = require('fs-extra');
const path = require('path');

// Define output directory
const outputDir = path.join(__dirname, 'docs');

// Copy CSS styles
fs.copySync('styles', path.join(outputDir, 'styles'));

// Make sure Netlify-specific styles are included
if (!fs.existsSync(path.join(outputDir, 'styles', 'netlify-search-fix.css'))) {
  fs.copySync(
    path.join(__dirname, 'styles', 'netlify-search-fix.css'),
    path.join(outputDir, 'styles', 'netlify-search-fix.css')
  );
}

// Create index.html in the docs directory
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Macro Browser Documentation</title>
  <meta http-equiv="refresh" content="0; url=README.html">
  <link rel="canonical" href="README.html">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #141521;
      color: #f8f8f2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    a {
      color: #4b31dd;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <h1>Macro Browser Documentation</h1>
  <p>Redirecting to documentation...</p>
  <p>If you are not redirected automatically, <a href="README.html">click here</a>.</p>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
console.log('Created: ' + path.join(outputDir, 'index.html'));

console.log('Documentation successfully built for Netlify deployment!'); 