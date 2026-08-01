import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Moon, Sparkles, BookOpen, HeartHandshake, X, Sun, Check } from 'lucide-react';
import { soundManager } from '../../services/soundManager';

interface HomeActionsModalProps {
  isFasting: boolean;
  energy: number;
  hunger: number;
  onEat: () => void;
  onSleep: () => void;
  onToggleFast: () => void;
  onReadBooks: () => void;
  onReadDuas: () => void;
  onClose: () => void;
}

export const HomeActionsModal: React.FC<HomeActionsModalProps> = ({
  isFasting,
  energy,
  hunger,
  onEat,
  onSleep,
  onToggleFast,
  onReadBooks,
  onReadDuas,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-white relative text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-1">Уютный Дом</h2>
        <p className="text-xs text-emerald-300 mb-6">Ваше место отдыха, учения и поклонения</p>

        {/* Status Bars */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 text-left">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">⚡ Энергия</span>
              <span className="text-emerald-400 font-bold">{energy}%</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${energy}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">🌙 Пост (Ураза)</span>
              <span className={isFasting ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                {isFasting ? 'Соблюдается' : 'Не активен'}
              </span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${isFasting ? 'bg-amber-400' : 'bg-slate-600'}`}
                style={{ width: isFasting ? '100%' : '0%' }}
              />
            </div>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Eat */}
          <button
            onClick={() => {
              soundManager.playClick();
              onEat();
            }}
            className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 transition text-left cursor-pointer flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-200">Покушать / Трапеза</h3>
              <p className="text-[11px] text-slate-300">Восстановить энергию и сытость</p>
            </div>
          </button>

          {/* Sleep */}
          <button
            onClick={() => {
              soundManager.playClick();
              onSleep();
            }}
            className="p-4 rounded-2xl bg-indigo-500/15 border border-indigo-500/40 hover:bg-indigo-500/25 transition text-left cursor-pointer flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-indigo-200">Лечь спать (Отдых)</h3>
              <p className="text-[11px] text-slate-300">Проснуться утром от будильника</p>
            </div>
          </button>

          {/* Fasting Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleFast();
            }}
            className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 transition text-left cursor-pointer flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-emerald-200">
                {isFasting ? 'Завершить пост (Ифтар)' : 'Начать Пост (Ураза)'}
              </h3>
              <p className="text-[11px] text-slate-300">Соблюдение поста от Сухура</p>
            </div>
          </button>

          {/* Read Quran & Books */}
          <button
            onClick={() => {
              soundManager.playClick();
              onReadBooks();
            }}
            className="p-4 rounded-2xl bg-teal-500/15 border border-teal-500/40 hover:bg-teal-500/25 transition text-left cursor-pointer flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-teal-200">Читать Священный Коран</h3>
              <p className="text-[11px] text-slate-300">Полный интерактивный ридер</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
