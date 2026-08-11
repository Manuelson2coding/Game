import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add import
code = code.replace(
  "import { InstructionsModal } from './components/InstructionsModal';",
  "import { InstructionsModal } from './components/InstructionsModal';\nimport { DailyRewardModal, REWARD_AMOUNTS } from './components/DailyRewardModal';"
);

// Add state
code = code.replace(
  "const [showShop, setShowShop] = useState<boolean>(false);",
  "const [showShop, setShowShop] = useState<boolean>(false);\n  const [showDailyReward, setShowDailyReward] = useState<boolean>(false);\n  const [pendingStreak, setPendingStreak] = useState<number>(1);"
);

// Add useEffect
const dailyRewardEffect = `
  // Daily Reward Check
  useEffect(() => {
    const checkDailyReward = () => {
      const now = Date.now();
      const lastRewardTime = stats.lastDailyRewardTime || 0;
      
      if (lastRewardTime === 0) {
        setPendingStreak(1);
        setShowDailyReward(true);
        return;
      }

      const lastDate = new Date(lastRewardTime);
      const nowDate = new Date(now);
      
      lastDate.setHours(0, 0, 0, 0);
      nowDate.setHours(0, 0, 0, 0);
      
      const diffTime = nowDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        setPendingStreak((stats.dailyStreak || 0) + 1);
        setShowDailyReward(true);
      } else if (diffDays > 1) {
        setPendingStreak(1);
        setShowDailyReward(true);
      }
    };
    checkDailyReward();
  }, [stats.lastDailyRewardTime]);

  const handleClaimDailyReward = () => {
    const amount = REWARD_AMOUNTS[(pendingStreak - 1) % REWARD_AMOUNTS.length];
    
    setStats(prev => ({
      ...prev,
      totalGems: prev.totalGems + amount,
      lastDailyRewardTime: Date.now(),
      dailyStreak: pendingStreak
    }));
    
    saveStats({
      ...stats,
      totalGems: stats.totalGems + amount,
      lastDailyRewardTime: Date.now(),
      dailyStreak: pendingStreak
    });
    
    setShowDailyReward(false);
  };
`;

code = code.replace(
  "  // Sync stats & gems",
  dailyRewardEffect + "\n  // Sync stats & gems"
);

// Add Modal rendering
code = code.replace(
  "{showShop && (",
  "{showDailyReward && (\n        <DailyRewardModal\n          streak={pendingStreak}\n          onClaim={handleClaimDailyReward}\n          onClose={() => setShowDailyReward(false)}\n        />\n      )}\n\n      {showShop && ("
);

fs.writeFileSync('src/App.tsx', code);
console.log('patched app');
