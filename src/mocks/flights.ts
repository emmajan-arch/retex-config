/**
 * Données simulées : jours, prix et vols Paris (CDG) → Nice (NCE).
 * Le 20 août reprend exactement les contenus de la maquette Figma.
 * Les autres jours sont dérivés de façon déterministe (mêmes valeurs à chaque visite).
 */

export type Fare = {
  name: string;
  description: string;
  price: number;
};

export type Flight = {
  id: string;
  departure: string;
  arrival: string;
  duration: string;
  /** Mention « DIRECT » sous la durée */
  directLabel?: boolean;
  /** Pastille au-dessus des horaires, ex. « Vol direct » */
  badge?: string;
  /** "from" : un bloc « Dès xx € ». "split" : deux blocs de prix côte à côte. */
  display: "from" | "split";
  /** Eco, Eco +, Premium. Les cartes "split" affichent les deux premiers. */
  fares: Fare[];
};

export type Day = {
  iso: string;
  weekdayShort: string;
  weekdayLong: string;
  dayOfMonth: number;
  monthLong: string;
  minPrice: number;
};

export const ROUTE = {
  from: "Paris (CDG)",
  to: "Nice (NCE)",
};

export const TRIP = {
  travellers: "2 voyageurs",
  luggage: "1 bagage",
};

/** Délai simulé du réseau, en millisecondes */
const NETWORK_DELAY = 900;
const NETWORK_JITTER = 400;

const WEEKDAYS_SHORT = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
const WEEKDAYS_LONG = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MONTHS_LONG = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/** Semaine affichée et prix minimum par jour (valeurs de la maquette) */
const WEEK: Array<{ iso: string; minPrice: number }> = [
  { iso: "2025-08-18", minPrice: 84 },
  { iso: "2025-08-19", minPrice: 84 },
  { iso: "2025-08-20", minPrice: 62 },
  { iso: "2025-08-21", minPrice: 84 },
  { iso: "2025-08-22", minPrice: 84 },
  { iso: "2025-08-23", minPrice: 84 },
];

export const DEFAULT_DAY = "2025-08-20";

/** Écarts de prix entre tarifs, repris de la maquette (62 € · 108 € · 208 €) */
const ECO_PLUS_EXTRA = 46;
const PREMIUM_EXTRA = 146;

const fares = (eco: number, ecoPlus = eco + ECO_PLUS_EXTRA, premium = eco + PREMIUM_EXTRA): Fare[] => [
  { name: "Eco", description: "Bagage cabine inclus", price: eco },
  { name: "Eco +", description: "Bagages cabine et soute inclus", price: ecoPlus },
  { name: "Premium", description: "Cabine + soute · Accès prioritaire", price: premium },
];

/** Vols du 20 août, identiques à la maquette */
const REFERENCE_FLIGHTS: Flight[] = [
  { id: "f1", departure: "09:00", arrival: "10:35", duration: "1h35", display: "from", fares: fares(62) },
  { id: "f2", departure: "10:30", arrival: "12:05", duration: "1h35", display: "from", fares: fares(102) },
  { id: "f3", departure: "13:00", arrival: "14:35", duration: "1h35", display: "from", fares: fares(99) },
  { id: "f4", departure: "15:00", arrival: "16:35", duration: "1h35", badge: "Vol direct", display: "from", fares: fares(62) },
  { id: "f5", departure: "17:00", arrival: "18:35", duration: "1h35", directLabel: true, display: "from", fares: fares(62) },
  { id: "f6", departure: "17:00", arrival: "18:35", duration: "1h35", directLabel: true, display: "split", fares: fares(62, 98) },
  { id: "f7", departure: "17:00", arrival: "18:35", duration: "1h35", directLabel: true, display: "split", fares: fares(62, 98) },
];

const parseIso = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

const toDay = ({ iso, minPrice }: { iso: string; minPrice: number }): Day => {
  const date = parseIso(iso);
  return {
    iso,
    weekdayShort: WEEKDAYS_SHORT[date.getUTCDay()],
    weekdayLong: WEEKDAYS_LONG[date.getUTCDay()],
    dayOfMonth: date.getUTCDate(),
    monthLong: MONTHS_LONG[date.getUTCMonth()],
    minPrice,
  };
};

/** Petit générateur pseudo-aléatoire déterministe */
const seeded = (seed: number) => () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

const shiftTime = (time: string, minutes: number) => {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
};

const flightsFor = (iso: string): Flight[] => {
  if (iso === DEFAULT_DAY) return REFERENCE_FLIGHTS;

  const day = WEEK.find((d) => d.iso === iso);
  const minPrice = day?.minPrice ?? 84;
  const random = seeded(parseIso(iso).getUTCDate());
  const reference = REFERENCE_FLIGHTS[0].fares[0].price;

  return REFERENCE_FLIGHTS.map((flight, index) => {
    const shift = Math.round(random() * 4 - 2) * 15;
    // Le vol le moins cher du jour vaut exactement le prix affiché dans l'onglet
    const extra = index === 0 ? 0 : Math.round(random() * 30);
    const offset = minPrice - reference + extra;
    return {
      ...flight,
      id: `${iso}-${flight.id}`,
      departure: shiftTime(flight.departure, shift),
      arrival: shiftTime(flight.arrival, shift),
      fares: flight.fares.map((fare) => ({ ...fare, price: fare.price + offset })),
    };
  });
};

const wait = <T,>(value: T, signal?: AbortSignal) =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => resolve(value), NETWORK_DELAY + Math.random() * NETWORK_JITTER);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Requête annulée", "AbortError"));
    });
  });

export const fetchDays = (signal?: AbortSignal) => wait(WEEK.map(toDay), signal);

export const fetchFlights = (iso: string, signal?: AbortSignal) => wait(flightsFor(iso), signal);

export const formatPrice = (price: number, spaced = true) => (spaced ? `${price} €` : `${price}€`);
