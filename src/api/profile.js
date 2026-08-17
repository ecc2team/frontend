import { apiUrl, deduplicatedGet } from "./client";

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
