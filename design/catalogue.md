# KIMIX — Page Catalogue (`/catalogue`)

PLP ultra moderne « façon Shopify Plus ». Références : Gymshark (quick add, efficacité), Blueland (sidebar filtres + tri à droite, badges, quick add), Kith (toggle d'expérience), Montana Furniture (filtres par dimensions/couleur/type), Baymard (seconde image au hover, avis affichés, load more plutôt qu'infinite scroll). Objectif : trouver et ajouter au panier en moins de 10 secondes.

---

## Données produits (12 produits simulés — `products.ts` partagé)

| # | Slug | Nom | Prix | Type | Pièce | Couleurs | Badges | Note (avis) |
|---|---|---|---|---|---|---|---|---|
| 1 | `cube-kimix-rose` | Cube KIMIX — Rose | 24 € | Cube | Chambre, Bureau | Rose, Cyan, Blanc, Gris | Best seller | 4,8 (214) |
| 2 | `cube-kimix-cyan` | Cube KIMIX — Cyan | 24 € | Cube | Chambre, Bureau | Cyan, Rose, Blanc, Gris | — | 4,7 (96) |
| 3 | `brique-2x1-blanche` | Brique 2×1 — Blanche | 29 € | Brique | Salon, Bureau | Blanc, Gris | — | 4,6 (58) |
| 4 | `panier-tresse-gris` | Panier tressé — Gris | 19 € | Panier | Salle de bain, Entrée | Gris, Blanc | — | 4,9 (167) |
| 5 | `etagere-murale-duo` | Étagère murale Duo | 49 € | Étagère | Bureau, Salon | Cyan/Blanc, Rose/Blanc | Nouveau | 4,8 (41) |
| 6 | `tour-4-cubes` | Tour 4 Cubes — Mix | 89 € (104 € barré) | Combo | Chambre, Salon | Mix pastel | Combo −15 % | 4,9 (203) |
| 7 | `boite-couvercle-rose` | Boîte à couvercle — Rose | 14 € | Boîte | Dressing, Bureau | Rose, Cyan, Gris | — | 4,5 (73) |
| 8 | `pack-studio` | Pack Studio — 8 pièces | 149 € (176 € barré) | Pack | Salon, Chambre | Mix pastel | Combo −15 %, Best seller | 4,9 (318) |
| 9 | `pack-gaming` | Pack Gaming — 6 pièces | 119 € (140 € barré) | Pack | Bureau, Chambre | Cyan/Gris | Nouveau, Combo −15 % | 4,8 (154) |
| 10 | `organisateur-bureau` | Organisateur de bureau | 19 € | Accessoire | Bureau | Rose, Cyan, Blanc | Best seller | 4,7 (189) |
| 11 | `banc-coffre-3` | Banc coffre — 3 modules | 99 € | Combo | Entrée, Chambre | Blanc/Gris | — | 4,8 (66) |
| 12 | `meuble-tv-6` | Meuble TV — 6 modules | 169 € (199 € barré) | Pack | Salon | Blanc/Gris | Combo −15 % | 4,9 (87) |

Chaque produit : `slug, nom, prix, prixBarre?, type, pieces[], couleurs[], badges[], note, nbAvis, images[2], dimensions, description, compatibleAvec[slugs]`. Livraison offerte dès 59 €.

---

## Section 1 — En-tête de page
- **Layout** : fond `#C9FCFF` à 40 % (ou rose si `?type=` filtre actif → léger tint), `pt-28 pb-12` (sous la navbar). Container standard.
- **Contenu** : fil d'Ariane micro (`Accueil / Catalogue`) · H1 `h1` Clash italic : « Le *catalogue* » · sous-titre body-lg `#4A4A4A` : « 12 modules et packs. Une infinité de combinaisons. Tout se clipse, tout se recompose. » · **chips de catégories rapides** (pills cliquables) : `Tout` · `Cubes` · `Étagères` · `Paniers & Boîtes` · `Packs & Combos` · `Bureau`. Chip active : fond `#1A1A1A` texte blanc ; inactives : fond blanc bordure `#E8E8E8`.
- **Animation** : entrée au load : H1 split mots (y 30px, stagger 60ms) → sous-titre fade-up → chips stagger 50ms (scale 0.9→1 + fade). Changement de chip : grille re-filtrée avec layout animation Framer Motion (cartes sortantes scale 0.9+fade 200ms, entrantes stagger 40ms).

## Section 2 — Barre d'outils sticky
- **Layout** : sticky sous la navbar (`top: 72px`, z-30), fond blanc backdrop-blur, hairline basse. Contient :
  - Gauche : bouton « Filtres » (icône sliders) avec **compteur de filtres actifs** en badge rose — sur desktop il replie/affiche la sidebar ; sur mobile ouvre un **bottom sheet**.
  - Centre : **compteur de résultats** live : « 12 produits » (se met à jour au filtrage, petit flip numérique).
  - Droite : **tri** (Select shadcn) : `Nos recommandations` · `Prix croissant` · `Prix décroissant` · `Nouveautés` · `Meilleures notes` + **toggle d'affichage** (icônes grille dense/aérée, façon Kith : 4 col ↔ 3 col desktop).
