# KIMIX — Design Global

Site e-commerce pour **KIMIX**, marque de rangement modulable (modules combinables façon Lego), créée par un ado de 15 ans et son père. Deux pages clés demandées : une **homepage scrollytelling** immersive et une **page catalogue e-commerce ultra moderne façon Shopify**. Site entièrement en **français**. Données produits réalistes simulées (frontend only).

Références benchmark : Apple (scroll-scrubbing produit), Big Green Egg « The Evergreen » (scrollytelling e-commerce), The Cool Club (e-commerce ludique), Gymshark / Blueland / Kith (PLP Shopify Plus), Montana Furniture (filtres rangement modulaire), Glossier (hover ludiques), HAY (pastels accessibles), Patagonia (storytelling jusque dans le listing).

---

## 1. Palette de couleurs (OFFICIELLE — IMPOSÉE)

| Rôle | Couleur | Hex | Usage |
|---|---|---|---|
| Gris KIMIX | Gris moyen | `#B4B4B4` | Fonds de section, badges, surfaces secondaires, logo déclinaison |
| Rose KIMIX | Rose pastel | `#FFD1F1` | Fonds hero/sections, accents, badges « Nouveau », hover states |
| Cyan KIMIX | Cyan clair | `#C9FCFF` | Fonds sections alternés, badges « Best seller », highlights |
| Blanc | Blanc pur | `#FFFFFF` | Fond principal, cartes produits, espaces de respiration |
| Encre (dérivé a11y) | Quasi-noir | `#1A1A1A` | **Tout le texte**, CTA primaires, footer, icônes |
| Encre adoucie | Gris texte secondaire | `#4A4A4A` | Texte secondaire, méta, labels (contraste ≥ 4,5:1 sur blanc/pastels) |
| Ligne | Bordure subtile | `#E8E8E8` | Hairlines, séparateurs, bordures de cartes |

### Règles d'accessibilité (NON négociables — échec WCAG des pastels en texte)
- **Jamais de texte** en `#B4B4B4`, `#FFD1F1` ou `#C9FCFF` (contrastes ≈ 2:1 et 1,2:1). Les pastels servent uniquement de **fonds, badges, accents graphiques, pictos décoratifs**.
- Texte toujours en `#1A1A1A` (ou `#4A4A4A` en secondaire) sur fonds blanc/pastels/gris clair.
- **CTA primaire** : fond `#1A1A1A`, texte `#FFFFFF`, jamais pastel sur pastel.
- Badges : fond pastel + texte `#1A1A1A` en gras (ex. badge rose « Nouveau », badge cyan « Best seller », badge gris « Combo −15 % »).
- Focus visible : outline 2px `#1A1A1A` offset 2px sur tous les éléments interactifs.

---

## 2. Typographie

Google Fonts, deux familles à forte personnalité :

- **Display / Titres : `Clash Display`** (via Fontshare, fallback `Space Grotesk` Google Fonts) — utilisée en **italique** pour rappeler le logo KIMIX (rose italique). Weights : 500 (medium), 600 (semibold). Letter-spacing : −0,02em. Style signature : titres en italic avec un mot mis en évidence par un surlignage pastel (span à fond `#FFD1F1` ou `#C9FCFF`, padding 0.05em 0.2em, border-radius 0.15em).
- **Texte / UI : `Inter`** (Google Fonts) — weights 400, 500, 600, 700. Letter-spacing 0, line-height 1.55.

### Échelle (desktop → mobile, `clamp`)
| Token | Taille | Usage |
|---|---|---|
| `display-xl` | clamp(3.5rem, 9vw, 8.5rem) | Hero home, grands statements |
| `display-lg` | clamp(2.5rem, 6vw, 5rem) | Titres de chapitres home |
| `h1` | clamp(2.25rem, 4.5vw, 3.75rem) | Titres de pages (catalogue, PDP, concept) |
| `h2` | clamp(1.75rem, 3.2vw, 2.75rem) | Titres de sections |
| `h3` | clamp(1.25rem, 2vw, 1.5rem) | Sous-titres, noms produits PDP |
| `body-lg` | 1.125rem | Intros, descriptions hero |
| `body` | 1rem | Corps de texte |
| `small` | 0.875rem | Méta, labels, prix secondaires |
| `micro` | 0.75rem, uppercase, ls 0.12em, weight 600 | Badges, eyebrow labels, filtres |

