import levels from "../../assets/icons/status-levels.svg";
import { Skeleton, SkeletonShape } from "../Skeleton/Skeleton";
import styles from "./StatusBar.module.css";

type StatusBarProps = {
  time: string;
  loading?: boolean;
};

/** Barre d'état simulée du téléphone. Purement décorative. */
export function StatusBar({ time, loading = false }: StatusBarProps) {
  return (
    <div className={styles.bar} aria-hidden="true">
      <div className={styles.time}>
        {loading ? <Skeleton slot="statusTime" tone="dark" /> : <span className={styles.timeText}>{time}</span>}
      </div>
      {loading ? (
        <div className={styles.levelsSkeleton}>
          <SkeletonShape className={styles.cell} />
          <SkeletonShape className={styles.wifi} />
          <span className={styles.battery}>
            <span className={styles.batteryBorder} />
            <SkeletonShape className={styles.batteryCap} />
            <span className={styles.batteryFill} />
          </span>
        </div>
      ) : (
        <img src={levels} alt="" width={71} height={13} className={styles.levels} />
      )}
    </div>
  );
}
