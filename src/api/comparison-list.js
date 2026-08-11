const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_BASE_URL;

const COMPARISON_LIST_PATH = "/api/v1/comparison-box";

export async function getComparisonList({ signal } = {}) {
  const response = await fetch(`${API_BASE_URL}${COMPARISON_LIST_PATH}`, {
    method: "GET",
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
