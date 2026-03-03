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
        <div className="w-full px-6">
            <div className="flex gap-4 items-stretch">
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