Le mot-clé de marque **« KIMIX »** s'écrit toujours en capitales, Clash Display italic 600.

---

## 3. Espacements & grille

- Échelle Tailwind standard (4px base). Sections homepage : padding vertical `py-24 md:py-36`.
- Container max : `max-w-[1400px]`, padding latéral `px-5 md:px-10`.
- Grille catalogue : 4 colonnes desktop (≥1280px), 3 colonnes tablette (768–1279px), **2 colonnes mobile max**.
- Border-radius : `rounded-2xl` (16px) cartes produits, `rounded-full` boutons/badges/chips, `rounded-3xl` grandes surfaces pastel.
- Ombres : quasi plates. Cartes : `shadow-none`, bordure `1px #E8E8E8` ; au hover : `shadow-[0_12px_40px_-12px_rgba(26,26,26,0.18)]`.

---

## 4. Style d'animation & comportement scroll

- **Lenis** sur tout le site (lerp 0.1, smoothWheel). Jamais de scrolljacking complet.
- **GSAP + ScrollTrigger** pour : section pinnée d'assemblage du module (`scrub: 1`, pin 250vh), parallaxes, reveals, SplitText sur titres.
- **Framer Motion** : micro-interactions, hover/tap, transitions de page (fade+slide 200ms), cart drawer, layout animations de la grille catalogue (filtrage animé via `layout`).
- Niveaux d'animation texte : caractère par caractère uniquement pour headlines ≤ 20 caractères ; mot par mot pour sous-titres ; bloc pour paragraphes.
- Easing signature : `cubic-bezier(0.22, 1, 0.36, 1)` (easeOutExpo-like). Durées : micro 150–250ms, reveals 500–800ms, scrub lié au scroll.
- **`prefers-reduced-motion`** : désactive pin/scrub/parallaxe → contenu affiché statiquement, reveals en simple fade.
- Max ~8 éléments animés simultanément par viewport.

### Curseur custom
- Curseur par défaut remplacé par un **point `#1A1A1A` 12px** + anneau 36px en `mix-blend-mode: difference`. Au hover d'un produit/bouton : l'anneau grandit à 56px avec le libellé contextuel (« Voir », « + Panier », « Glisser ») en micro-type. Désactivé sur tactile et si reduced-motion. Curseur natif conservé en fallback (`cursor: auto` sur inputs).

---

## 5. Composants partagés

### Navbar (sticky, toutes pages)
- Hauteur 72px. Fond `rgba(255,255,255,0.8)` backdrop-blur 12px, hairline `#E8E8E8` en bas. Apparaît opaque après 40px de scroll ; au top de la home elle est transparente sur le hero.
- Gauche : logo **KIMIX** (Clash Display italic 600, `#1A1A1A`, 1.5rem — déclinaison logo : rose italic sur pastille grise `#B4B4B4` arrondie).
- Centre (desktop) : `Catalogue` · `Packs & Combos` (ancre catalogue filtrée) · `Shop the Look` (ancre) · `Concept`. Hover : soulignement animé qui glisse (scaleX 0→1, origine gauche).
- Droite : icône recherche (ouvre une modale de recherche plein écran), icône compte (décorative), **bouton panier pill** fond `#1A1A1A` texte blanc avec compteur badge rose `#FFD1F1` texte `#1A1A1A`. Le compteur fait un « pop » (scale 1→1.4→1) à chaque ajout.
- Mobile : burger → menu plein écran fond `#FFD1F1`, liens géants Clash Display italic, stagger 60ms.

### Cart Drawer (tiroir panier, global)
- Glisse depuis la droite (Framer Motion, spring damping 26). Fond blanc, largeur 420px (100vw mobile).
- Lignes produit : miniature 80×80 rounded-xl, nom, variante couleur (pastille), quantité avec stepper −/+, prix. Sous-total, barre de progression vers la **livraison offerte dès 59 €** (barre `#E8E8E8` → remplissage `#C9FCFF` avec texte « Plus que X € pour la livraison offerte »).
- CTA « Commander » fond `#1A1A1A` pleine largeur + lien « Continuer mes achats ». Note : checkout simulé (bouton affiche un état « Démo — paiement non connecté »).
- Upsell en bas : « Complète ton combo » avec 1–2 modules compatibles en quick add.

