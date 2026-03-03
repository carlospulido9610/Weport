"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface Project {
    id: number
    title: string
    category: string
    year: string
    thumbnail: string
}

interface ImageCardProps {
    project: Project
    isHovered: boolean
    onHoverChange: (hovered: boolean) => void
}

export function ImageCard({ project, isHovered, onHoverChange }: ImageCardProps) {
    return (
        <div
            className={cn(
                "group relative rounded-[2.5rem] overflow-hidden",
                "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                "h-[600px] min-w-[180px]",
                isHovered ? "flex-[2] shadow-2xl shadow-white/10" : "flex-[0.8] opacity-90",
            )}
            onMouseEnter={() => onHoverChange(true)}
            onMouseLeave={() => onHoverChange(false)}
        >
            {/* Image */}
            <div className="absolute inset-0">
                <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className={cn(
                        "object-cover transition-all duration-700",
                        !isHovered && "grayscale brightness-75",
                    )}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            {/* Info overlay */}
            <div
                className={cn(
                    "absolute bottom-0 left-0 right-0 p-8",
                    "transition-all duration-700",
                    isHovered ? "opacity-100" : "opacity-0 pointer-events-none",
                )}
            >
                <div
                    className={cn(
                        "relative backdrop-blur-xl bg-black/20 rounded-2xl p-6 border border-white/10",
                        "shadow-2xl",
                        "transition-all duration-700 ease-out",
                        isHovered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                    )}
                >
                    <div className="space-y-1 text-left">
                        <h3 className="text-white font-mono text-sm tracking-[0.3em] uppercase font-medium leading-relaxed">
                            {project.title}
                        </h3>
                        <p className="text-white/80 font-mono text-xs tracking-[0.25em] uppercase leading-relaxed">
                            {project.category}
                        </p>
                        <div className="pt-3 mt-3 border-t border-white/10">
                            <p className="text-white/60 font-mono text-xs tracking-widest">{project.year}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
