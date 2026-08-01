import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../services/soundManager';
import { MessageSquare, Heart, Sparkles, X, CheckCircle, Smile } from 'lucide-react';
import { NPCData } from '../3d/NPCModel';

interface DialogueModalProps {
  npc: NPCData;
  onClose: () => void;
  onRewardExp: (exp: number) => void;
  onRewardCoins: (coins: number) => void;
  onOpenSchool?: () => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
  npc,
  onClose,
  onRewardExp,
  onRewardCoins,
  onOpenSchool,
}) => {
  const [dialogueStep, setDialogueStep] = useState(0);

  const getDialogueContent = () => {
    if (npc.id === 'friend_yusuf') {
      return {
        greeting: 'Ассаляму алейкум, дорогой друг! Как твои дела?',
        options: [
          {
            text: 'Ваалейкум ассалям, Юсуф! Все отлично! Учим вместе суру?',
            action: () => {
              soundManager.playFanfare();
              onRewardExp(20);
              setDialogueStep(1);
            },
          },
          {
            text: 'Пойдешь со мной на соборный намаз в Мечеть?',
            action: () => {
              soundManager.playCoin();
              onRewardCoins(25);
              setDialogueStep(2);
            },
          },
        ],
        step1: 'Субханаллах! Аль-Ихлас — одна из лучших сур! Посланник Аллаха (ﷺ) сказал, что она равна трети Корана!',
        step2: 'С удовольствием! Намаз в коллективе превосходит одиночную молитву в 27 раз!',
      };
    }

    if (npc.id === 'teacher') {
      return {
        greeting: 'Ассаляму алейкум! Рад видеть тебя в нашей любимой школе!',
        options: [
          {
            text: 'Учитель Ахмад, давайте начнем урок прямо сейчас!',
            action: () => {
              onClose();
              if (onOpenSchool) onOpenSchool();
            },
          },
          {
            text: 'Учитель, подскажите мудрый совет для жизни.',
            action: () => {
              soundManager.playFanfare();
              onRewardExp(30);
              setDialogueStep(1);
            },
          },
        ],
        step1: 'Ищите знания от колыбели до могилы, и всегда совершайте добрые дела искренне ради Всевышнего!',
        step2: '',
      };
    }

    if (npc.id === 'dad') {
      return {
        greeting: 'Ассаляму алейкум, сын мой! Как твои успехи в обучении и чтении Корана?',
        options: [
          {
            text: 'Ваалейкум ассалям, папа! Я выучил новые суры и помогаю маме!',
            action: () => {
              soundManager.playFanfare();
              onRewardExp(30);
              setDialogueStep(1);
            },
          },
          {
            text: 'Папа, пойдем вместе в Мечеть на пятничный намаз?',
            action: () => {
              soundManager.playCoin();
              onRewardCoins(35);
              setDialogueStep(2);
            },
          },
        ],
        step1: 'МашаАллах! Горжусь тобой! Всевышний любящих детей всегда вознаграждает благом!',
        step2: 'Отличная идея! Совершим омовение и пойдем первыми в мечеть!',
      };
    }

    if (npc.id === 'brother') {
      return {
        greeting: 'Привет, братишка! Поиграешь со мной или поучим суры вместе?',
        options: [
          {
            text: 'Давай поучим суру Аль-Ихлас и повторим алфавит!',
            action: () => {
              soundManager.playFanfare();
              onRewardExp(20);
              setDialogueStep(1);
            },
          },
          {
            text: 'Держи 10 монет на сладости в магазине!',
            action: () => {
              soundManager.playCoin();
              onRewardCoins(-10);
              onRewardExp(25);
              setDialogueStep(2);
            },
          },
        ],
        step1: 'Ура! Я знаю "Къуль хува Ллаху ахад"! Ты лучший старший брат!',
        step2: 'Спасибо огромное! Ты такой добрый! Пусть Аллах тебя наградит!',
      };
    }

    if (npc.id === 'sister') {
      return {
        greeting: 'Ассаляму алейкум! Ты видела, какую красивую картинку с мечетью я нарисовала?',
        options: [
          {
            text: 'Ваалейкум ассалям! Очень красиво! МашаАллах!',
            action: () => {
              soundManager.playFanfare();
              onRewardExp(15);
              setDialogueStep(1);
            },
          },
          {
            text: 'Помочь тебе собрать портфель в школу?',
            action: () => {
              soundManager.playCoin();
              onRewardCoins(20);
              setDialogueStep(2);
            },
          },
        ],
        step1: 'Спасибо! Я старалась аккуратно раскрасить купол и минареты!',
        step2: 'Да, пожалуйста! Мои тетради и учебник по Адабу на столе!',
      };
    }

    if (npc.id === 'mom') {
      return {
        greeting: 'Здравствуй, мой дорогой! Ты поел вкусный завтрак?',
        options: [
          {
            text: 'Да, мама! Спасибо тебе большое за заботу!',
            action: () => {
              soundManager.playFanfare();
              onRewardExp(25);
              setDialogueStep(1);
            },
          },
          {
            text: 'Чем я могу помочь тебе по дому?',
            action: () => {
              soundManager.playCoin();
              onRewardCoins(30);
              setDialogueStep(2);
            },
          },
        ],
        step1: 'Пусть Аллах благословит тебя, сынок! Довольство родителей — это путь к Раю!',
        step2: 'Помоги убрать за собой посуду и вымой руки перед следующей молитвой!',
      };
    }

    if (npc.id === 'grandpa') {
      return {
        greeting: 'Ассаляму алейкум, внучек! Альхамдулиллях, день сегодня прекрасный!',
        options: [
          {
            text: 'Дедушка Ибрагим, подсказать хадис о доброте?',
            action: () => {
              soundManager.playFanfare();
              onRewardExp(35);
              setDialogueStep(1);
            },
          },
          {
            text: 'Давай я помогу тебе донести тяжелости!',
            action: () => {
              soundManager.playCoin();
              onRewardCoins(40);
              setDialogueStep(2);
            },
          },
        ],
        step1: 'Пророк (ﷺ) сказал: "Тот, кто не милосерден к людям, к тому не будет милосерден Аллах". Запомни эти слова!',
        step2: 'Баркаллаху фик! Какой ты воспитаный и добрый мальчик!',
      };
    }

    // Default NPC
    return {
      greeting: `Ассаляму алейкум! Я ${npc.name}. Рад(а) приветствовать тебя на улицах нашего города!`,
      options: [
        {
          text: 'Ваалейкум ассалям! Хорошего тебе дня!',
          action: () => {
            soundManager.playClick();
            onClose();
          },
        },
      ],
      step1: '',
      step2: '',
    };
  };

  const content = getDialogueContent();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* NPC Header */}
        <div className="flex items-center gap-4 mb-5 border-b border-slate-800 pb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 border-emerald-400/50"
            style={{ backgroundColor: npc.outfitColor || '#2e7d32' }}
          >
            {npc.type === 'cat' ? '🐱' : npc.type === 'dog' ? '🐶' : '🧑‍💼'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {npc.name}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                {npc.role}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Диалог и дружеское общение</p>
          </div>
        </div>

        {/* Speech Bubble */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 mb-5 text-sm leading-relaxed text-emerald-100 shadow-inner">
          {dialogueStep === 0 && content.greeting}
          {dialogueStep === 1 && content.step1}
          {dialogueStep === 2 && content.step2}
        </div>

        {/* Options */}
        {dialogueStep === 0 ? (
          <div className="space-y-2">
            {content.options.map((opt, i) => (
              <button
                key={i}
                onClick={opt.action}
                className="w-full p-3.5 rounded-xl bg-slate-800 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-500 text-slate-100 font-semibold text-xs text-left transition transform hover:scale-[1.01] cursor-pointer flex items-center justify-between group"
              >
                <span>{opt.text}</span>
                <Sparkles className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition cursor-pointer"
          >
            Попрощаться ("Маа саляма!")
          </button>
        )}
      </motion.div>
    </div>
  );
};