### ProductCard (réutilisée catalogue, home, PDP, upsells)
- Image 4:5 `rounded-2xl`, fond de studio pastel (alternance rose/cyan/blanc cassé). **Seconde image au hover** (crossfade 300ms + léger zoom 1.04).
- **Quick add** : bouton « + Ajout rapide » qui glisse du bas de l'image au hover (desktop) ; **toujours visible** en bas d'image sur mobile. Ouvre un mini-sélecteur de couleur si variantes, sinon ajoute directement (toast « Ajouté au panier ✓ » + pop du compteur).
- Badges en haut à gauche : `Nouveau` (fond `#FFD1F1`), `Best seller` (fond `#C9FCFF`), `Combo −15 %` (fond `#B4B4B4` texte `#1A1A1A`).
- Nom (Inter 600, 0.95rem), prix (Inter 700), prix barré si promo, note étoiles + **nombre d'avis** (ex. « 4,8 (127 avis) », étoiles `#1A1A1A`).
- Pastilles couleur des variantes (swatches 16px, bordure `#1A1A1A` si sélectionnée).

### Footer (global)
- Fond `#1A1A1A`, texte blanc/gris `#B4B4B4`. En haut : mega-logo **KIMIX** géant Clash Display italic en `#FFD1F1` (décoratif, taille 12vw, coupé par le bas).
- 4 colonnes : Boutique (Catalogue, Packs, Shop the Look, Cartes cadeaux) · Aide (Livraison, Retours 30 jours, FAQ, Contact) · La marque (Concept, Notre histoire, Presse) · Newsletter (input + bouton rose `#FFD1F1` texte `#1A1A1A`, message de confirmation animé).
- Bas : © 2026 KIMIX · Fabriqué avec ❤ par un père et son fils · CGV · Confidentialité · icônes sociales (Instagram, TikTok, Pinterest).

### Éléments transverses
- **Toast** : pill sombre en bas-centre, slide-up + fade, auto-dismiss 2,5s.
- **Skeleton loading** : shimmer gris `#F0F0F0`→`#E0E0E0` sur cartes produits au chargement/filtrage.
- **Marquee** : bandeau défilant infini (utilisé en home + haut de catalogue) — texte micro uppercase séparé par des symboles `✦` et `⬚` : « MODULES COMBINABLES À L'INFINI ✦ LIVRAISON OFFERTE DÈS 59 € ✦ RETOURS 30 JOURS ✦ CONÇU EN FRANCE ».

---

## 6. Dépendances

```
react, react-dom, react-router-dom
tailwindcss@3.4, shadcn/ui (button, badge, accordion, drawer, dialog, slider, checkbox, select, toast)
gsap (ScrollTrigger, SplitText via custom splitter si non dispo → fallback split maison)
lenis
framer-motion
lucide-react (icônes)
```
Pas de Three.js nécessaire : l'assemblage modulaire est fait en **images séquencées / couches SVG + GSAP scrub** (plus léger, fidèle au rendu produit).

---

## 7. Page List

| Fichier | Route | Description |
|---|---|---|
| `home.md` | `/` | Homepage scrollytelling : hero interactif, module qui s'assemble au scroll (pin+scrub), narration chaos→ordre, collections, shop the look, preuve sociale. |
| `catalogue.md` | `/catalogue` | PLP façon Shopify Plus : filtres sidebar sticky, tri, grille 4 col, quick add, badges, load more + lazy-load, skeleton. |
| `produit.md` | `/produit/[slug]` | PDP : galerie 2+ images, plan coté, sélecteur couleur, sticky add-to-cart, « Combine-le avec », avis, accordéons. |
| `concept.md` | `/concept` | Page marque : l'histoire père & fils, le système modulaire expliqué, engagements, chiffres animés. |

État global panier + catalogue simulé via un `products.ts` (12 produits réalistes, voir catalogue.md) partagé entre pages.

