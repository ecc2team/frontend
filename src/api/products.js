export async function searchProducts({ query, page = 0, size = 20, signal }) {
  const params = new URLSearchParams({
    query,
    page: String(page),
    size: String(size),
  });
  const response = await fetch(`/api/products/search?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("제품 검색 중 오류가 발생했습니다.");
  }

  const result = await response.json();
  if (
    !result?.data ||
    !Array.isArray(result.data.content) ||
    !result.data.pageInfo
  ) {
    throw new Error("검색 결과 형식이 올바르지 않습니다.");
  }

  return result.data;
}
