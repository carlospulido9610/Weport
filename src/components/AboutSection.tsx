'use client';

import { useEffect } from 'react';
import { Grid, Col } from './Grid';
import AnimateIn from './AnimateIn';
import StringTune from '@fiddle-digital/string-tune';

export default function AboutSection() {
    useEffect(() => {
        const tune = StringTune.getInstance();
        (tune as any).initObjects();

        return () => {
            if (tune.destroy) {
                tune.destroy();
            }
        };
    }, []);
    return (
        <section
            id="about"
            className="relative w-full min-h-[100svh] flex flex-col justify-center py-24 md:py-32 bg-[#fbf5e9] text-black rounded-t-[2rem] md:rounded-t-[3rem] -mt-8 z-[5]"
        >
            <Grid className="max-w-7xl mx-auto items-start">

                {/* Center: Main text */}
                <Col span={12} md={6} start={3}>


                    <AnimateIn variant="fade-up" delay={0.2}>
                        <h2
                            className="text-3xl md:text-5xl lg:text-5xl font-normal leading-tight tracking-tight mb-10"
                            data-string="split"
                            data-string-split="line, word"
                        >
                            I design and build
                            <br />digital experiences
                            <br />that <span className="font-accent italic text-[#fa5a00]">connect</span> brands
                            <br />with people.
                        </h2>
                    </AnimateIn>

                    <AnimateIn variant="fade-up" delay={0.3}>
                        <p
                            className="text-sm md:text-base font-normal text-black/60 leading-relaxed max-w-xl"
                            data-string="split"
                            data-string-split="line"
                        >
                            I'm Carlos Pulido — a Creative Director and Developer based in Bogotá.
                            I work at the intersection of strategy, design, and technology, helping
                            startups and companies build identities, products, and campaigns that
                            matter.
                        </p>
                    </AnimateIn>

                    <AnimateIn variant="fade-up" delay={0.4}>
                        <p
                            className="text-sm md:text-base font-normal text-black/60 leading-relaxed max-w-xl mt-4"
                            data-string="split"
                            data-string-split="line"
                        >
                            Whether it's your brand identity, your web platform, or your next digital
                            campaign — I bring a full-stack creative perspective to everything I touch.
                        </p>
                    </AnimateIn>
                </Col>

                {/* Right: Stats */}
                <Col span={12} md={3} start={10} className="flex flex-col gap-12 md:gap-[var(--grid-gap)]">


                    <div className="flex flex-col gap-12 md:gap-[var(--grid-gap)]">
                        {[
                            { num: '5+', label: 'Years of Experience' },
                            { num: '30+', label: 'Projects Delivered' },
                            { num: '50/50', label: 'Design & Dev' },
                        ].map((stat, i) => (
                            <AnimateIn key={stat.label} variant="fade-up" delay={0.5 + i * 0.1}>
                                <div className="border-t border-black/10 pt-4">
                                    <div className="text-3xl font-normal tracking-tight text-black">{stat.num}</div>
                                    <div className="text-[10px] uppercase tracking-[0.3em] text-black/40 mt-1">{stat.label}</div>
                                </div>
                            </AnimateIn>
                        ))}
                    </div>
                </Col>

            </Grid>
        </section>
    );
}
