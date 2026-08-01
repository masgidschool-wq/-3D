import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HeartHandshake, X, Sparkles, Check } from 'lucide-react';
import { soundManager } from '../../services/soundManager';

interface DuaItem {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

const duasList: DuaItem[] = [
  {
    id: 'morning',
    title: 'Утреннее моление (Дуа при пробуждении)',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur.',
    translation: 'Хвала Аллаху, Который оживил нас после того, как умертвил нас (усыпил), и к Нему предстоит возвращение!',
  },
  {
    id: 'mosque_enter',
    title: 'Дуа при входе в мечеть',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allahummaf-tah li abwaba rahmatik.',
    translation: 'О Аллах! Открой для меня врата Твоей милости!',
  },
  {
    id: 'parents',
    title: 'Молитва (Дуа) за родителей',
    arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbi irhamhuma kama rabbayani saghira.',
    translation: 'Господи! Помилуй их (моих родителей), ведь они воспитали меня, когда я был маленьким!',
  },
  {
    id: 'study',
    title: 'Дуа для прибавления знаний в учебе',
    arabic: 'رَّبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidni \'ilma.',
    translation: 'Господи мой! Прибавь мне знаний!',
  },
];

interface DuaModalProps {
  onClose: () => void;
  onRewardExp: (exp: number) => void;
}

export const DuaModal: React.FC<DuaModalProps> = ({ onClose, onRewardExp }) => {
  const [readIds, setReadIds] = useState<string[]>([]);

  const handleRead = (id: string) => {
    soundManager.playFanfare();
    if (!readIds.includes(id)) {
      setReadIds((prev) => [...prev, id]);
      onRewardExp(20);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl text-white relative max-h-[85vh] flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Книга Повседневных Дуа</h2>
            <p className="text-xs text-emerald-300">Благословенные моления на каждый день</p>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {duasList.map((dua) => {
            const isDone = readIds.includes(dua.id);
            return (
              <div
                key={dua.id}
                className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-emerald-300 text-sm">{dua.title}</h3>
                  <button
                    onClick={() => handleRead(dua.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isDone ? 'Прочитано (+20 EXP)' : 'Прочитать Дуа'}</span>
                  </button>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-right">
                  <p className="text-xl font-serif text-emerald-200" dir="rtl">
                    {dua.arabic}
                  </p>
                </div>

                <p className="text-xs italic text-slate-300">{dua.transliteration}</p>
                <p className="text-xs font-sans text-slate-200">{dua.translation}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
