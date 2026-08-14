export type Badge = 'Nouveau' | 'Best seller' | 'Combo −15 %';

export type CouleurNom = 'Rose' | 'Cyan' | 'Blanc' | 'Gris' | 'Mix pastel';

export interface Couleur {
  nom: CouleurNom;
  hex: string;
}

export interface Produit {
  slug: string;
  nom: string;
  prix: number;
  prixBarre?: number;
  type: string;
  pieces: string[];
  couleurs: Couleur[];
  badges: Badge[];
  note: number;
  nbAvis: number;
  images: [string, string];
  dimensions: { largeur: number; profondeur: number; hauteur: number; note?: string };
  description: string;
  contenu: string[];
  compatibleAvec: string[];
  nouveaute: number; // ordre d'arrivée, plus grand = plus récent
}

export const COULEURS: Record<CouleurNom, string> = {
  Rose: '#FFD1F1',
  Cyan: '#C9FCFF',
  Blanc: '#FFFFFF',
  Gris: '#B4B4B4',
  'Mix pastel': 'linear-gradient(135deg,#FFD1F1 0%,#C9FCFF 50%,#B4B4B4 100%)',
};

const c = (nom: CouleurNom): Couleur => ({ nom, hex: COULEURS[nom] });

export const SEUIL_LIVRAISON_OFFERTE = 59;

