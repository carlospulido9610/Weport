'use client';

import { useRef, useEffect, type ReactNode, type HTMLAttributes } from 'react';
import { useIntersectionObserver } from 'hamo';
import gsap from 'gsap';

/* ========================================
   ANIMATE-IN — Scroll-triggered GSAP animation
   Uses hamo's useIntersectionObserver to detect
   when an element enters the viewport, then fires
   a GSAP fade-in + slide-up animation.
   ======================================== */

interface AnimateInProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    /** Animation variant */
    variant?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';
    /** Delay in seconds */
    delay?: number;
    /** Duration in seconds */
    duration?: number;
    /** Distance to animate from (px) */
    distance?: number;
    /** IntersectionObserver threshold (0-1) */
    threshold?: number;
    /** Only animate once? */
    once?: boolean;
}

export default function AnimateIn({
    children,
    variant = 'fade-up',
    delay = 0,
    duration = 0.8,
    distance = 40,
    threshold = 0.1,
    once = true,
    className = '',
    ...props
}: AnimateInProps) {
    const innerRef = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    const [setElement, entry] = useIntersectionObserver({
        threshold,
        once,
    });

    // Connect both refs
    useEffect(() => {
        if (innerRef.current) {
            setElement(innerRef.current);
        }
    }, [setElement]);

    // Set initial hidden state
    useEffect(() => {
        if (!innerRef.current) return;

        const from = getFromValues(variant, distance);
        gsap.set(innerRef.current, { ...from });
    }, [variant, distance]);

    // Animate when in view
    useEffect(() => {
        if (!entry?.isIntersecting || !innerRef.current) return;
        if (once && hasAnimated.current) return;

        hasAnimated.current = true;

        const to = getToValues(variant);
        gsap.to(innerRef.current, {
            ...to,
            duration,
            delay,
            ease: 'power3.out',
        });
    }, [entry?.isIntersecting, variant, duration, delay, once]);

    return (
        <div ref={innerRef} className={className} {...props}>
            {children}
        </div>
    );
}

function getFromValues(variant: string, distance: number) {
    switch (variant) {
        case 'fade-up':
            return { opacity: 0, y: distance };
        case 'fade-in':
            return { opacity: 0 };
        case 'slide-left':
            return { opacity: 0, x: distance };
        case 'slide-right':
            return { opacity: 0, x: -distance };
        default:
            return { opacity: 0, y: distance };
    }
}

function getToValues(variant: string) {
    switch (variant) {
        case 'fade-up':
            return { opacity: 1, y: 0 };
        case 'fade-in':
            return { opacity: 1 };
        case 'slide-left':
            return { opacity: 1, x: 0 };
        case 'slide-right':
            return { opacity: 1, x: 0 };
        default:
            return { opacity: 1, y: 0 };
    }
}
