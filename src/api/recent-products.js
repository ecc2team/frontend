import {
  apiUrl,
  authenticatedFetch,
  deduplicatedGet,
  readJson,
} from "./client";

const recentProductRecordRequests = new Map();

const normalizeProductId = (productId) => {
  const normalizedProductId = Number(productId);

  if (!Number.isInteger(normalizedProductId) || normalizedProductId <= 0) {
    const error = new Error("유효한 상품 ID가 필요합니다.");
    error.status = 400;
    throw error;
  }

  return normalizedProductId;
};

const requireAccessToken = () => {
  if (localStorage.getItem("accessToken")) return;

  const error = new Error("로그인이 필요한 서비스입니다.");
  error.status = 401;
  throw error;
};

const throwRequestError = (response, result, fallbackMessage) => {
  const error = new Error(result?.message || fallbackMessage);
  error.status = response.status;
  throw error;
};

const normalizeRecentProduct = (product) => ({
  productId: product.productId,
  productName: product.productName,
  dietaryTags: Array.isArray(product.dietaryTags) ? product.dietaryTags : [],
  riskLevel: product.riskLevel ?? "SAFE",
  viewedAt: product.viewedAt,
});

export async function getRecentProducts({ signal } = {}) {
  requireAccessToken();
  const response = await deduplicatedGet(apiUrl("users/me/recent-products"), {
    authenticated: true,
    signal,
  });
  const result = await readJson(response);

  if (!response.ok) {
    throwRequestError(
      response,
      result,
      "최근 조회 상품을 불러오지 못했습니다.",
    );
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

export function recordRecentProduct(productId) {
  requireAccessToken();
  const normalizedProductId = normalizeProductId(productId);
  const requestKey = String(normalizedProductId);
  const pendingRequest = recentProductRecordRequests.get(requestKey);
  if (pendingRequest) return pendingRequest;

  const request = authenticatedFetch(
    apiUrl(`users/me/recent-products/${normalizedProductId}`),
    { method: "POST" },
  )
    .then(async (response) => {
      const result = await readJson(response);
      if (!response.ok) {
        throwRequestError(
          response,
          result,
          "최근 조회 기록을 저장하지 못했습니다.",
        );
      }
      return result;
    })
    .finally(() => {
      if (recentProductRecordRequests.get(requestKey) === request) {
        recentProductRecordRequests.delete(requestKey);
      }
    });

  recentProductRecordRequests.set(requestKey, request);
  return request;
}

export async function deleteRecentProduct(productId) {
  requireAccessToken();
  const normalizedProductId = normalizeProductId(productId);
  const response = await authenticatedFetch(
    apiUrl(`users/me/recent-products/${normalizedProductId}`),
    { method: "DELETE" },
  );
  const result = await readJson(response);

  if (!response.ok) {
    throwRequestError(
      response,
      result,
      "최근 조회 상품을 삭제하지 못했습니다.",
    );
  }

  return result;
}
