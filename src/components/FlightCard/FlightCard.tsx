import { useId } from "react";
import { formatPrice, type Flight } from "../../mocks/flights";
import { FareLabel, FareOption, FarePrice } from "../FareOption/FareOption";
import { FareRow } from "../FareRow/FareRow";
import { Skeleton } from "../Skeleton/Skeleton";
import styles from "./FlightCard.module.css";

type FlightCardProps = {
  flight: Flight;
  expanded: boolean;
  onToggle: () => void;
  selectedFareIndex: number;
  onSelectFare: (index: number) => void;
};

/** Carte vol. Figma : composant « Vol Card », états Default et Deployed. */
export function FlightCard({ flight, expanded, onToggle, selectedFareIndex, onSelectFare }: FlightCardProps) {
  const panelId = useId();
  const minPrice = Math.min(...flight.fares.map((fare) => fare.price));
  const summaryLabel = [
    `Départ ${flight.departure}, arrivée ${flight.arrival}, durée ${flight.duration}`,
    flight.badge || flight.directLabel ? "vol direct" : null,
    `dès ${formatPrice(minPrice)}`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={`${styles.summary} ${expanded ? styles.summaryExpanded : ""}`}
        aria-expanded={expanded}
        aria-controls={panelId}
        aria-label={summaryLabel}
        onClick={onToggle}
      >
        {flight.badge && <span className={styles.badge}>{flight.badge}</span>}
        <span className={styles.row}>
          <FlightTimeline flight={flight} />
          {flight.display === "split" ? (
            <span className={styles.fareGroup}>
              <FareOption variant="split" wave="left">
                <FarePrice fixed>{formatPrice(flight.fares[0].price)}</FarePrice>
              </FareOption>
              <FareOption variant="split" wave="right">
                <FarePrice>{formatPrice(flight.fares[1].price)}</FarePrice>
              </FareOption>
            </span>
          ) : (
            <FareOption variant="from">
              <FareLabel>Dès</FareLabel>
              <FarePrice fixed>{formatPrice(minPrice)}</FarePrice>
            </FareOption>
          )}
        </span>
      </button>

      {expanded && (
        <div id={panelId} className={styles.panel} role="radiogroup" aria-label={`Tarifs du vol de ${flight.departure}`}>
          {flight.fares.map((fare, index) => (
            <FareRow
              key={fare.name}
              fare={fare}
              selected={index === selectedFareIndex}
              onSelect={() => onSelectFare(index)}
            />
          ))}
        </div>
      )}
    </article>
  );
}

function FlightTimeline({ flight }: { flight: Flight }) {
  return (
    <span className={styles.timeline}>
      <span className={styles.times}>
        <span className={styles.departure}>{flight.departure}</span>
        <span className={styles.arrival}>{flight.arrival}</span>
      </span>
      <span className={styles.meta}>
        <span>{flight.duration}</span>
        {flight.directLabel && <span>Direct</span>}
      </span>
    </span>
  );
}

type FlightCardSkeletonProps = {
  variant: "default" | "badge" | "direct" | "split";
};

/** Carte vol en chargement. Figma : « Frame 1018 · Skeleton ». */
export function FlightCardSkeleton({ variant }: FlightCardSkeletonProps) {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.summary}>
        {variant === "badge" && (
          <span className={styles.badge}>
            <Skeleton slot="badge" />
          </span>
        )}
        <span className={styles.row}>
          <span className={styles.timeline}>
            <span className={styles.times}>
              <Skeleton slot="departure" />
              <Skeleton slot="arrival" />
            </span>
            <span className={styles.meta}>
              <Skeleton slot="duration" />
              {(variant === "direct" || variant === "split") && <Skeleton slot="direct" />}
            </span>
          </span>
          {variant === "split" ? (
            <span className={styles.fareGroup}>
              <FareOption variant="split" wave="left">
                <Skeleton slot="farePrice" />
              </FareOption>
              <FareOption variant="split" wave="right">
                <Skeleton slot="farePriceAlt" />
              </FareOption>
            </span>
          ) : (
            <FareOption variant="from">
              <Skeleton slot="fareLabel" />
              <Skeleton slot="farePrice" />
            </FareOption>
          )}
        </span>
      </div>
    </div>
  );
}
