export const signupOptions = [
  {
    key: "preferredCategories",
    label: "선호 카테고리",
    options: [
      { label: "음료수", value: "DRINK" },
      { label: "간식류", value: "SNACK" },
      { label: "냉동식품", value: "FROZEN_FOOD" },
      { label: "소스류", value: "SAUCE" },
      { label: "기타", value: "OTHER" },
    ],
  },
  {
    key: "nutritionPreferences",
    label: "선호 영양 기준",
    options: [
      { label: "제로당", value: "ZERO_SUGAR" },
      { label: "고단백", value: "HIGH_PROTEIN" },
      { label: "저나트륨", value: "LOW_SODIUM" },
      { label: "저칼로리", value: "LOW_CALORIE" },
    ],
  },
  {
    key: "dislikedIngredients",
    label: "피하고 싶은 성분",
    options: [
      { label: "말티톨", value: "MALTITOL" },
      { label: "수크랄로스", value: "SUCRALOSE" },
      { label: "식용색소", value: "FOOD_COLORING" },
      { label: "합성향료", value: "ARTIFICIAL_FLAVOR" },
    ],
  },
  {
    key: "allergyFlags",
    label: "알레르기 유발 물질",
    options: [
      { label: "우유", value: "MILK" },
      { label: "대두", value: "SOY" },
      { label: "계란", value: "EGG" },
      { label: "밀", value: "WHEAT" },
    ],
  },
];

export const mockDuplicates = {
  email: ["zeropick@naver.com", "hello@zeropick.kr"],
  password: [],
  nickname: ["제로픽", "관리자"],
};
