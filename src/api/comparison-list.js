import {
  apiUrl,
  authenticatedFetch,
  deduplicatedGet,
  readJson,
} from "./client";

export const MAX_COMPARISON_PRODUCTS = 50;

const requireAccessToken = () => {
  if (localStorage.getItem("accessToken")) return;

  const error = new Error("로그인이 필요한 서비스입니다.");
  error.status = 401;
  throw error;
};

const normalizeProductId = (productId) => {
  const normalizedProductId = Number(productId);

  if (!Number.isInteger(normalizedProductId) || normalizedProductId <= 0) {
    const error = new Error("유효한 상품 ID가 필요합니다.");
    error.status = 400;
    throw error;
  }

  return normalizedProductId;
};

const throwRequestError = (response, result, fallbackMessage) => {
  const error = new Error(result?.message || fallbackMessage);
  error.status = response.status;
  throw error;
};

const normalizeComparisonProduct = (product) => ({
  productId: product.productId,
  productName: product.productName,
  imageUrl: product.imageUrl ?? product.image ?? null,
  categoryCode: product.categoryCode ?? null,
  calories: Number(product.nutrition?.calories ?? product.calories) || 0,
  weight: product.weight ?? "",
  score: Number(product.score ?? 0),
  nutrition: product.nutrition ?? {},
  allergicIngredients: Array.isArray(product.allergicIngredients)
    ? product.allergicIngredients
    : [],
  warningAdditive: Boolean(product.warningAdditive),
  keyIngredients: Array.isArray(product.keyIngredients)
    ? product.keyIngredients
    : [],
});

export async function addToComparisonList(product) {
  requireAccessToken();
  const productId = normalizeProductId(product?.productId);
  const response = await authenticatedFetch(
    apiUrl(`comparison-box/${productId}`),
    { method: "POST" },
  );
  const result = await readJson(response);

  if (!response.ok) {
    throwRequestError(response, result, "비교함을 변경하지 못했습니다.");
  }

  return result;
}

export async function removeFromComparisonList(productId) {
  requireAccessToken();
  const normalizedProductId = normalizeProductId(productId);
  const response = await authenticatedFetch(
    apiUrl(`comparison-box/${normalizedProductId}`),
    { method: "DELETE" },
  );
  const result = await readJson(response);

  if (!response.ok) {
    throwRequestError(response, result, "비교함 상품을 삭제하지 못했습니다.");
  }

  return result;
}

export async function getComparisonList({ signal } = {}) {
  requireAccessToken();
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
    throwRequestError(
      response,
      result,
      "비교함 목록을 불러오지 못했습니다.",
    );
  }

  if (
    !result?.data ||
    !Array.isArray(result.data.products) ||
    typeof result.data.savedCount !== "number"
  ) {
    throw new Error("비교함 목록 응답 형식이 올바르지 않습니다.");
  }

  const products = result.data.products
    .map(normalizeComparisonProduct)
    .slice(0, MAX_COMPARISON_PRODUCTS);

  return {
    ...result.data,
    savedCount: products.length,
    products,
  };
}
