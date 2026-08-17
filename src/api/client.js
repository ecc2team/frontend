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

export async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
}

export async function reissueAccessToken() {
  try {
    const response = await fetch(apiUrl("auth/reissue"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const result = await readJson(response);
    const accessToken = result?.data?.accessToken;

    if (!response.ok || !accessToken) {
      clearAuth();
      return null;
    }

    localStorage.setItem("accessToken", accessToken);
    if (result.data.userId != null) {
      localStorage.setItem("userId", String(result.data.userId));
    }
    return accessToken;
  } catch {
    clearAuth();
    return null;
  }
}

export async function authenticatedFetch(url, options = {}) {
  const request = (headers) =>
    fetch(url, {
      ...options,
      credentials: "include",
      headers,
    });

  let response = await request(authHeaders(options.headers));
  if (response.status !== 401) return response;

  const accessToken = await reissueAccessToken();
  if (!accessToken) {
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
    return response;
  }

  response = await request({
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  });

  if (response.status === 401) {
    clearAuth();
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }

  return response;
}
