import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, BookOpen, Volume2, Bookmark, Sparkles } from 'lucide-react';
import { BookChapter } from '../../types/game';
import { soundManager } from '../../services/soundManager';

const quranChapters: BookChapter[] = [
  {
    id: 'fatiha',
    title: 'Сура 1: Аль-Фатиха (Открывающая)',
    category: 'QURAN',
    arabicText: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ (1) الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (2) الرَّحْمَٰنِ الرَّحِيمِ (3) مَالِكِ يَوْمِ الدِّينِ (4) إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ (5) اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ (6) صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ (7)`,
    transliteration: `Bismillahir-Rahmanir-Rahim. Alhamdulillahi Rabbil-'alamin. Ar-Rahmanir-Rahim. Maliki Yawmid-Din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas-siratal-mustaqim. Siratalladhina an'amta 'alayhim ghayril-maghdubi 'alayhim wa lad-dallin.`,
    translation: `С именем Аллаха, Милостивого, Милосердного! Хвала Аллаху, Господу миров, Милостивому, Милосердному, Властителю Дня воздаяния! Тебе одному мы поклоняемся и Тебя одного молим о помощи. Веди нас прямым путем, путем тех, кого Ты облагодетельствовал, не тех, на кого пал гнев, и не заблудших.`,
  },
  {
    id: 'ikhlas',
    title: 'Сура 112: Аль-Ихляс (Очищение веры)',
    category: 'QURAN',
    arabicText: `قُلْ هُوَ اللَّهُ أَحَدٌ (1) اللَّهُ الصَّمَدُ (2) لَمْ يَلِدْ وَلَمْ يُولَدْ (3) وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ (4)`,
    transliteration: `Qul Huwallahu Ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakul-lahu kufuwan ahad.`,
    translation: `Скажи: «Он — Аллах Единый, Аллах Самодостаточный. Он не родил и не был рожден, и нет никого, равного Ему».`,
  },
  {
    id: 'falaq',
    title: 'Сура 113: Аль-Фаляк (Рассвет)',
    category: 'QURAN',
    arabicText: `قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (1) مِن شَرِّ مَا خَلَقَ (2) وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ (3) وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ (4) وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ (5)`,
    transliteration: `Qul a'udhu bi Rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad.`,
    translation: `Скажи: «Ищу защиты у Господа рассвета от зла того, что Он сотворил, от зла мрака, когда он наступает, от зла дующих на узлы и от зла завистника, когда он завидует».`,
  },
  {
    id: 'nas',
    title: 'Сура 114: Ан-Нас (Люди)',
    category: 'QURAN',
    arabicText: `قُلْ أَعُوذُ بِرَبِّ النَّاسِ (1) مَلِكِ النَّاسِ (2) إِلَٰهِ النَّاسِ (3) مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ (4) الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ (5) مِنَ الْجِنَّةِ وَالنَّاسِ (6)`,
    transliteration: `Qul a'udhu bi Rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.`,
    translation: `Скажи: «Ищу защиты у Господа людей, Царя людей, Бога людей, от зла искусителя исчезающего, который внушает зло в груди людей, от джиннов и людей».`,
  },
  {
    id: 'aytul_kursi',
    title: 'Аят аль-Курси (Великий Аят Престола)',
    category: 'QURAN',
    arabicText: `اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ`,
    transliteration: `Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta'khudhuhu sinatuw-wa la nawm. Lahu ma fis-samawati wa ma fil-ard...`,
    translation: `Аллах — нет божества, кроме Него, Живого, Поддерживающего жизнь. Им не овладевают ни дремота, ни сон. Ему принадлежит то, что на небесах, и то, что на земле. Кто станет заступаться перед Ним без Его позволения? Он знает их будущее и прошлое. Они постигают из Его знания только то, что Он пожелает. Его Престол объемлет небеса и землю, и Нему не тяжело оберегать их. Он — Возвышенный, Великий!`,
  },
  {
    id: 'dua_food',
    title: 'Дуа перед едой и после еды',
    category: 'DUA',
    arabicText: `بِسْمِ اللهِ (قبل الطعام) / الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ (بعد الطعام)`,
    transliteration: `Bismillah (перед едой) / Alhamdu lillahi-lladhi at'amana wa saqana wa ja'alana muslimin (после едой).`,
    translation: `С именем Аллаха! (перед едой). Хвала Аллаху, Который накормил нас, напоил нас и сделал нас мусульманами! (после еды).`,
  },
  {
    id: 'story_kindness',
    title: 'Доброта и Помощь Соседям (Рассказ для детей)',
    category: 'STORY',
    translation: `Пророк Мухаммад (мир ему и благословение) учил: «Не уверует ни один из вас до тех пор, пока не пожелает своему брату того же, чего желает самому себе». В нашем юном юношеском пути помощь старшим, доброта к животным и искренние улыбки являются великим служением Всевышнему.`,
  },
];

