import { apiUrl, deduplicatedGet } from "./client";

export async function getComparisonList({ signal } = {}) {
  const response = await deduplicatedGet(apiUrl("comparison-box"), {
    authenticated: true,
    signal,
  });

  let result = null;

  try {
    result = await response.json();
  } catch {
    // 응답 body가 비어 있는 경우
  }

  if (!response.ok) {
    throw new Error(result?.message || "비교함 목록을 불러오지 못했습니다.");
  }

  if (
    !result?.data ||
    !Array.isArray(result.data.products) ||
    typeof result.data.savedCount !== "number"
  ) {
    throw new Error("비교함 목록 응답 형식이 올바르지 않습니다.");
  }

  return result.data;
}
