import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../services/soundManager';
import {
  Smartphone,
  X,
  BookOpen,
  MessageCircle,
  Compass,
  Car,
  Award,
  Sun,
  ShoppingBag,
  Send,
  User,
  MapPin,
  Clock,
  Sparkles,
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { PlayerStats, CharacterAppearance } from '../../types/game';

interface SmartphoneModalProps {
  stats: PlayerStats;
  appearance: CharacterAppearance;
  timeHour: number;
  dayCount: number;
  onClose: () => void;
  onTeleport: (location: 'HOME' | 'MOSQUE' | 'SCHOOL' | 'GROCERY' | 'PARK') => void;
}

export const SmartphoneModal: React.FC<SmartphoneModalProps> = ({
  stats,
  appearance,
  timeHour,
  dayCount,
  onClose,
  onTeleport,
}) => {
  const [activeApp, setActiveApp] = useState<'HOME' | 'QURAN' | 'MESSENGER' | 'TASKS' | 'PRAYER' | 'TAXI' | 'STATS'>('HOME');
  const [activeChat, setActiveChat] = useState<'yusuf' | 'maryam' | 'teacher' | 'mom'>('yusuf');
  const [messages, setMessages] = useState({
    yusuf: [
      { id: 1, sender: 'yusuf', text: 'Ассаляму алейкум! Пойдем вместе в мечеть на коллективный Намаз?', time: '12:00' },
      { id: 2, sender: 'me', text: 'Ваалейкум ассалям! Да, уже делаю омовение и иду!', time: '12:02' },
    ],
    maryam: [
      { id: 1, sender: 'maryam', text: 'Привет! Ты уже прочитал(а) суру Аль-Ихлас на сегодня?', time: '10:15' },
    ],
    teacher: [
      { id: 1, sender: 'teacher', text: 'Здравствуйте! Жду вас на уроке в школе. Класс готов к занятию!', time: '09:00' },
    ],
    mom: [
      { id: 1, sender: 'mom', text: 'Дорогой(ая), не забудь заглянуть в магазин за финиками и молоком!', time: '08:30' },
    ],
  });
  const [inputMsg, setInputMsg] = useState('');

  const formattedTime = `${Math.floor(timeHour).toString().padStart(2, '0')}:${Math.floor(
    (timeHour % 1) * 60
  )
    .toString()
    .padStart(2, '0')}`;

  const getSmartReply = (chat: string, userText: string): string => {
    const text = userText.toLowerCase();
    if (text.includes('как дела') || text.includes('салам') || text.includes('привет') || text.includes('ассалям')) {
      if (chat === 'yusuf') return 'Ваалейкум ассалям! Всё отлично, Альхамдулиллях! Жду тебя у мечети!';
      if (chat === 'maryam') return 'Ваалейкум ассалям! Настроение прекрасное! Учу новую суру из Корана!';
      if (chat === 'teacher') return 'Ваалейкум ассалям! Учеба идет отлично. Рад видеть твое стремление к знаниям!';
      if (chat === 'mom') return 'Ваалейкум ассалям, родной(ая)! Я как раз готовлю вкусный завтрак!';
    }
    if (text.includes('намаз') || text.includes('мечеть') || text.includes('молитва') || text.includes('пойдем') || text.includes('пошли')) {
      if (chat === 'yusuf') return 'Давай встречаться возле мечети! Имам как раз готовится к совместному намазу!';
      if (chat === 'maryam') return 'Альхамдулиллях! Не забудь совершить омовение Вуду перед молитвой!';
      if (chat === 'teacher') return 'Коллективный намаз с Имамом в мечети дает 27 раз больше награды!';
      if (chat === 'mom') return 'Пусть Аллах примет твои молитвы! Мы с папой тоже собираемся.';
    }
    if (text.includes('школа') || text.includes('урок') || text.includes('задание') || text.includes('поручение') || text.includes('домашка')) {
      if (chat === 'yusuf') return 'Я уже выучил урок! Можем сесть за одну парту и закрепить вместе!';
      if (chat === 'maryam') return 'В школе новые интересные книги и шкафы с пособиями! Увидимся в классе!';
      if (chat === 'teacher') return 'Всегда готовьтесь к урокам заранее. Жду всех учеников за партами!';
      if (chat === 'mom') return 'Учись прилежно! Знания — это свет и радость для семьи!';
    }
    if (text.includes('магазин') || text.includes('продукты') || text.includes('купи')) {
      if (chat === 'mom') return 'Купи, пожалуйста, свежее молоко, финики и хлеб у тети Амины в магазине!';
      if (chat === 'yusuf') return 'В магазине у тети Амины всегда самые вкусные финики и сладости!';
    }

    // Default dynamic warm replies
    if (chat === 'yusuf') return 'Отличная мысль! Совершай больше добрых дел и помни про омовение!';
    if (chat === 'maryam') return 'ДжазакаЛлаху хайран за теплое сообщение! Удачного и светлого тебе дня!';
    if (chat === 'teacher') return 'Молодец! Стремление к доброте и знаниям украшает человека!';
    return 'Спасибо за заботу! Пусть Всевышний дарует тебе баракат во всём!';
  };

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    soundManager.playClick();
    const currentInput = inputMsg;
    const newMsg = { id: Date.now(), sender: 'me', text: currentInput, time: formattedTime };
    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...prev[activeChat], newMsg],
    }));
    setInputMsg('');

    // Dynamic smart reply after 1 second
    setTimeout(() => {
      soundManager.playBell();
      const replyText = getSmartReply(activeChat, currentInput);
      setMessages((prev) => ({
        ...prev,
        [activeChat]: [
          ...prev[activeChat],
          { id: Date.now() + 1, sender: activeChat, text: replyText, time: formattedTime },
        ],
      }));
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* Top Floating Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-full shadow-2xl border border-red-300 flex items-center gap-2 cursor-pointer transition transform hover:scale-105"
      >
        <X className="w-5 h-5" />
        <span>Закрыть телефон</span>
      </button>

      {/* Outer Phone Shell */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="relative w-[340px] h-[640px] bg-slate-950 border-4 border-slate-700/80 rounded-[45px] shadow-2xl p-3 flex flex-col justify-between overflow-hidden ring-1 ring-emerald-500/30"
      >
        {/* Notch / Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/70 animate-pulse" />
        </div>

        {/* Status Bar */}
        <div className="pt-2 px-5 flex items-center justify-between text-[11px] font-bold text-slate-300 z-20">
          <span>{formattedTime}</span>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Sparkles className="w-3.0 h-3.0" />
            <span className="text-[10px] bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
              5G
            </span>
            <span>98%</span>
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 my-3 bg-gradient-to-b from-slate-900 to-slate-950 rounded-[32px] border border-slate-800 overflow-hidden relative flex flex-col">
          <AnimatePresence mode="wait">
            {/* HOME SCREEN */}
            {activeApp === 'HOME' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 p-4 flex flex-col justify-between overflow-y-auto"
              >
                {/* Header Widget */}
                <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/30 border border-emerald-500/30 rounded-2xl p-3.5 text-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> День {dayCount}
                    </span>
                    <span className="text-xs text-amber-300 font-bold">{stats.coins} 💰</span>
                  </div>
                  <h3 className="text-lg font-bold text-emerald-100">Ассаляму алейкум!</h3>
                  <p className="text-[11px] text-slate-300">
                    Намаз: <span className="text-emerald-300 font-bold">Зухр через 20 мин</span>
                  </p>
                </div>

                {/* App Grid */}
                <div className="grid grid-cols-3 gap-3 my-auto">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveApp('QURAN');
                    }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700/60 transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-200">Коран & Азкар</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveApp('MESSENGER');
                    }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700/60 transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-200">Чат</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveApp('TASKS');
                    }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700/60 transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-200">Поручения</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveApp('PRAYER');
                    }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700/60 transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-yellow-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                      <Compass className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-200">Намаз</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveApp('TAXI');
                    }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700/60 transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                      <Car className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-200">Такси</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveApp('STATS');
                    }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700/60 transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-200">Профиль</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* QURAN APP */}
            {activeApp === 'QURAN' && (
              <motion.div
                key="quran"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 p-3 flex flex-col text-white"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <h4 className="text-sm font-bold text-emerald-400">📖 Коран и Дуа</h4>
                  <button
                    onClick={() => setActiveApp('HOME')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-300"
                  >
                    Назад
                  </button>
                </div>

                <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Сура 1</span>
                    <h5 className="font-bold text-sm text-white">Аль-Фатиха (Открывающая)</h5>
                    <p className="text-[11px] text-slate-300 italic mt-1 font-serif">
                      "Бисмилляхир-Рахманир-Рахим..."
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Сура 112</span>
                    <h5 className="font-bold text-sm text-white">Аль-Ихлас (Очищение)</h5>
                    <p className="text-[11px] text-slate-300 italic mt-1 font-serif">
                      "Къуль хува Ллаху ахад..."
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl">
                    <span className="text-[10px] font-bold text-teal-400 uppercase">Ежедневный Азкар</span>
                    <h5 className="font-bold text-sm text-white">Дуа перед едой</h5>
                    <p className="text-[11px] text-slate-300 italic mt-1 font-serif">
                      "Бисмилляхи ва 'аля бакатиллях"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* MESSENGER APP */}
            {activeApp === 'MESSENGER' && (
              <motion.div
                key="msg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 p-3 flex flex-col text-white"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <h4 className="text-sm font-bold text-blue-400">💬 Чат с друзьями</h4>
                  <button
                    onClick={() => setActiveApp('HOME')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg text-slate-300"
                  >
                    Назад
                  </button>
                </div>

                {/* Contacts bar */}
                <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => setActiveChat('yusuf')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                      activeChat === 'yusuf'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    👦 Юсуф
                  </button>
                  <button
                    onClick={() => setActiveChat('maryam')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                      activeChat === 'maryam'
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    👧 Марьям
                  </button>
                  <button
                    onClick={() => setActiveChat('teacher')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                      activeChat === 'teacher'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    👨‍🏫 Учитель
                  </button>
                  <button
                    onClick={() => setActiveChat('mom')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                      activeChat === 'mom'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    👩 Мама
                  </button>
                </div>

                {/* Chat window */}
                <div className="flex-1 bg-slate-950/60 rounded-xl p-2.5 border border-slate-800 overflow-y-auto space-y-2 mb-2">
                  {messages[activeChat].map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col max-w-[85%] text-xs ${
                        m.sender === 'me'
                          ? 'ml-auto items-end text-right'
                          : 'mr-auto items-start text-left'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-2xl ${
                          m.sender === 'me'
                            ? 'bg-emerald-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-0.5 px-1">{m.time}</span>
                    </div>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Написать сообщение..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* TASKS / QUESTS APP */}
            {activeApp === 'TASKS' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 p-3 flex flex-col text-white"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <h4 className="text-sm font-bold text-amber-400">📋 Дневник Поручений</h4>
                  <button
                    onClick={() => setActiveApp('HOME')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg text-slate-300"
                  >
                    Назад
                  </button>
                </div>

                <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                  <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-amber-200">🏡 Утренняя уборка</h5>
                      <p className="text-[10px] text-slate-300">Заправить кровать & Открыть окно</p>
                      <span className="text-[9px] text-amber-400 font-bold">+20 XP | +30 💰</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-2 py-1 rounded-md border border-emerald-500/30">✓ Активно</span>
                  </div>

                  <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-cyan-200">💧 Чистота Вуду</h5>
                      <p className="text-[10px] text-slate-300">Совершить омовение в ванной</p>
                      <span className="text-[9px] text-cyan-400 font-bold">+30 XP | +40 💰</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-2 py-1 rounded-md border border-emerald-500/30">✓ Активно</span>
                  </div>

                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-emerald-200">🕌 Коллективный Намаз</h5>
                      <p className="text-[10px] text-slate-300">Совершить молитву с Имамом</p>
                      <span className="text-[9px] text-emerald-400 font-bold">+50 XP | +60 💰</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-2 py-1 rounded-md border border-emerald-500/30">✓ Активно</span>
                  </div>

                  <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-xl flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-indigo-200">📚 Урок в Школе №1</h5>
                      <p className="text-[10px] text-slate-300">Посетить занятие у Ахмеда</p>
                      <span className="text-[9px] text-indigo-400 font-bold">+60 XP | +70 💰</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-2 py-1 rounded-md border border-emerald-500/30">✓ Активно</span>
                  </div>

                  <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-rose-200">🛒 Продукты для мамы</h5>
                      <p className="text-[10px] text-slate-300">Купить финики у тети Амины</p>
                      <span className="text-[9px] text-rose-400 font-bold">+40 XP | +50 💰</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-2 py-1 rounded-md border border-emerald-500/30">✓ Активно</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAXI / TELEPORT APP */}
            {activeApp === 'TAXI' && (
              <motion.div
                key="taxi"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 p-3 flex flex-col text-white"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <h4 className="text-sm font-bold text-amber-400">🚕 Городское Такси</h4>
                  <button
                    onClick={() => setActiveApp('HOME')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg text-slate-300"
                  >
                    Назад
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 mb-3">
                  Быстро переместитесь в любое место города:
                </p>

                <div className="space-y-2 overflow-y-auto flex-1">
                  <button
                    onClick={() => {
                      onTeleport('HOME');
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl bg-slate-800 hover:bg-emerald-900/50 border border-slate-700 hover:border-emerald-500 flex items-center justify-between cursor-pointer transition text-left"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-white">🏡 Мой Дом</h5>
                      <p className="text-[10px] text-slate-400">Спальня, обед, отдых</p>
                    </div>
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </button>

                  <button
                    onClick={() => {
                      onTeleport('MOSQUE');
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl bg-slate-800 hover:bg-teal-900/50 border border-slate-700 hover:border-teal-500 flex items-center justify-between cursor-pointer transition text-left"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-white">🕌 Главная Мечеть</h5>
                      <p className="text-[10px] text-slate-400">Ковер для намаза, фонтан омовения</p>
                    </div>
                    <MapPin className="w-4 h-4 text-teal-400" />
                  </button>

                  <button
                    onClick={() => {
                      onTeleport('SCHOOL');
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl bg-slate-800 hover:bg-indigo-900/50 border border-slate-700 hover:border-indigo-500 flex items-center justify-between cursor-pointer transition text-left"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-white">🏫 Городская Школа</h5>
                      <p className="text-[10px] text-slate-400">Уроки Корана, математики и адаба</p>
                    </div>
                    <MapPin className="w-4 h-4 text-indigo-400" />
                  </button>

                  <button
                    onClick={() => {
                      onTeleport('GROCERY');
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl bg-slate-800 hover:bg-amber-900/50 border border-slate-700 hover:border-amber-500 flex items-center justify-between cursor-pointer transition text-left"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-white">🛒 Продуктовый магазин</h5>
                      <p className="text-[10px] text-slate-400">Финики, свежий хлеб, молоко</p>
                    </div>
                    <MapPin className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* PRAYER APP */}
            {activeApp === 'PRAYER' && (
              <motion.div
                key="pr"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 p-3 flex flex-col text-white"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <h4 className="text-sm font-bold text-amber-400">🕌 Расписание Намаза</h4>
                  <button
                    onClick={() => setActiveApp('HOME')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg text-slate-300"
                  >
                    Назад
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-800 border border-slate-700">
                    <span>Фаджр (Утро)</span>
                    <span className="font-bold text-emerald-400">05:00</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50">
                    <span className="font-bold text-emerald-200">Зухр (Полдень)</span>
                    <span className="font-bold text-emerald-400">12:30</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-800 border border-slate-700">
                    <span>Аср (Предвечерний)</span>
                    <span className="font-bold text-emerald-400">16:00</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-800 border border-slate-700">
                    <span>Магриб (Закат)</span>
                    <span className="font-bold text-emerald-400">18:30</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-800 border border-slate-700">
                    <span>Иша (Ночь)</span>
                    <span className="font-bold text-emerald-400">20:00</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STATS APP */}
            {activeApp === 'STATS' && (
              <motion.div
                key="st"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 p-3 flex flex-col text-white"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <h4 className="text-sm font-bold text-teal-400">👤 Профиль Героя</h4>
                  <button
                    onClick={() => setActiveApp('HOME')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg text-slate-300"
                  >
                    Назад
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <span className="text-slate-400">Имя:</span>
                    <p className="text-sm font-bold text-white">{appearance.name}</p>
                    <span className="text-slate-400">Уровень:</span>
                    <p className="text-sm font-bold text-amber-400">{stats.level} LVL</p>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <span className="text-slate-400">Монеты:</span>
                    <p className="text-sm font-bold text-amber-300">{stats.coins} 💰</p>
                    <span className="text-slate-400">Добрых дел совершено:</span>
                    <p className="text-sm font-bold text-emerald-400">{stats.goodDeedsCount}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Home Button Indicator */}
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveApp('HOME');
          }}
          className="mx-auto w-32 h-1 bg-slate-600 rounded-full hover:bg-slate-400 transition cursor-pointer mb-1"
        />
      </motion.div>
    </div>
  );
};
