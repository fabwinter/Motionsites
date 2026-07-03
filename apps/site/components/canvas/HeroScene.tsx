"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";

function FloatingForm() {
  const ref = useRef<Mesh | null>(null);

  useFrame((state, delta) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.x += delta * 0.22;
    ref.current.rotation.y += delta * 0.35;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.45} floatIntensity={0.85}>
      <mesh ref={ref} scale={1.7}>
        <icosahedronGeometry args={[1, 3]} />
        <meshPhysicalMaterial
          color="#d7e1ff"
          roughness={0.08}
          transmission={0.96}
          thickness={1.2}
          ior={1.24}
          envMapIntensity={0}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <div className="h-full w-full">
      {/* DPR capped at 1.5 — keeps iPad Safari comfortably under memory limits */}
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4], fov: 36 }}>
        <color attach="background" args={["#050816"]} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 4]} intensity={6} color="#7ee7ff" />
        <directionalLight position={[-3, -2, 2]} intensity={4} color="#ff8a7a" />
        <pointLight position={[0, 2, 2]} intensity={2} color="#d7e1ff" />
        <FloatingForm />
      </Canvas>
    </div>
  );
}
