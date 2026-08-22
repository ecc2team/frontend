import { http, HttpResponse } from "msw";
import { apiUrl } from "../api/client.js";
import { products } from "./data/products.js";
import { ingredients } from "./data/ingredients.js";
import { profile } from "./data/profile.js";
import {
  comparisonProducts,
  MAX_COMPARISON_PRODUCTS,
} from "./data/comparisonProducts.js";
import { mockUser, mockTokens } from "./data/mockUser.js";
import { recentProducts } from "./data/recentProducts.js";
import { DEFAULT_CATEGORIES } from "../data/categories.js";

// TODO: Swagger의 실제 endpoint로 변경
const SIGNUP_PATH = apiUrl("auth/signup");
const LOGIN_PATH = apiUrl("auth/login");
const MOCK_EMAIL_CODE = "123456";

const socialCallback = async ({ request }) => {
  const { authCode, redirectUri } = await request.json();
  if (!authCode || !redirectUri) {
    return HttpResponse.json(
      { status: 400, message: "OAuth 요청 정보가 올바르지 않습니다.", data: null },
      { status: 400 },
    );
  }

  return HttpResponse.json({
    status: 200,
    message: "소셜 로그인이 완료되었습니다.",
    data: {
      userId: mockUser.userId,
      accessToken: mockTokens.accessToken,
      isNewUser: true,
      email: mockUser.email,
      nickname: mockUser.nickname,
    },
  });
};

const createSearchResult = (product) => ({
  productId: product.productId,
  name: product.productName,
  score: product.score,
  viewCount: product.viewCount,
  imageUrl: product.imageUrl,
  summary: product.summary ?? "",
  nutrition: product.nutrition ?? {},
  ingredientsAnalysis: product.ingredientsAnalysis ?? {},
});

const createProductDetail = (product) => ({
  productId: product.productId,
  productName: product.productName,
  score: product.score ?? 0,
  viewCount: product.viewCount ?? 0,
  summary: product.summary ?? "주요 성분 정보가 없습니다.",
  image: product.image ?? product.imageUrl ?? null,
  warningAdditive: product.warningAdditive,
  nutrition: product.nutrition,
  ingredientsAnalysis: product.ingredientsAnalysis,
});

const getMockCategoryProducts = (categoryCode) => {
  if (categoryCode === "DRINK") return products.slice(0, 2);
  if (categoryCode === "SNACK") return products.slice(2, 3);
  if (categoryCode === "CHOCOLATE") return products.slice(3);
  return [];
};

