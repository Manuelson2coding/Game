import React from 'react';
import { motion } from 'motion/react';
import { Star, ArrowRight, Sparkles, Trophy } from 'lucide-react';

interface LevelCompleteModalProps {
  level: number;
  score: number;
  earnedGems: number;
  onNextLevel: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  level,
  score,
  earnedGems,
  onNextLevel,
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-30 select-none">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
      >
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

        {/* 3 Animated Stars */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {[1, 2, 3].map((starIdx) => (
            <motion.div
              key={starIdx}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: starIdx * 0.15, type: 'spring' }}
            >
              <Star size={36} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
            </motion.div>
          ))}
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">LIVELLO {level} COMPLETATO!</h2>
        <p className="text-xs text-slate-400 mt-1">Ottimo lavoro! Sei atterrato sulla piattaforma finale!</p>

        {/* Reward Stats */}
        <div className="w-full my-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-slate-400 flex items-center gap-1.5">
              <Trophy size={16} className="text-cyan-400" />
              Punteggio Livello:
            </span>
            <span className="font-black text-lg text-white">{score}</span>
          </div>

          <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-800/60">
            <span className="font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-400" />
              Gemme Guadagnate:
            </span>
            <span className="font-bold text-lg text-amber-400">+{earnedGems}</span>
          </div>
        </div>

        {/* Next Level Button */}
        <button
          onClick={onNextLevel}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-base shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>PROSSIMO LIVELLO</span>
          <ArrowRight size={20} />
        </button>
      </motion.div>
    </div>
  );
};
