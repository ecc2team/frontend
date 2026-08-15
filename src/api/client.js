const API_BASE_URL = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_BASE_URL ?? "");

if (!import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL 환경변수가 설정되지 않았습니다. 배포 설정을 확인하세요.",
  );
}

export function apiUrl(path) {
  return `${API_BASE_URL}/api/v1/${path}`;
}