- **Animation** : la barre gagne son ombre/hairline après 10px de scroll ; changement de tri : skeleton flash 300ms puis réorganisation animée (`layout`).

## Section 3 — Corps : Sidebar filtres + Grille

### Sidebar filtres (desktop, sticky `top: 140px`, largeur 260px)
Groupes en accordéons (ouverts par défaut : Type, Couleur) :
1. **Type de module** (checkboxes + compteurs) : Cubes (2) · Briques (1) · Étagères (1) · Paniers & Boîtes (2) · Packs & Combos (4) · Accessoires (2)
2. **Pièce** : Chambre · Bureau · Salon · Entrée · Salle de bain · Dressing
3. **Couleur** : swatches ronds 24px (Rose `#FFD1F1`, Cyan `#C9FCFF`, Gris `#B4B4B4`, Blanc — bordure `#E8E8E8`, tick `#1A1A1A` quand actif) + Mix
4. **Prix** : slider double (shadcn Slider) 0–200 € avec labels live « 0 € — 200 € »
5. **Promos uniquement** : switch toggle
- Footer de sidebar : « Réinitialiser tout » (lien souligné, visible seulement si ≥1 filtre actif).
- **Mobile** : bottom sheet (drawer shadcn) avec les mêmes filtres, poignée de drag, CTA sticky « Voir les X résultats » qui se met à jour en direct.
- **Animation** : coche checkbox : tick dessiné (stroke-dashoffset 200ms) ; sliders/swatches : scale 1.1 au tap ; application des filtres : grille en `layout` animation + compteur flip ; sidebar repliable avec glissement x ±260px.

### Grille produits
- **Layout** : 4 col (≥1280px) / 3 col (768–1279) / **2 col mobile** ; gap 24px desktop, 12px mobile. Mode « aéré » (toggle) : 3 col desktop, images plus grandes.
- **Cartes** : `ProductCard` globale (design.md §5) — seconde image au hover, quick add glissant, badges pastel, note + nb avis, swatches variantes, prix barré si promo.
- **États** :
  - **Chargement/filtrage** : 8 skeletons (shimmer gris) à la place des cartes, 400ms min.
  - **Vide** : illustration texte « ⬚ Aucun module ne matche. » + bouton « Réinitialiser les filtres » fond `#1A1A1A`.
  - **Load more** : 8 produits affichés initialement, bouton « Charger plus (4 restants) » outline `#1A1A1A` centré + barre de progression « Vous avez vu 8 produits sur 12 » (Baymard). Lazy-load des images (`loading="lazy"`). **Pas d'infinite scroll pur.**
- **Animation** : révélation initiale stagger 60ms (y 40px, opacity) via `whileInView` ; hover carte : voir ProductCard (image crossfade+zoom, quick add slide-up 250ms, ombre signature, curseur custom « Voir ») ; ajout panier : bouton quick add → état « ✓ Ajouté » 1,2s + toast + pop compteur.

## Section 4 — Bandeau réassurance (fin de grille)
- **Layout** : 3 colonnes fond blanc, hairline haute : icône Lucide + titre small bold + texte small `#4A4A4A`.
- **Contenu** : `Truck` Livraison offerte dès 59 € (2–4 jours ouvrés) · `RotateCcw` Retours 30 jours gratuits · `ShieldCheck` Paiement 100 % sécurisé.
- **Animation** : fade-up stagger 100ms au scroll.

## Section 5 — « Complète ton setup » (upsell éditorial)
- **Layout** : fond `#FFD1F1` à 35 %, `rounded-3xl` in-container, `py-16`. H2 `h2` italic : « Les *combinaisons* qui cartonnent » + carrousel horizontal (scroll-snap, flèches) de 4 ProductCards contextuelles (Tour 4 cubes, Pack Studio, Pack Gaming, Banc coffre — les combos).
- **Contenu** : chaque carte combo porte le badge `Combo −15 %` et un micro-texte « 4 modules · économise 15 € ».
- **Animation** : entrée x 60px stagger ; carrousel : drag Framer Motion avec inertie, snap magnétique.

Puis **Footer global**.

---

## Interactions transverses de la page
- **Recherche modale** (icône navbar) : plein écran fond blanc, input géant Clash italic « Recherche un module… », suggestions live filtrées sur les 12 produits (nom/type), résultats en mini-cartes ; fermeture `Échap` ou croix ; ouverture/fermeture : clip-path circle expand 400ms.
- **Persistance filtres** dans l'URL (`?type=cubes&couleur=rose`) — les liens collections de la home arrivent pré-filtrés.
- **Accessibilité** : filtres navigables au clavier, `aria-live="polite"` sur le compteur de résultats, focus visible sur toutes les cartes, quick add activable au clavier (visible au focus).
