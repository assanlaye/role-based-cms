const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
console.log('Checking dist directory structure...');

if (fs.existsSync(distDir)) {
  const contents = fs.readdirSync(distDir);
  console.log('Contents of dist:', contents);
  
  // Check if there's a nested structure
  const nestedPath = path.join(distDir, 'frontend', 'browser');
  if (fs.existsSync(nestedPath)) {
    console.log('Found nested structure: dist/frontend/browser');
    console.log('Files in nested structure:', fs.readdirSync(nestedPath));
  } else {
    console.log('No nested structure found, files are directly in dist');
    if (fs.existsSync(path.join(distDir, 'index.html'))) {
      console.log('✓ index.html found in dist');
    } else {
      console.log('✗ index.html NOT found in dist');
    }
  }
} else {
  console.log('✗ dist directory does not exist!');
}

