const fs = require('fs');
const path = require('path');

// Angular 17+ standalone build structure:
// outputPath: "dist"
// actual browser build ends up in: dist/frontend/browser
const browserDir = path.join(__dirname, 'dist', 'frontend', 'browser');
const targetDir = path.join(__dirname, 'dist');

if (fs.existsSync(browserDir)) {
  console.log(`Moving files from ${browserDir} to ${targetDir}...`);
  const files = fs.readdirSync(browserDir);

  files.forEach((file) => {
    const src = path.join(browserDir, file);
    const dest = path.join(targetDir, file);

    // If destination exists, remove it first so we can overwrite cleanly.
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
    }

    fs.renameSync(src, dest);
  });

  fs.rmdirSync(browserDir);
  console.log('Build output flattened successfully.');
} else {
  console.log(`Directory ${browserDir} not found. Skipping move.`);
}