---

## 8. Assets (manifeste — génération par l'équipe Scaffold)

Style global des visuels produits : **studio photo minimaliste**, modules de rangement en plastique/PP mat aux couleurs pastel de la marque (rose `#FFD1F1`, cyan `#C9FCFF`, gris `#B4B4B4`, blanc), ombres douces, fond uni coordonné, éclairage diffus façon HAY/Ferm Living. Cohérence stricte entre toutes les images.

### Logo & icônes
| Fichier | Description | Emplacement | Dimensions | Type |
|---|---|---|---|---|
| `logo.svg` | Wordmark « KIMIX » en capitales italiques, lettres géométriques épaisses légèrement inclinées, couleur `#1A1A1A` | Navbar, footer | vectoriel | SVG |
| `logo-pastille.svg` | Wordmark « KIMIX » rose `#FFD1F1` italique sur pastille arrondie grise `#B4B4B4` (déclinaison officielle) | Navbar (état hero), loader | vectoriel | SVG |
| `favicon.svg` | Lettre « K » italique rose sur carré arrondi gris | Onglet navigateur | 64×64 | SVG |

### Home
| Fichier | Description | Emplacement | Dimensions | Type |
|---|---|---|---|---|
| `hero-module-1.png` … `hero-module-4.png` | 4 modules KIMIX individuels en vue 3/4 isométrique, fond transparent : cube ouvert rose, brique 2×1 cyan, panier gris, étagère blanche — rendu 3D propre style produit | Hero home (empilage interactif) | 800×800 1:1 chacun, PNG transparent | Image |
| `assembly-frame-1.png` … `assembly-frame-6.png` | Séquence 6 étapes d'assemblage d'une étagère KIMIX complète : du module unique posé → 2 modules clipsés → 4 modules en L → ajout paniers → étagère finale complète avec plante et livres. Fond studio blanc cassé, cadrage fixe | Section pinnée « Ça s'assemble au scroll » | 1200×1200 1:1 chacune | Image |
| `chaos-before.jpg` | Photo réaliste d'une chambre d'ado en désordre (vêtements, câbles, livres éparpillés), lumière naturelle, tons neutres | Chapitre « Le chaos » | 1600×1000 16:10 | Image |
| `order-after.jpg` | La même pièce transformée : rangements KIMIX pastel le long du mur, tout est ordonné, ambiance lumineuse et joyeuse | Chapitre « L'ordre » | 1600×1000 16:10 | Image |
| `collection-cubes.jpg` | Composition studio de cubes de rangement pastel empilés en pyramide, fond rose `#FFD1F1` | Carte collection « Cubes » | 900×1100 4:5 | Image |
| `collection-etagere.jpg` | Étagère modulaire murale cyan et blanche avec livres et plante, fond cyan `#C9FCFF` | Carte collection « Étagères » | 900×1100 4:5 | Image |
| `collection-packs.jpg` | Grand pack combo de modules assortis gris/rose/cyan disposés en composition architecturale, fond gris clair | Carte collection « Packs » | 900×1100 4:5 | Image |
| `look-1.jpg` | Scène d'intérieur « chambre ado » : bureau avec organisateurs KIMIX rose, étagère cube, lumière chaude | Shop the look n°1 | 1400×1000 7:5 | Image |
| `look-2.jpg` | Scène « entrée » : banc avec paniers KIMIX cyan en dessous, patères, ambiance scandinave | Shop the look n°2 | 1400×1000 7:5 | Image |
| `look-3.jpg` | Scène « salon » : meuble TV bas composé de modules KIMIX blancs et gris, plantes | Shop the look n°3 | 1400×1000 7:5 | Image |
| `ugc-1.jpg` … `ugc-4.jpg` | Photos style UGC smartphone : intérieurs réels de clients avec modules KIMIX (bureau gaming, dressing, cuisine, salle de bain), cadrage vertical légèrement imparfait, lumière naturelle | Mur de preuve sociale | 800×1000 4:5 chacune | Image |

### Catalogue & PDP — produits (2 images chacun : principale + hover)
Fond principal : studio pastel alterné (rose/cyan/blanc cassé) ; image hover : le produit **en situation** ou sous un autre angle.

