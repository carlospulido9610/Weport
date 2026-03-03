'use client';

import { useState } from 'react';
import AnimateIn from './AnimateIn';

/* ========================================
   CONTACT — Simplified Clean Split Layout
   A refined version of the bento design that improves
   visual flow by grouping content into two main blocks.
   ======================================== */

export default function ContactSection() {
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', form);
        setSent(true);
    };

    return (
        <section
            id="contact"
            className="relative w-full min-h-[100svh] flex flex-col justify-center py-24 md:pt-32 md:pb-40 bg-[#fbf5e9] text-black rounded-t-[2rem] md:rounded-t-[3rem] -mt-8 z-30"
        >
            <div className="max-w-7xl mx-auto px-4 md:px-[var(--container-padding)] w-full">

                {/* Header */}
                <AnimateIn variant="fade-up" delay={0.1}>
                    <div className="flex justify-between items-end mb-16 border-b border-black/10 pb-6">
                        <h2 className="text-5xl md:text-8xl font-normal uppercase tracking-tight leading-none">
                            Contact
                        </h2>
                        <span className="text-[9px] uppercase tracking-[0.4em] text-black/40 self-end">
                            Let&apos;s Talk
                        </span>
                    </div>
                </AnimateIn>

                {sent ? (
                    <AnimateIn variant="fade-up" delay={0.1}>
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="text-6xl mb-6 text-[#fa5a00]">✓</div>
                                <p className="text-sm uppercase tracking-[0.3em] text-black/50">
                                    Message sent. I&apos;ll be in touch soon.
                                </p>
                            </div>
                        </div>
                    </AnimateIn>
                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-8">

                        {/* LEFT COLUMN: Info & CTA */}
                        <AnimateIn variant="fade-up" delay={0.15} className="md:col-span-5 h-full">
                            <div className="bento-card bento-card--dark h-full flex flex-col justify-between p-8 md:p-10 lg:p-12 min-h-[400px]">
                                <div>
                                    <span className="bento-label block text-white/40">Available for work</span>
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight mt-6">
                                        Have a project in mind? Let&apos;s build something{' '}
                                        <span className="font-accent italic text-[#fa5a00]">great</span>{' '}
                                        together.
                                    </h3>
                                </div>

                                <div className="mt-16 flex flex-col gap-6">
                                    <div>
                                        <span className="bento-label block text-white/40 mb-2">Location</span>
                                        <p className="text-lg">Bogotá, Colombia</p>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">
                                            GMT-5 · Remote worldwide
                                        </p>
                                    </div>

                                    <div>
                                        <span className="bento-label block text-white/40 mb-2">Response Time</span>
                                        <p className="text-2xl text-[#fa5a00]">&lt;24h</p>
                                    </div>

                                    <div className="pt-4 border-t border-white/10">
                                        <a
                                            href="mailto:hello@carlospulido.co"
                                            className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60 hover:text-[#fa5a00] transition-colors duration-300"
                                        >
                                            hello@carlospulido.co
                                            <span className="text-lg leading-none">↗</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </AnimateIn>

                        {/* RIGHT COLUMN: The Form */}
                        <AnimateIn variant="fade-up" delay={0.2} className="md:col-span-7 h-full">
                            <div className="bento-card bento-card--light h-full p-8 md:p-10 lg:p-12 flex flex-col relative">
                                <form onSubmit={handleSubmit} className="flex flex-col h-full">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        {/* Name Field */}
                                        <div className="relative pb-4 flex flex-col justify-end group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-black/40 group-focus-within:text-[#fa5a00] transition-colors mb-2">
                                                Name
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="w-full bg-transparent border-none outline-none font-sans text-lg text-black placeholder:text-black/20"
                                                placeholder="Your name"
                                            />
                                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/10 transition-colors duration-300 group-focus-within:bg-[#fa5a00]"></div>
                                        </div>

                                        {/* Email Field */}
                                        <div className="relative pb-4 flex flex-col justify-end group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] text-black/40 group-focus-within:text-[#fa5a00] transition-colors mb-2">
                                                Email
                                            </label>
                                            <input
                                                required
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="w-full bg-transparent border-none outline-none font-sans text-lg text-black placeholder:text-black/20"
                                                placeholder="your@email.com"
                                            />
                                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/10 transition-colors duration-300 group-focus-within:bg-[#fa5a00]"></div>
                                        </div>
                                    </div>

                                    {/* Message Field */}
                                    <div className="relative pb-4 flex flex-col flex-1 group mb-8">
                                        <label className="text-[10px] uppercase tracking-[0.3em] text-black/40 group-focus-within:text-[#fa5a00] transition-colors mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            required
                                            rows={6}
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            className="w-full bg-transparent border-none outline-none font-sans text-lg text-black placeholder:text-black/20 resize-none flex-1 mt-2"
                                            placeholder="Tell me about your project, timeline, and budget..."
                                        />
                                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/10 transition-colors duration-300 group-focus-within:bg-[#fa5a00]"></div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="bento-card bento-card--accent w-full py-6 flex items-center justify-between px-8 cursor-pointer group"
                                        data-cursor
                                    >
                                        <span className="text-xs uppercase tracking-[0.3em] text-white font-medium">
                                            Send Message
                                        </span>
                                        <span className="text-2xl text-white group-hover:translate-x-2 transition-transform duration-300">
                                            →
                                        </span>
                                    </button>

                                </form>
                            </div>
                        </AnimateIn>

                    </div>

                )}
            </div>
        </section>
    );
}
