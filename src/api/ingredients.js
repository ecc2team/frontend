import { apiUrl } from "./client";

export async function getIngredientDetail(code, { signal } = {}) {
  const normalizedCode = String(code ?? "").trim();

  if (!normalizedCode) {
    throw new Error("성분 코드가 없어 상세 정보를 조회할 수 없습니다.");
  }

  const response = await fetch(
    apiUrl(`ingredients/${encodeURIComponent(normalizedCode)}`),
    { signal },
  );

  let result = null;
  try {
    result = await response.json();
  } catch {
    // 오류 응답에 JSON 본문이 없는 경우도 처리합니다.
  }

  if (!response.ok) {
    throw new Error(result?.message || "성분 정보를 불러오지 못했습니다.");
  }

  if (!result?.data?.code || !result.data.name) {
    throw new Error("성분 상세 응답 형식이 올바르지 않습니다.");
  }

  return result.data;
}
