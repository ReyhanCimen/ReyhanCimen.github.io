import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Sky, Text, Box, Plane } from "@react-three/drei";
import { Physics, useSphere, usePlane } from "@react-three/cannon";
import * as THREE from "three";

// 1. KLAVYE KONTROLÜ (HOOK)
const useKeyboard = () => {
  const [actions, setActions] = useState({ forward: false, backward: false, left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "KeyW") setActions((prev) => ({ ...prev, forward: true }));
      if (e.code === "KeyS") setActions((prev) => ({ ...prev, backward: true }));
      if (e.code === "KeyA") setActions((prev) => ({ ...prev, left: true }));
      if (e.code === "KeyD") setActions((prev) => ({ ...prev, right: true }));
    };
    const handleKeyUp = (e) => {
      if (e.code === "KeyW") setActions((prev) => ({ ...prev, forward: false }));
      if (e.code === "KeyS") setActions((prev) => ({ ...prev, backward: false }));
      if (e.code === "KeyA") setActions((prev) => ({ ...prev, left: false }));
      if (e.code === "KeyD") setActions((prev) => ({ ...prev, right: false }));
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  return actions;
};

// 2. OYUNCU (KAMERA) BİLEŞENİ
const Player = () => {
  const { camera } = useThree();
  const { forward, backward, left, right } = useKeyboard();
  const [ref, api] = useSphere(() => ({ mass: 1, type: "Dynamic", position: [0, 1, 5] }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

  useFrame(() => {
    // Kamerayı fizik topunun üzerine sabitle
    camera.position.copy(new THREE.Vector3(...ref.current.position));

    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, Number(backward) - Number(forward));
    const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(4) // Yürüme hızı
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);
  });

  return <mesh ref={ref} />;
};

// 3. ZEMİN
const Ground = () => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, 0, 0] }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  );
};

// 4. SERGİ ESERİ (RESİM + YAZI)
const Artwork = ({ position, title, description }) => {
  return (
    <group position={position}>
      {/* Çerçeve/Tablo */}
      <Box args={[2, 2, 0.1]} castShadow>
        <meshStandardMaterial color="white" />
      </Box>
      {/* Yanındaki Açıklama */}
      <group position={[1.5, 0.5, 0]}>
        <Text fontSize={0.2} color="white" anchorX="left">{title}</Text>
        <Text fontSize={0.1} color="#aaa" position={[0, -0.3, 0]} anchorX="left" maxWidth={1.5}>
          {description}
        </Text>
      </group>
    </group>
  );
};

// ANA SAHNE
export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas shadows camera={{ fov: 45 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} castShadow />
        
        <Physics gravity={[0, -9.81, 0]}>
          <Player />
          <Ground />
          {/* Örnek bir eser */}
          <Artwork 
            position={[0, 1.5, -5]} 
            title="İlk Çizimim" 
            description="Bu çizimi 2024 yılında dijital ortamda yaptım. Renk paleti üzerine bir deneme."
          />
        </Physics>

        <PointerLockControls />
      </Canvas>
      {/* Ekranda imleç (Crosshair) */}
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white" }}>+</div>
    </div>
  );
}