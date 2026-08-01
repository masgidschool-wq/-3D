import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../services/soundManager';
import { Sun, Wind, Bell, Sparkles } from 'lucide-react';

interface IntroCutsceneProps {
  onFinishIntro: () => void;
}

export const IntroCutscene: React.FC<IntroCutsceneProps> = ({ onFinishIntro }) => {
  const [stage, setStage] = useState<'dark' | 'sunrise' | 'alarm' | 'waking'>('dark');

  useEffect(() => {
    // Stage 1: Dark screen with nature sounds
    const timer1 = setTimeout(() => {
      soundManager.playBirdChirp();
      setStage('sunrise');
    }, 2500);

    // Stage 2: Sunrise & Alarm clock ringing
    const timer2 = setTimeout(() => {
      soundManager.playAlarm();
      setStage('alarm');
    }, 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleTurnOffAlarm = () => {
    soundManager.playClick();
    soundManager.playFanfare();
    setStage('waking');
    setTimeout(() => {
      onFinishIntro();
    }, 3000);
  };

  return (
    <div className="fixed inset-[#0] z-50 bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {stage === 'dark' && (
          <motion.div
            key="dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center p-6 text-slate-300"
          >
            <Wind className="w-12 h-12 mb-4 animate-pulse text-cyan-400" />
            <p className="text-xl font-light tracking-wide text-cyan-100/90 mb-2">
              Тихий утренний ветерок... Шелест листьев...
            </p>
            <p className="text-sm text-slate-400">Слышны первые пения птиц за окном</p>
          </motion.div>
        )}

        {stage === 'sunrise' && (
          <motion.div
            key="sunrise"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center p-6 text-amber-100"
          >
            <div className="relative mb-6">
              <Sun className="w-20 h-20 text-amber-400 animate-spin-slow drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]" />
              <Sparkles className="w-8 h-8 text-amber-200 absolute -top-2 -right-2 animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight text-amber-300">
              Новый светлый день наступает...
            </h2>
            <p className="text-base text-amber-100/80 max-w-md">
              Первые солнечные лучи освещают уютную комнату.
            </p>
          </motion.div>
        )}

        {stage === 'alarm' && (
          <motion.div
            key="alarm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center p-8 bg-slate-900/90 backdrop-blur-xl border border-amber-400/30 rounded-3xl shadow-2xl max-w-sm"
          >
            <div className="w-20 h-20 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6 border border-amber-400/40 animate-pulse">
              <Bell className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Дзинь-дзинь! ⏰</h3>
            <p className="text-sm text-slate-300 mb-6">
              Будильник медленно звонит. Пора вставать и начинать день с благословением!
            </p>
            <button
              onClick={handleTurnOffAlarm}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-900/40 border border-emerald-300/40 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Выключить будильник
            </button>
          </motion.div>
        )}

        {stage === 'waking' && (
          <motion.div
            key="waking"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center p-6 text-white"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-emerald-300 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-300 mb-2">
              Доброе утро!
            </h3>
            <p className="text-base text-slate-300 max-w-xs">
              Герой потягивается, улыбается и встает с кровати...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
