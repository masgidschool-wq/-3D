import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../services/soundManager';
import { Compass, Sparkles, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface PrayerCinematicModalProps {
  onComplete: () => void;
  onClose: () => void;
}

const prayerSteps = [
  {
    id: 'niyyah',
    title: '1. Намерение (Ният)',
    arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ',
    transliteration: 'Навайту ан усаллийа...',
    desc: 'Искреннее намерение совершить молитву ради Всевышнего Аллаха.',
    btnText: 'Сделать Намерение',
  },
  {
    id: 'takbir',
    title: '2. Такбиратуль-Ихрам',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Алла́ху Акбар!',
    desc: 'Поднятие рук на уровень ушей (мальчики) или плеч (девочки) со словами "Аллаху Акбар".',
    btnText: 'Произнести Такбир',
  },
  {
    id: 'qiyam',
    title: '3. Стояние (Киям) & Сура Аль-Фатиха',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ...',
    transliteration: 'Бисмилляхир-Рахманир-Рахим. Альхамдулилляхи Раббиль-’алямин...',
    desc: 'Складывание рук на груди и неторопливое чтение суры Аль-Фатиха.',
    btnText: 'Прочитать Суру Аль-Фатиха',
  },
  {
    id: 'ruku',
    title: '4. Поясной поклон (Руку)',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    transliteration: 'Субха́на Раббияль-’Азы́м (3 раза)',
    desc: 'Наклон с прямой спиной, опираясь ладонями на колени. "Пречист мой Великий Господь!"',
    btnText: 'Совершить Поясной Поклон',
  },
  {
    id: 'sujud',
    title: '5. Земной поклон (Суджуд)',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    transliteration: 'Субха́на Раббияль-А’ля́ (3 раза)',
    desc: 'Касание коврика лбом, носом, ладонями и коленями. "Пречист мой Всевышний Господь!"',
    btnText: 'Совершить Земной Поклон',
  },
  {
    id: 'tashahhud',
    title: '6. Ташаххуд (Аттахийят)',
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ',
    transliteration: 'Ат-тахийя́ту лилля́хи вас-салява́ту ват-таййиба́т...',
    desc: 'Сидение на левой ноге, чтение засвидетельствования веры и благословения Пророка (ﷺ).',
    btnText: 'Прочитать Ташаххуд',
  },
  {
    id: 'taslim',
    title: '7. Приветствие (Таслим)',
    arabic: 'السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    transliteration: 'Ас-саля́му ‘аляйкум ва рахмату-лла́х',
    desc: 'Поворот головы вправо, затем влево с передачей мира всем ангелам и людям.',
    btnText: 'Завершить Молитву',
  },
];

export const PrayerCinematicModal: React.FC<PrayerCinematicModalProps> = ({ onComplete, onClose }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const handleNextStep = () => {
    soundManager.playClick();
    if (stepIdx + 1 < prayerSteps.length) {
      setStepIdx(stepIdx + 1);
    } else {
      soundManager.playFanfare();
      setIsDone(true);
    }
  };

  const currentStep = prayerSteps[stepIdx];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl text-white relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isDone ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Интерактивный Намаз</h2>
                <p className="text-xs text-emerald-300">
                  Шаг {stepIdx + 1} из {prayerSteps.length}: {currentStep.title}
                </p>
              </div>
            </div>

            {/* Step Card */}
            <div className="bg-slate-800/90 border border-emerald-500/30 rounded-2xl p-5 mb-6 text-center space-y-3 shadow-inner">
              <span className="text-2xl font-serif text-emerald-300 block">{currentStep.arabic}</span>
              <p className="text-xs font-bold text-amber-300 italic">{currentStep.transliteration}</p>
              <p className="text-xs text-slate-200 leading-relaxed">{currentStep.desc}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 mb-6 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                style={{ width: `${((stepIdx + 1) / prayerSteps.length) * 100}%` }}
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleNextStep}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-2xl shadow-xl border border-emerald-300/30 transition transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{currentStep.btnText}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-300">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">Намаз успешно совершен!</h2>
            <p className="text-sm text-slate-300 mb-6">
              Пусть Всевышний примет вашу искреннюю молитву! Сердце наполняется светлым умиротворением. (+50 Монет, +100 Опыта, Настроение: 100%)
            </p>
            <button
              onClick={onComplete}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-2xl shadow-xl border border-emerald-300/30 transition transform hover:scale-105 cursor-pointer"
            >
              Завершить
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
