'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export interface GalleryItem {
    id: string;
    title: string;
    client: string;
    year: string;
    tags: string[];
    img: string;
}

interface HorizontalGalleryProps {
    items: GalleryItem[];
    direction?: 'left' | 'right';
}

export default function HorizontalGallery({ items, direction = 'left' }: HorizontalGalleryProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const track = trackRef.current;

        if (!section || !track) return;

        // Calculate translation range
        const getScrollAmount = () => {
            // We want it to move about 30% of its total width over the course of its lifespan on screen
            const moveAmount = track.scrollWidth * 0.3;
            return direction === 'left' ? -moveAmount : moveAmount;
        };

        // If it moves Right, start it shifted Left initially so it has room to move
        if (direction === 'right') {
            gsap.set(track, { x: -track.scrollWidth * 0.3 });
        }

        const scrollTween = gsap.to(track, {
            x: direction === 'left' ? getScrollAmount : 0,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom', // Start animating when the top of the section hits the bottom of the viewport
                end: 'bottom top',   // End animating when the bottom of the section hits the top of the viewport
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });

        const images = track.querySelectorAll('.parallax-img');

        images.forEach((img) => {
            gsap.to(img, {
                x: direction === 'left' ? '15%' : '-15%',
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });
        });

        return () => {
            scrollTween.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [items, direction]);

    return (
        <section ref={sectionRef} className="relative w-full py-2 overflow-hidden bg-[#fbf5e9]">

            <div ref={trackRef} className="flex gap-4 w-[max-content] will-change-transform hamo-scroller">

                {items.map((item, index) => (
                    <div
                        key={index} // allow easy duplication for endless feel
                        className="flex-shrink-0 w-[80vw] md:w-[45vw] lg:w-[35vw]"
                    >
                        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm select-none">
                            <div className="absolute inset-0 w-[120%] -left-[10%] h-full parallax-img will-change-transform bg-black/5">
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    fill
                                    className="object-cover pointer-events-none"
                                    sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 35vw"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    );
}  
