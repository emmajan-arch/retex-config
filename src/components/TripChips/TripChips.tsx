import { Skeleton, type SkeletonSlot } from "../Skeleton/Skeleton";
import styles from "./TripChips.module.css";

type TripChipsProps = {
  items: string[];
  loading?: boolean;
};

const SKELETON_SLOTS: SkeletonSlot[] = ["chipTravellers", "chipLuggage"];

/** Récapitulatif du voyage (voyageurs, bagages) */
export function TripChips({ items, loading = false }: TripChipsProps) {
  return (
    <div className={styles.row}>
      <ul className={styles.list} aria-label="Votre voyage">
        {items.map((item, index) => (
          <li key={item} className={styles.chip}>
            {loading ? <Skeleton slot={SKELETON_SLOTS[index] ?? "chipLuggage"} /> : item}
          </li>
        ))}
      </ul>
    </div>
  );
}
