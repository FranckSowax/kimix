import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import {
  ChevronDown,
  Heart,
  Minus,
  Plus,
  Puzzle,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Highlight } from '@/components/SplitText';
import { COULEURS, getProduit } from '@/data/products';
import type { CouleurNom } from '@/data/products';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/context/toast-context';
import { cn, formatNote, formatPrix } from '@/lib/utils';

/** Fond studio de la galerie, assorti à la couleur sélectionnée. */
const FONDS_GALERIE: Record<string, string> = {
  Rose: '#FFD1F1',
  Cyan: '#C9FCFF',
  Gris: '#EFEFEF',
  Blanc: '#F7F5F2',
  'Mix pastel': '#F2F2F2',
};

const AVIS_DETAILLES = [
  {
    titre: 'Parfait pour les mangas de mon fils',
    texte:
      "Trois cubes empilés dans sa chambre, il a tout rangé le soir même. La qualité du plastique est bien meilleure que ce à quoi je m'attendais.",
    etoiles: 5,
    auteur: 'Sophie R.',
    date: '12 mars 2026',
    utile: 24,
  },
  {
    titre: 'Clipser deux cubes prend 10 secondes',
    texte:
      "Aucun outil, aucune notice illisible. On clipse, ça tient. J'ai monté la tour complète pendant que le café coulait.",
    etoiles: 5,
    auteur: 'Karim B.',
    date: '2 mars 2026',
    utile: 18,
  },
  {
    titre: 'Un peu plus petit que prévu mais très solide',
    texte:
      "Je m'attendais à plus grand malgré les dimensions annoncées — pensez à mesurer. Cela dit, la solidité est au rendez-vous, il supporte sans broncher mes classeurs.",
    etoiles: 4,
    auteur: 'Élodie M.',
    date: '24 février 2026',
    utile: 11,
  },
];

const REPARTITION = [
  { etoiles: 5, part: 78 },
  { etoiles: 4, part: 15 },
  { etoiles: 3, part: 4 },
  { etoiles: 2, part: 2 },
  { etoiles: 1, part: 1 },
];

