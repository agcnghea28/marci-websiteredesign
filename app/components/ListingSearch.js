"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  goToListingSearch,
  LISTING_LOCATIONS,
} from "../lib/listingSearch";
import styles from "./ListingSearch.module.css";

const SEARCH_POPOVER_Z_INDEX = 201;
const SEARCH_SUBMENU_Z_INDEX = 202;
const SUBMENU_MAX_HEIGHT = 12 * 16;
const POPOVER_GAP = 8;
const VIEWPORT_GUTTER = 8;
const POPOVER_WIDTH = 20 * 16;
const POPOVER_ESTIMATED_HEIGHT = 280;

function getPopoverMaxHeight() {
  return Math.min(window.innerHeight * 0.7, 28 * 16);
}

function computePopoverPosition(
  anchor,
  measuredHeight = POPOVER_ESTIMATED_HEIGHT,
  { align = "end", minWidth = POPOVER_WIDTH } = {},
) {
  const popoverMaxHeight = getPopoverMaxHeight();
  const rect = anchor.getBoundingClientRect();
  const width = Math.min(
    Math.max(rect.width, minWidth),
    window.innerWidth - VIEWPORT_GUTTER * 2,
  );
  let left = align === "start" ? rect.left : rect.right - width;
  left = Math.max(
    VIEWPORT_GUTTER,
    Math.min(left, window.innerWidth - width - VIEWPORT_GUTTER),
  );

  const maxPanelHeight = Math.min(popoverMaxHeight, measuredHeight);
  const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_GUTTER;
  const spaceAbove = rect.top - VIEWPORT_GUTTER;
  const placeAbove =
    spaceBelow < maxPanelHeight + POPOVER_GAP && spaceAbove > spaceBelow;

  if (placeAbove) {
    return {
      placement: "above",
      left,
      width,
      top: null,
      bottom: window.innerHeight - rect.top + POPOVER_GAP,
      maxHeight: Math.min(popoverMaxHeight, spaceAbove - POPOVER_GAP),
    };
  }

  return {
    placement: "below",
    left,
    width,
    top: rect.bottom + POPOVER_GAP,
    bottom: null,
    maxHeight: Math.min(popoverMaxHeight, spaceBelow - POPOVER_GAP),
  };
}

function computeSubmenuPosition(
  anchor,
  measuredHeight = SUBMENU_MAX_HEIGHT,
) {
  const rect = anchor.getBoundingClientRect();
  const width = Math.min(
    rect.width,
    window.innerWidth - VIEWPORT_GUTTER * 2,
  );
  let left = rect.left;
  left = Math.max(
    VIEWPORT_GUTTER,
    Math.min(left, window.innerWidth - width - VIEWPORT_GUTTER),
  );

  const maxPanelHeight = Math.min(SUBMENU_MAX_HEIGHT, measuredHeight);
  const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_GUTTER;
  const spaceAbove = rect.top - VIEWPORT_GUTTER;
  const placeAbove =
    spaceBelow < maxPanelHeight + POPOVER_GAP && spaceAbove > spaceBelow;

  if (placeAbove) {
    return {
      placement: "above",
      left,
      width,
      top: null,
      bottom: window.innerHeight - rect.top + POPOVER_GAP,
      maxHeight: Math.min(SUBMENU_MAX_HEIGHT, spaceAbove - POPOVER_GAP),
    };
  }

  return {
    placement: "below",
    left,
    width,
    top: rect.bottom + POPOVER_GAP,
    bottom: null,
    maxHeight: Math.min(SUBMENU_MAX_HEIGHT, spaceBelow - POPOVER_GAP),
  };
}

const PRICE_FLOOR = 0;
const PRICE_CEILING = 8000000;
const PRICE_STEP = 50000;
const PRICE_DEFAULT_MIN = 200000;
const PRICE_DEFAULT_MAX = 8000000;

const LOCATIONS = LISTING_LOCATIONS;

