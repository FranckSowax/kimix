# KIMIX — Page Home (`/`)

Homepage scrollytelling immersive : un récit en 4 chapitres — **accroche → le chaos → l'assemblage modulaire (pin + scrub) → l'ordre & la conversion**. Références : Apple (scroll-scrubbing), Big Green Egg « The Evergreen » (récit qui convertit), The Cool Club (produits jouables). Lenis actif, GSAP ScrollTrigger, contenu HTML réel (SEO), `prefers-reduced-motion` respecté partout (fallback : sections statiques empilées, reveals en fade simple).

---

## Section 0 — Bandeau promo (top bar)
- **Layout** : barre fixe en tout haut (au-dessus navbar), hauteur 36px, fond `#1A1A1A`, texte blanc micro uppercase.
- **Contenu** : marquee défilant infini : `LIVRAISON OFFERTE DÈS 59 € ✦ RETOURS 30 JOURS ✦ MODULES COMBINABLES À L'INFINI ✦ −15 % SUR LES PACKS` (répété ×4 pour boucle seamless).
- **Animation** : défilement CSS `translateX` 30s linéaire infini ; pause au hover. Aucune entrée (visible dès le chargement).

## Section 1 — Hero : « Empile. Clipse. Range. »
- **Layout** : plein viewport (100svh moins la top bar). Fond dégradé très doux : `#FFFFFF` → `#FFD1F1` en bas à gauche → `#C9FCFF` en bas à droite (mesh gradient CSS, flou 120px, statique). Formes décoratives : 2 grands carrés arrondis pastel (`#B4B4B4` à 20 % opacité, `#C9FCFF` à 50 %) flottant en arrière-plan avec parallaxe légère.
- **Contenu** :
  - Eyebrow centré : `RANGEMENT MODULABLE — CONÇU PAR UN PÈRE & SON FILS` (micro uppercase, `#4A4A4A`).
  - H1 géant centré, Clash Display italic 600, `display-xl`, `#1A1A1A` : `Empile. *Clipse.* Range.` — le mot « Clipse. » surligné fond `#C9FCFF`, « Range. » surligné fond `#FFD1F1`.
  - Sous-titre (body-lg, `#4A4A4A`, max-w-xl centré) : « Des modules qui se combinent comme des Lego. Compose le rangement parfait pour ta chambre, ton bureau, ta vie. »
  - 2 CTA centrés : primaire fond `#1A1A1A` texte blanc « Explorer le catalogue » (→ `/catalogue`), secondaire outline `#1A1A1A` « Voir le concept » (→ ancre `#assemblage`).
