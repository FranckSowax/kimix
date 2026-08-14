import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeartHandshake, Recycle, Wrench } from 'lucide-react';
import SplitText, { Highlight } from '@/components/SplitText';

const POINTS = [
  {
    num: '01',
    titre: 'Des panneaux en PP recyclé à 60 %',
    texte: "Légers, costauds, nettoyables d'un coup d'éponge.",
  },
  {
    num: '02',
    titre: 'Des clips brevetés sans outil',
    texte: 'Connexion dans les 6 directions, testée 10 000 clipsages.',
  },
  {
    num: '03',
    titre: 'Un système qui grandit avec toi',
    texte: "Achète un cube aujourd'hui, un pack demain, tout reste compatible.",
  },
];

const CHIFFRES = [
  { valeur: 2400, suffixe: '+', label: 'intérieurs transformés' },
  { valeur: 18000, suffixe: '', label: 'modules expédiés' },
  { valeur: 10000, suffixe: '', label: 'clipsages testés en labo (le garage)' },
  { valeur: 4.9, suffixe: '/5', label: 'de note moyenne' },
];

const ENGAGEMENTS = [
  {
    Icone: Recycle,
    titre: 'Matière responsable',
    texte: '60 % de plastique recyclé, 100 % recyclable.',
  },
  {
    Icone: Wrench,
    titre: 'Réparable à vie',
    texte: "Un clip casse ? On t'en renvoie un, gratuitement.",
  },
  {
    Icone: HeartHandshake,
    titre: 'Entreprise familiale',
    texte: "Pas d'actionnaires, juste un père, un fils, et un garage.",
  },
];

/** Compteur animé au scroll (easeOutExpo). */
function CountUp({ valeur, suffixe }: { valeur: number; suffixe: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const vue = useInView(ref, { once: true, margin: '-40%' });
  const reduit = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [affiche, setAffiche] = useState(() => (reduit() ? valeur : 0));
  const decimal = !Number.isInteger(valeur);

  useEffect(() => {
    if (!vue || reduit()) return;
    const debut = performance.now();
    let frame = 0;
    const anim = (t: number) => {
      const p = Math.min(1, (t - debut) / 1500);
      const eased = 1 - Math.pow(2, -10 * p);
      setAffiche(valeur * eased);
      if (p < 1) frame = requestAnimationFrame(anim);
      else setAffiche(valeur);
    };
    frame = requestAnimationFrame(anim);
    return () => cancelAnimationFrame(frame);
  }, [vue, valeur]);

  return (
    <span ref={ref}>
      {decimal
        ? affiche.toFixed(1).replace('.', ',')
        : Math.round(affiche).toLocaleString('fr-FR')}
      {suffixe}
    </span>
  );
}

/** Vue éclatée qui se recompose au scroll (scrub). */
function Anatomie() {
  const section = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [actif, setActif] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = section.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          setActif(Math.min(2, Math.floor(self.progress * 3)));
          if (image.current) {
            // Les couches « se recomposent » : l'éclatement se referme
            gsap.set(image.current, {
              scale: 0.9 + self.progress * 0.12,
              y: (1 - self.progress) * 40,
            });
          }
        },
      });
      return () => st.kill();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="container-kimix py-10">
      <div ref={section} className="rounded-3xl bg-kimix-cyan/40 px-5 py-24 md:px-10">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">Le système</p>
            <h2 className="mt-3 font-display text-h2 font-semibold italic">
              Simple comme <Highlight couleur="pink">un clip.</Highlight>
            </h2>
            <ol className="mt-8 flex flex-col gap-6">
              {POINTS.map((point, i) => (
                <li
                  key={point.num}
                  className={`transition-opacity duration-300 ${i === actif ? 'opacity-100' : 'opacity-40'}`}
                >
                  <p className="font-display text-xl font-semibold italic">
                    {point.num} · {point.titre}
                  </p>
                  <p className="mt-1 text-kimix-soft">{point.texte}</p>
                </li>
              ))}
            </ol>
          </div>
          <img
            ref={image}
            src="/exploded-module.png"
            alt="Vue éclatée d'un module KIMIX"
            loading="lazy"
            className="mx-auto w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
}

