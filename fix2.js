import fs from 'fs';
let code = fs.readFileSync('src/components/HelixGame.tsx', 'utf-8');

code = code.replace(
  "        const prevY = ballYRef.current; else {\n          ballVyRef.current -= 24 * dt; // Gravity\n        }",
  "        const prevY = ballYRef.current;\n        ballVyRef.current -= 24 * dt; // Gravity"
);

fs.writeFileSync('src/components/HelixGame.tsx', code);
