const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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

export async function searchProducts({ query, page = 0, size = 20, signal }) {
  const params = new URLSearchParams({ query });
  const response = await fetch(
    `${API_BASE_URL}/api/v1/products/search?${params.toString()}`,
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
    `${API_BASE_URL}/api/v1/products/${encodeURIComponent(productId)}`,
    { signal },
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
