import api from "./axios";

export async function scanOiRadar() {
  const response = await api.post("/api/oi-radar/scan");
  return response.data;
}

export async function getOiRadarPage(page = 0) {
  const response = await api.get("/api/oi-radar", {
    params: { page },
  });

  return response.data;
}

/**
 * Loads all pages from the cached radar scan.
 *
 * The backend performs the actual scan only once through POST /scan.
 * Subsequent GET requests only read the cached result.
 */
export async function getAllOiRadarResults(firstPage) {
  if (!firstPage) {
    return [];
  }

  const totalPages = Number(firstPage.totalPages || 0);

  if (totalPages <= 1) {
    return firstPage.results || [];
  }

  const remainingPages = Array.from(
    { length: totalPages - 1 },
    (_, index) => index + 1
  );

  const pages = await Promise.all(
    remainingPages.map((page) => getOiRadarPage(page))
  );

  return [firstPage, ...pages].flatMap(
    (page) => page?.results || []
  );
}