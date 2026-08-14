import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import * as Slider from '@radix-ui/react-slider';
import { LayoutGrid, RotateCcw, Rows3, ShieldCheck, SlidersHorizontal, Truck, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Highlight } from '@/components/SplitText';
import {
  CHIPS,
  COULEURS,
  COULEURS_FILTRE,
  FAMILLES,
  PIECES,
  PRODUITS,
} from '@/data/products';
import type { CouleurNom, Produit } from '@/data/products';
import { cn, formatPrix } from '@/lib/utils';

type Tri = 'reco' | 'prix-asc' | 'prix-desc' | 'nouveau' | 'note';

const TRIS: { valeur: Tri; label: string }[] = [
  { valeur: 'reco', label: 'Nos recommandations' },
  { valeur: 'prix-asc', label: 'Prix croissant' },
  { valeur: 'prix-desc', label: 'Prix décroissant' },
  { valeur: 'nouveau', label: 'Nouveautés' },
  { valeur: 'note', label: 'Meilleures notes' },
];

const PAR_PAGE = 8;

function familleDe(produit: Produit) {
  return FAMILLES.find((f) => f.types.includes(produit.type))?.label ?? null;
}

export default function Catalogue() {
  const [params] = useSearchParams();
  const chipActive = params.get('type') ?? 'tout';
  // Remonter le contenu à chaque changement de chip réinitialise les filtres
  // dérivés de l'URL sans effet de synchronisation.
  return <CatalogueContenu key={chipActive} chipActive={chipActive} />;
}

/** Filtres de départ déduits du raccourci présent dans l'URL. */
function filtresInitiaux(chipActive: string): { familles: string[]; pieces: string[] } {
  const chip = CHIPS.find((c) => c.slug === chipActive);
  if (chip?.slug === 'bureau') return { familles: [], pieces: ['Bureau'] };
  if (chip?.famille) return { familles: [chip.famille], pieces: [] };
  return { familles: [], pieces: [] };
}

