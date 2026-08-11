import { BallSkin, GameSettings, GameStats, TowerTheme } from '../types';

export const INITIAL_SKINS: BallSkin[] = [
  // CLASSIC & BASIC
  {
    id: 'skin_cyan',
    name: 'Neon Ciano',
    price: 0,
    color: '#00f0ff',
    emissive: '#005577',
    metalness: 0.3,
    roughness: 0.2,
    unlocked: true,
    trailColor: '#00f0ff',
    description: 'La skin classica ad alta energia luminosa.',
    pattern: 'solid',
    category: 'classic',
  },
  {
    id: 'skin_ruby',
    name: 'Rubino Splendente',
    price: 80,
    color: '#e60049',
    emissive: '#66001a',
    metalness: 0.6,
    roughness: 0.15,
    unlocked: false,
    trailColor: '#ff1a53',
    description: 'Pietra preziosa rossa sfaccettata ed elegante.',
    pattern: 'solid',
    category: 'classic',
  },
  {
    id: 'skin_emerald_ball',
    name: 'Smeraldo Puro',
    price: 120,
    color: '#00e676',
    emissive: '#004d26',
    metalness: 0.7,
    roughness: 0.1,
    unlocked: false,
    trailColor: '#33ff99',
    description: 'Bagliore verde naturale e brillante.',
    pattern: 'solid',
    category: 'classic',
  },
  {
    id: 'skin_amethyst',
    name: 'Ametista Reale',
    price: 180,
    color: '#9c27b0',
    emissive: '#380e3f',
    metalness: 0.5,
    roughness: 0.2,
    unlocked: false,
    trailColor: '#d500f9',
    description: 'Cristallo viola di immensa eleganza.',
    pattern: 'solid',
    category: 'classic',
  },

  // SPORTS
  {
    id: 'skin_basketball',
    name: 'Basket Ball',
    price: 150,
    color: '#ff6600',
    emissive: '#331100',
    metalness: 0.1,
    roughness: 0.8,
    unlocked: false,
    trailColor: '#ff6600',
    description: 'Palla da basket classica con scanalature nere.',
    pattern: 'basketball',
    category: 'sports',
  },
  {
    id: 'skin_soccer',
    name: 'Pallone da Calcio',
    price: 220,
    color: '#ffffff',
    emissive: '#222222',
    metalness: 0.1,
    roughness: 0.5,
    unlocked: false,
    trailColor: '#cccccc',
    description: 'Design classico a pentagoni bianco e nero.',
    pattern: 'soccer',
    category: 'sports',
  },
  {
    id: 'skin_pool8',
    name: 'Biliardo 8-Ball',
    price: 300,
    color: '#111111',
    emissive: '#000000',
    metalness: 0.8,
    roughness: 0.1,
    unlocked: false,
    trailColor: '#888888',
    description: 'La leggendaria bilia numero 8 portafortuna.',
    pattern: 'pool8',
    category: 'sports',
  },

  // ELEMENTAL & FUN
  {
    id: 'skin_fire',
    name: 'Inferno Fiammante',
    price: 350,
    color: '#ff2200',
    emissive: '#aa0000',
    metalness: 0.5,
    roughness: 0.1,
    unlocked: false,
    trailColor: '#ff4400',
    description: 'Incandescente come il magma in eruzione.',
    pattern: 'fire',
    category: 'elemental',
  },
  {
    id: 'skin_lava',
    name: 'Magma Vulcanico',
    price: 450,
    color: '#ff3300',
    emissive: '#881100',
    metalness: 0.4,
    roughness: 0.4,
    unlocked: false,
    trailColor: '#ff6600',
    description: 'Roccia lavica con crepe incandescenti.',
    pattern: 'lava',
    category: 'elemental',
  },
  {
    id: 'skin_electric',
    name: 'Fulmine Elettrico',
    price: 500,
    color: '#00d2ff',
    emissive: '#0044bb',
    metalness: 0.8,
    roughness: 0.1,
    unlocked: false,
    trailColor: '#00ffff',
    description: 'Scarica ad altissima tensione blu azzurro.',
    pattern: 'electric',
    category: 'elemental',
  },
  {
    id: 'skin_poison',
    name: 'Tossico Biohazard',
    price: 550,
    color: '#76ff03',
    emissive: '#1b5e20',
    metalness: 0.3,
    roughness: 0.3,
    unlocked: false,
    trailColor: '#00e676',
    description: 'Fluido radioattivo verde fosforescente.',
    pattern: 'poison',
    category: 'elemental',
  },
  {
    id: 'skin_donut',
    name: 'Ciambella Glassa',
    price: 400,
    color: '#ff80ab',
    emissive: '#880e4f',
    metalness: 0.1,
    roughness: 0.6,
    unlocked: false,
    trailColor: '#ff4081',
    description: 'Deliziosa ciambella rosa con zuccherini colorati!',
    pattern: 'donut',
    category: 'fun',
  },
  {
    id: 'skin_watermelon',
    name: 'Anguria Estiva',
    price: 420,
    color: '#ff1744',
    emissive: '#00e676',
    metalness: 0.1,
    roughness: 0.5,
    unlocked: false,
    trailColor: '#ff5252',
    description: 'Fresca e zuccherata con semi neri ed estivi.',
    pattern: 'watermelon',
    category: 'fun',
  },
  {
    id: 'skin_emoji',
    name: 'Sorriso Elica',
    price: 600,
    color: '#ffee00',
    emissive: '#444000',
    metalness: 0.1,
    roughness: 0.4,
    unlocked: false,
    trailColor: '#ffea00',
    description: 'Mantieni il sorriso anche nei salti più rischiosi!',
    pattern: 'emoji',
    category: 'fun',
  },
  {
    id: 'skin_eye',
    name: 'Occhio del Mostro',
    price: 650,
    color: '#ff0055',
    emissive: '#440011',
    metalness: 0.2,
    roughness: 0.3,
    unlocked: false,
    trailColor: '#ff0055',
    description: 'Ti osserva ad ogni rimbalzo sulla torre.',
    pattern: 'eye',
    category: 'fun',
  },

  // COSMIC & SCI-FI
  {
    id: 'skin_cyber',
    name: 'Matrix Cyberpunk',
    price: 750,
    color: '#00ff66',
    emissive: '#004411',
    metalness: 0.4,
    roughness: 0.3,
    unlocked: false,
    trailColor: '#00ff88',
    description: 'Circuito digitale al neon ad alte prestazioni.',
    pattern: 'cyber',
    category: 'cosmic',
  },
  {
    id: 'skin_rainbow',
    name: 'Prisma Arcobaleno',
    price: 900,
    color: '#ff00ee',
    emissive: '#550044',
    metalness: 0.6,
    roughness: 0.2,
    unlocked: false,
    trailColor: '#ff00aa',
    description: 'Riflette uno spettro cromatico dinamico.',
    pattern: 'rainbow',
    category: 'cosmic',
  },
  {
    id: 'skin_galaxy',
    name: 'Galassia Cosmica',
    price: 1200,
    color: '#8a2be2',
    emissive: '#3a0066',
    metalness: 0.7,
    roughness: 0.2,
    unlocked: false,
    trailColor: '#bb55ff',
    description: 'Nebulosa stellare profonda dall\'universo.',
    pattern: 'galaxy',
    category: 'cosmic',
  },
  {
    id: 'skin_disco',
    name: 'Sfera Disco 80s',
    price: 1350,
    color: '#e0e0e0',
    emissive: '#444444',
    metalness: 0.95,
    roughness: 0.05,
    unlocked: false,
    trailColor: '#ffffff',
    description: 'Specchietti brillanti per serate dance in quota!',
    pattern: 'disco',
    category: 'cosmic',
  },

  // LEGENDARY & GOLD
  {
    id: 'skin_gold',
    name: 'Lingotto d\'Oro',
    price: 1500,
    color: '#ffd700',
    emissive: '#665500',
    metalness: 0.95,
    roughness: 0.05,
    unlocked: false,
    trailColor: '#ffe555',
    description: 'Lussuosa finitura metallica oro brillante.',
    pattern: 'gold',
    category: 'classic',
  },
  {
    id: 'skin_diamond',
    name: 'Diamante Puro',
    price: 2000,
    color: '#b3f0ff',
    emissive: '#0088cc',
    metalness: 0.9,
    roughness: 0.05,
    unlocked: false,
    trailColor: '#00ffff',
    description: 'Sfaccettatura cristallina indistruttibile.',
    pattern: 'diamond',
    category: 'classic',
  },
  {
    id: 'skin_dragon',
    name: 'Drago Dorato',
    price: 2500,
    color: '#ffab00',
    emissive: '#ff3d00',
    metalness: 0.85,
    roughness: 0.15,
    unlocked: false,
    trailColor: '#ff6d00',
    description: 'Scaglie leggendarie infuse di fuoco draconico.',
    pattern: 'dragon',
    category: 'elemental',
  },
];

