'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

// --- Types ---
export interface GradientSliderItem {
    id: string;
    title: string;
    img: string;
}

interface GradientSliderProps {
    items: GradientSliderItem[];
    height?: string;
}

// --- Constants ---
const FRICTION = 0.95;
const DRAG_SENS = 0.8;
const MAX_ROTATION = 25;
const MAX_DEPTH = 120;
const MIN_SCALE = 0.92;
const SCALE_RANGE = 0.08;
const GAP = 30;

// --- Helper Functions ---
function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h /= 360;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export default function GradientSlider({ items, height = '70vh' }: GradientSliderProps) {
    const stageRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // Internal state using refs for performance (physics loop)
    const state = useRef({
        scrollX: 0,
        vX: 0,
        dragging: false,
        lastX: 0,
        lastT: 0,
        lastDelta: 0,
        activeIndex: -1,
        trackWidth: 0,
        cardWidth: 0,
        step: 0,
        vwHalf: 0,
        gradPalette: [] as { c1: number[], c2: number[] }[],
        gradCurrent: { r1: 251, g1: 245, b1: 233, r2: 251, g2: 245, b2: 233 },
        rafId: 0,
        canvasRafId: 0,
    });

    // --- Color Extraction ---
    const extractPalette = async () => {
        const p = await Promise.all(items.map(async (item, idx) => {
            return new Promise<{ c1: number[], c2: number[] }>((resolve) => {
                const img = new (window as any).Image();
                img.crossOrigin = "Anonymous";
                img.src = item.img;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 10; canvas.height = 10;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return resolve({ c1: [251, 245, 233], c2: [251, 245, 233] });
                    ctx.drawImage(img, 0, 0, 10, 10);
                    const data = ctx.getImageData(0, 0, 10, 10).data;

                    // Simple average for Demo
                    let r = 0, g = 0, b = 0;
                    for (let i = 0; i < data.length; i += 4) {
                        r += data[i]; g += data[i + 1]; b += data[i + 2];
                    }
                    r = Math.round(r / (data.length / 4));
                    g = Math.round(g / (data.length / 4));
                    b = Math.round(b / (data.length / 4));

                    const hsl = rgbToHsl(r, g, b);
                    const c1 = hslToRgb(hsl[0], Math.max(0.4, hsl[1]), 0.6);
                    const c2 = hslToRgb((hsl[0] + 30) % 360, Math.max(0.3, hsl[1]), 0.8);
                    resolve({ c1, c2 });
                };
                img.onerror = () => resolve({ c1: [251, 245, 233], c2: [251, 245, 233] });
            });
        }));
        state.current.gradPalette = p;
    };

    // --- Render Loops ---
    const updateTransforms = () => {
        if (!trackRef.current) return;
        const s = state.current;
        const cards = trackRef.current.children;
        const half = s.trackWidth / 2;
        let closestIdx = -1;
        let closestDist = Infinity;

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i] as HTMLElement;
            let x = (i * s.step) - s.scrollX;

            // Wrap
            if (x < -half) x += s.trackWidth;
            if (x > half) x -= s.trackWidth;

            const dist = Math.abs(x);
            if (dist < closestDist) {
                closestDist = dist;
                closestIdx = i;
            }

            const norm = Math.max(-1, Math.min(1, x / s.vwHalf));
            const absNorm = Math.abs(norm);
            const invNorm = 1 - absNorm;

            const ry = -norm * MAX_ROTATION;
            const tz = invNorm * MAX_DEPTH;
            const scale = MIN_SCALE + invNorm * SCALE_RANGE;

            card.style.transform = `translate3d(${x}px, -50%, ${tz}px) rotateY(${ry}deg) scale(${scale})`;
            card.style.zIndex = String(Math.round(1000 + tz));
            const blur = 3 * Math.pow(absNorm, 1.2);
            card.style.filter = `blur(${blur.toFixed(2)}px)`;
            card.style.opacity = String(Math.max(0.1, 1 - absNorm * 0.8));
        }

        if (closestIdx !== s.activeIndex && s.gradPalette[closestIdx]) {
            s.activeIndex = closestIdx;
            const pal = s.gradPalette[closestIdx];
            gsap.to(s.gradCurrent, {
                r1: pal.c1[0], g1: pal.c1[1], b1: pal.c1[2],
                r2: pal.c2[0], g2: pal.c2[1], b2: pal.c2[2],
                duration: 0.8,
                ease: 'power2.out'
            });
        }
    };

    const drawBackground = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const s = state.current;
        const w = canvas.width, h = canvas.height;
        ctx.fillStyle = '#fbf5e9';
        ctx.fillRect(0, 0, w, h);

        const time = performance.now() * 0.0005;
        const cx = w * 0.5, cy = h * 0.5;
        const x1 = cx + Math.cos(time) * w * 0.2;
        const y1 = cy + Math.sin(time * 0.7) * h * 0.2;

        const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, w * 0.6);
        g1.addColorStop(0, `rgba(${s.gradCurrent.r1},${s.gradCurrent.g1},${s.gradCurrent.b1},0.4)`);
        g1.addColorStop(1, 'rgba(251, 245, 233, 0)');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, w, h);

        s.canvasRafId = requestAnimationFrame(drawBackground);
    };

    const tick = (t: number) => {
        const s = state.current;
        if (!s.dragging && s.vX !== 0) {
            s.scrollX = mod(s.scrollX + s.vX * 0.016, s.trackWidth);
            s.vX *= FRICTION;
            if (Math.abs(s.vX) < 1) s.vX = 0;
            updateTransforms();
        }
        s.rafId = requestAnimationFrame(tick);
    };

    // --- Lifecycle ---
    useEffect(() => {
        const init = async () => {
            if (!stageRef.current || !trackRef.current) return;

            // Measure
            const stage = stageRef.current;
            const sample = trackRef.current.children[0] as HTMLElement;
            if (!sample) return;

            const rect = sample.getBoundingClientRect();
            state.current.cardWidth = rect.width;
            state.current.step = rect.width + GAP;
            state.current.trackWidth = items.length * state.current.step;
            state.current.vwHalf = stage.clientWidth * 0.5;

            await extractPalette();
            updateTransforms();

            state.current.rafId = requestAnimationFrame(tick);
            state.current.canvasRafId = requestAnimationFrame(drawBackground);
        };

        init();

        const handleResize = () => {
            if (!stageRef.current) return;
            state.current.vwHalf = stageRef.current.clientWidth * 0.5;
            updateTransforms();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(state.current.rafId);
            cancelAnimationFrame(state.current.canvasRafId);
        };
    }, [items]);

    // --- Events ---
    const onPointerDown = (e: React.PointerEvent) => {
        const s = state.current;
        s.dragging = true;
        s.lastX = e.clientX;
        s.lastT = performance.now();
        s.vX = 0;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent) => {
        const s = state.current;
        if (!s.dragging) return;
        const now = performance.now();
        const dx = e.clientX - s.lastX;
        const dt = Math.max(1, now - s.lastT);

        s.scrollX = mod(s.scrollX - dx * DRAG_SENS, s.trackWidth);
        s.lastDelta = (dx / dt) * 1000;
        s.lastX = e.clientX;
        s.lastT = now;
        updateTransforms();
    };

    const onPointerUp = (e: React.PointerEvent) => {
        const s = state.current;
        s.dragging = false;
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        s.vX = -s.lastDelta * DRAG_SENS;
    };

    return (
        <div
            ref={stageRef}
            className="relative w-full overflow-hidden select-none touch-none bg-[#fbf5e9]"
            style={{ height }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none opacity-50 blur-3xl"
                width={400}
                height={400}
            />

            <div
                ref={trackRef}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
            >
                {items.map((item) => (
                    <article
                        key={item.id}
                        className="absolute w-[280px] md:w-[320px] lg:w-[380px] aspect-[4/5] will-change-transform"
                        style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                    >
                        <div className="relative w-full h-full overflow-hidden rounded-xl bg-black/5 shadow-2xl">
                            <Image
                                src={item.img}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="380px"
                                draggable={false}
                            />
                            {/* Overlay info */}
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <p className="text-xs uppercase tracking-widest opacity-60 mb-1">{item.id}</p>
                                <h4 className="text-xl font-sans tracking-tight leading-none">{item.title}</h4>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
