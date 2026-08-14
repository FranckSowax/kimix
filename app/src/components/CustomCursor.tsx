import { useEffect, useRef, useState } from 'react';

/**
 * Curseur custom : point 12px + anneau 36px en mix-blend-mode difference.
 * L'anneau grandit à 56px avec un libellé contextuel lu depuis data-cursor.
 * Désactivé sur pointeurs grossiers (tactile) et si prefers-reduced-motion.
 */
export default function CustomCursor() {
  const point = useRef<HTMLDivElement>(null);
  const anneau = useRef<HTMLDivElement>(null);
  const [libelle, setLibelle] = useState<string | null>(null);
  const [actif] = useState(
    () =>
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (!actif) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const cible = (e.target as HTMLElement | null)?.closest?.('[data-cursor]');
      setLibelle(cible ? cible.getAttribute('data-cursor') : null);
    };

    const boucle = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (point.current) point.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (anneau.current) anneau.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(boucle);
    };
    frame = requestAnimationFrame(boucle);
    window.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, [actif]);

  if (!actif) return null;

  return (
    <div className="kimix-cursor pointer-events-none fixed inset-0 z-[200] hidden md:block" aria-hidden="true">
      <div
        ref={point}
        className="fixed left-0 top-0 h-3 w-3 rounded-full bg-white mix-blend-difference"
      />
      <div
        ref={anneau}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border border-white text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white mix-blend-difference transition-[width,height] duration-300"
        style={{ width: libelle ? 56 : 36, height: libelle ? 56 : 36 }}
      >
        {libelle}
      </div>
    </div>
  );
}
