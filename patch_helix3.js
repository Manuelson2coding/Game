import fs from 'fs';
let code = fs.readFileSync('src/components/HelixGame.tsx', 'utf-8');

code = code.replace(
  "      if (isStackBallMode && gameState === 'PLAYING') {\n        const speed = 0.03 + Math.min(level * 0.003, 0.05);\n        const direction = Math.sin(currentTime * 0.0005) > 0 ? 1 : -1;\n        poleGroup.rotation.y += speed * direction;\n      } else {\n        poleGroup.rotation.y += rotationVelRef.current;\n      }",
  "      poleGroup.rotation.y += rotationVelRef.current;"
);

fs.writeFileSync('src/components/HelixGame.tsx', code);
console.log('patched helix 3');
