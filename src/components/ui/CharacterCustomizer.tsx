import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CharacterAppearance } from '../../types/game';
import { soundManager } from '../../services/soundManager';
import { CharacterPreviewCanvas } from '../3d/CharacterPreviewCanvas';
import {
  User,
  Sparkles,
  RotateCcw,
  RotateCw,
  Palette,
  Crown,
  Shirt,
  Footprints,
  Check,
  X,
  Wand2,
} from 'lucide-react';

interface CharacterCustomizerProps {
  initialAppearance: CharacterAppearance;
  onConfirm: (appearance: CharacterAppearance) => void;
  onClose?: () => void;
}

const skinColors = [
  { name: 'Светлый', hex: '#F5D0A9' },
  { name: 'Естественный', hex: '#E0AC69' },
  { name: 'Смуглый', hex: '#C68642' },
  { name: 'Загорелый', hex: '#8D5524' },
  { name: 'Темный', hex: '#523318' },
];

const eyeColors = [
  { name: 'Карий', hex: '#3E2723' },
  { name: 'Зеленый', hex: '#1B5E20' },
  { name: 'Синий', hex: '#1565C0' },
  { name: 'Темно-серый', hex: '#37474F' },
  { name: 'Янтарный', hex: '#E65100' },
];

const hairColors = [
  { name: 'Брюнет', hex: '#1A1A1A' },
  { name: 'Темно-каштановый', hex: '#3E2723' },
  { name: 'Шоколадный', hex: '#5D4037' },
  { name: 'Седой', hex: '#78909C' },
  { name: 'Русый', hex: '#8D6E63' },
];

const outfitColors = [
  { name: 'Изумрудный', hex: '#2E7D32' },
  { name: 'Сапфировый', hex: '#1976D2' },
  { name: 'Белоснежный', hex: '#FFFFFF' },
  { name: 'Рубиновый', hex: '#C62828' },
  { name: 'Янтарно-золотой', hex: '#F59E0B' },
  { name: 'Фиолетовый', hex: '#7B1FA2' },
  { name: 'Черный обсидиан', hex: '#212121' },
  { name: 'Бирюзовый', hex: '#00897B' },
  { name: 'Бордовый', hex: '#880E4F' },
  { name: 'Оливковый', hex: '#558B2F' },
  { name: 'Небесно-голубой', hex: '#0288D1' },
  { name: 'Песочный', hex: '#D7CCC8' },
];

const shoeColors = [
  { name: 'Белые', hex: '#ECEFF1' },
  { name: 'Черные', hex: '#263238' },
  { name: 'Коричневые', hex: '#4E342E' },
  { name: 'Красные', hex: '#D32F2F' },
  { name: 'Изумрудные', hex: '#1B5E20' },
];

const namePresets = ['Амир', 'Юсуф', 'Ибрагим', 'Закария', 'Аиша', 'Марьям', 'Сара', 'Халид'];

