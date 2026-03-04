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

            {/* Bottom bar — responsive */}
            <div className="absolute bottom-0 left-0 right-0 z-20 pb-5 md:pb-[var(--container-padding)] px-4 md:px-[var(--container-padding)] flex items-end justify-between pointer-events-none">

                {/* Left: Sound toggle (hidden on mobile) */}
                <div className="pointer-events-auto hidden sm:block">
                    <SoundToggle />
                </div>

                {/* Center-ish: Clock */}
                <AnimateIn variant="fade-in" delay={0.8} duration={1.5}>
                    <div className="pointer-events-auto text-black font-sans text-xs sm:text-sm md:text-base font-medium tracking-normal mix-blend-multiply">
                        <LiveClock />
                    </div>
                </AnimateIn>

                {/* Right: Copyright */}
                <p className="pointer-events-auto text-black font-sans text-[10px] sm:text-sm font-medium tracking-normal select-none mix-blend-multiply">
                    © CARLOS PULIDO
                </p>
            </div>
        </section>
    );
}
