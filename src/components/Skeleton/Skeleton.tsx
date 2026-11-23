import { useLayoutEffect, useRef } from "react";
import styles from "./Skeleton.module.css";

export type SkeletonSlot =
  | "departure" | "arrival" | "duration" | "direct" | "badge"
  | "fareLabel" | "farePrice" | "farePriceAlt"
  | "chipTravellers" | "chipLuggage"
  | "title" | "subtitle" | "statusTime" | "dividerLabel"
  | "tabDay" | "tabPrice";

type SkeletonProps = {
  slot: SkeletonSlot;
  tone?: "light" | "dark";
  /** Permet au parent d'ajuster la largeur (--sk-width) */
  className?: string;
};

/**
 * Barre de chargement qui reprend l'emprise d'un texte de la maquette.
 * La vague de brillance descend l'écran : son délai dépend de la position verticale.
 */
export function Skeleton({ slot, tone = "light", className = "" }: SkeletonProps) {
  const ref = useWaveDelay<HTMLSpanElement>();
  return (
    <span className={`${styles.line} ${styles[slot]} ${className}`} aria-hidden="true">
      <span ref={ref} className={`${styles.bar} ${styles[tone]}`} />
    </span>
  );
}

type SkeletonShapeProps = {
  className: string;
  tone?: "light" | "dark";
};

/** Forme libre (icône de la barre d'état, bouton retour) */
export function SkeletonShape({ className, tone = "dark" }: SkeletonShapeProps) {
  const ref = useWaveDelay<HTMLSpanElement>();
  return <span ref={ref} aria-hidden="true" className={`${styles.shape} ${styles[tone]} ${className}`} />;
}

function useWaveDelay<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const screen = el.closest("[data-skeleton-root]") ?? document.body;
    const y = el.getBoundingClientRect().top - screen.getBoundingClientRect().top;
    el.style.setProperty("--sk-y", String(Math.max(0, Math.round(y))));
  }, []);
  return ref;
}

