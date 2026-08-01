import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterAppearance } from '../../types/game';

interface PlayerModelProps {
  appearance: CharacterAppearance;
  position: [number, number, number];
  rotationY: number;
  isMoving: boolean;
  isRidingBike: boolean;
}

export const PlayerModel: React.FC<PlayerModelProps> = ({
  appearance,
  position,
  rotationY,
  isMoving,
  isRidingBike,
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const leftLegRef = useRef<THREE.Group>(null!);
  const rightLegRef = useRef<THREE.Group>(null!);
  const leftArmRef = useRef<THREE.Group>(null!);
  const rightArmRef = useRef<THREE.Group>(null!);
  const bikeWheelFrontRef = useRef<THREE.Group>(null!);
  const bikeWheelBackRef = useRef<THREE.Group>(null!);

  const animTime = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smooth position and rotation interpolation
    groupRef.current.position.set(position[0], position[1], position[2]);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotationY, delta * 12);

    if (isMoving) {
      animTime.current += delta * (isRidingBike ? 15 : 10);
      const angle = Math.sin(animTime.current);

      if (leftLegRef.current && rightLegRef.current) {
        if (isRidingBike) {
          leftLegRef.current.rotation.x = Math.sin(animTime.current) * 0.5 - 0.5;
          rightLegRef.current.rotation.x = -Math.sin(animTime.current) * 0.5 - 0.5;
        } else {
          leftLegRef.current.rotation.x = angle * 0.6;
          rightLegRef.current.rotation.x = -angle * 0.6;
        }
      }

      if (leftArmRef.current && rightArmRef.current) {
        if (isRidingBike) {
          leftArmRef.current.rotation.x = -0.8;
          rightArmRef.current.rotation.x = -0.8;
        } else {
          leftArmRef.current.rotation.x = -angle * 0.5;
          rightArmRef.current.rotation.x = angle * 0.5;
        }
      }

      if (isRidingBike && bikeWheelFrontRef.current && bikeWheelBackRef.current) {
        bikeWheelFrontRef.current.rotation.x += delta * 15;
        bikeWheelBackRef.current.rotation.x += delta * 15;
      }
    } else {
      // Idle pose / breathing
      animTime.current += delta * 2;
      const breath = Math.sin(animTime.current) * 0.03;

      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;

      if (leftArmRef.current) leftArmRef.current.rotation.x = isRidingBike ? -0.8 : breath;
      if (rightArmRef.current) rightArmRef.current.rotation.x = isRidingBike ? -0.8 : -breath;

      groupRef.current.position.y = position[1] + (isRidingBike ? 0.3 : 0) + breath * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position} castShadow receiveShadow>
      {/* Root offset if on bike */}
      <group position={[0, isRidingBike ? 0.4 : 0, 0]}>
        {/* Head & Neck */}
        <group position={[0, 1.45, 0]}>
          {/* Head Sphere */}
          <mesh castShadow>
            <sphereGeometry args={[0.26, 24, 24]} />
            <meshStandardMaterial color={appearance.skinColor} roughness={0.6} />
          </mesh>

          {/* Eyes & Eyelashes */}
          <mesh position={[-0.09, 0.04, 0.22]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color={appearance.eyeColor} roughness={0.2} />
          </mesh>
          <mesh position={[0.09, 0.04, 0.22]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color={appearance.eyeColor} roughness={0.2} />
          </mesh>
          {/* Eye highlights */}
          <mesh position={[-0.08, 0.05, 0.25]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.1, 0.05, 0.25]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>

          {/* Girl Eyelashes */}
          {appearance.gender === 'girl' && (
            <group>
              <mesh position={[-0.09, 0.08, 0.23]} rotation={[0, 0, -0.2]}>
                <boxGeometry args={[0.06, 0.01, 0.01]} />
                <meshBasicMaterial color="#000000" />
              </mesh>
              <mesh position={[0.09, 0.08, 0.23]} rotation={[0, 0, 0.2]}>
                <boxGeometry args={[0.06, 0.01, 0.01]} />
                <meshBasicMaterial color="#000000" />
              </mesh>
            </group>
          )}

          {/* Smile */}
          <mesh position={[0, -0.08, 0.23]} rotation={[0.2, 0, 0]}>
            <torusGeometry args={[0.05, 0.012, 8, 12, Math.PI]} />
            <meshStandardMaterial color="#8D6E63" />
          </mesh>

          {/* Hair */}
          <group position={[0, 0.08, 0]}>
            {appearance.hairStyle === 'short' && (
              <mesh position={[0, 0.12, -0.02]} castShadow>
                <sphereGeometry args={[0.27, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
                <meshStandardMaterial color={appearance.hairColor} roughness={0.8} />
              </mesh>
            )}
            {appearance.hairStyle === 'curly' && (
              <group>
                {[-0.12, 0, 0.12].map((x, i) =>
                  [0.1, 0.2, 0.1].map((y, j) => (
                    <mesh key={`${i}-${j}`} position={[x, y, -0.05]} castShadow>
                      <sphereGeometry args={[0.1, 12, 12]} />
                      <meshStandardMaterial color={appearance.hairColor} roughness={0.9} />
                    </mesh>
                  ))
                )}
              </group>
            )}
            {appearance.hairStyle === 'modern' && (
              <mesh position={[0, 0.18, 0.04]} rotation={[-0.3, 0, 0]} castShadow>
                <boxGeometry args={[0.32, 0.12, 0.36]} />
                <meshStandardMaterial color={appearance.hairColor} roughness={0.7} />
              </mesh>
            )}
            {appearance.hairStyle === 'braids' && (
              <group>
                <mesh position={[-0.16, -0.2, -0.05]} castShadow>
                  <cylinderGeometry args={[0.04, 0.03, 0.4, 8]} />
                  <meshStandardMaterial color={appearance.hairColor} />
                </mesh>
                <mesh position={[0.16, -0.2, -0.05]} castShadow>
                  <cylinderGeometry args={[0.04, 0.03, 0.4, 8]} />
                  <meshStandardMaterial color={appearance.hairColor} />
                </mesh>
              </group>
            )}
            {appearance.hairStyle === 'ponytail' && (
              <mesh position={[0, 0.05, -0.24]} rotation={[0.4, 0, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.03, 0.35, 12]} />
                <meshStandardMaterial color={appearance.hairColor} />
              </mesh>
            )}
          </group>

          {/* Kufi / Hat / Hijab */}
          {appearance.hatStyle !== 'none' && (
            <group position={[0, 0.18, 0]}>
              {appearance.hatStyle === 'hijab' ? (
                /* Hijab / Scarf */
                <group>
                  <mesh castShadow position={[0, -0.05, -0.02]}>
                    <sphereGeometry args={[0.29, 20, 20]} />
                    <meshStandardMaterial color={appearance.outfitColor} roughness={0.6} />
                  </mesh>
                  {/* Chest drape */}
                  <mesh castShadow position={[0, -0.28, 0.08]} rotation={[0.4, 0, 0]}>
                    <coneGeometry args={[0.28, 0.35, 16]} />
                    <meshStandardMaterial color={appearance.outfitColor} roughness={0.6} />
                  </mesh>
                </group>
              ) : (
                <group>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.265, 0.27, 0.14, 24]} />
                    <meshStandardMaterial
                      color={
                        appearance.hatStyle === 'kufi_green'
                          ? '#2E7D32'
                          : appearance.hatStyle === 'kufi_black'
                          ? '#212121'
                          : appearance.hatStyle === 'cap'
                          ? '#1565C0'
                          : '#FAFAFA'
                      }
                      roughness={0.4}
                    />
                  </mesh>
                  {/* Gold/White trim line */}
                  <mesh position={[0, -0.06, 0]}>
                    <torusGeometry args={[0.268, 0.012, 12, 24]} />
                    <meshStandardMaterial color="#FFD54F" metalness={0.5} roughness={0.2} />
                  </mesh>
                </group>
              )}
            </group>
          )}
        </group>

        {/* Torso / Outfit */}
        <group position={[0, 0.85, 0]}>
          {appearance.outfitStyle === 'thobe' ? (
            /* Traditional Thobe / Tunic */
            <mesh castShadow>
              <cylinderGeometry args={[0.22, 0.3, 0.95, 20]} />
              <meshStandardMaterial color={appearance.outfitColor} roughness={0.5} />
            </mesh>
          ) : (
            /* Jacket / Casual shirt */
            <group>
              <mesh castShadow position={[0, 0.1, 0]}>
                <boxGeometry args={[0.42, 0.55, 0.28]} />
                <meshStandardMaterial color={appearance.outfitColor} roughness={0.6} />
              </mesh>
              {/* Pants */}
              <mesh castShadow position={[0, -0.3, 0]}>
                <boxGeometry args={[0.38, 0.4, 0.26]} />
                <meshStandardMaterial color="#37474F" roughness={0.7} />
              </mesh>
            </group>
          )}

          {/* Arms */}
          {/* Left Arm */}
          <group ref={leftArmRef} position={[-0.26, 0.3, 0]}>
            <mesh position={[0, -0.22, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.45, 12]} />
              <meshStandardMaterial color={appearance.outfitColor} roughness={0.5} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.48, 0]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color={appearance.skinColor} roughness={0.6} />
            </mesh>
          </group>

          {/* Right Arm */}
          <group ref={rightArmRef} position={[0.26, 0.3, 0]}>
            <mesh position={[0, -0.22, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.45, 12]} />
              <meshStandardMaterial color={appearance.outfitColor} roughness={0.5} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.48, 0]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color={appearance.skinColor} roughness={0.6} />
            </mesh>
          </group>
        </group>

        {/* Legs & Shoes */}
        <group position={[0, 0.38, 0]}>
          {/* Left Leg */}
          <group ref={leftLegRef} position={[-0.12, 0, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.06, 0.42, 12]} />
              <meshStandardMaterial color={appearance.outfitStyle === 'thobe' ? appearance.skinColor : '#37474F'} />
            </mesh>
            {/* Shoe */}
            <mesh position={[0, -0.42, 0.06]} castShadow>
              <boxGeometry args={[0.13, 0.1, 0.24]} />
              <meshStandardMaterial color={appearance.shoesColor} roughness={0.4} />
            </mesh>
          </group>

          {/* Right Leg */}
          <group ref={rightLegRef} position={[0.12, 0, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.06, 0.42, 12]} />
              <meshStandardMaterial color={appearance.outfitStyle === 'thobe' ? appearance.skinColor : '#37474F'} />
            </mesh>
            {/* Shoe */}
            <mesh position={[0, -0.42, 0.06]} castShadow>
              <boxGeometry args={[0.13, 0.1, 0.24]} />
              <meshStandardMaterial color={appearance.shoesColor} roughness={0.4} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Bicycle 3D Mesh when riding */}
      {isRidingBike && (
        <group position={[0, 0.4, 0]}>
          {/* Main Frame */}
          <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0.4]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.9, 12]} />
            <meshStandardMaterial color={appearance.bikeColor} metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.1, 0]} rotation={[0, 0, -0.4]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.8, 12]} />
            <meshStandardMaterial color={appearance.bikeColor} metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Handlebar */}
          <mesh position={[0, 0.5, 0.35]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.6, 12]} />
            <meshStandardMaterial color="#212121" metalness={0.8} />
          </mesh>
          {/* Front Wheel */}
          <group ref={bikeWheelFrontRef} position={[0, -0.05, 0.55]}>
            <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
              <torusGeometry args={[0.3, 0.03, 12, 24]} />
              <meshStandardMaterial color="#212121" roughness={0.8} />
            </mesh>
            {/* Wheel Spokes */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.58, 8]} />
              <meshStandardMaterial color="#B0BEC5" metalness={0.9} />
            </mesh>
          </group>
          {/* Back Wheel */}
          <group ref={bikeWheelBackRef} position={[0, -0.05, -0.55]}>
            <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
              <torusGeometry args={[0.3, 0.03, 12, 24]} />
              <meshStandardMaterial color="#212121" roughness={0.8} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.58, 8]} />
              <meshStandardMaterial color="#B0BEC5" metalness={0.9} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};