function CatalogueContenu({ chipActive }: { chipActive: string }) {
  const [, setParams] = useSearchParams();

  const [familles, setFamilles] = useState<string[]>(() => filtresInitiaux(chipActive).familles);
  const [pieces, setPieces] = useState<string[]>(() => filtresInitiaux(chipActive).pieces);
  const [couleurs, setCouleurs] = useState<CouleurNom[]>([]);
  const [prix, setPrix] = useState<[number, number]>([0, 200]);
  const [promoSeulement, setPromoSeulement] = useState(false);
  const [tri, setTri] = useState<Tri>('reco');
  const [aere, setAere] = useState(false);
  const [sidebarOuverte, setSidebarOuverte] = useState(true);
  const [sheetMobile, setSheetMobile] = useState(false);
  const [visibles, setVisibles] = useState(PAR_PAGE);
  const [chargement, setChargement] = useState(false);

  // Flash de skeletons (400 ms) à chaque changement de filtre ou de tri
  const minuteur = useRef(0);
  useEffect(() => () => window.clearTimeout(minuteur.current), []);

  const flashSkeleton = () => {
    setChargement(true);
    setVisibles(PAR_PAGE);
    window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(() => setChargement(false), 400);
  };

  const majFamilles = (v: string[]) => {
    setFamilles(v);
    flashSkeleton();
  };
  const majPieces = (v: string[]) => {
    setPieces(v);
    flashSkeleton();
  };
  const majCouleurs = (v: CouleurNom[]) => {
    setCouleurs(v);
    flashSkeleton();
  };

  const nbFiltresActifs =
    familles.length +
    pieces.length +
    couleurs.length +
    (promoSeulement ? 1 : 0) +
    (prix[0] !== 0 || prix[1] !== 200 ? 1 : 0);

  const resultats = useMemo(() => {
    const filtres = PRODUITS.filter((p) => {
      if (familles.length && !familles.includes(familleDe(p) ?? '')) return false;
      if (pieces.length && !p.pieces.some((piece) => pieces.includes(piece))) return false;
      if (couleurs.length && !p.couleurs.some((c) => couleurs.includes(c.nom))) return false;
      if (p.prix < prix[0] || p.prix > prix[1]) return false;
      if (promoSeulement && !p.prixBarre) return false;
      return true;
    });

    const trie = [...filtres];
    if (tri === 'prix-asc') trie.sort((a, b) => a.prix - b.prix);
    if (tri === 'prix-desc') trie.sort((a, b) => b.prix - a.prix);
    if (tri === 'nouveau') trie.sort((a, b) => b.nouveaute - a.nouveaute);
    if (tri === 'note') trie.sort((a, b) => b.note - a.note || b.nbAvis - a.nbAvis);
    return trie;
  }, [familles, pieces, couleurs, prix, promoSeulement, tri]);

  const reinitialiser = () => {
    setFamilles([]);
    setPieces([]);
    setCouleurs([]);
    setPrix([0, 200]);
    setPromoSeulement(false);
    flashSkeleton();
    setParams({});
  };

  const bascule = <T,>(liste: T[], valeur: T, set: (v: T[]) => void) =>
    set(liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur]);

  const affiches = resultats.slice(0, visibles);
  const restants = resultats.length - affiches.length;
  const combos = PRODUITS.filter((p) => p.badges.includes('Combo −15 %'));

  return (
    <>
      {/* ---------------------------------------------------- En-tête de page */}
      <section className="bg-kimix-cyan/40 pb-12 pt-28">
        <div className="container-kimix">
          <nav className="eyebrow" aria-label="Fil d'Ariane">
            <Link to="/" className="hover:underline">
              Accueil
            </Link>{' '}
            / Catalogue
          </nav>
          <h1 className="mt-4 font-display text-h1 font-semibold italic">
            Le <Highlight couleur="pink">catalogue</Highlight>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-kimix-soft">
            12 modules et packs. Une infinité de combinaisons. Tout se clipse, tout se recompose.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {CHIPS.map((chip, i) => {
              const active = chip.slug === chipActive;
              return (
                <motion.button
                  key={chip.slug}
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setParams(chip.slug === 'tout' ? {} : { type: chip.slug })}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'border-kimix-ink bg-kimix-ink text-white'
                      : 'border-kimix-line bg-white text-kimix-ink hover:border-kimix-ink',
                  )}
                >
                  {chip.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Barre d'outils */}
      <div className="sticky top-[calc(2.25rem+72px)] z-30 border-b border-kimix-line bg-white/90 backdrop-blur-md">
        <div className="container-kimix flex items-center justify-between gap-4 py-3">
          <button
            type="button"
            onClick={() => {
              if (window.matchMedia('(min-width: 1024px)').matches) setSidebarOuverte((v) => !v);
              else setSheetMobile(true);
            }}
            className="flex items-center gap-2 rounded-full border border-kimix-line px-4 py-2 text-sm font-medium"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
            {nbFiltresActifs > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-kimix-pink px-1.5 text-xs font-bold">
                {nbFiltresActifs}
              </span>
            )}
          </button>

          <p aria-live="polite" className="text-sm font-medium">
            {resultats.length} produit{resultats.length > 1 ? 's' : ''}
          </p>

          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="tri">
              Trier par
            </label>
            <select
              id="tri"
              value={tri}
              onChange={(e) => { setTri(e.target.value as Tri); flashSkeleton(); }}
              className="rounded-full border border-kimix-line bg-white px-3 py-2 text-sm"
            >
              {TRIS.map((t) => (
                <option key={t.valeur} value={t.valeur}>
                  {t.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setAere((v) => !v)}
              aria-label={aere ? 'Affichage dense' : 'Affichage aéré'}
              className="hidden rounded-full border border-kimix-line p-2 lg:block"
            >
              {aere ? <LayoutGrid className="h-4 w-4" /> : <Rows3 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ Sidebar + grille */}
      <div className="container-kimix flex gap-8 py-10">
        <AnimatePresence initial={false}>
          {sidebarOuverte && (
            <motion.aside
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="hidden w-[260px] shrink-0 lg:block"
            >
              <div className="sticky top-[calc(2.25rem+140px)] flex flex-col gap-7">
                <fieldset>
                  <legend className="eyebrow mb-3">Type de module</legend>
                  <div className="flex flex-col gap-2">
                    {FAMILLES.map((f) => {
                      const compte = PRODUITS.filter((p) => f.types.includes(p.type)).length;
                      return (
                        <label key={f.label} className="flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={familles.includes(f.label)}
                            onChange={() => bascule(familles, f.label, majFamilles)}
                            className="h-4 w-4 accent-kimix-ink"
                          />
                          {f.label} <span className="text-kimix-soft">({compte})</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="eyebrow mb-3">Pièce</legend>
                  <div className="flex flex-col gap-2">
                    {PIECES.map((piece) => (
                      <label key={piece} className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={pieces.includes(piece)}
                          onChange={() => bascule(pieces, piece, majPieces)}
                          className="h-4 w-4 accent-kimix-ink"
                        />
                        {piece}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="eyebrow mb-3">Couleur</legend>
                  <div className="flex flex-wrap gap-2">
                    {COULEURS_FILTRE.map((nom) => {
                      const active = couleurs.includes(nom);
                      return (
                        <button
                          key={nom}
                          type="button"
                          aria-label={nom}
                          aria-pressed={active}
                          onClick={() => bascule(couleurs, nom, majCouleurs)}
                          className={cn(
                            'h-6 w-6 rounded-full border transition-transform active:scale-110',
                            active ? 'border-kimix-ink ring-2 ring-kimix-ink' : 'border-kimix-line',
                          )}
                          style={{ background: COULEURS[nom] }}
                        />
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="eyebrow mb-3">Prix</legend>
                  <Slider.Root
                    value={prix}
                    onValueChange={(v) => { setPrix([v[0], v[1]]); flashSkeleton(); }}
                    min={0}
                    max={200}
                    step={5}
                    minStepsBetweenThumbs={1}
                    className="relative flex h-5 w-full touch-none items-center"
                  >
                    <Slider.Track className="relative h-1 w-full grow rounded-full bg-kimix-line">
                      <Slider.Range className="absolute h-full rounded-full bg-kimix-ink" />
                    </Slider.Track>
                    {[0, 1].map((i) => (
                      <Slider.Thumb
                        key={i}
                        aria-label={i === 0 ? 'Prix minimum' : 'Prix maximum'}
                        className="block h-4 w-4 rounded-full border-2 border-kimix-ink bg-white"
                      />
                    ))}
                  </Slider.Root>
                  <p className="mt-2 text-sm text-kimix-soft">
                    {formatPrix(prix[0])} — {formatPrix(prix[1])}
                  </p>
                </fieldset>

                <label className="flex cursor-pointer items-center justify-between text-sm font-medium">
                  Promos uniquement
                  <input
                    type="checkbox"
                    checked={promoSeulement}
                    onChange={(e) => { setPromoSeulement(e.target.checked); flashSkeleton(); }}
                    className="h-4 w-4 accent-kimix-ink"
                  />
                </label>

                {nbFiltresActifs > 0 && (
                  <button type="button" onClick={reinitialiser} className="self-start text-sm underline">
                    Réinitialiser tout
                  </button>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="flex-1">
          {chargement ? (
            <div
              className={cn(
                'grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6',
                aere ? 'lg:grid-cols-3' : 'lg:grid-cols-4',
              )}
            >
              {Array.from({ length: PAR_PAGE }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="skeleton-shimmer aspect-[4/5] w-full rounded-2xl" />
                  <div className="skeleton-shimmer h-4 w-3/4 rounded" />
                  <div className="skeleton-shimmer h-4 w-1/3 rounded" />
                </div>
              ))}
            </div>
          ) : resultats.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-2xl font-semibold italic">⬚ Aucun module ne matche.</p>
              <button
                type="button"
                onClick={reinitialiser}
                className="mt-6 rounded-full bg-kimix-ink px-6 py-3 font-semibold text-white"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <motion.div
                layout
                className={cn(
                  'grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6',
                  aere ? 'lg:grid-cols-3' : 'lg:grid-cols-4',
                )}
              >
                <AnimatePresence mode="popLayout">
                  {affiches.map((p, i) => (
                    <ProductCard key={p.slug} produit={p} index={i} aere={aere} />
                  ))}
                </AnimatePresence>
              </motion.div>

              <div className="mt-12 flex flex-col items-center gap-3">
                <p className="text-sm text-kimix-soft">
                  Vous avez vu {affiches.length} produit{affiches.length > 1 ? 's' : ''} sur{' '}
                  {resultats.length}
                </p>
                <div className="h-1 w-48 overflow-hidden rounded-full bg-kimix-line">
                  <div
                    className="h-full bg-kimix-ink transition-all duration-500"
                    style={{ width: `${(affiches.length / resultats.length) * 100}%` }}
                  />
                </div>
                {restants > 0 && (
                  <button
                    type="button"
                    onClick={() => setVisibles((v) => v + PAR_PAGE)}
                    className="mt-2 rounded-full border border-kimix-ink px-6 py-3 font-semibold transition-colors hover:bg-kimix-ink hover:text-white"
                  >
                    Charger plus ({restants} restant{restants > 1 ? 's' : ''})
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------ Réassurance */}
      <section className="border-t border-kimix-line py-14">
        <div className="container-kimix grid gap-8 md:grid-cols-3">
          {[
            { Icone: Truck, titre: 'Livraison offerte dès 59 €', texte: '2–4 jours ouvrés' },
            { Icone: RotateCcw, titre: 'Retours 30 jours', texte: 'Gratuits, sans justification' },
            { Icone: ShieldCheck, titre: 'Paiement 100 % sécurisé', texte: 'CB, Apple Pay, PayPal' },
          ].map((item, i) => (
            <motion.div
              key={item.titre}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3"
            >
              <item.Icone className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-bold">{item.titre}</p>
                <p className="text-sm text-kimix-soft">{item.texte}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ Upsell éditorial */}
      <section className="container-kimix py-10">
        <div className="rounded-3xl bg-kimix-pink/35 px-5 py-16 md:px-10">
          <h2 className="mb-8 font-display text-h2 font-semibold italic">
            Les <Highlight couleur="cyan">combinaisons</Highlight> qui cartonnent
          </h2>
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
            {combos.map((p, i) => (
              <div key={p.slug} className="w-[70%] shrink-0 snap-start sm:w-[45%] lg:w-[23%]">
                <ProductCard produit={p} index={i} />
                <p className="mt-2 text-xs font-medium text-kimix-soft">
                  {p.contenu.length} éléments · économise{' '}
                  {p.prixBarre ? formatPrix(p.prixBarre - p.prix) : '—'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filtres mobile : feuille du bas */}
      <AnimatePresence>
        {sheetMobile && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-40 max-h-[70vh] overflow-y-auto rounded-t-3xl border-t border-kimix-line bg-white p-5 lg:hidden"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-kimix-line" />
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold italic">Filtres</h2>
              <button type="button" onClick={() => setSheetMobile(false)} aria-label="Fermer les filtres">
                <X className="h-5 w-5" />
              </button>
            </div>

            <fieldset className="mt-5">
              <legend className="eyebrow mb-2">Type</legend>
              <div className="flex flex-wrap gap-2">
                {FAMILLES.map((f) => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => bascule(familles, f.label, majFamilles)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-sm',
                      familles.includes(f.label)
                        ? 'border-kimix-ink bg-kimix-ink text-white'
                        : 'border-kimix-line',
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-5">
              <legend className="eyebrow mb-2">Pièce</legend>
              <div className="flex flex-wrap gap-2">
                {PIECES.map((piece) => (
                  <button
                    key={piece}
                    type="button"
                    onClick={() => bascule(pieces, piece, majPieces)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-sm',
                      pieces.includes(piece) ? 'border-kimix-ink bg-kimix-ink text-white' : 'border-kimix-line',
                    )}
                  >
                    {piece}
                  </button>
                ))}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={() => setSheetMobile(false)}
              className="mt-6 w-full rounded-full bg-kimix-ink py-3 font-semibold text-white"
            >
              Voir les {resultats.length} résultats
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
