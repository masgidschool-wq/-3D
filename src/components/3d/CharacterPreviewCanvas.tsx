import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { CharacterAppearance } from '../../types/game';
import { PlayerModel } from './PlayerModel';
import * as THREE from 'three';

interface PreviewSceneProps {
  appearance: CharacterAppearance;
  rotationY: number;
}

const PreviewScene: React.FC<PreviewSceneProps> = ({ appearance, rotationY }) => {
  const pedestalRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (pedestalRef.current) {
      pedestalRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 10, 7]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#A7F3D0" />
      <pointLight position={[0, 4, 3]} intensity={0.8} color="#FDE047" />

      {/* Pedestal */}
      <group ref={pedestalRef} position={[0, -0.9, 0]}>
        {/* Base Cylinder */}
        <mesh position={[0, -0.1, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.2, 1.4, 0.2, 32]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Gold Ring */}
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <torusGeometry args={[1.21, 0.03, 16, 32]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Inner Top Disc */}
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <cylinderGeometry args={[1.18, 1.18, 0.02, 32]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} />
        </mesh>
        {/* Glowing Runes / Accent Circle */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.75, 32]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Character Model */}
      <PlayerModel
        appearance={appearance}
        position={[0, -0.88, 0]}
        rotationY={rotationY}
        isMoving={false}
        isRidingBike={false}
      />
    </>
  );
};

interface CharacterPreviewCanvasProps {
  appearance: CharacterAppearance;
  rotationY: number;
}

export const CharacterPreviewCanvas: React.FC<CharacterPreviewCanvasProps> = ({ appearance, rotationY }) => {
  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950/40 border border-slate-700/60 shadow-inner">
      <Canvas
        camera={{ position: [0, 0.4, 3.2], fov: 45 }}
        shadows
        className="w-full h-full"
      >
        <PreviewScene appearance={appearance} rotationY={rotationY} />
      </Canvas>
    </div>
  );
};
