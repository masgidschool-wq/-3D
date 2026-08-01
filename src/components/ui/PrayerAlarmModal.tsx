import React from 'react';
import { motion } from 'motion/react';
import { Bell, Droplets, Sparkles, Clock, X } from 'lucide-react';
import { soundManager } from '../../services/soundManager';

interface PrayerAlarmModalProps {
  prayerName: string;
  onGoWudu: () => void;
  onGoPrayer: () => void;
  onClose: () => void;
}

export const PrayerAlarmModal: React.FC<PrayerAlarmModalProps> = ({
  prayerName,
  onGoWudu,
  onGoPrayer,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-white text-center relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center text-emerald-400 mx-auto mb-4 animate-bounce">
          <Bell className="w-8 h-8" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Clock className="w-3.5 h-3.5" />
          Звонит Будильник Намаза
        </span>

        <h2 className="text-2xl font-bold text-white mb-2">
          Наступило время молитвы: <span className="text-emerald-400">{prayerName}</span>!
        </h2>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          «Молитва вовремя — самое любимое дело перед Всевышним». Пойдем совершим омовение (Вуду), а затем приступим к намазу!
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onGoWudu();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition transform hover:scale-[1.02]"
          >
            <Droplets className="w-5 h-5" />
            <span>1. Совершить омовение (Вуду)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onGoPrayer();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition transform hover:scale-[1.02]"
          >
            <Sparkles className="w-5 h-5" />
            <span>2. Перейти к Намазу</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
          >
            Совершить чуть позже
          </button>
        </div>
      </motion.div>
    </div>
  );
};
