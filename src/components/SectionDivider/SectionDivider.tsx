import line from "../../assets/icons/divider-line.svg";
import { Skeleton } from "../Skeleton/Skeleton";
import styles from "./SectionDivider.module.css";

type SectionDividerProps = {
  label: string;
  loading?: boolean;
};

export function SectionDivider({ label, loading = false }: SectionDividerProps) {
  return (
    <div className={styles.divider}>
      <span className={styles.line} aria-hidden="true">
        <img src={line} alt="" />
      </span>
      {loading ? <Skeleton slot="dividerLabel" tone="dark" /> : <h2 className={styles.label}>{label}</h2>}
      <span className={styles.line} aria-hidden="true">
        <img src={line} alt="" />
      </span>
    </div>
  );
}
