export const KAKAO_REDIRECT_URI =
  import.meta.env.VITE_KAKAO_REDIRECT_URI ||
  "http://localhost:5173/oauth/kakao/callback";

export const GOOGLE_REDIRECT_URI =
  import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
  "http://localhost:5173/oauth/google/callback";

const KAKAO_CLIENT_ID =
  import.meta.env.VITE_KAKAO_CLIENT_ID || "ace6fb539c9055d7eb1ee8db56a80583";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "139516819304-m3b6lrciifch2sm9mtekpuarqltmh079.apps.googleusercontent.com";

export const OAUTH_CONFIG = {
  kakao: {
    redirectUri: KAKAO_REDIRECT_URI,
    authorizeUrl:
      "https://kauth.kakao.com/oauth/authorize" +
      `?client_id=${encodeURIComponent(KAKAO_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}` +
      "&response_type=code",
  },

  google: {
    redirectUri: GOOGLE_REDIRECT_URI,
    authorizeUrl:
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
      "&response_type=code&scope=email%20profile",
  },
};

export function startOAuth(provider) {
  const config = OAUTH_CONFIG[provider];
  if (!config) throw new Error("지원하지 않는 소셜 로그인입니다.");
  window.location.href = config.authorizeUrl;
}
