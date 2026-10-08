const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getFiles(fullPath));
    } else if (fullPath.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

const backendDir = __dirname + '/src';
const files = getFiles(backendDir);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix jwt.ts
  if (file.endsWith('jwt.ts')) {
    content = `import { Response } from 'express';\n` + content;
    content = content.replace(/generateToken\s*=\s*\((userId)\)/g, 'generateToken = (userId: string)');
    content = content.replace(/verifyToken\s*=\s*\((token)\)/g, 'verifyToken = (token: string)');
    content = content.replace(/setTokenCookie\s*=\s*\((res, userId)\)/g, 'setTokenCookie = (res: Response, userId: string)');
    content = content.replace(/clearTokenCookie\s*=\s*\((res)\)/g, 'clearTokenCookie = (res: Response)');
    content = content.replace(/process\.env\.JWT_SECRET/g, '(process.env.JWT_SECRET as string)');
  }

  // Fix resetToken.ts
  if (file.endsWith('resetToken.ts')) {
    content = content.replace(/hashToken\s*=\s*\((rawToken)\)/g, 'hashToken = (rawToken: string)');
  }

  // Fix controllers and middleware
  if (file.includes('controller') || file.includes('middleware')) {
    if (!content.includes(`import { Request, Response`)) {
      content = `import { Request, Response, NextFunction } from 'express';\n` + content;
    }
    content = content.replace(/\(req, res, next\)/g, '(req: Request, res: Response, next: NextFunction)');
    content = content.replace(/\(req, res\)/g, '(req: Request, res: Response)');
    content = content.replace(/\(err, req, res, next\)/g, '(err: any, req: Request, res: Response, next: NextFunction)');
  }
  
  // Fix models
  if (file.includes('models')) {
    if (!content.includes(`import { Document } from 'mongoose'`)) {
      content = `import mongoose, { Document } from 'mongoose';\n` + content;
    }
  }

  // General fixes
  content = content.replace(/catch\s*\(\s*error\s*\)/g, 'catch (error: any)');

  fs.writeFileSync(file, content);
}
console.log('Fixed types using script.');
