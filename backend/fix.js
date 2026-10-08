const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix export default {; name }; 
      // Actually let's just find and replace "export default {;" with "export {"
      content = content.replace(/export default \{;\s*/g, 'export { ');
      
      // If there was something like `module.exports = { a, b }`
      // my old regex matched `module.exports = {` because of missing space matching, so it became `export default {; a, b };`
      content = content.replace(/export default ([a-zA-Z0-9_]+);/g, 'export default $1;'); // this one might be fine

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(__dirname);
console.log('Fixed bad exports.');