export const TOWER_THEMES: TowerTheme[] = [
  {
    id: 'ocean',
    name: 'Oceano Profondo',
    price: 0,
    unlocked: true,
    poleColor: '#1e293b',
    platformColor: '#0ea5e9',
    hazardColor: '#ef4444',
    finishColor: '#10b981',
    bgColor1: '#0f172a',
    bgColor2: '#1e1b4b',
    description: 'Atmosfera marina blu cobalto rilassante.',
    weather: 'rain',
  },
  {
    id: 'cyber',
    name: 'Cyber Neon',
    price: 250,
    unlocked: false,
    poleColor: '#2e1065',
    platformColor: '#a855f7',
    hazardColor: '#f43f5e',
    finishColor: '#06b6d4',
    bgColor1: '#18181b',
    bgColor2: '#311042',
    description: 'Luci al neon viola synthwave futuristiche.',
    weather: 'rain',
  },
  {
    id: 'sunset',
    name: 'Tramonto d\'Ambra',
    price: 400,
    unlocked: false,
    poleColor: '#451a03',
    platformColor: '#f97316',
    hazardColor: '#881337',
    finishColor: '#eab308',
    bgColor1: '#2a0a18',
    bgColor2: '#431407',
    description: 'Caldi toni arancio e rosso fuoco del crepuscolo.',
    weather: 'none',
  },
  {
    id: 'emerald',
    name: 'Smeraldo Mincraft',
    price: 600,
    unlocked: false,
    poleColor: '#064e3b',
    platformColor: '#10b981',
    hazardColor: '#dc2626',
    finishColor: '#f59e0b',
    bgColor1: '#022c22',
    bgColor2: '#111827',
    description: 'Toni verdi naturali da giungla lussureggiante.',
    weather: 'none',
  },
  {
    id: 'midnight',
    name: 'Notte Polare',
    price: 850,
    unlocked: false,
    poleColor: '#0f172a',
    platformColor: '#6366f1',
    hazardColor: '#f43f5e',
    finishColor: '#14b8a6',
    bgColor1: '#030712',
    bgColor2: '#0284c7',
    description: 'Aurore boreali nell\'oscurità artica.',
    weather: 'snow',
  },
];

