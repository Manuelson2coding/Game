import React from 'react';
import { X, Gift, Gem } from 'lucide-react';

interface DailyRewardModalProps {
  streak: number;
  onClaim: () => void;
  onClose: () => void;
}

export const REWARD_AMOUNTS = [50, 100, 150, 200, 250, 300, 500];

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ streak, onClaim, onClose }) => {
  const todayReward = REWARD_AMOUNTS[(streak - 1) % REWARD_AMOUNTS.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-center relative">
          <Gift className="w-12 h-12 mx-auto text-white mb-2" />
          <h2 className="text-2xl font-black text-white tracking-wide uppercase">Ricompensa Giornaliera</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          <p className="text-slate-300 text-center mb-6">
            Torna ogni giorno per ottenere ricompense sempre migliori!
          </p>

          <div className="grid grid-cols-4 gap-2 mb-6 w-full">
            {REWARD_AMOUNTS.map((amount, idx) => {
              const dayNum = idx + 1;
              const currentCycleStreak = ((streak - 1) % REWARD_AMOUNTS.length) + 1;
              const isPast = dayNum < currentCycleStreak;
              const isToday = dayNum === currentCycleStreak;

              return (
                <div
                  key={dayNum}
                  className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 ${
                    isToday
                      ? 'border-emerald-500 bg-emerald-500/20 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10'
                      : isPast
                      ? 'border-slate-700 bg-slate-800 opacity-50'
                      : 'border-slate-800 bg-slate-800/50'
                  } ${dayNum === 7 ? 'col-span-2' : 'col-span-1'}`}
                >
                  <span className={`text-xs font-bold mb-1 ${isToday ? 'text-emerald-400' : 'text-slate-400'}`}>
                    Day {dayNum}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Gem className={`w-4 h-4 ${isPast ? 'text-slate-500' : 'text-cyan-400'}`} />
                    <span className={`font-bold ${isPast ? 'text-slate-500' : 'text-white'}`}>
                      {amount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onClaim}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xl rounded-xl uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center space-x-2"
          >
            <Gem className="w-6 h-6" />
            <span>Riscatta {todayReward} Gemme</span>
          </button>
        </div>
      </div>
    </div>
  );
};
