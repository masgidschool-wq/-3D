import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../services/soundManager';
import { GraduationCap, BookOpen, Brain, Sparkles, Check, X, Award, ChevronRight } from 'lucide-react';

interface SchoolMinigameModalProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

const classroomLessons = [
  {
    id: 1,
    subject: 'Урок Корана & Таджвида',
    teacherSpeech: 'Сегодня мы изучаем великую суру Аль-Ихлас. Она учит нас искреннему единобожию (Таухид). В ней говорится: "Скажи: Он — Аллах Единый!".',
    question: 'Сколько Корана заменяет сура Аль-Ихлас по своей награде?',
    options: ['Одну треть Корана (1/3)', 'Половину Корана (1/2)', 'Одну четверть (1/4)', 'Весь Коран'],
    answerIndex: 0,
    rewardText: 'Правильно! Пророк (ﷺ) сказал, что сура Аль-Ихлас равна 1/3 Корана.',
  },
  {
    id: 2,
    subject: 'Математика & Логика',
    teacherSpeech: 'Давайте решим интересную задачу! У вас было 15 фиников. Вы угостили 5 друзей по 2 финика каждого. Сколько фиников осталось у вас?',
    question: 'Сколько фиников у вас осталось?',
    options: ['3 финика', '5 фиников', '10 фиников', '7 фиников'],
    answerIndex: 1,
    rewardText: 'Верно! 5 х 2 = 10 фиников раздали. 15 - 10 = 5 фиников осталось!',
  },
  {
    id: 3,
    subject: 'Исламский Адаб (Этикет)',
    teacherSpeech: 'Посланник Аллаха (ﷺ) сказал: "Лучший из вас тот, кто обладая наилучшим нравственным характером". Всегда приветствуйте близких словами Ассаляму алейкум!',
    question: 'Что означает прекрасное приветствие "Ассаляму алейкум"?',
    options: ['Добрый день', 'Мир вам и благополучие от Аллаха', 'Приятно познакомиться', 'Счастливого пути'],
    answerIndex: 1,
    rewardText: 'Замечательно! Это пожелание мира и защиты Всевышнего.',
  },
];

export const SchoolMinigameModal: React.FC<SchoolMinigameModalProps> = ({ onComplete, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mode, setMode] = useState<'LESSON' | 'QUIZ'>('LESSON');
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const handleStartQuiz = () => {
    soundManager.playClick();
    setMode('QUIZ');
  };

  const handleSelectOption = (index: number) => {
    const isCorrect = index === classroomLessons[currentIdx].answerIndex;
    if (isCorrect) {
      soundManager.playCoin();
      setScore(score + 1);
    } else {
      soundManager.playClick();
    }

    if (currentIdx + 1 >= classroomLessons.length) {
      soundManager.playFanfare();
      setIsDone(true);
      setTimeout(() => {
        onComplete(score + (isCorrect ? 1 : 0));
      }, 2500);
    } else {
      setCurrentIdx(currentIdx + 1);
      setMode('LESSON');
    }
  };

  const currentL = classroomLessons[currentIdx];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl text-white relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
            <GraduationCap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Интерактивный класс в Школе</h2>
            <p className="text-xs text-indigo-300">Учитель Ахмад проводит урок. Внимательно слушайте!</p>
          </div>
        </div>

        {!isDone ? (
          <div>
            {mode === 'LESSON' ? (
              <div className="space-y-4">
                {/* Subject & Teacher Banner */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                    {currentL.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Урок {currentIdx + 1} из {classroomLessons.length}
                  </span>
                </div>

                {/* Teacher Speech Card */}
                <div className="bg-gradient-to-br from-indigo-950/80 to-slate-800 border border-indigo-500/30 rounded-2xl p-5 shadow-inner flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-2xl shrink-0 border-2 border-indigo-300 shadow">
                    👨‍🏫
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-indigo-200 mb-1">Учитель Ахмад говорит:</h4>
                    <p className="text-xs text-slate-100 leading-relaxed font-serif">"{currentL.teacherSpeech}"</p>
                  </div>
                </div>

                <button
                  onClick={handleStartQuiz}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl transition transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Ответить на вопрос учителя</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div>
                {/* Question Card */}
                <div className="bg-slate-800/80 border border-indigo-500/30 rounded-2xl p-5 mb-5 shadow-inner">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-2">
                    Вопрос по материалу:
                  </span>
                  <p className="text-sm font-semibold text-white leading-relaxed">{currentL.question}</p>
                </div>

                {/* Answer Options */}
                <div className="space-y-2.5">
                  {currentL.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      className="w-full p-3.5 rounded-xl bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500 text-slate-100 font-semibold text-xs text-left transition transform hover:scale-[1.01] cursor-pointer flex items-center justify-between"
                    >
                      <span>{opt}</span>
                      <Brain className="w-4 h-4 text-indigo-400/60" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <Award className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">Урок отлично завершен!</h3>
            <p className="text-xs text-slate-300 mb-4">
              Учитель Ахмад хвалит тебя за старание и знания! (+60 Монет, +100 Опыта, +15 Интеллекта 🧠)
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
