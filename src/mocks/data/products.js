const publicAssetUrl = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const products = [
  {
    productId: 1023,
    productName: "코카콜라 제로",
    score: 54,
    viewCount: 12,
    summary:
      "특별한 감미료 이슈 없이 무난하게 구성되어 있어, 일반적인 수준의 제로 상품입니다.",

    // 검색 결과 화면용 임시 필드
    imageUrl: publicAssetUrl("images/products/coca-cola-zero.png"),
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
      // 감미료
      sweeteners: [
        {
          code: "SUCRALOSE",
          name: "수크랄로스",
          ingredientType: "SWEETENER",
          riskLevel: "GENERAL",
          summary: "일반적으로 사용되는 인공 감미료입니다.",
        },
        {
          code: "ACESULFAME_K",
          name: "아세설팜칼륨",
          ingredientType: "SWEETENER",
          riskLevel: "GENERAL",
          summary: "강한 단맛을 내는 대체 감미료입니다.",
        },
        {
          code: "STEVIOL_GLYCOSIDES",
          name: "스테비올배당체",
          ingredientType: "SWEETENER",
          riskLevel: "SAFE",
          summary: "스테비아에서 유래한 감미료입니다.",
        },
        {
          code: "ASPARTAME",
          name: "아스파탐",
          ingredientType: "SWEETENER",
          riskLevel: "GENERAL",
          summary: "적은 양으로 강한 단맛을 내는 감미료입니다.",
        },
        {
          code: "SACCHARIN",
          name: "사카린",
          ingredientType: "SWEETENER",
          riskLevel: "GENERAL",
          summary: "설탕보다 강한 단맛을 내는 감미료입니다.",
        },
      ],

      // 당알코올
      sugarAlcohols: [
        {
          code: "ERYTHRITOL",
          name: "에리스리톨",
          ingredientType: "SUGAR_ALCOHOL",
          riskLevel: "SAFE",
          summary: "당류 대신 단맛을 내는 당알코올입니다.",
        },
        {
          code: "MALTITOL",
          name: "말티톨",
          ingredientType: "SUGAR_ALCOHOL",
          riskLevel: "GENERAL",
          summary: "당류를 줄이기 위해 사용하는 당알코올입니다.",
        },
        {
          code: "XYLITOL",
          name: "자일리톨",
          ingredientType: "SUGAR_ALCOHOL",
          riskLevel: "GENERAL",
          summary: "단맛을 내기 위해 사용되는 당알코올입니다.",
        },
        {
          code: "SORBITOL",
          name: "소르비톨",
          ingredientType: "SUGAR_ALCOHOL",
          riskLevel: "GENERAL",
          summary: "식품의 단맛과 식감을 조절하는 당알코올입니다.",
        },
      ],

      // 당류
      sugars: [
        {
          code: "ALLULOSE",
          name: "알룰로스",
          ingredientType: "SUGAR",
          riskLevel: "SAFE",
          summary: "설탕과 유사한 단맛을 내는 저감미 당류입니다.",
        },
      ],

      // 전분류
      starches: [],

      // 착색료
      colors: [
        {
          code: "CARAMEL_COLOR",
          name: "카라멜색소",
          ingredientType: "COLOR",
          riskLevel: "WARNING",
          summary: "음료의 갈색을 내기 위해 사용하는 착색료입니다.",
        },
      ],
    },
  },

  {
    productId: 1024,
    productName: "칠성사이다 제로",

    imageUrl: publicAssetUrl("images/products/chilsung-cider-zero.png"),
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
          code: "STEVIOL_GLYCOSIDES",
          name: "스테비올배당체",
          ingredientType: "SWEETENER",
          riskLevel: "SAFE",
          summary: "스테비아에서 유래한 감미료입니다.",
        },
        {
          code: "SUCRALOSE",
          name: "수크랄로스",
          ingredientType: "SWEETENER",
          riskLevel: "GENERAL",
          summary: "적은 양으로 강한 단맛을 내는 감미료입니다.",
        },
        {
          code: "ACESULFAME_K",
          name: "아세설팜칼륨",
          ingredientType: "SWEETENER",
          riskLevel: "GENERAL",
          summary: "단맛을 보완하기 위해 사용되는 감미료입니다.",
        },
        {
          code: "ASPARTAME",
          name: "아스파탐",
          ingredientType: "SWEETENER",
          riskLevel: "GENERAL",
          summary: "강한 단맛을 내는 대체 감미료입니다.",
        },
      ],

      sugarAlcohols: [
        {
          code: "ERYTHRITOL",
          name: "에리스리톨",
          ingredientType: "SUGAR_ALCOHOL",
          riskLevel: "SAFE",
          summary: "당류 대신 단맛을 내는 당알코올입니다.",
        },
        {
          code: "XYLITOL",
          name: "자일리톨",
          ingredientType: "SUGAR_ALCOHOL",
          riskLevel: "GENERAL",
          summary: "단맛을 내기 위해 사용하는 당알코올입니다.",
        },
      ],

      sugars: [
        {
          code: "ALLULOSE",
          name: "알룰로스",
          ingredientType: "SUGAR",
          riskLevel: "SAFE",
          summary: "설탕을 일부 대체하는 저감미 당류입니다.",
        },
      ],

      starches: [],

      colors: [],
    },
  },

  {
    productId: 1025,
    productName: "밀키스 제로",
    imageUrl: null,
    calories: 0,
    weight: "250ml",
    grade: 1,
    warningAdditive: false,
    keyIngredients: ["수크랄로스", "아세설팜칼륨"],
    nutrition: {
      calories: 0,
      sugar: 0,
      sodium: 18,
    },
    ingredientsAnalysis: {
      sweeteners: [
        {
          code: "SUCRALOSE",
          name: "수크랄로스",
          ingredientType: "SWEETENER",
          riskLevel: "GENERAL",
          summary: "안심하고 섭취 가능한 인공감미료입니다.",
        },
        {
          code: "ACESULFAME_K",
          name: "아세설팜칼륨",
          ingredientType: "SWEETENER",
          riskLevel: "GENERAL",
          summary: "안전한 합성 감미료입니다.",
        },
      ],
    },
  },
  {
    productId: 2011,
    productName: "저당 초코 단백질바",

    imageUrl: publicAssetUrl("images/products/low-sugar-protein-bar.png"),
    calories: 185,
    weight: "50g",

    grade: 2,
    warningAdditive: true,
    keyIngredients: ["말티톨", "알룰로스", "변성전분"],

    nutrition: {
      calories: 185,
      sugar: 2,
      sodium: 120,
    },

    ingredientsAnalysis: {
      // 더보기 테스트용 - 6개
      sweeteners: [
        {
          code: "SUCRALOSE",
          name: "수크랄로스",
          ingredientType: "SWEETENER",
          riskLevel: "GENERAL",
          summary: "적은 양으로 강한 단맛을 내는 감미료입니다.",
        },
        {
          code: "ACESULFAME_K",
          name: "아세설팜칼륨",
          ingredientType: "SWEETENER",
          riskLevel: "GENERAL",
          summary: "강한 단맛을 내는 대체 감미료입니다.",
        },
        {
          code: "STEVIOL_GLYCOSIDES",
          name: "스테비올배당체",
          ingredientType: "SWEETENER",
          riskLevel: "SAFE",
          summary: "스테비아에서 유래한 감미료입니다.",
        },
        {
          code: "ASPARTAME",
          name: "아스파탐",
          ingredientType: "SWEETENER",
          riskLevel: "GENERAL",
          summary: "소량으로 단맛을 내는 감미료입니다.",
        },
        {
          code: "SACCHARIN",
          name: "사카린",
          ingredientType: "SWEETENER",
          riskLevel: "GENERAL",
          summary: "강한 단맛을 내는 감미료입니다.",
        },
        {
          code: "NEOTAME",
          name: "네오탐",
          ingredientType: "SWEETENER",
          riskLevel: "GENERAL",
          summary: "적은 양으로 단맛을 내는 감미료입니다.",
        },
      ],

      // 더보기 테스트용 - 5개
      sugarAlcohols: [
        {
          code: "MALTITOL",
          name: "말티톨",
          ingredientType: "SUGAR_ALCOHOL",
          riskLevel: "GENERAL",
          summary: "당류를 줄이기 위해 사용하는 당알코올입니다.",
        },
        {
          code: "ERYTHRITOL",
          name: "에리스리톨",
          ingredientType: "SUGAR_ALCOHOL",
          riskLevel: "SAFE",
          summary: "당류 대신 단맛을 내는 당알코올입니다.",
        },
        {
          code: "XYLITOL",
          name: "자일리톨",
          ingredientType: "SUGAR_ALCOHOL",
          riskLevel: "GENERAL",
          summary: "단맛을 내는 당알코올입니다.",
        },
        {
          code: "SORBITOL",
          name: "소르비톨",
          ingredientType: "SUGAR_ALCOHOL",
          riskLevel: "GENERAL",
          summary: "식품의 단맛과 식감을 조절합니다.",
        },
        {
          code: "ISOMALT",
          name: "이소말트",
          ingredientType: "SUGAR_ALCOHOL",
          riskLevel: "GENERAL",
          summary: "저당 제품에 사용하는 당알코올입니다.",
        },
      ],

      // 더보기 테스트용 - 4개
      sugars: [
        {
          code: "ALLULOSE",
          name: "알룰로스",
          ingredientType: "SUGAR",
          riskLevel: "SAFE",
          summary: "설탕과 유사한 단맛을 내는 저감미 당류입니다.",
        },
        {
          code: "FRUCTOSE",
          name: "과당",
          ingredientType: "SUGAR",
          riskLevel: "GENERAL",
          summary: "과일 등에 자연적으로 존재하는 당류입니다.",
        },
        {
          code: "GLUCOSE",
          name: "포도당",
          ingredientType: "SUGAR",
          riskLevel: "GENERAL",
          summary: "식품에 널리 사용되는 단당류입니다.",
        },
        {
          code: "MALTOSE",
          name: "맥아당",
          ingredientType: "SUGAR",
          riskLevel: "GENERAL",
          summary: "곡물 등에 존재하는 당류입니다.",
        },
      ],

      // 더보기 테스트용 - 4개
      starches: [
        {
          code: "MODIFIED_STARCH",
          name: "변성전분",
          ingredientType: "STARCH",
          riskLevel: "GENERAL",
          summary: "제품의 식감과 점도를 유지하기 위해 사용됩니다.",
        },
        {
          code: "CORN_STARCH",
          name: "옥수수전분",
          ingredientType: "STARCH",
          riskLevel: "SAFE",
          summary: "옥수수에서 얻는 전분입니다.",
        },
        {
          code: "POTATO_STARCH",
          name: "감자전분",
          ingredientType: "STARCH",
          riskLevel: "SAFE",
          summary: "감자에서 얻는 전분입니다.",
        },
        {
          code: "TAPIOCA_STARCH",
          name: "타피오카전분",
          ingredientType: "STARCH",
          riskLevel: "SAFE",
          summary: "카사바에서 얻는 전분입니다.",
        },
      ],

      // 더보기 테스트용 - 5개
      colors: [
        {
          code: "CARAMEL_COLOR",
          name: "카라멜색소",
          ingredientType: "COLOR",
          riskLevel: "WARNING",
          summary: "갈색 계열의 색을 내기 위해 사용하는 착색료입니다.",
        },
        {
          code: "BETA_CAROTENE",
          name: "베타카로틴",
          ingredientType: "COLOR",
          riskLevel: "SAFE",
          summary: "노란색과 주황색 계열을 내는 색소입니다.",
        },
        {
          code: "ANNATTO",
          name: "안나토색소",
          ingredientType: "COLOR",
          riskLevel: "GENERAL",
          summary: "노란색과 주황색을 표현하는 착색료입니다.",
        },
        {
          code: "BEET_RED",
          name: "비트레드",
          ingredientType: "COLOR",
          riskLevel: "SAFE",
          summary: "붉은 계열의 색을 표현하는 착색료입니다.",
        },
        {
          code: "GARDENIA_YELLOW",
          name: "치자황색소",
          ingredientType: "COLOR",
          riskLevel: "GENERAL",
          summary: "노란색 계열을 표현하기 위해 사용하는 착색료입니다.",
        },
      ],
    },
  },
];
