export const DEFAULT_CATEGORIES = [
  { id: 1, name: "음료류", code: "DRINK" },
  { id: 2, name: "과자류/디저트", code: "SNACK" },
  { id: 3, name: "아이스크림", code: "CHOCOLATE" },
];

const CATEGORY_CODES = new Set(DEFAULT_CATEGORIES.map(({ code }) => code));
const CATEGORY_NAMES = new Map(
  DEFAULT_CATEGORIES.map(({ code, name }) => [code, name]),
);

export const isSupportedCategoryCode = (code) => CATEGORY_CODES.has(code);

export const selectSupportedCategories = (categories) =>
  categories
    .filter(({ code }) => CATEGORY_CODES.has(code))
    .map((category) => ({
      ...category,
      name: CATEGORY_NAMES.get(category.code),
    }));

export const categoryPath = (code) =>
  `/categories/${encodeURIComponent(code)}`;
