import { useEffect, useState } from "react";
import { AppHeader } from "../components/AppHeader/AppHeader";
import { DateTabs } from "../components/DateTabs/DateTabs";
import { FlightCard, FlightCardSkeleton } from "../components/FlightCard/FlightCard";
import { SectionDivider } from "../components/SectionDivider/SectionDivider";
import { StatusBar } from "../components/StatusBar/StatusBar";
import { TripChips } from "../components/TripChips/TripChips";
import { DEFAULT_DAY, ROUTE, TRIP, fetchDays, fetchFlights, type Day, type Flight } from "../mocks/flights";
import styles from "./FlightSelection.module.css";

const LIST_ID = "flight-list";
const SKELETON_CARDS = ["default", "default", "default", "badge", "direct", "split", "split"] as const;
const isAbort = (error: unknown) => error instanceof DOMException && error.name === "AbortError";

/** Écran « Sélectionner un vol ». Figma : Piste 1, frames 1029 / 1026 / 1018 · Skeleton. */
export function FlightSelection() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [selectedIso, setSelectedIso] = useState(DEFAULT_DAY);
  const [flights, setFlights] = useState<Flight[] | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedFares, setSelectedFares] = useState<Record<string, number>>({});

  // Premier chargement : les jours (écran entier en skeleton)
  useEffect(() => {
    const controller = new AbortController();
    fetchDays(controller.signal).then(setDays).catch((error) => {
      if (!isAbort(error)) throw error;
    });
    return () => controller.abort();
  }, []);

  // Vols du jour sélectionné : seule la liste passe en skeleton
  useEffect(() => {
    const controller = new AbortController();
    setFlights(null);
    setExpandedId(null);
    fetchFlights(selectedIso, controller.signal).then(setFlights).catch((error) => {
      if (!isAbort(error)) throw error;
    });
    return () => controller.abort();
  }, [selectedIso]);

  const initialLoading = days === null;
  const listLoading = flights === null;
  const selectedDay = days?.find((day) => day.iso === selectedIso);
  const dateLabel = selectedDay ? `${selectedDay.dayOfMonth} ${selectedDay.monthLong}` : "";
  const announcement = listLoading
    ? "Chargement des vols"
    : selectedDay
      ? `${flights.length} vols le ${selectedDay.weekdayLong} ${dateLabel}`
      : "";

  return (
    <div className={styles.screen} data-skeleton-root>
      <header className={styles.top}>
        <div className={styles.headerBlock}>
          <StatusBar time="10:08" loading={initialLoading} />
          <AppHeader
            title="Sélectionner un vol"
            subtitle={`${ROUTE.from} → ${ROUTE.to} · ${dateLabel}`}
            onBack={() => window.history.back()}
            loading={initialLoading}
          />
          <TripChips items={[TRIP.travellers, TRIP.luggage]} loading={initialLoading} />
          <SectionDivider label="Tarifs" loading={initialLoading} />
        </div>
        <DateTabs
          days={days ?? []}
          selectedIso={selectedIso}
          onSelect={setSelectedIso}
          controls={LIST_ID}
          loading={initialLoading}
        />
      </header>

      <main>
        <p className="visually-hidden" role="status" aria-live="polite">
          {initialLoading ? "Chargement des vols" : announcement}
        </p>
        <div id={LIST_ID} className={styles.list} aria-busy={listLoading}>
          {listLoading || initialLoading
            ? SKELETON_CARDS.map((variant, index) => <FlightCardSkeleton key={`${selectedIso}-${index}`} variant={variant} />)
            : flights.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  expanded={expandedId === flight.id}
                  onToggle={() => setExpandedId((current) => (current === flight.id ? null : flight.id))}
                  selectedFareIndex={selectedFares[flight.id] ?? 0}
                  onSelectFare={(index) => setSelectedFares((current) => ({ ...current, [flight.id]: index }))}
                />
              ))}
        </div>
      </main>
    </div>
  );
}
