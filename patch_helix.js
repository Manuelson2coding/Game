import fs from 'fs';
let code = fs.readFileSync('src/components/HelixGame.tsx', 'utf-8');

// Remove isStackBallMode definition
code = code.replace("  const isStackBallMode = level % 2 === 0;\n", "");

// Fix targetAngle back to what it was initially
code = code.replace(
  "let targetAngle = (Math.PI / 2 - poleGroup.rotation.y) % (Math.PI * 2);",
  "let targetAngle = (Math.PI / 2 + poleGroup.rotation.y) % (Math.PI * 2);"
);

// Fix platform generation
code = code.replace(
  "segmentsState.push(isStackBallMode ? 'normal' : (s === 0 ? 'gap' : 'normal'));",
  "segmentsState.push(s === 0 ? 'gap' : 'normal');"
);
code = code.replace(
  "const gapSize = isStackBallMode ? 0 : Math.min(1 + Math.floor(Math.random() * (level > 4 ? 1 : 2)), 2); // 1 to 3 gaps",
  "const gapSize = Math.min(1 + Math.floor(Math.random() * (level > 4 ? 1 : 2)), 2);"
);
code = code.replace(
  "const hazardCount = Math.min(2 + Math.floor(Math.random() * (level > 2 ? 5 : 3)), isStackBallMode ? 10 : 7);",
  "const hazardCount = Math.min(2 + Math.floor(Math.random() * (level > 2 ? 5 : 3)), 7);"
);

// Fix input handlers
code = code.replace("if (!isStackBallMode) {\n", "{\n");
code = code.replace("if (!isStackBallMode) rotationVelRef.current -= 0.06 * sensitivity;", "rotationVelRef.current -= 0.06 * sensitivity;");
code = code.replace("if (!isStackBallMode) rotationVelRef.current += 0.06 * sensitivity;", "rotationVelRef.current += 0.06 * sensitivity;");

// Fix dependency array
code = code.replace(", isStackBallMode]);", "]);");

// Fix auto rotation
code = code.replace(
  "      if (isStackBallMode && gameState === 'PLAYING') {\n        const speed = 0.03 + Math.min(level * 0.003, 0.05);\n        poleGroup.rotation.y += speed * 60 * dt;\n      }",
  ""
);

// Fix fast drop
code = code.replace("        if (isStackBallMode && isSmashingRef.current) {\n          ballVyRef.current = -20; // Fast downward speed\n        }", "");

// Fix shouldSmash
code = code.replace(
  "const shouldSmash = isFever || (isHazard && hasShield) || (isStackBallMode && isSmashingRef.current && !isHazard);",
  "const shouldSmash = isFever || (isHazard && hasShield);"
);

// Fix smash logic pass combo
code = code.replace(
  "                if (isStackBallMode && isSmashingRef.current) {\n                  passComboRef.current += 1;\n                }",
  ""
);

fs.writeFileSync('src/components/HelixGame.tsx', code);
console.log('patched helix');
