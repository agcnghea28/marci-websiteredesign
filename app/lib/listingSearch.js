export const LISTING_RESULTS_URL =
  "https://theridgerealty.idxbroker.com/idx/results/listings";

/** City IDs from theridgerealty.idxbroker.com (IDX ccz list). */
export const LISTING_LOCATIONS = [
  { value: "433", label: "Alamo" },
  { value: "934", label: "Alton" },
  { value: "1026", label: "Amargosa Valley" },
  { value: "3118", label: "Beatty" },
  { value: "3829", label: "Beryl" },
  { value: "4546", label: "Blue Diamond" },
  { value: "5088", label: "Boulder City" },
  { value: "5521", label: "Brian Head" },
  { value: "6719", label: "Cal Nev Ari" },
  { value: "6775", label: "Caliente" },
  { value: "7784", label: "Cedar City" },
  { value: "9571", label: "Cold Creek" },
  { value: "11053", label: "Crystal" },
  { value: "12869", label: "Duck Creek Village" },
  { value: "13129", label: "Dyer" },
  { value: "14307", label: "Elko" },
  { value: "14562", label: "Ely" },
  { value: "18363", label: "Goldfield" },
  { value: "18449", label: "Goodsprings" },
  { value: "20411", label: "Hatch" },
  { value: "20821", label: "Henderson" },
  { value: "22539", label: "Indian Springs" },
  { value: "23194", label: "Jean" },
  { value: "25650", label: "Las Vegas" },
  { value: "25702", label: "Laughlin" },
  { value: "26990", label: "Logandale" },
  { value: "29175", label: "Mc Gill" },
  { value: "29860", label: "Mesquite" },
  { value: "30650", label: "Moapa" },
  { value: "31435", label: "Mount Charleston" },
  { value: "31686", label: "Mountain Springs" },
  { value: "32217", label: "Nelson" },
  { value: "33400", label: "North Las Vegas" },
  { value: "34981", label: "Overton" },
  { value: "35146", label: "Pahrump" },
  { value: "55114", label: "Palm Gardens" },
  { value: "35305", label: "Panaca" },
  { value: "35603", label: "Parowan" },
  { value: "36767", label: "Pioche" },
  { value: "40625", label: "Ruth" },
  { value: "41421", label: "Sandy Valley" },
  { value: "41950", label: "Searchlight" },
  { value: "46640", label: "Tonopah" },
  { value: "33", label: "Other" },
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
