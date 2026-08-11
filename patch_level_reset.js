import fs from 'fs';
let code = fs.readFileSync('src/utils/storage.ts', 'utf-8');

code = code.replace(
  "return JSON.parse(saved);",
  "const parsed = JSON.parse(saved);\n      parsed.currentLevel = 1;\n      return parsed;"
);

fs.writeFileSync('src/utils/storage.ts', code);
console.log('patched level reset');