interface BookReaderModalProps {
  onClose: () => void;
  onRewardExp?: (exp: number) => void;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({ onClose, onRewardExp }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [memorizedSurahs, setMemorizedSurahs] = useState<Record<string, boolean>>({});
  const [repeatCount, setRepeatCount] = useState<number>(0);

  const currentChapter = quranChapters[currentIdx];

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx < quranChapters.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setRepeatCount(0);
      if (onRewardExp) onRewardExp(15);
    }
  };

  const handlePrev = () => {
    soundManager.playClick();
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setRepeatCount(0);
    }
  };

  const handlePracticeVerse = () => {
    soundManager.playBell();
    const nextCount = repeatCount + 1;
    setRepeatCount(nextCount);

    if (nextCount >= 3 && !memorizedSurahs[currentChapter.id]) {
      soundManager.playFanfare();
      setMemorizedSurahs((prev) => ({ ...prev, [currentChapter.id]: true }));
      if (onRewardExp) onRewardExp(50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-amber-50/95 text-slate-900 border-4 border-amber-800/40 rounded-3xl max-w-4xl w-full shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header Bar */}
        <div className="bg-amber-900/90 text-amber-100 px-6 py-4 flex items-center justify-between border-b-2 border-amber-700/60 shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-700/60 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-amber-100">Книга Мудрости и Священный Коран</h2>
              <p className="text-xs text-amber-300/80">
                Страница {currentIdx + 1} из {quranChapters.length}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-amber-200 hover:text-white hover:bg-amber-800/80 rounded-xl transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Pages Area */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 flex flex-col justify-between space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Category Badge & Title */}
              <div className="text-center border-b border-amber-300/60 pb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-800/10 border border-amber-800/20 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                  <Bookmark className="w-3.5 h-3.5" />
                  {currentChapter.category === 'QURAN'
                    ? 'Священное Откровение (Коран)'
                    : currentChapter.category === 'DUA'
                    ? 'Молитва (Дуа)'
                    : 'Поучительная История'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-950 mt-1">
                  {currentChapter.title}
                </h1>
              </div>

              {/* Arabic Script */}
              {currentChapter.arabicText && (
                <div className="bg-amber-100/70 p-6 rounded-2xl border border-amber-300/60 shadow-inner text-right leading-loose">
                  <p className="text-2xl sm:text-3xl font-serif text-emerald-950 font-semibold tracking-wide" dir="rtl">
                    {currentChapter.arabicText}
                  </p>
                </div>
              )}

              {/* Transliteration */}
              {currentChapter.transliteration && (
                <div className="bg-amber-200/40 p-4 rounded-xl border border-amber-300/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
                    Транслитерация (Чтение):
                  </span>
                  <p className="text-sm italic font-sans text-amber-950 leading-relaxed">
                    {currentChapter.transliteration}
                  </p>
                </div>
              )}

              {/* Russian Translation */}
              <div className="bg-white/80 p-5 rounded-2xl border border-amber-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                  Смысловой перевод и значение:
                </span>
                <p className="text-base font-serif text-slate-800 leading-relaxed">
                  {currentChapter.translation}
                </p>
              </div>

              {/* Interactive Memorization Mode */}
              {currentChapter.category === 'QURAN' && (
                <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-4 rounded-2xl border border-emerald-500/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-emerald-400 animate-pulse" />
                      <h4 className="font-bold text-sm text-emerald-200">Режим заучивания суры</h4>
                      {memorizedSurahs[currentChapter.id] && (
                        <span className="text-[10px] bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-full">
                          ✓ Выучено! +50 XP
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Повторите чтение вслух 3 раза, чтобы закрепить суру в памяти! (Повторов: {repeatCount}/3)
                    </p>
                  </div>

                  <button
                    onClick={handlePracticeVerse}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer shrink-0 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Прослушать & Повторить ({repeatCount}/3)</span>
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Page Navigation Controls */}
          <div className="flex items-center justify-between border-t border-amber-300/60 pt-4 shrink-0">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition cursor-pointer ${
                currentIdx === 0
                  ? 'opacity-40 cursor-not-allowed bg-amber-200 text-amber-700'
                  : 'bg-amber-800 hover:bg-amber-700 text-amber-100 shadow'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Предыдущая</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>+15 Очков Мудрости за чтение</span>
            </div>

            <button
              onClick={handleNext}
              disabled={currentIdx === quranChapters.length - 1}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition cursor-pointer ${
                currentIdx === quranChapters.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-amber-200 text-amber-700'
                  : 'bg-amber-800 hover:bg-amber-700 text-amber-100 shadow'
              }`}
            >
              <span>Следующая</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
