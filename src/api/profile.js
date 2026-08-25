import {
  apiUrl,
  authenticatedFetch,
  deduplicatedGet,
  readJson,
} from "./client";

export const GENDER_LABELS = {
  MALE: "남성",
  FEMALE: "여성",
  NONE: "선택 안 함",
  PREFER_NOT_TO_SAY: "선택 안 함",
};

export const ACTIVITY_LEVEL_LABELS = {
  SEDENTARY: "주로 앉아서 생활",
  LIGHTLY_ACTIVE: "가벼운 활동",
  MODERATELY_ACTIVE: "보통 수준의 활동",
  VERY_ACTIVE: "많은 활동",
  EXTRA_ACTIVE: "매우 많은 활동",
};

const normalizeProfile = (profile) => ({
  id: profile.id,
  email: profile.email ?? "",
  nickname: profile.nickname ?? "",
  provider: profile.provider ?? "",
  gender: profile.gender ?? "NONE",
  birthDate: profile.birthDate ?? "",
  height: profile.height ?? null,
  weight: profile.weight ?? null,
  activityLevel: profile.activityLevel ?? "",
  preferredCategories: Array.isArray(profile.preferredCategories)
    ? profile.preferredCategories
    : [],
  dislikedIngredients: Array.isArray(profile.dislikedIngredients)
    ? profile.dislikedIngredients
    : [],
  allergyFlags: Array.isArray(profile.allergyFlags) ? profile.allergyFlags : [],
});

export async function getProfile({ signal } = {}) {
  if (!localStorage.getItem("accessToken")) {
    const error = new Error("로그인이 필요한 서비스입니다.");
    error.status = 401;
    throw error;
  }

  const response = await deduplicatedGet(apiUrl("users/me"), {
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
    const error = new Error(
      response.status >= 500
        ? "프로필 정보를 불러오지 못했습니다."
        : result?.message || "프로필을 불러오지 못했습니다.",
    );
    error.status = response.status;
    throw error;
  }

  if (!result?.data) {
    throw new Error("프로필 응답 형식이 올바르지 않습니다.");
  }

  return normalizeProfile(result.data);
}

export async function getNutritionTarget({ signal } = {}) {
  const response = await deduplicatedGet(
    apiUrl("users/me/nutrition-target"),
    {
      authenticated: true,
      signal,
    },
  );
  const result = await readJson(response);

  if (!response.ok) {
    const error = new Error(
      result?.message || "권장 섭취량을 불러오지 못했습니다.",
    );
    error.status = response.status;
    throw error;
  }

  if (!result?.data) {
    throw new Error("권장 섭취량 응답 형식이 올바르지 않습니다.");
  }

  return result.data;
}

const toNullableNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export async function updateProfilePreferences({
  profile,
  preferredCategories,
  dislikedIngredients,
  allergyFlags,
}) {
  const response = await authenticatedFetch(apiUrl("users/me/preferences"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile: {
        gender: profile.gender,
        birthDate: profile.birthDate || null,
        height: toNullableNumber(profile.height),
        weight: toNullableNumber(profile.weight),
        activityLevel: profile.activityLevel,
      },
      preferredCategories,
      dislikedIngredients,
      allergyFlags,
    }),
  });
  const result = await readJson(response);

  if (!response.ok) {
    const error = new Error(
      result?.message || "프로필 설정을 저장하지 못했습니다.",
    );
    error.status = response.status;
    throw error;
  }

  if (result?.status !== 200) {
    throw new Error(
      result?.message || "취향 설정 저장 응답이 올바르지 않습니다.",
    );
  }

  return result;
}
