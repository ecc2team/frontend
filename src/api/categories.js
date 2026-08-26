import { apiUrl, deduplicatedGet, readJson } from "./client";

let categoriesCache;
let categoriesRequest;

const normalizeCategoryProduct = (product) => ({
  ...product,
  productId: product.productId ?? product.id,
  productName: product.productName ?? product.name,
  score: Number(product.score ?? 0),
  calories: product.calories ?? product.nutrition?.calories ?? null,
  sugar: product.sugar ?? product.nutrition?.sugar ?? null,
  warningAdditive: Boolean(product.warningAdditive),
  keyIngredients: Array.isArray(product.keyIngredients)
    ? product.keyIngredients
    : [],
  viewCount: Number(product.viewCount ?? 0),
  imageUrl: product.imageUrl ?? product.image ?? null,
});

async function categoryGet(path, { signal } = {}) {
  const response = await deduplicatedGet(apiUrl(path), { signal });
  const result = await readJson(response);

  if (!response.ok) {
    throw new Error(result?.message || "카테고리 정보를 불러오지 못했습니다.");
  }

  return result?.data;
}

export function getCategories() {
  if (categoriesCache) return Promise.resolve(categoriesCache);
  if (categoriesRequest) return categoriesRequest;

  categoriesRequest = categoryGet("categories")
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new Error("카테고리 목록 응답 형식이 올바르지 않습니다.");
      }
      categoriesCache = data;
      return data;
    })
    .finally(() => {
      categoriesRequest = undefined;
    });

  return categoriesRequest;
}

export async function getCategoryProducts(
  categoryCode,
  page = 0,
  size = 20,
  sort = "recommended",
  options,
) {
  const { keyword = "", ...requestOptions } = options ?? {};
  const params = new URLSearchParams();
  if (keyword.trim()) params.set("keyword", keyword.trim());
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("sort", sort);
  const data = await categoryGet(
    `categories/${encodeURIComponent(categoryCode)}/products?${params}`,
    requestOptions,
  );

  if (!Array.isArray(data?.content) || !data?.pageInfo) {
    throw new Error("카테고리 상품 응답 형식이 올바르지 않습니다.");
  }
  return {
    ...data,
    content: data.content.map(normalizeCategoryProduct),
  };
}

export async function getCategoryBestProducts(
  categoryCode,
  size = 5,
  options,
) {
  const params = new URLSearchParams({ size: String(size) });
  const data = await categoryGet(
    `categories/${encodeURIComponent(categoryCode)}/best?${params}`,
    options,
  );

  if (!Array.isArray(data)) {
    throw new Error("카테고리 베스트 응답 형식이 올바르지 않습니다.");
  }
  return data.map(normalizeCategoryProduct);
}
