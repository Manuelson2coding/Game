import React from 'react';
import { motion } from 'motion/react';
import { Play, ShoppingBag, Trophy, BarChart2, HelpCircle } from 'lucide-react';
import { BallSkin, TowerTheme } from '../types';

interface StartOverlayProps {
  highScore: number;
  gems: number;
  level: number;
  equippedSkin: BallSkin;
  theme: TowerTheme;
  onStart: () => void;
  onOpenShop: () => void;
  onOpenStats: () => void;
  onOpenHelp: () => void;
}

export const StartOverlay: React.FC<StartOverlayProps> = ({
  highScore,
  level,
  equippedSkin,
  onStart,
  onOpenShop,
  onOpenStats,
  onOpenHelp,
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md flex flex-col items-center justify-between p-6 z-20 select-none">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 shadow-lg">
          <Trophy size={18} className="text-amber-400" />
          <span className="text-xs font-bold text-slate-400 uppercase">Record</span>
          <span className="text-sm font-black text-white">{highScore}</span>
        </div>

        <button
          onClick={onOpenHelp}
          className="w-10 h-10 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all"
          title="Come giocare"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      {/* Main Title Hero */}
      <div className="flex flex-col items-center text-center my-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative flex flex-col items-center"
        >
          <div className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-emerald-400 to-amber-300 drop-shadow-[0_10px_25px_rgba(6,182,212,0.4)]">
            HELIX JUMP
          </div>
          <p className="text-xs md:text-sm font-medium text-slate-400 mt-2 max-w-xs">
            Fai saltare la pallina evitando le trappole rossastre. Ruota la torre per cadere nei varchi!
          </p>
        </motion.div>

        {/* Current Equipped Skin Preview Badge */}
        <div className="mt-8 flex items-center gap-3 bg-slate-900/90 px-5 py-2.5 rounded-full border border-slate-800 shadow-xl">
          <div
            className="w-6 h-6 rounded-full border-2 border-white shadow-md"
            style={{ backgroundColor: equippedSkin.color }}
          />
          <span className="text-xs font-bold text-slate-300">Skin: {equippedSkin.name}</span>
          <span className="text-xs font-bold text-cyan-400">Livello {level}</span>
        </div>

        {/* Big Tap / Click To Play Button */}
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-10 py-4 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xl shadow-[0_0_35px_rgba(16,185,129,0.5)] flex items-center gap-3 hover:brightness-110 transition-all cursor-pointer border border-emerald-300"
        >
          <Play size={26} className="fill-slate-950" />
          <span>GIOCA ORA</span>
        </motion.button>
      </div>

      {/* Bottom Menu Shortcut Buttons */}
      <div className="w-full max-w-sm flex items-center justify-around gap-4 pb-4">
        <button
          onClick={onOpenShop}
          className="flex-1 py-3 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
        >
          <ShoppingBag size={18} className="text-amber-400" />
          <span>Negozio Skin</span>
        </button>

        <button
          onClick={onOpenStats}
          className="flex-1 py-3 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
        >
          <BarChart2 size={18} className="text-cyan-400" />
          <span>Statistiche</span>
        </button>
      </div>
    </div>
  );
};
