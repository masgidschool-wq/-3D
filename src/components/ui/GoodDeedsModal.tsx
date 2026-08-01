import React from 'react';
import { motion } from 'motion/react';
import { GoodDeedQuest } from '../../types/game';
import { soundManager } from '../../services/soundManager';
import { HeartHandshake, Sparkles, Coins, Star, CheckCircle2, X } from 'lucide-react';

interface GoodDeedsModalProps {
  quest: GoodDeedQuest;
  onCompleteQuest: (questId: string) => void;
  onClose: () => void;
}

export const GoodDeedsModal: React.FC<GoodDeedsModalProps> = ({ quest, onCompleteQuest, onClose }) => {
  const handlePerformDeed = () => {
    soundManager.playFanfare();
    onCompleteQuest(quest.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-white relative text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <HeartHandshake className="w-8 h-8 animate-pulse" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">{quest.title}</h2>
        <p className="text-xs text-emerald-400 font-semibold mb-4">Житель: {quest.npcName}</p>

        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 mb-6 text-left shadow-inner">
          <p className="text-sm text-slate-200 leading-relaxed mb-3">{quest.description}</p>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-300 pt-2 border-t border-slate-700/60">
            <div className="flex items-center gap-1 text-amber-400">
              <Coins className="w-3.5 h-3.5" />
              <span>+{quest.rewardCoins} Монет</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <Star className="w-3.5 h-3.5 fill-emerald-400" />
              <span>+{quest.rewardExp} Опыта</span>
            </div>
          </div>
        </div>

        {!quest.completed ? (
          <button
            onClick={handlePerformDeed}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-emerald-900/40 border border-emerald-300/30 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-emerald-200" />
            <span>Совершить доброе дело!</span>
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-base py-3 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl">
            <CheckCircle2 className="w-5 h-5" />
            <span>Задание успешно выполнено!</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
