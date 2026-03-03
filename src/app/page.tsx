'use client';

import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import WorkSection from '@/components/WorkSection';
import ServicesSection from '@/components/ServicesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Navbar />

      <main className="relative z-10 bg-[#fbf5e9]">
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <ServicesSection />
        <ContactSection />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
