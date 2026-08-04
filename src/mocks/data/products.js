export const products = [
  {
    productId: 1023,
    productName: "코카콜라 제로",

    // 검색 결과 화면용 임시 필드
    imageUrl: "/images/products/coca-cola-zero.png",
    calories: 0,
    weight: "355ml",

    // 검색·상세 공통 필드
    grade: 2,
    warningAdditive: true,
    keyIngredients: ["수크랄로스", "아세설팜칼륨"],

    // 상세 페이지용 필드
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
          summary: "일반적인 대체 감미료입니다.",
        },
        {
          name: "아세설팜칼륨",
          riskLevel: "GENERAL",
          summary: "단맛을 내기 위해 사용되는 대체 감미료입니다.",
        },
      ],
      additives: [
        {
          name: "카라멜색소",
          riskLevel: "WARNING",
          summary: "주의가 필요한 첨가물입니다.",
        },
      ],
    },
  },

  {
    productId: 1024,
    productName: "칠성사이다 제로",

    imageUrl: "/images/products/chilsung-cider-zero.png",
    calories: 0,
    weight: "355ml",

    grade: 1,
    warningAdditive: false,
    keyIngredients: ["에리스리톨", "스테비올배당체"],

    nutrition: {
      calories: 0,
      sugar: 0,
      sodium: 8,
    },
    ingredientsAnalysis: {
      sweeteners: [
        {
          name: "에리스리톨",
          riskLevel: "SAFE",
          summary: "당류 대신 단맛을 내는 당알코올 성분입니다.",
        },
        {
          name: "스테비올배당체",
          riskLevel: "SAFE",
          summary: "스테비아에서 유래한 감미료입니다.",
        },
      ],
      additives: [
        {
          name: "구연산",
          riskLevel: "GENERAL",
          summary: "산미를 조절하기 위해 사용됩니다.",
        },
      ],
    },
  },

  {
    productId: 2011,
    productName: "저당 초코 단백질바",

    imageUrl: "/images/products/low-sugar-protein-bar.png",
    calories: 185,
    weight: "50g",

    grade: 2,
    warningAdditive: false,
    keyIngredients: ["말티톨", "대두레시틴"],

    nutrition: {
      calories: 185,
      sugar: 2,
      sodium: 120,
    },
    ingredientsAnalysis: {
      sweeteners: [
        {
          name: "말티톨",
          riskLevel: "GENERAL",
          summary: "당류를 줄이기 위해 사용하는 당알코올입니다.",
        },
      ],
      additives: [
        {
          name: "대두레시틴",
          riskLevel: "GENERAL",
          summary: "원료가 잘 섞이도록 돕는 유화제입니다.",
        },
      ],
    },
  },
];
