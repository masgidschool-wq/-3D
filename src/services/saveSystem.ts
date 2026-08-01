import { CharacterAppearance, PlayerStats, DailyTask, Achievement, InventoryItem, ShopItem } from '../types/game';

const SAVE_KEY = 'muslim_life_simulator_save_v1';

export interface SaveData {
  appearance: CharacterAppearance;
  stats: PlayerStats;
  dailyTasks: DailyTask[];
  achievements: Achievement[];
  ownedItems: string[]; // item IDs
  equippedOutfit: string;
  equippedHat: string;
  equippedShoes: string;
  equippedBike: boolean;
  decoratedItems: { itemId: string; position: [number, number, number] }[];
  dayCount: number;
  timeHour: number;
  goodDeedsCompleted: string[]; // deed IDs
}

export const defaultAppearance: CharacterAppearance = {
  name: 'Амир',
  gender: 'boy',
  skinColor: '#F5D0A9',
  eyeColor: '#3E2723',
  hairStyle: 'short',
  hairColor: '#212121',
  outfitColor: '#1E88E5',
  outfitStyle: 'thobe',
  shoesColor: '#37474F',
  hatStyle: 'kufi_white',
  hasBike: false,
  bikeColor: '#E53935',
  hasCar: false,
  carColor: '#1E88E5',
};

export const defaultStats: PlayerStats = {
  health: 100,
  mood: 100,
  energy: 100,
  hunger: 100,
  exp: 0,
  level: 1,
  coins: 150,
  intelligence: 10,
  goodDeedsCount: 0,
  isFasting: false,
};

export const initialDailyTasks: DailyTask[] = [
  { id: 'wudu', title: 'Совершить омовение', description: 'Посетить ванную комнату и совершить омовение водой', completed: false, rewardCoins: 30, rewardExp: 50, iconName: 'Droplets' },
  { id: 'prayer', title: 'Совершить молитву', description: 'Расстелить коврик в комнате и совершить утреннюю молитву', completed: false, rewardCoins: 50, rewardExp: 80, iconName: 'Compass' },
  { id: 'breakfast', title: 'Позавтракать с семьей', description: 'Спуститься на кухню, поесть вкусный завтрак от мамы', completed: false, rewardCoins: 20, rewardExp: 40, iconName: 'Utensils' },
  { id: 'help_parents', title: 'Помочь родителям', description: 'Выполнить утреннее поручение родителей', completed: false, rewardCoins: 40, rewardExp: 60, iconName: 'HeartHandshake' },
  { id: 'school', title: 'Посетить школу', description: 'Отправиться в городскую школу и получить хорошую оценку', completed: false, rewardCoins: 60, rewardExp: 100, iconName: 'GraduationCap' },
  { id: 'good_deed', title: 'Совершить доброе дело', description: 'Помочь жителю города или спасти животное', completed: false, rewardCoins: 50, rewardExp: 90, iconName: 'Smile' },
  { id: 'mosque', title: 'Посетить мечеть', description: 'Зайти в красивую городскую мечеть и почитать книгу', completed: false, rewardCoins: 50, rewardExp: 100, iconName: 'Landmark' },
];

export const initialAchievements: Achievement[] = [
  { id: 'first_step', title: 'Первый шаг', description: 'Проснуться и выключить будильник', icon: 'Sun', unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'purity', title: 'Чистота — половина веры', description: 'Совершить полное омовение', icon: 'Droplet', unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'light_of_prayer', title: 'Свет молитвы', description: 'Совершить утреннюю молитву на коврике', icon: 'Sparkles', unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'kind_heart', title: 'Доброе сердце', description: 'Совершить 5 добрых дел для жителей', icon: 'Heart', unlocked: false, progress: 0, maxProgress: 5 },
  { id: 'scholar', title: 'Знания — сила', description: 'Получить оценку «5» на уроке в школе', icon: 'BookOpen', unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'cyclist', title: 'Юный велосипедист', description: 'Приобрести свой первый велосипед в магазине', icon: 'Bike', unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'home_designer', title: 'Уютный дом', description: 'Украсить комнату новой мебелью или растением', icon: 'Home', unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'mosque_guardian', title: 'Гость Мечети', description: 'Посетить мечеть и почитать книгу общины', icon: 'Building2', unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'pilgrim', title: 'Священный Паломник', description: 'Посетить Мекку и совершить Таваф вокруг Каабы', icon: 'Sparkles', unlocked: false, progress: 0, maxProgress: 1 },
];

