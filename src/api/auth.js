import { apiUrl, authHeaders, clearAuth, readJson } from "./client";
import { OAUTH_CONFIG } from "../config/oauth";

const socialCallbackRequests = new Map();

const toOptionalNumber = (value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

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

function loginWithSocial(provider, authCode) {
  const config = OAUTH_CONFIG[provider];
  if (!config || !authCode) {
    return Promise.reject(new Error("소셜 로그인 정보가 올바르지 않습니다."));
  }

  const requestKey = `${provider}:${authCode}`;
  let request = socialCallbackRequests.get(requestKey);

  if (!request) {
    request = authRequest(`auth/${provider}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authCode,
        redirectUri: config.redirectUri,
      }),
    });
    socialCallbackRequests.set(requestKey, request);
  }

  return request;
}

export function loginWithKakao(authCode) {
  return loginWithSocial("kakao", authCode);
}

export function loginWithGoogle(authCode) {
  return loginWithSocial("google", authCode);
}

export function submitSocialOnboarding(onboarding) {
  const profile = onboarding.profile ?? {};
  const height = toOptionalNumber(profile.height);
  const weight = toOptionalNumber(profile.weight);
  const normalizedProfile = {
    gender: profile.gender || "NONE",
    ...(profile.birthDate ? { birthDate: profile.birthDate } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(weight !== undefined ? { weight } : {}),
    ...(profile.activityLevel
      ? { activityLevel: profile.activityLevel }
      : {}),
  };
  return authRequest("auth/onboarding", {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      profile: normalizedProfile,
      preferredCategories: onboarding.preferredCategories ?? [],
      dislikedIngredients: onboarding.dislikedIngredients ?? [],
      allergyFlags: onboarding.allergyFlags ?? [],
    }),
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
