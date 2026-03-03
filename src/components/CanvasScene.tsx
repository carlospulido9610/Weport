'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ========================================
   CUSTOM SHADER MATERIAL
   Simula la textura de vidrio/cristal sucio con tonos dorados
   que se ven en la imagen de referencia.
   ======================================== */

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  // Simplex noise 2D
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x_) - 0.5;
    vec3 ox = floor(x_ + 0.5);
    vec3 a0 = x_ - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Ondulaciones orgánicas con varias capas de noise
    float noise1 = snoise(uv * 3.0 + uTime * 0.15) * 0.12;
    float noise2 = snoise(uv * 6.0 - uTime * 0.1) * 0.06;
    float noise3 = snoise(uv * 12.0 + uTime * 0.2) * 0.02;
    
    float elevation = noise1 + noise2 + noise3;
    vElevation = elevation;
    pos.z += elevation;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Tonos base: dorado oscuro / verde oliva / negro
    vec3 colorDark = vec3(0.04, 0.04, 0.03);
    vec3 colorMid = vec3(0.14, 0.12, 0.06);
    vec3 colorLight = vec3(0.35, 0.30, 0.12);
    vec3 colorGold = vec3(0.55, 0.45, 0.15);
    
    // Mezcla basada en la elevación del vertex
    float t = smoothstep(-0.1, 0.15, vElevation);
    vec3 color = mix(colorDark, colorMid, t);
    
    // Resplandor central simulando la luz dorada de la referencia
    float dist = distance(vUv, vec2(0.5, 0.5));
    float glow = smoothstep(0.6, 0.0, dist) * 0.7;
    color = mix(color, colorLight, glow * t);
    
    // Highlight en zonas altas
    float highlight = smoothstep(0.08, 0.15, vElevation);
    color = mix(color, colorGold, highlight * glow * 0.5);
    
    // "Rayas" verticales sutiles (como las de la textura sucia de la referencia)
    float streaks = sin(vUv.x * 80.0 + vElevation * 20.0) * 0.5 + 0.5;
    streaks = pow(streaks, 8.0) * 0.12;
    color += vec3(streaks * glow);
    
    // Efecto vignette oscuro para los bordes
    float vignette = smoothstep(0.7, 0.3, dist);
    color *= mix(0.2, 1.0, vignette);
    
    // Alpha sutil en los bordes
    float alpha = smoothstep(0.8, 0.5, dist);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * DistortedPlane — La malla principal con shaders custom
 */
function DistortedPlane() {
    const meshRef = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
        }),
        []
    );

    // Actualizar uniforms en cada frame
    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef} scale={[4.5, 3.0, 1]}>
            <planeGeometry args={[1, 1, 128, 128]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

/**
 * CanvasScene — Componente de la escena WebGL principal
 * Renderiza la superficie distorsionada con look de cristal sucio/dorado
 */
export default function CanvasScene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 2.5], fov: 50 }}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
            }}
            dpr={[1, 1.5]}   // Limitar DPR para rendimiento
            className="w-full h-full"
            style={{ background: 'transparent' }}
        >
            {/* Iluminación ambiental tenue */}
            <ambientLight intensity={0.3} />
            <directionalLight
                position={[5, 5, 5]}
                intensity={0.8}
                color="#8a7a3a"
            />

            {/* Mesh distorsionado flotante */}
            <Float
                speed={0.8}
                rotationIntensity={0.05}
                floatIntensity={0.15}
            >
                <DistortedPlane />
            </Float>
        </Canvas>
    );
}
