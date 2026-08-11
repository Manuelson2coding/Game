import fs from 'fs';
let code = fs.readFileSync('src/components/HelixGame.tsx', 'utf-8');

code = code.replace("const BALL_RADIUS = 0.38;", "const BALL_RADIUS = 0.25;");
code = code.replace(
  "} else if (isHazard && (!isStackBallMode || isSmashingRef.current)) {",
  "} else if (isHazard) {"
);

fs.writeFileSync('src/components/HelixGame.tsx', code);
console.log('patched gameplay 2');
