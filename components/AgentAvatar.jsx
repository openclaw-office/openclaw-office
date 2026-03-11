import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

export default function AgentAvatar({ position, state, logMessage }) {
  const meshRef = useRef();

  // Map agent states to colors
  const stateColors = {
    idle: 'gray',
    researching: 'blue',
    writing: 'green',
    executing: 'purple',
    syncing: 'cyan',
    error: 'red'
  };

  // Simple animation: rotate agent if it's active
  useFrame(() => {
    if (meshRef.current && state !== 'idle' && state !== 'error') {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh position={position} ref={meshRef}>
      {/* Basic representation of an agent (e.g., a cylinder/robot body) */}
      <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
      <meshStandardMaterial color={stateColors[state] || 'gray'} />

      {/* Floating Log: HTML rendered in 3D space above the agent */}
      <Html position={[0, 1.5, 0]} center>
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          whiteSpace: 'nowrap',
          display: logMessage ? 'block' : 'none'
        }}>
          💬 {logMessage}
        </div>
      </Html>
    </mesh>
  );
}
