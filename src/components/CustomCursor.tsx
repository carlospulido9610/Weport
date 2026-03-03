'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        const onMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.05 });
        };

        const animate = () => {
            ringX += (mouseX - ringX) * 0.1;
            ringY += (mouseY - ringY) * 0.1;
            gsap.set(ring, { x: ringX, y: ringY });
            requestAnimationFrame(animate);
        };

        const onEnter = () => dot.classList.add('hovered');
        const onLeave = () => dot.classList.remove('hovered');

        document.addEventListener('mousemove', onMove);
        document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
            el.addEventListener('mouseenter', onEnter);
            el.addEventListener('mouseleave', onLeave);
        });

        animate();

        return () => {
            document.removeEventListener('mousemove', onMove);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot" />
            <div ref={ringRef} className="cursor-ring" />
        </>
    );
}
