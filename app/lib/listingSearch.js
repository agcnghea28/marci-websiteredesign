export const LISTING_RESULTS_URL =
  "https://theridgerealty.idxbroker.com/idx/results/listings";

export const LISTING_LOCATIONS = [
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

export function goToListingResults(params) {
  const query = params.toString();
  window.location.assign(
    query ? `${LISTING_RESULTS_URL}?${query}` : LISTING_RESULTS_URL,
  );
}

/** @typedef {{
 *   cityValue?: string;
 *   typeValue?: string;
 *   bedsValue?: string;
 *   bathsValue?: string;
 *   sortValue?: string;
 *   priceMin?: number;
 *   priceMax?: number;
 *   priceFloor?: number;
 *   priceCeiling?: number;
 *   amenities?: Record<string, boolean>;
 * }} ListingSearchFilters */

/**
 * Builds IDX Broker query params from hero search filter state.
 * @see https://support.idxbroker.com/hc/en-us/articles/34489458510619
 */
export function buildListingSearchParams({
  cityValue = "",
  typeValue = "",
  bedsValue = "",
  bathsValue = "",
  sortValue = "",
  priceMin = 0,
  priceMax = 0,
  priceFloor = 0,
  priceCeiling = 0,
  amenities = {},
}) {
  const params = new URLSearchParams();

  if (cityValue) params.append("city[]", cityValue);
  if (typeValue) params.set("pt", typeValue);

  if (bedsValue) params.set("bd", bedsValue);
  if (bathsValue) params.set("tb", bathsValue);
  if (sortValue) params.set("srt", sortValue);

  if (priceMin > priceFloor) {
    params.set("lp", String(priceMin));
  }
  if (priceMax > 0 && priceMax < priceCeiling) {
    params.set("hp", String(priceMax));
  }

  Object.entries(amenities).forEach(([name, enabled]) => {
    if (enabled) params.set(name, "1");
  });

  return params;
}

export function goToListingSearch(filters) {
  goToListingResults(buildListingSearchParams(filters));
}

function normalizeQuery(raw) {
  return raw.trim().replace(/\s+/g, " ");
}

function findLocationMatch(query) {
  const lower = query.toLowerCase();

  const exact = LISTING_LOCATIONS.find(
    (location) => location.label.toLowerCase() === lower,
  );
  if (exact) return exact;

  if (query.length < 3) return null;

  const startsWith = LISTING_LOCATIONS.filter((location) =>
    location.label.toLowerCase().startsWith(lower),
  );
  if (startsWith.length === 1) return startsWith[0];

  const includes = LISTING_LOCATIONS.filter((location) =>
    location.label.toLowerCase().includes(lower),
  );
  if (includes.length === 1) return includes[0];

  return null;
}

/**
 * Maps free-text header search to IDX Broker query parameters.
 * @see https://support.idxbroker.com/hc/en-us/articles/34489458510619
 */
export function buildHeaderSearchParams(rawQuery) {
  const query = normalizeQuery(rawQuery);
  if (!query) return null;

  const params = new URLSearchParams();

  if (/^\d{5}$/.test(query)) {
    params.append("zipcode[]", query);
    return params;
  }

  if (/^\d{6,}$/.test(query)) {
    params.append("aw_listingID[]", query);
    return params;
  }

  const location = findLocationMatch(query);
  if (location) {
    params.append("city[]", location.value);
    return params;
  }

  params.append("aw_address[]", query);
  return params;
}

export function goToHeaderSearch(rawQuery) {
  const params = buildHeaderSearchParams(rawQuery);
  if (!params) return false;
  goToListingResults(params);
  return true;
}
