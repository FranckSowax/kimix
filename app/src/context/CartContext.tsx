import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { PRODUITS, SEUIL_LIVRAISON_OFFERTE } from '@/data/products';
import type { Produit } from '@/data/products';
import { CartContext } from '@/context/cart-context';
import type { CartApi, LignePanier } from '@/context/cart-context';
import { useToast } from '@/context/toast-context';

export function CartProvider({ children }: { children: ReactNode }) {
  const [lignes, setLignes] = useState<LignePanier[]>([]);
  const [drawerOuvert, setDrawerOuvert] = useState(false);
  const [dernierAjout, setDernierAjout] = useState(0);
  const { toast } = useToast();

  const ajouter = useCallback(
    (produit: Produit, couleur: string, quantite = 1) => {
      setLignes((prev) => {
        const i = prev.findIndex((l) => l.slug === produit.slug && l.couleur === couleur);
        if (i === -1) return [...prev, { slug: produit.slug, couleur, quantite }];
        const copie = [...prev];
        copie[i] = { ...copie[i], quantite: copie[i].quantite + quantite };
        return copie;
      });
      setDernierAjout((n) => n + 1);
      toast('Ajouté au panier ✓');
    },
    [toast],
  );

  const changerQuantite = useCallback((slug: string, couleur: string, delta: number) => {
    setLignes((prev) =>
      prev
        .map((l) =>
          l.slug === slug && l.couleur === couleur ? { ...l, quantite: l.quantite + delta } : l,
        )
        .filter((l) => l.quantite > 0),
    );
  }, []);

  const retirer = useCallback((slug: string, couleur: string) => {
    setLignes((prev) => prev.filter((l) => !(l.slug === slug && l.couleur === couleur)));
  }, []);

  const value = useMemo<CartApi>(() => {
    const nbArticles = lignes.reduce((n, l) => n + l.quantite, 0);
    const sousTotal = lignes.reduce((somme, l) => {
      const p = PRODUITS.find((x) => x.slug === l.slug);
      return somme + (p ? p.prix * l.quantite : 0);
    }, 0);
    return {
      lignes,
      nbArticles,
      sousTotal,
      resteLivraisonOfferte: Math.max(0, SEUIL_LIVRAISON_OFFERTE - sousTotal),
      drawerOuvert,
      dernierAjout,
      ouvrirDrawer: () => setDrawerOuvert(true),
      fermerDrawer: () => setDrawerOuvert(false),
      ajouter,
      changerQuantite,
      retirer,
    };
  }, [lignes, drawerOuvert, dernierAjout, ajouter, changerQuantite, retirer]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