export const CharacterCustomizer: React.FC<CharacterCustomizerProps> = ({
  initialAppearance,
  onConfirm,
  onClose,
}) => {
  const [appearance, setAppearance] = useState<CharacterAppearance>(initialAppearance);
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'BODY' | 'HAT' | 'OUTFIT'>('IDENTITY');
  const [rotationY, setRotationY] = useState(0);

  const handleConfirm = () => {
    soundManager.playFanfare();
    onConfirm(appearance);
  };

  const rotateLeft = () => setRotationY((prev) => prev - Math.PI / 4);
  const rotateRight = () => setRotationY((prev) => prev + Math.PI / 4);

  const applyPreset = (preset: 'TRADITIONAL' | 'CASUAL' | 'SPORT' | 'MODEST') => {
    soundManager.playClick();
    if (preset === 'TRADITIONAL') {
      setAppearance((prev) => ({
        ...prev,
        outfitStyle: 'thobe',
        outfitColor: '#FFFFFF',
        hatStyle: 'kufi_white',
        shoesColor: '#4E342E',
      }));
    } else if (preset === 'CASUAL') {
      setAppearance((prev) => ({
        ...prev,
        outfitStyle: 'jacket',
        outfitColor: '#1976D2',
        hatStyle: 'cap',
        shoesColor: '#ECEFF1',
      }));
    } else if (preset === 'SPORT') {
      setAppearance((prev) => ({
        ...prev,
        outfitStyle: 'casual',
        outfitColor: '#2E7D32',
        hatStyle: 'kufi_black',
        shoesColor: '#263238',
      }));
    } else if (preset === 'MODEST') {
      setAppearance((prev) => ({
        ...prev,
        outfitStyle: 'thobe',
        outfitColor: '#212121',
        hatStyle: 'hijab',
        shoesColor: '#263238',
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-5xl w-full shadow-2xl text-white relative flex flex-col lg:flex-row overflow-hidden max-h-[92vh]"
      >
        {/* Close Button if opened as overlay in game */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 backdrop-blur border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* LEFT COLUMN: 3D PREVIEW & PEDESTAL */}
        <div className="lg:w-1/2 p-4 sm:p-6 bg-slate-950/60 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between items-center relative min-h-[320px] lg:min-h-[500px]">
          <div className="w-full flex items-center justify-between mb-3 z-10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">Ваш Персонаж</h2>
                <p className="text-xs text-emerald-400 font-medium">Интерактивный 3D Превью</p>
              </div>
            </div>

            {/* Presets Button */}
            <div className="flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-300">Готовые стили:</span>
            </div>
          </div>

          {/* Preset Buttons Bar */}
          <div className="w-full flex gap-1.5 overflow-x-auto pb-2 mb-2 z-10 scrollbar-none">
            {[
              { id: 'TRADITIONAL', label: 'Традиционный' },
              { id: 'CASUAL', label: 'Современный' },
              { id: 'SPORT', label: 'Спортивный' },
              { id: 'MODEST', label: 'Скромный' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id as any)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-500/50 rounded-lg text-xs text-slate-200 transition shrink-0 cursor-pointer font-medium"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* 3D CANVAS STAGE */}
          <div className="w-full flex-1 relative min-h-[260px] sm:min-h-[340px]">
            <CharacterPreviewCanvas appearance={appearance} rotationY={rotationY} />

            {/* Rotation Controls Overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-slate-700/80 px-3 py-1.5 rounded-full shadow-lg">
              <button
                onClick={rotateLeft}
                className="p-1.5 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-full transition cursor-pointer"
                title="Повернуть влево"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-semibold text-slate-400 px-1">Вращение 360°</span>
              <button
                onClick={rotateRight}
                className="p-1.5 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-full transition cursor-pointer"
                title="Повернуть вправо"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CUSTOMIZATION CONTROLS */}
        <div className="lg:w-1/2 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Category Tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-3 mb-5 overflow-x-auto scrollbar-none">
              {[
                { id: 'IDENTITY', label: 'Имя', icon: User },
                { id: 'BODY', label: 'Внешность', icon: Palette },
                { id: 'HAT', label: 'Головной убор', icon: Crown },
                { id: 'OUTFIT', label: 'Одежда и Обувь', icon: Shirt },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab(tab.id as any);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: IDENTITY */}
            {activeTab === 'IDENTITY' && (
              <div className="space-y-5">
                {/* Gender Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Пол персонажа
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setAppearance((prev) => ({
                          ...prev,
                          gender: 'boy',
                          name: prev.name === 'Марьям' ? 'Амир' : prev.name,
                          hatStyle: prev.hatStyle === 'hijab' ? 'kufi_white' : prev.hatStyle,
                          outfitStyle: prev.outfitStyle === 'dress' || prev.outfitStyle === 'abaya' ? 'thobe' : prev.outfitStyle,
                        }));
                      }}
                      className={`py-3 px-4 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        appearance.gender === 'boy'
                          ? 'bg-blue-600/30 border-blue-400 text-blue-200 shadow-lg'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-xl">👦</span>
                      <span>Мальчик</span>
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setAppearance((prev) => ({
                          ...prev,
                          gender: 'girl',
                          name: prev.name === 'Амир' ? 'Марьям' : prev.name,
                          hatStyle: 'hijab',
                          outfitStyle: 'abaya',
                        }));
                      }}
                      className={`py-3 px-4 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        appearance.gender === 'girl'
                          ? 'bg-pink-600/30 border-pink-400 text-pink-200 shadow-lg'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-xl">👧</span>
                      <span>Девочка</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Имя вашего героя
                  </label>
                  <input
                    type="text"
                    value={appearance.name}
                    onChange={(e) => setAppearance({ ...appearance, name: e.target.value })}
                    placeholder="Введите имя..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Быстрый выбор популярных имен:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {namePresets.map((name) => (
                      <button
                        key={name}
                        onClick={() => {
                          soundManager.playClick();
                          setAppearance({ ...appearance, name });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                          appearance.name === name
                            ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BODY & FACE */}
            {activeTab === 'BODY' && (
              <div className="space-y-5">
                {/* Skin Tone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Цвет кожи
                  </label>
                  <div className="flex gap-2.5 flex-wrap">
                    {skinColors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => setAppearance({ ...appearance, skinColor: color.hex })}
                        title={color.name}
                        style={{ backgroundColor: color.hex }}
                        className={`w-10 h-10 rounded-full border-2 transition-transform cursor-pointer relative flex items-center justify-center ${
                          appearance.skinColor === color.hex
                            ? 'border-emerald-400 scale-110 shadow-lg shadow-emerald-500/40'
                            : 'border-slate-700 hover:scale-105'
                        }`}
                      >
                        {appearance.skinColor === color.hex && (
                          <Check className="w-5 h-5 text-slate-900 drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eye Color */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Цвет глаз
                  </label>
                  <div className="flex gap-2.5 flex-wrap">
                    {eyeColors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => setAppearance({ ...appearance, eyeColor: color.hex })}
                        title={color.name}
                        style={{ backgroundColor: color.hex }}
                        className={`w-10 h-10 rounded-full border-2 transition-transform cursor-pointer relative flex items-center justify-center ${
                          appearance.eyeColor === color.hex
                            ? 'border-emerald-400 scale-110 shadow-lg shadow-emerald-500/40'
                            : 'border-slate-700 hover:scale-105'
                        }`}
                      >
                        {appearance.eyeColor === color.hex && (
                          <Check className="w-5 h-5 text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Style */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Прическа
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'short', name: 'Короткая классика' },
                      { id: 'curly', name: 'Кудрявая' },
                      { id: 'modern', name: 'Современная' },
                      { id: 'wavy', name: 'Волнистая' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setAppearance({ ...appearance, hairStyle: style.id as any })}
                        className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition cursor-pointer text-left ${
                          appearance.hairStyle === style.id
                            ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Color */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Цвет волос
                  </label>
                  <div className="flex gap-2.5 flex-wrap">
                    {hairColors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => setAppearance({ ...appearance, hairColor: color.hex })}
                        title={color.name}
                        style={{ backgroundColor: color.hex }}
                        className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                          appearance.hairColor === color.hex
                            ? 'border-emerald-400 scale-110 shadow-lg shadow-emerald-500/40'
                            : 'border-slate-700 hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HAT / HEADWEAR */}
            {activeTab === 'HAT' && (
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Выбор головного убора
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'kufi_white', name: 'Белая Тюбетейка', desc: 'Классический белый головной убор' },
                    { id: 'kufi_green', name: 'Зеленая Тюбетейка', desc: 'Традиционная зеленая тюбетейка' },
                    { id: 'kufi_black', name: 'Черная Тюбетейка', desc: 'Строгий темно-черный убор' },
                    { id: 'cap', name: 'Спортивная Кепка', desc: 'Синяя современная кепка' },
                    { id: 'hijab', name: 'Платок / Хиджаб', desc: 'Элегантный традиционный платок' },
                    { id: 'none', name: 'Без убора', desc: 'Открыть прическу' },
                  ].map((hat) => (
                    <button
                      key={hat.id}
                      onClick={() => setAppearance({ ...appearance, hatStyle: hat.id as any })}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        appearance.hatStyle === hat.id
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span className="font-bold text-xs text-white">{hat.name}</span>
                      <span className="text-[11px] text-slate-400 mt-1">{hat.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: OUTFIT & SHOES */}
            {activeTab === 'OUTFIT' && (
              <div className="space-y-5">
                {/* Outfit Style */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Фасон одежды
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'thobe', name: 'Традиционный Тоб / Кафтан' },
                      { id: 'casual', name: 'Куртка и штаны' },
                      { id: 'jacket', name: 'Спортивный костюм' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setAppearance({ ...appearance, outfitStyle: style.id as any })}
                        className={`p-3 rounded-xl text-xs font-medium border transition cursor-pointer text-left ${
                          appearance.outfitStyle === style.id
                            ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Outfit Color */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Цвет одежды
                  </label>
                  <div className="flex gap-2.5 flex-wrap">
                    {outfitColors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => setAppearance({ ...appearance, outfitColor: color.hex })}
                        title={color.name}
                        style={{ backgroundColor: color.hex }}
                        className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                          appearance.outfitColor === color.hex
                            ? 'border-emerald-400 scale-110 shadow-lg shadow-emerald-500/40'
                            : 'border-slate-700 hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Shoes Color */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Цвет обуви
                  </label>
                  <div className="flex gap-2.5 flex-wrap">
                    {shoeColors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => setAppearance({ ...appearance, shoesColor: color.hex })}
                        title={color.name}
                        style={{ backgroundColor: color.hex }}
                        className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                          appearance.shoesColor === color.hex
                            ? 'border-emerald-400 scale-110 shadow-lg shadow-emerald-500/40'
                            : 'border-slate-700 hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-5 border-t border-slate-800 mt-6">
            <button
              onClick={handleConfirm}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-emerald-950/60 border border-emerald-300/40 transition transform hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider"
            >
              <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
              <span>Сохранить и начать путь</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
