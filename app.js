import React from "react";
import { Canvas } from "@react-three/fiber";
import { PointerLockControls, Sky } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import "./App.css"; // CSS dosyamızı dahil ediyoruz

// Önceki cevaplarda yazdığımız Player, Ground ve Artwork bileşenlerinin 
// burada tanımlı olduğunu varsayıyoruz...

export default function App() {
  return (
    <div className="portfolio-container">
      
      {/* 3D KATMANI */}
      <div className="canvas-wrapper">
        <Canvas shadows camera={{ fov: 45 }}>
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} castShadow />
          
          <Physics gravity={[0, -9.81, 0]}>
            {/* <Player /> , <Ground /> vb. bileşenleri buraya ekle */}
          </Physics>

          <PointerLockControls />
        </Canvas>
      </div>

      {/* 2D HTML/CSS ARAYÜZ KATMANI */}
      <div className="ui-overlay">
        <nav className="navbar">
          <div className="logo">ART-PORTFOLIO</div>
          <div className="nav-links">
            <a href="#projects">Projeler</a>
            <a href="#about">Hakkımda</a>
          </div>
        </nav>

        <div className="crosshair">+</div>

        <div className="controls-hint">
          <p>Yürümek için <strong>WASD</strong></p>
          <p>Bakış için <strong>Fare</strong></p>
          <p>Çıkış için <strong>ESC</strong></p>
        </div>
      </div>

    </div>
  );
}