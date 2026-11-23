import { formatPrice, type Day } from "../../mocks/flights";
import { Skeleton } from "../Skeleton/Skeleton";
import styles from "./DateTabs.module.css";

type DateTabsProps = {
  days: Day[];
  selectedIso?: string;
  onSelect?: (iso: string) => void;
  /** Identifiant de la liste mise à jour par la sélection */
  controls?: string;
  loading?: boolean;
};

const SKELETON_COUNT = 6;

export function DateTabs({ days, selectedIso, onSelect, controls, loading = false }: DateTabsProps) {
  if (loading) {
    return (
      <div className={styles.strip} aria-hidden="true">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <span key={index} className={`${styles.tab} ${styles.skeletonTab} ${index === 2 ? styles.skeletonSelected : ""}`}>
            <Skeleton slot="tabDay" className={styles.skDay} />
            <Skeleton slot="tabPrice" className={styles.skPrice} />
          </span>
        ))}
      </div>
    );
  }

  return (
    <ul className={styles.strip} aria-label="Choisir une date de départ">
      {days.map((day) => {
        const selected = day.iso === selectedIso;
        return (
          <li key={day.iso} className={styles.item}>
            <button
              type="button"
              className={`${styles.tab} ${selected ? styles.selected : ""}`}
              aria-pressed={selected}
              aria-controls={controls}
              aria-label={`${day.weekdayLong} ${day.dayOfMonth} ${day.monthLong}, dès ${formatPrice(day.minPrice)}`}
              onClick={() => onSelect?.(day.iso)}
            >
              <span className={styles.day}>
                {day.weekdayShort} {day.dayOfMonth}
              </span>
              <span className={styles.price}>{formatPrice(day.minPrice, false)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
