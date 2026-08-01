import React, { useState, useEffect, useRef } from 'react';
import { GameCanvas } from './components/3d/GameCanvas';
import { IntroCutscene } from './components/ui/IntroCutscene';
import { CharacterCustomizer } from './components/ui/CharacterCustomizer';
import { HUD } from './components/ui/HUD';
import { WuduMinigameModal } from './components/ui/WuduMinigameModal';
import { PrayerCinematicModal } from './components/ui/PrayerCinematicModal';
import { SchoolMinigameModal } from './components/ui/SchoolMinigameModal';
import { ShopModal } from './components/ui/ShopModal';
import { GoodDeedsModal } from './components/ui/GoodDeedsModal';
import { InventoryModal } from './components/ui/InventoryModal';
import { AchievementsModal } from './components/ui/AchievementsModal';
import { BookReaderModal } from './components/ui/BookReaderModal';
import { GroceryStoreModal } from './components/ui/GroceryStoreModal';
import { HomeActionsModal } from './components/ui/HomeActionsModal';
import { DuaModal } from './components/ui/DuaModal';
import { PrayerAlarmModal } from './components/ui/PrayerAlarmModal';
import { SmartphoneModal } from './components/ui/SmartphoneModal';
import { DialogueModal } from './components/ui/DialogueModal';
import { BusTravelModal } from './components/ui/BusTravelModal';
import { NPCData } from './components/3d/NPCModel';
import {
  GamePhase,
  CharacterAppearance,
  PlayerStats,
  DailyTask,
  ShopItem,
  Achievement,
  TimeOfDay,
  Weather,
  Season,
  GoodDeedQuest,
  CurrentSceneLocation,
  PrayerTimeName,
} from './types/game';
import {
  defaultAppearance,
  defaultStats,
  initialDailyTasks,
  initialAchievements,
  initialShopItems,
  loadGameData,
  saveGameData,
} from './services/saveSystem';
import { soundManager } from './services/soundManager';

