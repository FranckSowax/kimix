import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Prix formaté à la française : 24 € / 1 149 € */
export function formatPrix(valeur: number) {
  return `${valeur.toLocaleString('fr-FR')} €`;
}

/** Note formatée à la française : 4,8 */
export function formatNote(note: number) {
  return note.toFixed(1).replace('.', ',');
}
