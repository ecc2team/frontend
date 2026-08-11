const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function searchProducts({ query, page = 0, size = 20, signal }) {
  const params = new URLSearchParams({
    query,
    page: String(page),
    size: String(size),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/products/search?${params.toString()}`,
    {
      signal,
    },
  );

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

export async function getProductDetail(productId, { signal } = {}) {
  const response = await fetch(
    `${API_BASE_URL}/api/products/${encodeURIComponent(productId)}`,
    {
      signal,
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "상품 정보를 불러오지 못했습니다.");
  }

  if (
    !result?.data ||
    result.data.productId == null ||
    !result.data.productName
  ) {
    throw new Error("상품 상세 응답 형식이 올바르지 않습니다.");
  }

  return result.data;
}
