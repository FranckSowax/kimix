import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Plus, Star } from 'lucide-react';
import Marquee from '@/components/Marquee';
import ProductCard from '@/components/ProductCard';
import ScrubSequence from '@/components/ScrubSequence';
import SplitText, { Highlight } from '@/components/SplitText';
import { PRODUITS, getProduit } from '@/data/products';
import { useCart } from '@/context/cart-context';
import { cn, formatPrix } from '@/lib/utils';

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Frames extraites de kimix_video.mp4 (12 fps) → public/seq/f-001.jpg … */
const NB_FRAMES_CHAOS = 181;

/* -------------------------------------------------------------- Section 1 */

/** Les 3 temps du récit, calés sur la progression de la vidéo (chaos → ordre). */
const TEMPS_HERO = [
  {
    eyebrow: 'Chapitre 01 — le bazar',
    ligne:
      "Câbles emmêlés, piles de cours, ce tiroir qu'on n'ouvre plus. On connaît : KIMIX est né là.",
  },
  {
    eyebrow: 'Chapitre 02 — on clipse',
    ligne:
      'Des modules qui se combinent comme des Lego, sans outil, dans tous les sens.',
  },
  {
    eyebrow: 'Chapitre 03 — le même espace, transformé',
    ligne:
      'Compose le rangement parfait pour ta chambre, ton bureau, ta vie. Et recompose-le demain.',
  },
];

/** Hero scrollytelling : la séquence chaos → ordre défile derrière le titre. */
function HeroScrub() {
  return (
    <ScrubSequence
      pleinEcran
      nbFrames={NB_FRAMES_CHAOS}
      prefixe="/seq/f-"
      alt="Un logement encombré qui se range pièce après pièce"
      longueurPin={260}
      entete={
        <div className="container-kimix flex flex-col items-center text-center">
          <h1 className="max-w-5xl font-display text-display-xl font-semibold italic leading-[0.95] text-white">
            <SplitText texte="Empile." mode="char" delai={0.3} />{' '}
            <Highlight couleur="cyan" delai={0.9}>
              <SplitText texte="Clipse." mode="char" delai={0.5} />
            </Highlight>{' '}
            <Highlight couleur="pink" delai={1.1}>
              <SplitText texte="Range." mode="char" delai={0.7} />
            </Highlight>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/catalogue"
              data-cursor="Voir"
              className="rounded-full bg-kimix-pink px-7 py-3.5 font-semibold text-kimix-ink transition-transform hover:scale-[1.02]"
            >
              Explorer le catalogue
            </Link>
            <a
              href="#assemblage"
              className="rounded-full border border-white px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white hover:text-kimix-ink"
            >
              Voir le concept
            </a>
          </motion.div>
        </div>
      }
      superposition={(pct) => {
        const index = Math.min(TEMPS_HERO.length - 1, Math.floor((pct / 100) * TEMPS_HERO.length));
        const temps = TEMPS_HERO[index];
        return (
          <>
            {/* Récit synchronisé : le texte change au rythme de la vidéo */}
            <div className="pointer-events-none absolute inset-x-0 top-[18%] z-20 px-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto max-w-xl text-center"
                >
                  <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-kimix-cyan">
                    {temps.eyebrow}
                  </p>
                  <p className="mt-3 text-lg text-white/90">{temps.ligne}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progression du récit : 3 points */}
            <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center gap-2" aria-hidden="true">
              {TEMPS_HERO.map((_, i) => (
                <motion.span
                  key={i}
                  animate={{ width: i === index ? 28 : 8 }}
                  className="h-1.5 rounded-full bg-white"
                  style={{ opacity: i === index ? 1 : 0.35 }}
                />
              ))}
            </div>
          </>
        );
      }}
    />
  );
}

