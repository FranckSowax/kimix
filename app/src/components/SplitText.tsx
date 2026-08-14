import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SplitTextProps {
  texte: string;
  mode?: 'char' | 'mot';
  className?: string;
  delai?: number;
  /** Anime à l'entrée dans le viewport plutôt qu'au montage. */
  auScroll?: boolean;
}

/**
 * Révélation d'un titre caractère par caractère (headlines courtes)
 * ou mot par mot (sous-titres). Fallback statique si reduced-motion.
 */
export default function SplitText({
  texte,
  mode = 'mot',
  className,
  delai = 0,
  auScroll = false,
}: SplitTextProps) {
  const reduit =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduit) return <span className={className}>{texte}</span>;

  const morceaux = mode === 'char' ? Array.from(texte) : texte.split(' ');
  const pas = mode === 'char' ? 0.025 : 0.04;

  const anim = { opacity: 1, y: 0, rotate: 0 };
  const props = auScroll
    ? { whileInView: anim, viewport: { once: true, margin: '-80px' } }
    : { animate: anim };

  return (
    <span className={cn('inline-block', className)}>
      {morceaux.map((m, i) => (
        <motion.span
          key={`${m}-${i}`}
          initial={{ opacity: 0, y: mode === 'char' ? 60 : 30, rotate: mode === 'char' ? 4 : 0 }}
          {...props}
          transition={{
            duration: mode === 'char' ? 0.8 : 0.6,
            delay: delai + i * pas,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block whitespace-pre"
        >
          {m}
          {mode === 'mot' && i < morceaux.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </span>
  );
}

/** Surlignage pastel signature qui « peint » son fond. */
export function Highlight({
  children,
  couleur = 'pink',
  delai = 0.6,
}: {
  children: ReactNode;
  couleur?: 'pink' | 'cyan' | 'grey';
  delai?: number;
}) {
  return (
    <span className="relative inline-block">
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: delai, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'absolute inset-0 origin-left rounded-[0.15em]',
          couleur === 'pink' && 'bg-kimix-pink',
          couleur === 'cyan' && 'bg-kimix-cyan',
          couleur === 'grey' && 'bg-kimix-grey',
        )}
      />
      <span className="relative px-[0.2em] py-[0.05em]">{children}</span>
    </span>
  );
}
