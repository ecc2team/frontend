import { http, HttpResponse } from "msw";
import { apiUrl } from "../api/client.js";
import { products } from "./data/products.js";
import { profile } from "./data/profile.js";
import {
  comparisonProducts,
  MAX_COMPARISON_PRODUCTS,
} from "./data/comparisonProducts.js";
import { mockUser, mockTokens } from "./data/mockUser.js";

// TODO: Swagger의 실제 endpoint로 변경
const SIGNUP_PATH = "/실제-회원가입-endpoint";
const LOGIN_PATH = "/실제-로그인-endpoint";

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
  imageUrl: product.imageUrl,
  calories: product.calories,
  weight: product.weight,
  keyIngredients: product.keyIngredients,
  grade: product.grade,
  warningAdditive: product.warningAdditive,
  nutrition: product.nutrition,
  ingredientsAnalysis: product.ingredientsAnalysis,
});

export const handlers = [
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

  // 회원가입 Mock
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
        refreshToken: mockTokens.refreshToken,
      },
    });
  }),
];
