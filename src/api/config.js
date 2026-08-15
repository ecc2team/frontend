const USE_MSW =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === "true";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const apiPath = `/api/v1${normalizedPath}`;

  if (USE_MSW) {
    return apiPath;
  }

  return `${API_BASE_URL}${apiPath}`;
}
