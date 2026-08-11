import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Volume2, VolumeX, Flame, Shield, Magnet, Sparkles, Trophy, ShoppingBag, BarChart2, Settings } from 'lucide-react';
import { ActivePowerUp } from '../types';

interface HUDProps {
  level: number;
  score: number;
  highScore: number;
  gems: number;
  combo: number;
  isFever: boolean;
  soundEnabled: boolean;
  activePowerUps: ActivePowerUp[];
  onPause: () => void;
  onToggleSound: () => void;
  onOpenShop: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  level,
  score,
  highScore,
  gems,
  combo,
  isFever,
  soundEnabled,
  activePowerUps,
  onPause,
  onToggleSound,
  onOpenShop,
  onOpenStats,
  onOpenSettings,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-10">
      {/* Top Header Controls & Metrics */}
      <div className="flex items-center justify-between">
        {/* Left: Top Actions (Sound, Pause, Stats, Settings) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onPause}
            className="w-11 h-11 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all shadow-lg"
            title="Pausa"
          >
            <Pause size={20} />
          </button>

          <button
            onClick={onToggleSound}
            className="w-11 h-11 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all shadow-lg"
            title="Audio"
          >
            {soundEnabled ? <Volume2 size={20} className="text-emerald-400" /> : <VolumeX size={20} className="text-rose-400" />}
          </button>

          <button
            onClick={onOpenStats}
            className="w-11 h-11 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all shadow-lg"
            title="Statistiche"
          >
            <BarChart2 size={20} className="text-cyan-400" />
          </button>

          <button
            onClick={onOpenSettings}
            className="w-11 h-11 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all shadow-lg"
            title="Impostazioni"
          >
            <Settings size={20} className="text-slate-300" />
          </button>
        </div>

        {/* Right: Gems Counter & Shop Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-amber-500/40 text-amber-300 flex items-center gap-1.5 font-bold shadow-lg text-sm">
            <Sparkles size={18} className="text-amber-400 animate-pulse" />
            <span>{gems}</span>
          </div>

          <button
            onClick={onOpenShop}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-lg text-sm"
          >
            <ShoppingBag size={18} />
            <span>Negozio</span>
          </button>
        </div>
      </div>

      {/* Center Top: Level Progress & Score */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <div className="flex flex-col items-center gap-1 bg-slate-900/80 backdrop-blur-md px-5 py-2 rounded-3xl border border-slate-700/60 shadow-xl">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">LIVELLO {level}</span>
            <div className="w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (score % 1000) / 10)}%` }} // fake progress for aesthetic
              />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{level + 1}</span>
          </div>
          
        </div>

        {/* Big Score Display */}
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-tight">
            {score}
          </div>
          {highScore > 0 && (
            <div className="flex items-center justify-center gap-1 text-xs font-semibold text-amber-400 mt-0.5">
              <Trophy size={13} />
              <span>Record: {highScore}</span>
            </div>
          )}
        </div>
      </div>

      {/* Center Overlay: Combo & Fever Notifications */}
      <div className="flex flex-col items-center justify-center gap-2 my-auto">
        <AnimatePresence>
          {combo >= 2 && !isFever && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1.2, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xl md:text-2xl tracking-wider shadow-2xl border border-cyan-300/40"
            >
              +{combo} COMBO!
            </motion.div>
          )}

          {isFever && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [1, 1.15, 1], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 text-white font-black text-2xl md:text-3xl tracking-widest shadow-[0_0_30px_rgba(239,68,68,0.8)] border-2 border-yellow-300 flex items-center gap-2"
            >
              <Flame size={28} className="animate-bounce text-yellow-200" />
              <span>FEVER MODE!</span>
              <Flame size={28} className="animate-bounce text-yellow-200" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Bar: Active Power-Ups */}
      <div className="flex items-center justify-center gap-3">
        {activePowerUps.map((p) => (
          <div
            key={p.type}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
          >
            {p.type === 'shield' && <Shield size={16} className="text-cyan-400" />}
            {p.type === 'magnet' && <Magnet size={16} className="text-purple-400" />}
            {p.type === 'fever' && <Flame size={16} className="text-amber-400" />}
            <span className="capitalize">{p.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
