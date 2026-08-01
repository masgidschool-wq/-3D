import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export interface NPCData {
  id: string;
  name: string;
  role: string;
  type: 'human' | 'cat' | 'dog' | 'bird';
  position: [number, number, number];
  rotationY?: number;
  gender?: 'boy' | 'girl';
  outfitColor?: string;
  skinColor?: string;
  hatColor?: string;
  hasQuest?: boolean;
  questTitle?: string;
  dialogue?: string[];
}

interface NPCModelProps {
  npc: NPCData;
  isNearby: boolean;
  onInteract: (npc: NPCData) => void;
}

export const NPCModel: React.FC<NPCModelProps> = ({ npc, isNearby, onInteract }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const animTime = useRef(Math.random() * 10);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    animTime.current += delta * 2;
    const idleBounce = Math.sin(animTime.current) * 0.04;
    groupRef.current.position.y = npc.position[1] + (npc.type === 'bird' ? idleBounce * 2 + 0.5 : idleBounce);
  });

  const skinColor = npc.skinColor || '#F5D0A9';
  const outfitColor = npc.outfitColor || '#42A5F5';

  return (
    <group
      ref={groupRef}
      position={npc.position}
      rotation={[0, npc.rotationY || 0, 0]}
      onClick={() => onInteract(npc)}
    >
      {npc.type === 'human' && (
        <group castShadow receiveShadow>
          {/* Head */}
          <mesh position={[0, 1.45, 0]} castShadow>
            <sphereGeometry args={[0.26, 20, 20]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.09, 1.48, 0.22]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#212121" />
          </mesh>
          <mesh position={[0.09, 1.48, 0.22]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#212121" />
          </mesh>
          {/* Hair / Hat */}
          {npc.hatColor ? (
            <mesh position={[0, 1.62, 0]} castShadow>
              <cylinderGeometry args={[0.265, 0.27, 0.12, 18]} />
              <meshStandardMaterial color={npc.hatColor} />
            </mesh>
          ) : (
            <mesh position={[0, 1.55, 0]} castShadow>
              <sphereGeometry args={[0.27, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial color="#3E2723" />
            </mesh>
          )}

          {/* Torso */}
          <mesh position={[0, 0.85, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.3, 0.95, 18]} />
            <meshStandardMaterial color={outfitColor} roughness={0.5} />
          </mesh>

          {/* Legs & Shoes */}
          <mesh position={[-0.12, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.4, 12]} />
            <meshStandardMaterial color="#37474F" />
          </mesh>
          <mesh position={[0.12, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.4, 12]} />
            <meshStandardMaterial color="#37474F" />
          </mesh>
        </group>
      )}

      {npc.type === 'cat' && (
        <group position={[0, 0.2, 0]} castShadow>
          {/* Cat Body */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.22, 0.2, 0.4]} />
            <meshStandardMaterial color="#FF9800" roughness={0.7} />
          </mesh>
          {/* Cat Head */}
          <mesh position={[0, 0.25, 0.22]} castShadow>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color="#FF9800" roughness={0.7} />
          </mesh>
          {/* Cat Ears */}
          <mesh position={[-0.08, 0.38, 0.22]} rotation={[0, 0, -0.3]}>
            <coneGeometry args={[0.05, 0.1, 8]} />
            <meshStandardMaterial color="#E65100" />
          </mesh>
          <mesh position={[0.08, 0.38, 0.22]} rotation={[0, 0, 0.3]}>
            <coneGeometry args={[0.05, 0.1, 8]} />
            <meshStandardMaterial color="#E65100" />
          </mesh>
          {/* Tail */}
          <mesh position={[0, 0.28, -0.25]} rotation={[-0.5, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#E65100" />
          </mesh>
        </group>
      )}

      {npc.type === 'dog' && (
        <group position={[0, 0.3, 0]} castShadow>
          {/* Dog Body */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.28, 0.3, 0.55]} />
            <meshStandardMaterial color="#8D6E63" roughness={0.8} />
          </mesh>
          {/* Dog Head */}
          <mesh position={[0, 0.4, 0.3]} castShadow>
            <boxGeometry args={[0.22, 0.22, 0.25]} />
            <meshStandardMaterial color="#6D4C41" roughness={0.8} />
          </mesh>
          {/* Ears */}
          <mesh position={[-0.12, 0.42, 0.3]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.06, 0.15, 0.08]} />
            <meshStandardMaterial color="#4E342E" />
          </mesh>
          <mesh position={[0.12, 0.42, 0.3]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.06, 0.15, 0.08]} />
            <meshStandardMaterial color="#4E342E" />
          </mesh>
        </group>
      )}

      {npc.type === 'bird' && (
        <group position={[0, 0.2, 0]} castShadow>
          <mesh castShadow position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#00BCD4" />
          </mesh>
          {/* Beak */}
          <mesh position={[0, 0.1, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.03, 0.06, 6]} />
            <meshStandardMaterial color="#FFB300" />
          </mesh>
        </group>
      )}

      {/* Floating Name & Quest Marker */}
      <Html position={[0, npc.type === 'human' ? 2.1 : 0.9, 0]} center distanceFactor={12}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          {npc.hasQuest && (
            <div className="bg-amber-400 text-amber-950 font-bold px-2.5 py-1 rounded-full text-xs shadow-lg animate-bounce flex items-center gap-1 mb-1 border-2 border-amber-200">
              <span className="text-sm">⭐</span>
              <span>{npc.questTitle || 'Задание'}</span>
            </div>
          )}
          <div className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-white/20 shadow-md whitespace-nowrap">
            {npc.name}
            {npc.role && <span className="text-emerald-300 ml-1">({npc.role})</span>}
          </div>
          {isNearby && (
            <div className="mt-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-emerald-300 animate-pulse">
              [ Нажми E / Говорить ]
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};
