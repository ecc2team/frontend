import { apiUrl, readJson } from "./client";

async function accountRequest(path, body) {
  const response = await fetch(apiUrl(path), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await readJson(response);

  if (!response.ok) {
    const error = new Error(result?.message || "요청을 처리하지 못했습니다.");
    error.status = response.status;
    throw error;
  }

  return result;
}

export function findAccount(email) {
  return accountRequest("users/find-account", { email });
}

export function resetPassword(email, newPassword) {
  return accountRequest("users/reset-pw", { email, newPassword });
}
