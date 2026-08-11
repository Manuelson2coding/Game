import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Check, Lock, Shield, Magnet, Flame, Palette, CircleDot, Gift, Zap } from 'lucide-react';
import { BallSkin, TowerTheme } from '../types';
import { soundEngine } from '../utils/audio';

interface SkinShopModalProps {
  skins: BallSkin[];
  equippedSkinId: string;
  themes: TowerTheme[];
  currentThemeId: string;
  gems: number;
  onEquipSkin: (skinId: string) => void;
  onUnlockSkin: (skinId: string, price: number) => void;
  onSelectTheme: (themeId: string) => void;
  onUnlockTheme: (themeId: string, price: number) => void;
  onBuyPowerUp: (powerUpType: 'shield' | 'magnet' | 'fever', durationSeconds: number, price: number) => void;
  onAddBonusGems?: (amount: number) => void;
  onClose: () => void;
}

type ShopTab = 'skins' | 'themes' | 'powerups';
type SkinCategory = 'all' | 'classic' | 'sports' | 'elemental' | 'fun' | 'cosmic';

export const SkinShopModal: React.FC<SkinShopModalProps> = ({
  skins,
  equippedSkinId,
  themes,
  currentThemeId,
  gems,
  onEquipSkin,
  onUnlockSkin,
  onSelectTheme,
  onUnlockTheme,
  onBuyPowerUp,
  onAddBonusGems,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<ShopTab>('skins');
  const [selectedCategory, setSelectedCategory] = useState<SkinCategory>('all');
  const [bonusClaimed, setBonusClaimed] = useState<boolean>(false);

  const categories: { id: SkinCategory; label: string }[] = [
    { id: 'all', label: 'Tutti' },
    { id: 'classic', label: 'Classici' },
    { id: 'sports', label: 'Sport' },
    { id: 'elemental', label: 'Elementi' },
    { id: 'fun', label: 'Divertenti' },
    { id: 'cosmic', label: 'Cosmici' },
  ];

  const filteredSkins = skins.filter((skin) => {
    if (selectedCategory === 'all') return true;
    return skin.category === selectedCategory;
  });

  const powerUpItems = [
    {
      type: 'shield' as const,
      name: 'Scudo Infrangibile',
      duration: 20,
      price: 100,
      icon: Shield,
      color: 'from-blue-500 to-cyan-500',
      description: 'Protegge da 1 impatto mortale contro una piattaforma rossa!',
    },
    {
      type: 'magnet' as const,
      name: 'Magnete per Gemme',
      duration: 30,
      price: 150,
      icon: Magnet,
      color: 'from-amber-500 to-yellow-500',
      description: 'Attira automaticamente tutte le gemme vicine alla pallina!',
    },
    {
      type: 'fever' as const,
      name: 'Modalità Febbre Iniziale',
      duration: 15,
      price: 200,
      icon: Flame,
      color: 'from-orange-500 to-red-600',
      description: 'Inizia la partita in modalità super distruttiva!',
    },
  ];

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 z-40 select-none">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-xl h-[88vh] max-h-[720px] rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-col shadow-2xl relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                GRANDE NEGOZIO
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                  {skins.length} ITEMS
                </span>
              </h2>
              <p className="text-xs text-slate-400">Personalizza pallina, torre e potenziamenti!</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gem Count */}
            <div className="px-3 py-1.5 rounded-2xl bg-slate-950 border border-amber-500/30 text-amber-300 font-black text-xs flex items-center gap-1.5 shadow-sm">
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>{gems}</span>
            </div>

            {/* Daily Bonus Button */}
            {!bonusClaimed && onAddBonusGems && (
              <button
                onClick={() => {
                  onAddBonusGems(150);
                  setBonusClaimed(true);
                  soundEngine.playGem();
                }}
                className="px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
                title="Riscatta 150 Gemme Gratis!"
              >
                <Gift size={14} />
                <span className="hidden sm:inline">+150</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/80 rounded-2xl my-3 border border-slate-800">
          <button
            onClick={() => {
              setActiveTab('skins');
              soundEngine.playClick();
            }}
            className={`flex-1 py-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'skins'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CircleDot size={15} />
            <span>PALLINE ({skins.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('themes');
              soundEngine.playClick();
            }}
            className={`flex-1 py-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'themes'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette size={15} />
            <span>TEMI TORRE ({themes.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('powerups');
              soundEngine.playClick();
            }}
            className={`flex-1 py-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'powerups'
                ? 'bg-purple-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap size={15} />
            <span>PERK</span>
          </button>
        </div>

        {/* TAB 1: SKINS */}
        {activeTab === 'skins' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    soundEngine.playClick();
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-slate-100 text-slate-950 shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Skins Grid */}
            <div className="flex-1 overflow-y-auto py-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5 pr-1">
              {filteredSkins.map((skin) => {
                const isEquipped = skin.id === equippedSkinId;
                const canAfford = gems >= skin.price;

                return (
                  <div
                    key={skin.id}
                    className={`p-3 rounded-2xl border flex flex-col justify-between transition-all relative ${
                      isEquipped
                        ? 'bg-gradient-to-b from-cyan-950/50 to-slate-900 border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : skin.unlocked
                        ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/30 border-slate-900 opacity-90'
                    }`}
                  >
                    {/* Skin Preview Ball */}
                    <div className="flex flex-col items-center text-center my-1">
                      <div
                        className="w-12 h-12 rounded-full border-2 border-white/80 shadow-md mb-2 relative flex items-center justify-center transition-transform hover:scale-105"
                        style={{
                          backgroundColor: skin.color,
                          boxShadow: `0 0 16px ${skin.color}aa`,
                        }}
                      >
                        {!skin.unlocked && <Lock size={18} className="text-slate-950/80 drop-shadow" />}
                      </div>

                      <h3 className="font-extrabold text-xs text-white line-clamp-1">{skin.name}</h3>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">{skin.description}</p>
                    </div>

                    {/* Action button */}
                    <div className="mt-2">
                      {skin.unlocked ? (
                        isEquipped ? (
                          <div className="w-full py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-extrabold text-[11px] flex items-center justify-center gap-1">
                            <Check size={12} />
                            <span>IN USO</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              onEquipSkin(skin.id);
                              soundEngine.playClick();
                            }}
                            className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] transition-all active:scale-95 border border-slate-700 cursor-pointer"
                          >
                            EQUIPAGGIA
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              onUnlockSkin(skin.id, skin.price);
                              soundEngine.playGem();
                            }
                          }}
                          disabled={!canAfford}
                          className={`w-full py-1.5 rounded-xl font-black text-[11px] flex items-center justify-center gap-1 transition-all ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 active:scale-95 cursor-pointer shadow-md'
                              : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                          }`}
                        >
                          <Sparkles size={12} />
                          <span>{skin.price}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: THEMES */}
        {activeTab === 'themes' && (
          <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-3 pr-1">
            {themes.map((theme) => {
              const isSelected = theme.id === currentThemeId;
              const canAfford = gems >= theme.price;

              return (
                <div
                  key={theme.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : theme.unlocked
                      ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/30 border-slate-900'
                  }`}
                >
                  {/* Theme Preview Color Palette */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl border border-slate-700 p-1 flex flex-col justify-between overflow-hidden shadow-md bg-slate-900">
                      <div className="h-3 rounded-t-lg" style={{ backgroundColor: theme.platformColor }} />
                      <div className="h-3 my-0.5 rounded" style={{ backgroundColor: theme.poleColor }} />
                      <div className="h-3 rounded-b-lg" style={{ backgroundColor: theme.hazardColor }} />
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                        {theme.name}
                        {isSelected && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                            ATTIVO
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{theme.description}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {theme.unlocked ? (
                      isSelected ? (
                        <div className="px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs flex items-center gap-1">
                          <Check size={14} />
                          <span className="hidden sm:inline">EQUIPAGGIATO</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            onSelectTheme(theme.id);
                            soundEngine.playClick();
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all active:scale-95 border border-slate-700 cursor-pointer"
                        >
                          USA TEME
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => {
                          if (canAfford) {
                            onUnlockTheme(theme.id, theme.price);
                            soundEngine.playGem();
                          }
                        }}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 active:scale-95 cursor-pointer shadow-md'
                            : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                        }`}
                      >
                        <Sparkles size={14} />
                        <span>{theme.price} Gemme</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: POWERUPS / PERKS */}
        {activeTab === 'powerups' && (
          <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-3 pr-1">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300">
              ⚡ Acquista potenziamenti immediati pronti all'uso nella tua prossima partita!
            </div>

            {powerUpItems.map((item) => {
              const IconComp = item.icon;
              const canAfford = gems >= item.price;

              return (
                <div
                  key={item.type}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-slate-950 shadow-md`}
                    >
                      <IconComp size={22} />
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-white">{item.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                      <span className="text-[10px] text-cyan-400 font-bold">Durata: {item.duration}s</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (canAfford) {
                        onBuyPowerUp(item.type, item.duration, item.price);
                        soundEngine.playGem();
                      }
                    }}
                    disabled={!canAfford}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all whitespace-nowrap ${
                      canAfford
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:brightness-110 active:scale-95 cursor-pointer shadow-md'
                        : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles size={14} />
                    <span>{item.price} Gemme</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};
