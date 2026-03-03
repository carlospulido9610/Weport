'use client';

import AnimateIn from './AnimateIn';

const services = [
    {
        id: 'creative',
        title: 'Creative\nDirection',
        desc: 'Strategic visual leadership for brands, campaigns, and digital products that stand out.',
        tech: ['Art Direction', 'Prototyping', 'Vision'],
        className: 'md:col-span-7 md:row-span-1 bg-[#1a1a1a] border border-white/10 text-[#fbf5e9]',
        accent: '#fa5a00',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="2" x2="12" y2="22" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        ),
    },
    {
        id: 'webdev',
        title: 'Web\nDevelopment',
        desc: 'Custom websites, landing pages, and web apps engineered for performance and aesthetics.',
        tech: ['React / Next.js', 'Tailwind', 'GSAP'],
        className: 'md:col-span-5 md:row-span-1 bg-[#fbf5e9] text-black',
        accent: '#fa5a00',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
    },
    {
        id: 'brand',
        title: 'Brand\nIdentity',
        desc: 'Logos, visual systems, typography, and color — building identities from the ground up.',
        tech: ['Figma', 'Typography', 'Design Systems'],
        className: 'md:col-span-5 md:row-span-1 bg-[#111] border border-white/10 text-[#fbf5e9]',
        accent: '#fa5a00',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: 'strategy',
        title: 'Digital\nStrategy',
        desc: 'Campaign planning, channel strategy, creative consulting, and performance optimization.',
        tech: ['SEO', 'Optimization', 'Growth'],
        className: 'md:col-span-7 md:row-span-1 bg-[#222] border border-white/5 text-[#fbf5e9]',
        accent: '#fa5a00',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="20" x2="18" y2="10" strokeLinecap="round" />
                <line x1="12" y1="20" x2="12" y2="4" strokeLinecap="round" />
                <line x1="6" y1="20" x2="6" y2="14" strokeLinecap="round" />
            </svg>
        ),
    },
];

export default function ServicesSection() {
    return (
        <section
            id="services"
            className="relative w-full py-20 md:py-28 bg-neutral-950 text-[#fbf5e9] rounded-t-[2rem] md:rounded-t-[3rem] -mt-8 z-20 overflow-hidden"
        >
            <div className="max-w-[85rem] mx-auto px-6 md:px-[var(--container-padding)] relative w-full">

                <AnimateIn variant="fade-up" delay={0.1}>
                    <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-[#fa5a00] mb-3">// My Expertise</h2>
                            <h3 className="text-4xl md:text-5xl lg:text-[5.5rem] font-normal tracking-tight whitespace-pre-line leading-[0.95]">
                                Services &<br />Skills.
                            </h3>
                        </div>
                        <p className="max-w-xs md:max-w-sm text-sm text-white/50 leading-relaxed pb-2">
                            A multidisciplinary approach blending high-end design, strategic thinking, and robust engineering to create standout digital experiences.
                        </p>
                    </div>
                </AnimateIn>

                {/* Bento Grid - Balanced Proportions */}
                <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-auto md:auto-rows-[280px] gap-4">
                    {services.map((service, i) => (
                        <AnimateIn
                            key={service.id}
                            variant="fade-up"
                            delay={0.2 + (i * 0.1)}
                            className={`group relative rounded-[1.5rem] p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${service.className}`}
                        >
                            {/* Top row */}
                            <div className="flex justify-between items-start z-10 mb-6 md:mb-0">
                                <div className={`p-3 rounded-full backdrop-blur-md border border-current/10 text-current transition-colors duration-300 group-hover:bg-[#fa5a00] group-hover:border-[#fa5a00] group-hover:text-black ${service.id === 'webdev' ? 'bg-black/5' : 'bg-white/5'}`}>
                                    {service.icon}
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <line x1="7" y1="17" x2="17" y2="7" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="7 7 17 7 17 17" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            {/* Center / Bottom content */}
                            <div className="z-10 mt-auto flex flex-col gap-3">
                                <h4 className="text-2xl lg:text-3xl font-normal tracking-tight leading-[1.1] whitespace-pre-line">
                                    {service.title}
                                </h4>
                                <p className="text-xs md:text-sm opacity-70 leading-relaxed max-w-sm">
                                    {service.desc}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {service.tech.map((t, idx) => (
                                        <span key={idx} className="text-[10px] md:text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-current/15 bg-current/5 backdrop-blur-md">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Decorative background element on hover */}
                            <div className="absolute inset-0 rounded-[1.5rem] opacity-0 group-hover:opacity-5 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-current to-transparent mix-blend-overlay" />
                        </AnimateIn>
                    ))}
                </div>

            </div>
        </section>
    );
}

