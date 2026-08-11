import fs from 'fs';
let code = fs.readFileSync('src/components/HelixGame.tsx', 'utf-8');

const regex = /for\s*\(\s*let\s+p\s*=\s*0;\s*p\s*<\s*platformCount;\s*p\+\+\s*\)\s*\{/;
const replaceStr = `let prevGaps: number[] = [];
    for (let p = 0; p < platformCount; p++) {`;
code = code.replace(regex, replaceStr);

const hazardRegex = /while\s*\(\s*placedHazards\s*<\s*hazardCount\s*&&\s*attempts\s*<\s*20\s*\)\s*\{\s*attempts\+\+;\s*const\s+hIdx\s*=\s*Math\.floor\(Math\.random\(\)\s*\*\s*SEGMENTS_PER_DISC\);\s*if\s*\(\s*segmentsState\[hIdx\]\s*===\s*'normal'\s*\)\s*\{\s*segmentsState\[hIdx\]\s*=\s*'hazard';\s*placedHazards\+\+;\s*\}\s*\}/;

const newHazardCode = `while (placedHazards < hazardCount && attempts < 50) {
          attempts++;
          const hIdx = Math.floor(Math.random() * SEGMENTS_PER_DISC);
          
          // non spawnare su un triangolo rosso al primo livello di drop
          const isSpawnDrop = (p === 1 && hIdx === 3); 

          if (segmentsState[hIdx] === 'normal' && !prevGaps.includes(hIdx) && !isSpawnDrop) {
            segmentsState[hIdx] = 'hazard';
            placedHazards++;
          }
        }
        
        // Update prevGaps for next iteration
        prevGaps = [];
        for (let s = 0; s < SEGMENTS_PER_DISC; s++) {
          if (segmentsState[s] === 'gap') prevGaps.push(s);
        }`;

code = code.replace(hazardRegex, newHazardCode);

const startPlatformRegex = /if\s*\(\s*isStartPlatform\s*\)\s*\{\s*\/\/\s*Start\s*platform:\s*11\s*normal\s*segments,\s*1\s*gap\s*for\s*\(\s*let\s+s\s*=\s*0;\s*s\s*<\s*SEGMENTS_PER_DISC;\s*s\+\+\s*\)\s*\{\s*segmentsState\.push\(s\s*===\s*0\s*\?\s*'gap'\s*:\s*'normal'\);\s*\}\s*\}/;
const newStartPlatform = `if (isStartPlatform) {
        // Start platform: 11 normal segments, 1 gap
        prevGaps = [];
        for (let s = 0; s < SEGMENTS_PER_DISC; s++) {
          const type = s === 0 ? 'gap' : 'normal';
          segmentsState.push(type);
          if (type === 'gap') prevGaps.push(s);
        }
      }`;
code = code.replace(startPlatformRegex, newStartPlatform);

fs.writeFileSync('src/components/HelixGame.tsx', code);
console.log('patched successfully');
