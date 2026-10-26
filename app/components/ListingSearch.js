"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./ListingSearch.module.css";

const RESULTS_URL =
  "https://theridgerealty.idxbroker.com/idx/results/listings";

const PRICE_FLOOR = 0;
const PRICE_CEILING = 8000000;
const PRICE_STEP = 50000;
const PRICE_DEFAULT_MIN = 200000;
const PRICE_DEFAULT_MAX = 8000000;

const LOCATIONS = [
  { value: "35146", label: "Pahrump" },
  { value: "1026", label: "Amargosa Valley" },
  { value: "3118", label: "Beatty" },
  { value: "5088", label: "Boulder City" },
  { value: "18449", label: "Goodsprings" },
  { value: "20821", label: "Henderson" },
  { value: "22539", label: "Indian Springs" },
  { value: "25650", label: "Las Vegas" },
  { value: "29860", label: "Mesquite" },
  { value: "33400", label: "North Las Vegas" },
  { value: "41421", label: "Sandy Valley" },
  { value: "46640", label: "Tonopah" },
];

const PROPERTY_TYPES = [
  { value: "sfr", label: "Single Family" },
  { value: "othr", label: "Other" },
  { value: "ld", label: "Land" },
  { value: "lse", label: "Lease" },
];

const BEDROOMS = [
  { value: "0", label: "Studio" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
  { value: "6", label: "6+" },
  { value: "7", label: "7+" },
  { value: "8", label: "8+" },
  { value: "9", label: "9+" },
  { value: "10", label: "10+" },
];

const BATHROOMS = BEDROOMS.filter((option) => option.value !== "0");

const SORTS = [
  { value: "oldest", label: "Oldest Listings" },
  { value: "pra", label: "Least expensive to most" },
  { value: "prd", label: "Most expensive to least" },
  { value: "bda", label: "Bedrooms (Low to High)" },
  { value: "bdd", label: "Bedrooms (High to Low)" },
  { value: "tba", label: "Bathrooms (Low to High)" },
  { value: "tbd", label: "Bathrooms (High to Low)" },
  { value: "sqfta", label: "Square Feet (Low to High)" },
  { value: "sqftd", label: "Square Feet (High to Low)" },
];

const AMENITIES = [
  { name: "amin_photocount", label: "Has photos" },
  { name: "wvt", label: "Virtual tour" },
  { name: "woh", label: "Open house" },
  { name: "fl", label: "Featured listings" },
];

function formatPrice(value) {
  if (value >= 1000000) {
    const millions = value / 1000000;
    return millions % 1 === 0 ? `$${millions}M` : `$${millions.toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${Math.round(value / 1000)}k`;
  }
  return `$${value}`;
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9h12v-9" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}

export default function ListingSearch() {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [priceMin, setPriceMin] = useState(PRICE_DEFAULT_MIN);
  const [priceMax, setPriceMax] = useState(PRICE_DEFAULT_MAX);
  const advancedPanelId = useId();
  const advancedWrapRef = useRef(null);
  const advancedButtonRef = useRef(null);
  const popoverRef = useRef(null);

  const priceMinPercent =
    ((priceMin - PRICE_FLOOR) / (PRICE_CEILING - PRICE_FLOOR)) * 100;
  const priceMaxPercent =
    ((priceMax - PRICE_FLOOR) / (PRICE_CEILING - PRICE_FLOOR)) * 100;

  useEffect(() => {
    if (!advancedOpen) return;

    const onPointerDown = (event) => {
      const target = event.target;
      if (
        target instanceof Node &&
        advancedWrapRef.current?.contains(target)
      ) {
        return;
      }
      setAdvancedOpen(false);
      advancedButtonRef.current?.focus();
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setAdvancedOpen(false);
        advancedButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    const firstFocusable = popoverRef.current?.querySelector(
      "select, input:not([type='hidden'])",
    );
    if (firstFocusable instanceof HTMLElement) {
      firstFocusable.focus();
    }

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [advancedOpen]);

  const handleMinPriceChange = (event) => {
    const next = Number(event.target.value);
    setPriceMin(Math.min(next, priceMax - PRICE_STEP));
  };

  const handleMaxPriceChange = (event) => {
    const next = Number(event.target.value);
    setPriceMax(Math.max(next, priceMin + PRICE_STEP));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAdvancedOpen(false);

    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const city = String(data.get("city") || "");
    if (city) params.append("city[]", city);

    ["pt", "srt", "bd", "tb"].forEach((key) => {
      const value = String(data.get(key) || "");
      if (value) params.set(key, value);
    });

    if (priceMin > PRICE_FLOOR) {
      params.set("lp", String(priceMin));
    }
    if (priceMax < PRICE_CEILING) {
      params.set("hp", String(priceMax));
    }

    AMENITIES.forEach((amenity) => {
      if (data.get(amenity.name) === "on") {
        params.set(amenity.name, "1");
      }
    });

    const query = params.toString();
    window.location.assign(query ? `${RESULTS_URL}?${query}` : RESULTS_URL);
  };

  const toggleAdvanced = () => {
    setAdvancedOpen((open) => !open);
  };

  return (
    <form
      id="search"
      className={styles.form}
      onSubmit={handleSubmit}
      aria-label="Search listings"
    >
      <div className={styles.bar}>
        <div className={styles.fieldsRow}>
        <div className={styles.cell}>
          <div className={styles.fieldControl}>
            <MapPinIcon />
            <label className="visually-hidden" htmlFor="search-location">
              Location
            </label>
            <select
              id="search-location"
              name="city"
              className={styles.select}
              defaultValue=""
            >
              <option value="">Location</option>
              {LOCATIONS.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon />
          </div>
        </div>

        <div className={styles.cell}>
          <div className={styles.fieldControl}>
            <HomeIcon />
            <label className="visually-hidden" htmlFor="search-type">
              Type
            </label>
            <select
              id="search-type"
              name="pt"
              className={styles.select}
              defaultValue=""
            >
              <option value="">Type</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon />
          </div>
        </div>

        <div className={styles.cellPrice}>
          <div className={styles.priceRange}>
            <div className={styles.priceHeader}>
              <span className={styles.priceLabel}>Price</span>
              <p className={styles.priceValues}>
                <span>{formatPrice(priceMin)}</span>
                <span aria-hidden="true">–</span>
                <span>{formatPrice(priceMax)}</span>
              </p>
            </div>
            <div
              className={styles.priceTrack}
              style={{
                "--range-start": `${priceMinPercent}%`,
                "--range-end": `${priceMaxPercent}%`,
              }}
            >
              <input
                type="range"
                className={styles.rangeMin}
                min={PRICE_FLOOR}
                max={PRICE_CEILING}
                step={PRICE_STEP}
                value={priceMin}
                onChange={handleMinPriceChange}
                aria-label="Minimum price"
              />
              <input
                type="range"
                className={styles.rangeMax}
                min={PRICE_FLOOR}
                max={PRICE_CEILING}
                step={PRICE_STEP}
                value={priceMax}
                onChange={handleMaxPriceChange}
                aria-label="Maximum price"
              />
            </div>
          </div>
        </div>

        <div className={styles.advancedWrap} ref={advancedWrapRef}>
          <button
            ref={advancedButtonRef}
            type="button"
            className={styles.fieldControl}
            aria-expanded={advancedOpen}
            aria-controls={advancedPanelId}
            aria-haspopup="dialog"
            onClick={toggleAdvanced}
          >
            <FilterIcon />
            <span className={styles.advancedLabel}>Advanced</span>
            <ChevronDownIcon />
          </button>
          {advancedOpen ? (
            <div
              ref={popoverRef}
              id={advancedPanelId}
              className={styles.popover}
              role="dialog"
              aria-label="Advanced search filters"
            >
              <div className={styles.popoverGrid}>
                <div className={styles.popoverField}>
                  <label htmlFor="search-beds">Bedrooms</label>
                  <select id="search-beds" name="bd" defaultValue="">
                    <option value="">Any</option>
                    {BEDROOMS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.popoverField}>
                  <label htmlFor="search-baths">Bathrooms</label>
                  <select id="search-baths" name="tb" defaultValue="">
                    <option value="">Any</option>
                    {BATHROOMS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.popoverField}>
                  <label htmlFor="search-sort">Sort by</label>
                  <select id="search-sort" name="srt" defaultValue="">
                    <option value="">Newest listings</option>
                    {SORTS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <fieldset className={styles.amenities}>
                <legend>Amenities</legend>
                <ul className={styles.amenityList}>
                  {AMENITIES.map((amenity) => (
                    <li key={amenity.name}>
                      <label className={styles.amenity}>
                        <input type="checkbox" name={amenity.name} />
                        {amenity.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            </div>
          ) : null}
        </div>

        <button type="submit" className={`btn btn--primary ${styles.submit}`}>
          <SearchIcon />
          Search
        </button>
        </div>
      </div>
    </form>
  );
}