export const initialShopItems: ShopItem[] = [
  // Clothes
  { id: 'thobe_white', name: 'Белый традиционный кандура/джалабия', category: 'clothing', price: 80, description: 'Чистая белая традиционная одежда', owned: true, icon: 'Shirt', data: { color: '#FFFFFF', style: 'thobe' } },
  { id: 'thobe_green', name: 'Изумрудный кафтан', category: 'clothing', price: 120, description: 'Благородный зеленый стиль', owned: false, icon: 'Shirt', data: { color: '#2E7D32', style: 'thobe' } },
  { id: 'thobe_gold', name: 'Золотистый кафтан', category: 'clothing', price: 250, description: 'Праздничный наряд из красивой ткани', owned: false, icon: 'Shirt', data: { color: '#FBC02D', style: 'thobe' } },
  { id: 'jacket_blue', name: 'Уютная синяя куртка', category: 'clothing', price: 100, description: 'Теплая куртка для прогулок', owned: false, icon: 'Shirt', data: { color: '#1565C0', style: 'jacket' } },
  
  // Hats
  { id: 'kufi_white', name: 'Белая тюбетейка / куфи', category: 'hat', price: 40, description: 'Классический белый головной убор', owned: true, icon: 'Crown', data: { style: 'kufi_white' } },
  { id: 'kufi_green', name: 'Зеленая тюбетейка', category: 'hat', price: 60, description: 'Зеленый традиционный узор', owned: false, icon: 'Crown', data: { style: 'kufi_green' } },
  { id: 'kufi_black', name: 'Черная бархатная тюбетейка', category: 'hat', price: 90, description: 'Элегантный темный головной убор', owned: false, icon: 'Crown', data: { style: 'kufi_black' } },

  // Bikes
  { id: 'bike_red', name: 'Красный скоростной велосипед', category: 'bike', price: 200, description: 'Позволяет быстро передвигаться по городу!', owned: false, icon: 'Bike', data: { color: '#E53935' } },
  { id: 'bike_green', name: 'Зеленый горный велосипед', category: 'bike', price: 300, description: 'Стильный велик с корзинкой', owned: false, icon: 'Bike', data: { color: '#43A047' } },

  // Books
  { id: 'book_history', name: 'Книга «Истории о доброте»', category: 'book', price: 50, description: 'Увеличивает интеллект (+15) и настроение', owned: false, icon: 'Book' },
  { id: 'book_science', name: 'Книга «Занимательная наука»', category: 'book', price: 75, description: 'Помогает получать отличные оценки в школе', owned: false, icon: 'Book' },

  // Furniture
  { id: 'lamp_gold', name: 'Восточная золотая лампа', category: 'furniture', price: 70, description: 'Красивый теплый свет для комнаты', owned: false, icon: 'Lamp' },
  { id: 'carpet_persian', name: 'Узорчатый восточный ковер', category: 'furniture', price: 130, description: 'Мягкий ковер ручной работы', owned: false, icon: 'Grid' },
  { id: 'plant_ficus', name: 'Зеленый комнатный фикус', category: 'furniture', price: 45, description: 'Живой цветок в горшке', owned: false, icon: 'Flower2' },
  { id: 'bookshelf_wood', name: 'Резная книжная полка', category: 'furniture', price: 110, description: 'Деревянный стеллаж для лучших книг', owned: false, icon: 'Library' }
];

export const saveGameData = (data: SaveData) => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save game state', e);
  }
};

export const loadGameData = (): SaveData | null => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load save data', e);
  }
  return null;
};
