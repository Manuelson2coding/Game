import fs from 'fs';
let code = fs.readFileSync('src/components/HUD.tsx', 'utf-8');

code = code.replace("  isStackBallMode: boolean;\n", "");
code = code.replace("  isStackBallMode,\n", "");
code = code.replace(/<span className=\{`text-\[10px\].*?<\/span>/s, "");

fs.writeFileSync('src/components/HUD.tsx', code);
console.log('patched HUD');
