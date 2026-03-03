'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

/* ========================================
   GRID — 12-column system (Darkroom style)
     Uses CSS variable --grid-gap for consistent spacing.
   ======================================== */

interface GridProps extends HTMLAttributes<HTMLElement> {
    /** Render as a different element (default: div) */
    as?: 'div' | 'section' | 'main' | 'article' | 'nav' | 'aside' | 'header' | 'footer';
    children: ReactNode;
}

/**
 * 12-column grid container.
 * Always uses var(--grid-gap) for gap and var(--container-padding) for side padding.
 */
const Grid = forwardRef<HTMLElement, GridProps>(
    ({ as: Tag = 'div', className = '', children, ...props }, ref) => {
        return (
            <Tag
                ref={ref as React.Ref<HTMLDivElement>}
                className={`grid grid-cols-12 gap-[var(--grid-gap)] px-4 md:px-[var(--container-padding)] ${className}`}

                {...props}
            >
                {children}
            </Tag>
        );
    }
);

Grid.displayName = 'Grid';

/* ========================================
   COL — Grid column span
   ======================================== */

interface ColProps extends HTMLAttributes<HTMLDivElement> {
    /** Number of columns to span (1-12) */
    span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    /** Number of columns to span on md screens and up */
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    /** Starting column (1-13) */
    start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
    children?: ReactNode;
}

// Tailwind column span classes (static for v4 JIT)
const spanClasses: Record<number, string> = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
};

const startClasses: Record<number, string> = {
    1: 'col-start-1',
    2: 'col-start-2',
    3: 'col-start-3',
    4: 'col-start-4',
    5: 'col-start-5',
    6: 'col-start-6',
    7: 'col-start-7',
    8: 'col-start-8',
    9: 'col-start-9',
    10: 'col-start-10',
    11: 'col-start-11',
    12: 'col-start-12',
};

const mdSpanClasses: Record<number, string> = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
    5: 'md:col-span-5',
    6: 'md:col-span-6',
    7: 'md:col-span-7',
    8: 'md:col-span-8',
    9: 'md:col-span-9',
    10: 'md:col-span-10',
    11: 'md:col-span-11',
    12: 'md:col-span-12',
};

const mdStartClasses: Record<number, string> = {
    1: 'md:col-start-1',
    2: 'md:col-start-2',
    3: 'md:col-start-3',
    4: 'md:col-start-4',
    5: 'md:col-start-5',
    6: 'md:col-start-6',
    7: 'md:col-start-7',
    8: 'md:col-start-8',
    9: 'md:col-start-9',
    10: 'md:col-start-10',
    11: 'md:col-start-11',
    12: 'md:col-start-12',
    13: 'md:col-start-13',
};



const Col = forwardRef<HTMLDivElement, ColProps>(
    ({ span = 12, md, start, className = '', children, ...props }, ref) => {
        const spanClass = spanClasses[span] || 'col-span-12';
        const mdClass = md ? mdSpanClasses[md] : '';
        const startClass = start ? startClasses[start] : '';
        const mdStartClass = start && md ? mdStartClasses[start] : '';


        return (
            <div
                ref={ref}
                className={`${spanClass} ${mdClass} ${startClass} ${mdStartClass} ${className}`}

                {...props}
            >
                {children}
            </div>
        );
    }
);

Col.displayName = 'Col';

export { Grid, Col };
export default Grid;