/** Jeu d'empilage : les 4 modules draggables, sortis du hero. */
function JeuEmpilage() {
  const modules = ['/hero-module-1.png', '/hero-module-2.png', '/hero-module-3.png', '/hero-module-4.png'];

  return (
    <section className="relative overflow-hidden py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-kimix-pink blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-kimix-cyan blur-[120px]" />
      </div>

      <p className="eyebrow text-center">Rangement modulable — conçu par un père &amp; son fils</p>

      <div className="container-kimix relative mt-8 w-full">
        <div className="relative mx-auto flex h-[24vh] min-h-[160px] max-w-3xl items-end justify-center gap-4 md:gap-8">
          {modules.map((src, i) => (
            <motion.img
              key={src}
              src={src}
              alt=""
              aria-hidden="true"
              drag
              dragMomentum={false}
              dragElastic={0.2}
              whileDrag={{ scale: 1.06, zIndex: 10 }}
              initial={{ y: -200, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', damping: 12, delay: i * 0.12 }}
              className="h-20 w-20 cursor-grab object-contain active:cursor-grabbing md:h-28 md:w-28"
              data-cursor="Glisser"
            />
          ))}
        </div>
        <p className="mt-3 text-center text-sm text-kimix-soft">
          ↕ Glisse les modules pour les empiler · <span className="font-medium">4 modules · ∞ combinaisons</span>
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Section 3 */

function ChapitreChaos() {
  return (
    <section id="chaos" className="container-kimix grid items-center gap-12 py-24 md:grid-cols-2 md:py-36">
      <motion.div
        initial={{ clipPath: 'inset(0 100% 0 0)', rotate: -6 }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)', rotate: -2 }}
        viewport={{ once: true, margin: '-25%' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-3xl"
      >
        <img src="/chaos-before.jpg" alt="Chambre d'ado en désordre" className="w-full object-cover" />
      </motion.div>

      <div>
        <p className="eyebrow">Chapitre 01</p>
        <h2 className="mt-4 font-display text-display-lg font-semibold italic leading-[1.05]">
          <SplitText texte="Tout commence par" auScroll />{' '}
          <Highlight couleur="grey" delai={0.4}>
            un bazar.
          </Highlight>
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-lg text-lg text-kimix-soft"
        >
          Câbles emmêlés, piles de cours, ce tiroir qu'on n'ouvre plus. On connaît. C'est exactement
          là que KIMIX est né — dans une chambre d'ado de 15 ans.
        </motion.p>
        <p className="mt-6 text-sm font-medium text-kimix-soft">Scroll pour ranger ↓</p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Section 4 */

const ETAPES = [
  {
    num: '01',
    titre: 'Prends un module',
    texte: 'Un cube, une brique, un panier. Tout commence par une seule pièce.',
  },
  {
    num: '02',
    titre: 'Clipse-les ensemble',
    texte: 'Nos clips brevetés relient les modules sans outil, dans tous les sens.',
  },
  {
    num: '03',
    titre: 'Admire le résultat',
    texte:
      "Une étagère, une tour, un meuble TV : c'est toi qui décides. Et tu peux tout recomposer demain.",
  },
];

function AssemblagePinned() {
  const section = useRef<HTMLElement>(null);
  const [etapeActive, setEtapeActive] = useState(0);
  const [progression, setProgression] = useState(0);
  const [statique] = useState(reducedMotion);

  useEffect(() => {
    if (statique) return;
    const el = section.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>('.assembly-frame');
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=250%',
        pin: '.assembly-pin',
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          setProgression(p);
          setEtapeActive(Math.min(2, Math.floor(p * 3)));
          // 6 frames réparties sur la progression, crossfade + léger scale
          const pos = p * (frames.length - 1);
          frames.forEach((frame, i) => {
            const distance = Math.abs(pos - i);
            gsap.set(frame, {
              opacity: Math.max(0, 1 - distance),
              scale: 1 + Math.min(1, distance) * 0.02,
            });
          });
        },
      });
      return () => st.kill();
    }, el);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('load', onLoad);
      ctx.revert();
    };
  }, [statique]);

  const frames = [1, 2, 3, 4, 5, 6];

  if (statique) {
    return (
      <section id="assemblage" className="container-kimix py-24">
        <img src="/assembly-frame-6.png" alt="Étagère KIMIX assemblée" className="mx-auto w-full max-w-xl rounded-3xl" />
        <ol className="mx-auto mt-10 flex max-w-xl flex-col gap-6">
          {ETAPES.map((e) => (
            <li key={e.num}>
              <p className="font-display text-2xl font-semibold italic">
                {e.num} · {e.titre}
              </p>
              <p className="mt-1 text-kimix-soft">{e.texte}</p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section id="assemblage" ref={section} className="relative">
      <div className="assembly-pin flex min-h-screen items-center bg-[#FAFAFA]">
        <div className="container-kimix grid w-full items-center gap-10 md:grid-cols-[40%_60%]">
          <div className="order-2 md:order-1">
            <p className="eyebrow">Chapitre 02</p>
            <h2 className="mt-3 font-display text-h2 font-semibold italic">Ça s'assemble.</h2>
            <ol className="mt-8 flex flex-col gap-6">
              {ETAPES.map((etape, i) => {
                const active = i === etapeActive;
                return (
                  <li key={etape.num} className="flex gap-4">
                    <div className="relative w-1 shrink-0 overflow-hidden rounded-full bg-kimix-line">
                      <motion.div
                        className="absolute inset-x-0 top-0 bg-kimix-pink"
                        animate={{
                          height: `${Math.max(0, Math.min(1, progression * 3 - i)) * 100}%`,
                        }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <div className={cn('transition-opacity duration-300', active ? 'opacity-100' : 'opacity-40')}>
                      <p
                        className={cn(
                          'font-display text-xl font-semibold italic',
                          active ? 'text-kimix-ink' : 'text-kimix-grey',
                        )}
                      >
                        {etape.num} · {etape.titre}
                      </p>
                      <p className="mt-1 text-sm text-kimix-soft md:text-base">{etape.texte}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 flex items-center gap-2" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ width: i === etapeActive ? 28 : 8 }}
                  className="h-2 rounded-full bg-kimix-ink"
                  style={{ opacity: i === etapeActive ? 1 : 0.25 }}
                />
              ))}
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative mx-auto aspect-square w-full max-w-[560px]">
              {frames.map((n) => (
                <img
                  key={n}
                  src={`/assembly-frame-${n}.png`}
                  alt={n === 6 ? 'Étagère KIMIX complètement assemblée' : ''}
                  aria-hidden={n !== 6}
                  className="assembly-frame absolute inset-0 h-full w-full object-contain"
                  style={{ opacity: n === 1 ? 1 : 0 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Section 5 */

/** Bande de preuves, sous le récit chaos → ordre porté par le hero. */
function StatsTransformation() {
  return (
    <section className="container-kimix py-20">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 text-center sm:grid-cols-3">
        {[
          { valeur: '+2 h', texte: 'gagnées chaque semaine à ne plus chercher tes affaires' },
          { valeur: '\u221e', texte: 'combinaisons possibles' },
          { valeur: '30 j', texte: "pour changer d'avis" },
        ].map((stat, i) => (
          <motion.div
            key={stat.valeur}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
          >
            <p className="font-display text-4xl font-semibold italic">{stat.valeur}</p>
            <p className="mt-2 text-sm text-kimix-soft">{stat.texte}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Section 6 */

const COLLECTIONS = [
  {
    image: '/collection-cubes.jpg',
    titre: 'Les Cubes',
    texte: "L'unité de base. Empile sans limite.",
    to: '/catalogue?type=cubes',
  },
  {
    image: '/collection-etagere.jpg',
    titre: 'Les Étagères',
    texte: 'Du sol au plafond, à ta mesure.',
    to: '/catalogue?type=etageres',
  },
  {
    image: '/collection-packs.jpg',
    titre: 'Les Packs',
    texte: 'Des combos prêts à monter, −15 %.',
    to: '/catalogue?type=packs',
  },
];

function Collections() {
  return (
    <section className="container-kimix py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Nos univers</p>
          <h2 className="mt-3 font-display text-h2 font-semibold italic">
            Trois façons de <Highlight couleur="pink">commencer.</Highlight>
          </h2>
        </div>
        <Link to="/catalogue" className="text-sm font-semibold underline">
          Tout voir →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {COLLECTIONS.map((col, i) => (
          <motion.div
            key={col.titre}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to={col.to}
              data-cursor="Explorer"
              className="group block overflow-hidden rounded-2xl border border-kimix-line transition-shadow hover:shadow-card-hover"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={col.image}
                  alt={col.titre}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
              </div>
              <div className="flex items-center justify-between gap-3 bg-white p-5">
                <div className="transition-transform duration-300 group-hover:-translate-y-2">
                  <h3 className="font-display text-xl font-semibold italic">{col.titre}</h3>
                  <p className="mt-1 text-sm text-kimix-soft">{col.texte}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Section 7 */

const LOOKS = [
  {
    image: '/look-1.jpg',
    nom: "Le bureau d'ado",
    hotspots: [
      { slug: 'organisateur-bureau', x: 28, y: 42 },
      { slug: 'cube-kimix-rose', x: 62, y: 60 },
      { slug: 'etagere-murale-duo', x: 48, y: 22 },
    ],
  },
  {
    image: '/look-2.jpg',
    nom: "L'entrée qui range",
    hotspots: [
      { slug: 'panier-tresse-gris', x: 35, y: 68 },
      { slug: 'banc-coffre-3', x: 60, y: 52 },
    ],
  },
  {
    image: '/look-3.jpg',
    nom: 'Le salon recomposable',
    hotspots: [
      { slug: 'meuble-tv-6', x: 45, y: 62 },
      { slug: 'brique-2x1-blanche', x: 70, y: 45 },
    ],
  },
];

function ShopTheLook() {
  const { ajouter } = useCart();
  const [ouvert, setOuvert] = useState<string | null>(null);

  return (
    <section id="shop-the-look" className="container-kimix py-16">
      <div className="rounded-3xl bg-kimix-cyan/35 px-5 py-20 md:px-10">
        <div className="mb-10">
          <p className="eyebrow">Shop the look</p>
          <h2 className="mt-3 font-display text-h2 font-semibold italic">
            Inspire-toi. <Highlight couleur="pink">Clique. Achète.</Highlight>
          </h2>
        </div>

        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {LOOKS.map((look, i) => (
            <motion.div
              key={look.nom}
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="w-[85%] shrink-0 snap-start md:w-[48%]"
            >
              <div className="relative aspect-[7/5] overflow-hidden rounded-2xl">
                <img src={look.image} alt={look.nom} loading="lazy" className="h-full w-full object-cover" />
                {look.hotspots.map((h) => {
                  const p = getProduit(h.slug);
                  if (!p) return null;
                  const id = `${look.nom}-${h.slug}`;
                  return (
                    <div key={id} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                      <button
                        type="button"
                        onClick={() => setOuvert(ouvert === id ? null : id)}
                        aria-label={`Voir ${p.nom}`}
                        className="grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-kimix-ink text-white animate-pulse-soft"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      {ouvert === id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', damping: 20 }}
                          className="absolute left-4 top-4 z-10 w-56 rounded-2xl bg-white p-3 shadow-card-hover"
                        >
                          <img src={p.images[0]} alt="" className="h-24 w-full rounded-lg object-cover" />
                          <p className="mt-2 text-sm font-semibold">{p.nom}</p>
                          <p className="text-sm text-kimix-soft">{formatPrix(p.prix)}</p>
                          <button
                            type="button"
                            onClick={() => ajouter(p, p.couleurs[0].nom)}
                            className="mt-2 w-full rounded-full bg-kimix-ink py-2 text-xs font-semibold text-white"
                          >
                            + Panier
                          </button>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{look.nom}</h3>
                  <p className="text-sm text-kimix-soft">
                    {look.hotspots.length} produits · À partir de{' '}
                    {formatPrix(Math.min(...look.hotspots.map((h) => getProduit(h.slug)?.prix ?? 0)))}
                  </p>
                </div>
                <Link to="/catalogue" className="text-sm font-semibold underline">
                  Voir la sélection
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Section 9 */

const AVIS = [
  {
    texte: "Mon fils a monté sa tour tout seul. Il range. Tout seul. Je n'y crois toujours pas.",
    auteur: 'Claire, maman de Tom',
    etoiles: 5,
  },
  { texte: 'Qualité au top, les clips tiennent vraiment.', auteur: 'Mehdi', etoiles: 5 },
  {
    texte: "J'ai recomposé mon meuble 3 fois en déménageant. Zéro casse.",
    auteur: 'Inès',
    etoiles: 4,
  },
];

function PreuveSociale() {
  return (
    <section className="bg-kimix-pink py-24">
      <div className="container-kimix">
        <div className="mb-12 text-center">
          <p className="eyebrow">Ils ont rangé leur vie</p>
          <h2 className="mt-3 font-display text-h2 font-semibold italic">
            +2 400 intérieurs <Highlight couleur="cyan">transformés.</Highlight>
          </h2>
          <p className="mt-4 text-sm font-medium text-kimix-ink">★ 4,9/5 — 612 avis vérifiés</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <motion.figure
              key={n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: n * 0.08, duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl"
            >
              <img
                src={`/ugc-${n}.jpg`}
                alt="Intérieur client équipé de modules KIMIX"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
                @client_kimix{n}
              </figcaption>
            </motion.figure>
          ))}

          {AVIS.map((avis, i) => (
            <motion.blockquote
              key={avis.auteur}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="rounded-2xl bg-white p-5"
            >
              <div className="mb-2 flex gap-0.5" aria-label={`${avis.etoiles} sur 5`}>
                {Array.from({ length: avis.etoiles }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-kimix-ink text-kimix-ink" />
                ))}
              </div>
              <p className="text-sm italic">« {avis.texte} »</p>
              <footer className="mt-3 text-xs font-medium text-kimix-soft">— {avis.auteur}</footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- Page */

export default function Home() {
  const bestSellers = ['cube-kimix-rose', 'pack-gaming', 'panier-tresse-gris', 'etagere-murale-duo']
    .map((slug) => PRODUITS.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <HeroScrub />
      <JeuEmpilage />

      <div className="border-y border-kimix-ink bg-kimix-pink py-4">
        <Marquee
          items={['Cubes', 'Étagères', 'Paniers', 'Boîtes', 'Packs combos']}
          separateur="⬚"
          rapide
          itemClassName="font-display text-2xl font-semibold italic text-kimix-ink"
        />
      </div>

      <ChapitreChaos />
      <AssemblagePinned />
      <StatsTransformation />
      <Collections />
      <ShopTheLook />

      <section className="container-kimix py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Les préférés</p>
            <h2 className="mt-3 font-display text-h2 font-semibold italic">
              Ceux que tout le monde <Highlight couleur="cyan">s'arrache.</Highlight>
            </h2>
          </div>
          <Link to="/catalogue" className="text-sm font-semibold underline">
            Voir tout le catalogue →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {bestSellers.map((p, i) => (
            <ProductCard key={p.slug} produit={p} index={i} />
          ))}
        </div>
      </section>

      <PreuveSociale />

      <section className="bg-kimix-ink py-32 text-center text-white">
        <div className="container-kimix">
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-display-lg font-semibold italic"
          >
            Prêt à <span className="text-kimix-pink">tout ranger ?</span>
          </motion.h2>
          <p className="mt-5 text-kimix-grey">
            Livraison offerte dès 59 € · Retours 30 jours · Paiement sécurisé
          </p>
          <Link
            to="/catalogue"
            className="mt-8 inline-block rounded-full bg-kimix-pink px-8 py-4 font-semibold text-kimix-ink transition-transform hover:scale-[1.03]"
          >
            Découvrir le catalogue
          </Link>
        </div>
      </section>
    </>
  );
}
