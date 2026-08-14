import { cn } from '@/lib/utils';

interface MarqueeProps {
  items: string[];
  separateur?: string;
  className?: string;
  itemClassName?: string;
  rapide?: boolean;
}

/** Bandeau défilant infini (contenu dupliqué ×2 pour une boucle sans couture). */
export default function Marquee({
  items,
  separateur = '✦',
  className,
  itemClassName,
  rapide = false,
}: MarqueeProps) {
  const suite = [...items, ...items];
  return (
    <div className={cn('pause-on-hover overflow-hidden', className)}>
      <div
        className={cn(
          'marquee-track flex w-max items-center gap-8 whitespace-nowrap',
          rapide ? 'animate-marquee-fast' : 'animate-marquee',
        )}
      >
        {suite.map((texte, i) => (
          <span key={`${texte}-${i}`} className={cn('flex items-center gap-8', itemClassName)}>
            {texte}
            <span aria-hidden="true" className="opacity-60">
              {separateur}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