export default function App() {
  // Game Phase
  const [phase, setPhase] = useState<GamePhase>('INTRO');

  // Player state
  const [appearance, setAppearance] = useState<CharacterAppearance>(defaultAppearance);
  const [stats, setStats] = useState<PlayerStats>(defaultStats);
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0, 10]);
  const [playerRotY, setPlayerRotY] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isRidingBike, setIsRidingBike] = useState(false);
  const [isRidingCar, setIsRidingCar] = useState(false);

  // Scene Location & Camera
  const [sceneLocation, setSceneLocation] = useState<CurrentSceneLocation>('TOWN');
  const [camAngleY, setCamAngleY] = useState(0);
  const [camPitch, setCamPitch] = useState(0.45);
  const [activeNPC, setActiveNPC] = useState<NPCData | null>(null);

  // Time & Weather state
  const [timeHour, setTimeHour] = useState(7); // 7:00 AM
  const [dayCount, setDayCount] = useState(1);
  const [weather, setWeather] = useState<Weather>('SUNNY');
  const [season] = useState<Season>('SUMMER');

  // Prayer Alarm State
  const [activePrayerAlarm, setActivePrayerAlarm] = useState<PrayerTimeName | null>(null);
  const lastAlarmHour = useRef<number>(-1);

  // Daily Tasks & Achievements & Shop
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(initialDailyTasks);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [shopItems, setShopItems] = useState<ShopItem[]>(initialShopItems);

  // Active Modals
  const [activeModal, setActiveModal] = useState<
    | 'NONE'
    | 'WUDU'
    | 'PRAYER'
    | 'SCHOOL'
    | 'SHOP'
    | 'INVENTORY'
    | 'ACHIEVEMENTS'
    | 'GOOD_DEED'
    | 'CUSTOMIZER'
    | 'BOOK_READER'
    | 'GROCERY'
    | 'HOME_ACTIONS'
    | 'DUA'
    | 'PRAYER_ALARM'
    | 'SMARTPHONE'
    | 'DIALOGUE'
    | 'BUS_TRAVEL'
  >('NONE');
  const [activeQuest, setActiveQuest] = useState<GoodDeedQuest | null>(null);
  const [activeBookId, setActiveBookId] = useState<'quran' | 'stories' | 'dua'>('quran');

  // Interactive State
  const [isPrayerMatSpread] = useState(true);
  const [hasCleanedRoom] = useState(false);
  const [hasRescuedKitten, setHasRescuedKitten] = useState(false);
  const [hasCleanedParkTrash, setHasCleanedParkTrash] = useState(false);
  const [hasWateredFlowers] = useState(false);
  const [hasPlantedTree] = useState(false);

  // Input state
  const moveVector = useRef({ dx: 0, dz: 0 });

  // Load saved state on start
  useEffect(() => {
    const saved = loadGameData();
    if (saved) {
      setAppearance(saved.appearance);
      setStats(saved.stats);
      setDailyTasks(saved.dailyTasks);
      setAchievements(saved.achievements);
      setDayCount(saved.dayCount);
      setTimeHour(saved.timeHour);
    }
  }, []);

  // Time progression ticker & Prayer Alarm Check (slowed down for realistic pace)
  useEffect(() => {
    if (phase !== 'GAMEPLAY') return;

    const timer = setInterval(() => {
      setTimeHour((prev) => {
        let next = prev + 0.015;
        if (next >= 24) {
          next = 0;
          setDayCount((d) => d + 1);
          const randW = Math.random();
          setWeather(randW > 0.8 ? 'RAIN' : randW > 0.95 ? 'SNOW' : 'SUNNY');
        }

        // Check Prayer Alarms (Fajr: 5, Dhuhr: 12.5, Asr: 16, Maghrib: 18.5, Isha: 20)
        const currentHourFloor = Math.floor(next);
        if (currentHourFloor !== lastAlarmHour.current) {
          if (currentHourFloor === 5) {
            triggerPrayerAlarm('Фаджр');
          } else if (currentHourFloor === 12) {
            triggerPrayerAlarm('Зухр');
          } else if (currentHourFloor === 16) {
            triggerPrayerAlarm('Аср');
          } else if (currentHourFloor === 18) {
            triggerPrayerAlarm('Магриб');
          } else if (currentHourFloor === 20) {
            triggerPrayerAlarm('Иша');
          }
          lastAlarmHour.current = currentHourFloor;
        }

        return next;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [phase]);

  const triggerPrayerAlarm = (prayerName: PrayerTimeName) => {
    setActivePrayerAlarm(prayerName);
    soundManager.playBell();
    setActiveModal('PRAYER_ALARM');
  };

  // Keyboard controls listener (W A S D + Q E R P + Arrows)
  useEffect(() => {
    if (phase !== 'GAMEPLAY' || activeModal !== 'NONE') return;

    const keys: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys[k] = true;

      // Q / E Camera rotation
      if (k === 'q') {
        setCamAngleY((prev) => prev - Math.PI / 12);
      } else if (k === 'e') {
        setCamAngleY((prev) => prev + Math.PI / 12);
      } else if (k === 'r') {
        setCamPitch((prev) => Math.min(1.2, prev + 0.1));
      } else if (k === 'f') {
        setCamPitch((prev) => Math.max(0.05, prev - 0.1));
      } else if (k === 'p') {
        setActiveModal('SMARTPHONE');
      } else if (e.code === 'Space') {
        e.preventDefault();
        triggerSpacebarAction();
      }

      updateInput();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
      updateInput();
    };

    const updateInput = () => {
      let dx = 0;
      let dz = 0;

      if (keys['w'] || keys['arrowup']) dz -= 1;
      if (keys['s'] || keys['arrowdown']) dz += 1;
      if (keys['a'] || keys['arrowleft']) dx -= 1;
      if (keys['d'] || keys['arrowright']) dx += 1;

      moveVector.current = { dx, dz };
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [phase, activeModal]);

  // Movement loop
  useEffect(() => {
    if (phase !== 'GAMEPLAY') return;

    const frameTimer = setInterval(() => {
      if (activeModal !== 'NONE') {
        setIsMoving(false);
        return;
      }

      const { dx, dz } = moveVector.current;

      if (dx !== 0 || dz !== 0) {
        setIsMoving(true);
        soundManager.playStep();

        const speed = isRidingCar ? 0.6 : isRidingBike ? 0.35 : 0.18;

        // Rotate movement vector relative to current camera angle!
        const rotatedDx = dx * Math.cos(camAngleY) + dz * Math.sin(camAngleY);
        const rotatedDz = -dx * Math.sin(camAngleY) + dz * Math.cos(camAngleY);

        const targetAngle = Math.atan2(rotatedDx, rotatedDz);
        setPlayerRotY(targetAngle);

        setPlayerPos((prev) => {
          const limit = sceneLocation === 'TOWN' ? 120 : 18;
          const newX = Math.max(-limit, Math.min(limit, prev[0] + rotatedDx * speed));
          const newZ = Math.max(-limit, Math.min(limit, prev[2] + rotatedDz * speed));
          return [newX, prev[1], newZ];
        });
      } else {
        setIsMoving(false);
      }
    }, 30);

    return () => clearInterval(frameTimer);
  }, [phase, isRidingBike, isRidingCar, activeModal, camAngleY, sceneLocation]);

  // Time of Day enum helper
  const getTimeOfDayEnum = (h: number): TimeOfDay => {
    if (h >= 5 && h < 8) return 'MORNING';
    if (h >= 8 && h < 17) return 'DAY';
    if (h >= 17 && h < 21) return 'EVENING';
    return 'NIGHT';
  };

  // Helper task completion
  const completeTask = (taskId: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && !t.completed) {
          addRewards(t.rewardCoins, t.rewardExp);
          return { ...t, completed: true };
        }
        return t;
      })
    );
  };

  const addRewards = (coins: number, exp: number) => {
    setStats((prev) => {
      let newExp = prev.exp + exp;
      let newLevel = prev.level;
      if (newExp >= 100 * prev.level) {
        newExp -= 100 * prev.level;
        newLevel += 1;
        soundManager.playFanfare();
      }
      return {
        ...prev,
        coins: prev.coins + coins,
        exp: newExp,
        level: newLevel,
        mood: Math.min(100, prev.mood + 10),
        energy: Math.min(100, (prev.energy ?? 100) + 15),
      };
    });
  };

  const unlockAchievement = (achId: string) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === achId ? { ...a, unlocked: true } : a))
    );
  };

  // NPCs list in open world
  const npcs: NPCData[] = [
    {
      id: 'mom',
      name: 'Мама',
      role: 'Семья',
      type: 'human',
      position: [-16, 0, -17],
      outfitColor: '#E91E63',
      hasQuest: !dailyTasks.find((t) => t.id === 'breakfast')?.completed,
      questTitle: 'Завтрак от мамы',
    },
    {
      id: 'dad',
      name: 'Папа',
      role: 'Семья',
      type: 'human',
      position: [-14, 0, -17],
      outfitColor: '#1976D2',
    },
    {
      id: 'grandpa',
      name: 'Дедушка Ибрагим',
      role: 'Пожилой житель',
      type: 'human',
      position: [12, 0, 42],
      outfitColor: '#5D4037',
      hasQuest: true,
      questTitle: 'Донести сумки',
    },
    {
      id: 'teacher',
      name: 'Учитель Ахмад',
      role: 'Школа',
      type: 'human',
      position: [45, 0, 24],
      outfitColor: '#283593',
      hasQuest: !dailyTasks.find((t) => t.id === 'school')?.completed,
      questTitle: 'Урок в школе',
    },
    {
      id: 'friend_yusuf',
      name: 'Друг Юсуф',
      role: 'Друг',
      type: 'human',
      position: [-10, 0, -8],
      outfitColor: '#4CAF50',
    },
  ];

  // Interact Handlers
  const handleInteractNPC = (npc: NPCData) => {
    soundManager.playClick();
    setActiveNPC(npc);
    setActiveModal('DIALOGUE');
  };

  const triggerSpacebarAction = () => {
    if (sceneLocation === 'HOUSE_INTERIOR') {
      // Check family members
      const momPos: [number, number, number] = [6, 0, -6];
      const dadPos: [number, number, number] = [6, 0, 4];
      const brotherPos: [number, number, number] = [-5, 0, -5];
      const sisterPos: [number, number, number] = [-5, 0, 4];

      const dist = (p: [number, number, number]) =>
        Math.hypot(playerPos[0] - p[0], playerPos[2] - p[2]);

      if (dist(momPos) < 5) {
        handleInteractNPC({ id: 'mom', name: 'Мама Марьям', role: 'Заботливая Мама', type: 'human', position: momPos, gender: 'girl' });
      } else if (dist(dadPos) < 5) {
        handleInteractNPC({ id: 'dad', name: 'Папа Сулейман', role: 'Глава Семейства', type: 'human', position: dadPos, gender: 'boy' });
      } else if (dist(brotherPos) < 5) {
        handleInteractNPC({ id: 'brother', name: 'Братишка Умар', role: 'Младший Брат', type: 'human', position: brotherPos, gender: 'boy' });
      } else if (dist(sisterPos) < 5) {
        handleInteractNPC({ id: 'sister', name: 'Сестренка Асия', role: 'Младшая Сестра', type: 'human', position: sisterPos, gender: 'girl' });
      } else if (Math.hypot(playerPos[0] - 0, playerPos[2] - 14) < 4) {
        handleInteractObject('exit_to_town');
      } else {
        setActiveModal('HOME_ACTIONS');
      }
    } else if (sceneLocation === 'SCHOOL_INTERIOR') {
      const teacherPos: [number, number, number] = [0, 0, -8];
      const yusufPos: [number, number, number] = [-4, 0, -2];
      const maryamPos: [number, number, number] = [4, 0, -2];
      const dist = (p: [number, number, number]) =>
        Math.hypot(playerPos[0] - p[0], playerPos[2] - p[2]);

      if (dist(teacherPos) < 5) {
        handleInteractNPC({ id: 'teacher', name: 'Учитель Ахмед', role: 'Преподаватель', type: 'human', position: teacherPos, gender: 'boy' });
      } else if (dist(yusufPos) < 5) {
        handleInteractNPC({ id: 'friend_yusuf', name: 'Друг Юсуф', role: 'Одноклассник', type: 'human', position: yusufPos, gender: 'boy' });
      } else if (dist(maryamPos) < 5) {
        handleInteractNPC({ id: 'friend_maryam', name: 'Подруга Марьям', role: 'Одноклассница', type: 'human', position: maryamPos, gender: 'girl' });
      } else {
        setActiveModal('SCHOOL');
      }
    } else if (sceneLocation === 'GROCERY_INTERIOR') {
      setActiveModal('GROCERY');
    } else {
      // TOWN
      let nearestNpc: NPCData | null = null;
      let minDistance = 5.0;

      for (const npc of npcs) {
        const d = Math.hypot(playerPos[0] - npc.position[0], playerPos[2] - npc.position[2]);
        if (d < minDistance) {
          minDistance = d;
          nearestNpc = npc;
        }
      }

      if (nearestNpc) {
        handleInteractNPC(nearestNpc);
      } else {
        // Check building entrances
        if (Math.hypot(playerPos[0] - (-15), playerPos[2] - (-20)) < 12) {
          handleInteractObject('enter_house');
        } else if (Math.hypot(playerPos[0] - 0, playerPos[2] - (-70)) < 18) {
          handleInteractObject('enter_mosque');
        } else if (Math.hypot(playerPos[0] - (-35), playerPos[2] - (-15)) < 12) {
          handleInteractObject('enter_grocery');
        } else if (Math.hypot(playerPos[0] - 45, playerPos[2] - 20) < 14) {
          handleInteractObject('enter_school');
        }
      }
    }
  };

  const handleInteractObject = (objId: string) => {
    soundManager.playClick();
    if (objId === 'enter_house') {
      setSceneLocation('HOUSE_INTERIOR');
      setPlayerPos([0, 0, 10]);
    } else if (objId === 'enter_mosque') {
      setSceneLocation('MOSQUE_INTERIOR');
      setPlayerPos([0, 0, 14]);
    } else if (objId === 'enter_grocery') {
      setSceneLocation('GROCERY_INTERIOR');
      setPlayerPos([0, 0, 10]);
    } else if (objId === 'school_entrance' || objId === 'enter_school') {
      setSceneLocation('SCHOOL_INTERIOR');
      setPlayerPos([0, 0, 10]);
    } else if (objId === 'open_grocery_modal') {
      setActiveModal('GROCERY');
    } else if (objId === 'exit_to_town') {
      if (sceneLocation === 'HOUSE_INTERIOR') {
        setSceneLocation('TOWN');
        setPlayerPos([-15, 0, -12]);
      } else if (sceneLocation === 'MOSQUE_INTERIOR') {
        setSceneLocation('TOWN');
        setPlayerPos([0, 0, -55]);
      } else if (sceneLocation === 'GROCERY_INTERIOR') {
        setSceneLocation('TOWN');
        setPlayerPos([-35, 0, -8]);
      } else if (sceneLocation === 'SCHOOL_INTERIOR') {
        setSceneLocation('TOWN');
        setPlayerPos([45, 0, 10]);
      } else {
        setSceneLocation('TOWN');
        setPlayerPos([0, 0, 0]);
      }
    } else if (objId === 'read_quran') {
      setActiveBookId('quran');
      setActiveModal('BOOK_READER');
    } else if (objId === 'bed') {
      setActiveModal('HOME_ACTIONS');
    } else if (objId === 'kitchen_table') {
      setActiveModal('HOME_ACTIONS');
    } else if (objId === 'fridge') {
      soundManager.playBell();
      addRewards(15, 20);
      setStats((prev) => ({
        ...prev,
        energy: Math.min(100, prev.energy + 30),
        hunger: Math.min(100, (prev.hunger || 70) + 30),
      }));
    } else if (objId === 'sofa') {
      soundManager.playBell();
      setStats((prev) => ({
        ...prev,
        energy: Math.min(100, prev.energy + 20),
        mood: Math.min(100, prev.mood + 10),
      }));
    } else if (objId === 'window') {
      soundManager.playClick();
      addRewards(10, 15);
    } else if (objId === 'clock') {
      soundManager.playClick();
    } else if (objId === 'sink') {
      setActiveModal('WUDU');
    } else if (objId === 'prayer_mat') {
      setActiveModal('PRAYER');
    } else if (objId === 'drive_car') {
      setIsRidingCar(!isRidingCar);
      soundManager.playBell();
    } else if (objId === 'rescue_kitten') {
      setHasRescuedKitten(true);
      completeTask('good_deed');
      addRewards(60, 100);
      unlockAchievement('kind_heart');
      soundManager.playCatMeow();
    } else if (objId === 'open_bus_modal') {
      setActiveModal('BUS_TRAVEL');
    } else if (objId === 'maqam_ibrahim') {
      soundManager.playBell();
      addRewards(30, 50);
      setStats((prev) => ({ ...prev, mood: 100 }));
    } else if (objId === 'zamzam_water') {
      soundManager.playClick();
      addRewards(40, 60);
      setStats((prev) => ({ ...prev, health: 100, energy: 100, hunger: Math.min(100, prev.hunger + 30) }));
    } else if (objId === 'tawaf_ritual') {
      soundManager.playBell();
      addRewards(100, 200);
      unlockAchievement('pilgrim');
      setStats((prev) => ({ ...prev, mood: 100, intelligence: prev.intelligence + 10 }));
    } else if (objId === 'return_from_mecca') {
      setSceneLocation('TOWN');
      setPlayerPos([-50, 0, 30]);
      soundManager.playBell();
    }
  };

  const handleSelectBusDestination = (destId: 'HOUSE' | 'MOSQUE' | 'SCHOOL' | 'GROCERY' | 'MECCA_HAJJ') => {
    if (destId === 'MECCA_HAJJ') {
      setSceneLocation('MECCA_HAJJ');
      setPlayerPos([0, 0, 25]);
      addRewards(50, 100);
      unlockAchievement('pilgrim');
      soundManager.playBell();
    } else if (destId === 'HOUSE') {
      setSceneLocation('TOWN');
      setPlayerPos([-15, 0, 2]);
      soundManager.playClick();
    } else if (destId === 'MOSQUE') {
      setSceneLocation('TOWN');
      setPlayerPos([0, 0, -45]);
      soundManager.playClick();
    } else if (destId === 'SCHOOL') {
      setSceneLocation('TOWN');
      setPlayerPos([45, 0, 15]);
      soundManager.playClick();
    } else if (destId === 'GROCERY') {
      setSceneLocation('TOWN');
      setPlayerPos([-35, 0, -8]);
      soundManager.playClick();
    }
    setActiveModal('NONE');
  };

  // Minigame finish callbacks
  const handleWuduComplete = () => {
    completeTask('wudu');
    unlockAchievement('purity');
    setStats((prev) => ({ ...prev, energy: 100 }));
    setActiveModal('NONE');
  };

  const handlePrayerComplete = () => {
    completeTask('prayer');
    unlockAchievement('light_of_prayer');
    setStats((prev) => ({ ...prev, mood: 100 }));
    setActiveModal('NONE');
  };

  const handleSchoolComplete = () => {
    completeTask('school');
    unlockAchievement('scholar');
    setStats((prev) => ({ ...prev, intelligence: prev.intelligence + 15 }));
    addRewards(60, 100);
    setActiveModal('NONE');
  };

  const handleBuyShopItem = (item: ShopItem) => {
    setStats((prev) => ({ ...prev, coins: prev.coins - item.price }));
    setShopItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, owned: true } : i))
    );
    if (item.category === 'bike') {
      setAppearance((prev) => ({ ...prev, hasBike: true, bikeColor: item.data?.color || prev.bikeColor }));
      setIsRidingBike(true);
      unlockAchievement('cyclist');
    }
  };

  const handleCompleteQuest = (questId: string) => {
    completeTask('good_deed');
    setStats((prev) => ({ ...prev, goodDeedsCount: prev.goodDeedsCount + 1 }));
    if (stats.goodDeedsCount + 1 >= 5) {
      unlockAchievement('kind_heart');
    }
    setActiveModal('NONE');
  };

  // Home actions callback (eat, sleep, fast, read book, read dua)
  const handleHomeAction = (action: string) => {
    if (action === 'eat') {
      setStats((prev) => ({ ...prev, energy: Math.min(100, (prev.energy ?? 100) + 40), isFasting: false }));
      completeTask('breakfast');
      soundManager.playClick();
    } else if (action === 'sleep') {
      setStats((prev) => ({ ...prev, energy: 100, health: 100, mood: 100 }));
      setTimeHour(7);
      soundManager.playFanfare();
    } else if (action === 'fast') {
      setStats((prev) => ({ ...prev, isFasting: true }));
      completeTask('good_deed');
      soundManager.playFanfare();
    } else if (action === 'read_book') {
      setActiveBookId('quran');
      setActiveModal('BOOK_READER');
      return;
    } else if (action === 'read_dua') {
      setActiveModal('DUA');
      return;
    }
    setActiveModal('NONE');
  };

  // Prayer alarm modal handler
  const handleGoToPrayer = () => {
    setActiveModal('NONE');
    // Teleport to prayer mat inside house interior
    setSceneLocation('HOUSE_INTERIOR');
    setPlayerPos([-8, 0, 5]);
    // Start Wudu then Prayer
    setTimeout(() => {
      setActiveModal('WUDU');
    }, 400);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 font-sans relative">
      {/* 1. INTRO CUTSCENE PHASE */}
      {phase === 'INTRO' && (
        <IntroCutscene
          onFinishIntro={() => {
            soundManager.startCozyAmbientMusic();
            setPhase('CHARACTER_CREATION');
          }}
        />
      )}

      {/* 2. CHARACTER CREATION PHASE */}
      {phase === 'CHARACTER_CREATION' && (
        <CharacterCustomizer
          initialAppearance={appearance}
          onConfirm={(newApp) => {
            setAppearance(newApp);
            setPhase('GAMEPLAY');
          }}
        />
      )}

      {/* 3. MAIN GAMEPLAY 3D & UI PHASE */}
      {phase === 'GAMEPLAY' && (
        <>
          <GameCanvas
            appearance={appearance}
            playerPos={playerPos}
            sceneLocation={sceneLocation}
            playerRotY={playerRotY}
            isMoving={isMoving}
            isRidingBike={isRidingBike}
            isRidingCar={isRidingCar}
            timeOfDay={getTimeOfDayEnum(timeHour)}
            timeHour={timeHour}
            weather={weather}
            season={season}
            npcs={npcs}
            onInteractNPC={handleInteractNPC}
            onInteractObject={handleInteractObject}
            isPrayerMatSpread={isPrayerMatSpread}
            hasCleanedRoom={hasCleanedRoom}
            hasRescuedKitten={hasRescuedKitten}
            hasCleanedParkTrash={hasCleanedParkTrash}
            hasWateredFlowers={hasWateredFlowers}
            hasPlantedTree={hasPlantedTree}
            decoratedItems={[]}
            camAngleY={camAngleY}
            camPitch={camPitch}
            onRotateCam={(deltaY, deltaPitch) => {
              setCamAngleY((prev) => prev + deltaY);
              if (deltaPitch !== undefined) {
                setCamPitch((prev) => Math.min(1.2, Math.max(0.05, prev + deltaPitch)));
              }
            }}
          />

          <HUD
            stats={stats}
            dailyTasks={dailyTasks}
            timeHour={timeHour}
            timeOfDay={getTimeOfDayEnum(timeHour)}
            weather={weather}
            season={season}
            dayCount={dayCount}
            isRidingBike={isRidingBike}
            isRidingCar={isRidingCar}
            onToggleBike={() => {
              if (appearance.hasBike) {
                setIsRidingBike(!isRidingBike);
                soundManager.playBell();
              }
            }}
            onToggleCar={() => {
              setIsRidingCar(!isRidingCar);
              soundManager.playBell();
            }}
            onOpenInventory={() => setActiveModal('INVENTORY')}
            onOpenShop={() => setActiveModal('SHOP')}
            onOpenAchievements={() => setActiveModal('ACHIEVEMENTS')}
            onOpenCustomizer={() => setActiveModal('CUSTOMIZER')}
            onOpenSettings={() => {}}
            onRotateCamLeft={() => setCamAngleY((prev) => prev - Math.PI / 6)}
            onRotateCamRight={() => setCamAngleY((prev) => prev + Math.PI / 6)}
            onPitchCamUp={() => setCamPitch((prev) => Math.min(1.2, prev + 0.1))}
            onPitchCamDown={() => setCamPitch((prev) => Math.max(0.05, prev - 0.1))}
            onOpenSmartphone={() => setActiveModal('SMARTPHONE')}
            onExitGame={() => setPhase('CHARACTER_CREATION')}
            onTeleportHouse={() => {
              setSceneLocation('HOUSE_INTERIOR');
              setPlayerPos([0, 0, 10]);
              soundManager.playClick();
            }}
            onTeleportMosque={() => {
              setSceneLocation('MOSQUE_INTERIOR');
              setPlayerPos([0, 0, 14]);
              soundManager.playClick();
            }}
            onTeleportGrocery={() => {
              setActiveModal('GROCERY');
              soundManager.playClick();
            }}
            onMoveInput={(dx, dz) => {
              moveVector.current = { dx, dz };
            }}
          />

          {/* MODALS */}
          {activeModal === 'SMARTPHONE' && (
            <SmartphoneModal
              stats={stats}
              appearance={appearance}
              timeHour={timeHour}
              dayCount={dayCount}
              onClose={() => setActiveModal('NONE')}
              onTeleport={(loc) => {
                if (loc === 'HOME') {
                  setSceneLocation('HOUSE_INTERIOR');
                  setPlayerPos([0, 0, 10]);
                } else if (loc === 'MOSQUE') {
                  setSceneLocation('MOSQUE_INTERIOR');
                  setPlayerPos([0, 0, 14]);
                } else if (loc === 'SCHOOL') {
                  setSceneLocation('TOWN');
                  setPlayerPos([45, 0, 20]);
                } else if (loc === 'GROCERY') {
                  setActiveModal('GROCERY');
                } else if (loc === 'PARK') {
                  setSceneLocation('TOWN');
                  setPlayerPos([0, 0, 40]);
                }
              }}
            />
          )}

          {activeModal === 'DIALOGUE' && activeNPC && (
            <DialogueModal
              npc={activeNPC}
              onClose={() => setActiveModal('NONE')}
              onRewardExp={(exp) => addRewards(0, exp)}
              onRewardCoins={(coins) => addRewards(coins, 0)}
              onOpenSchool={() => setActiveModal('SCHOOL')}
            />
          )}
          {activeModal === 'CUSTOMIZER' && (
            <CharacterCustomizer
              initialAppearance={appearance}
              onConfirm={(newApp) => {
                setAppearance(newApp);
                setActiveModal('NONE');
              }}
              onClose={() => setActiveModal('NONE')}
            />
          )}

          {activeModal === 'BOOK_READER' && (
            <BookReaderModal
              onClose={() => setActiveModal('NONE')}
              onRewardExp={(exp) => addRewards(0, exp)}
            />
          )}

          {activeModal === 'GROCERY' && (
            <GroceryStoreModal
              userCoins={stats.coins}
              onBuyFood={(item) => {
                setStats((prev) => ({
                  ...prev,
                  coins: prev.coins - item.price,
                  energy: Math.min(100, (prev.energy ?? 100) + item.energyBonus),
                }));
                soundManager.playClick();
              }}
              onClose={() => setActiveModal('NONE')}
            />
          )}

          {activeModal === 'HOME_ACTIONS' && (
            <HomeActionsModal
              isFasting={stats.isFasting}
              energy={stats.energy}
              hunger={stats.hunger}
              onEat={() => handleHomeAction('eat')}
              onSleep={() => handleHomeAction('sleep')}
              onToggleFast={() => handleHomeAction('fast')}
              onReadBooks={() => handleHomeAction('read_book')}
              onReadDuas={() => handleHomeAction('read_dua')}
              onClose={() => setActiveModal('NONE')}
            />
          )}

          {activeModal === 'DUA' && (
            <DuaModal
              onClose={() => setActiveModal('NONE')}
              onRewardExp={(exp) => addRewards(0, exp)}
            />
          )}

          {activeModal === 'PRAYER_ALARM' && activePrayerAlarm && (
            <PrayerAlarmModal
              prayerName={activePrayerAlarm}
              onGoWudu={() => {
                setActiveModal('NONE');
                setSceneLocation('HOUSE_INTERIOR');
                setPlayerPos([0, 1, -10]);
                setTimeout(() => setActiveModal('WUDU'), 300);
              }}
              onGoPrayer={() => {
                setActiveModal('NONE');
                setSceneLocation('HOUSE_INTERIOR');
                setPlayerPos([-8, 0, 5]);
                setTimeout(() => setActiveModal('PRAYER'), 300);
              }}
              onClose={() => setActiveModal('NONE')}
            />
          )}

          {activeModal === 'WUDU' && (
            <WuduMinigameModal
              onComplete={handleWuduComplete}
              onClose={() => setActiveModal('NONE')}
            />
          )}

          {activeModal === 'PRAYER' && (
            <PrayerCinematicModal
              onComplete={handlePrayerComplete}
              onClose={() => setActiveModal('NONE')}
            />
          )}

          {activeModal === 'SCHOOL' && (
            <SchoolMinigameModal
              onComplete={handleSchoolComplete}
              onClose={() => setActiveModal('NONE')}
            />
          )}

          {activeModal === 'SHOP' && (
            <ShopModal
              items={shopItems}
              userCoins={stats.coins}
              onBuyItem={handleBuyShopItem}
              onClose={() => setActiveModal('NONE')}
            />
          )}

          {activeModal === 'INVENTORY' && (
            <InventoryModal
              ownedItems={shopItems.filter((i) => i.owned)}
              appearance={appearance}
              onUpdateAppearance={(newApp) => setAppearance(newApp)}
              onClose={() => setActiveModal('NONE')}
            />
          )}

          {activeModal === 'ACHIEVEMENTS' && (
            <AchievementsModal
              achievements={achievements}
              onClose={() => setActiveModal('NONE')}
            />
          )}

          {activeModal === 'GOOD_DEED' && activeQuest && (
            <GoodDeedsModal
              quest={activeQuest}
              onCompleteQuest={handleCompleteQuest}
              onClose={() => setActiveModal('NONE')}
            />
          )}

          {activeModal === 'BUS_TRAVEL' && (
            <BusTravelModal
              onClose={() => setActiveModal('NONE')}
              onSelectDestination={handleSelectBusDestination}
            />
          )}
        </>
      )}
    </div>
  );
}

