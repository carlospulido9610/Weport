'use client';

import ParticleLogo from '@/components/ParticleLogo';

export default function LogoTestPage() {
    return (
        <main className="w-full h-screen bg-black overflow-hidden flex items-center justify-center">
            <div className="w-full h-full">
                <ParticleLogo />
            </div>

            <div className="absolute bottom-10 left-10 z-10">
                <h1 className="text-white/20 text-[10px] tracking-[0.5em] uppercase font-light">
                    Particle Animation System / <span className="text-[#fa5a00]">Carlos Pulido</span>
                </h1>
            </div>
        </main>
    );
}
