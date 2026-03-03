'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        // ---- Exact same pattern as the Osmo CodePen ----
        const navWrap = document.querySelector('.nav') as HTMLElement;
        if (!navWrap) return;

        gsap.set(navWrap, { display: 'none' });

        gsap.defaults({ ease: 'power3.inOut', duration: 0.7 });

        const overlay = navWrap.querySelector('.overlay') as HTMLElement;
        const menu = navWrap.querySelector('.menu') as HTMLElement;
        const bgPanels = navWrap.querySelectorAll('.bg-panel');
        const menuToggles = document.querySelectorAll('[data-menu-toggle]');
        const menuLinks = navWrap.querySelectorAll('.menu-link');
        const fadeTargets = navWrap.querySelectorAll('[data-menu-fade]');
        const menuButton = document.querySelector('.menu-button') as HTMLElement;
        const menuButtonTexts = menuButton?.querySelectorAll('p');
        const menuButtonIcon = menuButton?.querySelector('.menu-button-icon') as HTMLElement;

        const tl = gsap.timeline();

        const openNav = () => {
            navWrap.setAttribute('data-nav', 'open');
            document.body.style.overflow = 'hidden';

            tl.clear()
                .set(navWrap, { display: 'flex' })
                .set(menu, { xPercent: 0 }, '<')
                .fromTo(
                    menuButtonTexts,
                    { yPercent: 0 },
                    { yPercent: -100, stagger: 0.2 }
                )
                .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, '<')
                .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, '<')
                .fromTo(
                    bgPanels,
                    { xPercent: 101 },
                    { xPercent: 0, stagger: 0.12, duration: 0.575 },
                    '<'
                )
                .fromTo(
                    menuLinks,
                    { yPercent: 140, rotate: 10 },
                    { yPercent: 0, rotate: 0, stagger: 0.05 },
                    '<+=0.35'
                )
                .fromTo(
                    fadeTargets,
                    { autoAlpha: 0, yPercent: 50 },
                    { autoAlpha: 1, yPercent: 0, stagger: 0.04 },
                    '<+=0.2'
                );
        };

        const closeNav = () => {
            navWrap.setAttribute('data-nav', 'closed');
            document.body.style.overflow = '';

            tl.clear()
                .to(overlay, { autoAlpha: 0 })
                .to(menu, { xPercent: 120 }, '<')
                .to(menuButtonTexts, { yPercent: 0 }, '<')
                .to(menuButtonIcon, { rotate: 0 }, '<')
                .set(navWrap, { display: 'none' });
        };

        // Toggle
        menuToggles.forEach((toggle) => {
            toggle.addEventListener('click', () => {
                const state = navWrap.getAttribute('data-nav');
                if (state === 'open') closeNav();
                else openNav();
            });
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navWrap.getAttribute('data-nav') === 'open') {
                closeNav();
            }
        });

        // Overlay click
        overlay?.addEventListener('click', () => {
            if (navWrap.getAttribute('data-nav') === 'open') closeNav();
        });

        // Menu link clicks — smooth scroll
        menuLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = (link as HTMLAnchorElement).getAttribute('href');
                closeNav();
                if (href) {
                    setTimeout(() => {
                        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
                    }, 800);
                }
            });
        });
    }, []);

    const year = new Date().getFullYear();

    return (
        <>
            {/* ===== FIXED NAME — REMOVED ===== */}

            {/* ===== MENU BUTTON — Top Right (Osmo) ===== */}
            <button
                className="menu-button fixed top-6 right-6 md:top-10 md:right-10 z-[110] flex items-center gap-2.5 bg-transparent border-none p-4 -m-4 group"
                data-menu-toggle
                aria-label="Toggle menu"
            >
                <div className="flex flex-col items-end h-[14px] overflow-hidden text-sm">
                    <p className="uppercase tracking-[0.3em] text-black m-0 !no-underline !border-none !outline-none block" style={{ textDecoration: 'none !important', borderBottom: 'none !important', boxShadow: 'none !important', height: '14px', lineHeight: '14px' }}>Menu</p>
                    <p className="uppercase tracking-[0.3em] text-black m-0 !no-underline !border-none !outline-none block" style={{ textDecoration: 'none !important', borderBottom: 'none !important', boxShadow: 'none !important', height: '14px', lineHeight: '14px' }}>Close</p>
                </div>
                <div className="menu-button-icon w-4 h-4 relative transition-transform duration-[400ms] ease-[cubic-bezier(0.65,0.05,0,1)] group-hover:rotate-90">
                    <span className="absolute top-1/2 left-0 w-full h-[1.5px] bg-black -translate-y-1/2" />
                    <span className="absolute top-0 left-1/2 w-[1.5px] h-full bg-black -translate-x-1/2" />
                </div>
            </button>

            {/* ===== NAV (Osmo structure — same classes as CodePen) ===== */}
            <div className="nav fixed inset-0 z-[100] flex justify-end" data-nav="closed">

                {/* Overlay */}
                <div className="overlay absolute inset-0 z-0 cursor-pointer" style={{ backgroundColor: 'rgba(19,19,19,0.4)' }} />

                {/* Menu */}
                <div className="menu relative h-full w-full max-w-[520px] md:max-w-[560px] overflow-auto">

                    {/* BG Panels */}
                    <div className="absolute inset-0 z-0">
                        <div className="bg-panel absolute inset-0 bg-[#fbf5e9]" />
                        <div className="bg-panel absolute inset-0 bg-[#fbf5e9]" />
                        <div className="bg-panel absolute inset-0 bg-[#fbf5e9]" />
                    </div>

                    {/* Menu inner content */}
                    <div className="relative z-10 flex flex-col h-full px-[var(--container-padding)] pt-24 md:pt-32 pb-[var(--container-padding)] overflow-auto font-sans">

                        {/* Nav links - Vertically Centered */}
                        <div className="flex-1 flex flex-col justify-center w-full my-8 min-h-[min-content]">
                            <nav className="flex flex-col w-full">
                                {navItems.map((item, i) => (
                                    <div key={item.href} className="relative overflow-hidden">
                                        <a
                                            href={item.href}
                                            className="menu-link group flex gap-3 w-full py-8 md:py-10 no-underline relative"
                                        >
                                            {/* Dark hover bg */}
                                            <div className="absolute inset-0 z-0 bg-[#1f1f1f] origin-bottom scale-y-0 transition-transform duration-[0.55s] ease-[cubic-bezier(0.65,0.05,0,1)] group-hover:scale-y-100" />

                                            {/* Heading with text-shadow slide trick */}
                                            <span
                                                className="relative z-10 text-[clamp(2.5rem,5.625em,5rem)] font-bold uppercase leading-[0.9] tracking-tight text-black font-sans transition-transform duration-[0.55s] ease-[cubic-bezier(0.65,0.05,0,1)] group-hover:-translate-y-[1.1em]"
                                                style={{ textShadow: '0px 1.1em 0px #fbf5e9' }}
                                            >
                                                {item.label}
                                            </span>
                                        </a>
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* Bottom details */}
                        <div className="flex flex-col gap-[var(--grid-gap)] mt-auto pt-8">
                            <div data-menu-fade>
                                <p className="text-sm text-black">
                                    Carlos Pulido — Creative Director & Developer
                                </p>
                            </div>
                            <div data-menu-fade className="flex gap-6">
                                <a href="#" className="relative text-base text-black no-underline hover:text-[#fa5a00] transition-colors">LinkedIn</a>
                                <a href="#" className="relative text-base text-black no-underline hover:text-[#fa5a00] transition-colors">Behance</a>
                                <a href="#" className="relative text-base text-black no-underline hover:text-[#fa5a00] transition-colors">Instagram</a>
                            </div>
                            <div data-menu-fade>
                                <p className="text-xs text-black/30 uppercase tracking-[0.2em]">
                                    © {year} All Rights Reserved
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
