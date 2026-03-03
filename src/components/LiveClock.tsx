'use client';

import { useState, useEffect } from 'react';

export default function LiveClock() {
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        const updateTime = () => {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/Bogota',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            });
            setTime(`Bogota • ${formatter.format(new Date())}`);
        };

        updateTime(); // Initial set
        const interval = setInterval(updateTime, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    // Use a completely transparent placeholder of the same length to prevent layout shift on hydration
    if (!time) {
        return <span className="opacity-0 select-none">Bogota • 00:00:00 AM</span>;
    }

    return <span>{time}</span>;
}
