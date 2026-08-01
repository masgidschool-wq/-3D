import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShopItem } from '../../types/game';
import { soundManager } from '../../services/soundManager';
import { ShoppingBag, Coins, Shirt, Crown, Bike, Book, Home, Check, X } from 'lucide-react';

interface ShopModalProps {
  items: ShopItem[];
  userCoins: number;
  onBuyItem: (item: ShopItem) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ items, userCoins, onBuyItem, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<'clothing' | 'hat' | 'bike' | 'book' | 'furniture'>('clothing');

  const filteredItems = items.filter((i) => i.category === activeCategory);

  const handleBuy = (item: ShopItem) => {
    if (userCoins >= item.price && !item.owned) {
      soundManager.playCoin();
      onBuyItem(item);
    } else {
      soundManager.playClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl text-white relative flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-6 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Городской Магазин</h2>
              <p className="text-xs text-amber-300">Покупайте одежду, велосипед, книги и мебель для дома</p>
            </div>
          </div>

          <div className="bg-slate-800 border border-amber-500/30 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Coins className="w-4 h-4" />
            <span>{userCoins} Монет</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {[
            { id: 'clothing', name: 'Одежда', icon: Shirt },
            { id: 'hat', name: 'Уборы', icon: Crown },
            { id: 'bike', name: 'Велосипеды', icon: Bike },
            { id: 'book', name: 'Книги', icon: Book },
            { id: 'furniture', name: 'Мебель', icon: Home },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-sm text-white">{item.name}</h3>
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{item.price}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-4">{item.description}</p>
              </div>

              <button
                disabled={item.owned || userCoins < item.price}
                onClick={() => handleBuy(item)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                  item.owned
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 cursor-default'
                    : userCoins >= item.price
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                {item.owned ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Куплено</span>
                  </>
                ) : (
                  <span>Купить за {item.price}</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
