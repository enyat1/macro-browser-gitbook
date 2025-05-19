// Copy CSS styles
fs.copySync('styles', path.join(outputDir, 'styles'));

// Make sure Netlify-specific styles are included
if (!fs.existsSync(path.join(outputDir, 'styles', 'netlify-search-fix.css'))) {
  fs.copySync(
    path.join(__dirname, 'styles', 'netlify-search-fix.css'),
    path.join(outputDir, 'styles', 'netlify-search-fix.css')
  );
} 