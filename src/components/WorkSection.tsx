import { WorksGallery } from './WorksGallery';

export default function WorkSection() {
    return (
        <section id="work" className="relative w-full py-16 bg-black flex flex-col gap-0">
            <div className="w-full px-[var(--container-padding)] mb-10">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans tracking-tight text-white max-w-2xl leading-[1.05]">
                    Selected <span className="font-accent italic text-[#fa5a00]">Works</span>
                </h2>
                <p className="mt-4 text-xs md:text-sm uppercase tracking-[0.2em] text-white/40">
                    Design — Development — Creative AI
                </p>
            </div>

            <WorksGallery />
        </section>
    );
}
