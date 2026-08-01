import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TimeOfDay, Weather, Season } from '../../types/game';

interface LightingAndSkyProps {
  timeOfDay: TimeOfDay;
  timeHour: number; // 0-24
  weather: Weather;
  season: Season;
}

export const LightingAndSky: React.FC<LightingAndSkyProps> = ({
  timeOfDay,
  timeHour,
  weather,
}) => {
  const sunLightRef = useRef<THREE.DirectionalLight>(null!);
  const ambientLightRef = useRef<THREE.AmbientLight>(null!);
  const rainGroupRef = useRef<THREE.Group>(null!);

  // Calculate sun position & light colors based on hour (0..24)
  const sunAngle = ((timeHour - 6) / 24) * Math.PI * 2;
  const sunX = Math.cos(sunAngle) * 60;
  const sunY = Math.sin(sunAngle) * 60;
  const sunZ = Math.sin(sunAngle * 0.5) * 30;

  // Color theme per time of day
  const skyTheme = useMemo(() => {
    if (timeHour >= 5 && timeHour < 8) {
      // Sunrise
      return {
        skyColor: '#FFCC80',
        groundColor: '#4E342E',
        sunColor: '#FFB74D',
        sunIntensity: 1.4,
        ambientColor: '#FFE0B2',
        ambientIntensity: 0.8,
        fogColor: '#FFE0B2',
      };
    } else if (timeHour >= 8 && timeHour < 17) {
      // Daytime
      return {
        skyColor: '#81D4FA',
        groundColor: '#388E3C',
        sunColor: '#FFF9C4',
        sunIntensity: 1.8,
        ambientColor: '#E0F7FA',
        ambientIntensity: 0.9,
        fogColor: '#E0F7FA',
      };
    } else if (timeHour >= 17 && timeHour < 21) {
      // Sunset / Evening
      return {
        skyColor: '#FF8A65',
        groundColor: '#3E2723',
        sunColor: '#FF7043',
        sunIntensity: 1.3,
        ambientColor: '#FFCC80',
        ambientIntensity: 0.7,
        fogColor: '#FFCC80',
      };
    } else {
      // Night
      return {
        skyColor: '#0D1B2A',
        groundColor: '#0B090A',
        sunColor: '#7986CB', // Moonlight
        sunIntensity: 0.5,
        ambientColor: '#1B263B',
        ambientIntensity: 0.35,
        fogColor: '#0D1B2A',
      };
    }
  }, [timeHour]);

  // Rain / Snow particles setup
  const particleCount = 250;
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 60,
        y: Math.random() * 25,
        z: (Math.random() - 0.5) * 60,
        speed: 0.2 + Math.random() * 0.3,
      });
    }
    return temp;
  }, []);

  useFrame((_, delta) => {
    if (rainGroupRef.current && (weather === 'RAIN' || weather === 'SNOW')) {
      rainGroupRef.current.children.forEach((child, i) => {
        const p = particles[i];
        if (p) {
          child.position.y -= p.speed * (weather === 'RAIN' ? 40 : 10) * delta;
          if (child.position.y < 0) {
            child.position.y = 25;
          }
        }
      });
    }
  });

  return (
    <>
      {/* Sky Background & Fog */}
      <color attach="background" args={[skyTheme.skyColor]} />
      <fog attach="fog" args={[skyTheme.fogColor, 25, 110]} />

      {/* Hemispheric ambient light */}
      <ambientLight ref={ambientLightRef} color={skyTheme.ambientColor} intensity={skyTheme.ambientIntensity} />

      {/* Main Directional Sun / Moon Light with Shadows */}
      <directionalLight
        ref={sunLightRef}
        position={[sunX, Math.max(sunY, 5), sunZ]}
        color={skyTheme.sunColor}
        intensity={skyTheme.sunIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0005}
      />

      {/* Sun / Moon Visual Sphere */}
      <mesh position={[sunX * 0.8, Math.max(sunY * 0.8, 12), sunZ * 0.8]}>
        <sphereGeometry args={[2.5, 24, 24]} />
        <meshBasicMaterial color={timeOfDay === 'NIGHT' ? '#FFF9C4' : '#FFF176'} />
      </mesh>

      {/* Weather Rain / Snow Particles */}
      {(weather === 'RAIN' || weather === 'SNOW') && (
        <group ref={rainGroupRef}>
          {particles.map((p, idx) => (
            <mesh key={idx} position={[p.x, p.y, p.z]}>
              {weather === 'RAIN' ? (
                <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
              ) : (
                <sphereGeometry args={[0.08, 8, 8]} />
              )}
              <meshBasicMaterial
                color={weather === 'RAIN' ? '#90CAF9' : '#FFFFFF'}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </group>
      )}
    </>
  );
};
