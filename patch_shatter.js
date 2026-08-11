import fs from 'fs';
let code = fs.readFileSync('src/components/HelixGame.tsx', 'utf-8');

// Increase debris pieceCount and velocity for shatter
code = code.replace('const pieceCount = 14;', 'const pieceCount = 24;');
code = code.replace('vy: 2 + Math.random() * 5,', 'vy: 3 + Math.random() * 6,');
code = code.replace('vx: Math.cos(angle) * (3 + Math.random() * 4),', 'vx: Math.cos(angle) * (5 + Math.random() * 6),');
code = code.replace('vz: Math.sin(angle) * (3 + Math.random() * 4),', 'vz: Math.sin(angle) * (5 + Math.random() * 6),');

fs.writeFileSync('src/components/HelixGame.tsx', code);
console.log('patched shatter');