export const handlers = [
  http.get(apiUrl("users/me/recent-products"), () => {
    return HttpResponse.json({
      status: 200,
      message: "최근 본 상품 목록 조회가 완료되었습니다.",
      data: {
        totalElements: recentProducts.length,
        content: recentProducts,
      },
    });
  }),

  http.post(apiUrl("users/me/recent-products/:productId"), ({ params }) => {
    const productId = Number(params.productId);
    const product = products.find((item) => item.productId === productId);

    if (product) {
      const existingIndex = recentProducts.findIndex(
        (item) => item.productId === productId,
      );
      if (existingIndex >= 0) recentProducts.splice(existingIndex, 1);
      recentProducts.unshift({
        productId,
        productName: product.productName,
        dietaryTags: [],
        riskLevel: product.warningAdditive ? "CAUTION" : "SAFE",
        viewedAt: new Date().toISOString(),
      });
    }

    return HttpResponse.json({ status: 200, message: "최근 조회 기록 저장 완료" });
  }),

  http.delete(apiUrl("users/me/recent-products/:productId"), ({ params }) => {
    const productId = Number(params.productId);
    const index = recentProducts.findIndex(
      (item) => item.productId === productId,
    );
    if (index >= 0) recentProducts.splice(index, 1);

    return HttpResponse.json({ status: 200, message: "최근 조회 상품 삭제 완료" });
  }),

  // 제품 검색
  http.get(apiUrl("products/search"), ({ request }) => {
    const url = new URL(request.url);

    const keyword = (url.searchParams.get("keyword") ?? "")
      .trim()
      .toLowerCase();

    const filteredProducts = products.filter((product) =>
      product.productName.toLowerCase().includes(keyword),
    );

    return HttpResponse.json({
      status: 200,
      message: "제품 검색 리스트 조회가 성공적으로 완료되었습니다.",
      data: filteredProducts.map(createSearchResult),
    });
  }),

  http.get(apiUrl("categories"), () => {
    return HttpResponse.json({
      status: 200,
      message: "카테고리 목록 조회 성공",
      data: DEFAULT_CATEGORIES,
    });
  }),

  http.get(apiUrl("categories/:category/best"), ({ params, request }) => {
    const categoryCode = String(params.category).toUpperCase();
    const size = Number(new URL(request.url).searchParams.get("size") ?? 5);
    const data = getMockCategoryProducts(categoryCode)
      .slice()
      .sort((left, right) => Number(right.score) - Number(left.score))
      .slice(0, size)
      .map((product, index) => ({
        rank: index + 1,
        productId: product.productId,
        productName: product.productName,
        score: Number(product.score ?? 0),
        viewCount: Number(product.viewCount ?? 0),
        warningAdditive: Boolean(product.warningAdditive),
      }));

    return HttpResponse.json({
      status: 200,
      message: "카테고리 베스트 랭킹 조회가 성공적으로 완료되었습니다.",
      data,
    });
  }),

  http.get(apiUrl("categories/:category/products"), ({ params, request }) => {
    const categoryCode = String(params.category).toUpperCase();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 20);
    const keyword = (url.searchParams.get("keyword") ?? "").toLowerCase();
    const sort = url.searchParams.get("sort") ?? "recommended";
    const categoryProducts = getMockCategoryProducts(categoryCode)
      .filter((product) => product.productName.toLowerCase().includes(keyword))
      .slice();
    if (sort === "latest") {
      categoryProducts.sort((left, right) => right.productId - left.productId);
    } else if (sort === "name") {
      categoryProducts.sort((left, right) =>
        left.productName.localeCompare(right.productName, "ko-KR"),
      );
    } else if (sort === "popular" || sort === "views") {
      categoryProducts.sort(
        (left, right) => Number(right.viewCount) - Number(left.viewCount),
      );
    }
    const totalElements = categoryProducts.length;
    const totalPages = totalElements ? Math.ceil(totalElements / size) : 0;
    const content = categoryProducts.slice(page * size, page * size + size);

    return HttpResponse.json({
      status: 200,
      message: "카테고리 상품 목록 조회가 완료되었습니다.",
      data: {
        content,
        pageInfo: {
          pageNumber: page,
          pageSize: size,
          totalElements,
          totalPages,
          isLast: totalPages === 0 || page >= totalPages - 1,
        },
      },
    });
  }),

  // 제품 상세 조회
  http.get(apiUrl("products/:productId"), ({ params }) => {
    const productId = Number(params.productId);

    const product = products.find((item) => item.productId === productId);

    if (!product) {
      return HttpResponse.json(
        {
          status: 404,
          message: "해당 제품을 찾을 수 없습니다.",
          data: null,
        },
        {
          status: 404,
        },
      );
    }

    return HttpResponse.json({
      status: 200,
      message: "제품 상세 및 성분 분석 결과 조회가 완료되었습니다.",
      data: createProductDetail(product),
    });
  }),

  // 프로필 조회 Mock
  http.get(apiUrl("users/me"), () => {
    return HttpResponse.json({
      status: 200,
      message: "프로필 조회가 성공적으로 완료되었습니다.",
      data: profile,
    });
  }),

  // 비교함 목록 조회 Mock
  http.get(apiUrl("comparison-box"), () => {
    const products = comparisonProducts.slice(0, MAX_COMPARISON_PRODUCTS);

    return HttpResponse.json({
      status: 200,
      message: "내 비교함 목록 조회가 완료되었습니다.",
      data: {
        savedCount: products.length,
        products,
      },
    });
  }),

  http.post(apiUrl("comparison-box/toggle"), async ({ request }) => {
    const { productId: rawProductId } = await request.json();
    const productId = Number(rawProductId);
    const existingIndex = comparisonProducts.findIndex(
      (item) => item.productId === productId,
    );

    if (existingIndex >= 0) {
      comparisonProducts.splice(existingIndex, 1);
    } else if (comparisonProducts.length < MAX_COMPARISON_PRODUCTS) {
      const product = products.find((item) => item.productId === productId);
      if (product) comparisonProducts.push(product);
    }

    return HttpResponse.json({ status: 200, message: "비교함 변경 완료" });
  }),

  http.delete(apiUrl("comparison-box/products/:productId"), ({ params }) => {
    const productId = Number(params.productId);
    const index = comparisonProducts.findIndex(
      (item) => item.productId === productId,
    );
    if (index >= 0) comparisonProducts.splice(index, 1);

    return HttpResponse.json({ status: 200, message: "비교함 상품 삭제 완료" });
  }),

  http.get(apiUrl("users/check-email"), ({ request }) => {
    const email = new URL(request.url).searchParams.get("email") || "";
    return HttpResponse.json({
      status: 200,
      message: "이메일 중복 확인이 완료되었습니다.",
      data: { email, isAvailable: email !== mockUser.email },
    });
  }),

  http.post(apiUrl("emails/send-code"), async ({ request }) => {
    const { email } = await request.json();
    if (!email) {
      return HttpResponse.json(
        { status: 400, message: "이메일을 입력해주세요.", data: null },
        { status: 400 },
      );
    }
    return HttpResponse.json({
      status: 200,
      message: "이메일 인증번호가 발송되었습니다.",
      data: null,
    });
  }),

  http.post(apiUrl("emails/verify-code"), async ({ request }) => {
    const { email, code } = await request.json();
    const emailVerified = Boolean(email) && code === MOCK_EMAIL_CODE;
    return HttpResponse.json(
      {
        status: emailVerified ? 200 : 400,
        message: emailVerified
          ? "이메일 인증에 성공하였습니다."
          : "인증번호가 올바르지 않습니다.",
        data: { emailVerified },
      },
      { status: emailVerified ? 200 : 400 },
    );
  }),

  http.post(apiUrl("users/find-account"), async ({ request }) => {
    const { email } = await request.json();
    if (!email) {
      return HttpResponse.json(
        { status: 400, message: "이메일을 입력해주세요.", data: null },
        { status: 400 },
      );
    }
    return HttpResponse.json({
      status: 200,
      message: "가입된 계정을 찾았습니다.",
      data: { userId: mockUser.userId, email, provider: "LOCAL" },
    });
  }),

  http.post(apiUrl("users/reset-pw"), async ({ request }) => {
    const { email, newPassword } = await request.json();
    if (!email || !newPassword) {
      return HttpResponse.json(
        { status: 400, message: "이메일과 새 비밀번호를 입력해주세요.", data: null },
        { status: 400 },
      );
    }
    return HttpResponse.json({
      status: 200,
      message: "비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.",
      data: null,
    });
  }),

  // 회원가입 Mock
  http.get(apiUrl("ingredients"), () => {
    return HttpResponse.json({
      message: "성분 목록 조회 성공",
      data: ingredients,
      status: 200,
    });
  }),

  http.get(apiUrl("ingredients/:code"), ({ params }) => {
    const code = String(params.code).toUpperCase();
    const ingredient = ingredients.find((item) => item.code === code);

    if (!ingredient) {
      return HttpResponse.json(
        {
          message: "해당 성분 정보를 찾을 수 없습니다.",
          data: null,
          status: 404,
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      message: "성분 상세 정보 조회가 완료되었습니다.",
      data: {
        ...ingredient,
        description: ingredient.summary,
      },
      status: 200,
    });
  }),

  http.post(apiUrl("auth/kakao"), socialCallback),
  http.post(apiUrl("auth/google"), socialCallback),

  http.post(apiUrl("auth/onboarding"), async ({ request }) => {
    const onboarding = await request.json();
    if (
      typeof onboarding.profile !== "object" ||
      !Array.isArray(onboarding.preferredCategories) ||
      !Array.isArray(onboarding.dislikedIngredients) ||
      !Array.isArray(onboarding.allergyFlags)
    ) {
      return HttpResponse.json(
        { status: 400, message: "온보딩 정보가 없습니다.", data: null },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      status: 200,
      message: "맞춤 취향 설정이 완료되었습니다.",
      data: { userId: mockUser.userId },
    });
  }),

  http.post(SIGNUP_PATH, async ({ request }) => {
    const body = await request.json();

    const { email, password, nickname, onboarding } = body;

    if (!email || !password || !nickname) {
      return HttpResponse.json(
        {
          status: 400,
          message: "필수 회원가입 정보가 누락되었습니다.",
          data: null,
        },
        {
          status: 400,
        },
      );
    }

    return HttpResponse.json(
      {
        status: 201,
        message: "회원가입이 성공적으로 완료되었습니다.",
        data: {
          userId: mockUser.userId,
          email,
          nickname,
          onboarding,
        },
      },
      {
        status: 201,
      },
    );
  }),

  // 로그인 Mock
  http.post(LOGIN_PATH, async ({ request }) => {
    const body = await request.json();

    const { email, password } = body;

    if (email !== mockUser.email || password !== mockUser.password) {
      return HttpResponse.json(
        {
          status: 401,
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
          data: null,
        },
        {
          status: 401,
        },
      );
    }

    return HttpResponse.json({
      status: 200,
      message: "로그인이 성공적으로 완료되었습니다.",
      data: {
        userId: mockUser.userId,
        accessToken: mockTokens.accessToken,
      },
    });
  }),

  http.post(apiUrl("auth/reissue"), () => {
    return HttpResponse.json({
      status: 200,
      message: "Access Token이 재발급되었습니다.",
      data: {
        userId: mockUser.userId,
        accessToken: `${mockTokens.accessToken}-reissued`,
      },
    });
  }),

  http.post(apiUrl("auth/logout"), () => {
    return HttpResponse.json({
      status: 200,
      message: "로그아웃이 완료되었습니다.",
      data: null,
    });
  }),
];
