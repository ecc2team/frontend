import { apiUrl, deduplicatedGet, readJson } from "./client";

const normalizeRecommendation = (product) => ({
  productId: product.productId,
  productName: product.name,
  imageUrl: product.imageUrl ?? product.image ?? null,
  score: product.score,
  calories: product.calories,
  sugar: product.sugar,
  warningAdditive: Boolean(product.warningAdditive),
  viewCount: product.viewCount,
  matchedPreference: Boolean(product.matchedPreference),
});

export async function getRecommendations({ size = 20, signal } = {}) {
  const params = new URLSearchParams({ size: String(size) });
  const response = await deduplicatedGet(
    `${apiUrl("products/recommendations")}?${params.toString()}`,
    { authenticated: true, signal },
  );
  const result = await readJson(response);

  if (!response.ok) {
    throw new Error(result?.message || "추천 상품을 불러오지 못했습니다.");
  }

  if (!Array.isArray(result?.data?.content)) {
    throw new Error("추천 상품 응답 형식이 올바르지 않습니다.");
  }

  return result.data.content
    .map(normalizeRecommendation)
    .filter((product) => product.productId != null && product.productName);
}
