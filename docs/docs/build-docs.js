const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'docs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// HTML template
function generateHtml(title, content) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Macro Browser Documentation</title>
  <link rel="stylesheet" href="styles/styles.css">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
      color: #f8f8f2;
      background-color: #1a1b26;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 250px;
      padding: 1rem;
      background-color: #141521;
      overflow-y: auto;
    }
    .main-content {
      margin-left: 270px;
      padding: 2rem;
    }
    a {
      color: #8673f4;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    h1, h2, h3, h4 {
      color: #f8f8f2;
      font-weight: 600;
    }
    h1 {
      border-bottom: 1px solid #2a2c3d;
      padding-bottom: 0.5rem;
    }
    img {
      max-width: 100%;
      display: block;
      margin: 2rem auto;
    }
    code {
      background-color: #2a2c3d;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    }
    pre {
      background-color: #2a2c3d;
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
    }
    pre code {
      padding: 0;
      background-color: transparent;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
    table th, table td {
      border: 1px solid #2a2c3d;
      padding: 0.5rem;
    }
    table th {
      background-color: #2a2c3d;
    }
    .search-input {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 1rem;
      background-color: #141521;
      border: 1px solid #2a2c3d;
      border-radius: 4px;
      color: #f8f8f2;
    }
    .search-input::placeholder {
      color: #b8b9c5;
    }
  </style>
</head>
<body>
  <div class="sidebar">
    <h2>Macro Browser</h2>
    <input type="text" class="search-input" placeholder="Type to search">
    <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="features/index.html">Features</a></li>
      <li><a href="getting-started/index.html">Getting Started</a></li>
      <li><a href="technical/index.html">Technical</a></li>
      <li><a href="developers/index.html">Developers</a></li>
    </ul>
  </div>
  <div class="main-content">
    ${content}
  </div>
  <script>
    // Fix image paths
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src && src.startsWith('/')) {
        const newSrc = src.substring(1);
        img.setAttribute('src', newSrc);
      }
    });
  </script>
</body>
</html>
  `;
}

// Process a markdown file
function processMarkdownFile(filePath, outputPath) {
  try {
    const markdownContent = fs.readFileSync(filePath, 'utf8');
    const title = path.basename(filePath, '.md').replace(/-/g, ' ');
    
    // Convert markdown to HTML
    const htmlContent = md.render(markdownContent);
    
    // Generate complete HTML
    const fullHtml = generateHtml(title, htmlContent);
    
    // Ensure the directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the HTML file
    fs.writeFileSync(outputPath, fullHtml);
    console.log(`Generated: ${outputPath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
}

// Process all markdown files in a directory recursively
function processDirectory(sourceDir, outputDir) {
  const items = fs.readdirSync(sourceDir);
  
  items.forEach(item => {
    const sourcePath = path.join(sourceDir, item);
    const outputPath = path.join(outputDir, item);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      if (!['node_modules', '.git', '_book'].includes(item)) {
        processDirectory(sourcePath, outputPath);
      }
    } else if (item.endsWith('.md')) {
      const htmlOutputPath = outputPath.replace(/\.md$/, '.html');
      processMarkdownFile(sourcePath, htmlOutputPath);
    } else if (['.svg', '.png', '.jpg', '.jpeg', '.gif', '.css', '.js'].some(ext => item.endsWith(ext))) {
      // Copy assets
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      fs.copyFileSync(sourcePath, outputPath);
      console.log(`Copied: ${outputPath}`);
    }
  });
}

// Install markdown-it if not installed
try {
  require.resolve('markdown-it');
} catch (e) {
  console.log('Installing markdown-it...');
  require('child_process').execSync('npm install markdown-it --save-dev');
}

// Start processing from the root directory
console.log('Generating documentation...');
processDirectory(__dirname, outputDir);
console.log('Documentation generated in the docs directory.'); 