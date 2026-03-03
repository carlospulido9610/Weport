'use client';

import { useState, useRef } from 'react';

export default function SoundToggle() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggleSound = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log('Audio play failed:', e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <button
            onClick={toggleSound}
            className="text-black font-sans text-sm md:text-base font-medium tracking-normal mix-blend-multiply flex items-center gap-1 cursor-pointer outline-none transition-colors hover:text-[#fa5a00]"
        >
            Sound: {isPlaying ? 'On' : 'Off'}
            <audio ref={audioRef} loop>
                <source src="/audio/background.mp3" type="audio/mpeg" />
            </audio>
        </button>
    );
}
