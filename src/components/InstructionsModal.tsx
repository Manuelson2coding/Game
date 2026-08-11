import React from 'react';
import { motion } from 'motion/react';
import { X, HelpCircle, MousePointer, ShieldAlert, Flame, Sparkles } from 'lucide-react';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
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
              <HelpCircle size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">COME GIOCARE</h2>
              <p className="text-xs text-slate-400">Guida rapida a Helix Jump 3D</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Steps */}
        <div className="py-4 flex flex-col gap-3">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
              <MousePointer size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Ruota la Torre</h3>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Trascina il mouse o il dito verso destra/sinistra (oppure usa i tasti A/D o frecce) per far cadere la pallina nei varchi.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shrink-0">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Evita le Trappole Rosse</h3>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Rimbalzare sulle sezioni rosse distrugge la pallina e causa il Game Over!
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 shrink-0">
              <Flame size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Attiva la FEVER MODE</h3>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Attraversa 3 o più piattaforme consecutive senza rimbalzare per trasformare la pallina in una cometa infuocata capace di DISTRUGGERE la prima piattaforma che tocca!
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Raccogli Gemme & Sblocca Skin</h3>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Raccogli le gemme dorate fluttuanti nei varchi per sbloccare skin esclusive come Basketball, Matrix Cyber, Oro e Prisma!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
