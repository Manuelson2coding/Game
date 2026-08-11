import fs from 'fs';
let code = fs.readFileSync('src/types.ts', 'utf-8');

code = code.replace(
  "  feversTriggered: number;",
  "  feversTriggered: number;\n  lastDailyRewardTime?: number;\n  dailyStreak?: number;"
);

fs.writeFileSync('src/types.ts', code);
console.log('patched types');
