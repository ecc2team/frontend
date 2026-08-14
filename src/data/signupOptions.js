export const signupOptions = [
  {
    key: "preferredCategories",
    label: "선호 카테고리",
    options: [
      { label: "음료류", value: "DRINK" },
      { label: "과자류·빵류 또는 떡류", value: "SNACK" },
      {
        label: "코코아가공품류 또는 초콜릿류",
        value: "CHOCOLATE",
      },
    ],
  },
  {
    key: "dislikedIngredients",
    label: "피하고 싶은 성분",
    options: [
      {
        label: "스테비아",
        value: "STEVIA",
        type: "SWEETENER",
        riskLevel: "PREMIUM",
      },
      {
        label: "에리스리톨",
        value: "ERYTHRITOL",
        type: "SUGAR_ALCOHOL",
        riskLevel: "PREMIUM",
      },
      {
        label: "알룰로스",
        value: "ALLULOSE",
        type: "SWEETENER",
        riskLevel: "PREMIUM",
      },
      {
        label: "나한과",
        value: "MONK_FRUIT",
        type: "SWEETENER",
        riskLevel: "PREMIUM",
      },
      {
        label: "수크랄로스",
        value: "SUCRALOSE",
        type: "SWEETENER",
        riskLevel: "GENERAL",
      },
      {
        label: "아세설팜칼륨",
        value: "ACESULFAME_K",
        type: "SWEETENER",
        riskLevel: "GENERAL",
      },
      {
        label: "아스파탐",
        value: "ASPARTAME",
        type: "SWEETENER",
        riskLevel: "GENERAL",
      },
      {
        label: "자일리톨",
        value: "XYLITOL",
        type: "SUGAR_ALCOHOL",
        riskLevel: "GENERAL",
      },
      {
        label: "소르비톨",
        value: "SORBITOL",
        type: "SUGAR_ALCOHOL",
        riskLevel: "GENERAL",
      },
      {
        label: "말티톨",
        value: "MALTITOL",
        type: "SUGAR_ALCOHOL",
        riskLevel: "WARNING",
      },
      {
        label: "포도당",
        value: "GLUCOSE",
        type: "SUGAR",
        riskLevel: "WARNING",
      },
      {
        label: "과당",
        value: "FRUCTOSE",
        type: "SUGAR",
        riskLevel: "WARNING",
      },
      {
        label: "아가베시럽",
        value: "AGAVE_SYRUP",
        type: "SUGAR",
        riskLevel: "WARNING",
      },
      {
        label: "말토덱스트린",
        value: "MALTODEXTRIN",
        type: "STARCH",
        riskLevel: "WARNING",
      },
      {
        label: "타피오카전분",
        value: "TAPIOCA_STARCH",
        type: "STARCH",
        riskLevel: "WARNING",
      },
      {
        label: "카라멜색소",
        value: "CARAMEL_COLOR",
        type: "COLOR",
        riskLevel: "WARNING",
      },
    ],
  },
  {
    key: "allergyFlags",
    label: "알레르기 유발 물질",
    options: [
      { label: "우유", value: "MILK" },
      { label: "계란", value: "EGG" },
      { label: "밀", value: "WHEAT" },
      { label: "대두", value: "SOYBEAN" },
      { label: "땅콩", value: "PEANUT" },
      { label: "아몬드", value: "ALMOND" },
      { label: "호두", value: "WALNUT" },
      { label: "복숭아", value: "PEACH" },
    ],
  },
];

export const mockDuplicates = {
  email: ["zeropick@naver.com", "hello@zeropick.kr"],
  password: [],
  nickname: ["제로픽", "관리자"],
};
