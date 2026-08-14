# KIMIX — Page Concept (`/concept`)

Page marque / storytelling : l'histoire d'un ado de 15 ans et de son père, le système modulaire expliqué, les engagements. Références : Inside Chanel (chapitrage façon musée), Patagonia (storytelling authentique). Ton : sincère, familial, un brin espiègle. Sert de destination au lien navbar « Concept » et au CTA « Voir le concept » de la home.

---

## Section 1 — Hero éditorial
- **Layout** : `pt-32 pb-20`, centré, max-w-4xl. Fond blanc avec deux formes pastel floues en arrière-plan (rose haut-gauche, cyan bas-droite, blur 100px, parallaxe légère).
- **Contenu** : eyebrow `NOTRE HISTOIRE` · H1 `display-lg` Clash italic : « Né dans une chambre d'ado de *15 ans.* » · intro body-lg `#4A4A4A` : « KIMIX, c'est l'histoire de Loan, 15 ans, qui en avait marre du bazar — et de son père, qui en avait marre de lui répéter de ranger. Ensemble, ils ont inventé un rangement qu'on a envie d'utiliser : des modules qui se clipsent comme des Lego. »
- **Animation** : H1 split caractères (stagger 20ms, y 50px, rotate 3°) au load ; formes pastel : flottement idle + parallaxe scroll ±40px.

## Section 2 — Portrait des fondateurs
- **Layout** : split 55/45. Gauche : grande photo `founders.jpg` `rounded-3xl` (16:10) avec légende polaroid superposée en bas à droite (carte blanche inclinée −3°, ombre douce) : « Loan & son père, dans le garage où tout a commencé. » Droite : texte.
- **Contenu** : H2 italic « Un père, un fils, *un clip.* » · paragraphes : la première étagère en carton, les prototypes imprimés en 3D, la première vente au lycée, aujourd'hui 2 400 intérieurs transformés. Signature manuscrite simulée : « — Loan & David » en Clash italic rose sur pastille (logo déclinaison).
- **Animation** : photo : clip-path reveal + rotation 3°→0 (trigger 25 %) ; polaroid : pop (scale 0.6→1, spring, delay 0.5s) ; texte : split mots + paragraphes fade-up stagger 150ms.

## Section 3 — Anatomie d'un module (exploded view)
- **Layout** : fond `#C9FCFF` à 40 %, `rounded-3xl` in-container, `py-24`. Split inversé : gauche texte, droite `exploded-module.png` (vue éclatée 3D).
- **Contenu** : eyebrow `LE SYSTÈME` · H2 italic : « Simple comme *un clip.* » · 3 points numérotés (comme la home, cohérence visuelle) : `01 · Des panneaux en PP recyclé à 60 %` — légers, costauds, d'un coup d'éponge · `02 · Des clips brevetés sans outil` — connexion dans les 6 directions, testée 10 000 clipsages · `03 · Un système qui grandit avec toi` — achète un cube aujourd'hui, un pack demain, tout reste compatible.
- **Animation** : les couches de la vue éclatée **se recomposent au scroll** (scrub : les panneaux glissent de leurs offsets éclatés vers l'assemblage final sur 120 % de la hauteur de section) ; points numérotés : activation séquentielle (gris 40 % → encre) liée au scrub ; fallback reduced-motion : image assemblée + points statiques.

## Section 4 — Chiffres animés
- **Layout** : fond `#1A1A1A`, `py-24`, grille 4 colonnes (2 mobile) centrées.
- **Contenu** (count-up, Clash italic 3.5rem blanc + label small `#B4B4B4`) : `2 400+` intérieurs transformés · `18 000` modules expédiés · `10 000` clipsages testés en labo (le garage) · `4,9/5` de note moyenne.
- **Animation** : count-up 1,5s au scroll (trigger 40 %, stagger 120ms) avec easeOutExpo ; les chiffres gagnent un surlignage rose/cyan alterné derrière eux (scaleX 0→1 retardé).

## Section 5 — Atelier & matière (galerie duo)
- **Layout** : 2 images côte à côte (`workshop-1.jpg`, `workshop-2.jpg`, 4:5, `rounded-3xl`), légèrement décalées verticalement (parallaxe). Texte court centré dessous : « Chaque module est vérifié à la main avant de partir. Oui, même ceux du pack Gaming. »
- **Animation** : parallaxe différentielle (y −40px / +40px, scrub) ; reveal clip-path latéral gauche/droite en miroir.

## Section 6 — Engagements
- **Layout** : grille 3 cartes blanches bordure `#E8E8E8` `rounded-2xl` : `Recycle` **Matière responsable** — 60 % de plastique recyclé, 100 % recyclable · `Wrench` **Réparable à vie** — un clip casse ? On t'en renvoie un, gratuitement · `HeartHandshake` **Entreprise familiale** — pas d'actionnaires, juste un père, un fils, et un garage.
- **Animation** : stagger 120ms (y 50px, rotate 1°→0) ; hover : carte se soulève, icône fait un wiggle (rotate ±8°, 400ms).

## Section 7 — CTA final
- **Layout** : centré `py-28`, fond dégradé blanc→rose `#FFD1F1`. H2 `display-lg` italic : « Envie de *clipser* ? » + 2 CTA : primaire encre « Explorer le catalogue » + secondaire outline « Voir les packs ».
- **Animation** : titre blur-in (blur 10px→0, y 30px) ; CTA stagger 100ms.

Puis **Footer global**.

---

## Notes techniques
- Page légère : pas de pin, un seul effet scrub (exploded view) ; parallaxes douces uniquement.
- Le chapitrage reprend les codes de la home (eyebrows numérotés, H2 italiques à surlignage pastel) pour une continuité narrative home → concept.