export const PRODUITS: Produit[] = [
  {
    slug: 'cube-kimix-rose',
    nom: 'Cube KIMIX — Rose',
    prix: 24,
    type: 'Cube',
    pieces: ['Chambre', 'Bureau'],
    couleurs: [c('Rose'), c('Cyan'), c('Blanc'), c('Gris')],
    badges: ['Best seller'],
    note: 4.8,
    nbAvis: 214,
    images: ['/p-cube-rose-1.jpg', '/p-cube-rose-2.jpg'],
    dimensions: { largeur: 30, profondeur: 30, hauteur: 30, note: 'un classeur tient debout' },
    description:
      "Le cube qui a tout déclenché. Conçu dans une chambre d'ado, testé par des centaines de chambres d'ados. Clipse-le à un autre cube, empile-le, retourne-le : il fait étagère, table de nuit ou siège d'appoint.",
    contenu: ['1 cube', '4 clips de connexion', '1 guide de montage (2 min chrono)'],
    compatibleAvec: ['cube-kimix-cyan', 'brique-2x1-blanche', 'panier-tresse-gris', 'organisateur-bureau'],
    nouveaute: 4,
  },
  {
    slug: 'cube-kimix-cyan',
    nom: 'Cube KIMIX — Cyan',
    prix: 24,
    type: 'Cube',
    pieces: ['Chambre', 'Bureau'],
    couleurs: [c('Cyan'), c('Rose'), c('Blanc'), c('Gris')],
    badges: [],
    note: 4.7,
    nbAvis: 96,
    images: ['/p-cube-cyan-1.jpg', '/p-cube-cyan-2.jpg'],
    dimensions: { largeur: 30, profondeur: 30, hauteur: 30, note: 'un classeur tient debout' },
    description:
      "Le même cube, version cyan. Le module de base du système KIMIX : il se clipse dans les 6 directions et se recompose à l'infini.",
    contenu: ['1 cube', '4 clips de connexion', '1 guide de montage'],
    compatibleAvec: ['cube-kimix-rose', 'etagere-murale-duo', 'boite-couvercle-rose', 'panier-tresse-gris'],
    nouveaute: 3,
  },
  {
    slug: 'brique-2x1-blanche',
    nom: 'Brique 2×1 — Blanche',
    prix: 29,
    type: 'Brique',
    pieces: ['Salon', 'Bureau'],
    couleurs: [c('Blanc'), c('Gris')],
    badges: [],
    note: 4.6,
    nbAvis: 58,
    images: ['/p-brique-1.jpg', '/p-brique-2.jpg'],
    dimensions: { largeur: 60, profondeur: 30, hauteur: 30, note: 'deux cubes en un' },
    description:
      "Une brique large qui vaut deux cubes. Idéale comme base de pile, sous un bureau ou en banc d'appoint le long d'un mur.",
    contenu: ['1 brique 2×1', '6 clips de connexion', '1 guide de montage'],
    compatibleAvec: ['cube-kimix-rose', 'cube-kimix-cyan', 'panier-tresse-gris', 'meuble-tv-6'],
    nouveaute: 2,
  },
  {
    slug: 'panier-tresse-gris',
    nom: 'Panier tressé — Gris',
    prix: 19,
    type: 'Panier',
    pieces: ['Salle de bain', 'Entrée'],
    couleurs: [c('Gris'), c('Blanc')],
    badges: [],
    note: 4.9,
    nbAvis: 167,
    images: ['/p-panier-gris-1.jpg', '/p-panier-gris-2.jpg'],
    dimensions: { largeur: 28, profondeur: 28, hauteur: 26, note: 'se glisse dans un cube' },
    description:
      "Le panier ajouré qui se glisse dans n'importe quel cube KIMIX — ou qui vit seul avec ses poignées. Parfait pour les plaids, le linge et tout ce qui traîne.",
    contenu: ['1 panier tressé', '2 poignées', '2 clips de fixation'],
    compatibleAvec: ['cube-kimix-rose', 'cube-kimix-cyan', 'banc-coffre-3', 'brique-2x1-blanche'],
    nouveaute: 5,
  },
  {
    slug: 'etagere-murale-duo',
    nom: 'Étagère murale Duo',
    prix: 49,
    type: 'Étagère',
    pieces: ['Bureau', 'Salon'],
    couleurs: [c('Cyan'), c('Rose'), c('Blanc')],
    badges: ['Nouveau'],
    note: 4.8,
    nbAvis: 41,
    images: ['/p-etagere-1.jpg', '/p-etagere-2.jpg'],
    dimensions: { largeur: 80, profondeur: 22, hauteur: 45, note: 'deux tablettes superposées' },
    description:
      "Deux tablettes modulaires à fixer au mur, réglables en hauteur. Au-dessus d'un bureau, elles libèrent le plan de travail en 10 minutes.",
    contenu: ['2 tablettes', '4 équerres', '1 kit de fixation murale', '1 gabarit de perçage'],
    compatibleAvec: ['cube-kimix-cyan', 'organisateur-bureau', 'boite-couvercle-rose', 'cube-kimix-rose'],
    nouveaute: 11,
  },
  {
    slug: 'tour-4-cubes',
    nom: 'Tour 4 Cubes — Mix',
    prix: 89,
    prixBarre: 104,
    type: 'Combo',
    pieces: ['Chambre', 'Salon'],
    couleurs: [c('Mix pastel')],
    badges: ['Combo −15 %'],
    note: 4.9,
    nbAvis: 203,
    images: ['/p-tour-1.jpg', '/p-tour-2.jpg'],
    dimensions: { largeur: 30, profondeur: 30, hauteur: 122, note: 'une colonne de 4 cubes' },
    description:
      "Quatre cubes rose, cyan, blanc et gris déjà pensés pour monter en colonne. La verticale qui range beaucoup en occupant très peu de sol.",
    contenu: ['4 cubes', '16 clips de connexion', '1 sangle anti-bascule', '1 guide de montage'],
    compatibleAvec: ['panier-tresse-gris', 'boite-couvercle-rose', 'organisateur-bureau', 'etagere-murale-duo'],
    nouveaute: 6,
  },
  {
    slug: 'boite-couvercle-rose',
    nom: 'Boîte à couvercle — Rose',
    prix: 14,
    type: 'Boîte',
    pieces: ['Dressing', 'Bureau'],
    couleurs: [c('Rose'), c('Cyan'), c('Gris')],
    badges: [],
    note: 4.5,
    nbAvis: 73,
    images: ['/p-boite-1.jpg', '/p-boite-2.jpg'],
    dimensions: { largeur: 28, profondeur: 20, hauteur: 14, note: 'trois boîtes par cube' },
    description:
      "La petite boîte à couvercle clipsable qui met de l'ordre à l'intérieur des modules. Empilable, étiquetable, lavable.",
    contenu: ['1 boîte', '1 couvercle clipsable', '2 étiquettes repositionnables'],
    compatibleAvec: ['cube-kimix-rose', 'cube-kimix-cyan', 'etagere-murale-duo', 'organisateur-bureau'],
    nouveaute: 1,
  },
  {
    slug: 'pack-studio',
    nom: 'Pack Studio — 8 pièces',
    prix: 149,
    prixBarre: 176,
    type: 'Pack',
    pieces: ['Salon', 'Chambre'],
    couleurs: [c('Mix pastel')],
    badges: ['Combo −15 %', 'Best seller'],
    note: 4.9,
    nbAvis: 318,
    images: ['/p-pack-studio-1.jpg', '/p-pack-studio-2.jpg'],
    dimensions: { largeur: 120, profondeur: 30, hauteur: 90, note: 'composition libre' },
    description:
      "Huit modules assortis pour équiper un studio d'un coup : cubes, briques, paniers et boîtes. La composition de départ est suggérée, mais c'est toi qui décides.",
    contenu: ['4 cubes', '2 briques 2×1', '1 panier', '1 boîte', '32 clips', '1 guide de composition'],
    compatibleAvec: ['cube-kimix-rose', 'etagere-murale-duo', 'panier-tresse-gris', 'meuble-tv-6'],
    nouveaute: 7,
  },
  {
    slug: 'pack-gaming',
    nom: 'Pack Gaming — 6 pièces',
    prix: 119,
    prixBarre: 140,
    type: 'Pack',
    pieces: ['Bureau', 'Chambre'],
    couleurs: [c('Cyan'), c('Gris')],
    badges: ['Nouveau', 'Combo −15 %'],
    note: 4.8,
    nbAvis: 154,
    images: ['/p-pack-gaming-1.jpg', '/p-pack-gaming-2.jpg'],
    dimensions: { largeur: 90, profondeur: 30, hauteur: 60, note: 'pensé pour un setup' },
    description:
      "Six modules cyan et gris pensés pour un setup : casque, manettes, câbles et jeux trouvent enfin leur place. Passe-câbles intégré.",
    contenu: ['3 cubes', '1 brique 2×1', '1 organisateur', '1 support casque', '24 clips'],
    compatibleAvec: ['organisateur-bureau', 'cube-kimix-cyan', 'etagere-murale-duo', 'boite-couvercle-rose'],
    nouveaute: 12,
  },
  {
    slug: 'organisateur-bureau',
    nom: 'Organisateur de bureau',
    prix: 19,
    type: 'Accessoire',
    pieces: ['Bureau'],
    couleurs: [c('Rose'), c('Cyan'), c('Blanc')],
    badges: ['Best seller'],
    note: 4.7,
    nbAvis: 189,
    images: ['/p-organisateur-1.jpg', '/p-organisateur-2.jpg'],
    dimensions: { largeur: 26, profondeur: 14, hauteur: 10, note: 'stylos debout, câbles rangés' },
    description:
      "Le petit module compartimenté qui vit sur le bureau : stylos, câbles, clés USB. Il se clipse aussi sous une étagère KIMIX pour libérer le plan de travail.",
    contenu: ['1 organisateur 5 compartiments', '2 clips de fixation'],
    compatibleAvec: ['etagere-murale-duo', 'cube-kimix-rose', 'pack-gaming', 'boite-couvercle-rose'],
    nouveaute: 8,
  },
  {
    slug: 'banc-coffre-3',
    nom: 'Banc coffre — 3 modules',
    prix: 99,
    type: 'Combo',
    pieces: ['Entrée', 'Chambre'],
    couleurs: [c('Blanc'), c('Gris')],
    badges: [],
    note: 4.8,
    nbAvis: 66,
    images: ['/p-banc-1.jpg', '/p-banc-2.jpg'],
    dimensions: { largeur: 90, profondeur: 35, hauteur: 42, note: "hauteur d'assise" },
    description:
      "Trois modules alignés, un coussin gris par-dessus : le banc d'entrée où l'on s'assoit pour mettre ses chaussures — et où les chaussures rentrent enfin.",
    contenu: ['3 modules ouverts', '1 coussin d’assise gris', '12 clips', '4 patins antidérapants'],
    compatibleAvec: ['panier-tresse-gris', 'brique-2x1-blanche', 'boite-couvercle-rose', 'cube-kimix-rose'],
    nouveaute: 9,
  },
  {
    slug: 'meuble-tv-6',
    nom: 'Meuble TV — 6 modules',
    prix: 169,
    prixBarre: 199,
    type: 'Pack',
    pieces: ['Salon'],
    couleurs: [c('Blanc'), c('Gris')],
    badges: ['Combo −15 %'],
    note: 4.9,
    nbAvis: 87,
    images: ['/p-meuble-tv-1.jpg', '/p-meuble-tv-2.jpg'],
    dimensions: { largeur: 180, profondeur: 35, hauteur: 45, note: 'enfilade basse' },
    description:
      "Une enfilade basse blanche et grise composée de six modules. Elle porte la TV, avale la console, les manettes et les câbles — et se recompose au prochain déménagement.",
    contenu: ['4 briques 2×1', '2 cubes', '30 clips', '1 passe-câbles', '1 guide de composition'],
    compatibleAvec: ['brique-2x1-blanche', 'panier-tresse-gris', 'pack-studio', 'cube-kimix-cyan'],
    nouveaute: 10,
  },
];

