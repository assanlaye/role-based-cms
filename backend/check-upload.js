// check-upload.js
const fs = require('fs');
const path = require('path');

console.log('=== UPLOAD MODULE DEBUG ===\n');

// Check from project root
const projectRoot = __dirname;
console.log('1. Project root:', projectRoot);

// Check if middleware folder exists
const middlewarePath = path.join(projectRoot, 'src', 'middleware');
console.log('2. Middleware folder exists?', fs.existsSync(middlewarePath));

// Check what's in middleware folder
if (fs.existsSync(middlewarePath)) {
  console.log('3. Files in middleware folder:');
  const files = fs.readdirSync(middlewarePath);
  files.forEach(file => {
    const fullPath = path.join(middlewarePath, file);
    const isDir = fs.statSync(fullPath).isDirectory();
    console.log(`   ${isDir ? '📁' : '📄'} ${file}`);
  });
}

// Check specifically for upload
const uploadAsFile = path.join(middlewarePath, 'upload.js');
const uploadAsFolder = path.join(middlewarePath, 'upload');

console.log('\n4. Checking upload.js file:', uploadAsFile);
console.log('   Exists?', fs.existsSync(uploadAsFile));

console.log('\n5. Checking upload folder:', uploadAsFolder);
console.log('   Exists?', fs.existsSync(uploadAsFolder));
if (fs.existsSync(uploadAsFolder) && fs.statSync(uploadAsFolder).isDirectory()) {
  console.log('   Contents:');
  const folderFiles = fs.readdirSync(uploadAsFolder);
  folderFiles.forEach(file => {
    console.log(`     - ${file}`);
  });
}

// Try to require
console.log('\n6. Trying to require:');
try {
  const upload = require('./src/middleware/upload');
  console.log('   ✓ require("./src/middleware/upload") SUCCESS');
} catch (err) {
  console.log('   ✗ require("./src/middleware/upload") FAILED:', err.message);
}

try {
  const upload = require('./src/middleware/upload.js');
  console.log('   ✓ require("./src/middleware/upload.js") SUCCESS');
} catch (err) {
  console.log('   ✗ require("./src/middleware/upload.js") FAILED:', err.message);
}