const STORAGE_KEYS = {
  STATS: 'helix_jump_stats_v1',
  SETTINGS: 'helix_jump_settings_v1',
  SKINS: 'helix_jump_skins_v1',
  THEMES: 'helix_jump_themes_v1',
  EQUIPPED_SKIN: 'helix_jump_equipped_skin_v1',
};

export function loadStats(): GameStats {
  const saved = localStorage.getItem(STORAGE_KEYS.STATS);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      parsed.currentLevel = 1;
      return parsed;
    } catch {
      // fallback
    }
  }
  return {
    highScore: 0,
    totalGems: 0,
    currentLevel: 1,
    levelsCleared: 0,
    platformsPassed: 0,
    platformsSmashed: 0,
    totalBounces: 0,
    feversTriggered: 0,
  lastDailyRewardTime: 0,
  dailyStreak: 0,
  };
}

export function saveStats(stats: GameStats) {
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
}

export function loadSettings(): GameSettings {
  const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return {
    soundEnabled: true,
    rotationSensitivity: 1.0,
    vibrationEnabled: true,
    themeId: 'ocean',
  };
}

export function saveSettings(settings: GameSettings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function loadSkins(): BallSkin[] {
  const saved = localStorage.getItem(STORAGE_KEYS.SKINS);
  if (saved) {
    try {
      const parsed: BallSkin[] = JSON.parse(saved);
      // Merge with initial skins to ensure new fields or new skins are present
      return INITIAL_SKINS.map((initSkin) => {
        const found = parsed.find((s) => s.id === initSkin.id);
        return found ? { ...initSkin, unlocked: found.unlocked } : initSkin;
      });
    } catch {
      // fallback
    }
  }
  return INITIAL_SKINS;
}

export function saveSkins(skins: BallSkin[]) {
  localStorage.setItem(STORAGE_KEYS.SKINS, JSON.stringify(skins));
}

export function loadEquippedSkinId(): string {
  return localStorage.getItem(STORAGE_KEYS.EQUIPPED_SKIN) || 'skin_cyan';
}

export function saveEquippedSkinId(skinId: string) {
  localStorage.setItem(STORAGE_KEYS.EQUIPPED_SKIN, skinId);
}

export function loadThemes(): TowerTheme[] {
  const saved = localStorage.getItem(STORAGE_KEYS.THEMES);
  if (saved) {
    try {
      const parsed: TowerTheme[] = JSON.parse(saved);
      return TOWER_THEMES.map((initTheme) => {
        const found = parsed.find((t) => t.id === initTheme.id);
        return found ? { ...initTheme, unlocked: found.unlocked } : initTheme;
      });
    } catch {
      // fallback
    }
  }
  return TOWER_THEMES;
}

export function saveThemes(themes: TowerTheme[]) {
  localStorage.setItem(STORAGE_KEYS.THEMES, JSON.stringify(themes));
}
