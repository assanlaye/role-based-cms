// debug.js
const fs = require('fs');
const path = require('path');

console.log('=== DEBUGGING MODULE PATHS ===\n');

// 1. Check current directory
console.log('1. Current working directory:', process.cwd());
console.log('2. __dirname:', __dirname);

// 2. Check if src folder exists
const srcPath = path.join(__dirname, 'src');
console.log('3. src folder exists?', fs.existsSync(srcPath));

// 3. Check if controllers folder exists
const controllersPath = path.join(__dirname, 'src', 'controllers');
console.log('4. controllers folder exists?', fs.existsSync(controllersPath));

// 4. Check if articleController.js exists
const articleControllerPath = path.join(__dirname, 'src', 'controllers', 'articleController.js');
console.log('5. articleController.js exists?', fs.existsSync(articleControllerPath));

// 5. Try different paths
console.log('\n6. Trying different require paths:');
const pathsToTry = [
  './src/controllers/articleController',
  './src/controllers/articleController.js',
  'src/controllers/articleController',
  'src/controllers/articleController.js',
  '../controllers/articleController',  // From src/routes perspective
  '../controllers/articleController.js'
];

pathsToTry.forEach((modulePath, index) => {
  console.log(`\n   Path ${index + 1}: "${modulePath}"`);
  try {
    const resolved = require.resolve(modulePath, { paths: [__dirname] });
    console.log('   ✓ Resolved to:', resolved);
    console.log('   ✓ File exists:', fs.existsSync(resolved));
  } catch (err) {
    console.log('   ✗ Failed:', err.message);
  }
});

// 6. List files in controllers directory
console.log('\n7. Files in controllers directory:');
if (fs.existsSync(controllersPath)) {
  const files = fs.readdirSync(controllersPath);
  files.forEach(file => {
    const fullPath = path.join(controllersPath, file);
    const isDir = fs.statSync(fullPath).isDirectory();
    console.log(`   ${isDir ? '📁' : '📄'} ${file}`);
  });
}