const PROPERTY_TYPES = [
  { value: "7", label: "Land" },
  { value: "11", label: "Residential Lease" },
  { value: "6", label: "High Rise" },
  { value: "1", label: "Residential" },
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
  { value: "newest", label: "Newest Listings" },
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
  { name: "pool", label: "Pool" },
  { name: "garage", label: "Garage" },
  { name: "fenced_yard", label: "Fenced Yard" },
  { name: "mountain_views", label: "Mountain Views" },
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

function popoverStyle(position) {
  return {
    left: position.left,
    width: position.width,
    maxHeight: position.maxHeight,
    zIndex: SEARCH_POPOVER_Z_INDEX,
    ...(position.top != null ? { top: position.top } : {}),
    ...(position.bottom != null ? { bottom: position.bottom } : {}),
  };
}

function SearchMenuPopover({ position, placement, panelId, label, children, popoverRef }) {
  return createPortal(
    <div
      ref={popoverRef}
      id={panelId}
      className={styles.popover}
      data-placement={placement}
      role="dialog"
      aria-label={label}
      style={popoverStyle(position)}
    >
      {children}
    </div>,
    document.body,
  );
}

function AdvancedFilterSelect({
  fieldId,
  name,
  label,
  placeholder,
  options,
  value,
  onChange,
  isOpen,
  onToggle,
  onClose,
}) {
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState(null);

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? placeholder;

  const updateMenuPosition = useCallback(() => {
    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!button) return;

    const measuredHeight = menu?.offsetHeight ?? SUBMENU_MAX_HEIGHT;
    setMenuPosition(computeSubmenuPosition(button, measuredHeight));
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setMenuPosition(null);
      return undefined;
    }

    if (buttonRef.current) {
      setMenuPosition(computeSubmenuPosition(buttonRef.current));
    }

    const onPointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      onClose();
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isOpen, onClose, updateMenuPosition]);

  useLayoutEffect(() => {
    if (!isOpen) return undefined;

    updateMenuPosition();
    const menu = menuRef.current;
    if (!menu) return undefined;

    const resizeObserver = new ResizeObserver(() => {
      updateMenuPosition();
    });
    resizeObserver.observe(menu);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen, updateMenuPosition]);

  return (
    <div className={styles.popoverField}>
      <span className={styles.popoverFieldLabel} id={`${fieldId}-label`}>
        {label}
      </span>
      <div className={styles.selectFieldWrap}>
        <button
          ref={buttonRef}
          type="button"
          id={fieldId}
          className={`${styles.selectField} ${isOpen ? styles.selectFieldOpen : ""}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={`${fieldId}-label`}
          onClick={onToggle}
        >
          <span
            className={
              value ? styles.selectFieldValue : styles.selectFieldPlaceholder
            }
          >
            {selectedLabel}
          </span>
          <span className={styles.selectFieldChevron} aria-hidden="true">
            <ChevronDownIcon />
          </span>
        </button>
        <input type="hidden" name={name} value={value} />
        {isOpen && menuPosition
          ? createPortal(
              <SearchOptionList
                listRef={menuRef}
                options={options}
                value={value}
                placeholder={placeholder}
                onSelect={(next) => {
                  onChange(next);
                  onClose();
                }}
                className={`${styles.selectFieldMenu} ${styles.selectFieldMenuPortal}`}
                style={{
                  left: menuPosition.left,
                  width: menuPosition.width,
                  maxHeight: menuPosition.maxHeight,
                  zIndex: SEARCH_SUBMENU_Z_INDEX,
                  ...(menuPosition.top != null
                    ? { top: menuPosition.top }
                    : {}),
                  ...(menuPosition.bottom != null
                    ? { bottom: menuPosition.bottom }
                    : {}),
                }}
              />,
              document.body,
            )
          : null}
      </div>
    </div>
  );
}

function SearchOptionList({
  options,
  value,
  placeholder,
  onSelect,
  className,
  listRef,
  style,
}) {
  return (
    <ul
      ref={listRef}
      className={className ? `${styles.optionList} ${className}` : styles.optionList}
      role="listbox"
      aria-label="Options"
      style={style}
    >
      <li role="presentation">
        <button
          type="button"
          role="option"
          className={styles.optionButton}
          aria-selected={value === ""}
          onClick={() => onSelect("")}
        >
          {placeholder}
        </button>
      </li>
      {options.map((option) => (
        <li key={option.value} role="presentation">
          <button
            type="button"
            role="option"
            className={styles.optionButton}
            aria-selected={value === option.value}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function ListingSearch() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [cityValue, setCityValue] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [bedsValue, setBedsValue] = useState("");
  const [bathsValue, setBathsValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [advancedSubMenu, setAdvancedSubMenu] = useState(null);
  const [priceMin, setPriceMin] = useState(PRICE_DEFAULT_MIN);
  const [priceMax, setPriceMax] = useState(PRICE_DEFAULT_MAX);
  const [amenityValues, setAmenityValues] = useState(() =>
    Object.fromEntries(AMENITIES.map((amenity) => [amenity.name, false])),
  );

  const locationPanelId = useId();
  const typePanelId = useId();
  const advancedPanelId = useId();

  const locationWrapRef = useRef(null);
  const typeWrapRef = useRef(null);
  const advancedWrapRef = useRef(null);

  const locationButtonRef = useRef(null);
  const typeButtonRef = useRef(null);
  const advancedButtonRef = useRef(null);

  const locationPopoverRef = useRef(null);
  const typePopoverRef = useRef(null);
  const advancedPopoverRef = useRef(null);

  const getMenuConfig = (menuKey) => {
    switch (menuKey) {
      case "location":
        return {
          wrap: locationWrapRef,
          button: locationButtonRef,
          popover: locationPopoverRef,
          align: "start",
          minWidth: 12 * 16,
        };
      case "type":
        return {
          wrap: typeWrapRef,
          button: typeButtonRef,
          popover: typePopoverRef,
          align: "start",
          minWidth: 11 * 16,
        };
      case "advanced":
        return {
          wrap: advancedWrapRef,
          button: advancedButtonRef,
          popover: advancedPopoverRef,
          align: "end",
          minWidth: POPOVER_WIDTH,
        };
      default:
        return null;
    }
  };

  const priceMinPercent =
    ((priceMin - PRICE_FLOOR) / (PRICE_CEILING - PRICE_FLOOR)) * 100;
  const priceMaxPercent =
    ((priceMax - PRICE_FLOOR) / (PRICE_CEILING - PRICE_FLOOR)) * 100;

  const updateMenuPosition = useCallback(() => {
    if (!activeMenu) return;
    const config = getMenuConfig(activeMenu);
    if (!config) return;

    const button = config.button.current;
    const popover = config.popover.current;
    if (!button) return;

    const measuredHeight = popover?.offsetHeight ?? POPOVER_ESTIMATED_HEIGHT;
    setMenuPosition(
      computePopoverPosition(button, measuredHeight, {
        align: config.align,
        minWidth: config.minWidth,
      }),
    );
  }, [activeMenu]);

  const toggleMenu = (menuKey) => {
    setActiveMenu((current) => (current === menuKey ? null : menuKey));
  };

  useEffect(() => {
    if (!activeMenu) {
      setMenuPosition(null);
      return undefined;
    }

    const config = getMenuConfig(activeMenu);
    if (!config) return undefined;

    const button = config.button.current;
    if (button) {
      setMenuPosition(
        computePopoverPosition(button, POPOVER_ESTIMATED_HEIGHT, {
          align: config.align,
          minWidth: config.minWidth,
        }),
      );
    }

    const onPointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (
        target instanceof Element &&
        target.closest(`.${styles.selectFieldMenuPortal}`)
      ) {
        return;
      }

      const wrap = config.wrap.current;
      const popover = config.popover.current;
      if (wrap?.contains(target) || popover?.contains(target)) {
        return;
      }

      setActiveMenu(null);
      setAdvancedSubMenu(null);
      config.button.current?.focus();
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveMenu(null);
        config.button.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [activeMenu, updateMenuPosition]);

  useLayoutEffect(() => {
    if (!activeMenu) return undefined;

    updateMenuPosition();
    const popover = getMenuConfig(activeMenu)?.popover.current;
    if (!popover) return undefined;

    const resizeObserver = new ResizeObserver(() => {
      updateMenuPosition();
    });
    resizeObserver.observe(popover);

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeMenu, updateMenuPosition]);

  useEffect(() => {
    if (activeMenu !== "advanced") {
      setAdvancedSubMenu(null);
    }
  }, [activeMenu]);

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
    setActiveMenu(null);

    goToListingSearch({
      cityValue,
      typeValue,
      bedsValue,
      bathsValue,
      sortValue,
      priceMin,
      priceMax,
      priceFloor: PRICE_FLOOR,
      priceCeiling: PRICE_CEILING,
      amenities: amenityValues,
    });
  };

  const toggleAmenity = (name, checked) => {
    setAmenityValues((current) => ({ ...current, [name]: checked }));
  };

  const cityLabel =
    LOCATIONS.find((location) => location.value === cityValue)?.label ??
    "Location";
  const typeLabel =
    PROPERTY_TYPES.find((type) => type.value === typeValue)?.label ?? "Type";

  return (
    <form
      id="search"
      className={styles.form}
      onSubmit={handleSubmit}
      aria-label="Search listings"
    >
      <input type="hidden" name="city" value={cityValue} />
      <input type="hidden" name="pt" value={typeValue} />
      <div className={styles.bar}>
        <div className={styles.fieldsRow}>
          <div className={`${styles.cell} ${styles.cellSelect}`} ref={locationWrapRef}>
            <button
              ref={locationButtonRef}
              type="button"
              className={styles.fieldControl}
              aria-expanded={activeMenu === "location"}
              aria-controls={locationPanelId}
              aria-haspopup="listbox"
              onClick={() => toggleMenu("location")}
            >
              <MapPinIcon />
              <span
                className={
                  cityValue ? styles.fieldValue : styles.fieldPlaceholder
                }
              >
                {cityLabel}
              </span>
              <ChevronDownIcon />
            </button>
            {activeMenu === "location" && menuPosition
              ? SearchMenuPopover({
                  position: menuPosition,
                  placement: menuPosition.placement,
                  panelId: locationPanelId,
                  label: "Location",
                  popoverRef: locationPopoverRef,
                  children: (
                    <SearchOptionList
                      options={LOCATIONS}
                      value={cityValue}
                      placeholder="Any"
                      onSelect={(next) => {
                        setCityValue(next);
                        setActiveMenu(null);
                        locationButtonRef.current?.focus();
                      }}
                    />
                  ),
                })
              : null}
          </div>

          <div className={`${styles.cell} ${styles.cellSelect}`} ref={typeWrapRef}>
            <button
              ref={typeButtonRef}
              type="button"
              className={styles.fieldControl}
              aria-expanded={activeMenu === "type"}
              aria-controls={typePanelId}
              aria-haspopup="listbox"
              onClick={() => toggleMenu("type")}
            >
              <HomeIcon />
              <span
                className={
                  typeValue ? styles.fieldValue : styles.fieldPlaceholder
                }
              >
                {typeLabel}
              </span>
              <ChevronDownIcon />
            </button>
            {activeMenu === "type" && menuPosition
              ? SearchMenuPopover({
                  position: menuPosition,
                  placement: menuPosition.placement,
                  panelId: typePanelId,
                  label: "Property type",
                  popoverRef: typePopoverRef,
                  children: (
                    <SearchOptionList
                      options={PROPERTY_TYPES}
                      value={typeValue}
                      placeholder="Any"
                      onSelect={(next) => {
                        setTypeValue(next);
                        setActiveMenu(null);
                        typeButtonRef.current?.focus();
                      }}
                    />
                  ),
                })
              : null}
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
              aria-expanded={activeMenu === "advanced"}
              aria-controls={advancedPanelId}
              aria-haspopup="dialog"
              onClick={() => toggleMenu("advanced")}
            >
              <FilterIcon />
              <span className={styles.advancedLabel}>Advanced</span>
              <ChevronDownIcon />
            </button>
            {activeMenu === "advanced" && menuPosition
              ? SearchMenuPopover({
                  position: menuPosition,
                  placement: menuPosition.placement,
                  panelId: advancedPanelId,
                  label: "Advanced search filters",
                  popoverRef: advancedPopoverRef,
                  children: (
                    <>
                      <div className={styles.popoverGrid}>
                        <AdvancedFilterSelect
                          fieldId="search-beds"
                          name="bd"
                          label="Bedrooms"
                          placeholder="Any"
                          options={BEDROOMS}
                          value={bedsValue}
                          onChange={setBedsValue}
                          isOpen={advancedSubMenu === "beds"}
                          onToggle={() =>
                            setAdvancedSubMenu((current) =>
                              current === "beds" ? null : "beds",
                            )
                          }
                          onClose={() => setAdvancedSubMenu(null)}
                        />
                        <AdvancedFilterSelect
                          fieldId="search-baths"
                          name="tb"
                          label="Bathrooms"
                          placeholder="Any"
                          options={BATHROOMS}
                          value={bathsValue}
                          onChange={setBathsValue}
                          isOpen={advancedSubMenu === "baths"}
                          onToggle={() =>
                            setAdvancedSubMenu((current) =>
                              current === "baths" ? null : "baths",
                            )
                          }
                          onClose={() => setAdvancedSubMenu(null)}
                        />
                        <AdvancedFilterSelect
                          fieldId="search-sort"
                          name="srt"
                          label="Sort by"
                          placeholder="Newest listings"
                          options={SORTS}
                          value={sortValue}
                          onChange={setSortValue}
                          isOpen={advancedSubMenu === "sort"}
                          onToggle={() =>
                            setAdvancedSubMenu((current) =>
                              current === "sort" ? null : "sort",
                            )
                          }
                          onClose={() => setAdvancedSubMenu(null)}
                        />
                      </div>
                      <fieldset className={styles.amenities}>
                        <legend>Amenities</legend>
                        <ul className={styles.amenityList}>
                          {AMENITIES.map((amenity) => (
                            <li key={amenity.name}>
                              <label className={styles.amenity}>
                                <input
                                  type="checkbox"
                                  name={amenity.name}
                                  checked={amenityValues[amenity.name]}
                                  onChange={(event) =>
                                    toggleAmenity(
                                      amenity.name,
                                      event.target.checked,
                                    )
                                  }
                                />
                                {amenity.label}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </fieldset>
                    </>
                  ),
                })
              : null}
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
