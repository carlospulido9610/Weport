'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';

/**
 * SmoothScroll — Proveedor global de Lenis
 * Envuelve toda la aplicación para proporcionar ese scroll inercial premium.
 * Configura lerp bajo (0.06) para un movimiento extremadamente sedoso.
 */
interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Inicializamos Lenis con opciones de scroll suave
    const lenis = new Lenis({
      lerp: 0.06,           // Interpolación baja = movimiento suave y lento
      smoothWheel: true,     // Suavizar rueda del mouse
      syncTouch: true,       // Sincronizar touch en móviles
    });

    lenisRef.current = lenis;

    // Loop de animación con requestAnimationFrame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup al desmontar
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
