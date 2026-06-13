import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, RoundedBox, Torus } from '@react-three/drei';
import * as THREE from 'three';

// Coffee cup made of simple primitives
const CoffeeCup = () => {
  const cupRef = useRef();

  useFrame((state) => {
    if (cupRef.current) {
      cupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.8}>
      <group ref={cupRef} position={[0, 0.3, 0]}>
        {/* Cup body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.85, 0.65, 1.3, 32]} />
          <meshStandardMaterial color="#FFF8E7" roughness={0.35} metalness={0.05} />
        </mesh>
        {/* Coffee surface */}
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.08, 32]} />
          <meshStandardMaterial color="#6F4E37" roughness={0.2} />
        </mesh>
        {/* Handle */}
        <mesh position={[0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.32, 0.1, 16, 32, Math.PI * 1.4]} />
          <meshStandardMaterial color="#FFF8E7" roughness={0.35} />
        </mesh>
        {/* Saucer */}
        <mesh position={[0, -0.72, 0]}>
          <cylinderGeometry args={[1.25, 1.25, 0.12, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
};

// Simple steam particles rising from the cup
const Steam = () => {
  const groupRef = useRef();
  const particles = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        x: (Math.random() - 0.5) * 0.6,
        delay: i * 0.5,
        scale: 0.2 + Math.random() * 0.15,
      })),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((mesh, i) => {
      const t = (state.clock.elapsedTime + particles[i].delay) % 2.5;
      mesh.position.y = 1.0 + t * 0.9;
      mesh.position.x = particles[i].x + Math.sin(t * 3) * 0.1;
      mesh.scale.setScalar(particles[i].scale * (1 + t * 0.6));
      mesh.material.opacity = Math.max(0, 0.55 - t * 0.25);
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, 1, 0]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

// POS tablet floating beside the cup
const POSTablet = () => {
  const tabletRef = useRef();

  useFrame((state) => {
    if (tabletRef.current) {
      tabletRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.15 + 0.3;
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={tabletRef} position={[2.1, -0.6, 0.3]} rotation={[0, 0.3, 0]}>
        <RoundedBox args={[1.6, 2.1, 0.12]} radius={0.12} smoothness={4}>
          <meshStandardMaterial color="#0F766E" roughness={0.25} metalness={0.15} />
        </RoundedBox>
        {/* Screen */}
        <RoundedBox args={[1.35, 1.8, 0.02]} radius={0.08} smoothness={4} position={[0, 0, 0.07]}>
          <meshStandardMaterial
            color="#0B5C56"
            emissive="#14A89B"
            emissiveIntensity={0.4}
            roughness={0.1}
          />
        </RoundedBox>
        {/* Screen UI lines */}
        {[0.55, 0.25, -0.05, -0.35].map((y, i) => (
          <mesh key={i} position={[0, y, 0.09]}>
            <boxGeometry args={[1.0, 0.14, 0.01]} />
            <meshStandardMaterial color="#D4A373" emissive="#D4A373" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

// Coffee beans orbiting around the scene
const OrbitingBeans = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.2;
    }
  });

  const beans = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 3.2;
        return {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius,
          y: Math.sin(angle * 2) * 0.6,
          rotation: angle,
        };
      }),
    []
  );

  return (
    <group ref={groupRef}>
      {beans.map((bean, i) => (
        <mesh
          key={i}
          position={[bean.x, bean.y, bean.z]}
          rotation={[bean.rotation, bean.rotation * 0.5, 0]}
        >
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#6F4E37" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

// Glowing teal ring
const GlowRing = () => {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Torus ref={ringRef} args={[2.6, 0.03, 16, 100]} rotation={[Math.PI / 2.4, 0, 0]}>
      <meshStandardMaterial
        color="#14A89B"
        emissive="#14A89B"
        emissiveIntensity={1.5}
        toneMapped={false}
      />
    </Torus>
  );
};

// Tracks mouse movement to subtly rotate the whole scene
const MouseRig = ({ children }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const { x, y } = state.pointer;
    groupRef.current.rotation.y += (x * 0.4 - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (-y * 0.2 - groupRef.current.rotation.x) * 0.04;
  });

  return <group ref={groupRef}>{children}</group>;
};

const CafeScene3D = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.5, 7], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} castShadow />
      <pointLight position={[-3, 2, 2]} intensity={0.6} color="#D4A373" />

      <MouseRig>
        <CoffeeCup />
        <Steam />
        <POSTablet />
        <OrbitingBeans />
        <GlowRing />
      </MouseRig>

      <Environment preset="apartment" />
    </Canvas>
  );
};

export default CafeScene3D;
