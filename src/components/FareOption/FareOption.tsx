import type { ReactNode } from "react";
import waveLeft from "../../assets/icons/fare-wave-left.svg";
import waveRight from "../../assets/icons/fare-wave-right.svg";
import styles from "./FareOption.module.css";

type FareOptionProps = {
  /** "from" : libellé + prix. "split" : prix seul avec la vague décorative. */
  variant: "from" | "split";
  wave?: "left" | "right";
  children: ReactNode;
};

/** Pavé de prix à droite de la carte vol */
export function FareOption({ variant, wave, children }: FareOptionProps) {
  return (
    <span className={`${styles.option} ${styles[variant]}`}>
      {children}
      {wave === "left" && <img src={waveLeft} alt="" width={139.852} height={32} className={styles.waveLeft} aria-hidden="true" />}
      {wave === "right" && <img src={waveRight} alt="" width={139.852} height={32} className={styles.waveRight} aria-hidden="true" />}
    </span>
  );
}

export function FareLabel({ children }: { children: ReactNode }) {
  return <span className={styles.label}>{children}</span>;
}

export function FarePrice({ children, fixed = false }: { children: ReactNode; fixed?: boolean }) {
  return <span className={`${styles.price} ${fixed ? styles.fixed : ""}`}>{children}</span>;
}
