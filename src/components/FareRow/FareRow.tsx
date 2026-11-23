import { formatPrice, type Fare } from "../../mocks/flights";
import styles from "./FareRow.module.css";

type FareRowProps = {
  fare: Fare;
  selected: boolean;
  onSelect: () => void;
};

/** Ligne de tarif dans une carte vol dépliée */
export function FareRow({ fare, selected, onSelect }: FareRowProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={`${styles.row} ${selected ? styles.selected : ""}`}
      onClick={onSelect}
    >
      <span className={styles.texts}>
        <span className={styles.name}>{fare.name}</span>
        <span className={styles.description}>{fare.description}</span>
      </span>
      <span className={styles.price}>{formatPrice(fare.price)}</span>
    </button>
  );
}
