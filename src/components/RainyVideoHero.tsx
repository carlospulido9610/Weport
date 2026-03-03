'use client';

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Shader para "Vidrio Sucio Oscuro con Finas Gotas" (Estilo Grunge/Realista)
const fragmentShader = `
uniform float uTime;
varying vec2 vUv;

// --- Utilidades de Ruido de Precisión ---
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// Value noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i + vec2(0.0)), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x),
        f.y
    );
}

// Fractal Brownian Motion
float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for(int i = 0; i < 4; i++) {
        f += amp * noise(p);
        p *= 2.0;
        amp *= 0.5;
    }
    return f;
}

// Generador de estelas de agua vertiendo (Condensación resbalando)
float rainStreaks(vec2 uv, float t) {
    vec2 st = vec2(uv.x * 50.0, uv.y * 3.0 - t * 0.3);
    st.x += noise(vec2(uv.y * 5.0, t * 0.1)) * 1.5;
    float r = noise(st);
    // Suavizamos la estela para que parezca agua gruesa resbalando, no un rasguño fino
    return smoothstep(0.7, 1.0, r);
}

// Capa base de colores pantanosos / oscuros
vec3 getBackground(vec2 uv) {
    vec3 col1 = vec3(0.02, 0.03, 0.02); // Gris oscuro casi negro
    vec3 col2 = vec3(0.06, 0.08, 0.05); // Oliva sucio muy oscuro
    vec3 col3 = vec3(0.03, 0.04, 0.05); // Azul noche oscuro
    
    float n1 = fbm(uv * 2.0);
    float n2 = fbm(uv * 5.0 + vec2(1.0, 2.0));
    
    vec3 finalCol = mix(col1, col2, smoothstep(0.0, 1.0, n1));
    finalCol = mix(finalCol, col3, smoothstep(0.0, 1.0, n2) * 0.5);
    
    // Luz difusa desde abajo como iluminación de calle nocturna
    float light = smoothstep(1.5, 0.0, length(uv - vec2(0.5, -0.2)));
    finalCol += vec3(0.08, 0.09, 0.06) * light;
    
    return finalCol;
}

void main() {
    vec2 uv = vUv;
    float t = uTime * 0.5;
    
    // 1. Ruido estático del cristal (suciedad seca, polvo)
    float theDirt = fbm(uv * 100.0) * 0.1;
    float frost = fbm(uv * 5.0);
    
    // 2. Estelas de agua cayendo (Water Streaks)
    float streaks = rainStreaks(uv, t);
    streaks += rainStreaks(uv * 1.5 + vec2(12.1, 5.0), t * 1.2) * 0.5;
    float waterMask = clamp(streaks, 0.0, 1.0);
    
    // 3. Refracción UVs
    // Distorsionamos las UVs del fondo basadas en las gotas de agua
    // (Derivada simple para empujar los píxeles hacia los lados)
    vec2 offset = vec2(0.005, 0.0);
    float dx = rainStreaks(uv + offset, t) - streaks;
    float dy = rainStreaks(uv + offset.yx, t) - streaks;
    vec2 waterNormal = vec2(dx, dy) * 2.0;
    
    vec2 refractedUv = uv + waterNormal * 0.15;
    
    // 4. Color base
    vec3 color = getBackground(refractedUv);
    
    // Agregamos el "empañado" / suciedad
    color *= mix(0.5, 1.0, frost);
    color -= theDirt; // Ensucia de forma global
    
    // 5. El paso del agua "limpia" el vidrio empañado, oscureciéndolo un poco
    float clarity = mix(1.0, 0.8, waterMask); 
    color *= clarity;
    
    // Destello de luz blanca espectacular rebotando en el borde de la gota
    float spec = smoothstep(0.01, 0.0, dx - dy) * waterMask;
    color += spec * vec3(0.4, 0.45, 0.5); // Brillo sutil
    
    // Viñeta oscura global (bordes de pantalla)
    float vignette = smoothstep(1.2, 0.2, length(uv - 0.5));
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
}
`;

function RainyGlassPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 }
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/**
 * Componente Hero cinemático: Lluvia deslizando sobre un cristal empañado oscuro.
 * Textura grunge, tonos oliva profundos y líneas finas de agua.
 */
export default function RainyVideoHero() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <Suspense fallback={<div className="w-full h-full bg-[#050508]" />}>
        <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
          <RainyGlassPlane />
        </Canvas>
      </Suspense>
    </div>
  );
}
