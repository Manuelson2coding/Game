import fs from 'fs';
let code = fs.readFileSync('src/components/HelixGame.tsx', 'utf-8');

// 1. Add slowMoTimerRef
if (!code.includes('const slowMoTimerRef = useRef<number>(0);')) {
  code = code.replace(
    "const passComboRef = useRef<number>(0);",
    "const passComboRef = useRef<number>(0);\n  const slowMoTimerRef = useRef<number>(0);"
  );
}

// 2. Modify dt calculation
const dtRegex = /const dt = Math\.min\(\(currentTime - lastTime\) \/ 1000,\s*0\.05\);/;
if (code.match(dtRegex)) {
  const dtReplace = `let dt_real = Math.min((currentTime - lastTime) / 1000, 0.05);
      let dt = dt_real;
      if (slowMoTimerRef.current > 0) {
        slowMoTimerRef.current -= dt_real;
        dt *= 0.25; // 25% speed for slow-motion
      }`;
  code = code.replace(dtRegex, dtReplace);
}

// 3. Trigger slow-mo on currentPassCount >= 2
const passLogicRegex = /if\s*\(\s*currentPassCount\s*>=\s*3\s*\)\s*\{\s*if\s*\(\s*!isFever\s*\)\s*\{/g;
// We can replace the first occurrence (which is the gap one)
// Wait, replacing both is fine too. Let's just do a replace that matches the gap logic.
// Let's replace "passComboRef.current += 1;\n              const currentPassCount = passComboRef.current;"
// with adding slowMoTimerRef logic.

const comboRegex = /passComboRef\.current \+= 1;\s*const currentPassCount = passComboRef\.current;/g;
code = code.replace(comboRegex, `passComboRef.current += 1;
              const currentPassCount = passComboRef.current;
              
              if (currentPassCount === 2) {
                // Trigger slow-motion for a cinematic feel on a narrow pass!
                slowMoTimerRef.current = 0.8;
              }`);

fs.writeFileSync('src/components/HelixGame.tsx', code);
console.log('patched slow-mo');
