import { apiUrl, deduplicatedGet, readJson } from "./client";

const normalizeRecentProduct = (product) => ({
  productId: product.productId,
  productName: product.productName,
  dietaryTags: Array.isArray(product.dietaryTags) ? product.dietaryTags : [],
  riskLevel: product.riskLevel ?? "SAFE",
  viewedAt: product.viewedAt,
});

export async function getRecentProducts({ signal } = {}) {
  const response = await deduplicatedGet(apiUrl("products/recent"), {
    authenticated: true,
    signal,
  });
  const result = await readJson(response);

  if (!response.ok) {
    throw new Error(result?.message || "최근 조회 상품을 불러오지 못했습니다.");
  }

  if (!result?.data || !Array.isArray(result.data.content)) {
    throw new Error("최근 조회 상품 응답 형식이 올바르지 않습니다.");
  }

  const content = result.data.content
    .map(normalizeRecentProduct)
    .filter((product) => product.productId != null && product.productName)
    .sort((left, right) =>
      String(right.viewedAt ?? "").localeCompare(String(left.viewedAt ?? "")),
    );

  return {
    totalElements: Number(result.data.totalElements) || content.length,
    content,
  };
}
