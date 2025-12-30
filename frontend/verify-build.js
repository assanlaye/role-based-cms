const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist', 'browser');
console.log('Verifying build output...');
console.log('Expected location:', distDir);

if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir);
  console.log('✓ dist/browser directory exists');
  console.log('Files found:', files.slice(0, 10).join(', '), files.length > 10 ? '...' : '');
  
  const indexHtml = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtml)) {
    console.log('✓ index.html found in dist/browser');
    const stats = fs.statSync(indexHtml);
    console.log('  Size:', stats.size, 'bytes');
  } else {
    console.log('✗ index.html NOT found in dist/browser');
    process.exit(1);
  }
} else {
  console.log('✗ dist/browser directory does not exist!');
  console.log('Checking dist directory...');
  const distRoot = path.join(__dirname, 'dist');
  if (fs.existsSync(distRoot)) {
    console.log('Contents of dist:', fs.readdirSync(distRoot));
  }
  process.exit(1);
}

console.log('Build verification complete ✓');

