import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { NPCModel, NPCData } from './NPCModel';
import { CurrentSceneLocation } from '../../types/game';

interface World3DProps {
  playerPos: [number, number, number];
  sceneLocation: CurrentSceneLocation;
  npcs: NPCData[];
  onInteractNPC: (npc: NPCData) => void;
  onInteractObject: (objId: string, title: string) => void;
  isPrayerMatSpread: boolean;
  hasCleanedRoom: boolean;
  hasRescuedKitten: boolean;
  hasCleanedParkTrash: boolean;
  hasWateredFlowers: boolean;
  hasPlantedTree: boolean;
  decoratedItems: { itemId: string; position: [number, number, number] }[];
}

const MovingTraffic: React.FC = () => {
  const carRef1 = useRef<THREE.Group>(null);
  const carRef2 = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (carRef1.current) {
      carRef1.current.position.x += delta * 14;
      if (carRef1.current.position.x > 85) carRef1.current.position.x = -85;
    }
    if (carRef2.current) {
      carRef2.current.position.x -= delta * 11;
      if (carRef2.current.position.x < -85) carRef2.current.position.x = 85;
    }
  });

  return (
    <group>
      {/* Car 1 (Red Sedan driving East) */}
      <group ref={carRef1} position={[-40, 0, 37.5]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[3.8, 0.9, 1.9]} />
          <meshStandardMaterial color="#E53935" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[2.0, 0.7, 1.7]} />
          <meshStandardMaterial color="#90CAF9" metalness={0.8} />
        </mesh>
      </group>

      {/* Car 2 (Yellow Taxi driving West) */}
      <group ref={carRef2} position={[40, 0, 42.5]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[4.0, 0.9, 1.9]} />
          <meshStandardMaterial color="#FDD835" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[2.2, 0.7, 1.7]} />
          <meshStandardMaterial color="#37474F" />
        </mesh>
      </group>
    </group>
  );
};

const JamaatPrayingGroup: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const cycleTime = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    cycleTime.current = (cycleTime.current + delta) % 12;
    const t = cycleTime.current;

    let rotX = 0;
    let posY = 0;

    if (t >= 3 && t < 6) {
      // Ruku (Bowing)
      const factor = Math.sin(((t - 3) / 3) * Math.PI);
      rotX = factor * 1.1;
      posY = -factor * 0.2;
    } else if (t >= 6 && t < 9) {
      // Sujood (Prostrating)
      const factor = Math.sin(((t - 6) / 3) * Math.PI);
      rotX = factor * 1.4;
      posY = -factor * 0.7;
    } else if (t >= 9 && t < 12) {
      // Tashahhud (Sitting)
      const factor = Math.sin(((t - 9) / 3) * Math.PI);
      rotX = factor * 0.2;
      posY = -factor * 0.45;
    }

    groupRef.current.children.forEach((child) => {
      child.rotation.x = rotX;
      child.position.y = posY;
    });
  });

  const positions: [number, number, number][] = [
    // Imam
    [0, 0, -15],
    // Row 1
    [-9, 0, -9], [-6, 0, -9], [-3, 0, -9], [0, 0, -9], [3, 0, -9], [6, 0, -9], [9, 0, -9],
    // Row 2
    [-9, 0, -3], [-6, 0, -3], [-3, 0, -3], [0, 0, -3], [3, 0, -3], [6, 0, -3], [9, 0, -3],
    // Row 3
    [-9, 0, 3], [-6, 0, 3], [-3, 0, 3], [0, 0, 3], [3, 0, 3], [6, 0, 3], [9, 0, 3],
  ];

  return (
    <group ref={groupRef}>
      {positions.map((pos, idx) => {
        const isImam = idx === 0;
        const outfit = isImam ? '#FFFFFF' : (idx % 2 === 0 ? '#1E88E5' : '#43A047');
        const hatColor = isImam ? '#FFD54F' : '#ECEFF1';
        return (
          <group key={idx} position={pos}>
            <mesh position={[0, 0.8, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.28, 0.9, 16]} />
              <meshStandardMaterial color={outfit} />
            </mesh>
            <mesh position={[0, 1.4, 0]} castShadow>
              <sphereGeometry args={[0.24, 16, 16]} />
              <meshStandardMaterial color="#F5D0A9" />
            </mesh>
            <mesh position={[0, 1.55, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
              <meshStandardMaterial color={hatColor} />
            </mesh>
            {isImam && (
              <Html position={[0, 1.9, 0]} center>
                <div className="bg-amber-950/90 text-amber-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-400/50 shadow-md whitespace-nowrap">
                  👳‍♂️ Имам Мечети (Возглавляет Намаз)
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};

const MovingCityBus: React.FC<{ onInteractBus: () => void }> = ({ onInteractBus }) => {
  const busRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!busRef.current) return;
    const t = state.clock.getElapsedTime() * 0.25;
    const x = Math.sin(t) * 55;
    const z = Math.cos(t) * 40;
    busRef.current.position.set(x, 0, z);

    const nextX = Math.sin(t + 0.05) * 55;
    const nextZ = Math.cos(t + 0.05) * 40;
    const angle = Math.atan2(nextX - x, nextZ - z);
    busRef.current.rotation.y = angle;
  });

  return (
    <group ref={busRef}>
      {/* Bus Body */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[3.2, 2.4, 8.5]} />
        <meshStandardMaterial color="#1E88E5" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* White Roof */}
      <mesh position={[0, 2.85, 0]} castShadow>
        <boxGeometry args={[3.1, 0.2, 8.4]} />
        <meshStandardMaterial color="#FAFAFA" />
      </mesh>
      {/* Windows */}
      <mesh position={[0, 1.9, 0]}>
        <boxGeometry args={[3.25, 1.0, 7.5]} />
        <meshStandardMaterial color="#81D4FA" transparent opacity={0.8} />
      </mesh>
      {/* Headlights */}
      <mesh position={[1.1, 1.0, 4.3]}>
        <boxGeometry args={[0.5, 0.4, 0.2]} />
        <meshStandardMaterial color="#FFF59D" emissive="#FFF59D" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-1.1, 1.0, 4.3]}>
        <boxGeometry args={[0.5, 0.4, 0.2]} />
        <meshStandardMaterial color="#FFF59D" emissive="#FFF59D" emissiveIntensity={0.8} />
      </mesh>
      {/* Bus Overhead Sign */}
      <Html position={[0, 3.4, 0]} center>
        <div className="bg-amber-400 text-slate-950 font-extrabold text-[11px] px-3 py-1 rounded-full border border-amber-200 shadow-xl whitespace-nowrap flex items-center gap-1">
          <span>🚌 Городской Экспресс №77 (Мекка & Город)</span>
        </div>
      </Html>

      <Html position={[0, 2.2, 0]} center>
        <button
          onClick={onInteractBus}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-full shadow-2xl border-2 border-amber-200 animate-bounce cursor-pointer whitespace-nowrap"
        >
          🚌 Сесть в Автобус
        </button>
      </Html>
    </group>
  );
};

const BusStopShelter: React.FC<{ position: [number, number, number]; title: string; onInteractBus: () => void }> = ({
  position,
  title,
  onInteractBus,
}) => {
  return (
    <group position={position}>
      {/* Bench & Shelter Frame */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 3, 2]} />
        <meshStandardMaterial color="#37474F" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 3.05, 0]}>
        <boxGeometry args={[4.4, 0.2, 2.4]} />
        <meshStandardMaterial color="#0288D1" />
      </mesh>
      {/* Bench */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[3.2, 0.4, 0.8]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      {/* Stop Sign Post */}
      <group position={[2.5, 0, 0]}>
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 3.6, 12]} />
          <meshStandardMaterial color="#B0BEC5" />
        </mesh>
        <Html position={[0, 3.4, 0]} center>
          <div className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-amber-200 shadow-md whitespace-nowrap">
            🚏 {title}
          </div>
        </Html>
      </group>
      <Html position={[0, 1.5, 0]} center>
        <button
          onClick={onInteractBus}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg border border-amber-200 cursor-pointer whitespace-nowrap"
        >
          🚌 Ждать Автобус / Поехать
        </button>
      </Html>
    </group>
  );
};

