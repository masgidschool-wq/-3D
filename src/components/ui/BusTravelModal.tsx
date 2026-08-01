import React from 'react';
import { motion } from 'framer-motion';
import { Bus, MapPin, Sparkles, Navigation, Compass, X } from 'lucide-react';
import { soundManager } from '../../services/soundManager';

interface BusTravelModalProps {
  onClose: () => void;
  onSelectDestination: (destId: 'HOUSE' | 'MOSQUE' | 'SCHOOL' | 'GROCERY' | 'MECCA_HAJJ' | 'MECCA_CITY' | 'JEDDAH_COAST' | 'DESERT_HIGHWAY' | 'DESERT_OASIS') => void;
}

export const BusTravelModal: React.FC<BusTravelModalProps> = ({
  onClose,
  onSelectDestination,
}) => {
  const routes = [
    {
      id: 'MECCA_HAJJ' as const,
      title: '🕋 МЕККА: Масджид аль-Харам & Священная Кааба',
      desc: 'Главная мечеть мира: белый мрамор, высокая архитектура, обход Таваф, источник Зам-Зам и Макам Ибрахима.',
      color: 'from-amber-600 via-yellow-600 to-orange-700',
      badge: '✨ Священный Хадж / Умра',
      isSecret: true,
    },
    {
      id: 'MECCA_CITY' as const,
      title: '🏙️ МЕККА: Главный Город & Белоснежные Улицы',
      desc: 'Чистые просторные улицы, пальмы, современные отели, площади с фонтанами, паломники со всего мира.',
      color: 'from-amber-700 to-yellow-800',
      badge: '🇸🇦 Королевство Саудовская Аравия',
    },
    {
      id: 'JEDDAH_COAST' as const,
      title: '🌊 ДЖИДДА: Приморский Мегаполис на Красном Море',
      desc: 'Набережная Корниш, знаменитый Фонтан Короля Фахда, современная белоснежная архитектура, морской бриз.',
      color: 'from-cyan-600 to-blue-800',
      badge: '🌊 Красное Море',
    },
    {
      id: 'DESERT_HIGHWAY' as const,
      title: '🏜️ САУДОВСКАЯ ТРАССА: Скоростное Пустынное Шоссе',
      desc: 'Широкая современная магистраль среди золотых дюн, караваны верблюдов, автозаправка, оазисы и силуэты гор.',
      color: 'from-orange-600 to-amber-900',
      badge: '🛣️ Международная Магистраль',
    },
    {
      id: 'DESERT_OASIS' as const,
      title: '🌴 АЛЬ-АХСА & АЛЬ-УЛА: Пустынный Оазис и Финиковая Ферма',
      desc: 'Живописный оазис, пальмовые рощи, прохладный водоем, верблюды и традиционные светло-бежевые дома.',
      color: 'from-emerald-600 to-teal-800',
      badge: '🌴 Финиковый Оазис',
    },
    {
      id: 'HOUSE' as const,
      title: '🏡 РОДНОЙ ГОРОД: Уютный Квартал (Ваш Дом)',
      desc: 'Ваш родной район. Рядом находится ваш дом, школа, продуктовый магазин и соборная мечеть.',
      color: 'from-slate-700 to-slate-900',
      badge: '🏡 Жилой Квартал',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl p-6 text-white shadow-2xl overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-lg">
              <Bus className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-amber-300">Городской Автобус & Паломнический Экспресс</h3>
              <p className="text-xs text-slate-400">Выберите остановку или международный рейс</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {routes.map((r) => (
            <motion.div
              key={r.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                soundManager.playClick();
                onSelectDestination(r.id);
                onClose();
              }}
              className={`p-4 rounded-2xl bg-gradient-to-r ${r.color} border ${
                r.isSecret ? 'border-yellow-300 shadow-yellow-500/20 shadow-xl' : 'border-white/10'
              } cursor-pointer transition flex items-center justify-between group`}
            >
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-black/30 text-amber-200 border border-white/10">
                    {r.badge}
                  </span>
                  {r.isSecret && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 animate-bounce">
                      ✨ СВЯЩЕННЫЙ ХАДЖ
                    </span>
                  )}
                </div>
                <h4 className="text-base font-extrabold text-white group-hover:text-amber-200 transition">
                  {r.title}
                </h4>
                <p className="text-xs text-slate-200">{r.desc}</p>
              </div>

              <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition text-white">
                <Navigation className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Автобусы курсируют без задержек по всему городу</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer transition"
          >
            Закрыть
          </button>
        </div>
      </motion.div>
    </div>
  );
};
