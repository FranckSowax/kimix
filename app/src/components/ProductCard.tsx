import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Produit } from '@/data/products';
import { useCart } from '@/context/cart-context';
import { cn, formatNote, formatPrix } from '@/lib/utils';

const CLASSES_BADGE: Record<string, string> = {
  Nouveau: 'bg-kimix-pink',
  'Best seller': 'bg-kimix-cyan',
  'Combo −15 %': 'bg-kimix-grey',
};

/** Fond studio pastel alterné derrière l'image produit. */
const FONDS = ['bg-kimix-pink/40', 'bg-kimix-cyan/40', 'bg-[#F7F7F7]'];

interface ProductCardProps {
  produit: Produit;
  index?: number;
  aere?: boolean;
}

export default function ProductCard({ produit, index = 0, aere = false }: ProductCardProps) {
  const { ajouter } = useCart();
  const [survol, setSurvol] = useState(false);
  const [couleurChoisie, setCouleurChoisie] = useState(produit.couleurs[0].nom);
  const [ajoute, setAjoute] = useState(false);

  const quickAdd = () => {
    ajouter(produit, couleurChoisie);
    setAjoute(true);
    window.setTimeout(() => setAjoute(false), 1200);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: Math.min(index, 7) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group flex flex-col"
      onMouseEnter={() => setSurvol(true)}
      onMouseLeave={() => setSurvol(false)}
    >
      <Link
        to={`/produit/${produit.slug}?couleur=${encodeURIComponent(couleurChoisie)}`}
        data-cursor="Voir"
        className="relative block overflow-hidden rounded-2xl border border-kimix-line transition-shadow duration-300 hover:shadow-card-hover"
      >
        <div className={cn('relative aspect-[4/5] w-full', FONDS[index % FONDS.length])}>
          <img
            src={produit.images[0]}
            alt={produit.nom}
            loading="lazy"
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-all duration-300',
              survol ? 'scale-[1.04] opacity-0' : 'opacity-100',
            )}
          />
          <img
            src={produit.images[1]}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-all duration-300',
              survol ? 'scale-[1.04] opacity-100' : 'opacity-0',
            )}
          />

          {produit.badges.length > 0 && (
            <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
              {produit.badges.map((b) => (
                <span
                  key={b}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-kimix-ink',
                    CLASSES_BADGE[b],
                  )}
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Quick add : glisse au survol sur desktop, toujours visible sur mobile */}
      <div className="relative -mt-12 px-3 md:-mt-14">
        <button
          type="button"
          onClick={quickAdd}
          data-cursor="+ Panier"
          className={cn(
            'w-full rounded-full py-2.5 text-sm font-semibold shadow-card-hover transition-all duration-300',
            'translate-y-0 opacity-100 md:translate-y-4 md:opacity-0',
            'md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100',
            ajoute ? 'bg-kimix-cyan text-kimix-ink' : 'bg-white text-kimix-ink hover:bg-kimix-ink hover:text-white',
          )}
        >
          {ajoute ? '✓ Ajouté' : '+ Ajout rapide'}
        </button>
      </div>

      <div className={cn('mt-4 flex flex-col gap-1.5', aere && 'mt-5')}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[0.95rem] font-semibold leading-snug text-kimix-ink">
            <Link to={`/produit/${produit.slug}`} className="hover:underline">
              {produit.nom}
            </Link>
          </h3>
          <div className="flex shrink-0 items-baseline gap-1.5">
            {produit.prixBarre && (
              <span className="text-sm text-kimix-soft line-through">{formatPrix(produit.prixBarre)}</span>
            )}
            <span className="font-bold text-kimix-ink">{formatPrix(produit.prix)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-kimix-soft">
          <Star className="h-3.5 w-3.5 fill-kimix-ink text-kimix-ink" aria-hidden="true" />
          <span className="font-medium text-kimix-ink">{formatNote(produit.note)}</span>
          <span>({produit.nbAvis} avis)</span>
        </div>

        <div className="mt-1 flex items-center gap-1.5">
          {produit.couleurs.map((couleur) => {
            const active = couleur.nom === couleurChoisie;
            return (
              <button
                key={couleur.nom}
                type="button"
                aria-label={`Couleur ${couleur.nom}`}
                aria-pressed={active}
                onClick={() => setCouleurChoisie(couleur.nom)}
                className={cn(
                  'h-4 w-4 rounded-full border transition-transform hover:scale-110',
                  active ? 'border-kimix-ink ring-1 ring-kimix-ink' : 'border-kimix-line',
                )}
                style={{ background: couleur.hex }}
              />
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}
