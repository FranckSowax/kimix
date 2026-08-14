# KIMIX — Page Produit (`/produit/[slug]`)

PDP moderne façon Shopify Plus. Références : Feum (plans cotés, sticky add-to-cart), Baymard (photos à l'échelle, expliquer chaque dimension, montrer les composants inclus), Burrow/Montana (modules compatibles, pricing transparent). Exemple fil conducteur : **Cube KIMIX — Rose (24 €)** ; la page est pilotée par les données du produit (même `products.ts` que le catalogue).

---

## Section 1 — Galerie + Buy box (au-dessus de la ligne de flottaison)
- **Layout** : `pt-28 pb-16`, grille 2 colonnes desktop (galerie 55 % / buy box 45 %), empilé mobile. Fil d'Ariane micro en haut : `Accueil / Catalogue / Cubes / Cube KIMIX — Rose`.
- **Galerie (gauche)** :
  - Image principale 4:5 `rounded-3xl` sur fond studio pastel assorti à la couleur choisie (`p-cube-rose-1.jpg`). Changer de variante couleur **change le fond studio** (rose `#FFD1F1` ↔ cyan `#C9FCFF` ↔ gris `#EFEFEF` ↔ blanc cassé, transition 400ms).
  - 3 vignettes sous l'image : vue studio, vue en situation (`p-cube-rose-2.jpg`), plan coté (`plan-cote-cube.svg`). Clic = swap avec crossfade 250ms + bordure `#1A1A1A` sur la vignette active.
  - Badge produit en haut à gauche de l'image (`Best seller` cyan).
  - **Animation** : entrée : image principale clip-path reveal (inset bas→haut, 0.8s) ; vignettes stagger 80ms fade-up ; swap : crossfade + léger scale 1.02→1.
- **Buy box (droite, sticky `top: 100px` desktop)** :
  - Note : ★★★★★ `4,8` + lien « 214 avis » (ancre vers section avis, smooth scroll Lenis).
  - H1 `h1` Clash italic : « Cube KIMIX — *Rose* ».
  - Prix : `24 €` en 700, 1.5rem (+ prix barré gris si promo) + micro « TVA incluse · Livraison offerte dès 59 € ».
  - **Sélecteur couleur** : 4 swatches ronds 32px (Rose/Cyan/Blanc/Gris) + label « Couleur : Rose ». Sélection : anneau `#1A1A1A` animé (scale 0.8→1 spring) ; le libellé et le fond galerie se mettent à jour.
  - **Dimensions en clair** (Baymard : expliquer chaque chiffre) : pastilles grises `#F5F5F5` : `30 cm de large — un classeur tient debout` · `30 cm de profond` · `30 cm de haut` + lien « Voir le plan coté » (swap vers la vignette plan).
  - **Stepper quantité** (− / 1 / +, bordures `#E8E8E8`) + **CTA principal** pleine largeur fond `#1A1A1A` : « Ajouter au panier — 24 € » (le prix se met à jour avec la quantité).
  - CTA secondaire outline : « Ajouter à ma wishlist » (icône cœur, toggle rempli rose au clic).
  - Réassurance en 3 lignes small avec icônes : `Truck` Expédition sous 48 h · `RotateCcw` Retours 30 jours · `Puzzle` Compatible avec tous les modules KIMIX.
  - **Animation** : buy box : entrée stagger 60ms (y 24px) ; CTA : hover fond glisse encre→dégradé rose/cyan ; à l'ajout : le bouton affiche « ✓ Ajouté ! » 1,2s (fond passe `#C9FCFF` texte `#1A1A1A`), toast, pop du compteur navbar, ouverture du **Cart Drawer** après 400ms.

## Section 2 — Sticky add-to-cart bar
- **Layout** : apparaît en bas d'écran (hauteur 64px, fond blanc backdrop-blur, hairline haute) dès que la buy box sort du viewport (IntersectionObserver). Miniature 48px + nom + prix + bouton « Ajouter — 24 € » fond `#1A1A1A`.
- **Animation** : slide-up y 100 %→0 (spring damping 25) à l'apparition, symétrique à la sortie.

## Section 3 — Onglets / accordéons descriptifs
- **Layout** : max-w-3xl centré, `py-16`. Accordéons shadcn (ouverts : Description).
  1. **Description** : « Le cube qui a tout déclenché. Conçu dans une chambre d'ado, testé par des centaines de chambres d'ados. Clipse-le à un autre cube, empile-le, retourne-le : il fait étagère, table de nuit ou siège d'appoint. » + liste à puces : PP recyclé 60 % · Clips brevetés sans outil · Charge max 15 kg · Nettoyage d'un coup d'éponge.
  2. **Dimensions & contenu** : le plan coté `plan-cote-cube.svg` grand format + « Dans la boîte : 1 cube, 4 clips de connexion, 1 guide de montage (2 min chrono) ».
  3. **Livraison & retours** : délais, livraison offerte dès 59 €, retours gratuits 30 jours.
- **Animation** : ouverture accordéon : height auto spring + chevron rotate 180° ; entrée de section : fade-up.

## Section 4 — « Combine-le avec » (modules compatibles) ★
- **Layout** : fond `#C9FCFF` à 35 %, `rounded-3xl` in-container, `py-20`. H2 italic : « *Clipse-le* avec… » + carrousel horizontal de 4 ProductCards compatibles (champ `compatibleAvec` : Cube cyan, Brique 2×1, Panier gris, Organisateur bureau).
- **Plus signature** : une **visualisation combo** à gauche du carrousel (desktop) : les silhouettes des modules qui s'emboîtent schématiquement (carrés pastel qui glissent et s'assemblent en boucle 4s, SVG animé) avec le prix combiné : « Cube + Brique = 53 € · −10 % en combo ».
- **Animation** : assemblage SVG en loop (y offsets stagger, easeInOut) ; cartes : stagger 80ms + quick add fonctionnel.

## Section 5 — Avis clients (`#avis`)
- **Layout** : `py-20`, grille : colonne gauche (30 %) résumé — gros `4,8` display + étoiles + « 214 avis vérifiés » + barres de répartition 5★→1★ (barres `#E8E8E8` remplies `#1A1A1A`, largeur animée au scroll) ; colonne droite (70 %) : 3 avis détaillés (carte blanche `rounded-2xl`, étoiles, titre gras, texte, « Achat vérifié » badge cyan, date, utile 👍 compteur cliquable).
- **Contenu exemple** : *« Parfait pour les mangas de mon fils »* ★★★★★ · *« Clipser deux cubes prend 10 secondes »* ★★★★★ · *« Un peu plus petit que prévu mais très solide »* ★★★★☆.
- **Animation** : barres de répartition scaleX 0→1 (origine gauche, stagger 100ms, trigger 40 %) ; avis : fade-up stagger 120ms ; bouton « Charger plus d'avis » (simulé).

## Section 6 — Réassurance + Footer
- Bandeau 3 colonnes identique au catalogue (livraison / retours / paiement) puis **Footer global**.

---

## Notes techniques
- Routes dynamiques par `slug` ; produit inconnu → redirection douce vers `/catalogue` avec toast « Produit introuvable ».
- La variante couleur sélectionnée est conservée quand on vient du catalogue (state ou query param `?couleur=cyan`).
- Toutes les images produits en `loading="lazy"` sauf la principale (eager, `fetchpriority="high"`).
- Reduced-motion : swaps d'images instantanés, pas de parallaxe, sticky bar sans spring.
