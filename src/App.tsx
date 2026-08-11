import { useState, useEffect } from 'react';
import { HelixGame } from './components/HelixGame';
import { HUD } from './components/HUD';
import { StartOverlay } from './components/StartOverlay';
import { GameOverModal } from './components/GameOverModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { SkinShopModal } from './components/SkinShopModal';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';
import { InstructionsModal } from './components/InstructionsModal';
import { DailyRewardModal, REWARD_AMOUNTS } from './components/DailyRewardModal';
import { ActivePowerUp, BallSkin, GameState, GameStats, GameSettings, TowerTheme } from './types';
import {
  loadEquippedSkinId,
  loadSettings,
  loadSkins,
  loadStats,
  loadThemes,
  saveEquippedSkinId,
  saveSettings,
  saveSkins,
  saveStats,
  saveThemes,
  TOWER_THEMES,
} from './utils/storage';
import { soundEngine } from './utils/audio';

export default function App() {
  // Game State
  const [gameState, setGameState] = useState<GameState>('START');
  const [gameKey, setGameKey] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [isFever, setIsFever] = useState<boolean>(false);
  const [gems, setGems] = useState<number>(0);

  // Persistent State
  const [stats, setStats] = useState<GameStats>(() => loadStats());
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [skins, setSkins] = useState<BallSkin[]>(() => loadSkins());
  const [themes, setThemes] = useState<TowerTheme[]>(() => loadThemes());
  const [equippedSkinId, setEquippedSkinId] = useState<string>(() => loadEquippedSkinId());
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);

  // Modals
  const [showShop, setShowShop] = useState<boolean>(false);
  const [showDailyReward, setShowDailyReward] = useState<boolean>(false);
  const [pendingStreak, setPendingStreak] = useState<number>(1);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Level rewards state
  const [earnedGems, setEarnedGems] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Sync sound settings with audio engine
  useEffect(() => {
    soundEngine.setEnabled(settings.soundEnabled);
    saveSettings(settings);
  }, [settings]);


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

  // Sync stats & gems
  useEffect(() => {
    setGems(stats.totalGems);
    setLevel(stats.currentLevel);
  }, [stats]);

  // Save state helpers
  const updateStats = (updater: (prev: GameStats) => GameStats) => {
    setStats((prev) => {
      const updated = updater(prev);
      saveStats(updated);
      return updated;
    });
  };

  const handleEquipSkin = (skinId: string) => {
    setEquippedSkinId(skinId);
    saveEquippedSkinId(skinId);
  };

  const handleUnlockSkin = (skinId: string, price: number) => {
    if (stats.totalGems < price) return;

    // Deduct gems and unlock skin
    updateStats((prev) => ({
      ...prev,
      totalGems: prev.totalGems - price,
    }));

    const updatedSkins = skins.map((s) => (s.id === skinId ? { ...s, unlocked: true } : s));
    setSkins(updatedSkins);
    saveSkins(updatedSkins);

    // Auto-equip purchased skin
    handleEquipSkin(skinId);
  };

  const handleSelectTheme = (themeId: string) => {
    setSettings((prev) => ({ ...prev, themeId }));
  };

  const handleUnlockTheme = (themeId: string, price: number) => {
    if (stats.totalGems < price) return;

    updateStats((prev) => ({
      ...prev,
      totalGems: prev.totalGems - price,
    }));

    const updatedThemes = themes.map((t) => (t.id === themeId ? { ...t, unlocked: true } : t));
    setThemes(updatedThemes);
    saveThemes(updatedThemes);

    handleSelectTheme(themeId);
  };

  const handleBuyPowerUp = (type: 'shield' | 'magnet' | 'fever', durationSeconds: number, price: number) => {
    if (stats.totalGems < price) return;

    updateStats((prev) => ({
      ...prev,
      totalGems: prev.totalGems - price,
    }));

    setActivePowerUps((prev) => {
      const existing = prev.find((p) => p.type === type);
      if (existing) {
        return prev.map((p) => (p.type === type ? { ...p, durationLeft: p.durationLeft + durationSeconds } : p));
      }
      return [...prev, { type, durationLeft: durationSeconds }];
    });
  };

  const handleAddBonusGems = (amount: number) => {
    updateStats((prev) => ({
      ...prev,
      totalGems: prev.totalGems + amount,
    }));
  };

  const handleStartGame = () => {
    setScore(0);
    setCombo(0);
    setIsFever(false);
    setIsNewRecord(false);
    setActivePowerUps([]);
    setGameState('PLAYING');
    setGameKey(k => k + 1);
    soundEngine.playClick();
  };

  const handlePauseGame = () => {
    setGameState((prev) => (prev === 'PLAYING' ? 'PAUSED' : 'PLAYING'));
    soundEngine.playClick();
  };

  const handleGameOver = (finalScore: number) => {
    let newRecord = false;
    updateStats((prev) => {
      if (finalScore > prev.highScore) {
        newRecord = true;
      }
      return {
        ...prev,
        highScore: Math.max(prev.highScore, finalScore),
      };
    });
    setIsNewRecord(newRecord);
  };

  const handleLevelComplete = (earnedLevelGems: number, levelScore: number) => {
    setEarnedGems(earnedLevelGems);
    updateStats((prev) => {
      const newScore = prev.highScore < levelScore ? levelScore : prev.highScore;
      return {
        ...prev,
        highScore: newScore,
        levelsCleared: prev.levelsCleared + 1,
        totalGems: prev.totalGems + earnedLevelGems,
      };
    });
  };

  const handleNextLevel = () => {
    updateStats((prev) => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
    }));
    setCombo(0);
    setIsFever(false);
    setGameState('PLAYING');
    soundEngine.playClick();
  };

  // Find equipped skin object
  const equippedSkin = skins.find((s) => s.id === equippedSkinId) || skins[0];

  // Find theme object
  const currentTheme = TOWER_THEMES.find((t) => t.id === settings.themeId) || TOWER_THEMES[0];

  return (
    <div className="relative w-screen h-screen bg-slate-950 font-sans antialiased overflow-hidden select-none">
      {/* 3D Helix Jump Canvas Engine */}
      <HelixGame key={gameKey}
        gameState={gameState}
        setGameState={setGameState}
        level={level}
        score={score}
        setScore={setScore}
        combo={combo}
        setCombo={setCombo}
        isFever={isFever}
        setIsFever={setIsFever}
        gems={gems}
        setGems={(newGems) => {
          if (typeof newGems === 'function') {
            const nextGems = newGems(gems);
            updateStats((prev) => ({ ...prev, totalGems: nextGems }));
          } else {
            updateStats((prev) => ({ ...prev, totalGems: newGems }));
          }
        }}
        equippedSkin={equippedSkin}
        theme={currentTheme}
        stats={stats}
        setStats={setStats}
        activePowerUps={activePowerUps}
        setActivePowerUps={setActivePowerUps}
        sensitivity={settings.rotationSensitivity}
        onLevelComplete={handleLevelComplete}
        onGameOver={handleGameOver}
      />

      {/* Playing HUD */}
      {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
        <HUD
          level={level}
          score={score}
          highScore={stats.highScore}
          gems={gems}
          combo={combo}
          isFever={isFever}
          soundEnabled={settings.soundEnabled}
          activePowerUps={activePowerUps}
          onPause={handlePauseGame}
          onToggleSound={() =>
            setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
          }
          onOpenShop={() => setShowShop(true)}
          onOpenStats={() => setShowStats(true)}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {/* Start Game Overlay */}
      {gameState === 'START' && (
        <StartOverlay
          highScore={stats.highScore}
          gems={gems}
          level={level}
          equippedSkin={equippedSkin}
          theme={currentTheme}
          onStart={handleStartGame}
          onOpenShop={() => setShowShop(true)}
          onOpenStats={() => setShowStats(true)}
          onOpenHelp={() => setShowHelp(true)}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'GAMEOVER' && (
        <GameOverModal
          score={score}
          highScore={stats.highScore}
          isNewRecord={isNewRecord}
          onRetry={handleStartGame}
          onOpenShop={() => setShowShop(true)}
        />
      )}

      {/* Level Complete Modal */}
      {gameState === 'LEVEL_COMPLETE' && (
        <LevelCompleteModal
          level={level}
          score={score}
          earnedGems={earnedGems}
          onNextLevel={handleNextLevel}
        />
      )}

      {/* Pause Modal */}
      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-30 select-none">
          <div className="w-full max-w-xs rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center text-center shadow-2xl">
            <h2 className="text-2xl font-black text-white tracking-tight mb-4">GIOCO IN PAUSA</h2>
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={handlePauseGame}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-md hover:brightness-110 active:scale-95 transition-all"
              >
                RIPRENDI
              </button>
              <button
                onClick={handleStartGame}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all active:scale-95"
              >
                RICOMINCIA LIVELLO
              </button>
              <button
                onClick={() => setGameState('START')}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold text-xs border border-slate-800 transition-all active:scale-95"
              >
                MENU PRINCIPALE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skin Shop Modal */}
      {showDailyReward && (
        <DailyRewardModal
          streak={pendingStreak}
          onClaim={handleClaimDailyReward}
          onClose={() => setShowDailyReward(false)}
        />
      )}

      {showShop && (
        <SkinShopModal
          skins={skins}
          equippedSkinId={equippedSkinId}
          themes={themes}
          currentThemeId={settings.themeId}
          gems={gems}
          onEquipSkin={handleEquipSkin}
          onUnlockSkin={handleUnlockSkin}
          onSelectTheme={handleSelectTheme}
          onUnlockTheme={handleUnlockTheme}
          onBuyPowerUp={handleBuyPowerUp}
          onAddBonusGems={handleAddBonusGems}
          onClose={() => setShowShop(false)}
        />
      )}

      {/* Stats Modal */}
      {showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} />}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Instructions Modal */}
      {showHelp && <InstructionsModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
