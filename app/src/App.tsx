import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Layout from '@/components/Layout';
import CustomCursor from '@/components/CustomCursor';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/Toast';
import Home from '@/pages/Home';
import Catalogue from '@/pages/Catalogue';
import Produit from '@/pages/Produit';
import Concept from '@/pages/Concept';

gsap.registerPlugin(ScrollTrigger);

/** Scroll doux global (Lenis) synchronisé avec GSAP ScrollTrigger */
function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}

/** Remonte en haut à chaque navigation + gère les ancres (#hash) */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const t = window.setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  useLenis();
  return (
    <ToastProvider>
      <CartProvider>
        <ScrollManager />
        <CustomCursor />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/produit/:slug" element={<Produit />} />
            <Route path="/concept" element={<Concept />} />
          </Routes>
        </Layout>
      </CartProvider>
    </ToastProvider>
  );
}
