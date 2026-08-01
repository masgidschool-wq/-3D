import React from 'react';
import { motion } from 'motion/react';
import { Achievement } from '../../types/game';
import { Trophy, CheckCircle2, Lock, X } from 'lucide-react';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ achievements, onClose }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl text-white relative max-h-[85vh] flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <Trophy className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Достижения</h2>
            <p className="text-xs text-emerald-300">
              Разблокировано: {unlockedCount} из {achievements.length}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition flex items-start gap-3 ${
                ach.unlocked
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-400 opacity-70'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  ach.unlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'
                }`}
              >
                {ach.unlocked ? <CheckCircle2 className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-white mb-0.5">{ach.title}</h3>
                <p className="text-xs text-slate-300">{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
