import { apiUrl, authHeaders, clearAuth, readJson } from "./client";

async function authRequest(path, options) {
  const response = await fetch(apiUrl(path), {
    ...options,
    credentials: "include",
  });
  const result = await readJson(response);

  if (!response.ok) {
    const error = new Error(result?.message || "인증 요청에 실패했습니다.");
    error.status = response.status;
    throw error;
  }

  return result;
}

export function login({ email, password }) {
  return authRequest("auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  try {
    return await authRequest("auth/logout", {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({}),
    });
  } finally {
    clearAuth();
  }
}
