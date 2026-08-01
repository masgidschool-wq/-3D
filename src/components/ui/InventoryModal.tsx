import React from 'react';
import { motion } from 'motion/react';
import { CharacterAppearance, ShopItem } from '../../types/game';
import { soundManager } from '../../services/soundManager';
import { Package, Shirt, Crown, Bike, Book, Home, Check, X } from 'lucide-react';

interface InventoryModalProps {
  ownedItems: ShopItem[];
  appearance: CharacterAppearance;
  onUpdateAppearance: (newApp: CharacterAppearance) => void;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  ownedItems,
  appearance,
  onUpdateAppearance,
  onClose,
}) => {
  const handleEquipItem = (item: ShopItem) => {
    soundManager.playClick();
    if (item.category === 'clothing' && item.data) {
      onUpdateAppearance({
        ...appearance,
        outfitColor: item.data.color || appearance.outfitColor,
        outfitStyle: item.data.style || appearance.outfitStyle,
      });
    } else if (item.category === 'hat' && item.data) {
      onUpdateAppearance({
        ...appearance,
        hatStyle: item.data.style || appearance.hatStyle,
      });
    } else if (item.category === 'bike' && item.data) {
      onUpdateAppearance({
        ...appearance,
        hasBike: true,
        bikeColor: item.data.color || appearance.bikeColor,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-blue-500/40 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl text-white relative max-h-[85vh] flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
            <Package className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Инвентарь</h2>
            <p className="text-xs text-blue-300">Нажмите на предмет, чтобы надеть или использовать его</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1">
          {ownedItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-sm text-white mb-1">{item.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{item.description}</p>
              </div>

              <button
                onClick={() => handleEquipItem(item)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Надеть / Использовать</span>
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
