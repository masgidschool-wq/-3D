import React, { useState } from 'react';
import { PlayerStats, DailyTask, TimeOfDay, Weather, Season } from '../../types/game';
import { soundManager } from '../../services/soundManager';
import {
  Heart,
  Smile,
  Star,
  Coins,
  Clock,
  Calendar,
  Sun,
  CloudRain,
  Snowflake,
  ShoppingBag,
  Trophy,
  Package,
  Bike,
  Volume2,
  VolumeX,
  CheckCircle2,
  Circle,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Brain,
  User,
  RotateCcw,
  RotateCw,
  LogOut,
  Car,
  Zap,
} from 'lucide-react';

interface HUDProps {
  stats: PlayerStats;
  dailyTasks: DailyTask[];
  timeHour: number;
  timeOfDay: TimeOfDay;
  weather: Weather;
  season: Season;
  dayCount: number;
  isRidingBike: boolean;
  isRidingCar?: boolean;
  onToggleBike: () => void;
  onToggleCar?: () => void;
  onOpenInventory: () => void;
  onOpenShop: () => void;
  onOpenAchievements: () => void;
  onOpenCustomizer: () => void;
  onOpenSettings: () => void;
  onRotateCamLeft: () => void;
  onRotateCamRight: () => void;
  onPitchCamUp?: () => void;
  onPitchCamDown?: () => void;
  onOpenSmartphone?: () => void;
  onExitGame: () => void;
  onMoveInput: (dx: number, dz: number) => void;
  onTeleportHouse?: () => void;
  onTeleportMosque?: () => void;
  onTeleportGrocery?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  dailyTasks,
  timeHour,
  weather,
  season,
  dayCount,
  isRidingBike,
  isRidingCar,
  onToggleBike,
  onToggleCar,
  onOpenInventory,
  onOpenShop,
  onOpenAchievements,
  onOpenCustomizer,
  onOpenSettings,
  onRotateCamLeft,
  onRotateCamRight,
  onPitchCamUp,
  onPitchCamDown,
  onOpenSmartphone,
  onExitGame,
  onMoveInput,
  onTeleportHouse,
  onTeleportMosque,
  onTeleportGrocery,
}) => {
  const [isTasksOpen, setIsTasksOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);

  const formattedHour = `${Math.floor(timeHour).toString().padStart(2, '0')}:00`;
  const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  const currentDayName = daysOfWeek[(dayCount - 1) % 7];

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const completedCount = dailyTasks.filter((t) => t.completed).length;

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 md:p-5 z-20 font-sans">
      {/* TOP STATUS BAR */}
      <div className="flex flex-wrap items-start justify-between gap-3 w-full">
        {/* Left Stats Cards */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 pointer-events-auto">
          {/* Health & Mood */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-2xl flex items-center gap-3 shadow-xl">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs md:text-sm">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
              <span>{stats.health}</span>
            </div>
            <div className="w-[1px] h-4 bg-slate-700" />
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs md:text-sm">
              <Smile className="w-4 h-4 text-amber-400" />
              <span>{stats.mood}</span>
            </div>
            <div className="w-[1px] h-4 bg-slate-700" />
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs md:text-sm">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span>{stats.intelligence}</span>
            </div>
          </div>

          {/* Level & Coins */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-2xl flex items-center gap-3 shadow-xl">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs md:text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Ур. {stats.level}</span>
            </div>
            <div className="w-[1px] h-4 bg-slate-700" />
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs md:text-sm">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>{stats.coins}</span>
            </div>
          </div>
        </div>

        {/* Right Clock & Weather & GPS Widget */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* GPS Navigator Bar */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-xl text-white text-xs">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">📍 Навигатор:</span>
            {onTeleportHouse && (
              <button
                onClick={onTeleportHouse}
                className="px-2 py-0.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-bold text-[11px] transition cursor-pointer border border-emerald-500/40"
              >
                🏡 Дом
              </button>
            )}
            {onTeleportMosque && (
              <button
                onClick={onTeleportMosque}
                className="px-2 py-0.5 rounded-lg bg-teal-950 hover:bg-teal-900 text-teal-300 font-bold text-[11px] transition cursor-pointer border border-teal-500/40"
              >
                🕌 Мечеть
              </button>
            )}
            {onTeleportGrocery && (
              <button
                onClick={onTeleportGrocery}
                className="px-2 py-0.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 font-bold text-[11px] transition cursor-pointer border border-amber-500/40"
              >
                🛒 Магазин
              </button>
            )}
            <div className="w-[1px] h-3 bg-emerald-800/60 my-auto mx-0.5" />
            <span className="bg-emerald-900/80 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-400/30">
              💬 [Пробел] Говорить
            </span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-2xl flex items-center gap-3 shadow-xl text-white text-xs md:text-sm">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Clock className="w-4 h-4" />
              <span>{formattedHour}</span>
            </div>
            <div className="w-[1px] h-4 bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>{currentDayName}</span>
            </div>
            <div className="w-[1px] h-4 bg-slate-700" />
            <div className="text-amber-400">
              {weather === 'RAIN' ? (
                <CloudRain className="w-4 h-4 text-blue-400" />
              ) : weather === 'SNOW' ? (
                <Snowflake className="w-4 h-4 text-cyan-200" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </div>
          </div>

          {/* Action Toolbar Buttons */}
          <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 p-1 rounded-2xl shadow-xl">
            {/* Quick Location Entrance Shortcuts */}
            {onTeleportHouse && (
              <button
                onClick={onTeleportHouse}
                title="Войти в Дом"
                className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <span>🏡</span>
                <span className="hidden sm:inline">Дом</span>
              </button>
            )}
            {onTeleportMosque && (
              <button
                onClick={onTeleportMosque}
                title="Войти в Мечеть"
                className="px-2.5 py-1.5 rounded-xl bg-teal-950/80 hover:bg-teal-900 border border-teal-500/40 text-teal-300 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <span>🕌</span>
                <span className="hidden sm:inline">Мечеть</span>
              </button>
            )}
            {onTeleportGrocery && (
              <button
                onClick={onTeleportGrocery}
                title="Продуктовый Магазин"
                className="px-2.5 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <span>🛒</span>
                <span className="hidden sm:inline">Продукты</span>
              </button>
            )}

            <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
            {/* Rotate & Tilt Camera */}
            <button
              onClick={onRotateCamLeft}
              title="Вращать камеру влево (Q)"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={onRotateCamRight}
              title="Вращать камеру вправо (E)"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            >
              <RotateCw className="w-4 h-4 text-cyan-400" />
            </button>

            {onPitchCamUp && (
              <button
                onClick={onPitchCamUp}
                title="Поднять камеру вверх"
                className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                ▲
              </button>
            )}
            {onPitchCamDown && (
              <button
                onClick={onPitchCamDown}
                title="Опустить камеру вниз"
                className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                ▼
              </button>
            )}

            {/* Smartphone Button */}
            {onOpenSmartphone && (
              <button
                onClick={onOpenSmartphone}
                title="Открыть личный Телефон"
                className="px-2.5 py-1.5 rounded-xl bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <span>📱</span>
                <span className="hidden md:inline">Телефон</span>
              </button>
            )}

            <button
              onClick={onOpenInventory}
              title="Инвентарь"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            >
              <Package className="w-4 h-4 text-blue-400" />
            </button>
            <button
              onClick={onOpenCustomizer}
              title="Редактор персонажа"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            >
              <User className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={onOpenShop}
              title="Магазин"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={onOpenAchievements}
              title="Достижения"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={onToggleBike}
              title="Велосипед"
              className={`p-2 rounded-xl transition cursor-pointer ${
                isRidingBike
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Bike className="w-4 h-4" />
            </button>
            {onToggleCar && (
              <button
                onClick={onToggleCar}
                title="Машина"
                className={`p-2 rounded-xl transition cursor-pointer ${
                  isRidingCar
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <Car className="w-4 h-4 text-blue-300" />
              </button>
            )}
            <button
              onClick={toggleSound}
              title="Звук"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={onExitGame}
              title="Выйти в меню"
              className="p-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 transition cursor-pointer border border-rose-800/60"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
            </button>
          </div>
        </div>
      </div>

      {/* MIDDLE LEFT: DAILY TASKS CHECKLIST */}
      <div className="pointer-events-auto self-start mt-2 max-w-xs w-full">
        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 shadow-2xl text-white">
          <div
            onClick={() => setIsTasksOpen(!isTasksOpen)}
            className="flex items-center justify-between cursor-pointer pb-2 border-b border-slate-800"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs md:text-sm tracking-wide text-white">
                Список дел ({completedCount}/{dailyTasks.length})
              </span>
            </div>
            <button className="text-slate-400 hover:text-white transition">
              {isTasksOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {isTasksOpen && (
            <div className="mt-2.5 space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {dailyTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-2 p-1.5 rounded-xl text-xs transition ${
                    task.completed ? 'bg-emerald-950/40 border border-emerald-800/50 text-emerald-200' : 'bg-slate-800/50 text-slate-200'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-semibold ${task.completed ? 'line-through text-emerald-400/80' : 'text-slate-100'}`}>
                      {task.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{task.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE / ON-SCREEN TOUCH CONTROLS (DPAD / JOYSTICK) */}
      <div className="pointer-events-auto self-start bottom-4 left-4 md:hidden flex flex-col gap-1.5 bg-slate-900/60 backdrop-blur-md p-2 rounded-2xl border border-white/10">
        <div className="flex justify-center">
          <button
            onTouchStart={() => onMoveInput(0, -1)}
            onTouchEnd={() => onMoveInput(0, 0)}
            className="w-12 h-12 rounded-xl bg-slate-800 active:bg-emerald-600 text-white font-bold flex items-center justify-center text-lg shadow"
          >
            ▲
          </button>
        </div>
        <div className="flex gap-1.5">
          <button
            onTouchStart={() => onMoveInput(-1, 0)}
            onTouchEnd={() => onMoveInput(0, 0)}
            className="w-12 h-12 rounded-xl bg-slate-800 active:bg-emerald-600 text-white font-bold flex items-center justify-center text-lg shadow"
          >
            ◄
          </button>
          <button
            onTouchStart={() => onMoveInput(0, 1)}
            onTouchEnd={() => onMoveInput(0, 0)}
            className="w-12 h-12 rounded-xl bg-slate-800 active:bg-emerald-600 text-white font-bold flex items-center justify-center text-lg shadow"
          >
            ▼
          </button>
          <button
            onTouchStart={() => onMoveInput(1, 0)}
            onTouchEnd={() => onMoveInput(0, 0)}
            className="w-12 h-12 rounded-xl bg-slate-800 active:bg-emerald-600 text-white font-bold flex items-center justify-center text-lg shadow"
          >
            ►
          </button>
        </div>
      </div>
    </div>
  );
};
