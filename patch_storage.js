import fs from 'fs';
let code = fs.readFileSync('src/utils/storage.ts', 'utf-8');

code = code.replace(
  "  feversTriggered: 0,",
  "  feversTriggered: 0,\n  lastDailyRewardTime: 0,\n  dailyStreak: 0,"
);

fs.writeFileSync('src/utils/storage.ts', code);
console.log('patched storage');