function Accordeon({
  titre,
  children,
  ouvertParDefaut = false,
}: {
  titre: string;
  children: React.ReactNode;
  ouvertParDefaut?: boolean;
}) {
  const [ouvert, setOuvert] = useState(ouvertParDefaut);
  return (
    <div className="border-b border-kimix-line">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-expanded={ouvert}
        className="flex w-full items-center justify-between py-5 text-left font-semibold"
      >
        {titre}
        <ChevronDown className={cn('h-5 w-5 transition-transform', ouvert && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {ouvert && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-kimix-soft">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Route `/produit/:slug` : résout le produit puis monte la fiche.
 * La fiche est remontée (`key`) quand le slug ou la couleur d'entrée changent,
 * ce qui réinitialise son état sans effet de synchronisation.
 */
export default function Produit() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const produit = slug ? getProduit(slug) : undefined;
  const couleurUrl = params.get('couleur');

  useEffect(() => {
    if (slug && !produit) {
      toast('Produit introuvable');
      navigate('/catalogue', { replace: true });
    }
  }, [slug, produit, navigate, toast]);

  if (!produit) return null;

  const demandee = produit.couleurs.some((c) => c.nom === couleurUrl)
    ? (couleurUrl as CouleurNom)
    : produit.couleurs[0].nom;

  return <FicheProduit key={`${produit.slug}-${demandee}`} produit={produit} couleurInitiale={demandee} />;
}

function FicheProduit({
  produit,
  couleurInitiale,
}: {
  produit: NonNullable<ReturnType<typeof getProduit>>;
  couleurInitiale: CouleurNom;
}) {
  const { ajouter, ouvrirDrawer } = useCart();
  const { toast } = useToast();

  const [couleur, setCouleur] = useState<CouleurNom>(couleurInitiale);
  const [imageActive, setImageActive] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [ajoute, setAjoute] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const buyBox = useRef<HTMLDivElement>(null);
  const buyBoxVisible = useInView(buyBox, { margin: '-100px' });
  const resumeAvis = useRef<HTMLDivElement>(null);
  const avisVisible = useInView(resumeAvis, { once: true, margin: '-40%' });

  const compatibles = useMemo(
    () => produit.compatibleAvec.map(getProduit).filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [produit],
  );

  const vignettes = [
    { src: produit.images[0], label: 'Vue studio' },
    { src: produit.images[1], label: 'En situation' },
    { src: '/plan-cote-cube.svg', label: 'Plan coté' },
  ];

  const total = produit.prix * quantite;

  const ajouterAuPanier = () => {
    ajouter(produit, couleur, quantite);
    setAjoute(true);
    window.setTimeout(() => setAjoute(false), 1200);
    window.setTimeout(ouvrirDrawer, 400);
  };

  return (
    <>
      {/* ------------------------------------------- Galerie + buy box */}
      <section className="container-kimix pb-16 pt-28">
        <nav className="eyebrow mb-6" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:underline">
            Accueil
          </Link>{' '}
          /{' '}
          <Link to="/catalogue" className="hover:underline">
            Catalogue
          </Link>{' '}
          / {produit.type} / {produit.nom}
        </nav>

        <div className="grid gap-10 lg:grid-cols-[55%_45%]">
          {/* Galerie */}
          <div>
            <motion.div
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              animate={{ clipPath: 'inset(0% 0 0 0)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl transition-colors duration-500"
              style={{ backgroundColor: FONDS_GALERIE[couleur] ?? '#F2F2F2' }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={imageActive}
                  src={vignettes[imageActive].src}
                  alt={produit.nom}
                  fetchPriority="high"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 h-full w-full object-contain p-6"
                />
              </AnimatePresence>
              {produit.badges[0] && (
                <span className="absolute left-4 top-4 rounded-full bg-kimix-cyan px-3 py-1 text-xs font-bold">
                  {produit.badges[0]}
                </span>
              )}
            </motion.div>

            <div className="mt-4 flex gap-3">
              {vignettes.map((v, i) => (
                <motion.button
                  key={v.label}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  onClick={() => setImageActive(i)}
                  aria-label={v.label}
                  className={cn(
                    'h-24 w-24 overflow-hidden rounded-xl border-2 bg-[#F7F7F7]',
                    imageActive === i ? 'border-kimix-ink' : 'border-transparent',
                  )}
                >
                  <img src={v.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Buy box */}
          <div ref={buyBox} className="lg:sticky lg:top-[calc(2.25rem+100px)] lg:self-start">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-kimix-ink text-kimix-ink" />
                ))}
              </div>
              <span className="font-medium">{formatNote(produit.note)}</span>
              <a href="#avis" className="text-kimix-soft underline">
                {produit.nbAvis} avis
              </a>
            </div>

            <h1 className="mt-3 font-display text-h1 font-semibold italic leading-tight">
              {produit.nom.split('—')[0]}
              {produit.nom.includes('—') && (
                <>
                  {'— '}
                  <Highlight couleur="pink" delai={0.3}>
                    {produit.nom.split('—')[1].trim()}
                  </Highlight>
                </>
              )}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-bold">{formatPrix(produit.prix)}</span>
              {produit.prixBarre && (
                <span className="text-lg text-kimix-soft line-through">{formatPrix(produit.prixBarre)}</span>
              )}
            </div>
            <p className="mt-1 text-sm text-kimix-soft">TVA incluse · Livraison offerte dès 59 €</p>

            <div className="mt-6">
              <p className="text-sm font-medium">Couleur : {couleur}</p>
              <div className="mt-2 flex gap-2">
                {produit.couleurs.map((c) => (
                  <motion.button
                    key={c.nom}
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCouleur(c.nom)}
                    aria-label={c.nom}
                    aria-pressed={c.nom === couleur}
                    className={cn(
                      'h-8 w-8 rounded-full border transition-all',
                      c.nom === couleur ? 'border-kimix-ink ring-2 ring-kimix-ink ring-offset-2' : 'border-kimix-line',
                    )}
                    style={{ background: COULEURS[c.nom] }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#F5F5F5] px-3 py-1.5 text-sm">
                {produit.dimensions.largeur} cm de large
                {produit.dimensions.note ? ` — ${produit.dimensions.note}` : ''}
              </span>
              <span className="rounded-full bg-[#F5F5F5] px-3 py-1.5 text-sm">
                {produit.dimensions.profondeur} cm de profond
              </span>
              <span className="rounded-full bg-[#F5F5F5] px-3 py-1.5 text-sm">
                {produit.dimensions.hauteur} cm de haut
              </span>
              <button type="button" onClick={() => setImageActive(2)} className="text-sm underline">
                Voir le plan coté
              </button>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-full border border-kimix-line px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center font-medium">{quantite}</span>
                <button type="button" onClick={() => setQuantite((q) => q + 1)} aria-label="Augmenter la quantité">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={ajouterAuPanier}
                className={cn(
                  'flex-1 rounded-full py-3.5 font-semibold transition-colors',
                  ajoute ? 'bg-kimix-cyan text-kimix-ink' : 'bg-kimix-ink text-white',
                )}
              >
                {ajoute ? '✓ Ajouté !' : `Ajouter au panier — ${formatPrix(total)}`}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setWishlist((v) => !v)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-kimix-ink py-3 font-semibold"
            >
              <Heart className={cn('h-4 w-4', wishlist && 'fill-kimix-pink text-kimix-pink')} />
              Ajouter à ma wishlist
            </button>

            <ul className="mt-6 flex flex-col gap-2 text-sm text-kimix-soft">
              <li className="flex items-center gap-2">
                <Truck className="h-4 w-4" /> Expédition sous 48 h
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" /> Retours 30 jours
              </li>
              <li className="flex items-center gap-2">
                <Puzzle className="h-4 w-4" /> Compatible avec tous les modules KIMIX
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* --------------------------------------- Sticky add-to-cart bar */}
      <AnimatePresence>
        {!buyBoxVisible && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-kimix-line bg-white/95 backdrop-blur-md"
          >
            <div className="container-kimix flex h-16 items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={produit.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold">{produit.nom}</p>
                  <p className="text-sm text-kimix-soft">{formatPrix(produit.prix)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={ajouterAuPanier}
                className="rounded-full bg-kimix-ink px-6 py-2.5 text-sm font-semibold text-white"
              >
                Ajouter — {formatPrix(total)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------- Accordéons */}
      <section className="container-kimix max-w-3xl py-16">
        <Accordeon titre="Description" ouvertParDefaut>
          <p>{produit.description}</p>
          <ul className="mt-4 list-disc pl-5">
            <li>PP recyclé 60 %</li>
            <li>Clips brevetés sans outil</li>
            <li>Charge max 15 kg</li>
            <li>Nettoyage d'un coup d'éponge</li>
          </ul>
        </Accordeon>
        <Accordeon titre="Dimensions &amp; contenu">
          <img src="/plan-cote-cube.svg" alt="Plan coté du module" className="w-full max-w-sm" />
          <p className="mt-4">Dans la boîte : {produit.contenu.join(', ')}.</p>
        </Accordeon>
        <Accordeon titre="Livraison &amp; retours">
          <p>
            Expédition sous 48 h, livraison en 2–4 jours ouvrés. Livraison offerte dès 59 € d'achat.
            Retours gratuits pendant 30 jours, sans justification.
          </p>
        </Accordeon>
      </section>

      {/* -------------------------------------------- Combine-le avec */}
      <section className="container-kimix py-10">
        <div className="rounded-3xl bg-kimix-cyan/35 px-5 py-20 md:px-10">
          <h2 className="mb-10 font-display text-h2 font-semibold italic">
            <Highlight couleur="pink">Clipse-le</Highlight> avec…
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {compatibles.map((p, i) => (
              <ProductCard key={p.slug} produit={p} index={i} />
            ))}
          </div>
          {compatibles[0] && (
            <p className="mt-8 text-sm font-medium">
              {produit.nom.split('—')[0].trim()} + {compatibles[0].nom.split('—')[0].trim()} ={' '}
              {formatPrix(produit.prix + compatibles[0].prix)} · −10 % en combo
            </p>
          )}
        </div>
      </section>

      {/* -------------------------------------------------- Avis clients */}
      <section id="avis" className="container-kimix py-20">
        <div className="grid gap-10 lg:grid-cols-[30%_70%]">
          <div ref={resumeAvis}>
            <p className="font-display text-6xl font-semibold italic">{formatNote(produit.note)}</p>
            <div className="mt-2 flex gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-kimix-ink text-kimix-ink" />
              ))}
            </div>
            <p className="mt-2 text-sm text-kimix-soft">{produit.nbAvis} avis vérifiés</p>

            <div className="mt-6 flex flex-col gap-2">
              {REPARTITION.map((r, i) => (
                <div key={r.etoiles} className="flex items-center gap-3 text-sm">
                  <span className="w-8 shrink-0">{r.etoiles} ★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-kimix-line">
                    <motion.div
                      className="h-full origin-left bg-kimix-ink"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: avisVisible ? r.part / 100 : 0 }}
                      transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <span className="w-9 shrink-0 text-right text-kimix-soft">{r.part} %</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {AVIS_DETAILLES.map((avis, i) => (
              <motion.article
                key={avis.titre}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="rounded-2xl border border-kimix-line bg-white p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex gap-0.5" aria-label={`${avis.etoiles} sur 5`}>
                    {Array.from({ length: avis.etoiles }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-kimix-ink text-kimix-ink" />
                    ))}
                  </div>
                  <span className="rounded-full bg-kimix-cyan px-2.5 py-0.5 text-xs font-bold">
                    Achat vérifié
                  </span>
                  <span className="text-xs text-kimix-soft">{avis.date}</span>
                </div>
                <h3 className="mt-3 font-bold">{avis.titre}</h3>
                <p className="mt-2 text-kimix-soft">{avis.texte}</p>
                <footer className="mt-4 flex items-center justify-between text-sm text-kimix-soft">
                  <span>{avis.auteur}</span>
                  <button type="button" className="hover:text-kimix-ink">
                    👍 Utile ({avis.utile})
                  </button>
                </footer>
              </motion.article>
            ))}
            <button
              type="button"
              onClick={() => toast('Démo — avis supplémentaires non connectés')}
              className="self-start rounded-full border border-kimix-ink px-6 py-3 font-semibold"
            >
              Charger plus d'avis
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- Réassurance */}
      <section className="border-t border-kimix-line py-14">
        <div className="container-kimix grid gap-8 md:grid-cols-3">
          {[
            { Icone: Truck, titre: 'Livraison offerte dès 59 €', texte: '2–4 jours ouvrés' },
            { Icone: RotateCcw, titre: 'Retours 30 jours', texte: 'Gratuits, sans justification' },
            { Icone: ShieldCheck, titre: 'Paiement 100 % sécurisé', texte: 'CB, Apple Pay, PayPal' },
          ].map((item) => (
            <div key={item.titre} className="flex items-start gap-3">
              <item.Icone className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-bold">{item.titre}</p>
                <p className="text-sm text-kimix-soft">{item.texte}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
