'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

// --- GLSL Shaders ---

const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uMouse;
  attribute vec3 aTargetPosition;
  attribute float aSize;
  attribute vec3 aRandomPos;
  
  varying vec3 vColor;

  // Curl noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    // Brand Color
    vColor = vec3(0.98, 0.35, 0.0); // #fa5a00

    float t = uTime * 0.3;
    
    // Create chaotic swirling motion using noise for the initial state
    vec3 noisePos = vec3(
        snoise(vec3(position.x * 0.1, position.y * 0.1, t)),
        snoise(vec3(position.y * 0.1, position.z * 0.1, t + 10.0)),
        snoise(vec3(position.z * 0.1, position.x * 0.1, t + 20.0))
    ) * 15.0; // Explosion radius
    
    vec3 chaosPos = aRandomPos + noisePos;

    // Use extreme easing to snap the particles from chaos to order
    // the progress is driven by GSAP uniformly
    float easing = smoothstep(0.0, 1.0, uProgress);
    easing = pow(easing, 3.0); // Make it snap in at the end

    vec3 finalPos = mix(chaosPos, aTargetPosition, easing);

    // Apply interactive Mouse repulsion only after formation
    if (easing > 0.9) {
        // Localized Mouse Repulsion Sphere
        vec2 mouseVec = finalPos.xy - uMouse;
        float dist = length(mouseVec);
        float maxDist = 1.5; // Reduced repulsion area for a finer interaction
        
        if (dist < maxDist) { 
            float force = (maxDist - dist) / maxDist;
            force = pow(force, 2.0); // Smooth falloff curve
            vec2 push = normalize(mouseVec) * force * 1.5; // XYZ displacement severity
            finalPos.xy += push;
            finalPos.z += force * 2.0; // Pops out slightly towards the camera
        }
    }

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    
    // Modulate size: they are larger when forming, smaller when chaotic
    float pointSize = mix(aSize * 1.0, aSize * 4.0, easing);
    gl_PointSize = pointSize * (400.0 / -max(mvPosition.z, 0.01));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;

  void main() {
    // Make them soft, glowing circles instead of hard squares
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) {
        discard;
    }
    
    // Center is solid, edges are blurry for a glowing effect
    float alpha = 1.0 - smoothstep(0.4, 1.0, r);
    alpha = pow(alpha, 0.3); // Extreme boost to mid-tones making dots very solid
    
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// --- Particle Logic ---

function ParticleSystem({ logoData }: { logoData: { x: number, y: number }[] }) {
    const meshRef = useRef<THREE.Points>(null);
    const count = logoData.length;

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
    }), []);

    const { positions, targetPositions, randomPositions, sizes } = useMemo(() => {
        // Fill buffers
        const pos = new Float32Array(count * 3);
        const target = new Float32Array(count * 3);
        const rand = new Float32Array(count * 3);
        const sz = new Float32Array(count);

        logoData.forEach((point, i) => {
            // Current logical position (starts at target in array, will be manipulated in shader)
            pos[i * 3 + 0] = 0;
            pos[i * 3 + 1] = 0;
            pos[i * 3 + 2] = 0;

            // The true target shape of the logo
            // Scale up to make the logo large and imposing
            target[i * 3 + 0] = (point.x - 0.5) * 35;
            target[i * 3 + 1] = (0.5 - point.y) * 35; // SVG uses flipped Y
            target[i * 3 + 2] = 0;

            // Base random positions for the explosion cloud
            rand[i * 3 + 0] = (Math.random() - 0.5) * 12;
            rand[i * 3 + 1] = (Math.random() - 0.5) * 12;
            rand[i * 3 + 2] = (Math.random() - 0.5) * 15;

            // Make particle sizes MUCH larger so the overall shape feels glowing and extremely solid
            sz[i] = Math.random() * 6.0 + 3.0;
        });

        return { positions: pos, targetPositions: target, randomPositions: rand, sizes: sz };
    }, [logoData, count]);

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;

            // Project pointer from Normalized coordinates [-1, 1] into World units
            const targetX = (state.pointer.x * state.viewport.width) / 2;
            const targetY = (state.pointer.y * state.viewport.height) / 2;

            // Lerp mouse target for buttery smooth following instead of snapping
            material.uniforms.uMouse.value.x += (targetX - material.uniforms.uMouse.value.x) * 0.08;
            material.uniforms.uMouse.value.y += (targetY - material.uniforms.uMouse.value.y) * 0.08;
        }
    });

    useEffect(() => {
        // Reset progress on mount to ensure animation plays
        uniforms.uProgress.value = 0;

        // Animate the logo assembly
        // We use a longer duration for a cinematic feel
        gsap.to(uniforms.uProgress, {
            value: 1,
            duration: 3.5,
            ease: 'power3.inOut',
            delay: 0.5,
        });
    }, [uniforms.uProgress]);

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-aTargetPosition" args={[targetPositions, 3]} />
                <bufferAttribute attach="attributes-aRandomPos" args={[randomPositions, 3]} />
                <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
            </bufferGeometry>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending} // Additive blending makes them glow when overlapped
            />
        </points>
    );
}

// --- Main Component ---

export default function ParticleLogo() {
    const [logoPoints, setLogoPoints] = React.useState<{ x: number, y: number }[]>([]);

    useEffect(() => {
        const img = new Image();
        img.src = '/LogoWeb1.svg';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Subir la resolución de escaneo a 600x600 para tener muchas más partículas
            const size = 600;
            canvas.width = size;
            canvas.height = size;

            const aspect = img.width / img.height;
            let drawW = size;
            let drawH = size / aspect;
            if (drawH > size) {
                drawH = size;
                drawW = size * aspect;
            }

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, size, size);
            // Draw image tightly in the center
            ctx.drawImage(img, (size - drawW) / 2, (size - drawH) / 2, drawW, drawH);

            const imageData = ctx.getImageData(0, 0, size, size).data;
            const points = [];

            // Sample pixels
            for (let y = 0; y < size; y += 1) {
                // Skip some pixels strategically to control performance while keeping density
                for (let x = 0; x < size; x += 1) {
                    const index = (y * size + x) * 4;
                    const r = imageData[index];

                    // Black pixels (logo) are r < 100
                    if (r < 100) {
                        points.push({ x: x / size, y: y / size });
                    }
                }
            }

            // Keeping ALL points for a completely dense, hyper-cohesive cloud so nothing is separated
            setLogoPoints(points);
        };
    }, []);

    if (logoPoints.length === 0) return null;

    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 20] }} gl={{ alpha: true }}>
                <ParticleSystem logoData={logoPoints} />
            </Canvas>
        </div>
    );
}
