import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Instagram,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { PRODUITS, SEUIL_LIVRAISON_OFFERTE, getProduit } from '@/data/products';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/context/toast-context';
import { cn, formatPrix } from '@/lib/utils';

const LIENS_NAV = [
  { label: 'Catalogue', to: '/catalogue' },
  { label: 'Packs & Combos', to: '/catalogue?type=packs' },
  { label: 'Shop the Look', to: '/#shop-the-look' },
  { label: 'Concept', to: '/concept' },
];

/* ------------------------------------------------------------------ Navbar */

function Navbar({ onOuvrirRecherche }: { onOuvrirRecherche: () => void }) {
  const { nbArticles, ouvrirDrawer, dernierAjout } = useCart();
  const { pathname } = useLocation();
  const [scrolle, setScrolle] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);

  const surHero = pathname === '/' && !scrolle;

  useEffect(() => {
    const onScroll = () => setScrolle(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-9 z-40 h-[72px] transition-colors duration-300',
          surHero ? 'bg-transparent' : 'border-b border-kimix-line bg-white/80 backdrop-blur-md',
        )}
      >
        <div className="container-kimix flex h-full items-center justify-between gap-6">
          <Link to="/" className="font-display text-2xl font-semibold italic text-kimix-ink">
            KIMIX
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {LIENS_NAV.map((lien) => (
              <Link
                key={lien.label}
                to={lien.to}
                className="group relative text-sm font-medium text-kimix-ink"
              >
                {lien.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-kimix-ink transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOuvrirRecherche}
              aria-label="Rechercher un module"
              className="rounded-full p-2 hover:bg-black/5"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Mon compte"
              className="hidden rounded-full p-2 hover:bg-black/5 sm:block"
            >
              <User className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={ouvrirDrawer}
              data-cursor="Panier"
              className="flex items-center gap-2 rounded-full bg-kimix-ink py-2 pl-4 pr-3 text-sm font-semibold text-white"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Panier</span>
              <motion.span
                key={dernierAjout}
                initial={{ scale: 1 }}
                animate={{ scale: dernierAjout ? [1, 1.4, 1] : 1 }}
                transition={{ duration: 0.35 }}
                className="grid h-6 min-w-6 place-items-center rounded-full bg-kimix-pink px-1.5 text-xs font-bold text-kimix-ink"
              >
                {nbArticles}
              </motion.span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOuvert(true)}
              aria-label="Ouvrir le menu"
              className="rounded-full p-2 hover:bg-black/5 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOuvert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-kimix-pink md:hidden"
          >
            <div className="container-kimix flex h-[72px] items-center justify-between pt-9">
              <span className="font-display text-2xl font-semibold italic">KIMIX</span>
              <button type="button" onClick={() => setMenuOuvert(false)} aria-label="Fermer le menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="container-kimix mt-10 flex flex-col gap-5">
              {LIENS_NAV.map((lien, i) => (
                <motion.div
                  key={lien.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={lien.to}
                    onClick={() => setMenuOuvert(false)}
                    className="font-display text-4xl font-semibold italic"
                  >
                    {lien.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------- Cart drawer */

function CartDrawer() {
  const {
    lignes,
    drawerOuvert,
    fermerDrawer,
    sousTotal,
    resteLivraisonOfferte,
    changerQuantite,
    retirer,
  } = useCart();
  const { toast } = useToast();

  const progression = Math.min(100, (sousTotal / SEUIL_LIVRAISON_OFFERTE) * 100);
  const upsell = PRODUITS.filter((p) => !lignes.some((l) => l.slug === p.slug)).slice(0, 2);

  return (
    <AnimatePresence>
      {drawerOuvert && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={fermerDrawer}
            className="fixed inset-0 z-[80] bg-black/40"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-[420px] flex-col bg-white"
            aria-label="Panier"
          >
            <div className="flex items-center justify-between border-b border-kimix-line px-5 py-4">
              <h2 className="font-display text-xl font-semibold italic">Ton panier</h2>
              <button type="button" onClick={fermerDrawer} aria-label="Fermer le panier">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-kimix-line px-5 py-4">
              <p className="text-sm text-kimix-soft">
                {resteLivraisonOfferte > 0
                  ? `Plus que ${formatPrix(resteLivraisonOfferte)} pour la livraison offerte`
                  : 'Livraison offerte débloquée ✓'}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-kimix-line">
                <motion.div
                  className="h-full bg-kimix-cyan"
                  animate={{ width: `${progression}%` }}
                  transition={{ ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lignes.length === 0 ? (
                <p className="py-10 text-center text-sm text-kimix-soft">
                  Ton panier est vide. Il attend son premier module.
                </p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {lignes.map((ligne) => {
                    const p = getProduit(ligne.slug);
                    if (!p) return null;
                    return (
                      <li key={`${ligne.slug}-${ligne.couleur}`} className="flex gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="h-20 w-20 shrink-0 rounded-xl object-cover"
                        />
                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex justify-between gap-2">
                            <span className="text-sm font-semibold">{p.nom}</span>
                            <button
                              type="button"
                              onClick={() => retirer(ligne.slug, ligne.couleur)}
                              aria-label={`Retirer ${p.nom}`}
                            >
                              <X className="h-4 w-4 text-kimix-soft" />
                            </button>
                          </div>
                          <span className="text-xs text-kimix-soft">Couleur : {ligne.couleur}</span>
                          <div className="mt-1 flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-full border border-kimix-line px-2 py-1">
                              <button
                                type="button"
                                onClick={() => changerQuantite(ligne.slug, ligne.couleur, -1)}
                                aria-label="Diminuer la quantité"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-5 text-center text-sm">{ligne.quantite}</span>
                              <button
                                type="button"
                                onClick={() => changerQuantite(ligne.slug, ligne.couleur, 1)}
                                aria-label="Augmenter la quantité"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="font-bold">{formatPrix(p.prix * ligne.quantite)}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {upsell.length > 0 && (
                <div className="mt-8 border-t border-kimix-line pt-5">
                  <h3 className="eyebrow mb-3">Complète ton combo</h3>
                  <ul className="flex flex-col gap-3">
                    {upsell.map((p) => (
                      <li key={p.slug} className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{p.nom}</p>
                          <p className="text-xs text-kimix-soft">{formatPrix(p.prix)}</p>
                        </div>
                        <Link
                          to={`/produit/${p.slug}`}
                          onClick={fermerDrawer}
                          className="rounded-full border border-kimix-ink px-3 py-1 text-xs font-semibold"
                        >
                          Voir
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="border-t border-kimix-line px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-kimix-soft">Sous-total</span>
                <span className="text-lg font-bold">{formatPrix(sousTotal)}</span>
              </div>
              <button
                type="button"
                onClick={() => toast('Démo — paiement non connecté')}
                className="w-full rounded-full bg-kimix-ink py-3 font-semibold text-white"
              >
                Commander
              </button>
              <button
                type="button"
                onClick={fermerDrawer}
                className="mt-2 w-full text-center text-sm text-kimix-soft underline"
              >
                Continuer mes achats
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------- Modale recherche */

function SearchModal({ ouvert, onFermer }: { ouvert: boolean; onFermer: () => void }) {
  const [requete, setRequete] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!ouvert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFermer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ouvert, onFermer]);

  const resultats = requete.trim()
    ? PRODUITS.filter((p) =>
        `${p.nom} ${p.type}`.toLowerCase().includes(requete.trim().toLowerCase()),
      ).slice(0, 6)
    : [];

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (resultats[0]) {
      navigate(`/produit/${resultats[0].slug}`);
      onFermer();
    }
  };

  return (
    <AnimatePresence>
      {ouvert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[95] bg-white"
        >
          <div className="container-kimix pt-10">
            <div className="flex justify-end">
              <button type="button" onClick={onFermer} aria-label="Fermer la recherche">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={onSubmit}>
              <input
                autoFocus
                value={requete}
                onChange={(e) => setRequete(e.target.value)}
                placeholder="Recherche un module…"
                aria-label="Recherche un module"
                className="mt-10 w-full border-b border-kimix-line bg-transparent pb-4 font-display text-3xl font-semibold italic outline-none md:text-5xl"
              />
            </form>
            <ul className="mt-8 flex flex-col gap-3">
              {resultats.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/produit/${p.slug}`}
                    onClick={onFermer}
                    className="flex items-center gap-4 rounded-2xl border border-kimix-line p-3 hover:bg-black/5"
                  >
                    <img src={p.images[0]} alt="" className="h-14 w-14 rounded-lg object-cover" />
                    <span className="flex-1 font-medium">{p.nom}</span>
                    <span className="font-bold">{formatPrix(p.prix)}</span>
                  </Link>
                </li>
              ))}
              {requete.trim() && resultats.length === 0 && (
                <li className="text-kimix-soft">⬚ Aucun module ne correspond.</li>
              )}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ Footer */

function Footer() {
  const [email, setEmail] = useState('');
  const [inscrit, setInscrit] = useState(false);

  const colonnes = [
    { titre: 'Boutique', liens: ['Catalogue', 'Packs', 'Shop the Look', 'Cartes cadeaux'] },
    { titre: 'Aide', liens: ['Livraison', 'Retours 30 jours', 'FAQ', 'Contact'] },
    { titre: 'La marque', liens: ['Concept', 'Notre histoire', 'Presse'] },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden bg-kimix-ink pt-20 text-white">
      <div className="container-kimix grid gap-10 pb-16 md:grid-cols-4">
        {colonnes.map((col) => (
          <div key={col.titre}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em]">{col.titre}</h3>
            <ul className="flex flex-col gap-2 text-sm text-kimix-grey">
              {col.liens.map((lien) => (
                <li key={lien}>
                  <Link to={lien === 'Concept' ? '/concept' : '/catalogue'} className="hover:text-white">
                    {lien}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em]">Newsletter</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setInscrit(true);
            }}
            className="flex flex-col gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.fr"
              aria-label="Adresse e-mail"
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-kimix-grey"
            />
            <button
              type="submit"
              className="rounded-full bg-kimix-pink px-4 py-2.5 text-sm font-semibold text-kimix-ink"
            >
              Je m'inscris
            </button>
          </form>
          <AnimatePresence>
            {inscrit && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-kimix-cyan"
              >
                Merci ! On t'écrit très vite ✦
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="container-kimix flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-kimix-grey md:flex-row md:items-center md:justify-between">
        <p>© 2026 KIMIX · Fabriqué avec ❤ par un père et son fils</p>
        <div className="flex items-center gap-5">
          <span>CGV</span>
          <span>Confidentialité</span>
          <Instagram className="h-4 w-4" aria-label="Instagram" />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden text-center font-display font-semibold italic leading-[0.8] text-kimix-pink"
        style={{ fontSize: '12vw', marginBottom: '-0.18em' }}
      >
        KIMIX
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ Layout */

export default function Layout({ children }: { children: ReactNode }) {
  const [rechercheOuverte, setRechercheOuverte] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Bandeau promo */}
      <div className="fixed inset-x-0 top-0 z-50 h-9 overflow-hidden bg-kimix-ink">
        <div className="pause-on-hover flex h-full items-center overflow-hidden">
          <div className="marquee-track flex w-max animate-marquee items-center gap-6 whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-6">
                Livraison offerte dès 59 € <span aria-hidden="true">✦</span> Retours 30 jours{' '}
                <span aria-hidden="true">✦</span> Modules combinables à l'infini{' '}
                <span aria-hidden="true">✦</span> −15 % sur les packs <span aria-hidden="true">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <Navbar onOuvrirRecherche={() => setRechercheOuverte(true)} />
      <SearchModal ouvert={rechercheOuverte} onFermer={() => setRechercheOuverte(false)} />
      <CartDrawer />

      <main className="flex-1 pt-9">{children}</main>
      <Footer />
    </div>
  );
}
