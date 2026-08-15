import { apiUrl } from "./config.js";

export { apiUrl };

export function authHeaders(headers = {}) {
  const accessToken = localStorage.getItem("accessToken");

  return accessToken
    ? {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      }
    : headers;
}
