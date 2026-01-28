import { Canvas } from '@react-three/fiber'
import { PointerLockControls, Sky, Box, Plane } from '@react-three/drei'

function Wall({ position, rotation, color }) {
  return (
    <Box args={[10, 5, 0.5]} position={position} rotation={rotation}>
      <meshStandardMaterial color={color} />
    </Box>
  )
}

export default function Exhibit() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 75 }}>
        {/* Işıklandırma (Güneş ve ortam ışığı) */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Sky sunPosition={[100, 10, 100]} />

        {/* Yer (Zemin) */}
        <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <meshStandardMaterial color="lightgray" />
        </Plane>

        {/* Duvarlar ve Sergi Alanları */}
        <Wall position={[0, 2.5, -5]} color="white" /> {/* Arka Duvar */}
        
        {/* Kullanıcının gezmesini sağlayan kontrol */}
        <PointerLockControls />
      </Canvas>
      
      <div style={{ position: 'absolute', top: '50%', left: '50%', color: 'white', fontSize: '24px' }}>
        + {/* Hedef Göstergesi */}
      </div>
    </div>
  )
}