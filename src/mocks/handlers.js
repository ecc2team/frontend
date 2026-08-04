import { http, HttpResponse } from "msw";

const productDetails = {
  1023: {
    status: 200,
    message: "제품 상세 및 성분 분석 결과 조회가 완료되었습니다.",
    data: {
      productId: 1023,
      productName: "코카콜라 제로",
      grade: 2,
      warningAdditive: true,
      nutrition: {
        calories: 0,
        sugar: 0,
        sodium: 15,
      },
      ingredientsAnalysis: {
        sweeteners: [
          {
            name: "수크랄로스",
            riskLevel: "GENERAL",
            summary: "일반적인 2등급 대체당",
          },
        ],
        additives: [
          {
            name: "카라멜색소",
            riskLevel: "WARNING",
            summary: "주의가 필요한 첨가물",
          },
        ],
      },
    },
  },
};

export const handlers = [
  http.get("/api/products/:productId", ({ params }) => {
    const product = productDetails[params.productId];

    if (!product) {
      return HttpResponse.json(
        {
          status: 404,
          message: "해당 제품을 찾을 수 없습니다.",
          data: null,
        },
        { status: 404 },
      );
    }

    return HttpResponse.json(product);
  }),
];