- **Élément interactif signature (The Cool Club)** : sous les CTA, zone de **jeu d'empilage** haute ~40vh : les 4 modules `hero-module-1..4.png` arrivent posés en ligne. L'utilisateur peut **cliquer/glisser chaque module pour les empiler** (Framer Motion `drag` avec contraintes verticales, snap magnétique quand un module s'approche du sommet de la pile + petit son visuel : ondulation scale 1→1.06→1 et micro-rebond). Compteur discret : `4 modules · ∞ combinaisons`. Indication « ↕ Glisse les modules pour les empiler » en small gris.
- **Animation** :
  - Entrée au load : eyebrow fade-up (20px, 0.5s) → H1 split **caractère par caractère** (stagger 25ms, y 60px→0, rotate 4°→0, opacity 0→1, 0.8s, easeOutExpo) → surlignages qui « peignent » leur fond (scaleX 0→1, origine gauche, 0.4s) → sous-titre fade-up → CTA stagger 0.1s → les 4 modules tombent du haut en cascade (y −300px, stagger 120ms, rebond `spring damping 12`).
  - Formes d'arrière-plan : parallaxe au scroll (y ±60px, scrub) + flottement idle (y ±8px, 6s, easeInOut infini alterné).
  - Hover CTA primaire : fond glisse de `#1A1A1A` vers un dégradé rose→cyan via un pseudo-élément (0.3s), scale 1.02. Tap : scale 0.97.

## Section 2 — Marquee collections
- **Layout** : bande pleine largeur, fond `#FFD1F1`, `py-4`, bordures hairlines `#1A1A1A` 1px haut/bas.
- **Contenu** : marquee infini : `CUBES ⬚ ÉTAGÈRES ⬚ PANIERS ⬚ BOÎTES ⬚ PACKS COMBOS ⬚` en Clash Display italic 2rem `#1A1A1A`, séparés par des carrés vides `⬚`.
- **Animation** : défilement 20s infini ; vitesse légèrement modulée par la vélocité de scroll Lenis (×1 à ×2.5, façon Inside Chanel).

## Section 3 — Chapitre 1 : « Le chaos » (`#chaos`)
- **Layout** : split 50/50 desktop (empilé mobile). Gauche : grande image `chaos-before.jpg` dans un cadre `rounded-3xl` légèrement incliné (−2°). Droite : texte.
- **Contenu** : eyebrow `CHAPITRE 01` · H2 `display-lg` italic : « Tout commence par *un bazar.* » · paragraphe : « Câbles emmêlés, piles de cours, ce tiroir qu'on n'ouvre plus. On connaît. C'est exactement là que KIMIX est né — dans une chambre d'ado de 15 ans. » · petit label flèche « Scroll pour ranger ↓ ».
- **Animation** : l'image entre en clip-path reveal (inset 0 100% 0 0 → 0, 0.9s, trigger 25 % viewport) avec rotation −6°→−2° ; le titre en split mots (stagger 40ms, y 30px) ; le paragraphe fade-up 0.6s. Parallaxe interne de l'image (scale 1.15 → translateY −8 %, scrub).

## Section 4 — Chapitre 2 : « Ça s'assemble » — SECTION PINNÉE SCRUB (`#assemblage`) ★ pièce maîtresse
- **Layout** : section pinnée **250vh** (ScrollTrigger `pin: true`, `scrub: 1`). Viewport divisé : à gauche (40 %) colonne texte verticale avec 3 étapes numérotées ; à droite (60 %) la scène d'assemblage en `1200×1200` cadré fixe.
- **Mécanique** : la progression du scroll (0→1) pilote :
  1. **0→0,33** : `assembly-frame-1.png` → `assembly-frame-2.png` (crossfade + scale 1→1.02). Étape 1 active : `01 · Prends un module` — « Un cube, une brique, un panier. Tout commence par une seule pièce. »
  2. **0,33→0,66** : frames 3→4. Étape 2 : `02 · Clipse-les ensemble` — « Nos clips brevetés relient les modules sans outil, dans tous les sens. »
  3. **0,66→1** : frames 5→6 (étagère finale complète). Étape 3 : `03 · Admire le résultat` — « Une étagère, une tour, un meuble TV : c'est toi qui décides. Et tu peux tout recomposer demain. »
- **Détails visuels** : étapes inactives en `#B4B4B4` à 40 %, l'étape active passe en `#1A1A1A` avec une barre de progression verticale rose `#FFD1F1` qui se remplit (scrub). Progress indicator discret en bas : 3 points, le point actif s'étire en pill.
- **Animation** : tout est scrub-driven (lié au scroll, réversible). Transition entre étapes : texte sortant y −20px opacity→0 (0,15 de progress), entrant y +20px→0. Dépin : la section se détache et le chapitre 3 glisse par-dessus avec un léger effet de rideau.
- **Mobile** : layout empilé, pin conservé à 200vh, scène 100vw carrée, texte sous forme de chips d'étape en bas.
- **Reduced-motion** : pas de pin — les 3 étapes s'affichent en colonne avec la frame finale.

## Section 5 — Chapitre 3 : « L'ordre » (avant/après interactif)
- **Layout** : pleine largeur, titre centré H2 `display-lg` italic : « Le même espace. *Transformé.* » puis un **comparateur avant/après** 16:10 `rounded-3xl` (max-w-6xl centré) superposant `chaos-before.jpg` et `order-after.jpg` avec un **slider draggable** (poignée pill `#1A1A1A`, icônes chevrons, labels « Avant » / « Après » en badges pastel).
- **Contenu sous le comparateur** : 3 mini-stats en ligne : `+2 h` « gagnées chaque semaine à ne plus chercher tes affaires » · `∞` « combinaisons possibles » · `30 j` « pour changer d'avis ».
- **Animation** : titre split mots au scroll (trigger 30 %) ; le slider démarre à 20 % révélé et **s'anime automatiquement jusqu'à 55 %** à l'entrée dans le viewport (1,2s easeInOut) pour inviter au drag ; stats comptées progressivement (count-up 1s, stagger 150ms). Poignée : scale 1.1 au drag, haptic-like bounce au relâchement.

## Section 6 — Collections (3 cartes)
- **Layout** : `py-24`, fond blanc. Header de section : eyebrow `NOS UNIVERS` + H2 « Trois façons de *commencer.* » + lien « Tout voir → » (`/catalogue`). Grille 3 colonnes (1 mobile) de grandes cartes 4:5.
- **Cartes** (ProductCard-like mais éditoriales, lien vers catalogue filtré) :
  1. `collection-cubes.jpg` → « Les Cubes » · « L'unité de base. Empile sans limite. » → `/catalogue?type=cubes`
  2. `collection-etagere.jpg` → « Les Étagères » · « Du sol au plafond, à ta mesure. » → `/catalogue?type=etageres`
  3. `collection-packs.jpg` → « Les Packs » · « Des combos prêts à monter, −15 %. » → `/catalogue?type=packs`
- **Animation** : stagger d'entrée 120ms (y 60px, opacity, 0.7s) ; hover : image zoom 1.06 (0,6s), titre glisse de 8px vers le haut, une flèche `→` apparaît, la carte entière se soulève (shadow signature). Le curseur custom affiche « Explorer ».

## Section 7 — Shop the Look (scènes cliquables) (`#shop-the-look`)
- **Layout** : fond `#C9FCFF` à 35 %, `rounded-3xl` interne au container, `py-24`. Header : eyebrow `SHOP THE LOOK` + H2 « Inspire-toi. *Clique. Achète.* » Carrousel horizontal (scroll-snap + flèches, drag Framer Motion) des 3 scènes `look-1..3.jpg` (7:5, `rounded-2xl`).
- **Mécanique** : chaque scène contient **2–3 points chauds** (hotspots : pastille `#1A1A1A` avec `+` blanc, pulsation douce 2s infini). Clic → popover produit (mini-ProductCard : image, nom, prix, bouton « + Panier »). Exemple look 1 « Le bureau d'ado » : hotspots sur Organisateur de bureau 19 €, Cube rose 24 €, Étagère duo 49 €.
- **Contenu** : sous chaque scène : nom de la scène + « 3 produits · À partir de 19 € » + lien « Voir la sélection ».
- **Animation** : entrée : les scènes arrivent en stagger horizontal (x 80px, opacity, 0.6s) ; hotspots apparaissent en pop séquencé (scale 0→1, stagger 200ms, delay 0.4s) ; popover : spring scale 0.9→1 + fade.

## Section 8 — Best sellers (extrait catalogue)
- **Layout** : fond blanc, header : eyebrow `LES PRÉFÉRÉS` + H2 « Ceux que tout le monde *s'arrache.* » + lien « Voir tout le catalogue → ». Grille 4 ProductCards (2 mobile) : Cube rose, Pack Gaming, Panier gris, Étagère murale duo (données issues du catalogue partagé, avec badges `Best seller`/`Nouveau`).
- **Animation** : reveal stagger 100ms avec `layout` ; les quick add fonctionnent réellement (panier global + toast + pop du compteur navbar).

## Section 9 — Preuve sociale (mur UGC + avis)
- **Layout** : fond `#FFD1F1` pleine largeur, `py-24`. Header centré : eyebrow `ILS ONT RANGÉ LEUR VIE` + H2 « +2 400 intérieurs *transformés.* » · note globale `★ 4,9/5 — 612 avis vérifiés`.
- **Contenu** : mosaïque 4 colonnes (2 mobile) mêlant `ugc-1..4.jpg` et 3 cartes d'avis texte (fond blanc `rounded-2xl`) : ex. *« Mon fils a monté sa tour tout seul. Il range. Tout seul. Je n'y crois toujours pas. »* — Claire, maman de Tom (★★★★★) ; *« Qualité au top, les clips tiennent vraiment. »* — Mehdi (★★★★★) ; *« J'ai recomposé mon meuble 3 fois en déménageant. Zéro casse. »* — Inès (★★★★☆).
- **Animation** : colonnes en parallaxe douce à vitesses alternées (±30px scrub) ; cartes avis : fade-up stagger 80ms ; hover sur photo UGC : zoom 1.05 + badge « @pseudo » qui apparaît.

## Section 10 — Bandeau marque + CTA final
- **Layout** : fond `#1A1A1A`, `py-32`, centré. H2 `display-lg` blanc italic : « Prêt à *tout ranger ?* » (« tout ranger » en rose `#FFD1F1` — exception tolérée car fond sombre : contraste `#FFD1F1` sur `#1A1A1A` ≈ 11:1 ✔).
- **Contenu** : sous-titre gris `#B4B4B4` : « Livraison offerte dès 59 € · Retours 30 jours · Paiement sécurisé » + CTA rose `#FFD1F1` texte `#1A1A1A` « Découvrir le catalogue » (→ `/catalogue`).
- **Animation** : titre reveal au scroll (y 40px, blur 8px→0) ; CTA : pulse d'ombre douce (box-shadow rose, 3s infini) ; hover : fond glisse rose→cyan.

Puis **Footer global** (voir design.md).

---

## Notes techniques
- Ordre ScrollTrigger : refresh après chargement des images (`ScrollTrigger.refresh()` sur `load`).
- Toutes les sections ont du contenu HTML réel (titres sémantiques h1→h2→h3) pour le SEO.
- Le jeu d'empilage du hero est optionnel à l'usage : les CTA restent prioritaires et toujours visibles sans interaction.
