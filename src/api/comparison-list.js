import { apiUrl, deduplicatedGet } from "./client";

export const MAX_COMPARISON_PRODUCTS = 50;

const getStorageKey = () =>
  `zeropick:comparison-products:${localStorage.getItem("userId") || "current"}`;

const readLocalComparisonProducts = () => {
  try {
    const products = JSON.parse(localStorage.getItem(getStorageKey()) || "[]");
    return Array.isArray(products) ? products : [];
  } catch {
    return [];
  }
};

const normalizeComparisonProduct = (product) => ({
  productId: product.productId,
  productName: product.productName,
  imageUrl: product.imageUrl ?? null,
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

export function addToComparisonList(product) {
  const products = readLocalComparisonProducts();
  const productId = product.productId;

  if (products.some((item) => item.productId === productId)) {
    return { status: "duplicate", products };
  }

  if (products.length >= MAX_COMPARISON_PRODUCTS) {
    return { status: "full", products };
  }

  const nextProducts = [...products, normalizeComparisonProduct(product)];
  localStorage.setItem(getStorageKey(), JSON.stringify(nextProducts));
  return { status: "added", products: nextProducts };
}

export function removeFromLocalComparisonList(productId) {
  const products = readLocalComparisonProducts();
  localStorage.setItem(
    getStorageKey(),
    JSON.stringify(products.filter((item) => item.productId !== productId)),
  );
}

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

  const mergedProducts = new Map(
    result.data.products.map((product) => [product.productId, product]),
  );
  readLocalComparisonProducts().forEach((product) => {
    mergedProducts.set(product.productId, product);
  });
  const products = [...mergedProducts.values()].slice(
    0,
    MAX_COMPARISON_PRODUCTS,
  );

  return {
    ...result.data,
    savedCount: products.length,
    products,
  };
}
