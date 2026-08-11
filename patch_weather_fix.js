import fs from 'fs';
let code = fs.readFileSync('src/components/HelixGame.tsx', 'utf-8');

code = code.replace(
  "positions[i * 3] = ballYRef.current + (Math.random() - 0.5) * 30;",
  "positions[i * 3] = (Math.random() - 0.5) * 30;"
);

code = code.replace(
  "positions[i * 3 + 2] = ballYRef.current + (Math.random() - 0.5) * 30;",
  "positions[i * 3 + 2] = (Math.random() - 0.5) * 30;"
);

fs.writeFileSync('src/components/HelixGame.tsx', code);
console.log('patched weather fix');