export default function Concept() {
  return (
    <>
      {/* -------------------------------------------------- Hero éditorial */}
      <section className="relative overflow-hidden pb-20 pt-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-kimix-pink blur-[100px]" />
          <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-kimix-cyan blur-[100px]" />
        </div>
        <div className="container-kimix max-w-4xl text-center">
          <p className="eyebrow">Notre histoire</p>
          <h1 className="mt-5 font-display text-display-lg font-semibold italic leading-[1.05]">
            <SplitText texte="Né dans une chambre d'ado de" mode="char" delai={0.2} />{' '}
            <Highlight couleur="pink" delai={1.1}>
              15 ans.
            </Highlight>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mx-auto mt-7 max-w-2xl text-lg text-kimix-soft"
          >
            KIMIX, c'est l'histoire de Loan, 15 ans, qui en avait marre du bazar — et de son père,
            qui en avait marre de lui répéter de ranger. Ensemble, ils ont inventé un rangement qu'on
            a envie d'utiliser : des modules qui se clipsent comme des Lego.
          </motion.p>
        </div>
      </section>

      {/* --------------------------------------------- Portrait fondateurs */}
      <section className="container-kimix grid items-center gap-12 py-20 md:grid-cols-[55%_45%]">
        <motion.div
          initial={{ clipPath: 'inset(0 100% 0 0)', rotate: 3 }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)', rotate: 0 }}
          viewport={{ once: true, margin: '-25%' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <img
            src="/founders.jpg"
            alt="Loan et son père dans leur atelier"
            className="w-full rounded-3xl object-cover"
          />
          <motion.figcaption
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 18, delay: 0.5 }}
            className="absolute -bottom-6 right-4 max-w-[220px] -rotate-3 rounded-xl bg-white p-4 text-sm shadow-card-hover"
          >
            Loan &amp; son père, dans le garage où tout a commencé.
          </motion.figcaption>
        </motion.div>

        <div>
          <h2 className="font-display text-h2 font-semibold italic">
            Un père, un fils, <Highlight couleur="cyan">un clip.</Highlight>
          </h2>
          {[
            "La première étagère était en carton. Elle a tenu trois semaines, puis s'est effondrée sous une pile de mangas — et c'est exactement à ce moment que le projet est devenu sérieux.",
            "Ont suivi deux ans de prototypes imprimés en 3D dans le garage, des dizaines de clips cassés, et une première vente au lycée un mardi midi.",
            "Aujourd'hui, ce sont 2 400 intérieurs transformés — et toujours le même garage.",
          ].map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="mt-5 text-kimix-soft"
            >
              {para}
            </motion.p>
          ))}
          <p className="mt-7 inline-block rounded-full bg-kimix-grey px-4 py-2 font-display text-lg font-semibold italic text-kimix-ink">
            — Loan &amp; David
          </p>
        </div>
      </section>

      <Anatomie />

      {/* ------------------------------------------------ Chiffres animés */}
      <section className="bg-kimix-ink py-24 text-white">
        <div className="container-kimix grid grid-cols-2 gap-10 text-center md:grid-cols-4">
          {CHIFFRES.map((chiffre, i) => (
            <motion.div
              key={chiffre.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              <p className="relative inline-block font-display text-4xl font-semibold italic md:text-[3.5rem]">
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.12, duration: 0.4 }}
                  className={`absolute inset-x-0 bottom-1 -z-10 h-3 origin-left ${
                    i % 2 === 0 ? 'bg-kimix-pink' : 'bg-kimix-cyan'
                  }`}
                />
                <CountUp valeur={chiffre.valeur} suffixe={chiffre.suffixe} />
              </p>
              <p className="mt-2 text-sm text-kimix-grey">{chiffre.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ Atelier & matière */}
      <section className="container-kimix py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {['/workshop-1.jpg', '/workshop-2.jpg'].map((src, i) => (
            <motion.img
              key={src}
              src={src}
              alt="L'atelier KIMIX"
              loading="lazy"
              initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`aspect-[4/5] w-full rounded-3xl object-cover ${i === 0 ? 'md:-translate-y-6' : 'md:translate-y-6'}`}
            />
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-xl text-center text-lg text-kimix-soft">
          Chaque module est vérifié à la main avant de partir. Oui, même ceux du pack Gaming.
        </p>
      </section>

      {/* ---------------------------------------------------- Engagements */}
      <section className="container-kimix pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {ENGAGEMENTS.map((item, i) => (
            <motion.div
              key={item.titre}
              initial={{ opacity: 0, y: 50, rotate: 1 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="group rounded-2xl border border-kimix-line p-7 transition-shadow hover:shadow-card-hover"
            >
              <item.Icone className="h-7 w-7 transition-transform duration-500 group-hover:rotate-12" />
              <h3 className="mt-4 font-bold">{item.titre}</h3>
              <p className="mt-2 text-sm text-kimix-soft">{item.texte}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ CTA final */}
      <section className="bg-gradient-to-b from-white to-kimix-pink py-28 text-center">
        <div className="container-kimix">
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-display-lg font-semibold italic"
          >
            Envie de <span className="underline decoration-kimix-cyan decoration-8">clipser</span> ?
          </motion.h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/catalogue"
              className="rounded-full bg-kimix-ink px-7 py-3.5 font-semibold text-white"
            >
              Explorer le catalogue
            </Link>
            <Link
              to="/catalogue?type=packs"
              className="rounded-full border border-kimix-ink px-7 py-3.5 font-semibold"
            >
              Voir les packs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