export function getProduit(slug: string) {
  return PRODUITS.find((p) => p.slug === slug);
}

/** Familles de filtre « Type » telles qu'affichées dans la sidebar catalogue */
export const FAMILLES: { label: string; types: string[] }[] = [
  { label: 'Cubes', types: ['Cube'] },
  { label: 'Briques', types: ['Brique'] },
  { label: 'Étagères', types: ['Étagère'] },
  { label: 'Paniers & Boîtes', types: ['Panier', 'Boîte'] },
  { label: 'Packs & Combos', types: ['Pack', 'Combo'] },
  { label: 'Accessoires', types: ['Accessoire'] },
];

export const PIECES = ['Chambre', 'Bureau', 'Salon', 'Entrée', 'Salle de bain', 'Dressing'];

export const COULEURS_FILTRE: CouleurNom[] = ['Rose', 'Cyan', 'Gris', 'Blanc', 'Mix pastel'];

/** Chips de raccourci en tête de catalogue → familles */
export const CHIPS: { label: string; famille: string | null; slug: string }[] = [
  { label: 'Tout', famille: null, slug: 'tout' },
  { label: 'Cubes', famille: 'Cubes', slug: 'cubes' },
  { label: 'Étagères', famille: 'Étagères', slug: 'etageres' },
  { label: 'Paniers & Boîtes', famille: 'Paniers & Boîtes', slug: 'paniers' },
  { label: 'Packs & Combos', famille: 'Packs & Combos', slug: 'packs' },
  { label: 'Bureau', famille: null, slug: 'bureau' },
];