| Fichier | Produit | Description image principale / hover | Dimensions | Type |
|---|---|---|---|---|
| `p-cube-rose-1.jpg` / `p-cube-rose-2.jpg` | Cube KIMIX rose 30×30 | Cube ouvert rose pastel seul, fond rose plus soutenu / cube rempli de livres dans une chambre | 1000×1250 4:5 | Image |
| `p-cube-cyan-1.jpg` / `p-cube-cyan-2.jpg` | Cube KIMIX cyan 30×30 | idem en cyan | 1000×1250 | Image |
| `p-brique-1.jpg` / `p-brique-2.jpg` | Brique 2×1 blanche | Module rectangulaire blanc 60×30 / deux briques empilées sous un bureau | 1000×1250 | Image |
| `p-panier-gris-1.jpg` / `p-panier-gris-2.jpg` | Panier tressé gris | Panier ajouré gris `#B4B4B4` avec poignées / panier avec plaids sur une étagère | 1000×1250 | Image |
| `p-etagere-1.jpg` / `p-etagere-2.jpg` | Étagère murale duo | Deux tablettes modulaires blanc+cyan fixées au mur, fond cyan / vue en situation au-dessus d'un bureau | 1000×1250 | Image |
| `p-tour-1.jpg` / `p-tour-2.jpg` | Tour 4 cubes mixte | Colonne verticale de 4 cubes rose/cyan/blanc/gris / la tour dans un coin de salon | 1000×1250 | Image |
| `p-boite-1.jpg` / `p-boite-2.jpg` | Boîte à couvercle rose | Boîte rectangulaire rose avec couvercle clipsable / pile de 3 boîtes étiquetées | 1000×1250 | Image |
| `p-pack-studio-1.jpg` / `p-pack-studio-2.jpg` | Pack Studio (8 pièces) | Composition flat-lay des 8 modules du pack, fond gris clair / le pack installé dans un studio | 1000×1250 | Image |
| `p-pack-gaming-1.jpg` / `p-pack-gaming-2.jpg` | Pack Gaming (6 pièces) | Modules cyan/gris avec casque et manettes rangés / setup gaming éclairé LED avec les modules | 1000×1250 | Image |
| `p-organisateur-1.jpg` / `p-organisateur-2.jpg` | Organisateur de bureau | Petit module compartimenté rose pour stylos/câbles / en situation sur un bureau | 1000×1250 | Image |
| `p-banc-1.jpg` / `p-banc-2.jpg` | Banc coffre 3 modules | Banc bas blanc à 3 compartiments ouverts, coussin gris / dans une entrée avec chaussures | 1000×1250 | Image |
| `p-meuble-tv-1.jpg` / `p-meuble-tv-2.jpg` | Meuble TV 6 modules | Enfilade basse blanche et grise / en situation sous une TV avec plantes | 1000×1250 | Image |

### PDP spécifique
| Fichier | Description | Emplacement | Dimensions | Type |
|---|---|---|---|---|
| `plan-cote-cube.svg` | Plan technique coté du cube 30×30×30 cm : lignes fines `#1A1A1A`, cotes avec flèches, labels « 30 cm », style blueprint minimaliste sur fond blanc | PDP, onglet Dimensions | 800×800 | SVG |

### Concept
| Fichier | Description | Emplacement | Dimensions | Type |
|---|---|---|---|---|
| `founders.jpg` | Portrait chaleureux d'un père et de son fils ado dans un atelier/garage, entourés de prototypes de modules pastel, lumière naturelle, ambiance authentique | Hero concept | 1600×1000 16:10 | Image |
| `workshop-1.jpg` | Mains assemblant deux modules pastel, gros plan, clichés de connexion visibles | Section « Le système » | 1000×1200 4:5 | Image |
| `workshop-2.jpg` | Étagère de prototypes et échantillons de couleurs pastel dans l'atelier | Section « Le système » | 1000×1200 4:5 | Image |
| `exploded-module.png` | Vue éclatée 3D d'un module : panneaux, clips de connexion, couvercle — sur fond transparent, rendu propre type notice technique stylisée | Section « Anatomie d'un module » | 1200×1200 1:1, PNG transparent | Image |
