import fs from 'fs';
let code = fs.readFileSync('src/components/HelixGame.tsx', 'utf-8');

// 1. Add impact particles on bounce and smash
code = code.replace(
  "spawnShockwave(scene, discTopY, equippedSkin.color);",
  "spawnShockwave(scene, discTopY, equippedSkin.color);\n                spawnImpactParticles(scene, 0, discTopY, 1.525, theme.platformColor, 12);"
);

code = code.replace(
  "spawnShatterDebris(scene, platform.y, theme.platformColor);",
  "spawnShatterDebris(scene, platform.y, theme.platformColor);\n                spawnImpactParticles(scene, 0, platform.y, 1.525, theme.platformColor, 20);"
);

// 2. Increase difficulty (more hazards, smaller gaps, faster stack ball rotation)
code = code.replace(
  "const gapSize = isStackBallMode ? 0 : Math.min(1 + Math.floor(Math.random() * 2), 3);",
  "const gapSize = isStackBallMode ? 0 : Math.min(1 + Math.floor(Math.random() * (level > 4 ? 1 : 2)), 2);"
);

code = code.replace(
  "const hazardCount = Math.min(1 + Math.floor(Math.random() * (level > 3 ? 4 : 2)), isStackBallMode ? 8 : 5);",
  "const hazardCount = Math.min(2 + Math.floor(Math.random() * (level > 2 ? 5 : 3)), isStackBallMode ? 10 : 7);"
);

code = code.replace(
  "const speed = 0.02 + Math.min(level * 0.002, 0.03);",
  "const speed = 0.03 + Math.min(level * 0.003, 0.05);"
);

code = code.replace(
  "const platformCount = 10 + Math.min(level * 2, 35);",
  "const platformCount = 12 + Math.min(level * 3, 45);"
);

fs.writeFileSync('src/components/HelixGame.tsx', code);
console.log('patched gameplay');