const MeccaHajjScene: React.FC<{ onInteractObject: (id: string, title: string) => void }> = ({ onInteractObject }) => {
  const pilgrimsGroupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!pilgrimsGroupRef.current) return;
    pilgrimsGroupRef.current.children.forEach((child, index) => {
      const radius = 13 + (index % 5) * 3.5;
      const speed = 0.2 + (index % 3) * 0.04;
      const initialAngle = (index / 24) * Math.PI * 2;
      const currentAngle = initialAngle + state.clock.getElapsedTime() * speed;

      child.position.x = Math.cos(currentAngle) * radius;
      child.position.z = Math.sin(currentAngle) * radius;
      child.rotation.y = -currentAngle + Math.PI / 2;
      child.position.y = Math.sin(state.clock.getElapsedTime() * 4 + index) * 0.05;
    });
  });

  return (
    <group>
      {/* White Marble Mataf Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color="#F5F5F5" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Surrounding Mosque Porticos */}
      <mesh position={[0, 8, -65]} receiveShadow>
        <boxGeometry args={[130, 16, 4]} />
        <meshStandardMaterial color="#FAFAFA" />
      </mesh>
      <mesh position={[0, 8, 65]} receiveShadow>
        <boxGeometry args={[130, 16, 4]} />
        <meshStandardMaterial color="#FAFAFA" />
      </mesh>
      <mesh position={[65, 8, 0]} receiveShadow>
        <boxGeometry args={[4, 16, 130]} />
        <meshStandardMaterial color="#FAFAFA" />
      </mesh>
      <mesh position={[-65, 8, 0]} receiveShadow>
        <boxGeometry args={[4, 16, 130]} />
        <meshStandardMaterial color="#FAFAFA" />
      </mesh>

      {/* Grand Minarets */}
      {[[-60, -60], [60, -60], [-60, 60], [60, 60]].map(([mx, mz], idx) => (
        <group key={idx} position={[mx, 0, mz]}>
          <mesh position={[0, 20, 0]} castShadow>
            <cylinderGeometry args={[2.5, 3.5, 40, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>
          <mesh position={[0, 41, 0]} castShadow>
            <coneGeometry args={[2.8, 6, 16]} />
            <meshStandardMaterial color="#FFD54F" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* HOLY KAABA */}
      <group position={[0, 7, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[12, 14, 12]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>

        {/* Shimmering Golden Kiswa Band */}
        <mesh position={[0, 3.8, 0]}>
          <boxGeometry args={[12.2, 1.8, 12.2]} />
          <meshStandardMaterial color="#FFD54F" metalness={0.9} roughness={0.2} emissive="#FFD54F" emissiveIntensity={0.25} />
        </mesh>

        {/* Golden Door of Kaaba */}
        <mesh position={[3.5, -0.5, 6.15]}>
          <boxGeometry args={[2.8, 5.5, 0.2]} />
          <meshStandardMaterial color="#FFC107" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Hajar al-Aswad */}
        <mesh position={[5.9, -3.2, 5.9]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#B0BEC5" metalness={0.9} roughness={0.1} />
        </mesh>

        <Html position={[0, 9.5, 0]} center>
          <div className="bg-amber-950/90 text-amber-300 font-serif font-extrabold text-sm px-4 py-1.5 rounded-full border-2 border-yellow-400/80 shadow-2xl whitespace-nowrap">
            🕋 Священная Кааба (Мекка, Саудовская Аравия)
          </div>
        </Html>
      </group>

      {/* Hijr Ismail */}
      <group position={[0, 0, -10]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.6, 0]}>
          <ringGeometry args={[5, 6.2, 24, 1, 0, Math.PI]} />
          <meshStandardMaterial color="#F5F5F5" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Maqam Ibrahim */}
      <group position={[9, 1.2, 5]}>
        <mesh castShadow>
          <cylinderGeometry args={[1.2, 1.4, 2.4, 16]} />
          <meshStandardMaterial color="#FFD54F" metalness={0.8} transparent opacity={0.85} />
        </mesh>
        <Html position={[0, 1.8, 0]} center>
          <button
            onClick={() => onInteractObject('maqam_ibrahim', 'Макам Ибрахима')}
            className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg border border-amber-300 cursor-pointer whitespace-nowrap"
          >
            🤲 Молитва у Макама Ибрахима
          </button>
        </Html>
      </group>

      {/* Zamzam Water Fountain */}
      <group position={[-14, 1.0, 10]}>
        <mesh castShadow>
          <cylinderGeometry args={[2.0, 2.2, 1.4, 16]} />
          <meshStandardMaterial color="#00897B" metalness={0.4} />
        </mesh>
        <Html position={[0, 1.6, 0]} center>
          <button
            onClick={() => onInteractObject('zamzam_water', 'Зам-Зам')}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-full shadow-xl border border-cyan-300 animate-pulse cursor-pointer whitespace-nowrap"
          >
            💧 Пить Воду Зам-Зам (+Здоровье, +Баракат)
          </button>
        </Html>
      </group>

      {/* Interactive Tawaf Ritual Button */}
      <group position={[0, 0, 14]}>
        <Html position={[0, 1.2, 0]} center>
          <button
            onClick={() => onInteractObject('tawaf_ritual', 'Таваф')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm px-5 py-3 rounded-full shadow-2xl border-2 border-yellow-200 animate-bounce cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <span>🕋</span>
            <span>Совершить Священный Таваф (7 кругов вокруг Каабы)</span>
          </button>
        </Html>
      </group>

      {/* Return Express Flight / Bus to Town */}
      <group position={[0, 0, 45]}>
        <Html position={[0, 1.5, 0]} center>
          <button
            onClick={() => onInteractObject('return_from_mecca', 'Вернуться')}
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs px-4 py-2.5 rounded-full shadow-2xl border border-amber-400/50 cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <span>✈️</span>
            <span>Вернуться в Родной Город на Экспрессе</span>
          </button>
        </Html>
      </group>

      {/* Pilgrims in Ihram */}
      <group ref={pilgrimsGroupRef}>
        {Array.from({ length: 24 }).map((_, i) => (
          <group key={i}>
            <mesh position={[0, 0.8, 0]} castShadow>
              <cylinderGeometry args={[0.24, 0.3, 1.0, 16]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
            </mesh>
            <mesh position={[0, 1.45, 0]} castShadow>
              <sphereGeometry args={[0.24, 16, 16]} />
              <meshStandardMaterial color="#D7CCC8" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

export const World3D: React.FC<World3DProps> = ({
  playerPos,
  sceneLocation,
  npcs,
  onInteractNPC,
  onInteractObject,
  isPrayerMatSpread,
  hasCleanedRoom,
  hasRescuedKitten,
  hasCleanedParkTrash,
  hasWateredFlowers,
  hasPlantedTree,
}) => {
  // Helper distance check for prompt tags
  const distTo = (pos: [number, number, number]) => {
    const dx = playerPos[0] - pos[0];
    const dy = playerPos[1] - pos[1];
    const dz = playerPos[2] - pos[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  // IF IN MECCA HAJJ SCENE
  if (sceneLocation === 'MECCA_HAJJ') {
    return <MeccaHajjScene onInteractObject={onInteractObject} />;
  }

  // IF INSIDE HOUSE INTERIOR
  if (sceneLocation === 'HOUSE_INTERIOR') {
    return (
      <group>
        {/* Interior Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#8D6E63" roughness={0.4} />
        </mesh>
        {/* Interior Walls */}
        {/* Back Wall */}
        <mesh position={[0, 4, -15]} receiveShadow>
          <boxGeometry args={[30, 8, 0.5]} />
          <meshStandardMaterial color="#FFF8E1" />
        </mesh>
        {/* Left Wall */}
        <mesh position={[-15, 4, 0]} receiveShadow>
          <boxGeometry args={[0.5, 8, 30]} />
          <meshStandardMaterial color="#FFF8E1" />
        </mesh>
        {/* Right Wall */}
        <mesh position={[15, 4, 0]} receiveShadow>
          <boxGeometry args={[0.5, 8, 30]} />
          <meshStandardMaterial color="#FFF8E1" />
        </mesh>

        {/* Bedroom Area - Bed */}
        <group position={[-8, 0.5, -8]}>
          <mesh castShadow position={[0, 0.3, 0]}>
            <boxGeometry args={[4, 0.7, 5]} />
            <meshStandardMaterial color="#1E88E5" />
          </mesh>
          <mesh position={[0, 0.68, 0.5]} castShadow>
            <boxGeometry args={[3.8, 0.1, 3.8]} />
            <meshStandardMaterial color="#64B5F6" />
          </mesh>
          <mesh position={[0, 0.75, -1.8]} castShadow>
            <boxGeometry args={[3.2, 0.2, 1.2]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <Html position={[0, 2.0, 0]} center>
            <button
              onClick={() => onInteractObject('bed', 'Кровать')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-full shadow-xl border border-indigo-300 animate-pulse cursor-pointer whitespace-nowrap"
            >
              🛌 Спать / Отдохнуть
            </button>
          </Html>
        </group>

        {/* Dining Area - Kitchen Table */}
        <group position={[8, 0.8, -8]}>
          <mesh castShadow position={[0, 0.4, 0]}>
            <boxGeometry args={[5, 0.8, 3.5]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
          <Html position={[0, 2.0, 0]} center>
            <button
              onClick={() => onInteractObject('kitchen_table', 'Стол')}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3.5 py-2 rounded-full shadow-xl border border-amber-300 animate-pulse cursor-pointer whitespace-nowrap"
            >
              🍞 Покушать / Трапеза (Ифтар/Завтрак)
            </button>
          </Html>
        </group>

        {/* Refrigerator */}
        <group position={[12, 1.8, -12]}>
          <mesh castShadow>
            <boxGeometry args={[2.2, 3.6, 2.2]} />
            <meshStandardMaterial color="#CFD8DC" metalness={0.4} roughness={0.3} />
          </mesh>
          <Html position={[0, 2.4, 0]} center>
            <button
              onClick={() => onInteractObject('fridge', 'Холодильник')}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-xl border border-sky-300 cursor-pointer whitespace-nowrap"
            >
              🧊 Открыть холодильник (Финики, Молоко)
            </button>
          </Html>
        </group>

        {/* Living Room Sofa */}
        <group position={[0, 0.6, 0]}>
          <mesh castShadow position={[0, 0.3, 0]}>
            <boxGeometry args={[6, 0.7, 2.5]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.6} />
          </mesh>
          <Html position={[0, 1.5, 0]} center>
            <button
              onClick={() => onInteractObject('sofa', 'Диван')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-xl border border-emerald-300 cursor-pointer whitespace-nowrap"
            >
              🛋️ Сесть на уютный диван
            </button>
          </Html>
        </group>

        {/* Interactive Window */}
        <group position={[0, 5, -14.6]}>
          <mesh castShadow>
            <boxGeometry args={[4, 3, 0.2]} />
            <meshStandardMaterial color="#81D4FA" transparent opacity={0.6} />
          </mesh>
          <Html position={[0, 0, 0.2]} center>
            <button
              onClick={() => onInteractObject('window', 'Окно')}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-xl border border-teal-300 cursor-pointer whitespace-nowrap"
            >
              🪟 Открыть / Закрыть окно
            </button>
          </Html>
        </group>

        {/* Wall Clock */}
        <group position={[-8, 5.5, -14.6]}>
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 0.15, 24]} />
            <meshStandardMaterial color="#FAFAFA" />
          </mesh>
          <Html position={[0, 0, 0.2]} center>
            <button
              onClick={() => onInteractObject('clock', 'Часы')}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] px-2.5 py-1 rounded-full border border-amber-400/40 cursor-pointer whitespace-nowrap"
            >
              ⏰ Время на часах
            </button>
          </Html>
        </group>

        {/* Prayer Corner */}
        <group position={[-8, 0.05, 5]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[3.5, 5]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.7} />
          </mesh>
          <Html position={[0, 1.8, 0]} center>
            <button
              onClick={() => onInteractObject('prayer_mat', 'Коврик')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-full shadow-xl border border-emerald-300 animate-bounce cursor-pointer whitespace-nowrap"
            >
              🕌 Совершить Намаз
            </button>
          </Html>
        </group>

        {/* Quran Stand & Library Shelf */}
        <group position={[8, 1.5, 5]}>
          <mesh castShadow>
            <boxGeometry args={[3.5, 3, 1.2]} />
            <meshStandardMaterial color="#4E342E" />
          </mesh>
          <Html position={[0, 2.2, 0]} center>
            <button
              onClick={() => onInteractObject('read_quran', 'Коран')}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-3.5 py-2 rounded-full shadow-xl border border-teal-300 animate-bounce cursor-pointer whitespace-nowrap"
            >
              📖 Читать Коран и Книги
            </button>
          </Html>
        </group>

        {/* Bathroom Sink for Wudu */}
        <group position={[0, 1.0, -12]}>
          <mesh castShadow>
            <boxGeometry args={[2.5, 1.2, 1.5]} />
            <meshStandardMaterial color="#ECEFF1" />
          </mesh>
          <Html position={[0, 1.8, 0]} center>
            <button
              onClick={() => onInteractObject('sink', 'Омовение')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-3.5 py-2 rounded-full shadow-xl border border-cyan-300 animate-pulse cursor-pointer whitespace-nowrap"
            >
              💧 Совершить омовение (Вуду)
            </button>
          </Html>
        </group>

        {/* Family NPCs inside the Cozy House */}
        {/* Mom NPC near kitchen */}
        <group position={[6, 0, -6]}>
          <NPCModel
            npc={{
              id: 'mom',
              name: 'Мама Марьям',
              role: 'Заботливая Мама',
              type: 'human',
              position: [6, 0, -6],
              gender: 'girl',
              outfitColor: '#C62828',
            }}
            isNearby={distTo([6, 0, -6]) < 4}
            onInteract={onInteractNPC}
          />
        </group>

        {/* Dad NPC near books */}
        <group position={[6, 0, 4]}>
          <NPCModel
            npc={{
              id: 'dad',
              name: 'Папа Сулейман',
              role: 'Глава Семейства',
              type: 'human',
              position: [6, 0, 4],
              gender: 'boy',
              outfitColor: '#1976D2',
            }}
            isNearby={distTo([6, 0, 4]) < 4}
            onInteract={onInteractNPC}
          />
        </group>

        {/* Little Brother NPC near bed */}
        <group position={[-5, 0, -5]}>
          <NPCModel
            npc={{
              id: 'brother',
              name: 'Братишка Умар',
              role: 'Младший Брат',
              type: 'human',
              position: [-5, 0, -5],
              gender: 'boy',
              outfitColor: '#F59E0B',
            }}
            isNearby={distTo([-5, 0, -5]) < 4}
            onInteract={onInteractNPC}
          />
        </group>

        {/* Sister NPC near rug */}
        <group position={[-5, 0, 4]}>
          <NPCModel
            npc={{
              id: 'sister',
              name: 'Сестренка Асия',
              role: 'Младшая Сестра',
              type: 'human',
              position: [-5, 0, 4],
              gender: 'girl',
              outfitColor: '#7B1FA2',
            }}
            isNearby={distTo([-5, 0, 4]) < 4}
            onInteract={onInteractNPC}
          />
        </group>

        {/* Exit Door to Town */}
        <group position={[0, 1.5, 14]}>
          <mesh castShadow>
            <boxGeometry args={[3.5, 3, 0.3]} />
            <meshStandardMaterial color="#3E2723" />
          </mesh>
          <Html position={[0, 2.0, 0]} center>
            <button
              onClick={() => onInteractObject('exit_to_town', 'Выход')}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-2xl border-2 border-rose-300 animate-bounce cursor-pointer flex items-center gap-2"
            >
              <span>🚪</span>
              <span>Выйти на улицу (В город)</span>
            </button>
          </Html>
        </group>
      </group>
    );
  }

  // IF INSIDE MOSQUE INTERIOR
  if (sceneLocation === 'MOSQUE_INTERIOR') {
    return (
      <group>
        {/* Grand Mosque Carpet */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#00695C" roughness={0.4} />
        </mesh>
        {/* Mosque Interior Walls */}
        <mesh position={[0, 6, -20]} receiveShadow>
          <boxGeometry args={[40, 12, 0.6]} />
          <meshStandardMaterial color="#FAFAFA" />
        </mesh>
        <mesh position={[-20, 6, 0]} receiveShadow>
          <boxGeometry args={[0.6, 12, 40]} />
          <meshStandardMaterial color="#FAFAFA" />
        </mesh>
        <mesh position={[20, 6, 0]} receiveShadow>
          <boxGeometry args={[0.6, 12, 40]} />
          <meshStandardMaterial color="#FAFAFA" />
        </mesh>

        {/* Dynamic Synchronized Jama'at Prayer Worshippers */}
        <JamaatPrayingGroup />

        {/* Mihrab (Niche in Qibla Wall) */}
        <group position={[0, 3.5, -19.5]}>
          <mesh castShadow>
            <boxGeometry args={[6, 7, 1]} />
            <meshStandardMaterial color="#FFD54F" metalness={0.6} roughness={0.3} />
          </mesh>
          <Html position={[0, 4.2, 0]} center>
            <button
              onClick={() => onInteractObject('prayer_mat', 'Молитва')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-2xl border-2 border-emerald-300 animate-bounce cursor-pointer flex items-center gap-2"
            >
              <span>🕌</span>
              <span>Совершить Совместный Намаз</span>
            </button>
          </Html>
        </group>

        {/* Mosque Quran Library */}
        <group position={[-12, 1.5, -8]}>
          <mesh castShadow>
            <boxGeometry args={[4, 3, 1.5]} />
            <meshStandardMaterial color="#4E342E" />
          </mesh>
          <Html position={[0, 2.2, 0]} center>
            <button
              onClick={() => onInteractObject('read_quran', 'Библиотека Корана')}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-xl border border-teal-300 animate-pulse cursor-pointer whitespace-nowrap"
            >
              📖 Библиотека Корана и Дуа
            </button>
          </Html>
        </group>

        {/* Wudu Fountain */}
        <group position={[12, 0.6, -8]}>
          <mesh castShadow>
            <cylinderGeometry args={[2.5, 2.8, 1.2, 24]} />
            <meshStandardMaterial color="#B0BEC5" />
          </mesh>
          <Html position={[0, 1.5, 0]} center>
            <button
              onClick={() => onInteractObject('sink', 'Омовение')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-xl border border-cyan-300 animate-pulse cursor-pointer whitespace-nowrap"
            >
              💧 Фонтан Омовения (Вуду)
            </button>
          </Html>
        </group>

        {/* Exit Door */}
        <group position={[0, 1.5, 19]}>
          <mesh castShadow>
            <boxGeometry args={[4, 3, 0.4]} />
            <meshStandardMaterial color="#3E2723" />
          </mesh>
          <Html position={[0, 2.0, 0]} center>
            <button
              onClick={() => onInteractObject('exit_to_town', 'Выход')}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-2xl border-2 border-rose-300 animate-bounce cursor-pointer flex items-center gap-2"
            >
              <span>🚪</span>
              <span>Выйти на улицу (В город)</span>
            </button>
          </Html>
        </group>
      </group>
    );
  }

  // IF INSIDE SCHOOL INTERIOR
  if (sceneLocation === 'SCHOOL_INTERIOR') {
    return (
      <group>
        {/* Classroom Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[36, 36]} />
          <meshStandardMaterial color="#A1887F" roughness={0.4} />
        </mesh>
        {/* Classroom Walls */}
        <mesh position={[0, 5, -18]} receiveShadow>
          <boxGeometry args={[36, 10, 0.5]} />
          <meshStandardMaterial color="#FFF9C4" />
        </mesh>
        <mesh position={[-18, 5, 0]} receiveShadow>
          <boxGeometry args={[0.5, 10, 36]} />
          <meshStandardMaterial color="#FFF9C4" />
        </mesh>
        <mesh position={[18, 5, 0]} receiveShadow>
          <boxGeometry args={[0.5, 10, 36]} />
          <meshStandardMaterial color="#FFF9C4" />
        </mesh>

        {/* Large Green Chalk Blackboard */}
        <group position={[0, 4.5, -17.5]}>
          <mesh castShadow>
            <boxGeometry args={[16, 5, 0.2]} />
            <meshStandardMaterial color="#1B5E20" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[16.2, 5.2, 0.05]} />
            <meshStandardMaterial color="#4E342E" />
          </mesh>
          <Html position={[0, 0, 0.2]} center>
            <div className="text-center font-serif text-amber-200 select-none bg-emerald-950/80 p-3 rounded-xl border border-emerald-500/40 shadow-2xl">
              <div className="text-lg font-bold text-amber-300">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
              <div className="text-xs text-emerald-200 mt-1 font-sans">Школьный Урок: Нравственность, Знания и Математика</div>
              <div className="text-[11px] text-amber-100 font-mono mt-0.5">2 + 2 = 4 | 5 × 5 = 25</div>
            </div>
          </Html>
        </group>

        {/* Teacher Desk & Teacher Ahmed */}
        <group position={[0, 1.2, -10]}>
          <mesh castShadow>
            <boxGeometry args={[5, 1.4, 2]} />
            <meshStandardMaterial color="#3E2723" />
          </mesh>
          <Html position={[0, 1.8, 0]} center>
            <button
              onClick={() => onInteractObject('school_entrance', 'Урок')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-xl border border-indigo-300 animate-bounce cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>👨‍🏫</span>
              <span>Начать Урок с Учителем Ахмедом</span>
            </button>
          </Html>
        </group>

        {/* Teacher Ahmed NPC */}
        <group position={[0, 0, -12]}>
          <NPCModel
            npc={{
              id: 'teacher',
              name: 'Учитель Ахмед',
              role: 'Преподаватель',
              type: 'human',
              position: [0, 0, -12],
              gender: 'boy',
              outfitColor: '#1A237E',
            }}
            isNearby={distTo([0, 0, -12]) < 4}
            onInteract={onInteractNPC}
          />
        </group>

        {/* Student Desks (Парты) & Chairs */}
        {/* Row 1 Left - Yusuf */}
        <group position={[-6, 0.8, -2]}>
          <mesh castShadow>
            <boxGeometry args={[3, 1.2, 1.8]} />
            <meshStandardMaterial color="#6D4C41" />
          </mesh>
        </group>
        <group position={[-6, 0, -2]}>
          <NPCModel
            npc={{
              id: 'friend_yusuf',
              name: 'Друг Юсуф',
              role: 'Одноклассник',
              type: 'human',
              position: [-6, 0, -2],
              gender: 'boy',
              outfitColor: '#0288D1',
            }}
            isNearby={distTo([-6, 0, -2]) < 4}
            onInteract={onInteractNPC}
          />
        </group>

        {/* Row 1 Right - Maryam */}
        <group position={[6, 0.8, -2]}>
          <mesh castShadow>
            <boxGeometry args={[3, 1.2, 1.8]} />
            <meshStandardMaterial color="#6D4C41" />
          </mesh>
        </group>
        <group position={[6, 0, -2]}>
          <NPCModel
            npc={{
              id: 'friend_maryam',
              name: 'Подруга Марьям',
              role: 'Одноклассница',
              type: 'human',
              position: [6, 0, -2],
              gender: 'girl',
              outfitColor: '#D81B60',
            }}
            isNearby={distTo([6, 0, -2]) < 4}
            onInteract={onInteractNPC}
          />
        </group>

        {/* Row 2 Left - Empty Desk for Player */}
        <group position={[-6, 0.8, 4]}>
          <mesh castShadow>
            <boxGeometry args={[3, 1.2, 1.8]} />
            <meshStandardMaterial color="#6D4C41" />
          </mesh>
          <Html position={[0, 1.6, 0]} center>
            <button
              onClick={() => onInteractObject('school_entrance', 'Парта')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg border border-emerald-300 animate-pulse cursor-pointer whitespace-nowrap"
            >
              ✍️ Сесть за парту и Учиться (+Ум, +XP)
            </button>
          </Html>
        </group>

        {/* Classroom Bookcases (Шкафы с учебниками) */}
        <group position={[-15, 2.5, -5]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 5, 6]} />
            <meshStandardMaterial color="#4E342E" />
          </mesh>
          <Html position={[0.8, 0, 0]} center>
            <button
              onClick={() => onInteractObject('read_quran', 'Учебники')}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg border border-amber-300 cursor-pointer whitespace-nowrap"
            >
              📚 Школьные Учебники
            </button>
          </Html>
        </group>

        {/* Exit Door */}
        <group position={[0, 1.5, 17]}>
          <mesh castShadow>
            <boxGeometry args={[3.5, 3, 0.4]} />
            <meshStandardMaterial color="#3E2723" />
          </mesh>
          <Html position={[0, 2.0, 0]} center>
            <button
              onClick={() => onInteractObject('exit_to_town', 'Выход')}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-2xl border-2 border-rose-300 animate-bounce cursor-pointer flex items-center gap-2"
            >
              <span>🚪</span>
              <span>Выйти на улицу (В город)</span>
            </button>
          </Html>
        </group>
      </group>
    );
  }

  // IF INSIDE GROCERY STORE INTERIOR
  if (sceneLocation === 'GROCERY_INTERIOR') {
    return (
      <group>
        {/* Store Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#E0E0E0" roughness={0.3} />
        </mesh>
        {/* Store Walls */}
        <mesh position={[0, 5, -15]} receiveShadow>
          <boxGeometry args={[30, 10, 0.5]} />
          <meshStandardMaterial color="#E8F5E9" />
        </mesh>
        <mesh position={[-15, 5, 0]} receiveShadow>
          <boxGeometry args={[0.5, 10, 30]} />
          <meshStandardMaterial color="#E8F5E9" />
        </mesh>
        <mesh position={[15, 5, 0]} receiveShadow>
          <boxGeometry args={[0.5, 10, 30]} />
          <meshStandardMaterial color="#E8F5E9" />
        </mesh>

        {/* Cashier Counter & Aunt Amina */}
        <group position={[0, 1.2, -8]}>
          <mesh castShadow>
            <boxGeometry args={[6, 1.4, 2]} />
            <meshStandardMaterial color="#4CAF50" />
          </mesh>
          <Html position={[0, 1.8, 0]} center>
            <button
              onClick={() => onInteractObject('open_grocery_modal', 'Касса')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-full shadow-2xl border-2 border-amber-200 animate-bounce cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <span>🛒</span>
              <span>Положить продукты в корзину & Оплатить на кассе</span>
            </button>
          </Html>
        </group>

        {/* Aunt Amina NPC */}
        <group position={[0, 0, -10]}>
          <NPCModel
            npc={{
              id: 'aunt_amina',
              name: 'Тетя Амина',
              role: 'Продавщица',
              type: 'human',
              position: [0, 0, -10],
              gender: 'girl',
              outfitColor: '#EC407A',
            }}
            isNearby={distTo([0, 0, -10]) < 4}
            onInteract={() => onInteractObject('open_grocery_modal', 'Касса')}
          />
        </group>

        {/* Store Shelves (Полки с продуктами) */}
        <group position={[-10, 2, -4]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 4, 10]} />
            <meshStandardMaterial color="#795548" />
          </mesh>
          <Html position={[1, 0, 0]} center>
            <button
              onClick={() => onInteractObject('open_grocery_modal', 'Полка')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg border border-emerald-300 cursor-pointer whitespace-nowrap"
            >
              🌴 Финики, Молоко, Мед
            </button>
          </Html>
        </group>

        <group position={[10, 2, -4]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 4, 10]} />
            <meshStandardMaterial color="#795548" />
          </mesh>
          <Html position={[-1, 0, 0]} center>
            <button
              onClick={() => onInteractObject('open_grocery_modal', 'Полка')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg border border-emerald-300 cursor-pointer whitespace-nowrap"
            >
              🍞 Свежий Хлеб и Фрукты
            </button>
          </Html>
        </group>

        {/* Exit Door */}
        <group position={[0, 1.5, 14]}>
          <mesh castShadow>
            <boxGeometry args={[3.5, 3, 0.4]} />
            <meshStandardMaterial color="#3E2723" />
          </mesh>
          <Html position={[0, 2.0, 0]} center>
            <button
              onClick={() => onInteractObject('exit_to_town', 'Выход')}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-2xl border-2 border-rose-300 animate-bounce cursor-pointer flex items-center gap-2"
            >
              <span>🚪</span>
              <span>Выйти на улицу (В город)</span>
            </button>
          </Html>
        </group>
      </group>
    );
  }

  // DEFAULT: TOWN / CITY ENVIRONMENT
  return (
    <group>
      {/* AUTONOMOUS TRAFFIC CARS & PUBLIC CITY BUS */}
      <MovingTraffic />
      <MovingCityBus onInteractBus={() => onInteractObject('open_bus_modal', 'Автобус')} />

      {/* BUS STOPS ACROSS THE CITY */}
      <BusStopShelter
        position={[-15, 0, 5]}
        title="Остановка: Жилой Дом"
        onInteractBus={() => onInteractObject('open_bus_modal', 'Автобус')}
      />
      <BusStopShelter
        position={[15, 0, -40]}
        title="Остановка: Мечеть"
        onInteractBus={() => onInteractObject('open_bus_modal', 'Автобус')}
      />
      <BusStopShelter
        position={[35, 0, 25]}
        title="Остановка: Школа №1"
        onInteractBus={() => onInteractObject('open_bus_modal', 'Автобус')}
      />
      <BusStopShelter
        position={[-50, 0, 35]}
        title="Секретный Рейс: Мекка (Саудовская Аравия)"
        onInteractBus={() => onInteractObject('open_bus_modal', 'Автобус')}
      />

      {/* GROUND & PATHWAYS */}
      {/* Main Grass Plain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="#4CAF50" roughness={0.9} />
      </mesh>

      {/* Main Cobblestone Roads Connecting Locations */}
      {/* House to Plaza Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 10]} receiveShadow>
        <planeGeometry args={[8, 60]} />
        <meshStandardMaterial color="#D7CCC8" roughness={0.7} />
      </mesh>
      {/* East-West Highway connecting Mosque, School, Shop, Village */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 40]} receiveShadow>
        <planeGeometry args={[160, 10]} />
        <meshStandardMaterial color="#BCAAA4" roughness={0.7} />
      </mesh>

      {/* ========================================================== */}
      {/* 1. PLAYER HOUSE (Pos: X: -15, Z: -20) */}
      {/* ========================================================== */}
      <group position={[-15, 0, -20]}>
        {/* House Base */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 5, 12]} />
          <meshStandardMaterial color="#FFF8E1" roughness={0.6} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[11, 3.5, 4]} />
          <meshStandardMaterial color="#D84315" roughness={0.5} />
        </mesh>
        {/* Front Door */}
        <mesh position={[0, 1.3, 6.05]} castShadow>
          <boxGeometry args={[2, 2.6, 0.2]} />
          <meshStandardMaterial color="#5D4037" roughness={0.7} />
        </mesh>

        {/* Always visible overhead building sign */}
        <Html position={[0, 8.5, 0]} center>
          <div className="bg-slate-900/90 text-amber-300 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-400/50 shadow-lg whitespace-nowrap">
            🏡 Ваш Дом
          </div>
        </Html>

        {/* Enter House Door Trigger */}
        {distTo([-15, 0, -14]) < 15 && (
          <Html position={[0, 2.5, 6.5]} center>
            <button
              onClick={() => onInteractObject('enter_house', 'Дом')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm px-4 py-2.5 rounded-full shadow-2xl border-2 border-emerald-300 animate-bounce cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <span>🏡</span>
              <span>Войти в Дом (Еда, Сон, Коран, Намаз)</span>
            </button>
          </Html>
        )}
      </group>

      {/* ========================================================== */}
      {/* SURROUNDING RESIDENTIAL HOUSES & BOUTIQUES */}
      {/* ========================================================== */}
      {/* House 2: Neighbor House Left */}
      <group position={[-40, 0, -20]}>
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[12, 5, 10]} />
          <meshStandardMaterial color="#E0F2F1" roughness={0.6} />
        </mesh>
        <mesh position={[0, 6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[10, 3, 4]} />
          <meshStandardMaterial color="#00695C" roughness={0.5} />
        </mesh>
        <Html position={[0, 8, 0]} center>
          <div className="bg-slate-900/80 text-teal-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-teal-500/30">
            🏠 Соседский Дом №2
          </div>
        </Html>
      </group>

      {/* House 3: Neighbor House Right */}
      <group position={[15, 0, -20]}>
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[12, 5, 10]} />
          <meshStandardMaterial color="#FFF3E0" roughness={0.6} />
        </mesh>
        <mesh position={[0, 6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[10, 3, 4]} />
          <meshStandardMaterial color="#E65100" roughness={0.5} />
        </mesh>
        <Html position={[0, 8, 0]} center>
          <div className="bg-slate-900/80 text-amber-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/30">
            🏠 Соседский Дом №3
          </div>
        </Html>
      </group>

      {/* Boutique 1: Modest Clothing Boutique */}
      <group position={[35, 0, -20]}>
        <mesh position={[0, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 6, 10]} />
          <meshStandardMaterial color="#F3E5F5" roughness={0.4} />
        </mesh>
        <mesh position={[0, 3.2, 5.1]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[14.2, 0.2, 2.2]} />
          <meshStandardMaterial color="#AB47BC" />
        </mesh>
        <Html position={[0, 7.5, 0]} center>
          <div className="bg-purple-950/90 text-purple-200 font-bold text-xs px-3 py-1 rounded-full border border-purple-400/40">
            👗 Бутик Скромной Одежды
          </div>
        </Html>
      </group>

      {/* Boutique 2: Islamic Bookstore */}
      <group position={[-35, 0, 15]}>
        <mesh position={[0, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[13, 6, 10]} />
          <meshStandardMaterial color="#E8F5E9" roughness={0.4} />
        </mesh>
        <mesh position={[0, 3.2, 5.1]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[13.2, 0.2, 2.2]} />
          <meshStandardMaterial color="#2E7D32" />
        </mesh>
        <Html position={[0, 7.5, 0]} center>
          <div className="bg-emerald-950/90 text-emerald-200 font-bold text-xs px-3 py-1 rounded-full border border-emerald-400/40">
            📚 Книжный Магазин Мудрости
          </div>
        </Html>
      </group>

      {/* House 4: Villa near park */}
      <group position={[40, 0, -45]}>
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[15, 7, 12]} />
          <meshStandardMaterial color="#F5F5F5" roughness={0.3} />
        </mesh>
        <mesh position={[0, 7.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[12, 3.5, 4]} />
          <meshStandardMaterial color="#1565C0" roughness={0.5} />
        </mesh>
        <Html position={[0, 10, 0]} center>
          <div className="bg-slate-900/80 text-blue-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-blue-500/30">
            🏡 Красивая Вилла
          </div>
        </Html>
      </group>

      {/* ========================================================== */}
      {/* 2. GROCERY STORE (Pos: X: -35, Z: -15) */}
      {/* ========================================================== */}
      <group position={[-35, 0, -15]}>
        <mesh position={[0, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[12, 6, 10]} />
          <meshStandardMaterial color="#4CAF50" roughness={0.5} />
        </mesh>
        {/* Awning */}
        <mesh position={[0, 3.2, 5.2]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[12.5, 0.2, 2]} />
          <meshStandardMaterial color="#FFEB3B" />
        </mesh>
        <Html position={[0, 8, 0]} center>
          <div className="bg-emerald-950/90 text-amber-300 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-400/50 shadow-lg whitespace-nowrap">
            🛒 Магазин Продуктов Халяль
          </div>
        </Html>
        {distTo([-35, 0, -10]) < 14 && (
          <Html position={[0, 2.2, 5.5]} center>
            <button
              onClick={() => onInteractObject('enter_grocery', 'Продукты')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm px-4 py-2 rounded-full shadow-xl border-2 border-amber-200 animate-bounce cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <span>🛒</span>
              <span>Войти в Магазин (Тетя Амина, Полки, Продукты)</span>
            </button>
          </Html>
        )}
      </group>

      {/* ========================================================== */}
      {/* 3. PARKED CAR (Pos: X: -6, Z: -14) */}
      {/* ========================================================== */}
      <group position={[-6, 0, -14]}>
        {/* Car Body */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[2.2, 0.8, 4.2]} />
          <meshStandardMaterial color="#1E88E5" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.2, -0.2]} castShadow>
          <boxGeometry args={[2.0, 0.7, 2.2]} />
          <meshStandardMaterial color="#64B5F6" metalness={0.8} roughness={0.1} />
        </mesh>
        {distTo([-6, 0, -14]) < 4 && (
          <Html position={[0, 2.0, 0]} center>
            <button
              onClick={() => onInteractObject('drive_car', 'Машина')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-2 rounded-full shadow-lg border border-blue-300 animate-pulse cursor-pointer flex items-center gap-1.5"
            >
              <span>🚗</span>
              <span>Сесть в Машину</span>
            </button>
          </Html>
        )}
      </group>

      {/* ========================================================== */}
      {/* 4. GRAND MOSQUE (Pos: X: 0, Z: -70) */}
      {/* ========================================================== */}
      <group position={[0, 0, -70]}>
        {/* Courtyard */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
          <planeGeometry args={[44, 44]} />
          <meshStandardMaterial color="#ECEFF1" roughness={0.3} />
        </mesh>

        {/* Main Mosque Body */}
        <mesh position={[0, 5, -5]} castShadow receiveShadow>
          <boxGeometry args={[24, 10, 20]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.3} />
        </mesh>

        {/* Turquoise Dome */}
        <mesh position={[0, 12, -5]} castShadow>
          <sphereGeometry args={[7, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
          <meshStandardMaterial color="#00897B" metalness={0.2} roughness={0.3} />
        </mesh>
        <mesh position={[0, 17.5, -5]}>
          <torusGeometry args={[0.8, 0.15, 12, 24, Math.PI * 1.5]} />
          <meshStandardMaterial color="#FFD54F" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Minarets */}
        <group position={[-14, 0, 5]}>
          <mesh position={[0, 9, 0]} castShadow>
            <cylinderGeometry args={[1.5, 2.0, 18, 16]} />
            <meshStandardMaterial color="#FAFAFA" />
          </mesh>
        </group>
        <group position={[14, 0, 5]}>
          <mesh position={[0, 9, 0]} castShadow>
            <cylinderGeometry args={[1.5, 2.0, 18, 16]} />
            <meshStandardMaterial color="#FAFAFA" />
          </mesh>
        </group>

        {/* Overhead Sign */}
        <Html position={[0, 19, -5]} center>
          <div className="bg-emerald-950/90 text-emerald-300 font-extrabold text-sm px-4 py-1.5 rounded-full border border-emerald-400/50 shadow-xl whitespace-nowrap">
            🕌 Городская Соборная Мечеть
          </div>
        </Html>

        {/* Mosque Interactive Door Trigger */}
        {distTo([0, 0, -60]) < 18 && (
          <Html position={[0, 2.5, 5]} center>
            <button
              onClick={() => onInteractObject('enter_mosque', 'Мечеть')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-2xl border-2 border-emerald-300 animate-bounce cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <span>🕌</span>
              <span>Войти в Мечеть (Посещение, Молитва, Коран)</span>
            </button>
          </Html>
        )}
      </group>

      {/* ========================================================== */}
      {/* 5. SCHOOL (Pos: X: 45, Z: 20) */}
      {/* ========================================================== */}
      <group position={[45, 0, 20]}>
        <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[20, 9, 14]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.7} />
        </mesh>
        <Html position={[0, 11, 0]} center>
          <div className="bg-indigo-950/90 text-indigo-200 font-extrabold text-xs px-3.5 py-1 rounded-full border border-indigo-400/50 shadow-lg whitespace-nowrap">
            🏫 Школа Знаний и Воспитания №1
          </div>
        </Html>
        {distTo([45, 0, 20]) < 14 && (
          <Html position={[0, 2.5, 7.5]} center>
            <button
              onClick={() => onInteractObject('school_entrance', 'Школа')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-2xl border-2 border-indigo-300 animate-bounce cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <span>🏫</span>
              <span>Войти в Школу (Классы, Парты, Уроки, Друзья)</span>
            </button>
          </Html>
        )}
      </group>

      {/* ========================================================== */}
      {/* 6. PARK & KITTEN IN TREE (Pos: X: 0, Z: 40) */}
      {/* ========================================================== */}
      <group position={[0, 0, 40]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
          <circleGeometry args={[20, 32]} />
          <meshStandardMaterial color="#E0E0E0" roughness={0.5} />
        </mesh>

        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[3, 3.2, 1.2, 24]} />
          <meshStandardMaterial color="#81D4FA" roughness={0.2} />
        </mesh>

        {/* Kitten */}
        <group position={[-10, 0, -8]}>
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.6, 4, 12]} />
            <meshStandardMaterial color="#4E342E" />
          </mesh>
          <mesh position={[0, 4.5, 0]} castShadow>
            <sphereGeometry args={[2.5, 16, 16]} />
            <meshStandardMaterial color="#2E7D32" />
          </mesh>
          {!hasRescuedKitten && (
            <group position={[0.8, 3.2, 0.2]}>
              <mesh castShadow>
                <sphereGeometry args={[0.2, 12, 12]} />
                <meshStandardMaterial color="#FF9800" />
              </mesh>
              {distTo([-10, 0, 32]) < 4 && (
                <Html position={[0, 1.0, 0]} center>
                  <button
                    onClick={() => onInteractObject('rescue_kitten', 'Котенок')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-full shadow-lg border border-amber-200 animate-bounce cursor-pointer"
                  >
                    🐱 Снять котенка с дерева!
                  </button>
                </Html>
              )}
            </group>
          )}
        </group>
      </group>

      {/* ALL NPCS */}
      {npcs.map((npc) => (
        <NPCModel
          key={npc.id}
          npc={npc}
          isNearby={distTo(npc.position) < 3.5}
          onInteract={onInteractNPC}
        />
      ))}
    </group>
  );
};

