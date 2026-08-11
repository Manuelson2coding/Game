import fs from 'fs';
let code = fs.readFileSync('src/components/HelixGame.tsx', 'utf-8');

code = code.replace(
  "                if (isStackBallMode && isSmashingRef.current) {\n                  ballYRef.current = discTopY - 0.1; // push below the platform slightly\n                }",
  ""
);

code = code.replace(
  "// GAME OVER! (In stack ball mode, dying happens only if you smash a hazard)",
  "// GAME OVER!"
);

// We need to make sure the ball keeps falling when it smashes something
// Wait, if it smashes it just keeps falling, the ball's Vy continues to decrease by gravity.

fs.writeFileSync('src/components/HelixGame.tsx', code);
console.log('patched helix 2');
