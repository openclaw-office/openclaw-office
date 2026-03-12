import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Agent } from '../../shared/types';
import * as THREE from 'three';

/**
 * Renders a single agent in 3D space with floating logs
 */
export const AgentAvatar: React.FC<{ agent: Agent }> = ({ agent }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Simple animation: Bobbing effect if the agent is "writing" or "syncing"
  useFrame((state) => {
    if (meshRef.current && (agent.status === 'writing' || agent.status === 'syncing')) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 4) * 0.1;
    }
  });

  // Color mapping based on status
  const getStatusColor = () => {
    switch (agent.status) {
      case 'error': return '#ff4d4d';
      case 'executing': return '#4ade80';
      case 'researching': return '#60a5fa';
      default: return '#818cf8';
    }
  };

  return (
    <group position={agent.position}>
      <mesh ref={meshRef} castShadow>
        <capsuleGeometry args={[0.4, 1, 4, 8]} />
        <meshStandardMaterial color={getStatusColor()} roughness={0.3} />
      </mesh>

      {/* Speech Bubble (Floating Logs) */}
      <Html distanceFactor={10} position={[0, 1.8, 0]} center>
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '8px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          border: `1px solid ${getStatusColor()}`
        }}>
          <strong>{agent.name}:</strong> {agent.lastLog || 'Standby...'}
        </div>
      </Html>
    </group>
  );
};
