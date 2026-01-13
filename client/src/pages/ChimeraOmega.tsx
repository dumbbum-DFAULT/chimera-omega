import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Extend JSX namespace for custom shader materials
declare global {
  namespace JSX {
    interface IntrinsicElements {
      multiverseMetricTensorField: any;
      multiversalVRGlitchShader: any;
    }
  }
}

// ============================================================================
// PHASE 1: Multiversal Riemannian Manifold Space Construction
// ============================================================================

const MultiverseMetricTensorField = shaderMaterial(
  {
    uTime: 0,
    uCurvature: 0.5,
    uLayer: 0.0,
    uPlanckConstant: 1.0,
    uProperTime: 0.0,
    uResolution: new THREE.Vector2(1024, 1024),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float uTime;
    uniform float uCurvature;
    uniform float uLayer;
    uniform float uPlanckConstant;
    uniform float uProperTime;
    
    vec3 applyMetricTensor(vec3 pos) {
      float layerOffset = uLayer * 2.0;
      float r = length(pos.xy);
      float curvatureFactor = 1.0 / (1.0 + uCurvature * r * r * uPlanckConstant);
      
      vec3 curved = pos;
      curved.z += sin(r * 3.0 - (uTime + uProperTime)) * curvatureFactor * 0.3;
      curved.xy *= curvatureFactor;
      curved.z += layerOffset;
      
      return curved;
    }
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      
      vec3 transformed = applyMetricTensor(position);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float uTime;
    uniform float uCurvature;
    uniform float uLayer;
    uniform float uPlanckConstant;
    uniform float uProperTime;
    
    float bekensteinCapacity(vec3 pos) {
      float r = length(pos);
      return 32.0 * (1.0 - uCurvature * 0.8) / (1.0 + r * r * 0.1 * uPlanckConstant);
    }
    
    vec3 quantizeReality(vec3 color, float capacity) {
      float quantLevel = floor(capacity);
      return floor(color * quantLevel) / quantLevel;
    }
    
    void main() {
      float capacity = bekensteinCapacity(vPosition);
      
      vec3 color = vec3(
        0.5 + 0.5 * sin(vUv.x * 10.0 + (uTime + uProperTime) + uLayer),
        0.5 + 0.5 * cos(vUv.y * 10.0 + (uTime + uProperTime) * 0.7),
        0.7 + 0.3 * sin(length(vPosition) * 2.0 - (uTime + uProperTime))
      );
      
      color = quantizeReality(color, capacity);
      
      float glow = 0.3 * sin(length(vPosition) * 5.0 - (uTime + uProperTime) * 2.0);
      color += vec3(glow);
      
      gl_FragColor = vec4(color, 0.8);
    }
  `
);

extend({ MultiverseMetricTensorField });

// ============================================================================
// PHASE 2: Chern-Simons Topological Field - Inter-layer Braiding Tentacles
// ============================================================================

const MultiverseChernSimonsTentacle = ({ index, totalTentacles, layerCount, currentLayer, onEntangle }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [targetLayer, setTargetLayer] = useState(index % layerCount);

  const geometry = useMemo(() => {
    const points = [];
    const segments = 80;
    
    for (let i = 0; i < segments; i++) {
      const t = (i / segments) * Math.PI * 2 * 3;
      const angle = (index / totalTentacles) * Math.PI * 2;
      
      const x = Math.sin(t) + 2 * Math.sin(2 * t);
      const y = Math.cos(t) - 2 * Math.cos(2 * t);
      const z = -Math.sin(3 * t);
      
      const px = x * Math.cos(angle) - y * Math.sin(angle);
      const py = x * Math.sin(angle) + y * Math.cos(angle);
      const pz = z + i * 0.05;
      
      points.push(new THREE.Vector3(px * 0.5, py * 0.5, pz * 0.3));
    }
    
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, segments, 0.08, 8, false);
  }, [index, totalTentacles]);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    const time = clock.getElapsedTime();
    const phase = Math.sin(time * 2 + index * 0.5 + targetLayer * Math.PI);
    const chirality = index % 2 === 0 ? 1 : -1;
    
    meshRef.current.rotation.z = phase * 0.3 * chirality;
    meshRef.current.position.x = Math.sin(time + index) * 0.5;
    meshRef.current.position.y = Math.cos(time * 0.7 + index) * 0.5;
    
    const layerTargetZ = (targetLayer * 2 - (layerCount - 1));
    meshRef.current.position.z += (layerTargetZ - meshRef.current.position.z) * 0.01;

    if (meshRef.current.material && 'color' in meshRef.current.material) {
      (meshRef.current.material as THREE.MeshPhongMaterial).color.setHSL(
        (time * 0.1 + index * 0.2 + targetLayer * 0.3) % 1,
        0.8,
        0.5 + phase * 0.2
      );
    }

    if (Math.random() < 0.001) {
      const newTargetLayer = Math.floor(Math.random() * layerCount);
      if (newTargetLayer !== targetLayer) {
        setTargetLayer(newTargetLayer);
        onEntangle && onEntangle(index, newTargetLayer);
      }
    }
  });
  
  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhongMaterial
        color="#00ffff"
        emissive="#ff00ff"
        emissiveIntensity={0.3}
        shininess={100}
        transparent
        opacity={0.8}
        wireframe={false}
      />
    </mesh>
  );
};

// ============================================================================
// PHASE 3: Multiversal VR Glitch Reflection Layer
// ============================================================================

const MultiversalVRGlitchShader = shaderMaterial(
  {
    uTime: 0,
    uScene: null,
    uTopology: 0.5,
    uResolution: new THREE.Vector2(1024, 1024),
    uOtherManifoldTexture: null,
    uCurrentLayer: 0.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    uniform float uTime;
    uniform sampler2D uScene;
    uniform float uTopology;
    uniform vec2 uResolution;
    uniform sampler2D uOtherManifoldTexture;
    uniform float uCurrentLayer;
    
    float jonesInvariant(vec2 uv, float t) {
      vec2 p = uv * 10.0;
      float knot = 0.0;
      
      for(int i = 0; i < 3; i++) {
        float fi = float(i);
        p = abs(p) / dot(p, p) - vec2(0.9 + sin(t + fi) * 0.1);
        knot += exp(-length(p));
      }
      
      return knot;
    }
    
    vec3 topologicalChromatic(vec2 uv, float complexity, sampler2D textureSampler) {
      vec2 offset = vec2(complexity * 0.005);
      
      float r = texture2D(textureSampler, uv + offset * sin(uTime)).r;
      float g = texture2D(textureSampler, uv).g;
      float b = texture2D(textureSampler, uv - offset * cos(uTime)).b;
      
      return vec3(r, g, b);
    }
    
    void main() {
      vec2 uv = vUv;
      
      float topology = jonesInvariant(uv, uTime);
      
      vec2 distorted = uv;
      distorted.x += sin(uv.y * 20.0 + topology * 5.0 + uTime) * topology * 0.002;
      distorted.y += cos(uv.x * 20.0 - topology * 5.0 + uTime) * topology * 0.002;
      
      vec3 color = topologicalChromatic(distorted, topology, uScene);
      
      vec3 otherManifoldColor = topologicalChromatic(distorted, topology, uOtherManifoldTexture);
      
      float blendFactor = sin(uTime * 5.0 + uCurrentLayer * 2.0) * 0.5 + 0.5;
      color = mix(color, otherManifoldColor, blendFactor * 0.3);

      float scanline = sin(uv.y * uResolution.y * 0.5 + uTime * 10.0) * 0.1 + 0.9;
      color *= scanline;
      
      float glitch = step(0.98, fract(sin(dot(uv * 100.0, vec2(12.9898, 78.233)) + uTime) * 43758.5453));
      color = mix(color, vec3(0.0, 1.0, 0.8), glitch * 0.5);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ MultiversalVRGlitchShader });

// ============================================================================
// Scene Components
// ============================================================================

const MultiverseSandwichGalaxyScene = ({ layerCount, currentLayer, onEntangle }: any) => {
  const materialRefs = useRef<any[]>([]);
  const nebulaRef = useRef<THREE.InstancedMesh>(null);

  const nebulaGeometry = useMemo(() => new THREE.SphereGeometry(0.03, 8, 8), []);
  const nebulaMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.4 }), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const totalNebulaParticles = 1500;
  const nebulaPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < totalNebulaParticles; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20
        )
      );
    }
    return positions;
  }, [totalNebulaParticles]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    materialRefs.current.forEach((material, index) => {
      if (material) {
        material.uniforms.uTime.value = elapsedTime;
        material.uniforms.uLayer.value = index;
        material.uniforms.uPlanckConstant.value = 1.0 + Math.sin(elapsedTime * 0.1 + index) * 0.5;
        material.uniforms.uProperTime.value = Math.sin(elapsedTime * 0.5 + index * 0.7) * 0.5;
      }
    });

    if (nebulaRef.current) {
      for (let i = 0; i < totalNebulaParticles; i++) {
        const pos = nebulaPositions[i];
        pos.x += Math.sin(elapsedTime * 0.1 + i) * 0.01;
        pos.y += Math.cos(elapsedTime * 0.08 + i) * 0.01;
        pos.z += Math.sin(elapsedTime * 0.15 + i) * 0.01;
        dummy.position.copy(pos);
        dummy.updateMatrix();
        nebulaRef.current.setMatrixAt(i, dummy.matrix);
      }
      nebulaRef.current.instanceMatrix.needsUpdate = true;
    }
  });
  
  return (
    <>
      {Array.from({ length: layerCount }).map((_, layerIdx) => (
        <mesh key={layerIdx} position={[0, 0, layerIdx * 2 - (layerCount - 1)]} rotation={[-Math.PI / 4, 0, 0]}>
          <planeGeometry args={[12, 12, 128, 128]} />
          {React.createElement('multiverseMetricTensorField' as any, {
            ref: (el: any) => (materialRefs.current[layerIdx] = el),
            uLayer: layerIdx,
            uCurvature: 0.3 + layerIdx * 0.1,
            uTime: 0,
            uPlanckConstant: 1.0,
            uProperTime: 0.0,
            transparent: true,
            side: THREE.DoubleSide,
            wireframe: false,
          })}
        </mesh>
      ))}
      
      <group rotation={[Math.PI/4, 0, 0]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <MultiverseChernSimonsTentacle 
            key={i} 
            index={i} 
            totalTentacles={12} 
            layerCount={layerCount}
            currentLayer={currentLayer}
            onEntangle={onEntangle}
          />
        ))}
      </group>
      
      <instancedMesh ref={nebulaRef} args={[nebulaGeometry, nebulaMaterial, totalNebulaParticles]} />
    </>
  );
};

const MultiversalVRGlitchLayer = ({ currentLayer, layerCount, renderTargets }: any) => {
  const { gl, scene, camera, size } = useThree();
  const shaderRef = useRef<any>(null);
  const planeRef = useRef<THREE.Mesh>(null);
  
  const glitchRenderTarget = useMemo(
    () => new THREE.WebGLRenderTarget(size.width, size.height, {
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter
    }),
    [size.width, size.height]
  );

  useFrame(({ clock }) => {
    if (shaderRef.current && planeRef.current) {
      const otherLayerIdx = (currentLayer + 1) % layerCount;
      const otherManifoldTexture = renderTargets[otherLayerIdx]?.texture || null;

      shaderRef.current.uniforms.uScene.value = renderTargets[currentLayer]?.texture || null;
      shaderRef.current.uniforms.uOtherManifoldTexture.value = otherManifoldTexture;
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
      shaderRef.current.uniforms.uResolution.value.set(size.width, size.height);
      shaderRef.current.uniforms.uCurrentLayer.value = currentLayer;
    }
  });
  
  return (
    <mesh ref={planeRef} position={[3, 1, 2]} rotation={[0, -Math.PI / 6, 0]}>
      <planeGeometry args={[5, 3]} />
      {React.createElement('multiversalVRGlitchShader' as any, {
        ref: shaderRef,
        uTopology: 0.7,
        uTime: 0,
        uResolution: new THREE.Vector2(1024, 1024),
        uCurrentLayer: currentLayer,
        transparent: true,
        side: THREE.DoubleSide,
      })}
    </mesh>
  );
};

// ============================================================================
// UI Controls
// ============================================================================

const Controls = ({ layer, setLayer, showGlitch, setShowGlitch, layerCount }: any) => (
  <div style={{
    position: 'absolute',
    top: 20,
    left: 20,
    color: '#00ffff',
    fontFamily: "'Courier New', monospace",
    background: 'rgba(5, 5, 10, 0.85)',
    padding: '20px',
    borderRadius: '4px',
    border: '1px solid #00ffff',
    zIndex: 1000,
    boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
    backdropFilter: 'blur(4px)',
    maxWidth: '300px'
  }}>
    <h3 style={{ margin: '0 0 15px 0', color: '#ff00ff', textShadow: '0 0 5px #ff00ff' }}>
      CHIMERA PROJECT <span style={{fontSize: '0.8em'}}>// v1.0 OMEGA</span>
    </h3>
    
    <div style={{ marginBottom: 15 }}>
      <div style={{marginBottom: '5px', fontSize: '12px', color: '#888'}}>MULTIVERSAL MANIFOLD LAYER SELECTION</div>
      <div style={{ display: 'flex', gap: '5px' }}>
        {Array.from({ length: layerCount }).map( (_, i) => (
          <button
            key={i}
            onClick={() => setLayer(i)}
            style={{
              flex: 1,
              padding: '8px',
              background: layer === i ? 'rgba(0, 255, 255, 0.2)' : 'transparent',
              color: layer === i ? '#fff' : '#00ffff',
              border: '1px solid #00ffff',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.3s ease'
            }}
          >
            L{i + 1}
          </button>
        ))}
      </div>
    </div>
    
    <div style={{ marginBottom: 15 }}>
       <div style={{marginBottom: '5px', fontSize: '12px', color: '#888'}}>OBSERVER OPTICS</div>
       <button
          onClick={() => setShowGlitch(!showGlitch)}
          style={{
            width: '100%',
            padding: '8px',
            background: showGlitch ? 'rgba(255, 0, 255, 0.2)' : 'transparent',
            color: showGlitch ? '#fff' : '#ff00ff',
            border: '1px solid #ff00ff',
            cursor: 'pointer',
            fontFamily: 'inherit',
            textAlign: 'left'
          }}
        >
          {showGlitch ? '[ONLINE] MULTIVERSAL_GLITCH_LAYER' : '[OFFLINE] MULTIVERSAL_GLITCH_LAYER'}
        </button>
    </div>
    
    <div style={{ 
      marginTop: 15, 
      paddingTop: 15, 
      borderTop: '1px solid rgba(0, 255, 255, 0.3)',
      fontSize: '11px',
      lineHeight: '1.6'
    }}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <span>GEOMETRY:</span> <span style={{color:'#fff'}}>RIEMANNIAN (MULTIVERSAL)</span>
      </div>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <span>TOPOLOGY:</span> <span style={{color:'#fff'}}>CHERN-SIMONS KNOT (BRAIDED)</span>
      </div>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <span>ONTOLOGY:</span> <span style={{color:'#fff'}}>RELATIONAL (CROSS-MANIFOLD)</span>
      </div>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

export default function ChimeraOmega() {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [showGlitch, setShowGlitch] = useState(true);
  const layerCount = 5;

  const renderTargets = useMemo(() => 
    Array.from({ length: layerCount }).map(() => 
      new THREE.WebGLRenderTarget(1024, 1024, { format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter })
    ), [layerCount]
  );

  const handleEntanglement = (tentacleIndex: number, newTargetLayer: number) => {
    console.log(`Tentacle ${tentacleIndex} entangled with layer ${newTargetLayer}`);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000510', overflow: 'hidden' }}>
      <Controls 
        layer={currentLayer}
        setLayer={setCurrentLayer}
        showGlitch={showGlitch}
        setShowGlitch={setShowGlitch}
        layerCount={layerCount}
      />
      
      <Canvas camera={{ position: [0, 3, 10], fov: 50 }}>
        <color attach="background" args={['#000510']} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" distance={50} />
        <pointLight position={[-10, -5, -10]} intensity={1} color="#ff00ff" distance={50} />
        <pointLight position={[0, -10, 0]} intensity={0.5} color="#0000ff" />
        
        <MultiverseSandwichGalaxyScene 
          layerCount={layerCount} 
          currentLayer={currentLayer} 
          onEntangle={handleEntanglement}
        />
        
        {showGlitch && (
          <MultiversalVRGlitchLayer 
            currentLayer={currentLayer} 
            layerCount={layerCount} 
            renderTargets={renderTargets}
          />
        )}
        
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={2}
          maxDistance={20}
        />
        
        <fog attach="fog" args={['#000510', 5, 25]} />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        color: '#00ffff',
        fontFamily: "'Courier New', monospace",
        fontSize: '10px',
        textAlign: 'right',
        opacity: 0.5,
        pointerEvents: 'none'
      }}>
        <div>MULTIVERSE SANDWICH GALAXY</div>
        <div>CHIMERA PROJECT OMEGA • 2026</div>
        <div>HELIO-GEMINI PROTOCOL</div>
      </div>
    </div>
  );
}
