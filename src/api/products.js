import { apiUrl } from "./client";

const normalizeIngredientName = (ingredient) =>
  typeof ingredient === "string"
    ? ingredient
    : ingredient?.name || ingredient?.ingredientName || ingredient?.code;

const normalizeSearchProduct = (product) => ({
  productId: product.productId ?? product.id,
  productName: product.productName ?? product.name,
  grade: product.grade ?? 0,
  warningAdditive: Boolean(product.warningAdditive),
  imageUrl: product.imageUrl ?? product.image ?? null,
  calories: product.calories ?? product.nutrition?.calories ?? null,
  weight: product.weight ?? null,
  keyIngredients: (
    product.keyIngredients ??
    product.analysis?.cautionIngredients ??
    []
  )
    .map(normalizeIngredientName)
    .filter(Boolean),
  allergicIngredients: (
    product.allergicIngredients ??
    product.analysis?.allergicIngredients ??
    []
  )
    .map(normalizeIngredientName)
    .filter(Boolean),
});

const normalizeAnalysisItem = (ingredient) => {
  if (typeof ingredient === "string") {
    return { name: ingredient, riskLevel: "GENERAL", summary: "" };
  }

  return {
    ...ingredient,
    name:
      ingredient?.name ||
      ingredient?.ingredientName ||
      ingredient?.code ||
      "성분 정보 없음",
    riskLevel: ingredient?.riskLevel || ingredient?.risk || "GENERAL",
    summary: ingredient?.summary || ingredient?.description || "",
  };
};

const normalizeAnalysis = (analysis = {}) =>
  Object.fromEntries(
    Object.entries(analysis)
      .filter(([, ingredients]) => Array.isArray(ingredients))
      .map(([group, ingredients]) => [
        group,
        ingredients.map(normalizeAnalysisItem),
      ]),
  );

const normalizeProductDetail = (product) => {
  const rawAnalysis = product.ingredientsAnalysis ?? product.analysis ?? {};
  const cautionIngredients = rawAnalysis.cautionIngredients ?? [];

  return {
    ...product,
    productId: product.productId ?? product.id,
    productName: product.productName ?? product.name,
    imageUrl: product.imageUrl ?? product.image ?? null,
    grade: product.grade ?? 0,
    warningAdditive: Boolean(product.warningAdditive),
    nutrition: product.nutrition ?? {},
    keyIngredients: (product.keyIngredients ?? cautionIngredients)
      .map(normalizeIngredientName)
      .filter(Boolean),
    ingredientsAnalysis: normalizeAnalysis(rawAnalysis),
  };
};

export async function searchProducts({ query, page = 0, size = 20, signal }) {
  const params = new URLSearchParams({
    query,
    page: String(page),
    size: String(size),
  });
  const response = await fetch(
    `${apiUrl("products/search")}?${params.toString()}`,
    { signal },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "상품 검색 중 오류가 발생했습니다.");
  }

  if (Array.isArray(result?.data)) {
    const products = result.data.map(normalizeSearchProduct);
    const totalElements = products.length;
    const totalPages =
      totalElements === 0 ? 0 : Math.ceil(totalElements / size);
    const safePage = Math.min(page, Math.max(totalPages - 1, 0));

    return {
      content: products.slice(safePage * size, safePage * size + size),
      pageInfo: {
        pageNumber: safePage,
        pageSize: size,
        totalElements,
        totalPages,
        isLast: totalPages === 0 || safePage >= totalPages - 1,
      },
    };
  }

  if (Array.isArray(result?.data?.content) && result.data.pageInfo) {
    return {
      ...result.data,
      content: result.data.content.map(normalizeSearchProduct),
    };
  }

  throw new Error("검색 결과 형식이 올바르지 않습니다.");
}

export async function getProductDetail(productId, { signal } = {}) {
  const response = await fetch(
    apiUrl(`products/${encodeURIComponent(productId)}`),
    { signal },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "상품 정보를 불러오지 못했습니다.");
  }

  if (!result?.data) {
    throw new Error("상품 상세 응답 형식이 올바르지 않습니다.");
  }

  const product = normalizeProductDetail(result.data);

  if (product.productId == null || !product.productName) {
    throw new Error("상품 상세 응답 형식이 올바르지 않습니다.");
  }

  return product;
}
