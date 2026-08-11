import React from 'react';
import { motion } from 'motion/react';
import { X, Settings, Volume2, VolumeX, Sliders, Palette } from 'lucide-react';
import { GameSettings, TowerTheme } from '../types';
import { TOWER_THEMES } from '../utils/storage';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
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
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">IMPOSTAZIONI</h2>
              <p className="text-xs text-slate-400">Personalizza i controlli e la grafica</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Options */}
        <div className="py-4 flex flex-col gap-4">
          {/* Audio Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-rose-400" />}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Effetti Audio</span>
                <span className="text-[11px] text-slate-400 block">Suoni di rimbalzo, distruzione e musica</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 cursor-pointer ${
                settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Rotation Sensitivity Slider */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-cyan-400" />
                <span className="text-xs font-bold text-white">Sensibilità Rotazione</span>
              </div>
              <span className="text-xs font-black text-cyan-400">{Math.round(settings.rotationSensitivity * 100)}%</span>
            </div>

            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.rotationSensitivity}
              onChange={(e) =>
                onUpdateSettings({ ...settings, rotationSensitivity: parseFloat(e.target.value) })
              }
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer mt-1"
            />
          </div>

          {/* Theme Selector */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <Palette size={16} className="text-purple-400" />
              <span className="text-xs font-bold text-white">Tema Torre & Sfondo</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              {TOWER_THEMES.map((theme: TowerTheme) => {
                const isSelected = settings.themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onUpdateSettings({ ...settings, themeId: theme.id })}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 text-white font-bold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs">{theme.name}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.platformColor }} />
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.hazardColor }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
