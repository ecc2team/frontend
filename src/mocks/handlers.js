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
  productName: product.productName,
  grade: product.grade,
  warningAdditive: product.warningAdditive,
  keyIngredients: product.keyIngredients,

  // 실제 검색 API 명세에는 아직 없는 임시 Mock 필드
  imageUrl: product.imageUrl,
  calories: product.calories,
  weight: product.weight,
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

export const handlers = [
  http.get(apiUrl("products/recent"), () => {
    return HttpResponse.json({
      status: 200,
      message: "최근 본 상품 목록 조회가 완료되었습니다.",
      data: {
        totalElements: recentProducts.length,
        content: recentProducts,
      },
    });
  }),

  // 제품 검색
  http.get(apiUrl("products/search"), ({ request }) => {
    const url = new URL(request.url);

    const query = (url.searchParams.get("query") ?? "").trim().toLowerCase();

    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 20);

    const filteredProducts = products.filter((product) =>
      product.productName.toLowerCase().includes(query),
    );

    const startIndex = page * size;
    const content = filteredProducts
      .slice(startIndex, startIndex + size)
      .map(createSearchResult);

    const totalElements = filteredProducts.length;
    const totalPages =
      totalElements === 0 ? 0 : Math.ceil(totalElements / size);

    return HttpResponse.json({
      status: 200,
      message: "제품 검색 리스트 조회가 성공적으로 완료되었습니다.",
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
  http.get(apiUrl("profile"), () => {
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
    const { onboarding } = await request.json();
    if (!onboarding) {
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
