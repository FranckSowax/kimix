import { createContext, useContext } from 'react';
import type { Produit } from '@/data/products';

export interface LignePanier {
  slug: string;
  couleur: string;
  quantite: number;
}

export interface CartApi {
  lignes: LignePanier[];
  nbArticles: number;
  sousTotal: number;
  resteLivraisonOfferte: number;
  drawerOuvert: boolean;
  dernierAjout: number;
  ouvrirDrawer: () => void;
  fermerDrawer: () => void;
  ajouter: (produit: Produit, couleur: string, quantite?: number) => void;
  changerQuantite: (slug: string, couleur: string, delta: number) => void;
  retirer: (slug: string, couleur: string) => void;
}

export const CartContext = createContext<CartApi | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans un <CartProvider>');
  return ctx;
}
