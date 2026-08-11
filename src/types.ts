export interface BallSkin {
  id: string;
  name: string;
  price: number;
  color: string;
  emissive?: string;
  metalness?: number;
  roughness?: number;
  unlocked: boolean;
  trailColor?: string;
  description: string;
  pattern?: 'solid' | 'basketball' | 'cyber' | 'fire' | 'gold' | 'rainbow' | 'emoji' | 'galaxy' | 'soccer' | 'pool8' | 'donut' | 'watermelon' | 'lava' | 'electric' | 'sakura' | 'poison' | 'hologram' | 'disco' | 'eye' | 'slime' | 'diamond' | 'sun' | 'moon' | 'candy' | 'spartan' | 'dragon';
  category?: 'classic' | 'sports' | 'elemental' | 'cosmic' | 'fun';
}

export interface TowerTheme {
  id: string;
  name: string;
  price: number;
  unlocked: boolean;
  poleColor: string;
  platformColor: string;
  hazardColor: string;
  finishColor: string;
  bgColor1: string;
  bgColor2: string;
  description?: string;
  weather?: 'rain' | 'snow' | 'none';
}

export interface GameStats {
  highScore: number;
  totalGems: number;
  currentLevel: number;
  levelsCleared: number;
  platformsPassed: number;
  platformsSmashed: number;
  totalBounces: number;
  feversTriggered: number;
  lastDailyRewardTime?: number;
  dailyStreak?: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  rotationSensitivity: number; // 0.5 to 2.0
  vibrationEnabled: boolean;
  themeId: string;
}

export interface ActivePowerUp {
  type: 'shield' | 'magnet' | 'fever';
  durationLeft: number; // seconds
}

export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'LEVEL_COMPLETE';
