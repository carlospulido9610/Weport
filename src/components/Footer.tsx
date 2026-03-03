'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const year = new Date().getFullYear();

    useEffect(() => {
        if (!footerRef.current) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: footerRef.current,
                start: 'top bottom',
                end: 'top top',
                scrub: true,
                onUpdate: (self) => {
                    footerRef.current?.style.setProperty(
                        '--footer-progress',
                        String(self.progress)
                    );
                },
            });
        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} className="shifting-footer">
            <div className="shifting-footer-inner">

                {/* Logo / Name */}
                <span className="footer-logo">
                    Carlos Pulido
                </span>

                {/* Nav: Menu */}
                <nav className="footer-nav-menu">
                    <span className="nav-label">Navigation</span>
                    <a href="#hero">Home</a>
                    <a href="#about">About</a>
                    <a href="#work">Work</a>
                    <a href="#services">Services</a>
                    <a href="#contact">Contact</a>
                </nav>

                {/* Nav: Help / Info */}
                <nav className="footer-nav-help">
                    <span className="nav-label">Info</span>
                    <span>Availability</span>
                    <span>Freelance</span>
                    <span>Collaborations</span>
                </nav>

                {/* Nav: Legal */}
                <nav className="footer-nav-legal">
                    <span className="nav-label">Legal</span>
                    <span>Privacy Policy</span>
                    <span>Terms &amp; Conditions</span>
                </nav>

                {/* Nav: Socials */}
                <nav className="footer-nav-socials">
                    <span className="nav-label">Connect</span>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="https://behance.net" target="_blank" rel="noopener noreferrer">Behance</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                </nav>

                {/* Copyright */}
                <div className="footer-copy">
                    © {year} Carlos Pulido.<br />All rights reserved
                </div>

            </div>
        </footer>
    );
}
