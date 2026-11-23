import arrowBack from "../../assets/icons/arrow-back.svg";
import { Skeleton, SkeletonShape } from "../Skeleton/Skeleton";
import styles from "./AppHeader.module.css";

type AppHeaderProps = {
  title: string;
  subtitle: string;
  onBack?: () => void;
  loading?: boolean;
};

export function AppHeader({ title, subtitle, onBack, loading = false }: AppHeaderProps) {
  if (loading) {
    return (
      <div className={styles.header}>
        <div className={styles.inner}>
          <SkeletonShape className={styles.backSkeleton} />
          <div className={styles.texts}>
            <Skeleton slot="title" tone="dark" />
            <Skeleton slot="subtitle" tone="dark" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.header}>
      <div className={styles.inner}>
        <button type="button" className={styles.back} onClick={onBack} aria-label="Retour">
          <img src={arrowBack} alt="" width={24} height={24} />
        </button>
        <div className={styles.texts}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
