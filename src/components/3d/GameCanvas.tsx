import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerModel } from './PlayerModel';
import { World3D } from './World3D';
import { LightingAndSky } from './LightingAndSky';
import { CharacterAppearance, TimeOfDay, Weather, Season, CurrentSceneLocation } from '../../types/game';
import { NPCData } from './NPCModel';

interface ThirdPersonCameraProps {
  targetPos: [number, number, number];
  camAngleY: number;
  camPitch: number;
}

const ThirdPersonCamera: React.FC<ThirdPersonCameraProps> = ({ targetPos, camAngleY, camPitch }) => {
  const currentPos = useRef(new THREE.Vector3(targetPos[0], targetPos[1] + 6.5, targetPos[2] + 11));
  const currentTarget = useRef(new THREE.Vector3(targetPos[0], targetPos[1] + 1.2, targetPos[2]));

  useFrame((state, delta) => {
    const camDistance = 12;

    // Calculate position based on horizontal angle Y and vertical pitch elevation
    const horizontalDistance = Math.cos(camPitch) * camDistance;
    const camHeight = Math.sin(camPitch) * camDistance;

    const offsetX = Math.sin(camAngleY) * horizontalDistance;
    const offsetZ = Math.cos(camAngleY) * horizontalDistance;

    const desiredCamPos = new THREE.Vector3(
      targetPos[0] + offsetX,
      targetPos[1] + Math.max(1.2, camHeight),
      targetPos[2] + offsetZ
    );

    const desiredTarget = new THREE.Vector3(
      targetPos[0],
      targetPos[1] + 1.2,
      targetPos[2]
    );

    // Smoothly lerp camera position to eliminate all movement jitter
    const lerpSpeed = Math.min(delta * 12, 1);
    currentPos.current.lerp(desiredCamPos, lerpSpeed);
    currentTarget.current.lerp(desiredTarget, lerpSpeed);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentTarget.current);
  });

  return null;
};

interface GameCanvasProps {
  appearance: CharacterAppearance;
  playerPos: [number, number, number];
  sceneLocation: CurrentSceneLocation;
  playerRotY: number;
  isMoving: boolean;
  isRidingBike: boolean;
  isRidingCar?: boolean;
  timeOfDay: TimeOfDay;
  timeHour: number;
  weather: Weather;
  season: Season;
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
  camAngleY: number;
  camPitch?: number;
  onRotateCam: (deltaAngleY: number, deltaPitch?: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  appearance,
  playerPos,
  sceneLocation,
  playerRotY,
  isMoving,
  isRidingBike,
  isRidingCar,
  timeOfDay,
  timeHour,
  weather,
  season,
  npcs,
  onInteractNPC,
  onInteractObject,
  isPrayerMatSpread,
  hasCleanedRoom,
  hasRescuedKitten,
  hasCleanedParkTrash,
  hasWateredFlowers,
  hasPlantedTree,
  decoratedItems,
  camAngleY,
  camPitch = 0.45,
  onRotateCam,
}) => {
  const isDragging = useRef(false);
  const previousMouseX = useRef(0);
  const previousMouseY = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    previousMouseX.current = e.clientX;
    previousMouseY.current = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMouseX.current;
    const deltaY = e.clientY - previousMouseY.current;
    previousMouseX.current = e.clientX;
    previousMouseY.current = e.clientY;
    onRotateCam(-deltaX * 0.008, deltaY * 0.005);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="w-full h-full relative select-none touch-none cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Canvas
        shadows
        camera={{ position: [playerPos[0], playerPos[1] + 6.5, playerPos[2] + 11], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full"
      >
        <ThirdPersonCamera targetPos={playerPos} camAngleY={camAngleY} camPitch={camPitch} />

        <LightingAndSky
          timeOfDay={timeOfDay}
          timeHour={timeHour}
          weather={weather}
          season={season}
        />

        <World3D
          playerPos={playerPos}
          sceneLocation={sceneLocation}
          npcs={npcs}
          onInteractNPC={onInteractNPC}
          onInteractObject={onInteractObject}
          isPrayerMatSpread={isPrayerMatSpread}
          hasCleanedRoom={hasCleanedRoom}
          hasRescuedKitten={hasRescuedKitten}
          hasCleanedParkTrash={hasCleanedParkTrash}
          hasWateredFlowers={hasWateredFlowers}
          hasPlantedTree={hasPlantedTree}
          decoratedItems={decoratedItems}
        />

        <PlayerModel
          appearance={appearance}
          position={playerPos}
          rotationY={playerRotY}
          isMoving={isMoving}
          isRidingBike={isRidingBike}
        />
      </Canvas>
    </div>
  );
};

