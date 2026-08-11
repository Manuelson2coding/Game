import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, ShoppingBag, Trophy, Flame } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewRecord: boolean;
  onRetry: () => void;
  onOpenShop: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewRecord,
  onRetry,
  onOpenShop,
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-30 select-none">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
      >
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500" />

        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-4">
          <Flame size={32} />
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight">GAME OVER</h2>
        <p className="text-xs text-slate-400 mt-1">Hai toccato una trappola rossastra!</p>

        {/* Score Card */}
        <div className="w-full my-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-slate-400">Punteggio:</span>
            <span className="font-black text-2xl text-white">{score}</span>
          </div>

          <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-800/60">
            <span className="font-semibold text-slate-400 flex items-center gap-1.5">
              <Trophy size={16} className="text-amber-400" />
              Record:
            </span>
            <span className="font-bold text-amber-400">{highScore}</span>
          </div>

          {isNewRecord && (
            <div className="mt-1 py-1 px-3 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider">
              🎉 Nuovo Record Personale!
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-base shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw size={20} />
            <span>RIPROVA ORA</span>
          </button>

          <button
            onClick={onOpenShop}
            className="w-full py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} className="text-amber-400" />
            <span>Negozio Skin</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
