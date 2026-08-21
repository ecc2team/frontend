import { apiUrl } from "./config.js";

export { apiUrl };

const inFlightGetRequests = new Map();

const createAbortError = () =>
  new DOMException("The operation was aborted.", "AbortError");

const serializeHeaders = (headers = {}) =>
  [...new Headers(headers).entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => `${name}:${value}`)
    .join("|");

const subscribeToGetRequest = (request, signal) => {
  if (!signal) return request.then((response) => response.clone());
  if (signal.aborted) return Promise.reject(createAbortError());

  return new Promise((resolve, reject) => {
    const abort = () => reject(createAbortError());
    signal.addEventListener("abort", abort, { once: true });

    request.then(
      (response) => {
        signal.removeEventListener("abort", abort);
        if (signal.aborted) {
          reject(createAbortError());
          return;
        }
        resolve(response.clone());
      },
      (error) => {
        signal.removeEventListener("abort", abort);
        reject(error);
      },
    );
  });
};

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
  const redirectToLogin = () => {
    if (window.location.hash !== "#/login") {
      window.location.assign(`${import.meta.env.BASE_URL}#/login`);
    }
  };
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
    redirectToLogin();
    return response;
  }

  response = await request({
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  });

  if (response.status === 401) {
    clearAuth();
    redirectToLogin();
  }

  return response;
}

export function deduplicatedGet(
  url,
  { signal, authenticated = false, headers = {}, credentials } = {},
) {
  const authScope = authenticated
    ? `authenticated:${localStorage.getItem("accessToken") || "anonymous"}`
    : "public";
  const key = [authScope, url, credentials || "", serializeHeaders(headers)].join(
    "::",
  );

  let request = inFlightGetRequests.get(key);

  if (!request) {
    const options = {
      method: "GET",
      headers,
      ...(credentials ? { credentials } : {}),
    };
    request = (authenticated
      ? authenticatedFetch(url, options)
      : fetch(url, options)
    ).finally(() => {
      if (inFlightGetRequests.get(key) === request) {
        inFlightGetRequests.delete(key);
      }
    });
    inFlightGetRequests.set(key, request);
  }

  return subscribeToGetRequest(request, signal);
}
