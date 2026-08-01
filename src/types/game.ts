export type GamePhase = 'INTRO' | 'CHARACTER_CREATION' | 'GAMEPLAY';

export type TimeOfDay = 'MORNING' | 'DAY' | 'EVENING' | 'NIGHT';
export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';
export type Weather = 'SUNNY' | 'RAIN' | 'SNOW';

export type CurrentSceneLocation = 
  | 'TOWN' 
  | 'MECCA_CITY' 
  | 'MECCA_HARAM' 
  | 'JEDDAH_COAST' 
  | 'DESERT_HIGHWAY' 
  | 'DESERT_OASIS' 
  | 'HOUSE_INTERIOR' 
  | 'MOSQUE_INTERIOR' 
  | 'GROCERY_INTERIOR' 
  | 'SCHOOL_INTERIOR' 
  | 'MECCA_HAJJ';
export type PrayerTimeName = 'Фаджр' | 'Зухр' | 'Аср' | 'Магриб' | 'Иша';

export interface CharacterAppearance {
  name: string;
  gender: 'boy' | 'girl';
  skinColor: string;
  eyeColor: string;
  hairStyle: 'short' | 'curly' | 'modern' | 'wavy' | 'braids' | 'ponytail';
  hairColor: string;
  outfitColor: string;
  outfitStyle: 'thobe' | 'casual' | 'jacket' | 'vest' | 'dress' | 'abaya';
  shoesColor: string;
  hatStyle: 'none' | 'kufi_white' | 'kufi_green' | 'kufi_black' | 'cap' | 'hijab';
  hasBike: boolean;
  bikeColor: string;
  hasCar: boolean;
  carColor: string;
}

export interface PlayerStats {
  health: number; // 0-100
  mood: number; // 0-100
  energy: number; // 0-100
  hunger: number; // 0-100
  exp: number;
  level: number;
  coins: number;
  intelligence: number;
  goodDeedsCount: number;
  isFasting: boolean;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  rewardCoins: number;
  rewardExp: number;
  iconName: string;
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'clothing' | 'hat' | 'bike' | 'car' | 'food' | 'book' | 'furniture';
  price: number;
  description: string;
  owned: boolean;
  icon: string;
  data?: any;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  equipped?: boolean;
}

export type WorldLocationId = 
  | 'HOUSE' 
  | 'MOSQUE' 
  | 'SCHOOL' 
  | 'LIBRARY' 
  | 'SHOP' 
  | 'PARK' 
  | 'FOREST' 
  | 'LAKE' 
  | 'FIELDS' 
  | 'VILLAGE'
  | 'GROCERY';

export interface WorldLocation {
  id: WorldLocationId;
  name: string;
  position: [number, number, number];
  color: string;
  icon: string;
  description: string;
}

export interface GoodDeedQuest {
  id: string;
  title: string;
  location: WorldLocationId;
  npcName: string;
  description: string;
  completed: boolean;
  rewardExp: number;
  rewardCoins: number;
  type: 'kitten' | 'dog' | 'grandpa' | 'trash' | 'tree' | 'flowers' | 'birds' | 'homework' | 'grandma' | 'groceries';
  position: [number, number, number];
}

export interface BookChapter {
  id: string;
  title: string;
  arabicText?: string;
  transliteration?: string;
  translation: string;
  category: 'QURAN' | 'DUA' | 'STORY' | 'HADITH';
}

