import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface ScrubSequenceProps {
  /** Nombre total de frames de la séquence. */
  nbFrames: number;
  /** Préfixe des fichiers, ex. `/seq/f-` → `/seq/f-001.jpg`. */
  prefixe: string;
  suffixe?: string;
  padding?: number;
  alt: string;
  /** Longueur de la zone de scroll pinnée, en % de hauteur de viewport. */
  longueurPin?: number;
  /** Contenu affiché au-dessus du canvas, à l'intérieur de la zone pinnée. */
  entete?: ReactNode;
  /** Surcouche pilotée par la progression (entier 0→100). */
  superposition?: (pourcent: number) => ReactNode;
  /** Mode hero : la séquence occupe tout le viewport, le contenu se superpose. */
  pleinEcran?: boolean;
  className?: string;
}

/**
 * Séquence d'images pilotée au scroll (technique « page produit Apple ») :
 * les frames sont préchargées puis dessinées sur un `<canvas>`, l'index étant
 * mappé sur la progression d'un ScrollTrigger pinné. Le dessin est impératif —
 * React ne re-rend que la surcouche, et seulement quand le pourcentage change.
 */
export default function ScrubSequence({
  nbFrames,
  prefixe,
  suffixe = '.jpg',
  padding = 3,
  alt,
  longueurPin = 200,
  entete,
  superposition,
  pleinEcran = false,
  className,
}: ScrubSequenceProps) {
  const section = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const indexCourant = useRef(0);
  const dernierPct = useRef(0);

  const [pourcent, setPourcent] = useState(0);
  const [chargees, setChargees] = useState(0);
  const [statique] = useState(reducedMotion);

  const urlFrame = useCallback(
    (i: number) => `${prefixe}${String(i + 1).padStart(padding, '0')}${suffixe}`,
    [prefixe, padding, suffixe],
  );

  /** Dessine la frame `index` en mode « cover », en tenant compte du DPR. */
  const dessiner = useCallback((index: number) => {
    const c = canvas.current;
    const img = images.current[index];
    if (!c || !img || !img.complete || !img.naturalWidth) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = c.clientWidth;
    const h = c.clientHeight;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const echelle = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * echelle;
    const dh = img.naturalHeight * echelle;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    indexCourant.current = index;
  }, []);

  const monte = useRef(true);
  const demarre = useRef(false);

  /** Précharge la séquence entière. Idempotent : appelable depuis plusieurs déclencheurs. */
  const precharger = useCallback(() => {
    if (demarre.current) return;
    demarre.current = true;
    let n = 0;
    const fini = () => {
      if (!monte.current) return;
      n += 1;
      setChargees(n);
    };
    images.current = Array.from({ length: nbFrames }, (_, i) => {
      const img = new Image();
      img.onload = () => {
        fini();
        if (i === 0) dessiner(0);
      };
      img.onerror = fini;
      img.src = urlFrame(i);
      return img;
    });
  }, [nbFrames, urlFrame, dessiner]);

  // Préchargement à l'approche de la section, avec filet de sécurité : un onglet
  // en arrière-plan suspend les IntersectionObserver, et sans ce fallback le
  // canvas resterait vide indéfiniment.
  useEffect(() => {
    monte.current = true;
    const el = section.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entrees) => {
        if (entrees.some((e) => e.isIntersecting)) {
          io.disconnect();
          precharger();
        }
      },
      { rootMargin: '150% 0px' },
    );
    io.observe(el);
    const secours = window.setTimeout(precharger, 3000);

    return () => {
      monte.current = false;
      io.disconnect();
      window.clearTimeout(secours);
    };
  }, [precharger]);

  // Pin + scrub
  useEffect(() => {
    if (statique) return;
    const el = section.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: `+=${longueurPin}%`,
        pin: '.scrub-pin',
        scrub: 1,
        onUpdate: (self) => {
          precharger();
          const p = self.progress;
          dessiner(Math.min(nbFrames - 1, Math.round(p * (nbFrames - 1))));
          const pct = Math.round(p * 100);
          if (pct !== dernierPct.current) {
            dernierPct.current = pct;
            setPourcent(pct);
          }
        },
      });
    }, el);
    return () => ctx.revert();
  }, [statique, nbFrames, longueurPin, dessiner, precharger]);

  // Redessine au redimensionnement (le canvas est recadré en cover)
  useEffect(() => {
    const onResize = () => dessiner(indexCourant.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [dessiner]);

  const pretAffichage = chargees > 0;

  const barreChargement = chargees < nbFrames && (
    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black/10">
      <div
        className="h-full bg-kimix-ink/40 transition-[width] duration-200"
        style={{ width: `${(chargees / nbFrames) * 100}%` }}
      />
    </div>
  );

  // Sans animation : dernière frame en image fixe, aucun pin.
  if (statique) {
    return pleinEcran ? (
      <section className={cn('relative min-h-[80svh] overflow-hidden', className)}>
        <img src={urlFrame(nbFrames - 1)} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex min-h-[80svh] flex-col items-center justify-center py-20">
          {entete}
        </div>
        {superposition?.(100)}
      </section>
    ) : (
      <section className={cn('container-kimix py-24', className)}>
        {entete}
        <img
          src={urlFrame(nbFrames - 1)}
          alt={alt}
          className="mx-auto mt-10 w-full max-w-6xl rounded-3xl object-cover"
        />
        {superposition?.(100)}
      </section>
    );
  }

  // Mode hero : canvas plein cadre, contenu superposé sur un voile sombre.
  if (pleinEcran) {
    return (
      <section ref={section} className={className}>
        <div className="scrub-pin relative h-[100svh] w-full overflow-hidden bg-[#E9E4DD]">
          <canvas
            ref={canvas}
            role="img"
            aria-label={alt}
            className={cn(
              'absolute inset-0 h-full w-full transition-opacity duration-700',
              pretAffichage ? 'opacity-100' : 'opacity-0',
            )}
          />
          {/* Voile de lisibilité : le texte passe en blanc par-dessus la vidéo */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/70"
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center">
            {entete}
          </div>
          {superposition?.(pourcent)}
          {barreChargement}
        </div>
      </section>
    );
  }

  return (
    <section ref={section} className={className}>
      <div className="scrub-pin flex min-h-screen flex-col items-center justify-center py-10">
        <div className="container-kimix w-full">
          {entete}

          <div className="relative mx-auto mt-10 aspect-[16/9] w-full max-w-6xl overflow-hidden rounded-3xl bg-[#F0F0F0]">
            <canvas
              ref={canvas}
              role="img"
              aria-label={alt}
              className={cn(
                'h-full w-full transition-opacity duration-500',
                pretAffichage ? 'opacity-100' : 'opacity-0',
              )}
            />

            {barreChargement}
            {superposition?.(pourcent)}
          </div>
        </div>
      </div>
    </section>
  );
}
