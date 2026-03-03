'use client';

import ParticleLogo from './ParticleLogo';
import LiveClock from './LiveClock';
import SoundToggle from './SoundToggle';
import AnimateIn from './AnimateIn';
import { Grid, Col } from './Grid';

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="relative w-full h-screen bg-[#fbf5e9] overflow-hidden"
        >
            {/* Particle Logo */}
            <div className="absolute inset-0 z-0 w-full h-full">
                <ParticleLogo />
            </div>

            {/* Absolute Perfect Center: Hero statement */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none">
                <AnimateIn variant="fade-up" delay={0.2} distance={60}>
                    <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-normal tracking-tight leading-[1.05] text-black drop-shadow-sm">
                        Creative <span className="font-accent italic text-[#fa5a00]">Director</span><br />
                        &amp; Developer
                    </h1>
                </AnimateIn>
            </div>

            {/* Bottom variables using Grid */}
            <Grid className="relative z-20 h-full pt-10 pb-[var(--container-padding)] pointer-events-none items-end">

                {/* Bottom left label */}
                <Col span={4} className="pointer-events-auto flex items-end">
                    <div className="hidden md:block w-[150px]"></div>
                    <SoundToggle />
                </Col>

                {/* Bottom Center Clock - Updated Style */}
                <Col span={4} className="pointer-events-auto flex items-end justify-center">
                    <AnimateIn variant="fade-in" delay={0.8} duration={1.5}>
                        <div className="text-black font-sans text-sm md:text-base font-medium tracking-normal mix-blend-multiply">
                            <LiveClock />
                        </div>
                    </AnimateIn>
                </Col>

                {/* Bottom right label */}
                <Col span={4} className="pointer-events-auto flex items-end justify-end">
                    <p className="text-black font-sans text-sm md:text-base font-medium tracking-normal select-none cursor-default mix-blend-multiply">
                        © CARLOS PULIDO
                    </p>
                </Col>

            </Grid>
        </section>
    );
}
