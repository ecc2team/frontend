import {
  apiUrl,
  authenticatedFetch,
  deduplicatedGet,
  readJson,
} from "./client";

export async function getProfile({ signal } = {}) {
  const response = await deduplicatedGet(apiUrl("profile"), {
    authenticated: true,
    signal,
  });

  let result = null;
  try {
    result = await response.json();
  } catch {
    // 응답 본문이 없는 오류도 상태 코드에 맞게 처리합니다.
  }

  if (!response.ok) {
    throw new Error(result?.message || "프로필을 불러오지 못했습니다.");
  }

  if (!result?.data) {
    throw new Error("프로필 응답 형식이 올바르지 않습니다.");
  }

  return result.data;
}

export async function updateProfilePreferences(preferences) {
  const response = await authenticatedFetch(apiUrl("users/me/preferences"), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      preferredCategories: preferences.preferredCategories,
      dislikedIngredients: preferences.dislikedIngredients,
      allergyFlags: preferences.allergyFlags,
    }),
  });
  const result = await readJson(response);

  if (!response.ok) {
    throw new Error(result?.message || "취향 설정을 저장하지 못했습니다.");
  }

  if (result?.status !== 200) {
    throw new Error(
      result?.message || "취향 설정 저장 응답이 올바르지 않습니다.",
    );
  }

  return result;
}
