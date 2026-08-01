import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, X, Utensils, ShoppingCart, CheckCircle2, Heart } from 'lucide-react';
import { soundManager } from '../../services/soundManager';

interface GroceryItem {
  id: string;
  name: string;
  price: number;
  energyBonus: number;
  icon: string;
  description: string;
}

const groceryCatalog: GroceryItem[] = [
  {
    id: 'dates',
    name: 'Сладкие Финики (Сухур / Ифтар)',
    price: 15,
    energyBonus: 30,
    icon: '🌴',
    description: 'Благословенные финики — идеальное угощение для восстановления сил и Ифтара.',
  },
  {
    id: 'milk',
    name: 'Парное Молоко',
    price: 10,
    energyBonus: 20,
    icon: '🥛',
    description: 'Полезный напиток, придающий здоровье и силу.',
  },
  {
    id: 'bread',
    name: 'Свежий Хлеб из печи',
    price: 12,
    energyBonus: 25,
    icon: '🍞',
    description: 'Ароматный домашний хлеб.',
  },
  {
    id: 'water',
    name: 'Чистая Вода Зам-Зам',
    price: 8,
    energyBonus: 15,
    icon: '💧',
    description: 'Освежающая кристально чистая вода.',
  },
  {
    id: 'apples',
    name: 'Сочные Яблоки',
    price: 10,
    energyBonus: 18,
    icon: '🍎',
    description: 'Фрукты, богатые витаминами.',
  },
  {
    id: 'honey',
    name: 'Натуральный Мед',
    price: 25,
    energyBonus: 40,
    icon: '🍯',
    description: 'Лечебный сладкий мед.',
  },
];

interface GroceryStoreModalProps {
  userCoins: number;
  onBuyFood: (item: GroceryItem) => void;
  onClose: () => void;
}

export const GroceryStoreModal: React.FC<GroceryStoreModalProps> = ({
  userCoins,
  onBuyFood,
  onClose,
}) => {
  const [basket, setBasket] = useState<{ item: GroceryItem; count: number }[]>([]);
  const [cashierMsg, setCashierMsg] = useState(
    'Ассаляму алейкум, дорогой! Кладите все необходимые продукты в корзину, а потом подходите ко мне на кассу!'
  );
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  const addToBasket = (item: GroceryItem) => {
    soundManager.playClick();
    setBasket((prev) => {
      const existing = prev.find((b) => b.item.id === item.id);
      if (existing) {
        return prev.map((b) => (b.item.id === item.id ? { ...b, count: b.count + 1 } : b));
      }
      return [...prev, { item, count: 1 }];
    });
    setCashierMsg(`Отличный выбор! ${item.name} добавлено в вашу корзину!`);
  };

  const removeFromBasket = (itemId: string) => {
    soundManager.playClick();
    setBasket((prev) =>
      prev
        .map((b) => (b.item.id === itemId ? { ...b, count: b.count - 1 } : b))
        .filter((b) => b.count > 0)
    );
  };

  const totalPrice = basket.reduce((sum, b) => sum + b.item.price * b.count, 0);
  const totalItemsCount = basket.reduce((sum, b) => sum + b.count, 0);

  const handleCheckout = () => {
    if (totalPrice === 0) return;
    if (userCoins < totalPrice) {
      soundManager.playClick();
      setCashierMsg('Ой, милый, к сожалению монет пока не хватает на всю корзину!');
      return;
    }

    soundManager.playFanfare();
    soundManager.playCoin();

    // Buy all items
    basket.forEach((b) => {
      for (let i = 0; i < b.count; i++) {
        onBuyFood(b.item);
      }
    });

    setBasket([]);
    setShowCheckoutSuccess(true);
    setCashierMsg('ДжазакаЛлаху хайран за покупку! Пусть Всевышний дарует вам благословение и здоровье!');
    setTimeout(() => {
      setShowCheckoutSuccess(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 sm:p-7 max-w-3xl w-full shadow-2xl text-white relative max-h-[90vh] flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Store Title Bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Уютный Продуктовый Магазин «Халяль»</h2>
            <p className="text-xs text-amber-300 flex items-center gap-1">
              <span>Ваши кошелек:</span>
              <span className="font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
                {userCoins} 🪙
              </span>
            </p>
          </div>
        </div>

        {/* Kind Cashier Aunt Amina Header */}
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-800 to-amber-900/40 border border-amber-500/30 rounded-2xl p-3.5 mb-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-pink-500/20 border-2 border-pink-400/50 flex items-center justify-center text-2xl shrink-0 shadow-md">
            👵
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-amber-300">Продавщица Тетя Амина</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-0.5">
                <Heart className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" /> Добрая & Заботливая
              </span>
            </div>
            <p className="text-slate-200 italic font-serif leading-relaxed">"{cashierMsg}"</p>
          </div>
        </div>

        {/* Main Grid: Catalog vs Basket */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto flex-1 pr-1">
          {/* Catalog Items (2 Cols) */}
          <div className="md:col-span-2 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Полки с свежими продукты:
            </h3>
            {groceryCatalog.map((item) => {
              return (
                <div
                  key={item.id}
                  className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-amber-500/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl bg-slate-900/60 p-2 rounded-xl border border-slate-700">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-xs text-white">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">{item.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-amber-300 font-bold text-xs">{item.price} 🪙</span>
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                          <Utensils className="w-3 h-3" /> +{item.energyBonus} Энергия
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => addToBasket(item)}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>В корзину</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Cart & Checkout Panel (1 Col) */}
          <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4 text-amber-400" /> Покупательская Корзина
                </h3>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {totalItemsCount} шт
                </span>
              </div>

              {basket.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  Ваша корзина пока пуста.<br />Нажмите «В корзину», чтобы положить товары!
                </div>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {basket.map((b) => (
                    <div
                      key={b.item.id}
                      className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded-xl border border-slate-800"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{b.item.icon}</span>
                        <span className="font-medium text-slate-200 truncate max-w-[100px]">
                          {b.item.name}
                        </span>
                        <span className="text-amber-400 font-bold">x{b.count}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 text-[11px] font-bold">
                          {b.item.price * b.count} 🪙
                        </span>
                        <button
                          onClick={() => removeFromBasket(b.item.id)}
                          className="w-5 h-5 rounded bg-red-950 text-red-400 hover:bg-red-900 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 mt-3">
              <div className="flex justify-between items-center text-sm font-bold mb-3">
                <span className="text-slate-300">Итого на кассу:</span>
                <span className="text-amber-400 text-base">{totalPrice} 🪙</span>
              </div>

              {showCheckoutSuccess && (
                <div className="mb-2 p-2 bg-emerald-950 border border-emerald-500 text-emerald-300 text-[11px] rounded-xl flex items-center gap-1.5 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Покупка успешно совершена! Продукты у вас в сумке!</span>
                </div>
              )}

              <button
                disabled={totalPrice === 0}
                onClick={handleCheckout}
                className={`w-full py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                  totalPrice > 0
                    ? userCoins >= totalPrice
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/30'
                      : 'bg-red-900/60 border border-red-500 text-red-200'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>👵 Идти на кассу к Тете Амине</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
