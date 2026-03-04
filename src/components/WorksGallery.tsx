"use client"

import { useState } from "react"
import { ImageCard } from "./ImageCard"

const projects = [
    {
        id: 1,
        title: "AURA IDENTITY",
        category: "BRANDING",
        year: "2024",
        thumbnail: "/projects/01.png",
    },
    {
        id: 2,
        title: "NEON REBRAND",
        category: "DESIGN",
        year: "2024",
        thumbnail: "/projects/02.png",
    },
    {
        id: 3,
        title: "ECO PACKAGING",
        category: "CREATIVE",
        year: "2024",
        thumbnail: "/projects/03.png",
    },
    {
        id: 4,
        title: "MUSEUM TYPE",
        category: "DEVELOPMENT",
        year: "2024",
        thumbnail: "/projects/04.png",
    },
]

export function WorksGallery() {
    const [hoveredId, setHoveredId] = useState<number | null>(null)

    return (
        <div className="w-full px-4 md:px-6">
            {/* Mobile: 2-column grid */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="relative rounded-[1.5rem] overflow-hidden h-[200px] sm:h-[260px]"
                    >
                        <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover brightness-75"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                            <p className="text-white font-mono text-[10px] tracking-[0.2em] uppercase">{project.title}</p>
                            <p className="text-white/60 font-mono text-[9px] tracking-wider uppercase mt-0.5">{project.category}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: horizontal flex with hover expand */}
            <div className="hidden md:flex gap-4 items-stretch">
                {projects.map((project) => (
                    <ImageCard
                        key={project.id}
                        project={project}
                        isHovered={hoveredId === project.id}
                        onHoverChange={(hovered) => setHoveredId(hovered ? project.id : null)}
                    />
                ))}
            </div>
        </div>
    )
}
