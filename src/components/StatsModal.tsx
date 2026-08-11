import React from 'react';
import { motion } from 'motion/react';
import { X, Trophy, Sparkles, Flame, BarChart2, Layers, Zap } from 'lucide-react';
import { GameStats } from '../types';

interface StatsModalProps {
  stats: GameStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose }) => {
  const statItems = [
    { label: 'Record Personale', value: stats.highScore, icon: Trophy, color: 'text-amber-400' },
    { label: 'Gemme Totali', value: stats.totalGems, icon: Sparkles, color: 'text-amber-300' },
    { label: 'Livelli Completati', value: stats.levelsCleared, icon: Layers, color: 'text-emerald-400' },
    { label: 'Piattaforme Superate', value: stats.platformsPassed, icon: Zap, color: 'text-cyan-400' },
    { label: 'Piattaforme Distrutte', value: stats.platformsSmashed, icon: Flame, color: 'text-rose-400' },
    { label: 'Febbri Attivate', value: stats.feversTriggered, icon: Flame, color: 'text-orange-400' },
  ];

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-40 select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 flex flex-col shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BarChart2 size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">STATISTICHE</h2>
              <p className="text-xs text-slate-400">I tuoi traguardi in Helix Jump</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stat List */}
        <div className="py-4 flex flex-col gap-2.5">
          {statItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${item.color}`}>
                    <IconComponent size={18} />
                  </div>
                  <span className="text-xs font-semibold text-slate-300">{item.label}</span>
                </div>
                <span className="text-sm font-black text-white">{item.value}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
