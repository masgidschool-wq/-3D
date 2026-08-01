import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../services/soundManager';
import { Droplets, Check, AlertCircle, Sparkles, X } from 'lucide-react';

interface WuduMinigameModalProps {
  onComplete: () => void;
  onClose: () => void;
}

const wuduSteps = [
  { id: 1, title: '1. Намерение и Бисмиллях', desc: 'Произнести про себя намерение (ниет) совершить омовение во имя Всевышнего.' },
  { id: 2, title: '2. Мытье кистей рук', desc: 'Тщательно вымыть кисти обеих рук до запястий 3 раза.' },
  { id: 3, title: '3. Полоскание рта', desc: 'Набрать немного воды в рот и прополоскать его 3 раза.' },
  { id: 4, title: '4. Промывание носа', desc: 'Набрать воды в нос и аккуратно очистить его 3 раза.' },
  { id: 5, title: '5. Мытье лица', desc: 'Вымыть все лицо от лба до подбородка 3 раза.' },
  { id: 6, title: '6. Мытье рук до локтей', desc: 'Вымыть правую, затем левую руку от кистей до локтей включительно 3 раза.' },
  { id: 7, title: '7. Протирание головы и ушей', desc: 'Провести влажными ладонями по голове и протереть уши 1 раз.' },
  { id: 8, title: '8. Мытье ног до щиколоток', desc: 'Тщательно вымыть правую, а затем левую ногу вместе со щиколотками 3 раза.' },
];

export const WuduMinigameModal: React.FC<WuduMinigameModalProps> = ({ onComplete, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  const handleNextStep = (stepId: number) => {
    if (stepId === wuduSteps[currentStepIndex].id) {
      soundManager.playWaterSplash();
      setErrorMessage('');
      if (currentStepIndex + 1 >= wuduSteps.length) {
        soundManager.playFanfare();
        setIsFinished(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    } else {
      soundManager.playClick();
      setErrorMessage('Попробуйте снова: следуйте правильному порядку шагов.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl text-white relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Droplets className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Совершение омовения</h2>
            <p className="text-xs text-cyan-300">Выполняйте шаги в правильной последовательности</p>
          </div>
        </div>

        {!isFinished ? (
          <div>
            {/* Current Active Step Banner */}
            <div className="bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 mb-6 shadow-inner">
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                Текущий шаг ({currentStepIndex + 1} из {wuduSteps.length})
              </p>
              <h3 className="text-lg font-bold text-white mb-1">{wuduSteps[currentStepIndex].title}</h3>
              <p className="text-xs text-slate-300">{wuduSteps[currentStepIndex].desc}</p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {wuduSteps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleNextStep(step.id)}
                    className={`p-3 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between cursor-pointer border ${
                      isCompleted
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 opacity-80'
                        : isCurrent
                        ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg scale-[1.02]'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="truncate">{step.title}</span>
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Droplets className="w-4 h-4 text-cyan-200 animate-bounce shrink-0" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">Омовение завершено!</h3>
            <p className="text-sm text-slate-300">
              Герой готов к совершению чистой и искренней молитвы. (+30 Монет, +50 Опыта)
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
