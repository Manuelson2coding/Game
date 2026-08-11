import fs from 'fs';
let code = fs.readFileSync('src/utils/storage.ts', 'utf-8');

code = code.replace(
  "description: 'Aurore boreali nell\\'oscurità artica.',",
  "description: 'Aurore boreali nell\\'oscurità artica.',\n    weather: 'snow',"
);

fs.writeFileSync('src/utils/storage.ts', code);
console.log('patched themes 2');
