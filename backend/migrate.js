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
      
      // Replace const { x, y } = require('z') with import { x, y } from 'z'
      content = content.replace(/(?:const|let|var)\s+(\{[^}]+\})\s*=\s*require\((['"`][^'"`]+['"`])\);?/g, 'import $1 from $2;');
      
      // Replace const x = require('z') with import x from 'z'
      content = content.replace(/(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*require\((['"`][^'"`]+['"`])\);?/g, 'import $1 from $2;');
      
      // Replace module.exports = x with export default x
      content = content.replace(/module\.exports\s*=\s*([a-zA-Z0-9_{}]+);?/g, 'export default $1;');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(__dirname);
console.log('Migration basic replacements done.');
