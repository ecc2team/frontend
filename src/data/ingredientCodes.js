export const INGREDIENT_CODE_BY_NAME = {
  스테비아: "STEVIA",
  에리스리톨: "ERYTHRITOL",
  알룰로스: "ALLULOSE",
  나한과: "MONK_FRUIT",
  수크랄로스: "SUCRALOSE",
  아세설팜칼륨: "ACESULFAME_K",
  아스파탐: "ASPARTAME",
  자일리톨: "XYLITOL",
  소르비톨: "SORBITOL",
  말티톨: "MALTITOL",
  포도당: "GLUCOSE",
  과당: "FRUCTOSE",
  아가베시럽: "AGAVE_SYRUP",
  말토덱스트린: "MALTODEXTRIN",
  타피오카전분: "TAPIOCA_STARCH",
  카라멜색소: "CARAMEL_COLOR",
  우유: "MILK",
  계란: "EGG",
  밀: "WHEAT",
  대두: "SOYBEAN",
  땅콩: "PEANUT",
  아몬드: "ALMOND",
  호두: "WALNUT",
  복숭아: "PEACH",
};

export function resolveIngredientCode(value) {
  const normalizedValue = String(value ?? "").trim();

  if (!normalizedValue) return null;
  if (/^[A-Z][A-Z0-9_]*$/.test(normalizedValue)) return normalizedValue;

  return INGREDIENT_CODE_BY_NAME[normalizedValue] ?? null;
}
