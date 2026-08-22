const USE_MSW =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === "true";

const RAW_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").trim();
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, "");
const INVALID_API_BASE_URL =
  !/^https?:\/\/[^\s]+$/.test(API_BASE_URL) ||
  API_BASE_URL.includes("VITE_API_BASE_URL=") ||
  API_BASE_URL.includes("VITE_ENABLE_MSW=");

if (!USE_MSW && INVALID_API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL은 https:// 로 시작하는 백엔드 주소만 설정해야 합니다.",
  );
}

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const apiPath = `/api/v1${normalizedPath}`;

  if (USE_MSW) {
    return apiPath;
  }

  return `${API_BASE_URL}${apiPath}`;
}
